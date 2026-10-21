#!/usr/bin/env node
/**
 * Check every MCP server card in `site/library/6_MCP_Servers/` against GitHub.
 * Report only: the Monthly Upkeep reads the lines and fixes or removes cards.
 *
 *   node scripts/check-mcp-servers.mjs          # needs the gh CLI signed in
 *
 * Per card (its `server.repo` frontmatter), one line when something needs a look:
 *   MISSING   repo gone or private          -> remove the card, or repoint it
 *   RENAMED   GitHub redirects to a new name -> update `server.repo` and links
 *   ARCHIVED  repo is read-only              -> remove, or note a successor
 *   LICENCE   SPDX id differs from the card  -> re-read the licence, update it
 *   QUIET     no push in over 12 months      -> check it still works
 *   STALE     `server.checked` over 90 days  -> re-read the README install lines
 * A card with no `server.repo` is reported as NOREPO. Final line:
 * `RUN SUMMARY: <cards> cards, <n> need a look`. Exit 0 whenever it ran.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const DIR = path.join(ROOT, "site", "library", "6_MCP_Servers");
const DAY = 864e5;
const now = Date.now();

const walk = (d, out = []) => {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md") && e.name !== "README.md") out.push(p);
  }
  return out;
};
const field = (fm, k) => (fm.match(new RegExp(`^\\s+${k}:\\s*"?([^"\\n]*)"?\\s*$`, "m")) || [])[1]?.trim() || "";
const spdx = (s) => s.split(/\s*\/\s*/).map((x) => x.trim().toLowerCase());

const cache = new Map();
const repoInfo = (repo) => {
  if (cache.has(repo)) return cache.get(repo);
  let info;
  try {
    info = JSON.parse(execFileSync("gh", ["api", `repos/${repo}`, "--jq", "{full_name, archived, pushed_at, license: .license.spdx_id}"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
  } catch { info = null; }
  cache.set(repo, info);
  return info;
};

const cards = walk(DIR);
let flagged = 0;
for (const f of cards) {
  const rel = path.relative(DIR, f).split(path.sep).join("/");
  const raw = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const fm = raw.startsWith("---\n") ? raw.slice(4, raw.indexOf("\n---", 3)) : "";
  const repo = field(fm, "repo");
  const out = [];
  if (!repo) out.push("NOREPO no server.repo in frontmatter");
  else {
    const info = repoInfo(repo);
    if (!info) out.push(`MISSING ${repo}`);
    else {
      if (info.full_name.toLowerCase() !== repo.toLowerCase()) out.push(`RENAMED ${repo} -> ${info.full_name}`);
      if (info.archived) out.push(`ARCHIVED ${info.full_name}`);
      const lic = field(fm, "license");
      if (info.license && info.license !== "NOASSERTION" && lic && !spdx(lic).includes(info.license.toLowerCase())) out.push(`LICENCE card says ${lic}, GitHub says ${info.license}`);
      if (now - Date.parse(info.pushed_at) > 365 * DAY) out.push(`QUIET last push ${info.pushed_at.slice(0, 10)}`);
    }
  }
  const checked = field(fm, "checked");
  if (!checked || now - Date.parse(checked) > 90 * DAY) out.push(`STALE checked ${checked || "never"}`);
  for (const o of out) console.log(`${o.split(" ")[0]} ${rel}: ${o.slice(o.indexOf(" ") + 1)}`);
  if (out.length) flagged++;
}
console.log(`RUN SUMMARY: ${cards.length} cards, ${flagged} need a look`);
