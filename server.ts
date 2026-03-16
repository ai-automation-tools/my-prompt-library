import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/auth.js";
import { optionalAuth, authenticate } from "./middleware/auth.js";
import { userDb, promptDb, sessionDb, initializeSchema } from "./db/postgres.js";

// Get the directory of this file (server.ts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3010;

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

  // Use __dirname to find library relative to this file, not cwd
  const promptsRoot = path.join(__dirname, "library");
  const ALLOWED_SOURCE_SECTIONS = new Set(["Collections", "System_Prompts", "Agent_Guides"]);

  // Helper function to extract first heading from markdown content
  const extractFirstHeading = (content: string): string | null => {
    const lines = content.split('\n');
    for (const line of lines) {
      // Trim to handle both \n and \r\n line endings
      const trimmedLine = line.trim();
      const match = trimmedLine.match(/^#\s+(.+)$/);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  };

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "mike_desktop";

  const isGitHubConfigured = () => !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);

  const githubApiUrlForPath = (repoPath: string) => {
    const encodedPath = repoPath.split('/').map(encodeURIComponent).join('/');
    return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodedPath}`;
  };

  const githubHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };

  const resolvePromptPath = (promptId: string) => {
    const normalizedId = promptId.replace(/\\/g, '/');

    if (!normalizedId.endsWith('.md')) {
      throw new Error('Invalid prompt path');
    }

    const absolutePath = path.resolve(promptsRoot, normalizedId);
    const rootWithSep = promptsRoot.endsWith(path.sep) ? promptsRoot : `${promptsRoot}${path.sep}`;

    if (!absolutePath.startsWith(rootWithSep)) {
      throw new Error('Invalid prompt path');
    }

    return absolutePath;
  };

  // API to list all prompts and their metadata
  app.get("/api/prompts", optionalAuth, async (req, res) => {
    const libraryMode = req.query.library as string; // 'public' or 'my'
    
    // If requesting user's library, return from database
    if (libraryMode === 'my') {
      if (!req.user) {
        console.log('[My Library] No user authenticated');
        return res.status(401).json({ error: 'Authentication required for My Library' });
      }
      
      console.log('[My Library] User:', req.user.id, req.user.email);
      const userPrompts = await promptDb.findByUserId(req.user.id);
      console.log('[My Library] Found prompts:', userPrompts.length);
      if (userPrompts.length > 0) {
        console.log('[My Library] First prompt:', userPrompts[0].title, userPrompts[0].section);
      }
      
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
      
      console.log('[My Library] Returning prompts:', formattedPrompts.length);
      return res.json(formattedPrompts);
    }
    
    // Otherwise, return public library from files (existing logic)
  
    try {
      // Production path: read from GitHub repository
      if (isGitHubConfigured()) {
        console.log(`[GitHub Mode] GITHUB_OWNER=${GITHUB_OWNER}, GITHUB_REPO=${GITHUB_REPO}, GITHUB_BRANCH=${GITHUB_BRANCH}`);
        
        const branchResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${encodeURIComponent(GITHUB_BRANCH)}`,
          { headers: githubHeaders }
        );

        if (!branchResponse.ok) {
          const errorText = await branchResponse.text();
          console.error('GitHub branch fetch failed:', branchResponse.status, errorText);
          return res.status(502).json({ error: `Failed to fetch branch from GitHub: ${branchResponse.status}` });
        }

        const branchData = await branchResponse.json();
        const commitSha = branchData.object.sha;

        const treeResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${commitSha}?recursive=1`,
          { headers: githubHeaders }
        );

        if (!treeResponse.ok) {
          const errorText = await treeResponse.text();
          console.error('GitHub tree fetch failed:', errorText);
          return res.status(502).json({ error: "Failed to fetch file tree from GitHub" });
        }

        const treeData = await treeResponse.json();
        const promptFiles = treeData.tree.filter((item: any) => 
          item.type === 'blob' && 
          item.path.startsWith('prompts/') && 
          item.path.endsWith('.md')
        );

        const prompts = await Promise.all(promptFiles.map(async (file: any) => {
          const blobResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs/${file.sha}`,
            { headers: githubHeaders }
          );

          if (!blobResponse.ok) {
            console.error(`Failed to fetch blob ${file.sha} for ${file.path}`);
            return null;
          }

          const blobData = await blobResponse.json();
          const fileContent = Buffer.from(blobData.content, 'base64').toString('utf8');
          const { data, content } = matter(fileContent);
          
          const relativePath = file.path.replace('prompts/', '');
          const pathParts = relativePath.split('/');
          const inferredSection = pathParts.length > 1 ? pathParts[0] : "My_Prompts";
          const inferredCategory = pathParts.length > 2 ? pathParts[1] : (pathParts.length > 1 ? pathParts[0] : "General");
          const inferredSubcategory = pathParts.length > 3 ? pathParts[2] : null;

          // Try to get title from: 1) frontmatter, 2) first # heading, 3) filename
          const title = data.title || extractFirstHeading(content) || path.basename(file.path, ".md");

          return {
            id: relativePath,
            title,
            section: inferredSection,
            category: inferredCategory,
            subcategory: inferredSubcategory,
            tags: data.tags || [],
            content: content,
            lastModified: new Date().toISOString(),
            isUserOwned: inferredSection === 'My_Prompts', // Mark user-owned prompts
          };
        }));

        return res.json(prompts.filter(p => p !== null));
      }

      // Local/dev fallback: filesystem read
      const promptsDir = path.join(__dirname, "library");
      if (!fs.existsSync(promptsDir)) {
        return res.json([]);
      }

      const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
          if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
          } else {
            if (file.endsWith(".md")) {
              arrayOfFiles.push(path.join(dirPath, file));
            }
          }
        });

        return arrayOfFiles;
      };

      const filePaths = getAllFiles(promptsDir);
      const prompts = filePaths.map((filePath) => {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);
        const relativePath = path.relative(promptsDir, filePath);

        const pathParts = relativePath.split(path.sep);
        const inferredSection = pathParts.length > 1 ? pathParts[0] : "My_Prompts";
        const inferredCategory = pathParts.length > 2 ? pathParts[1] : (pathParts.length > 1 ? pathParts[0] : "General");
        const inferredSubcategory = pathParts.length > 3 ? pathParts[2] : null;

        // Try to get title from: 1) frontmatter, 2) first # heading, 3) filename
        const title = data.title || extractFirstHeading(content) || path.basename(filePath, ".md");

        return {
          id: relativePath,
          title,
          section: inferredSection,
          category: inferredCategory,
          subcategory: inferredSubcategory,
          tags: data.tags || [],
          content: content,
          lastModified: fs.statSync(filePath).mtime,
          isUserOwned: inferredSection === 'My_Prompts', // Mark user-owned prompts
        };
      });

      res.json(prompts);
    } catch (error: any) {
      console.error("Error reading prompts:", error);
      console.error("Error stack:", error?.stack);
      // Return empty array instead of 500 so UI doesn't break
      res.json([]);
    }
  });

  // API to create a new prompt
  app.post("/api/prompts", authenticate, async (req, res) => {
    try {
      const { title, section, category, subcategory, tags, content } = req.body;

      if (!title || !section || !category || !content) {
        return res.status(400).json({ error: "Missing required fields: title, section, category, content" });
      }

      // Save to database for authenticated users
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
    } catch (error) {
      console.error("Error creating prompt:", error);
      res.status(500).json({ error: "Failed to create prompt" });
    }
  });

  // API to update an existing prompt
  app.put("/api/prompts/:id", authenticate, async (req, res) => {
    try {
      const promptId = decodeURIComponent(req.params.id);
      const { title, tags, content, category, subcategory, section } = req.body;

      // Update in database for authenticated users
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

  // API to delete a prompt
  app.delete("/api/prompts/:id", authenticate, async (req, res) => {
    try {
      const promptId = decodeURIComponent(req.params.id);

      // Delete from database for authenticated users
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

  // API to copy a prompt into My Library (saves to database)
  app.post("/api/prompts/:id/copy-to-my-prompts", authenticate, async (req, res) => {
    try {
      const promptId = decodeURIComponent(req.params.id).replace(/\\/g, '/');
      
      // Find the source prompt from public library
      const sourceFilePath = path.join(__dirname, "library", promptId);
      
      if (!fs.existsSync(sourceFilePath)) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      // Read source prompt
      const fileContent = fs.readFileSync(sourceFilePath, "utf8");
      const { data, content } = matter(fileContent);
      
      const pathParts = promptId.split(path.sep);
      const section = pathParts[0];
      const category = pathParts.length > 1 ? pathParts[1] : "General";
      const subcategory = pathParts.length > 2 ? pathParts[2] : null;
      const title = data.title || extractFirstHeading(content) || path.basename(promptId, ".md");

      // Copy to user's database
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Initialize database schema
  await initializeSchema();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
