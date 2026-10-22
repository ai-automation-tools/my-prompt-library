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

  // Frontmatter the store does not manage survives create and update: a skill
  // without name/description will not load, and saves used to drop them.
  const skill = myLibrary.create({ title: "my-skill", section: "3_Skills", category: "Dev", subcategory: null, tags: [], content: "Do the thing.\n", extra: { name: "my-skill", description: "Use when testing." } });
  myLibrary.update(skill.id, { tags: ["edited"] });
  const skillRead = myLibrary.get(skill.id);
  assert.equal(skillRead.extra.name, "my-skill");
  assert.equal(skillRead.extra.description, "Use when testing.");
  assert.deepEqual(skillRead.tags, ["edited"]);
  assert.match(fs.readFileSync(path.join(dir, `${skill.id}.md`), "utf-8"), /^---\nname: my-skill\n/);
  myLibrary.delete(skill.id);

  // Ids can't climb out of the folder
  for (const bad of ["../x", "..\\x", "a/b", "A", ""]) {
    assert.equal(myLibrary.get(bad), null, bad);
    assert.equal(myLibrary.delete(bad), false, bad);
    assert.equal(myLibrary.update(bad, { title: "t" }), null, bad);
  }

  assert.equal(myLibrary.delete(b.id), true);
  assert.equal(myLibrary.delete(b.id), false);
  assert.equal(myLibrary.list().length, 1);

  // A copy tracks its public source: fresh is in sync, an edit is local, a pull
  // restores the public body. The public file itself is only ever read.
  const { forkExtra, upstreamStatus, pullUpstream } = await import("../lib/my-library.ts");
  const { readLibraryItem } = await import("../lib/library.ts");
  const pub = readLibraryItem("1_Guides/README.md");
  const pubBefore = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "library", "1_Guides", "README.md"), "utf-8");
  const fork = myLibrary.create({ title: pub.title, section: pub.section, category: pub.category, subcategory: pub.subcategory, tags: [], content: pub.content, extra: forkExtra(pub) });
  assert.deepEqual(upstreamStatus(myLibrary.get(fork.id)), { source: pub.id, updateAvailable: false, localEdits: false });
  myLibrary.update(fork.id, { content: "my edit" });
  assert.deepEqual(upstreamStatus(myLibrary.get(fork.id)), { source: pub.id, updateAvailable: false, localEdits: true });
  // The public one moved on since the copy: simulated by an older base hash
  myLibrary.update(fork.id, { content: pub.content, extra: { forked_hash: "0000000000000000" } });
  assert.equal(upstreamStatus(myLibrary.get(fork.id)).updateAvailable, false, "same body is in sync whatever the base");
  myLibrary.update(fork.id, { content: "stale public body" });
  assert.deepEqual(upstreamStatus(myLibrary.get(fork.id)), { source: pub.id, updateAvailable: true, localEdits: true });
  const pulled = pullUpstream(fork.id);
  assert.equal(pulled.content.trim(), pub.content.trim());
  assert.deepEqual(upstreamStatus(pulled), { source: pub.id, updateAvailable: false, localEdits: false });
  assert.equal(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "library", "1_Guides", "README.md"), "utf-8"), pubBefore, "public file untouched");
  assert.equal(pullUpstream(a.id), null, "no source, nothing to pull");
  myLibrary.delete(fork.id);
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
