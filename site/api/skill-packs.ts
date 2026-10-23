import type { VercelRequest, VercelResponse } from '../lib/vercel-types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import archiver from 'archiver';
import { myLibrary, READ_ONLY } from '../lib/my-library.js';
import { carriedFrontmatter } from '../lib/library.js';

// Recursively get all files in a directory
async function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> {
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
}

// App root. Resolve from this file, not process.cwd(): on Vercel the function
// runs with cwd=/var/task while the app (Root Directory = site) is bundled at
// /var/task/site, so cwd-based paths miss library/ entirely.
const APP_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const packsDir = path.join(APP_ROOT, 'library/3_Skills/packs');


// A pack is "in My Library" while any of its skills are: add-to-library tags
// every skill it copies, so the tag is the install record.
const installTag = (packId: string) => `skill-pack:${packId}`;

const READ_ONLY_ERROR = { error: 'This copy of the library is read-only. Clone the repo to keep your own prompts.' };


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
export async function getAllPacks(): Promise<any[]> {
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
    const fullPath = path.join(APP_ROOT, skillPath);
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const urlPath = new URL(url!, `http://${req.headers.host}`).pathname;
  
  // GET /api/skill-packs - List all packs
  if (method === 'GET' && urlPath === '/api/skill-packs') {
    try {
      const packs = await getAllPacks();
      const libraryMode = (req.query.library as string) || 'public';
      let filtered = packs;

      if (libraryMode === 'my' && READ_ONLY) {
        filtered = [];
      } else if (libraryMode === 'my') {
        const tags = new Set(myLibrary.list().flatMap(p => p.tags));
        filtered = packs.filter(pack => tags.has(installTag(pack.id)));
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
      
      return res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching packs:', error);
      return res.status(500).json({ error: 'Failed to fetch skill packs' });
    }
  }
  

  const addMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)\/add-to-library$/);
  if (method === 'POST' && addMatch) {
    try {
      if (READ_ONLY) return res.status(403).json(READ_ONLY_ERROR);
      if (req.body?.confirm !== true) {
        return res.status(400).json({ error: 'Explicit confirmation required' });
      }

      const packId = decodeURIComponent(addMatch[1]);

      const packs = await getAllPacks();
      const pack = packs.find(p => p.id === packId);
      if (!pack) return res.status(404).json({ error: 'Pack not found' });

      const existing = myLibrary.list();
      const existingKeys = new Set(existing.map(p => `${p.title}::${p.section}::${p.category}`));

      let added = 0;
      let skipped = 0;
      for (const skill of pack.skills) {
        const fullPath = path.join(APP_ROOT, skill.path);
        const raw = await fs.readFile(fullPath, 'utf-8');
        const { data, content } = matter(raw);

        const title = data.name || data.title || skill.name || path.basename(fullPath, '.md');
        const section = '3_Skills';
        const category = data.category || pack.category || 'Skill Packs';
        const subcategory = data.subcategory || pack.name;
        const tags = Array.isArray(data.tags) ? data.tags : (Array.isArray(pack.tags) ? pack.tags : []);
        const tag = installTag(pack.id);
        const tagsWithInstall = tags.includes(tag) ? tags : [...tags, tag];

        const dedupeKey = `${title}::${section}::${category}`;
        if (existingKeys.has(dedupeKey)) {
          skipped++;
          continue;
        }

        myLibrary.create({ title, section, category, subcategory, tags: tagsWithInstall, content, extra: carriedFrontmatter(data) });
        existingKeys.add(dedupeKey);
        added++;
      }

      return res.status(200).json({
        message: `Added ${added} skill${added === 1 ? '' : 's'} from ${pack.name}${skipped > 0 ? ` (${skipped} skipped)` : ''}`,
        added,
        skipped,
        packId,
      });
    } catch (error) {
      console.error('Error adding pack to library:', error);
      return res.status(500).json({ error: 'Failed to add pack to library' });
    }
  }

  const removeMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)\/remove-from-library$/);
  if (method === 'DELETE' && removeMatch) {
    try {
      if (READ_ONLY) return res.status(403).json(READ_ONLY_ERROR);
      if (req.body?.confirm !== true) {
        return res.status(400).json({ error: 'Explicit confirmation required' });
      }
      const packId = decodeURIComponent(removeMatch[1]);

      const packPrompts = myLibrary.list().filter(p => p.section === '3_Skills' && p.tags.includes(installTag(packId)));

      let removed = 0;
      for (const prompt of packPrompts) {
        if (myLibrary.delete(prompt.id)) removed++;
      }

      return res.status(200).json({
        message: `Removed ${removed} skill${removed === 1 ? '' : 's'} from My Library`,
        removed,
        packId,
      });
    } catch (error) {
      console.error('Error removing pack from library:', error);
      return res.status(500).json({ error: 'Failed to remove pack from library' });
    }
  }

  // GET /api/skill-packs/:packId - Get specific pack
  const packIdMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)$/);
  if (method === 'GET' && packIdMatch) {
    try {
      const packId = decodeURIComponent(packIdMatch[1]);
      
      // Check if it's the download endpoint
      if (packId.endsWith('/download')) {
        return res.status(404).json({ error: 'Invalid endpoint format' });
      }
      
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
      return res.status(200).json({
        ...pack,
        skills: skillsWithData.filter(s => s.metadata !== null)
      });
    } catch (error) {
      console.error('Error fetching pack:', error);
      return res.status(500).json({ error: 'Failed to fetch pack details' });
    }
  }
  
  // GET /api/skill-packs/:packId/download - Download pack as ZIP
  const downloadMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)\/download$/);
  if (method === 'GET' && downloadMatch) {
    try {
      const packId = decodeURIComponent(downloadMatch[1]);
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
      
      // Handle errors
      archive.on('error', (err) => {
        console.error('Archive error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to create archive' });
        }
      });
      
      // Pipe archive to response
      archive.pipe(res);
      
      // Track total files added
      let totalFilesAdded = 0;
      
      // Add each skill's entire directory to the ZIP
      for (const skill of pack.skills) {
        const skillPath = path.join(APP_ROOT, skill.path);
        const skillDir = path.dirname(skillPath);
        const skillDirName = path.basename(skillDir);
        
        console.log(`Processing skill: ${skillDirName} (${skill.path})`);
        console.log(`  Skill directory: ${skillDir}`);
        
        try {
          // Check if directory exists
          try {
            await fs.access(skillDir);
          } catch (accessErr) {
            console.error(`  Cannot access ${skillDir}:`, accessErr);
            continue;
          }
          
          // Check if it's a directory (should be for skills)
          const stats = await fs.stat(skillDir);
          
          if (stats.isDirectory()) {
            // Read all files in the skill directory recursively
            const allFiles = await getAllFiles(skillDir);
            
            console.log(`  Found ${allFiles.length} files in ${skillDirName}`);
            
            if (allFiles.length === 0) {
              console.warn(`  Warning: No files found in ${skillDir}`);
            }
            
            for (const filePath of allFiles) {
              const relativePath = path.relative(skillDir, filePath);
              const archivePath = path.join(skillDirName, relativePath);
              archive.file(filePath, { name: archivePath });
              totalFilesAdded++;
            }
          } else {
            // If it's just a file, add the file
            const archivePath = path.join(skillDirName, path.basename(skillPath));
            archive.file(skillPath, { name: archivePath });
            totalFilesAdded++;
          }
        } catch (err) {
          console.error(`Error processing skill ${skill.path}:`, err);
          // Continue with other skills even if one fails
        }
      }
      
      console.log(`Total files added to archive: ${totalFilesAdded}`);
      
      // Add pack manifest JSON
      const packFiles = await getAllPackFiles(packsDir);
      const packManifestPath = packFiles.find(file => path.basename(file) === `${packId}.json`);
      if (packManifestPath) {
        console.log(`Adding manifest: ${packManifestPath}`);
        archive.file(packManifestPath, { name: `${packId}.json` });
      }
      
      // Finalize archive (must be called after all files are added)
      console.log('Finalizing archive...');
      await archive.finalize();
      console.log(`Archive finalized. Total bytes: ${archive.pointer()}`);
      
      return;
    } catch (error) {
      console.error('Error creating pack download:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Failed to create pack download' });
      }
    }
  }
  
  return res.status(404).json({ error: 'Not found' });
}
