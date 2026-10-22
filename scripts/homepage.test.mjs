// Pins the links homepage/ exists to carry. Run from the repo root: node scripts/homepage.test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (f) => readFileSync(new URL(`../homepage/${f}`, import.meta.url), 'utf8');
const html = read('index.html');
const APP = 'https://my-prompt-library-demo.ai-automation-tools.dev';
const REPO = 'https://github.com/ai-automation-tools/promptbook';

const required = [
  `${APP}/`,
  REPO,
  `${REPO}/blob/main/docs/CHANGELOG.md`,
  `${REPO}/blob/main/docs/ROADMAP.md`,
  'https://ai-automation-tools.dev/',
  'https://ai-automation-tools.dev',
  'https://ai-automation-tools.dev/cookies.html',
  '#start',
];
for (const href of required) assert.ok(html.includes(`href="${href}"`), `index.html links ${href}`);
assert.match(html, /data-ail-consent="manage"/, 'cookie settings link');
assert.match(html, /<script src="https:\/\/ai-automation-tools\.dev\/consent\.js" defer><\/script>/, 'consent script');
assert.match(html, /<link rel="canonical" href="https:\/\/promptbook\.ai-automation-tools\.dev\/"/, 'canonical');
assert.match(html, /<body>\s*<a class="skip"[^>]*>[^<]*<\/a>\s*<div class="src-bar">/, 'source bar leads the body');
assert.ok(html.includes(`location.replace('${APP}'`), 'index.html forwards app share links');

assert.equal(read('CNAME').trim(), 'promptbook.ai-automation-tools.dev');
const notFound = read('404.html');
assert.ok(notFound.includes(`location.replace('${APP}' + location.pathname + location.search + location.hash)`), '404 deep-link redirect');
assert.ok(notFound.includes(`href="${APP}/"`), '404 no-JS fallback link');

console.log('homepage links ok');
