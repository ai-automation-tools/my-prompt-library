import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packsDir = path.join(__dirname, '../library/Skills/packs');

// Helper to read all pack files
async function getAllPacks() {
  try {
    const files = await fs.readdir(packsDir);
    const packFiles = files.filter(f => f.endsWith('.json') && f !== 'package.json');
    
    const packs = await Promise.all(
      packFiles.map(async (file) => {
        const content = await fs.readFile(path.join(packsDir, file), 'utf-8');
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
router.get('/', async (req, res) => {
  try {
    const packs = await getAllPacks();
    
    // Return summary info (without full skill details)
    const summary = packs.map(pack => ({
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

export default router;
