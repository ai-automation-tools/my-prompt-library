import "dotenv/config";
import express from "express";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import net from "net";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { dirname } from "path";
import archiver from "archiver";
import { forkExtra, myLibrary, pullUpstream, READ_ONLY, upstreamStatus, type UserPrompt } from "../lib/my-library.js";
import { resolveInside } from "../lib/safe-path.js";
import { LIBRARY_PATH, SKILLS_SECTION, extractFirstHeading, readLibraryItem, sourceUrlOf } from "../lib/library.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app.
// Exported so `server.ts` can mount this exact app behind Vite in development.
// It used to keep a hand-maintained copy of every handler below, which drifted:
// dev lost `lightweight`, never gained `GET /api/prompts/:id`, and still filtered
// the GitHub tree on a `prompts/` folder that was renamed to `library/`.
export const app = express();

// Response headers only: no CSP, because Vite's build emits inline module
// preloads and the themes pull from Google Fonts, and in production the static
// assets never pass through Express anyway. HSTS is left to Vercel, which sets
// it on the edge for custom domains.
app.use(helmet({ contentSecurityPolicy: false, strictTransportSecurity: false }));

// Prompt bodies are user content and some library prompts run long, but nothing
// legitimate approaches a megabyte.
app.use(express.json({ limit: '1mb' }));

/**
 * Hostnames this server answers to. Same rule as Vite's `allowedHosts`, so dev
 * and `npm start` agree: localhost, *.localhost, any IP literal, and the
 * ALLOWED_HOSTS names (a leading dot allows subdomains too). A DNS-rebinding
 * page reaches the server under its own domain name, which none of these match.
 */
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS ?? '').split(',').map(h => h.trim().toLowerCase()).filter(Boolean);
const isTrustedHost = (host: string | undefined) => {
  if (!host) return true; // HTTP/1.0 clients; a browser always sends Host
  let name: string;
  try {
    name = new URL(`http://${host}`).hostname.toLowerCase().replace(/^\[|\]$/g, '');
  } catch {
    return false;
  }
  if (name === 'localhost' || name.endsWith('.localhost') || net.isIP(name)) return true;
  return ALLOWED_HOSTS.some(h => h.startsWith('.') ? name === h.slice(1) || name.endsWith(h) : name === h);
};

/** Browsers send Origin on cross-site writes; ours always matches the Host it was served from. */
const isCrossSite = (req: express.Request) => {
  const origin = req.headers.origin;
  if (!origin) return false; // curl and other non-browser clients
  try {
    return new URL(origin).host !== req.headers.host;
  } catch {
    return true; // "null" from sandboxed frames and file:// pages
  }
};

/**
 * The one trust boundary, in front of every route on this app: the prompt API,
 * the skill-packs handler server.ts mounts, Vite and the built `dist/`.
 * - An unknown Host is refused on every method (DNS rebinding). Vercel is
 *   skipped: its edge routes by domain and the demo is read-only.
 * - A cross-site Origin is refused on every write, so no page you visit can
 *   post at localhost:3010 (copy-to-my-prompts needs no body, so it is a
 *   simple request the browser sends without asking).
 */
app.use((req, res, next) => {
  if (!process.env.VERCEL && !isTrustedHost(req.headers.host)) {
    res.status(403).json({ error: 'Unknown Host refused. Add it to ALLOWED_HOSTS if it is yours.' });
    return;
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && isCrossSite(req)) {
    res.status(403).json({ error: 'Cross-site request refused' });
    return;
  }
  next();
});

// Debug middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

/** Every route that writes to My Library. Host and Origin are checked above, for every route. */
const requireWritable: express.RequestHandler = (req, res, next) => {
  if (READ_ONLY) {
    res.status(403).json({ error: 'This copy of the library is read-only. Clone the repo to keep your own prompts.' });
    return;
  }
  next();
};

/** The wire shape of a My Library prompt. */
const toApiPrompt = (p: UserPrompt) => ({
  id: p.id,
  title: p.title,
  section: p.section,
  category: p.category,
  subcategory: p.subcategory,
  tags: p.tags,
  content: p.content,
  lastModified: p.updated_at,
  isUserOwned: true,
});

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

// How many characters of a prompt body a card blurb gets. Mirrors the same
// constant in scripts/build-prompt-index.js, which bakes `contentPreview` in.
const PREVIEW_LENGTH = 200;

// id → contentPreview, built once from the prebuilt index.
// The listing no longer ships previews (they were 632 KB of its 2.2 MB, and only
// the ~50 cards on screen ever render one), so POST /api/prompts/previews serves
// them per page out of this map.
let previewIndex: Map<string, string> | null = null;
const getPreviewIndex = (): Map<string, string> => {
  if (!previewIndex) {
    previewIndex = new Map(
      (prebuiltIndex?.prompts ?? []).map((p: any) => [p.id, p.contentPreview ?? '']),
    );
  }
  return previewIndex;
};

