#!/usr/bin/env node
/**
 * Work out where each vendored SKILL.md came from, and stamp it into frontmatter.
 *
 * Why content matching and not names: local skills were renamed on the way in
 * (anthropic-brand-guidelines vs upstream brand-guidelines, docx-official vs
 * docx), so matching on directory name found 72 of 347. Bodies survive renaming.
 *
 * Two evidence sources:
 *   1. directly cloned publishers — authoritative, and they yield a real commit
 *      sha, which is what `check-upstream-drift.mjs` needs to diff against
 *   2. a mirror repo (learn-skills.dev) carrying ~110k skills with the origin
 *      repo encoded in the path — this is what covers the long tail of tiny
 *      publishers that would otherwise be untraceable
 *
 * A body found in many mirror repos is a widely-forked skill. Naming one of them
 * "the" origin would be a guess wearing a fact's clothes, so those are recorded
 * as `match: ambiguous` with the candidates listed, and the drift checker skips
 * them. Same for `match: unknown` — that records "we looked and could not tell",
 * which is different from "nobody has checked", and stops the next person
 * repeating this whole exercise.
 *
 * `match:` is attribution confidence — how sure we are this is the origin —
 * and nothing else: `exact` | `prefix` | `similar` | `ambiguous` | `unknown`,
 * plus `fork` stamped by hand when an upstream deletes the file. It is not a
 * freshness verdict. Do not name a value `behind`, `drifted` or `current`:
 * those belong to `check-upstream-drift.mjs`, which computes them fresh every
 * Monday from the live upstream. `similar` was called `behind` until
 * 2026-08-31, and seven skills spent a fortnight looking like they were rotting
 * when all the field ever said was "we matched this by shingles, not bytes".
 *
 * Setup (the clones are large, so they live outside the repo):
 *   mkdir -p /tmp/upstream && cd /tmp/upstream
 *   for r in anthropics/skills huggingface/skills vercel-labs/skills \
 *            wshobson/agents obra/superpowers github/awesome-copilot \
 *            openai/plugins NeverSight/learn-skills.dev; do
 *     git clone --depth 1 "https://github.com/$r.git" "$(echo $r | tr / _)"
 *   done
 *
 * Usage:
 *   node scripts/attribute-upstream.mjs --mirrors /tmp/upstream            # report
 *   node scripts/attribute-upstream.mjs --mirrors /tmp/upstream --write    # stamp
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const MIRRORS = args[args.indexOf("--mirrors") + 1];
const WRITE = args.includes("--write");
const OUT = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library");

if (!MIRRORS || !fs.existsSync(MIRRORS)) {
  console.error("--mirrors <dir> is required; see the header comment for the clone commands.");
  process.exit(1);
}

// Publishers cloned in full. Anything else is reached through the mirror.
const DIRECT = {
  anthropics_skills: "anthropics/skills",
  huggingface_skills: "huggingface/skills",
  "vercel-labs_skills": "vercel-labs/skills",
  wshobson_agents: "wshobson/agents",
  obra_superpowers: "obra/superpowers",
  "github_awesome-copilot": "github/awesome-copilot",
  openai_plugins: "openai/plugins",
};
const MIRROR = "NeverSight_learn-skills.dev";
const AMBIGUOUS_AT = 3;

// A skill forked into forty repos is still its author's skill. When a body is
// ambiguous across mirror repos but one candidate is a first-party publisher,
// that publisher is the origin — otherwise `docx` gets attributed to whichever
// fork sorts first, which is how pptx/docx/xlsx/claude-api all ended up
// credited to random personal dotfile repos on the first pass.
const FIRST_PARTY = /^(anthropics|openai|huggingface|vercel-labs|vercel|github|microsoft|google|googleapis|obra|neondatabase|supabase|mem0ai|stripe|cloudflare)\//i;
const TODAY = new Date().toISOString().slice(0, 10);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex");

const splitFrontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return null;
  const end = t.indexOf("\n---", 3);
  if (end === -1) return null;
  return { fm: t.slice(4, end), body: t.slice(end + 4) };
};
const fmField = (fm, names) => {
  const m = fm.match(new RegExp(`^(?:${names.join("|")}):\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
};
// 8-word shingles, every other word. Only built for the ~1.3k directly-cloned
// files: this is the tier that catches a skill which is genuinely the upstream
// one but has fallen badly behind, which is exactly what we most want to find.
const shingles = (body) => {
  const w = norm(body).split(" ").filter(Boolean);
  const out = new Set();
  for (let i = 0; i + 8 <= w.length; i += 2) out.add(w.slice(i, i + 8).join(" "));
  return out;
};

const prefixKey = (body) => {
  const w = norm(body).split(" ").filter(Boolean).slice(0, 60);
  return w.length >= 40 ? sha1(w.join(" ")) : null;
};

const walk = (dir, match, out = []) => {
  let es;
  try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    if (e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, match, out);
    else if (match(e.name)) out.push(p);
  }
  return out;
};

const headSha = (root) => {
  const h = fs.readFileSync(path.join(root, ".git", "HEAD"), "utf8").trim();
  return h.startsWith("ref:")
    ? fs.readFileSync(path.join(root, ".git", h.slice(5).trim()), "utf8").trim()
    : h;
};

// ---------- index the directly cloned publishers ----------
const dByBody = new Map(), dByPrefix = new Map(), dByShingle = new Map(), dByName = new Map();
for (const [dirName, repo] of Object.entries(DIRECT)) {
  const root = path.join(MIRRORS, dirName);
  if (!fs.existsSync(root)) { console.error(`missing clone: ${dirName}`); continue; }
  const ref = headSha(root);
  for (const f of walk(root, (n) => n === "SKILL.md")) {
    const parsed = splitFrontmatter(fs.readFileSync(f, "utf8"));
    if (!parsed) continue;
    const rec = { repo, ref, path: path.relative(root, f).split(path.sep).join("/") };
    const bh = sha1(norm(parsed.body));
    if (!dByBody.has(bh)) dByBody.set(bh, rec);
    const pk = prefixKey(parsed.body);
    if (pk && !dByPrefix.has(pk)) dByPrefix.set(pk, rec);
    const nm = rec.path.split("/").slice(-2)[0];
    // First-party publishers win the name slot; two of them rarely collide.
    if (nm && !dByName.has(nm)) dByName.set(nm, rec);
    const sh = shingles(parsed.body);
    rec.shSize = sh.size;
    for (const g of sh) {
      if (!dByShingle.has(g)) dByShingle.set(g, []);
      dByShingle.get(g).push(rec);
    }
  }
}
console.error(`direct publishers indexed: ${dByBody.size} distinct bodies`);

// ---------- index the mirror, straight from the object store ----------
// It never checks out on Windows (path lengths), and we only need hashes anyway.
const mirrorRoot = path.join(MIRRORS, MIRROR);
const mByBody = new Map(), mByPrefix = new Map();

if (fs.existsSync(mirrorRoot)) {
  const tree = await new Promise((res) => {
    const p = spawn("git", ["-C", mirrorRoot, "ls-tree", "-r", "HEAD"], { maxBuffer: 1 << 30 });
    let b = ""; p.stdout.setEncoding("utf8");
    p.stdout.on("data", (d) => (b += d)); p.on("close", () => res(b));
  });
  const blobs = [];
  for (const line of tree.split("\n")) {
    if (!line.endsWith("/SKILL.md")) continue;
    const tab = line.indexOf("\t");
    const [, type, sha] = line.slice(0, tab).split(/\s+/);
    if (type === "blob") blobs.push({ sha, path: line.slice(tab + 1) });
  }
  console.error(`mirror blobs: ${blobs.length}`);

  // data/skills-md/<owner>/<repo>/<rest>/SKILL.md
  const originOf = (p) => {
    const s = p.split("/");
    return s[0] === "data" && s[1] === "skills-md" && s.length >= 5
      ? { repo: `${s[2]}/${s[3]}`, path: s.slice(4).join("/") }
      : { repo: "NeverSight/learn-skills.dev", path: p };
  };
  const add = (map, key, o) => {
    if (!key) return;
    const cur = map.get(key);
    if (!cur) { map.set(key, { n: 1, repos: [o.repo], path: o.path }); return; }
    if (!cur.repos.includes(o.repo)) { cur.n++; if (cur.repos.length < 8) cur.repos.push(o.repo); }
  };

  await new Promise((done) => {
    const cat = spawn("git", ["-C", mirrorRoot, "cat-file", "--batch"]);
    let buf = Buffer.alloc(0), i = 0, seen = 0;
    cat.stdout.on("data", (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      for (;;) {
        const nl = buf.indexOf(10);
        if (nl === -1) break;
        const parts = buf.subarray(0, nl).toString("utf8").split(" ");
        if (parts.length < 3) { buf = buf.subarray(nl + 1); continue; }
        const size = parseInt(parts[2], 10);
        if (buf.length < nl + 1 + size + 1) break;
        const content = buf.subarray(nl + 1, nl + 1 + size).toString("utf8");
        buf = buf.subarray(nl + 1 + size + 1);
        const e = blobs[seen++];
        const parsed = splitFrontmatter(content);
        if (parsed) {
          const o = originOf(e.path);
          add(mByBody, sha1(norm(parsed.body)), o);
          add(mByPrefix, prefixKey(parsed.body), o);
        }
      }
    });
    const pump = () => {
      while (i < blobs.length) {
        if (!cat.stdin.write(blobs[i++].sha + "\n")) { cat.stdin.once("drain", pump); return; }
      }
      cat.stdin.end();
    };
    pump();
    cat.stdout.on("end", done);
  });
  console.error(`mirror indexed: ${mByBody.size} distinct bodies`);
}

// ---------- attribute ----------
const results = [];
for (const f of walk(path.join(LIB, "3_Skills"), (n) => n === "SKILL.md")) {
  const raw = fs.readFileSync(f, "utf8");
  const parsed = splitFrontmatter(raw);
  const rel = path.relative(LIB, f).split(path.sep).join("/");
  if (!parsed) { results.push({ file: f, rel, match: "unknown", note: "no frontmatter" }); continue; }

  const bh = sha1(norm(parsed.body)), pk = prefixKey(parsed.body);
  const declared = fmField(parsed.fm, ["source", "repository", "source_repository"]) || null;
  let out = { file: f, rel, declared };

  const fromMirror = (hit, match) => {
    const fp = hit.repos.find((r) => FIRST_PARTY.test(r));
    if (fp) return { match, repo: fp, path: hit.path, ref: null, copies: hit.n };
    return hit.n >= AMBIGUOUS_AT
      ? { match: "ambiguous", copies: hit.n, candidates: hit.repos }
      : { match, repo: hit.repos[0], path: hit.path, ref: null };
  };

  // Last resort before giving up: a directly-cloned first-party publisher ships
  // a skill of exactly this directory name. Name alone is weak, but "a
  // first-party repo has this exact skill name" is strong enough to record as
  // `similar` for a human to confirm.
  const dirName = rel.split("/").slice(-2)[0];
  const byName = dByName.get(dirName);

  // Best shingle overlap against a direct publisher: same skill, drifted.
  let near = null, nearScore = 0;
  {
    const sh = shingles(parsed.body);
    const tally = new Map();
    for (const g of sh) for (const rec of dByShingle.get(g) || []) tally.set(rec, (tally.get(rec) || 0) + 1);
    for (const [rec, shared] of tally) {
      const j = shared / (sh.size + rec.shSize - shared);
      if (j > nearScore) { nearScore = j; near = rec; }
    }
  }

  if (dByBody.has(bh)) out = { ...out, match: "exact", ...dByBody.get(bh) };
  else if (mByBody.has(bh)) out = { ...out, ...fromMirror(mByBody.get(bh), "exact") };
  else if (near && nearScore >= 0.35) {
    out = { ...out, match: "similar", repo: near.repo, path: near.path, ref: near.ref,
            similarity: +nearScore.toFixed(2) };
  }
  else if (pk && dByPrefix.has(pk)) out = { ...out, match: "prefix", ...dByPrefix.get(pk) };
  else if (pk && mByPrefix.has(pk)) out = { ...out, ...fromMirror(mByPrefix.get(pk), "prefix") };
  else if (byName) {
    out = { ...out, match: "similar", repo: byName.repo, path: byName.path, ref: byName.ref,
            via: "name" };
  }
  else out = { ...out, match: "unknown" };

  // An ambiguous mirror verdict loses to a name hit on a first-party publisher.
  if (out.match === "ambiguous" && byName && FIRST_PARTY.test(byName.repo)) {
    out = { ...out, match: "similar", repo: byName.repo, path: byName.path, ref: byName.ref,
            via: "name", candidates: undefined, copies: undefined };
  }

  results.push(out);
}

if (OUT) fs.writeFileSync(OUT, JSON.stringify(results, null, 1));

// ---------- report ----------
const n = (m) => results.filter((r) => r.match === m).length;
const confident = n("exact") + n("prefix") + n("similar");
console.log(`skills:      ${results.length}`);
console.log(`  exact:     ${String(n("exact")).padStart(3)}  body identical to a single upstream`);
console.log(`  similar:   ${String(n("similar")).padStart(3)}  same skill, body differs`);
console.log(`  prefix:    ${String(n("prefix")).padStart(3)}  same opening, tail drifted`);
console.log(`  ambiguous: ${String(n("ambiguous")).padStart(3)}  body in >=${AMBIGUOUS_AT} repos, origin undecidable`);
console.log(`  unknown:   ${String(n("unknown")).padStart(3)}`);
console.log(`\nattributed:  ${confident}/${results.length} (${Math.round((confident / results.length) * 100)}%), ` +
  `${results.filter((r) => r.ref).length} with a commit sha`);

const byRepo = {};
for (const r of results) if (r.repo) byRepo[r.repo] = (byRepo[r.repo] || 0) + 1;
console.log(`\ntop upstreams:`);
for (const [k, v] of Object.entries(byRepo).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`  ${String(v).padStart(4)}  ${k}`);
}

// Two local files pointing at one upstream file are duplicates the byte-level
// dedupe could not see, because their names and frontmatter differ.
const dupes = new Map();
for (const r of results) {
  if (!r.repo) continue;
  const k = `${r.repo}::${r.path}`;
  if (!dupes.has(k)) dupes.set(k, []);
  dupes.get(k).push(r.rel);
}
const dupGroups = [...dupes].filter(([, v]) => v.length > 1);
if (dupGroups.length) {
  console.log(`\nduplicate content (${dupGroups.length} groups sharing one upstream file):`);
  for (const [k, v] of dupGroups) { console.log(`  ${k}`); v.forEach((x) => console.log(`      ${x}`)); }
}

// ---------- write ----------
if (!WRITE) {
  console.log(`\n(dry run — pass --write to stamp frontmatter)`);
  process.exit(0);
}

const yamlBlock = (r) => {
  const L = ["upstream:"];
  L.push(`  match: ${r.match}`);
  if (r.repo) L.push(`  repo: ${r.repo}`);
  if (r.path) L.push(`  path: ${r.path}`);
  if (r.ref) L.push(`  ref: ${r.ref}`);
  if (r.similarity) L.push(`  similarity: ${r.similarity}`);
  if (r.candidates) {
    L.push(`  copies: ${r.copies}`);
    L.push(`  candidates: [${r.candidates.join(", ")}]`);
  }
  if (r.declared) L.push(`  declared: ${JSON.stringify(r.declared)}`);
  L.push(`  checked: ${TODAY}`);
  return L.join("\n");
};

let written = 0;
for (const r of results) {
  if (r.note === "no frontmatter") continue;
  const raw = fs.readFileSync(r.file, "utf8");
  const crlf = raw.includes("\r\n");
  const t = raw.replace(/\r\n/g, "\n");
  const end = t.indexOf("\n---", 3);
  const fm = t.slice(4, end);
  // Replace an existing block rather than stacking a second one.
  const stripped = fm.replace(/^upstream:\n(?:[ \t]+.*\n?)*/m, "").replace(/\n+$/, "");
  const next = `---\n${stripped}\n${yamlBlock(r)}\n---${t.slice(end + 4)}`;
  fs.writeFileSync(r.file, crlf ? next.replace(/\n/g, "\r\n") : next);
  written++;
}
console.log(`\nstamped ${written} files`);
