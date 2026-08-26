// Self-check for resolveInside(). Run: node lib/safe-path.test.mjs
import assert from "node:assert/strict";
import path from "node:path";

// Mirror of lib/safe-path.ts — kept inline so the check runs without a TS build step.
function resolveInside(root, relPath) {
  const base = path.resolve(root);
  const full = path.resolve(base, relPath);
  if (full !== base && !full.startsWith(base + path.sep)) return null;
  return full;
}

const root = path.resolve("library");
const inside = (p) => resolveInside(root, p) !== null;

// Allowed
assert.ok(inside("3_Skills/AI_ML/gemini"));
assert.ok(inside("1_Guides/API_Providers/anthropic-api-guide.md"));
assert.ok(inside("3_Skills/../3_Skills/AI_ML"), "in-bounds .. is fine");
assert.equal(resolveInside(root, "3_Skills"), path.join(root, "3_Skills"));

// Rejected — these are the shapes that got past the old startsWith() guard
assert.ok(!inside("3_Skills/../../db"), "the confirmed exploit");
assert.ok(!inside("../package.json"));
assert.ok(!inside("../.env"));
assert.ok(!inside("3_Skills/../../../../../../etc/passwd"));
assert.ok(!inside(path.resolve("/etc/passwd")), "absolute path escapes");
assert.ok(!inside("../library-other"), "sibling prefix is not containment");

console.log("safe-path: all checks passed");
