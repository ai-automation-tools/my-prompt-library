#!/usr/bin/env node
/**
 * Probe every link in `site/library/resources.json` (the Resources menu) and
 * report the dead ones. Report only: the Monthly Upkeep decides what to do with a
 * dead link, since many "404"s are a page that moved and should be repointed.
 *
 *   node scripts/check-resources.mjs
 *
 * HEAD first, GET on 405/403 (several doc sites refuse HEAD), 12 s timeout, one
 * retry on 5xx or timeout. Prints `DEAD <group> | <label> | <href> | <status>`
 * per failure and `RUN SUMMARY: <ok> ok, <dead> dead`. Exit 0 whenever it ran.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const res = JSON.parse(fs.readFileSync(path.join(ROOT, "site", "library", "resources.json"), "utf8"));
const UA = "Mozilla/5.0 (compatible; promptbook-link-check; +https://github.com/ai-automation-tools/promptbook)";

const probe = async (href, method = "HEAD") => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(href, { method, redirect: "follow", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,*/*" } });
    return r.status;
  } catch (e) { return e.name === "AbortError" ? "timeout" : "error"; }
  finally { clearTimeout(t); }
};
const check = async (href) => {
  let s = await probe(href);
  if (s === 405 || s === 403 || s === 404) s = await probe(href, "GET");
  if (s === "timeout" || s === "error" || (typeof s === "number" && s >= 500)) s = await probe(href, "GET");
  return s;
};

let ok = 0, dead = 0;
for (const g of res.groups) {
  await Promise.all(g.links.map(async (l) => {
    const s = await check(l.href);
    if (typeof s === "number" && s < 400) ok++;
    else { dead++; console.log(`DEAD ${g.label} | ${l.label} | ${l.href} | ${s}`); }
  }));
}
console.log(`RUN SUMMARY: ${ok} ok, ${dead} dead`);
