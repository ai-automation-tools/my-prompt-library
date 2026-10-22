import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createHash, randomBytes } from 'node:crypto';
import { fileURLToPath } from 'url';
import { carriedFrontmatter, loadIndex, readLibraryItem, type LibraryItem } from './library.js';

/**
 * My Library: the user's own prompts, one markdown file each, in a local folder.
 *
 * This app runs on the user's own machine, so there are no accounts — whoever
 * can reach the server owns the library. Files rather than a database so the
 * folder can be git-versioned, synced, or edited by hand; the frontmatter holds
 * what the old `user_prompts` table did.
 */

export interface UserPrompt {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
  /**
   * Frontmatter keys this store does not manage, kept as they were. A skill's
   * `name` and `description` live here: without them its SKILL.md will not load,
   * and before 2026-10-21 every save dropped them.
   */
  extra?: Record<string, unknown>;
}

type PromptFields = Omit<UserPrompt, 'id' | 'created_at' | 'updated_at'>;

/** The keys `write()` owns; everything else in a file's frontmatter is `extra`. */
const MANAGED = new Set(['title', 'section', 'category', 'subcategory', 'tags', 'created', 'updated']);
const extraOf = (data: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(data).filter(([k]) => !MANAGED.has(k)));

const APP_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Absolute `MY_LIBRARY_DIR` is used as-is; a relative one resolves against site/. */
export const MY_LIBRARY_DIR = path.resolve(APP_ROOT, process.env.MY_LIBRARY_DIR || 'my-library');

/**
 * The hosted demo (Vercel sets `VERCEL`) has no writable disk and is shared by
 * every visitor, so it serves the Public Library only. `READ_ONLY=true` does the
 * same anywhere else.
 */
export const READ_ONLY = process.env.READ_ONLY === 'true' || Boolean(process.env.VERCEL);

// Ids are file names. Restricting them to this alphabet is what keeps an id
// from ever naming a path outside the folder.
const ID_PATTERN = /^[a-z0-9-]+$/;

const fileFor = (id: string): string | null =>
  ID_PATTERN.test(id) ? path.join(MY_LIBRARY_DIR, `${id}.md`) : null;

// YAML turns an unquoted ISO date into a Date and "123" into a number; the
// frontmatter is hand-editable, so normalise on the way in.
const asString = (value: unknown): string =>
  value instanceof Date ? value.toISOString() : value == null ? '' : String(value);

