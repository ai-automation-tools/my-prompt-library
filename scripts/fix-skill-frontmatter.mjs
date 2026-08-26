#!/usr/bin/env node
/**
 * Make every SKILL.md loadable as an Agent Skill, without losing the site's
 * display names.
 *
 * The spec wants `name` to be lowercase-hyphen and to match the containing
 * directory. This library had 165 names carrying a decorative emoji
 * ("📱 mcp-builder"), 171 breaking the character rule, and 23 with no `name` or
 * `description` at all — those 23 cannot load as skills at all, they are inert
 * markdown inside a downloaded zip.
 *
 * So the decorative form moves to `title:`, which is what the site renders
 * anyway, and `name:` becomes the directory slug. Nothing is thrown away and
 * nothing about the UI changes — but the readers must then prefer `title` over
 * `name` for skills, which is the paired edit in build-prompt-index.js and
 * api/index.ts. (server.ts already preferred `title`, so that edit also closes
 * one of the dev/prod divergences rather than adding one.)
 *
 * What this does NOT buy: file-level identity with upstream. The emoji used to
 * be the only difference for about a dozen skills, but we now add an `upstream:`
 * block on purpose, so a whole-file diff will never match again (measured: 0 of
 * 19 Anthropic skills). Body identity is the thing worth tracking, and
 * check-upstream-drift.mjs already strips frontmatter before comparing — so it
 * never saw the emoji, and these edits do not change a single verdict it emits.
 * The payoff here is spec compliance alone: 23 skills that could not load, and
 * 171 names the spec rejects.
 *
 * Missing descriptions are recovered from the body, which comes in two shapes:
 * "# Title\n\n<para>" and "# Title\n\n## Overview\n<para>".
 *
 * Usage:
 *   node scripts/fix-skill-frontmatter.mjs            # report
 *   node scripts/fix-skill-frontmatter.mjs --write
 */
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library", "3_Skills");

const MAX_DESC = 500; // spec allows 1024; long descriptions hurt skill selection
const BOM = /^﻿/;
const CRLF = /\r\n/g;

const slug = (s) =>
  s.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const titleCase = (s) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()).trim();

const firstHeading = (body) => {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
};

// When there is no name and no title to keep, the body's own H1 beats a
// title-cased directory: "Go Libraries and Frameworks Recommendations" is what
// the site used to show for a folder called golang-popular-libraries.
const synthTitle = (body, dir) => firstHeading(body) || titleCase(dir);

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === "SKILL.md") out.push(p);
  }
  return out;
};

const splitFrontmatter = (raw) => {
  const t = raw.replace(BOM, "").replace(CRLF, "\n");
  if (!t.startsWith("---\n")) return null;
  const end = t.indexOf("\n---", 3);
  if (end === -1) return null;
  return { fm: t.slice(4, end), body: t.slice(end + 4) };
};

// Read a top-level scalar. Nested blocks (upstream:) are indented, so the
// anchored ^ keeps us out of them.
//
// Returns null when the key is absent and "" when it is present but empty —
// the caller must tell those apart. `description:` followed by indented
// continuation lines is a real multi-line YAML value; treating it as missing
// and inserting a fresh `description:` line orphans the continuation and makes
// the whole file unparseable, which silently drops the skill from the index.
const hasKey = (fm, key) => new RegExp(`^${key}:`, "m").test(fm);

const readKey = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, "m"));
  if (!m) return null;
  const v = m[1].trim();
  // Strip quotes only when the value is fully wrapped. `name: 🐛 "playwright"`
  // is an unquoted scalar that happens to contain quotes; chopping the last
  // character turns it into `🐛 "playwright`.
  const wrapped = v.length >= 2 && (v[0] === '"' || v[0] === "'") && v.at(-1) === v[0];
  return wrapped ? v.slice(1, -1) : v;
};

const setKey = (fm, key, value) => {
  const line = `${key}: ${JSON.stringify(value)}`;
  const re = new RegExp(`^${key}:[ \\t]*.*$`, "m");
  return re.test(fm) ? fm.replace(re, line) : `${line}\n${fm}`;
};

// Skip the run of headings and blank lines the file opens with, then take the
// first prose paragraph.
const deriveDescription = (body) => {
  const lines = body.replace(/^\s+/, "").split("\n");
  let i = 0;
  while (i < lines.length && (!lines[i].trim() || lines[i].startsWith("#"))) i++;
  const para = [];
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) break;
    // Only real list markers stop us: "- item", "* item", "1. item". A line
    // opening "**Purpose**: ..." is prose, and two skills lead with exactly that.
    if (/^(#|\||```|>|[-*+]\s|\d+\.\s)/.test(l)) break;
    para.push(l);
  }
  let d = para.join(" ")
    .replace(/\*\*(.+?)\*\*/g, "$1")   // emphasis reads badly in a description
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (d.length > MAX_DESC) d = d.slice(0, MAX_DESC).replace(/\s+\S*$/, "") + "…";
  return d;
};

