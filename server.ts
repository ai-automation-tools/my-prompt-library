import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
        
        // Infer category/subcategory from path if not in frontmatter
        const pathParts = relativePath.split(path.sep);
        const inferredCategory = pathParts.length > 1 ? pathParts[0] : "General";
        const inferredSubcategory = pathParts.length > 2 ? pathParts[1] : null;

        return {
          id: relativePath,
          title: data.title || path.basename(filePath, ".md"),
          category: data.category || inferredCategory,
          subcategory: data.subcategory || inferredSubcategory,
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
