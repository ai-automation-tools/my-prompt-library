// Self-check for the frontmatter handling both upstream scripts depend on.
// Run: node scripts/upstream.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Mirrors of the helpers in check-upstream-drift.mjs. Kept inline so the check
// runs standalone; if these drift from the originals the assertions below are
// what catches it.
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

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

// --- frontmatter splitting ---
const doc = "---\nname: x\nupstream:\n  match: exact\n  repo: a/b\n  path: skills/x/SKILL.md\n---\n\n# Title\n\nbody\n";
assert.equal(splitFrontmatter(doc).body.trim(), "# Title\n\nbody");
assert.ok(splitFrontmatter(doc).fm.includes("upstream:"));

// CRLF is the norm in this library — 2,131 of 2,132 files.
assert.deepEqual(splitFrontmatter(doc.replace(/\n/g, "\r\n")), splitFrontmatter(doc));

// A BOM must not stop the frontmatter being recognised.
assert.ok(splitFrontmatter("﻿" + doc).fm.includes("name: x"));

// No frontmatter at all: everything is body, nothing blows up.
assert.equal(splitFrontmatter("# Just a heading\n").fm, "");
assert.equal(readUpstream(""), null);

// --- upstream block parsing ---
const u = readUpstream(splitFrontmatter(doc).fm);
assert.equal(u.match, "exact");
assert.equal(u.repo, "a/b");
assert.equal(u.path, "skills/x/SKILL.md");

// The block must be read even when it is not the last key.
const mid = "---\nupstream:\n  match: similar\n  repo: c/d\nname: y\n---\nbody\n";
assert.equal(readUpstream(splitFrontmatter(mid).fm).repo, "c/d");

// --- body comparison ignores frontmatter ---
// This is the whole point: local copies carry an emoji name and an upstream
// block, so comparing raw files would flag every skill as drifted forever.
const local = "---\nname: \"🛠️ thing\"\nupstream:\n  match: exact\n---\n\n# Thing\n\nSame body.\n";
const remote = "---\nname: thing\n---\n\n# Thing\n\nSame body.\n";
assert.equal(norm(splitFrontmatter(local).body), norm(splitFrontmatter(remote).body));

// A real content change must still register.
const changed = remote.replace("Same body.", "Different body entirely.");
assert.notEqual(norm(splitFrontmatter(local).body), norm(splitFrontmatter(changed).body));

// --- stamping is idempotent ---
// Re-running the backfill must replace the block, never stack a second one.
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library", "3_Skills");
if (fs.existsSync(LIB)) {
  const sample = path.join(LIB, "AI_ML", "MCP", "mcp-builder", "SKILL.md");
  if (fs.existsSync(sample)) {
    const fm = splitFrontmatter(fs.readFileSync(sample, "utf8")).fm;
    assert.equal((fm.match(/^upstream:$/gm) || []).length, 1, "exactly one upstream block");
    assert.ok(readUpstream(fm).repo, "stamped file has a repo");
  }
}

// --- resync re-stamping ---
// Mirror of stampUpstream in resync-upstream.mjs. The risk it guards is a
// resync that rewrites 68 files and quietly corrupts the one block the drift
// checker reads next week: a duplicated key, a dropped `repo`, or curation
// outside the block getting eaten.
const stampUpstream = (fm, { ref, checked }) =>
  fm.replace(/^upstream:\n((?:[ \t]+.*\n?)*)/m, (_all, block) => {
    const keep = block.split("\n").filter((l) => l.trim() && !/^\s+(ref|checked|match):/.test(l));
    return ["upstream:", "  match: exact", ...keep, `  ref: ${ref}`, `  checked: ${checked}`]
      .join("\n") + "\n";
  });

const before = "name: \"🛠️ thing\"\ntags: [\"a\"]\nupstream:\n  match: similar\n" +
  "  repo: a/b\n  path: skills/thing/SKILL.md\n  ref: old\n  checked: 2020-01-01\n";
const after = stampUpstream(before, { ref: "newsha", checked: "2026-08-26" });
const su = readUpstream(after);
assert.equal(su.match, "exact", "a resynced body is an exact match");
assert.equal(su.ref, "newsha");
assert.equal(su.checked, "2026-08-26");
assert.equal(su.repo, "a/b", "repo survives re-stamping");
assert.equal(su.path, "skills/thing/SKILL.md", "path survives re-stamping");
assert.equal((after.match(/^upstream:$/gm) || []).length, 1, "still exactly one upstream block");
assert.equal((after.match(/^\s+ref:/gm) || []).length, 1, "no duplicated ref");
assert.ok(after.includes("tags: [\"a\"]"), "local curation outside the block is untouched");

// Idempotent: stamping the result again changes nothing.
assert.equal(stampUpstream(after, { ref: "newsha", checked: "2026-08-26" }), after);

// --- the `match:` vocabulary is attribution confidence, never a drift verdict ---
// `behind` is check-upstream-drift.mjs's verdict for "missing >25% of upstream".
// attribute-upstream.mjs used to stamp the same word as a confidence label, so
// seven skills sat in the library looking like a live problem that was not one.
// Renamed to `similar` on 2026-08-29; this assertion is what stops it coming back.
{
  const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^[/]([A-Za-z]:)/, "$1"));
  const LIB = path.join(HERE, "..", "site", "library", "3_Skills");
  const KNOWN = new Set(["exact", "prefix", "similar", "ambiguous", "unknown", "fork"]);
  const walk = (dir, out = []) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name === "SKILL.md") out.push(p);
    }
    return out;
  };
  const bad = [];
  let stamped = 0;
  for (const f of walk(LIB)) {
    const u = readUpstream(splitFrontmatter(fs.readFileSync(f, "utf8")).fm);
    if (!u || !u.match) continue;
    stamped++;
    if (!KNOWN.has(u.match)) bad.push(path.relative(LIB, f) + ": match: " + u.match);
  }
  assert.deepEqual(bad, [], "every upstream.match must be a known attribution verdict");
  console.log("  " + stamped + " stamped SKILL.md files, every match: value in the vocabulary");
}

console.log("upstream: all checks passed");
