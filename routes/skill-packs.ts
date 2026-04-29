import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import archiver from 'archiver';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { promptDb, userSkillPackDb } from '../db/postgres.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packsDir = path.join(__dirname, '../library/3_Skills/packs');

async function getAllPackFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return getAllPackFiles(fullPath);
    }
    return entry.name.endsWith('.json') && entry.name !== 'package.json' ? [fullPath] : [];
  }));
  return files.flat();
}

// Helper to read all pack files
async function getAllPacks() {
  try {
    const packFiles = await getAllPackFiles(packsDir);
    
    const packs = await Promise.all(
      packFiles.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      })
    );
    
    return packs;
  } catch (error) {
    console.error('Error reading packs:', error);
    return [];
  }
}

// Helper to resolve skill paths and read skill metadata
async function resolveSkillData(skillPath: string) {
  try {
    const fullPath = path.join(__dirname, '..', skillPath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const { data } = matter(content);
    
    return {
      path: skillPath,
      name: data.name || data.title || 'Unnamed Skill',
      description: data.description || '',
      tags: data.tags || [],
      category: data.category || '',
      subcategory: data.subcategory || ''
    };
  } catch (error) {
    console.error(`Error reading skill at ${skillPath}:`, error);
    return null;
  }
}

// GET /api/skill-packs - List all packs
router.get('/', optionalAuth, async (req, res) => {
  try {
    const packs = await getAllPacks();
    const libraryMode = req.query.library as string | undefined;

    let filtered = packs;
    if (libraryMode === 'my') {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required for My Library' });
      }
      const installed = await userSkillPackDb.listByUserId(req.user.id);
      const installedIds = new Set(installed.map(i => i.pack_id));
      filtered = packs.filter(pack => installedIds.has(pack.id));
    }
    
    const summary = filtered.map(pack => ({
      id: pack.id,
      name: pack.name,
      description: pack.description,
      icon: pack.icon,
      version: pack.version,
      tags: pack.tags,
      category: pack.category,
      skillCount: pack.skills.length,
      author: pack.author,
      created_at: pack.created_at,
      updated_at: pack.updated_at
    }));
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching packs:', error);
    res.status(500).json({ error: 'Failed to fetch skill packs' });
  }
});

// GET /api/skill-packs/:packId - Get specific pack with full details
router.get('/:packId', async (req, res) => {
  try {
    const { packId } = req.params;
    const packs = await getAllPacks();
    
    const pack = packs.find(p => p.id === packId);
    
    if (!pack) {
      return res.status(404).json({ error: 'Pack not found' });
    }
    
    // Resolve skill metadata for each skill in the pack
    const skillsWithData = await Promise.all(
      pack.skills.map(async (skill: any) => {
        const skillData = await resolveSkillData(skill.path);
        return {
          ...skill,
          metadata: skillData
        };
      })
    );
    
    // Return full pack with resolved skill data
    res.json({
      ...pack,
      skills: skillsWithData.filter(s => s.metadata !== null)
    });
  } catch (error) {
    console.error('Error fetching pack:', error);
    res.status(500).json({ error: 'Failed to fetch pack details' });
  }
});


// POST /api/skill-packs/:packId/add-to-library - Copy all skills in a pack to user's library
router.post('/:packId/add-to-library', authenticate, async (req, res) => {
  try {
    if (req.body?.confirm !== true) {
      return res.status(400).json({ error: 'Explicit confirmation required' });
    }

    const { packId } = req.params;
    const packs = await getAllPacks();
    const pack = packs.find(p => p.id === packId);

    if (!pack) {
      return res.status(404).json({ error: 'Pack not found' });
    }

    const existing = await promptDb.findByUserId(req.user!.id);
    const existingKeys = new Set(existing.map(p => `${p.title}::${p.section}::${p.category}`));

    let added = 0;
    let skipped = 0;

    for (const skill of pack.skills) {
      const fullPath = path.join(__dirname, '..', skill.path);
      const raw = await fs.readFile(fullPath, 'utf-8');
      const { data, content } = matter(raw);

      const title = data.name || data.title || skill.name || path.basename(fullPath, '.md');
      const section = '3_Skills';
      const category = data.category || pack.category || 'Skill Packs';
      const subcategory = data.subcategory || pack.name;
      const tags = Array.isArray(data.tags) ? data.tags : (Array.isArray(pack.tags) ? pack.tags : []);
      const installTag = `skill-pack:${pack.id}`;
      const tagsWithInstall = tags.includes(installTag) ? tags : [...tags, installTag];

      const dedupeKey = `${title}::${section}::${category}`;
      if (existingKeys.has(dedupeKey)) {
        skipped++;
        continue;
      }

      await promptDb.copyFromPublic(req.user!.id, {
        title,
        section,
        category,
        subcategory,
        tags: tagsWithInstall,
        content,
      });

      existingKeys.add(dedupeKey);
      added++;
    }

    await userSkillPackDb.add(req.user!.id, pack.id);

    return res.json({
      message: `Added ${added} skill${added === 1 ? '' : 's'} from ${pack.name}${skipped > 0 ? ` (${skipped} skipped)` : ''}`,
      added,
      skipped,
      packId,
    });
  } catch (error) {
    console.error('Error adding pack to library:', error);
    return res.status(500).json({ error: 'Failed to add pack to library' });
  }
});

