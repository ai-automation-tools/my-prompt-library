#!/usr/bin/env node
/**
 * Give every indexed library file at least one tag, derived from where it sits.
 *
 * The site's tag filter and ⌘K search read `tags:`; a file without any is
 * invisible to both. On 2026-10-21 that was 241 skills, 162 agents, 21 prompts
 * and 6 system prompts. The tags come from the path (section, category,
 * subcategory), which is the one fact every file has, so the result is
 * deterministic and the Monthly Upkeep can re-run this to keep the count at zero.
 *
 * Text edits only. The frontmatter is kept byte-for-byte apart from the one
 * inserted `tags:` line (or a prepended block for files with no frontmatter),
 * so the drift check's body comparison and the skill-frontmatter test are
 * unaffected. Never touches a file that already has a non-empty `tags:`.
 *
 * Usage (from the repo root):
 *   node scripts/backfill-tags.mjs            # report
 *   node scripts/backfill-tags.mjs --write    # stamp
 */
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const LIB = path.join(ROOT, "site", "library");

const SECTION_TAG = {
  "1_Guides": "guide", "2_Agents": "agent", "3_Skills": "skill", "4_Prompts": "prompt", "5_System_Prompts": "system-prompt",
};
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Same walk the index builder does: README.md skipped, only SKILL.md under 3_Skills,
// files over 500 KB skipped. Anything else here is not shown on the site anyway.
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!(d === LIB && e.name === "Legacy")) walk(p, out); continue; }
    if (!e.name.endsWith(".md") || e.name === "README.md") continue;
    const rel = path.relative(LIB, p).split(path.sep).join("/");
    if (rel.startsWith("3_Skills/") && e.name !== "SKILL.md") continue;
    if (fs.statSync(p).size > 500 * 1024) continue;
    out.push({ p, rel });
  }
  return out;
};

const splitFrontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "");
  const nl = t.includes("\r\n") ? "\r\n" : "\n";
  if (!t.startsWith("---" + nl)) return { fm: null, body: t, nl };
  const end = t.indexOf(nl + "---", 3);
  if (end === -1) return { fm: null, body: t, nl };
  return { fm: t.slice(3 + nl.length, end), body: t.slice(end + nl.length + 3), nl };
};
const topLevelTags = (fm) => fm.match(/^tags:[ \t]*(.*)$/m); // indented keys (upstream.*) never match
const hasTags = (fm) => {
  const m = topLevelTags(fm);
  if (!m) return false;
  const v = m[1].trim();
  if (v && v !== "[]") return true;
  // block-list form:  tags:\n  - a
  const after = fm.slice(m.index + m[0].length);
  return /^\s*\n\s+-\s+\S/.test("\n" + after);
};
const firstHeading = (body) => (body.match(/^#\s+(.+)$/m) || [])[1]?.trim() || null;

const counts = {};
let touched = 0;
for (const { p, rel } of walk(LIB)) {
  const [section, category, ...rest] = rel.split("/");
  const subcategory = rest.length > 1 ? rest[0] : null;
  const raw = fs.readFileSync(p, "utf8");
  const { fm, body, nl } = splitFrontmatter(raw);
  if (fm !== null && hasTags(fm)) continue;

  const tags = [SECTION_TAG[section] || slug(section), slug(category || "")];
  if (subcategory && slug(subcategory) !== slug(category)) tags.push(slug(subcategory));
  const tagLine = `tags: ${JSON.stringify(tags.filter(Boolean))}`;

  let out;
  if (fm === null) {
    const title = firstHeading(body) || path.basename(p, ".md");
    out = `---${nl}title: ${JSON.stringify(title)}${nl}${tagLine}${nl}---${nl}${nl}${raw.replace(/^﻿/, "")}`;
  } else {
    let newFm;
    const empty = topLevelTags(fm);
    if (empty) newFm = fm.replace(empty[0], tagLine); // `tags: []` -> real tags
    else {
      const lines = fm.split(nl);
      const i = lines.findIndex((l) => /^title:/.test(l));
      if (i !== -1) lines.splice(i + 1, 0, tagLine); else lines.push(tagLine);
      newFm = lines.join(nl);
    }
    out = `---${nl}${newFm}${nl}---${body}`;
  }
  counts[section] = (counts[section] || 0) + 1;
  touched++;
  if (WRITE) fs.writeFileSync(p, out, "utf8");
}

for (const s of Object.keys(counts).sort()) console.log(`${WRITE ? "tagged" : "untagged"} ${s}: ${counts[s]}`);
console.log(`RUN SUMMARY: ${WRITE ? "tagged" : "would tag"} ${touched} files`);
