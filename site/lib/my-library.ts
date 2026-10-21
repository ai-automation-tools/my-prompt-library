import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'url';

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
}

type PromptFields = Omit<UserPrompt, 'id' | 'created_at' | 'updated_at'>;

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
  };
}

function write(prompt: UserPrompt, flag: 'w' | 'wx' = 'w') {
  fs.mkdirSync(MY_LIBRARY_DIR, { recursive: true });
  const frontmatter = {
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
