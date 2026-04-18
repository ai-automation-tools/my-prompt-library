import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import archiver from 'archiver';

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

const packsDir = path.join(process.cwd(), 'library/3_Skills/packs');

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
    const fullPath = path.join(process.cwd(), skillPath);
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
      
      return res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching packs:', error);
      return res.status(500).json({ error: 'Failed to fetch skill packs' });
    }
  }
  
  // GET /api/skill-packs/:packId - Get specific pack
  const packIdMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)$/);
  if (method === 'GET' && packIdMatch) {
    try {
      const packId = packIdMatch[1];
      
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
      const packId = downloadMatch[1];
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
        const skillPath = path.join(process.cwd(), skill.path);
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
