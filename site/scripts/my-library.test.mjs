/**
 * Self-check for the My Library file store (lib/my-library.ts).
 *
 * Runs against a throwaway folder, never site/my-library.
 * Run: npm run test:my-library   (from site/)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "my-library-test-"));
process.env.MY_LIBRARY_DIR = dir;
const { myLibrary } = await import("../lib/my-library.ts");

try {
  assert.deepEqual(myLibrary.list(), []);

  const a = myLibrary.create({ title: "Code Review: Strict!", section: "4_Prompts", category: "Dev", subcategory: null, tags: ["x"], content: "Body A\n" });
  assert.match(a.id, /^code-review-strict-[0-9a-f]{6}$/);
  assert.ok(fs.existsSync(path.join(dir, `${a.id}.md`)));

  // Round-trips through the file, YAML-awkward title included
  const read = myLibrary.get(a.id);
  assert.equal(read.title, "Code Review: Strict!");
  assert.deepEqual(read.tags, ["x"]);
  assert.equal(read.content.trim(), "Body A");
  assert.equal(typeof read.updated_at, "string");

  // Same title twice is two prompts, not an overwrite
  const b = myLibrary.create({ title: "Code Review: Strict!", section: "4_Prompts", category: "Dev", subcategory: "Sub", tags: [], content: "Body B" });
  assert.notEqual(a.id, b.id);
  assert.equal(myLibrary.list().length, 2);

  // Update keeps the id (and file name) and what wasn't sent
  const updated = myLibrary.update(a.id, { title: "Renamed", subcategory: undefined });
  assert.equal(updated.id, a.id);
  assert.equal(updated.title, "Renamed");
  assert.equal(updated.content.trim(), "Body A");
  assert.equal(myLibrary.get(a.id).title, "Renamed");

  // Ids can't climb out of the folder
  for (const bad of ["../x", "..\\x", "a/b", "A", ""]) {
    assert.equal(myLibrary.get(bad), null, bad);
    assert.equal(myLibrary.delete(bad), false, bad);
    assert.equal(myLibrary.update(bad, { title: "t" }), null, bad);
  }

  assert.equal(myLibrary.delete(b.id), true);
  assert.equal(myLibrary.delete(b.id), false);
  assert.equal(myLibrary.list().length, 1);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}

// The write guard: a page on another site can't post into My Library
const { app } = await import("../api/index.ts");
const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const copy = `${base}/api/prompts/${encodeURIComponent("1_Guides/README.md")}/copy-to-my-prompts`;
  const foreign = await fetch(copy, { method: "POST", headers: { Origin: "https://evil.example" } });
  assert.equal(foreign.status, 403, "cross-site write refused");
  const nullOrigin = await fetch(copy, { method: "POST", headers: { Origin: "null" } });
  assert.equal(nullOrigin.status, 403, "null-origin write refused");
  const sameSite = await fetch(copy, { method: "POST", headers: { Origin: base } });
  assert.notEqual(sameSite.status, 403, "same-origin write allowed");
} finally {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log("my-library: file store round-trips, updates in place, rejects path ids and cross-site writes");
