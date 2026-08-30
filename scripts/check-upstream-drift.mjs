#!/usr/bin/env node
/**
 * Compare every vendored skill against its upstream and report what has moved.
 *
 * Reads the `upstream:` block that `attribute-upstream.mjs` stamped, resolves
 * the file in the upstream repo, and compares bodies with frontmatter stripped.
 * That last part matters: local copies carry an emoji in `name:` and an
 * `upstream:` block, so a raw file comparison would report all ~350 skills as
 * drifted every week and the report would be worthless.
 *
 * Path resolution, not path trust: attributions sourced through the mirror carry
 * the mirror's own layout, not the origin repo's — the mirror stores Anthropic's
 * claude-api at `claude-api/SKILL.md` while the repo has it at
 * `skills/claude-api/SKILL.md`. Taking those paths at face value reported 72
 * live files as deleted. So each repo's tree is fetched once and the skill is
 * located by directory name, which costs fewer API calls than per-file fetching
 * anyway.
 *
 * Skips `match: unknown`, `match: ambiguous` and `match: fork` — there is no
 * single live upstream to compare against, and guessing would produce confident
 * nonsense. `behind` here is a freshness *verdict* this script assigns; it is
 * not an `upstream.match` value (attribute-upstream.mjs calls that `similar`).
 *
 * Reports, never edits. Curation is the product; an auto-merge that reflowed 300
 * files into the wrong categories would destroy it.
 *
 * Usage:
 *   node scripts/check-upstream-drift.mjs                 # markdown to stdout
 *   node scripts/check-upstream-drift.mjs --out drift.md
 *
 * Auth: uses GITHUB_TOKEN if set (60 req/h anonymous, 5000 authenticated).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const OUT = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library");

const TOKEN = process.env.GITHUB_TOKEN || "";
const api = { "User-Agent": "my-prompt-library-drift-check", Accept: "application/vnd.github+json" };
if (TOKEN) api.Authorization = `Bearer ${TOKEN}`;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex");
const words = (s) => norm(s).split(" ").filter(Boolean).length;

const splitFrontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return { fm: "", body: t };
  const end = t.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: t };
  return { fm: t.slice(4, end), body: t.slice(end + 4) };
};

// Small reader for the one nested block we write ourselves. A YAML dependency
// for five known keys is a dependency we would have to keep patched forever.
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

const walk = (dir, match, out = []) => {
  let es;
  try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, match, out);
    else if (match(e.name)) out.push(p);
  }
  return out;
};

// ---------- collect targets ----------
const targets = [], skipped = { unknown: 0, ambiguous: 0, fork: 0, none: 0 };
for (const f of walk(path.join(LIB, "3_Skills"), (n) => n === "SKILL.md")) {
  const { fm, body } = splitFrontmatter(fs.readFileSync(f, "utf8"));
  const u = readUpstream(fm);
  if (!u) { skipped.none++; continue; }
  if (u.match === "unknown") { skipped.unknown++; continue; }
  if (u.match === "ambiguous") { skipped.ambiguous++; continue; }
  if (u.match === "fork") { skipped.fork++; continue; }  // upstream deleted the file; this copy is ours now
  if (!u.repo) { skipped.none++; continue; }
  const rel = path.relative(LIB, f).split(path.sep).join("/");
  targets.push({ file: rel, u, body, dirName: rel.split("/").slice(-2)[0] });
}

console.error(`attributed skills to check: ${targets.length}`);
console.error(`skipping ${skipped.unknown} unknown, ${skipped.ambiguous} ambiguous, ${skipped.fork} fork, ${skipped.none} unstamped`);
if (!TOKEN) console.error("no GITHUB_TOKEN — anonymous limit is 60/h, expect throttling");

// ---------- one tree per repo ----------
const repos = [...new Set(targets.map((t) => t.u.repo))];
console.error(`upstream repos: ${repos.length}`);

const trees = new Map();
let rateLimited = false;
for (const repo of repos) {
  if (rateLimited) break;
  try {
    const meta = await fetch(`https://api.github.com/repos/${repo}`, { headers: api });
    if (meta.status === 404) { trees.set(repo, { gone: true }); continue; }
    if (meta.status === 403 || meta.status === 429) { rateLimited = true; break; }
    if (!meta.ok) { trees.set(repo, { error: `HTTP ${meta.status}` }); continue; }
    const branch = (await meta.json()).default_branch;
    const tr = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, { headers: api });
    if (!tr.ok) { trees.set(repo, { error: `tree HTTP ${tr.status}` }); continue; }
    const data = await tr.json();
    const paths = (data.tree || []).filter((x) => x.type === "blob" && /(^|\/)SKILL\.md$/i.test(x.path))
      .map((x) => x.path);
    trees.set(repo, { branch, paths });
  } catch (e) {
    trees.set(repo, { error: String(e.message || e) });
  }
}
if (rateLimited) console.error("rate limited while fetching trees — report will be partial");

// ---------- resolve + compare ----------
const rows = [];
for (const t of targets) {
  const tree = trees.get(t.u.repo);
  if (!tree) { rows.push({ ...t, verdict: "error", detail: "not fetched" }); continue; }
  if (tree.gone) { rows.push({ ...t, verdict: "repo-gone" }); continue; }
  if (tree.error) { rows.push({ ...t, verdict: "error", detail: tree.error }); continue; }

  // Prefer the stamped path when it really exists upstream; otherwise locate the
  // skill by its directory name, which survives the mirror's re-layout.
  let resolved = tree.paths.includes(t.u.path) ? t.u.path : null;
  if (!resolved) {
    const wanted = (t.u.path || "").split("/").slice(-2)[0] || t.dirName;
    resolved = tree.paths.find((p) => p.split("/").slice(-2)[0] === wanted)
      || tree.paths.find((p) => p.split("/").slice(-2)[0] === t.dirName)
      || null;
  }
  if (!resolved) { rows.push({ ...t, verdict: "upstream-gone" }); continue; }

  // raw.githubusercontent does not consume the API quota.
  let text;
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${t.u.repo}/${tree.branch}/${resolved}`);
    if (!r.ok) { rows.push({ ...t, resolved, verdict: "error", detail: `raw HTTP ${r.status}` }); continue; }
    text = await r.text();
  } catch (e) {
    rows.push({ ...t, resolved, verdict: "error", detail: String(e.message || e) });
    continue;
  }

  const up = splitFrontmatter(text);
  const lw = words(t.body), uw = words(up.body);
  const moved = resolved !== t.u.path;
  if (sha1(norm(t.body)) === sha1(norm(up.body))) {
    rows.push({ ...t, resolved, moved, verdict: "current", lw, uw });
  } else {
    rows.push({ ...t, resolved, moved, lw, uw, verdict: uw && lw / uw < 0.75 ? "behind" : "drifted" });
  }
}

// ---------- report ----------
const by = (v) => rows.filter((r) => r.verdict === v);
const MEAN = {
  "repo-gone": "the whole upstream repo 404s",
  "upstream-gone": "no SKILL.md of this name left in the upstream repo",
  behind: "local copy is missing more than 25% of upstream's content",
  drifted: "bodies differ, sizes comparable",
  error: "could not be fetched",
  current: "body identical to upstream",
};
const order = ["repo-gone", "upstream-gone", "behind", "drifted", "error", "current"];

const md = [`# Upstream drift — ${new Date().toISOString().slice(0, 10)}`, ""];
md.push(`Checked **${rows.length}** attributed skills across **${repos.length}** upstream repos. ` +
  `Skipped ${skipped.unknown} \`unknown\` and ${skipped.ambiguous} \`ambiguous\` — no single upstream to compare against — ` +
  `and ${skipped.fork} \`fork\` whose upstream deleted the file.`);
md.push("");
md.push("| verdict | count | meaning |");
md.push("|:---|---:|:---|");
for (const v of order) if (by(v).length) md.push(`| \`${v}\` | ${by(v).length} | ${MEAN[v]} |`);
md.push("");

for (const v of ["repo-gone", "upstream-gone", "behind", "drifted", "error"]) {
  const list = by(v);
  if (!list.length) continue;
  md.push(`## ${v} (${list.length})`, "");
  if (v === "behind" || v === "drifted") {
    md.push("| skill | upstream | local | upstream | missing |");
    md.push("|:---|:---|---:|---:|---:|");
    for (const r of list.sort((a, b) => a.lw / (a.uw || 1) - b.lw / (b.uw || 1))) {
      const link = `[${r.u.repo}/${r.resolved}](https://github.com/${r.u.repo}/blob/${trees.get(r.u.repo).branch}/${r.resolved})`;
      const pct = r.uw ? Math.max(0, Math.round((1 - r.lw / r.uw) * 100)) : 0;
      md.push(`| \`${r.file.replace(/^3_Skills\//, "")}\` | ${link} | ${r.lw} | ${r.uw} | ${pct}% |`);
    }
  } else {
    md.push("| skill | upstream | detail |");
    md.push("|:---|:---|:---|");
    for (const r of list) {
      md.push(`| \`${r.file.replace(/^3_Skills\//, "")}\` | ${r.u.repo} | ${r.detail || ""} |`);
    }
  }
  md.push("");
}

if (by("current").length) {
  md.push(`<details><summary>${by("current").length} current</summary>`, "");
  for (const r of by("current")) md.push(`- \`${r.file.replace(/^3_Skills\//, "")}\` — ${r.u.repo}`);
  md.push("", "</details>");
}

const text = md.join("\n") + "\n";
if (OUT) { fs.writeFileSync(OUT, text); console.error(`wrote ${OUT}`); }
else console.log(text);

// Drift is the expected output, so finding it is not a failure. A red X every
// week just teaches people to ignore the job.
process.exit(by("error").length > rows.length / 2 ? 1 : 0);