const changes = [];
for (const file of walk(LIB)) {
  const raw = fs.readFileSync(file, "utf8");
  const dir = path.basename(path.dirname(file));
  const want = slug(dir);
  const parsed = splitFrontmatter(raw);

  // One file ships with no frontmatter at all — nothing to edit, so the block
  // has to be created from scratch.
  if (!parsed) {
    const body = raw.replace(BOM, "").replace(CRLF, "\n");
    changes.push({
      file, dir, create: true,
      setName: want,
      setTitle: synthTitle(body, dir),
      setDescription: deriveDescription(body) || titleCase(dir),
    });
    continue;
  }

  const name = readKey(parsed.fm, "name");
  const title = readKey(parsed.fm, "title");

  // A multi-line value reads as "" here. It is present, so leave it alone —
  // rewriting it would strand its continuation lines.
  const multilineDesc = hasKey(parsed.fm, "description") && !readKey(parsed.fm, "description");
  const multilineName = hasKey(parsed.fm, "name") && !name;

  const c = { file, dir, from: name };
  if (!multilineName && name !== want) c.setName = want;
  // Preserve the decorative form only when it says something the slug does not.
  if (!title && name && name !== want) c.setTitle = name;
  if (!title && !name && !multilineName) c.setTitle = synthTitle(parsed.body, dir);
  if (!hasKey(parsed.fm, "description")) {
    const d = deriveDescription(parsed.body);
    if (d) c.setDescription = d;
    else c.skip = "no description derivable";
  } else if (multilineDesc) {
    c.note = "multi-line description left as-is";
  }
  if (c.setName || c.setTitle || c.setDescription || c.skip) changes.push(c);
}

const n = (k) => changes.filter((c) => c[k]).length;
console.log(`skills touched:        ${changes.filter((c) => !c.skip).length}`);
console.log(`  name rewritten:      ${n("setName")}`);
console.log(`  title preserved:     ${n("setTitle")}`);
console.log(`  description derived: ${n("setDescription")}`);
console.log(`  frontmatter created: ${n("create")}`);
const skips = changes.filter((c) => c.skip);
if (skips.length) {
  console.log(`  needs a human:       ${skips.length}`);
  for (const s of skips) console.log(`      ${s.skip}: ${path.relative(LIB, s.file)}`);
}

console.log(`\nsample renames:`);
for (const c of changes.filter((x) => x.setName && x.setTitle).slice(0, 6)) {
  console.log(`  ${path.relative(LIB, c.file).split(path.sep).join("/")}`);
  console.log(`      name:  ${JSON.stringify(c.from)} -> ${JSON.stringify(c.setName)}`);
  console.log(`      title: ${JSON.stringify(c.setTitle)}`);
}
console.log(`\nsample derived descriptions:`);
for (const c of changes.filter((x) => x.setDescription).slice(0, 4)) {
  console.log(`  ${path.relative(LIB, c.file).split(path.sep).join("/")}`);
  console.log(`      ${JSON.stringify(c.setDescription.slice(0, 120))}`);
}

if (!WRITE) { console.log(`\n(dry run — pass --write to apply)`); process.exit(0); }

let written = 0;
for (const c of changes) {
  const raw = fs.readFileSync(c.file, "utf8");
  const crlf = CRLF.test(raw);
  CRLF.lastIndex = 0;
  const t = raw.replace(BOM, "").replace(CRLF, "\n");
  let next;

  if (c.create) {
    const fm = [
      `name: ${JSON.stringify(c.setName)}`,
      `description: ${JSON.stringify(c.setDescription)}`,
      `title: ${JSON.stringify(c.setTitle)}`,
    ].join("\n");
    next = `---\n${fm}\n---\n\n${t.replace(/^\s+/, "")}`;
  } else {
    if (!c.setName && !c.setTitle && !c.setDescription) continue;
    const end = t.indexOf("\n---", 3);
    let fm = t.slice(4, end);
    if (c.setDescription) fm = setKey(fm, "description", c.setDescription);
    if (c.setTitle) fm = setKey(fm, "title", c.setTitle);
    if (c.setName) fm = setKey(fm, "name", c.setName);
    next = `---\n${fm}\n---${t.slice(end + 4)}`;
  }

  fs.writeFileSync(c.file, crlf ? next.replace(/\n/g, "\r\n") : next);
  written++;
}
console.log(`\nrewrote ${written} files`);
