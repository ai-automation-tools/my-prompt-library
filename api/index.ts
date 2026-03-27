import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { dirname } from "path";
import archiver from "archiver";
import authRoutes from "../routes/auth.js";
import { optionalAuth, authenticate } from "../middleware/auth.js";
import { promptDb, initializeSchema } from "../db/postgres.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app
const app = express();
app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Simple in-memory cache for prompt listings
let promptsCache: { data: any[], timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const isCacheValid = () => {
  return promptsCache && (Date.now() - promptsCache.timestamp < CACHE_TTL);
};

// Load prebuilt index if available (for faster cold starts)
let prebuiltIndex: any = null;
try {
  const indexPath = path.join(__dirname, 'prompt-index.json');
  if (fs.existsSync(indexPath)) {
    prebuiltIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    console.log(`[INDEX] Loaded prebuilt index with ${prebuiltIndex.promptCount} prompts (built: ${prebuiltIndex.buildTime})`);
  }
} catch (err) {
  console.warn('[INDEX] Failed to load prebuilt index:', err);
}

// Helper function to generate safe filename
const generateFilename = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '.md';
};

// Helper function to create directory if it doesn't exist
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Library path resolution
const getLibraryPath = () => {
  // In production (Vercel), library is at the root
  if (process.env.VERCEL) {
    return path.join(process.cwd(), 'library');
  }
  // In development, go up from api/ to repo root
  return path.join(__dirname, '..', 'library');
};

const LIBRARY_PATH = getLibraryPath();

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const USE_GITHUB_MODE = process.env.USE_GITHUB_MODE === 'true';

const isGitHubConfigured = () => {
  return USE_GITHUB_MODE && GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO;
};

const githubHeaders = GITHUB_TOKEN ? {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
} : {};

// Helper to extract first heading from markdown
const extractFirstHeading = (content: string): string | null => {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : null;
};

