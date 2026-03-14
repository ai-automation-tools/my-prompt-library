import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const app = express();
app.use(express.json());

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

const promptsRoot = path.join(process.cwd(), "prompts");
const ALLOWED_SOURCE_SECTIONS = new Set(["Collections", "System_Prompts", "Agent_Guides"]);

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
app.get("/api/prompts", async (req, res) => {
  try {
    // Production path: read from GitHub repository
    if (isGitHubConfigured()) {
      const branchResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${encodeURIComponent(GITHUB_BRANCH)}`,
        { headers: githubHeaders }
      );

      if (!branchResponse.ok) {
        const errorText = await branchResponse.text();
        console.error('GitHub branch fetch failed:', errorText);
        return res.status(502).json({ error: "Failed to fetch branch from GitHub" });
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

        return {
          id: relativePath,
          title: data.title || path.basename(file.path, ".md"),
          section: inferredSection,
          category: inferredCategory,
          subcategory: inferredSubcategory,
          tags: data.tags || [],
          content: content,
          lastModified: new Date().toISOString(),
        };
      }));

      return res.json(prompts.filter(p => p !== null));
    }

    // Local/dev fallback: filesystem read
    const promptsDir = path.join(process.cwd(), "prompts");
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

      return {
        id: relativePath,
        title: data.title || path.basename(filePath, ".md"),
        section: inferredSection,
        category: inferredCategory,
        subcategory: inferredSubcategory,
        tags: data.tags || [],
        content: content,
        lastModified: fs.statSync(filePath).mtime,
      };
    });

    res.json(prompts);
  } catch (error) {
    console.error("Error reading prompts:", error);
    res.status(500).json({ error: "Failed to read prompts" });
  }
});

// API to create a new prompt
app.post("/api/prompts", (req, res) => {
  try {
    const { title, section, category, subcategory, tags, content } = req.body;

    if (!title || !section || !category || !content) {
      return res.status(400).json({ error: "Missing required fields: title, section, category, content" });
    }

    const filename = generateFilename(title);
    const dirPath = subcategory
      ? path.join(process.cwd(), "prompts", section, category, subcategory)
      : path.join(process.cwd(), "prompts", section, category);

    ensureDir(dirPath);

    const filePath = path.join(dirPath, filename);

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: "A prompt with this title already exists" });
    }

    const frontmatter = {
      title,
      tags: tags || [],
      category,
      subcategory: subcategory || category
    };

    const fileContent = `---\n${Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n')}\n---\n\n${content}`;

    fs.writeFileSync(filePath, fileContent, 'utf8');

    const relativePath = path.relative(path.join(process.cwd(), "prompts"), filePath);

    res.json({
      id: relativePath,
      title,
      section,
      category,
      subcategory,
      tags,
      content,
      message: "Prompt created successfully"
    });
  } catch (error) {
    console.error("Error creating prompt:", error);
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// API to update an existing prompt
app.put("/api/prompts/:id", (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);
    const { title, tags, content } = req.body;

    const filePath = path.join(process.cwd(), "prompts", promptId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    const existingContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(existingContent);

    const updatedFrontmatter = {
      ...data,
      title: title || data.title,
      tags: tags || data.tags || []
    };

    const fileContent = `---\n${Object.entries(updatedFrontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n')}\n---\n\n${content || ''}`;

    fs.writeFileSync(filePath, fileContent, 'utf8');

    res.json({
      id: promptId,
      message: "Prompt updated successfully"
    });
  } catch (error) {
    console.error("Error updating prompt:", error);
    res.status(500).json({ error: "Failed to update prompt" });
  }
});

// API to delete a prompt
app.delete("/api/prompts/:id", (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);
    const filePath = path.join(process.cwd(), "prompts", promptId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    fs.unlinkSync(filePath);

    res.json({
      message: "Prompt deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    res.status(500).json({ error: "Failed to delete prompt" });
  }
});

// API to copy a prompt into My_Prompts
app.post("/api/prompts/:id/copy-to-my-prompts", async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id).replace(/\\/g, '/');
    const pathParts = promptId.split('/');
    const sourceSection = pathParts[0];

    if (!ALLOWED_SOURCE_SECTIONS.has(sourceSection)) {
      return res.status(400).json({ error: "Only prompts from Collections, System_Prompts, and Agent_Guides can be copied to My Prompts" });
    }

    const destinationRelativePath = path.posix.join('My_Prompts', ...pathParts.slice(1));

    // Production path: commit to GitHub repository directly
    if (isGitHubConfigured()) {
      const sourceRepoPath = path.posix.join('prompts', promptId);
      const destinationRepoPath = path.posix.join('prompts', destinationRelativePath);

      const sourceResponse = await fetch(`${githubApiUrlForPath(sourceRepoPath)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
        method: 'GET',
        headers: githubHeaders
      });

      if (sourceResponse.status === 404) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      if (!sourceResponse.ok) {
        const errorText = await sourceResponse.text();
        console.error('GitHub source fetch failed:', errorText);
        return res.status(502).json({ error: "Failed to fetch source prompt from GitHub" });
      }

      const sourceData = await sourceResponse.json();

      const destinationCheckResponse = await fetch(`${githubApiUrlForPath(destinationRepoPath)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
        method: 'GET',
        headers: githubHeaders
      });

      if (destinationCheckResponse.ok) {
        return res.status(409).json({ error: "A prompt with this name already exists in My Prompts" });
      }

      if (destinationCheckResponse.status !== 404) {
        const errorText = await destinationCheckResponse.text();
        console.error('GitHub destination check failed:', errorText);
        return res.status(502).json({ error: "Failed to validate destination in GitHub" });
      }

      const createResponse = await fetch(githubApiUrlForPath(destinationRepoPath), {
        method: 'PUT',
        headers: githubHeaders,
        body: JSON.stringify({
          message: `feat(prompts): copy ${promptId} to ${destinationRelativePath}`,
          content: sourceData.content,
          branch: GITHUB_BRANCH
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('GitHub destination create failed:', errorText);
        return res.status(502).json({ error: "Failed to copy prompt to My Prompts in GitHub" });
      }

      return res.json({
        id: destinationRelativePath,
        message: "Prompt copied to My Prompts"
      });
    }

    // Local/dev fallback: filesystem copy
    const sourceFilePath = resolvePromptPath(promptId);

    if (!fs.existsSync(sourceFilePath)) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    const destinationFilePath = resolvePromptPath(destinationRelativePath);

    if (fs.existsSync(destinationFilePath)) {
      return res.status(409).json({ error: "A prompt with this name already exists in My Prompts" });
    }

    ensureDir(path.dirname(destinationFilePath));
    fs.copyFileSync(sourceFilePath, destinationFilePath, fs.constants.COPYFILE_EXCL);

    return res.json({
      id: destinationRelativePath,
      message: "Prompt copied to My Prompts"
    });
  } catch (error: any) {
    console.error("Error copying prompt to My_Prompts:", error);
    return res.status(500).json({ error: error.message || "Failed to copy prompt to My Prompts" });
  }
});

// Export the Express app as a serverless function
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
