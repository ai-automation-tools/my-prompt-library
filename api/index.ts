import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { dirname } from "path";
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

// API to list all prompts
app.get("/api/prompts", optionalAuth, async (req, res) => {
  const libraryMode = req.query.library as string;
  
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
      content: p.content,
      lastModified: p.updated_at,
      isUserOwned: true,
    }));
    
    return res.json(formattedPrompts);
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
      const mdFiles = treeData.tree.filter((item: any) => 
        item.type === 'blob' && 
        item.path.startsWith('library/') && 
        item.path.endsWith('.md')
      );

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
          
          return {
            id: file.path,
            title: data.title || extractFirstHeading(content) || path.basename(file.path, '.md'),
            section,
            category,
            subcategory,
            tags: data.tags || [],
            content,  // Use parsed content (without frontmatter)
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
            const rawContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(rawContent);
            const relativePath = path.relative(baseDir, filePath);
            const pathParts = relativePath.replace('.md', '').split(path.sep);
            
            const section = pathParts[0] || 'General';
            const category = pathParts[1] || 'Uncategorized';
            const subcategory = pathParts.length > 2 ? pathParts[2] : null;
            
            results.push({
              id: relativePath,
              title: data.title || extractFirstHeading(content) || path.basename(file, '.md'),
              section,
              category,
              subcategory,
              tags: data.tags || [],
              content,  // Use parsed content (without frontmatter)
              lastModified: stat.mtime.toISOString(),
              isUserOwned: false,
            });
          }
        });
        
        return results;
      };

      const prompts = walkDir(LIBRARY_PATH);
      res.json(prompts);
    }
  } catch (error: any) {
    console.error("Error listing prompts:", error);
    res.json([]);
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
    const title = data.title || extractFirstHeading(content) || path.basename(promptId, ".md");

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

// Initialize database on cold start
let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await initializeSchema();
    initialized = true;
  }
  
  return app(req, res);
}