// API to list all prompts (with optional lightweight mode)
app.get("/api/prompts", optionalAuth, async (req, res) => {
  const libraryMode = req.query.library as string;
  const lightweight = req.query.lightweight === 'true'; // Only return metadata, not full content
  
  if (libraryMode === 'my') {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required for My Library' });
    }
    
    const userPrompts = await promptDb.findByUserId(req.user.id);
    
    const formattedPrompts = userPrompts.map(p => ({
      id: p.id,
      title: p.title,
      section: p.section,
      category: p.category,
      subcategory: p.subcategory,
      tags: p.tags,
      content: lightweight ? p.content.substring(0, 200) : p.content, // Truncate in lightweight mode
      lastModified: p.updated_at,
      isUserOwned: true,
    }));
    
    return res.json(formattedPrompts);
  }

  // Check cache for public library lightweight requests
  if (libraryMode === 'public' && lightweight && isCacheValid()) {
    console.log('[CACHE HIT] Returning cached prompts');
    return res.json(promptsCache!.data);
  }

  // Use prebuilt index for lightweight public library requests
  if (libraryMode === 'public' && lightweight && prebuiltIndex) {
    console.log('[INDEX] Using prebuilt index for lightweight request');
    const indexedPrompts = prebuiltIndex.prompts.map((p: any) => ({
      ...p,
      content: p.contentPreview, // Use preview for lightweight mode
    }));
    
    // Cache it for subsequent requests
    promptsCache = { data: indexedPrompts, timestamp: Date.now() };
    
    return res.json(indexedPrompts);
  }

  try {
    if (isGitHubConfigured()) {
      // GitHub mode implementation
      const branchResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${encodeURIComponent(GITHUB_BRANCH)}`,
        { headers: githubHeaders }
      );
      
      if (!branchResponse.ok) {
        throw new Error(`GitHub API error: ${branchResponse.statusText}`);
      }

      const branchData: any = await branchResponse.json();
      const commitSha = branchData.object.sha;

      const treeResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${commitSha}?recursive=1`,
        { headers: githubHeaders }
      );

      if (!treeResponse.ok) {
        throw new Error(`GitHub tree error: ${treeResponse.statusText}`);
      }

      const treeData: any = await treeResponse.json();
      const mdFiles = treeData.tree.filter((item: any) => {
        if (item.type !== 'blob' || !item.path.startsWith('library/') || !item.path.endsWith('.md')) {
          return false;
        }
        
        // For Skills section, only include SKILL.md files
        if (item.path.startsWith('library/Skills/')) {
          return item.path.endsWith('/SKILL.md');
        }
        
        return true;
      });

      const prompts = await Promise.all(
        mdFiles.map(async (file: any) => {
          const contentResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file.path}?ref=${GITHUB_BRANCH}`,
            { headers: githubHeaders }
          );
          
          if (!contentResponse.ok) return null;
          
          const contentData: any = await contentResponse.json();
          const rawContent = Buffer.from(contentData.content, 'base64').toString('utf-8');
          const { data, content } = matter(rawContent);
          
          const pathParts = file.path.replace('library/', '').replace('.md', '').split('/');
          const section = pathParts[0] || 'General';
          const category = pathParts[1] || 'Uncategorized';
          const subcategory = pathParts.length > 2 ? pathParts[2] : null;
          
          // For Skills, use 'name' field instead of 'title'
          const isSkill = section === 'Skills';
          const title = isSkill
            ? (data.name || extractFirstHeading(content) || path.basename(file.path, '.md'))
            : (data.title || extractFirstHeading(content) || path.basename(file.path, '.md'));
          
          return {
            id: file.path,
            title: title,
            section,
            category,
            subcategory,
            tags: data.tags || [],
            content: lightweight ? content.substring(0, 200) : content,  // Truncate in lightweight mode
            lastModified: contentData.sha,
            isUserOwned: false,
          };
        })
      );

      res.json(prompts.filter(Boolean));
    } else {
      // Local filesystem mode
      const walkDir = (dir: string, baseDir: string = LIBRARY_PATH): any[] => {
        if (!fs.existsSync(dir)) return [];
        
        let results: any[] = [];
        const list = fs.readdirSync(dir);
        
        list.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            results = results.concat(walkDir(filePath, baseDir));
          } else if (file.endsWith('.md')) {
            const relativePath = path.relative(baseDir, filePath);
            
            // For Skills section, only include SKILL.md files
            if (relativePath.startsWith('Skills' + path.sep)) {
              if (!file.endsWith('SKILL.md')) {
                return; // Skip non-SKILL.md files in Skills section
              }
            }
            
            // Skip files larger than 500KB (likely bulk collections, not individual prompts)
            if (stat.size > 500 * 1024) {
              console.log(`[SKIP] Large file: ${relativePath} (${(stat.size / 1024).toFixed(0)}KB)`);
              return;
            }
            
            const rawContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(rawContent);
            const pathParts = relativePath.replace('.md', '').split(path.sep);
            
            const section = pathParts[0] || 'General';
            const category = pathParts[1] || 'Uncategorized';
            const subcategory = pathParts.length > 2 ? pathParts[2] : null;
            
            // For Skills, use 'name' field instead of 'title'
            const isSkill = section === 'Skills';
            const title = isSkill
              ? (data.name || extractFirstHeading(content) || path.basename(file, '.md'))
              : (data.title || extractFirstHeading(content) || path.basename(file, '.md'));
            
            results.push({
              id: relativePath,
              title: title,
              section,
              category,
              subcategory,
              tags: data.tags || [],
              content: lightweight ? content.substring(0, 200) : content,  // Truncate in lightweight mode
              lastModified: stat.mtime.toISOString(),
              isUserOwned: false,
            });
          }
        });
        
        return results;
      };

      const prompts = walkDir(LIBRARY_PATH);
      
      // Cache lightweight public library requests
      if (libraryMode === 'public' && lightweight) {
        promptsCache = { data: prompts, timestamp: Date.now() };
        console.log('[CACHE SET] Cached', prompts.length, 'prompts');
      }
      
      res.json(prompts);
    }
  } catch (error: any) {
    console.error("Error listing prompts:", error);
    res.json([]);
  }
});

// Get single prompt with full content
app.get("/api/prompts/:id", optionalAuth, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);
    
    // Check if it's a user-owned prompt (database ID)
    if (req.user && !promptId.includes('/')) {
      const prompt = await promptDb.findById(promptId, req.user.id);
      if (prompt) {
        return res.json({
          id: prompt.id,
          title: prompt.title,
          section: prompt.section,
          category: prompt.category,
          subcategory: prompt.subcategory,
          tags: prompt.tags,
          content: prompt.content,
          lastModified: prompt.updated_at,
          isUserOwned: true,
        });
      }
    }
    
    // Otherwise, it's a file path in the library
    if (isGitHubConfigured()) {
      // GitHub mode
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${promptId}?ref=${GITHUB_BRANCH}`,
        { headers: githubHeaders }
      );
      
      if (!response.ok) {
        return res.status(404).json({ error: 'Prompt not found' });
      }
      
      const data: any = await response.json();
      const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
      const { data: frontmatter, content } = matter(rawContent);
      
      const pathParts = promptId.replace('library/', '').replace('.md', '').split('/');
      const section = pathParts[0] || 'General';
      const category = pathParts[1] || 'Uncategorized';
      const subcategory = pathParts.length > 2 ? pathParts[2] : null;
      
      return res.json({
        id: promptId,
        title: frontmatter.title || extractFirstHeading(content) || path.basename(promptId, '.md'),
        section,
        category,
        subcategory,
        tags: frontmatter.tags || [],
        content,
        lastModified: data.sha,
        isUserOwned: false,
      });
    } else {
      // Local filesystem mode
      const filePath = path.join(LIBRARY_PATH, promptId);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Prompt not found' });
      }
      
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(rawContent);
      const stat = fs.statSync(filePath);
      
      const pathParts = promptId.replace('.md', '').split(path.sep);
      const section = pathParts[0] || 'General';
      const category = pathParts[1] || 'Uncategorized';
      const subcategory = pathParts.length > 2 ? pathParts[2] : null;
      
      return res.json({
        id: promptId,
        title: frontmatter.title || extractFirstHeading(content) || path.basename(promptId, '.md'),
        section,
        category,
        subcategory,
        tags: frontmatter.tags || [],
        content,
        lastModified: stat.mtime.toISOString(),
        isUserOwned: false,
      });
    }
  } catch (error: any) {
    console.error("Error fetching prompt:", error);
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

// Create prompt
app.post("/api/prompts", authenticate, async (req, res) => {
  try {
    const { title, section, category, subcategory, tags, content } = req.body;

    if (!title || !section || !category || !content) {
      return res.status(400).json({ error: "Missing required fields: title, section, category, content" });
    }

    const prompt = await promptDb.create(req.user!.id, {
      title,
      section,
      category,
      subcategory: subcategory || null,
      tags: tags || [],
      content,
    });

    res.json({
      id: prompt.id,
      title: prompt.title,
      section: prompt.section,
      category: prompt.category,
      subcategory: prompt.subcategory,
      tags: prompt.tags,
      content: prompt.content,
      lastModified: prompt.updated_at,
      isUserOwned: true,
      message: "Prompt created successfully"
    });
  } catch (error: any) {
    console.error("Error creating prompt:", error);
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// Update prompt
app.put("/api/prompts/:id", authenticate, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);
    const { title, tags, content, category, subcategory, section } = req.body;

    const prompt = await promptDb.update(promptId, req.user!.id, {
      title,
      tags,
      content,
      category,
      subcategory,
      section,
    });

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found or unauthorized" });
    }

    res.json({
      id: prompt.id,
      title: prompt.title,
      section: prompt.section,
      category: prompt.category,
      subcategory: prompt.subcategory,
      tags: prompt.tags,
      content: prompt.content,
      lastModified: prompt.updated_at,
      isUserOwned: true,
      message: "Prompt updated successfully"
    });
  } catch (error) {
    console.error("Error updating prompt:", error);
    res.status(500).json({ error: "Failed to update prompt" });
  }
});