// LIBRARY_PATH, SKILLS_SECTION and the single-item reader live in lib/library.ts,
// shared with the MCP server.
// Pre-rename *_OLD trees — kept in the repo, never served
const LEGACY_SECTION = 'Legacy';

// API to list all prompts (with optional lightweight mode)
app.get("/api/prompts", async (req, res) => {
  const libraryMode = req.query.library as string;
  const lightweight = req.query.lightweight === 'true'; // Only return metadata, not full content

  if (libraryMode === 'my') {
    // Read-only serves the Public Library only: personal prompts stay private too
    if (READ_ONLY) return res.json([]);
    // My Library keeps its inline preview where the public listing dropped one:
    // it is one person's own prompts, not 3,088, so the bytes are not worth a
    // round trip — and /api/prompts/previews only knows about library files.
    return res.json(myLibrary.list().map(p => ({
      ...toApiPrompt(p),
      content: lightweight ? p.content.substring(0, PREVIEW_LENGTH) : p.content,
    })));
  }

  // Check cache for public library lightweight requests
  if (libraryMode === 'public' && lightweight && isCacheValid()) {
    console.log('[CACHE HIT] Returning cached prompts');
    return res.json(promptsCache!.data);
  }

  // Use prebuilt index for lightweight public library requests
  if (libraryMode === 'public' && lightweight && prebuiltIndex) {
    console.log('[INDEX] Using prebuilt index for lightweight request');
    // Previews are deliberately left out: nothing the client does with the whole
    // listing (search, tag/category filters, sort, pagination) reads `content`,
    // and shipping all 3,088 of them cost more gzipped than the entire JS bundle.
    // Cards fetch the ~50 they actually render from /api/prompts/previews.
    const indexedPrompts = prebuiltIndex.prompts.map(({ contentPreview, ...p }: any) => ({
      ...p,
      content: '',
    }));

    // Cache it for subsequent requests
    promptsCache = { data: indexedPrompts, timestamp: Date.now() };

    return res.json(indexedPrompts);
  }

  try {
    const walkDir = (dir: string, baseDir: string = LIBRARY_PATH): any[] => {
      if (!fs.existsSync(dir)) return [];

      let results: any[] = [];
      const list = fs.readdirSync(dir);

      list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          if (dir === baseDir && file === LEGACY_SECTION) {
            return;
          }
          results = results.concat(walkDir(filePath, baseDir));
        } else if (file.endsWith('.md')) {
          if (file === 'README.md') {
            return;
          }

          const relativePath = path.relative(baseDir, filePath);

          // For Skills section, only include SKILL.md files
          if (relativePath.startsWith(SKILLS_SECTION + path.sep)) {
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

          // One file with malformed frontmatter must not empty the whole library
          let data: Record<string, any>;
          let content: string;
          try {
            ({ data, content } = matter(rawContent));
          } catch (err) {
            console.warn(`[WARN] Failed to parse frontmatter in ${relativePath}, skipping`);
            return;
          }

          const pathParts = relativePath.replace('.md', '').split(path.sep);

          const section = pathParts[0] || 'General';
          const category = pathParts[1] || 'Uncategorized';
          const subcategory = pathParts.length > 2 ? pathParts[2] : null;

          // For Skills, use 'name' field instead of 'title'
          const title = data.title || data.name
            || extractFirstHeading(content) || path.basename(file, '.md');

          results.push({
            // Ids are URL/path keys — always forward-slashed, even on Windows
            id: relativePath.split(path.sep).join('/'),
            title: title,
            section,
            category,
            subcategory,
            tags: data.tags || [],
            content: lightweight ? '' : content, // Lightweight drops the body; cards fetch previews
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
  } catch (error: any) {
    console.error("Error listing prompts:", error);
    res.json([]);
  }
});

// Card blurbs for a batch of library ids.
//
// POST rather than GET because ids are library paths ~70 characters long and a
// page asks for 50 of them at once — well past what is safe in a query string.
// Returns { [id]: preview }; ids it cannot resolve are simply absent, so one bad
// id never fails the batch.
const MAX_PREVIEW_IDS = 200;

app.post("/api/prompts/previews", (req, res) => {
  const requested: unknown = req.body?.ids;
  if (!Array.isArray(requested)) {
    return res.status(400).json({ error: 'Expected { ids: string[] }' });
  }

  const previews = getPreviewIndex();
  const out: Record<string, string> = {};

  for (const id of requested.slice(0, MAX_PREVIEW_IDS)) {
    if (typeof id !== 'string') continue;

    const indexed = previews.get(id);
    if (indexed !== undefined) {
      out[id] = indexed;
      continue;
    }

    // Not in the prebuilt index (stale index, or none was built). Fall back to
    // the file — `resolveInside` is what keeps "../../.env" out of this.
    if (!id.endsWith('.md')) continue;
    const filePath = resolveInside(LIBRARY_PATH, id);
    if (!filePath || !fs.existsSync(filePath)) continue;

    try {
      const { content } = matter(fs.readFileSync(filePath, 'utf-8'));
      out[id] = content.substring(0, PREVIEW_LENGTH);
    } catch {
      // Malformed frontmatter — the file has no preview, same as the indexer.
    }
  }

  res.json(out);
});

// Get single prompt with full content
app.get("/api/prompts/:id", async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);

    // My Library ids are bare file names; library ids are always section/…/file.md
    if (!promptId.includes('/') && !READ_ONLY) {
      const prompt = myLibrary.get(promptId);
      if (prompt) {
        return res.json({ ...toApiPrompt(prompt), upstream: upstreamStatus(prompt) });
      }
    }

    const item = readLibraryItem(promptId);
    if (item === 'invalid') {
      return res.status(400).json({ error: 'Invalid prompt path' });
    }
    if (!item) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const { frontmatter, ...rest } = item;
    return res.json({ ...rest, isUserOwned: false, sourceUrl: sourceUrlOf(frontmatter) });
  } catch (error: any) {
    console.error("Error fetching prompt:", error);
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

// Create prompt
app.post("/api/prompts", requireWritable, async (req, res) => {
  try {
    const { title, section, category, subcategory, tags, content } = req.body;

    if (!title || !section || !category || !content) {
      return res.status(400).json({ error: "Missing required fields: title, section, category, content" });
    }

    const prompt = myLibrary.create({
      title,
      section,
      category,
      subcategory: subcategory || null,
      tags: tags || [],
      content,
    });

    res.json({ ...toApiPrompt(prompt), message: "Prompt created successfully" });
  } catch (error: any) {
    console.error("Error creating prompt:", error);
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// Update prompt
app.put("/api/prompts/:id", requireWritable, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);
    const { title, tags, content, category, subcategory, section } = req.body;

    const prompt = myLibrary.update(promptId, {
      title,
      tags,
      content,
      category,
      subcategory,
      section,
    });

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    res.json({ ...toApiPrompt(prompt), message: "Prompt updated successfully" });
  } catch (error) {
    console.error("Error updating prompt:", error);
    res.status(500).json({ error: "Failed to update prompt" });
  }
});

// Overwrite a My Library copy with the current Public Library version
app.post("/api/prompts/:id/pull-upstream", requireWritable, async (req, res) => {
  try {
    const prompt = pullUpstream(decodeURIComponent(req.params.id));
    if (!prompt) {
      return res.status(404).json({ error: "No public source for this prompt" });
    }
    res.json({ ...toApiPrompt(prompt), upstream: upstreamStatus(prompt), message: "Updated from the Public Library" });
  } catch (error) {
    console.error("Error pulling upstream prompt:", error);
    res.status(500).json({ error: "Failed to update from the Public Library" });
  }
});

// Delete prompt
app.delete("/api/prompts/:id", requireWritable, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);

    if (!myLibrary.delete(promptId)) {
      return res.status(404).json({ error: "Prompt not found" });
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
app.post("/api/prompts/:path(*)/copy-to-my-prompts", requireWritable, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.path);

    const item = readLibraryItem(promptId);
    if (item === 'invalid') {
      return res.status(400).json({ error: "Invalid prompt path" });
    }
    if (!item) {
      return res.status(404).json({ error: "Prompt not found in public library" });
    }

    // Parsed content, without the library file's own frontmatter
    const { title, section, category, subcategory, tags, content } = item;

    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = myLibrary.list().find(p =>
      p.section === section &&
      p.category === category &&
      (p.subcategory || null) === (subcategory || null) &&
      p.title.trim().toLowerCase() === normalizedTitle
    );

    if (duplicate) {
      return res.status(409).json({ error: "This prompt already exists in your library" });
    }

    const copiedPrompt = myLibrary.create({
      title,
      section,
      category,
      subcategory,
      tags,
      content,
      extra: forkExtra(item),
    });

    return res.json({ ...toApiPrompt(copiedPrompt), message: "Prompt copied to My Library" });
  } catch (error: any) {
    console.error("Error copying prompt to My Library:", error);
    return res.status(500).json({ error: error.message || "Failed to copy prompt to My Library" });
  }
});

// Download skill as zip
app.get("/api/skills/download/:skillPath(*)", async (req, res) => {
  try {
    const skillPath = decodeURIComponent(req.params.skillPath).replace(/\\/g, '/');

    // Resolve first, then check containment — a raw startsWith() on skillPath is
    // satisfied by "3_Skills/../../db" and hands out the whole bundle.
    const skillsRoot = path.join(LIBRARY_PATH, SKILLS_SECTION);
    const fullPath = resolveInside(LIBRARY_PATH, skillPath);

    if (!fullPath || !fullPath.startsWith(skillsRoot + path.sep)) {
      return res.status(400).json({ error: "Invalid skill path. Must be under 3_Skills/ directory." });
    }

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
  } catch (error: any) {
    console.error("Error creating skill download:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Failed to create download" });
    }
  }
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
