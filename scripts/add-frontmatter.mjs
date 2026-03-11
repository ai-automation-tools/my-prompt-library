#!/usr/bin/env node

/**
 * Add YAML frontmatter to all prompt files
 * Based on README.md specification
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_DIR = path.join(__dirname, '..', 'prompts');

// Extract title from markdown content
function extractTitle(content) {
  // Try to find first # heading
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  return null;
}

// Infer category and subcategory from file path
function inferMetadata(filePath) {
  const relativePath = path.relative(PROMPTS_DIR, filePath);
  const parts = relativePath.split(path.sep);
  
  const category = parts[0] || '';
  const subcategory = parts[1] || '';
  const filename = parts[parts.length - 1];
  
  return { category, subcategory, filename };
}

// Generate tags from category, subcategory, and filename
function generateTags(category, subcategory, filename) {
  const tags = [];
  
  if (category) tags.push(category.toLowerCase().replace(/_/g, '-'));
  if (subcategory && subcategory !== 'readme.md') {
    tags.push(subcategory.toLowerCase().replace(/_/g, '-'));
  }
  
  // Add tags from filename (remove .md, split on underscores/hyphens)
  const baseName = filename.replace('.md', '');
  const words = baseName.split(/[_-]/)
    .filter(w => w.length > 3)
    .map(w => w.toLowerCase())
    .slice(0, 3); // Limit to 3 words from filename
  
  tags.push(...words);
  
  return [...new Set(tags)].slice(0, 5); // Dedupe and limit to 5 tags
}

// Check if file already has frontmatter
function hasFrontmatter(content) {
  return content.trim().startsWith('---');
}

// Process a single prompt file
async function processPrompt(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Skip if already has frontmatter
  if (hasFrontmatter(content)) {
    console.log(`⏭️  Skipping (has frontmatter): ${path.relative(PROMPTS_DIR, filePath)}`);
    return { skipped: true };
  }
  
  const { category, subcategory, filename } = inferMetadata(filePath);
  const title = extractTitle(content) || filename.replace('.md', '').replace(/_/g, ' ');
  const tags = generateTags(category, subcategory, filename);
  
  // Build frontmatter
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `tags: [${tags.map(t => `"${t}"`).join(', ')}]`,
    `category: "${category}"`,
    `subcategory: "${subcategory}"`,
    '---',
    '',
  ].join('\n');
  
  const newContent = frontmatter + content;
  
  await fs.writeFile(filePath, newContent, 'utf-8');
  console.log(`✅ Updated: ${path.relative(PROMPTS_DIR, filePath)}`);
  
  return { updated: true, title, category, subcategory, tags };
}

// Recursively find all .md files
async function findPromptFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...await findPromptFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
async function main() {
  console.log('🔍 Scanning for prompt files...\n');
  
  const promptFiles = await findPromptFiles(PROMPTS_DIR);
  console.log(`📝 Found ${promptFiles.length} .md files\n`);
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of promptFiles) {
    try {
      const result = await processPrompt(file);
      if (result.updated) updated++;
      if (result.skipped) skipped++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\n✨ Complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

main().catch(console.error);
