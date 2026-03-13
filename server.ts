import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

async function startServer() {
  const app = express();
  const PORT = 3010;

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

  // API to list all prompts and their metadata
  app.get("/api/prompts", (req, res) => {
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

    try {
      const filePaths = getAllFiles(promptsDir);
      const prompts = filePaths.map((filePath) => {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);
        const relativePath = path.relative(promptsDir, filePath);

        // Path structure: Section/Category/Subcategory/file.md
        // e.g. My_Prompts/IT/DevOps/prompt.md or Collections/AI/agent_dev/prompt.md
        const pathParts = relativePath.split(path.sep);
        const inferredSection = pathParts.length > 1 ? pathParts[0] : "My_Prompts";
        const inferredCategory = pathParts.length > 2 ? pathParts[1] : (pathParts.length > 1 ? pathParts[0] : "General");
        const inferredSubcategory = pathParts.length > 3 ? pathParts[2] : null;

        // Always use path-inferred category/subcategory for the section structure.
        // Frontmatter category often duplicates the section name (e.g. category: "Collections")
        // which breaks the sidebar hierarchy. Path is the source of truth.
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

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        return res.status(409).json({ error: "A prompt with this title already exists" });
      }

      // Create frontmatter
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

      // Read existing frontmatter
      const existingContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(existingContent);

      // Update frontmatter
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

  // API to copy a prompt from Collections to My_Prompts
  app.post("/api/prompts/add-to-my-prompts", (req, res) => {
    try {
      const { promptId } = req.body;
      
      if (!promptId) {
        return res.status(400).json({ error: "promptId is required" });
      }
      
      // Only allow copying from Collections
      if (!promptId.startsWith('Collections/')) {
        return res.status(400).json({ error: "Can only add prompts from Collections" });
      }

      const sourcePath = path.join(process.cwd(), "prompts", promptId);
      
      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      // Get the path after Collections/
      const relativePromptPath = promptId.replace('Collections/', '');
      const targetPath = path.join(process.cwd(), "prompts", "My_Prompts", relativePromptPath);
      
      // Check if already exists in My_Prompts
      if (fs.existsSync(targetPath)) {
        return res.status(409).json({ error: "Prompt already exists in My_Prompts" });
      }

      // Create target directory
      const targetDir = path.dirname(targetPath);
      ensureDir(targetDir);

      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);

      // Get the new prompt ID
      const newPromptId = `My_Prompts/${relativePromptPath}`;

      res.json({
        message: "Prompt added to My_Prompts successfully",
        newId: newPromptId
      });
    } catch (error) {
      console.error("Error adding prompt to My_Prompts:", error);
      res.status(500).json({ error: "Failed to add prompt to My_Prompts" });
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
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
