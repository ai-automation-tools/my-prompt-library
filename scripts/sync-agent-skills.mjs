#!/usr/bin/env node
/**
 * Pull new skills from the org's own `ai-automation-tools/agent-skills` repo into
 * `site/library/3_Skills`, with provenance stamped the way every other vendored
 * skill carries it.
 *
 * Adds only. A skill that is already here (same upstream path, or a directory of
 * the same name anywhere in 3_Skills) is left alone: the weekly drift check and
 * the Saturday resync own updates, and this script must not fight them.
 *
 * Why a script and not a model: agent-skills is validated, licensed and already
 * fed by the Skill Harvest. Copying a folder and writing a frontmatter block is a
 * deterministic job, so it runs as one (jobs\prompt-library-skills-sync in the
 * Routines fleet) with no Claude session.
 *
 * Usage (from the repo root):
 *   node scripts/sync-agent-skills.mjs --source <agent-skills checkout> [--ref <sha>]
 *   node scripts/sync-agent-skills.mjs --source ... --write      # copy + stamp + changelog
 *
 * Prints one `ADDED` / `SKIPPED` line per skill and a final `RUN SUMMARY:` line,
 * which the fleet's report email quotes. Exit 0 whenever it ran; the wrapper
 * decides whether "added 0" is worth a PR (it is not).
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const arg = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const WRITE = args.includes("--write");

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const LIB = path.join(ROOT, "site", "library", "3_Skills");
const CHANGELOG = path.join(ROOT, "docs", "CHANGELOG.md");
const SOURCE = path.resolve(arg("--source") || path.join(ROOT, "..", "..", "Tools", "agent-skills"));
const REPO = "ai-automation-tools/agent-skills";
const TODAY = new Date().toISOString().slice(0, 10);
const MAX_FILE = 500 * 1024; // the index skips anything larger; so do we

if (!fs.existsSync(path.join(SOURCE, "Skills"))) {
  console.error(`ERROR: no Skills/ folder under ${SOURCE}; pass --source <agent-skills checkout>`);
  process.exit(2);
}
let REF = arg("--ref");
if (!REF) {
  try { REF = execSync("git rev-parse HEAD", { cwd: SOURCE, encoding: "utf8" }).trim(); }
  catch { REF = "unknown"; }
}

// agent-skills area  ->  3_Skills category / subcategory. Project skills land under
// Platform_Integrations by project, which is where the library already keeps
// tool-specific skills (linear, notion, n8n).
const AREA = {
  "Core/Automation": ["Development", "Automation"],
  "Core/Business": ["Business", "Strategy"],
  "Core/Cooking": ["Content", "Cooking"],
  "Core/Documentation": ["Content", "Documentation"],
  "Core/Image-Gen": ["Content", "Image_Generation"],
  "Core/Web": ["Development", "Web_Development"],
  "Domain/API": ["Development", "API"],
  "Domain/Business": ["Business", "Strategy"],
  "Domain/Engineering": ["Development", "Engineering"],
  "Domain/Media": ["Content", "Media"],
  "Domain/Security": ["Security", "Practice"],
};
const EMOJI = {
  AI_ML: "🤖", Business: "💼", Content: "✍️", Data: "📊", Design: "🎨", Development: "💻",
  Enterprise: "🏢", Finance: "💰", Platform_Integrations: "🔌", Security: "🛡️",
};
const titleCase = (s) => s.split(/[-_\s]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join("_");
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const destFor = (area, project) => {
  if (area.startsWith("Projects/")) return ["Platform_Integrations", titleCase(project)];
  if (AREA[area]) return AREA[area];
  const [, sub] = area.split("/");
  return ["Development", titleCase(sub || "General")];
};

// ---------- what the library already holds ----------
const walk = (d, out = []) => {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === "SKILL.md") out.push(p);
  }
  return out;
};
const splitFrontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return { fm: "", body: t };
  const end = t.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: t };
  return { fm: t.slice(4, end), body: t.slice(end + 4) };
};
const readUpstream = (fm) => {
  const m = fm.match(/^upstream:\n((?:[ \t]+.*\n?)*)/m);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s+([a-z_]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
};

const presentPaths = new Set();
const presentNames = new Set();
for (const f of walk(LIB)) {
  presentNames.add(path.basename(path.dirname(f)).toLowerCase());
  const u = readUpstream(splitFrontmatter(fs.readFileSync(f, "utf8")).fm);
  if (u && u.repo === REPO && u.path) presentPaths.add(u.path);
}

// ---------- candidates ----------
const candidates = [];
for (const f of walk(path.join(SOURCE, "Skills")).sort()) {
  const rel = path.relative(SOURCE, f).split(path.sep).join("/"); // Skills/Core/Web/x/SKILL.md
  const parts = rel.split("/");
  const name = parts[parts.length - 2];
  const area = parts.slice(1, -2).join("/"); // Core/Web  |  Projects/cronsole
  const project = parts.length > 4 ? parts[2] : "";
  candidates.push({ rel, dir: path.dirname(f), name, area, project });
}

// ---------- copy + stamp ----------
const copyTree = (from, to, notes) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) { copyTree(s, d, notes); continue; }
    if (e.name === "SKILL.md") continue; // written separately, with the stamp
    if (fs.statSync(s).size > MAX_FILE) { notes.push(`left out ${e.name} (over 500 KB)`); continue; }
    fs.copyFileSync(s, d);
  }
};

const stampedSkill = (raw, { name, category, subcategory, srcPath }) => {
  const { fm, body } = splitFrontmatter(raw);
  // Keep the upstream's own keys (name, description, ...) and add ours around them.
  // Two repairs on the way through, both learned on the first dry run: a key we
  // replace (title/tags/upstream) takes its indented continuation lines with it,
  // and a one-line plain scalar holding ": " or " #" (two upstream descriptions
  // did) is quoted, since js-yaml refuses it and the index would drop the skill.
  const segments = [];
  for (const line of fm.split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*):(.*)$/);
    if (m) segments.push({ key: m[1], rest: m[2], lines: [line] });
    else if (segments.length) segments[segments.length - 1].lines.push(line);
  }
  const kept = segments
    .filter((s) => !["title", "tags", "upstream"].includes(s.key))
    .map((s) => {
      const v = s.rest.trim();
      if (s.lines.length === 1 && v && !/^["'[{|>]/.test(v) && /: |\s#/.test(v)) return `${s.key}: ${JSON.stringify(v)}`;
      return s.lines.join("\n");
    })
    .join("\n")
    .replace(/\n+$/, "");
  const tags = JSON.stringify(["skill", slug(category), slug(subcategory), "agent-skills"].filter((t, i, a) => t && a.indexOf(t) === i));
  const out = [
    "---",
    `title: "${EMOJI[category] || "🧰"} ${name}"`,
    kept,
    `tags: ${tags}`,
    "upstream:",
    "  match: exact",
    `  repo: ${REPO}`,
    `  path: ${srcPath}`,
    `  ref: ${REF}`,
    `  checked: ${TODAY}`,
    "---",
    body.replace(/^\n+/, "\n"),
  ].join("\n");
  return out.endsWith("\n") ? out : out + "\n";
};

const added = [], skipped = [];
for (const c of candidates) {
  if (presentPaths.has(c.rel)) { skipped.push(`${c.name}: present`); continue; }
  if (presentNames.has(c.name.toLowerCase())) { skipped.push(`${c.name}: a skill of that name is already in the library`); continue; }
  const [category, subcategory] = destFor(c.area, c.project);
  const dest = path.join(LIB, category, subcategory, c.name);
  const notes = [];
  if (WRITE) {
    copyTree(c.dir, dest, notes);
    fs.writeFileSync(path.join(dest, "SKILL.md"),
      stampedSkill(fs.readFileSync(path.join(c.dir, "SKILL.md"), "utf8"), { name: c.name, category, subcategory, srcPath: c.rel }),
      { encoding: "utf8" });
  }
  added.push({ ...c, category, subcategory, notes });
  console.log(`ADDED ${category}/${subcategory}/${c.name} <- ${c.rel}${notes.length ? ` (${notes.join("; ")})` : ""}`);
}
for (const s of skipped) console.log(`SKIPPED ${s}`);

if (WRITE && added.length) {
  const lines = [
    `## ${TODAY} — ${added.length} ${added.length === 1 ? "skill" : "skills"} synced from agent-skills`,
    "",
    "**Content**",
    `- Copied from \`${REPO}\` at \`${REF.slice(0, 7)}\` by \`scripts/sync-agent-skills.mjs\` (the weekly Skills Sync job), each with an \`upstream:\` block so the Monday drift check tracks it from here on:`,
    ...added.map((a) => `  - \`3_Skills/${a.category}/${a.subcategory}/${a.name}/\` ← \`${a.rel}\`${a.notes.length ? ` (${a.notes.join("; ")})` : ""}`),
    "",
    "_Touched: the folders above, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._",
    "",
  ];
  const log = fs.readFileSync(CHANGELOG, "utf8");
  const at = log.indexOf("\n## ");
  fs.writeFileSync(CHANGELOG, at === -1 ? log + "\n" + lines.join("\n") : log.slice(0, at + 1) + lines.join("\n") + log.slice(at + 1), "utf8");
}

console.log(`RUN SUMMARY: added ${added.length}, skipped ${skipped.length}, source ${REPO}@${REF.slice(0, 7)}${WRITE ? "" : " (dry run)"}`);
