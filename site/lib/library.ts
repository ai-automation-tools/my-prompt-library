import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { resolveInside } from './safe-path.js';

/**
 * Read access to the Public Library (`site/library/`) and its prebuilt index,
 * shared by the Express API and the MCP server (`mcp/server.ts`).
 *
 * Nothing in this module writes to stdout: the MCP server speaks JSON-RPC on
 * stdout, so a stray `console.log` here would corrupt every client session.
 */

const APP_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Always resolve from this file, never process.cwd(): on Vercel the function
 * runs with cwd=/var/task while the app (Root Directory = site) is bundled at
 * /var/task/site, so a cwd-based path misses library/ entirely.
 */
export const LIBRARY_PATH = [path.join(APP_ROOT, 'library'), path.join(process.cwd(), 'library')]
  .find(p => fs.existsSync(p)) ?? path.join(APP_ROOT, 'library');

export const SKILLS_SECTION = '3_Skills';

/** The sections by the short key a caller types, and the folder each one is. */
export const SECTIONS = {
  prompts: { folder: '4_Prompts', label: 'Prompts', description: 'Reusable prompt templates, organised by domain and task.' },
  agents: { folder: '2_Agents', label: 'Agents', description: 'Installable subagent definitions for .claude/agents/.' },
  guides: { folder: '1_Guides', label: 'Guides', description: 'Setup and usage guides for the tools and providers the prompts target.' },
  'system-prompts': { folder: '5_System_Prompts', label: 'System Prompts', description: 'An archive of production system prompts, for study and reuse.' },
  skills: { folder: '3_Skills', label: 'Skills', description: 'SKILL.md bundles with their support files.' },
  'mcp-servers': { folder: '6_MCP_Servers', label: 'MCP Servers', description: 'MCP servers worth installing, with verified install lines.' },
} as const;

export type SectionKey = keyof typeof SECTIONS;
export const SECTION_KEYS = Object.keys(SECTIONS) as [SectionKey, ...SectionKey[]];

export interface IndexEntry {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  contentPreview?: string;
  lastModified: string;
}

export interface LibraryIndex {
  promptCount: number;
  buildTime: string;
  prompts: IndexEntry[];
}

let cachedIndex: LibraryIndex | null | undefined;

/** The prebuilt `api/prompt-index.json`, or null if it was never built. Read once. */
export function loadIndex(): LibraryIndex | null {
  if (cachedIndex !== undefined) return cachedIndex;
  try {
    const file = path.join(APP_ROOT, 'api', 'prompt-index.json');
    cachedIndex = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : null;
  } catch {
    cachedIndex = null;
  }
  return cachedIndex ?? null;
}

export const extractFirstHeading = (content: string): string | null => {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : null;
};

/** section / category / subcategory from a forward-slashed library id. */
export function placeOf(id: string) {
  const parts = id.replace(/\.md$/, '').split('/');
  return {
    section: parts[0] || 'General',
    category: parts[1] || 'Uncategorized',
    subcategory: parts.length > 2 ? parts[2] : null,
  };
}

/**
 * The part of a library file's frontmatter a copy in My Library keeps: a skill's
 * `name`, `description`, `license`, `allowed-tools` and the like. Provenance and
 * the keys My Library manages itself are left behind.
 */
export function carriedFrontmatter(frontmatter: Record<string, unknown>): Record<string, unknown> {
  const drop = new Set(['title', 'tags', 'section', 'category', 'subcategory', 'upstream', 'created', 'updated']);
  return Object.fromEntries(Object.entries(frontmatter).filter(([k]) => !drop.has(k)));
}

/** An MCP server card's source on GitHub, from `server.repo` (and `server.path` for a monorepo). */
export function sourceUrlOf(frontmatter: Record<string, unknown>): string | undefined {
  const server = frontmatter.server as { repo?: unknown; path?: unknown } | undefined;
  if (typeof server?.repo !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(server.repo)) return undefined;
  const base = `https://github.com/${server.repo}`;
  return typeof server.path === 'string' && server.path ? `${base}/tree/HEAD/${server.path}` : base;
}

export interface LibraryItem {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  frontmatter: Record<string, unknown>;
  content: string;
  lastModified: string;
}

/**
 * One library file by id (`4_Prompts/…/x.md`). `invalid` for an id that escapes
 * the library or is not markdown, null for one that does not exist.
 */
export function readLibraryItem(id: string): LibraryItem | null | 'invalid' {
  const clean = id.replace(/\\/g, '/');
  if (!clean.endsWith('.md')) return 'invalid';
  const file = resolveInside(LIBRARY_PATH, clean);
  if (!file) return 'invalid';
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;

  const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
  return {
    id: clean,
    // Skills keep the decorated form in `title`; `name` is the spec slug.
    title: data.title || data.name || extractFirstHeading(content) || path.basename(clean, '.md'),
    ...placeOf(clean),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    frontmatter: data,
    content,
    lastModified: fs.statSync(file).mtime.toISOString(),
  };
}