function read(id: string): UserPrompt | null {
  const file = fileFor(id);
  if (!file || !fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
  const updated = asString(data.updated) || fs.statSync(file).mtime.toISOString();
  return {
    id,
    title: asString(data.title) || id,
    section: asString(data.section) || '4_Prompts',
    category: asString(data.category) || 'Uncategorized',
    subcategory: data.subcategory ? asString(data.subcategory) : null,
    tags: Array.isArray(data.tags) ? data.tags.map(asString) : [],
    content,
    created_at: asString(data.created) || updated,
    updated_at: updated,
    extra: extraOf(data),
  };
}

function write(prompt: UserPrompt, flag: 'w' | 'wx' = 'w') {
  fs.mkdirSync(MY_LIBRARY_DIR, { recursive: true });
  // Unmanaged keys first, so a skill's file still opens with name/description.
  const frontmatter = {
    ...extraOf(prompt.extra ?? {}),
    title: prompt.title,
    section: prompt.section,
    category: prompt.category,
    subcategory: prompt.subcategory,
    tags: prompt.tags,
    created: prompt.created_at,
    updated: prompt.updated_at,
  };
  fs.writeFileSync(fileFor(prompt.id)!, matter.stringify(prompt.content, frontmatter), { encoding: 'utf-8', flag });
}

const slugify = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'prompt';

export const myLibrary = {
  list(): UserPrompt[] {
    if (!fs.existsSync(MY_LIBRARY_DIR)) return [];
    return fs
      .readdirSync(MY_LIBRARY_DIR)
      .filter(name => name.endsWith('.md'))
      .flatMap(name => {
        try {
          return read(name.slice(0, -3)) ?? [];
        } catch {
          console.warn(`[MY-LIBRARY] Skipping unreadable ${name}`);
          return [];
        }
      })
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  },

  get: read,

  create(fields: PromptFields): UserPrompt {
    const now = new Date().toISOString();
    // The suffix keeps two prompts with the same title apart; the file name
    // never changes after this, so a rename doesn't break links to it.
    const prompt: UserPrompt = {
      ...fields,
      subcategory: fields.subcategory || null,
      tags: fields.tags || [],
      id: `${slugify(fields.title)}-${randomBytes(3).toString('hex')}`,
      created_at: now,
      updated_at: now,
    };
    write(prompt, 'wx');
    return prompt;
  },

  update(id: string, updates: Partial<PromptFields>): UserPrompt | null {
    const existing = read(id);
    if (!existing) return null;

    const prompt: UserPrompt = {
      ...existing,
      title: updates.title || existing.title,
      section: updates.section || existing.section,
      category: updates.category || existing.category,
      subcategory: updates.subcategory !== undefined ? updates.subcategory || null : existing.subcategory,
      tags: updates.tags || existing.tags,
      content: updates.content || existing.content,
      extra: { ...existing.extra, ...updates.extra },
      updated_at: new Date().toISOString(),
    };
    write(prompt);
    return prompt;
  },

  delete(id: string): boolean {
    const file = fileFor(id);
    if (!file || !fs.existsSync(file)) return false;
    fs.unlinkSync(file);
    return true;
  },
};

/**
 * A copy remembers where it came from in two `extra` keys: `forked_from` (the
 * Public Library id) and `forked_hash` (the public content as it was copied).
 * That base is what tells "the public one changed" apart from "you edited yours".
 */
const hashOf = (content: string) => createHash('sha256').update(content.trim()).digest('hex').slice(0, 16);

/** The `extra` a fresh copy of a library item carries. */
export const forkExtra = (item: LibraryItem) => ({
  ...carriedFrontmatter(item.frontmatter),
  forked_from: item.id,
  forked_hash: hashOf(item.content),
});

export interface UpstreamStatus {
  source: string;
  /** The public content changed since this copy was made (or, with no base, differs). */
  updateAvailable: boolean;
  /** This copy was edited since it was made. Unknown without a base, so true. */
  localEdits: boolean;
}

/**
 * The public item a copy came from. Copies made before 2026-10-22 carry no
 * `forked_from`, so they are matched by place and title, as the duplicate check does.
 */
function sourceOf(prompt: UserPrompt): LibraryItem | null {
  const recorded = typeof prompt.extra?.forked_from === 'string' ? prompt.extra.forked_from : null;
  const title = prompt.title.trim().toLowerCase();
  const id = recorded ?? loadIndex()?.prompts.find(e =>
    e.section === prompt.section && e.category === prompt.category
    && (e.subcategory || null) === (prompt.subcategory || null)
    && e.title.trim().toLowerCase() === title)?.id;
  if (!id) return null;
  const item = readLibraryItem(id);
  return item && item !== 'invalid' ? item : null;
}

export function upstreamStatus(prompt: UserPrompt): UpstreamStatus | null {
  const item = sourceOf(prompt);
  if (!item) return null;
  const upstream = hashOf(item.content);
  const mine = hashOf(prompt.content);
  const base = typeof prompt.extra?.forked_hash === 'string' ? prompt.extra.forked_hash : null;
  return {
    source: item.id,
    updateAvailable: upstream !== mine && (base ? upstream !== base : true),
    localEdits: base ? mine !== base : upstream !== mine,
  };
}

/** Replace a copy's content with the current public version. Never touches the public file. */
export function pullUpstream(id: string): UserPrompt | null {
  const prompt = myLibrary.get(id);
  const item = prompt && sourceOf(prompt);
  if (!prompt || !item) return null;
  return myLibrary.update(id, { content: item.content, extra: forkExtra(item) });
}
