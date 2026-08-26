#!/usr/bin/env node
/**
 * Build a static index of all prompts for faster cold starts
 * Run this during build: npm run build:index
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIBRARY_PATH = path.join(__dirname, '../library');
const OUTPUT_PATH = path.join(__dirname, '../api/prompt-index.json');

// Library section folder holding skills (numbered layout)
const SKILLS_SECTION = '3_Skills';

function extractFirstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function walkDir(dir, baseDir = LIBRARY_PATH) {
  if (!fs.existsSync(dir)) return [];
  
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Legacy/ holds the pre-rename *_OLD trees — not indexed, not shipped
      if (dir === baseDir && file === 'Legacy') {
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
          return;
        }
      }
      
      // Skip files larger than 500KB
      if (stat.size > 500 * 1024) {
        console.log(`[SKIP] Large file: ${relativePath} (${(stat.size / 1024).toFixed(0)}KB)`);
        return;
      }
      
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      
      let data, content;
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
      
      // Skills prefer `title` too. `name` is now the spec-required slug
      // (lowercase-hyphen, matching the directory), so reading it here would
      // show "mcp-builder" where the site used to show the decorated form.
      // That decorated form lives in `title`; `name` stays the fallback.
      const title = data.title
        || data.name
        || extractFirstHeading(content)
        || path.basename(file, '.md');
      
      results.push({
        // Ids are URL/path keys — always forward-slashed, even on Windows
        id: relativePath.split(path.sep).join('/'),
        title: title,
        section,
        category,
        subcategory,
        tags: data.tags || [],
        contentPreview: content.substring(0, 200), // Just preview for lightweight mode
        lastModified: stat.mtime.toISOString(),
        isUserOwned: false,
      });
    }
  });
  
  return results;
}

console.log('Building prompt index...');
const startTime = Date.now();

const prompts = walkDir(LIBRARY_PATH);

const index = {
  version: 1,
  buildTime: new Date().toISOString(),
  promptCount: prompts.length,
  prompts: prompts,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));

const duration = Date.now() - startTime;
console.log(`✓ Built index with ${prompts.length} prompts in ${duration}ms`);
console.log(`✓ Saved to: ${OUTPUT_PATH}`);