// Delete prompt
app.delete("/api/prompts/:id", authenticate, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);

    const deleted = await promptDb.delete(promptId, req.user!.id);

    if (!deleted) {
      return res.status(404).json({ error: "Prompt not found or unauthorized" });
    }

    res.json({
      message: "Prompt deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    res.status(500).json({ error: "Failed to delete prompt" });
  }
});

// Copy from public library
app.post("/api/prompts/:path(*)/copy-to-my-prompts", authenticate, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.path);
    
    // Read from filesystem or GitHub
    let content: string;
    let data: any;
    
    if (isGitHubConfigured()) {
      const contentResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/library/${promptId}?ref=${GITHUB_BRANCH}`,
        { headers: githubHeaders }
      );
      
      if (!contentResponse.ok) {
        return res.status(404).json({ error: "Prompt not found in public library" });
      }
      
      const contentData: any = await contentResponse.json();
      const rawContent = Buffer.from(contentData.content, 'base64').toString('utf-8');
      const parsed = matter(rawContent);
      data = parsed.data;
      content = parsed.content;  // Use parsed content (without frontmatter)
    } else {
      const promptPath = path.join(LIBRARY_PATH, promptId);
      
      if (!fs.existsSync(promptPath)) {
        return res.status(404).json({ error: "Prompt not found in public library" });
      }
      
      const rawContent = fs.readFileSync(promptPath, 'utf-8');
      const parsed = matter(rawContent);
      data = parsed.data;
      content = parsed.content;  // Use parsed content (without frontmatter)
    }

    const pathParts = promptId.replace('.md', '').split('/');
    const section = pathParts[0] || 'General';
    const category = pathParts[1] || 'Uncategorized';
    const subcategory = pathParts.length > 2 ? pathParts[2] : null;
    
    // For Skills, use 'name' field instead of 'title'
    const isSkill = section === 'Skills';
    const title = isSkill
      ? (data.name || extractFirstHeading(content) || path.basename(promptId, ".md"))
      : (data.title || extractFirstHeading(content) || path.basename(promptId, ".md"));

    const copiedPrompt = await promptDb.copyFromPublic(req.user!.id, {
      title,
      section,
      category,
      subcategory,
      tags: data.tags || [],
      content,
    });

    return res.json({
      id: copiedPrompt.id,
      title: copiedPrompt.title,
      section: copiedPrompt.section,
      category: copiedPrompt.category,
      subcategory: copiedPrompt.subcategory,
      tags: copiedPrompt.tags,
      content: copiedPrompt.content,
      lastModified: copiedPrompt.updated_at,
      isUserOwned: true,
      message: "Prompt copied to My Library"
    });
  } catch (error: any) {
    console.error("Error copying prompt to My Library:", error);
    return res.status(500).json({ error: error.message || "Failed to copy prompt to My Library" });
  }
});

// Download skill as zip
app.get("/api/skills/download/:skillPath(*)", async (req, res) => {
  try {
    const skillPath = decodeURIComponent(req.params.skillPath).replace(/\\/g, '/');
    
    // Validate that this is a Skills directory
    if (!skillPath.startsWith('Skills/')) {
      return res.status(400).json({ error: "Invalid skill path. Must be under Skills/ directory." });
    }

    // Check if using GitHub or filesystem
    if (isGitHubConfigured()) {
      // For GitHub mode, we need to fetch all files in the directory
      const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/library/${skillPath}?ref=${GITHUB_BRANCH}`;
      const response = await fetch(apiUrl, { headers: githubHeaders });
      
      if (!response.ok) {
        return res.status(404).json({ error: "Skill directory not found" });
      }

      const files: any[] = await response.json();
      
      if (!Array.isArray(files)) {
        return res.status(400).json({ error: "Path must be a directory" });
      }

      // Get the skill directory name for the zip filename
      const skillDirName = path.basename(skillPath);
      const zipFilename = `${skillDirName}.zip`;

      // Set headers for download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

      // Create archive
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.on('error', (err) => {
        console.error('Archive error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to create archive' });
        }
      });

      archive.pipe(res);

      // Recursively fetch and add files from GitHub
      async function addFilesFromGitHub(dirPath: string, archivePath: string = '') {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/library/${dirPath}?ref=${GITHUB_BRANCH}`;
        const resp = await fetch(url, { headers: githubHeaders });
        
        if (!resp.ok) return;
        
        const items: any[] = await resp.json();
        
        for (const item of items) {
          if (item.type === 'file') {
            // Fetch file content
            const fileResp = await fetch(item.download_url);
            const fileContent = await fileResp.text();
            const fileName = archivePath ? `${archivePath}/${item.name}` : item.name;
            archive.append(fileContent, { name: fileName });
          } else if (item.type === 'dir') {
            const subPath = item.path.replace('library/', '');
            const newArchivePath = archivePath ? `${archivePath}/${item.name}` : item.name;
            await addFilesFromGitHub(subPath, newArchivePath);
          }
        }
      }

      await addFilesFromGitHub(skillPath);
      await archive.finalize();

    } else {
      // Filesystem mode (local development)
      const fullPath = path.join(LIBRARY_PATH, skillPath);
      
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "Skill directory not found" });
      }

      const stats = fs.statSync(fullPath);
      if (!stats.isDirectory()) {
        return res.status(400).json({ error: "Path must be a directory" });
      }

      const skillDirName = path.basename(fullPath);
      const zipFilename = `${skillDirName}.zip`;

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.on('error', (err) => {
        console.error('Archive error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to create archive' });
        }
      });

      archive.pipe(res);
      archive.directory(fullPath, false);
      await archive.finalize();
    }

  } catch (error: any) {
    console.error("Error creating skill download:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Failed to create download" });
    }
  }
});

// Initialize database on cold start
let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await initializeSchema();
    initialized = true;
  }
  
  return app(req, res);
}