// DELETE /api/skill-packs/:packId/remove-from-library - Remove all pack skills from user's library
router.delete('/:packId/remove-from-library', authenticate, async (req, res) => {
  try {
    if (req.body?.confirm !== true) {
      return res.status(400).json({ error: 'Explicit confirmation required' });
    }

    const { packId } = req.params;
    const installTag = `skill-pack:${packId}`;
    const userPrompts = await promptDb.findByUserId(req.user!.id);
    const packPrompts = userPrompts.filter(
      p => p.section === '3_Skills' && Array.isArray(p.tags) && p.tags.includes(installTag)
    );

    let removed = 0;
    for (const prompt of packPrompts) {
      const ok = await promptDb.delete(prompt.id, req.user!.id);
      if (ok) removed++;
    }

    await userSkillPackDb.remove(req.user!.id, packId);

    return res.json({
      message: `Removed ${removed} skill${removed === 1 ? '' : 's'} from My Library`,
      removed,
      packId,
    });
  } catch (error) {
    console.error('Error removing pack from library:', error);
    return res.status(500).json({ error: 'Failed to remove pack from library' });
  }
});

// GET /api/skill-packs/:packId/stats - Get pack statistics
router.get('/:packId/stats', async (req, res) => {
  try {
    const { packId } = req.params;
    const packs = await getAllPacks();
    
    const pack = packs.find(p => p.id === packId);
    
    if (!pack) {
      return res.status(404).json({ error: 'Pack not found' });
    }
    
    // For now, return static stats
    // In future, track from database
    res.json({
      id: pack.id,
      name: pack.name,
      installCount: 0, // TODO: Track in database
      skillCount: pack.skills.length,
      created_at: pack.created_at,
      updated_at: pack.updated_at
    });
  } catch (error) {
    console.error('Error fetching pack stats:', error);
    res.status(500).json({ error: 'Failed to fetch pack statistics' });
  }
});

// GET /api/skill-packs/:packId/download - Download pack as ZIP
router.get('/:packId/download', async (req, res) => {
  try {
    const { packId } = req.params;
    const packs = await getAllPacks();
    
    const pack = packs.find(p => p.id === packId);
    
    if (!pack) {
      return res.status(404).json({ error: 'Pack not found' });
    }
    
    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${packId}.zip"`);
    
    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Pipe archive to response
    archive.pipe(res);
    
    // Add each skill's entire directory to the ZIP
    for (const skill of pack.skills) {
      const skillPath = path.join(__dirname, '..', skill.path);
      const skillDir = path.dirname(skillPath);
      const skillDirName = path.basename(skillDir);
      
      try {
        // Check if it's a directory (should be for skills)
        const stats = await fs.stat(skillDir);
        
        if (stats.isDirectory()) {
          // Add entire skill directory with all files
          archive.directory(skillDir, skillDirName);
        } else {
          // If it's just a file, add the file
          archive.file(skillPath, { name: path.basename(skillPath) });
        }
      } catch (err) {
        console.error(`Error adding skill ${skill.path}:`, err);
        // Continue with other skills even if one fails
      }
    }
    
    // Add pack manifest JSON
    const packFiles = await getAllPackFiles(packsDir);
    const packManifestPath = packFiles.find(file => path.basename(file) === `${packId}.json`);
    if (packManifestPath) {
      archive.file(packManifestPath, { name: `${packId}.json` });
    }
    
    // Finalize archive
    await archive.finalize();
    
  } catch (error) {
    console.error('Error creating pack download:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create pack download' });
    }
  }
});

export default router;
