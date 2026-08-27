# Changelog

Shipped work, newest first. Forward-looking plans live in [ROADMAP.md](ROADMAP.md).

---

## 2026-08-27 — 1,349 prompts that shipped on every deploy and nobody could open

`2_Agents/Development/Other/` held two files over the index builder's 500 KB ceiling:
`act-as-an-expert.md` (3.4 MB) and `promptsdotchat-opensource.md` (2.5 MB). Being skipped by
the builder, neither was searchable, linkable, or openable — they were 5.8 MB of dead weight in
every deploy.

They are not what the filenames suggest. Both are the
[f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) corpus in `<details>`
form, and they are not duplicates of the 202-prompt `awesome-chatgpt.md` sitting next to them —
they carry **1,377** and **1,169** distinct prompts. Only 27 of those exist anywhere else in
the library.

`promptsdotchat-opensource.md` turned out to be **1,168 of its 1,169 prompts already inside**
`act-as-an-expert.md` — 2.5 MB of near-pure redundancy. The union is 1,378. Twenty titles
appear in both with different bodies; in each case the longer one is the later revision, so
that is the one kept.

### What shipped

1,378 minus 27 already-reachable minus 2 empty stubs = **1,349 files** under
`4_Prompts/Awesome_ChatGPT/General/`, each with the frontmatter the rest of `4_Prompts` uses
and tags derived from its title. Fifteen slug collisions were suffixed, and the slugs are all
lowercase — two files differing only in case are one file on Windows and two on Linux, which is
exactly how the index desynced last time.

| | before | after |
|:---|---:|---:|
| `2_Agents` | 7.7 MB / 548 files | **2.1 MB** / 546 files |
| `4_Prompts` | 1.3 MB / 561 files | 4.0 MB / 1,910 files |
| `site/library` | 30.3 MB / 2,864 files | **27.3 MB** / 4,211 files |
| prompt index | 1,739 prompts, 1.05 MB | **3,088** prompts, 1.91 MB |

### 350 email addresses that were about to be published

The upstream corpus credits contributors as `Contributed by [@handle](url)` — except **350 of
its 648 handles are email addresses**, not GitHub usernames. Splitting naively would have put
`[@someone@gmail.com](https://github.com/someone@gmail.com)` on a public site: a broken link,
and someone's personal address republished at `prompts.mikesailab.com`.

Attribution is emitted by handle only when the handle actually matches GitHub's username
grammar — **712 files** carry a named credit; the rest credit the repository and no individual.
Prompt bodies were scanned too: one email, `john.doe@defensetech.com`, plainly fictional. No
key-shaped strings anywhere in the 1,349.

### The cost, stated plainly

The lightweight listing every visit fetches went **159 KB → 311 KB gzipped**. That is
proportional to 78% more prompts rather than a regression in kind, but it now outweighs all the
JS on the page (200 KB gzipped), which makes pagination the next payload item rather than the
bundle. Filed on the roadmap.

Verified against a running server: 1,349 prompts in the listing under `Awesome_ChatGPT`, the
sidebar shows the category with its count, individual prompts resolve by id and render, and the
console is clean.

---

## 2026-08-27 — The CI gate could never have passed, and two reasons why

The index gate shipped that morning failed on its first real PR, and the failure was honest:
the committed `api/prompt-index.json` genuinely could not be reproduced by CI. Two independent
causes, neither of them the gate's fault.

### 1. Line endings — `.gitattributes`

2,131 of 2,132 content files were CRLF, and the repo had no `.gitattributes`. The index embeds
a 200-character `contentPreview` verbatim, so the copy built on Windows carried `
` and the
copy CI rebuilt from a Linux checkout carried `
`. Every PR would have failed on the same
diff no matter what it changed — the fastest way to teach a team to ignore a gate.

`eol=lf` rather than a bare `text=auto` is the part that matters: it normalizes the *working
tree* on Windows too, so the index is byte-reproducible on either platform. 647 files
renormalized; each staged change was checked to be line-endings-only by comparing blobs with
`
` stripped from both sides.

Four files had to be pulled back out of the sweep. The PNG/GIF "images" under
`timesfm-forecasting` are Git LFS **pointer files**, and the LFS spec requires LF. Marking
`*.png binary` correctly stopped git normalizing them — which meant `--renormalize` would have
staged the CRLF working-tree bytes and quietly broken the pointers. Restored byte-for-byte.

### 2. The same file tracked twice, under two spellings of one directory

`document-writer/SKILL.md` was tracked at **both** `3_Skills/Content/General/` and
`3_Skills/Content/general/` — same blob, two paths differing only in one capital letter. It has
been that way since the `site/` restructure.

On Windows those are one directory, so the checkout produces a single file and the local index
has 1,739 prompts. On a case-sensitive Linux runner they are two files, so CI built **1,740**
and failed against the committed 1,739. Nothing a Windows-only workflow could ever see.

This is also what made the file look untracked. `git ls-files --error-unmatch` on the
capital-G path said "did not match any file(s) known to git", `git status` never listed it, and
`git add -f` exited 0 while staging nothing — from bash *and* PowerShell, with the file neither
ignored, sparse-excluded, nor skip-worktree. Git was matching the working-tree file against the
lowercase-g index entry and correctly concluding there was nothing to do. It went in via
`hash-object` + `update-index`, and the lowercase duplicate was then dropped with
`update-index --force-remove` — the capital-G spelling matches its `humanizer` sibling and the
committed index.

It was the only case collision in `site/library/`; `3_Skills/packs/` is lowercase on purpose.

### 3. The index was ordered by whatever the filesystem returned

With the count finally matching, the gate still failed — on ordering. `fs.readdirSync` returns
the filesystem's own order: case-insensitive alphabetical on NTFS, hash order on ext4. Same
1,739 prompts, different array order, so the diff was every entry moving.

`build-prompt-index.js` now sorts by `id`. Verified as a pure reordering: the set of prompt
objects before and after is identical, 0 added and 0 removed. The app sorts client-side
(default title-asc), so this order was never what anyone saw — it just made the committed file
un-reproducible.

### Result

`npm run build:index` twice in a row now produces a byte-identical index, and the gate's own
comparison passes locally. Prompt count is unchanged at **1,739**; `lastModified` was carried
over per id, so the diff is the previews rather than 1,739 fresh checkout timestamps.

---

## 2026-08-27 — One 976 KB chunk became eight

First paint was a single `index-*.js` of **976 KB / 265 KB gzipped**, and Vite warned about it
on every build. It is now **706 KB / 200 KB gzipped** across three files, and nothing trips the
500 KB threshold.

| chunk | size | gzip | when it loads |
|:---|---:|---:|:---|
| `react-vendor` | 396.7 KB | 118.8 KB | first paint |
| `index` (app) | 180.9 KB | 39.0 KB | first paint |
| `motion` | 128.3 KB | 42.7 KB | first paint |
| markdown (shared) | 184.0 KB | 54.6 KB | opening a prompt or the editor |
| `SkillPacksView` | 28.5 KB | 3.9 KB | opening Skill Packs |
| `PromptEditorModal` | 17.6 KB | 2.9 KB | opening the editor |
| `PromptDetail` | 15.9 KB | 2.6 KB | opening a prompt |
| `SignupModal` / `LoginModal` | 14.8 / 9.3 KB | 2.5 / 1.8 KB | opening that modal |

Two changes did it.

**`React.lazy` on the five components that are never on screen at first paint** —
`SkillPacksView`, `PromptDetail`, `PromptEditorModal`, `LoginModal`, `SignupModal`. The prize
is not the components (each is 9–28 KB) but what two of them drag in: `react-markdown` +
`remark-gfm` pull the whole unified/micromark stack, 184 KB that used to be in the entry chunk
and is now a shared chunk fetched the first time you open a prompt.

The three modals needed one extra step. They were always mounted and self-hid with
`if (!isOpen) return null`, which would have fetched their chunks on page load and defeated the
split, so App now mounts them only while open. Behaviour is identical — each already rendered
nothing when closed, and the editor's form-init effect keys on the same flag.

**`manualChunks` for React and motion.** They are ~475 KB of the entry and change only when we
bump them, so they now live in their own chunks: editing a prompt no longer invalidates 400 KB
of React in every visitor's cache.

### What is left

`motion` is the only sizeable thing still on the critical path at 128 KB. `LazyMotion` with the
`m` components would cut most of it, but `motion/react` is imported in 10 files — a refactor,
filed on the roadmap rather than smuggled in here. React itself is not going anywhere.

### Two bugs the browser test found

Verifying the split in a real browser (built bundle, `NODE_ENV=production`) turned up a
pre-existing routing bug in two halves, both the same omission — `skill-packs` was never added
to the tab↔URL mapping:

- the `activeTab` initialiser had no `skill-packs` case, so a **deep link or refresh on
  `?section=skill-packs` silently landed on Prompts**. In-app navigation worked, because the
  `popstate` handler *does* have the case, which is why nobody noticed.
- the URL-sync effect had no `skill-packs` case either, so its ternary chain fell through to
  `'system-prompts'` — opening Skill Packs rewrote the address bar to a section you were not
  looking at, and copying that URL sent someone else somewhere else.

Both fixed. Confirmed against the built bundle: first paint fetches exactly three JS chunks,
each lazy chunk arrives only on the interaction that needs it, markdown renders, and the
console is clean.

---

## 2026-08-27 — `library/Legacy/` deleted, 14 system prompts rescued from it

2,393 files and 37 MB — half the library payload — shipped on every deploy while being
excluded from the index by all three readers. Gone.

The delete was not taken on faith. Every Legacy file was hashed against the live tree first:

| | files | |
|:---|---:|:---|
| byte-identical to a live file | 1,956 | pure duplicates |
| older revision of a file that survived under the same name | 404 | superseded |
| no counterpart at all | 33 | needed a decision |

Of the 33, sixteen were support files their upstreams have since deleted — `pptx`'s
`html2pptx.js`, `inventory.py`, `rearrange.py` and `replace.py`, `skill-creator`'s
`init_skill.py` and `output-patterns.md`, and the per-language `claude-api` stubs. The
resyncs pruned those on purpose; Legacy was holding the corpses.

The other seventeen were archived system prompts, and three of those turned out to be the
same prompt under a different filename (`chatgpt-4o.md`, `codeium-windsurf-cascade.md`,
`mistral-le-chat-pro.md` — 0.94–0.98 similarity to a live file after stripping frontmatter).
**The remaining fourteen were real, unreachable content and were promoted into
`5_System_Prompts/` instead of deleted:** Brave Leo, Cursor IDE Sonnet, DuckDuckGo's
GPT-4o-mini, Gemini 1.5, Meta AI on WhatsApp, four OpenAI prompts (Assistants API, ChatGPT-4o,
ChatGPT-5, Deep Research), Opera Aria, Roblox Studio Assistant, Snap My AI, Wrtn and xAI Grok.
Four vendor folders are new: `Opera/`, `Roblox/`, `Snapchat/`, `Wrtn/`.

That is why the index grew rather than shrank — **1,725 → 1,739 prompts** — and it confirms
the delete removed nothing the app could reach. `site/library/` is 75 MB → **38 MB**.

The `Legacy` guards in `build-prompt-index.js` and `api/index.ts` were left in place. They
are three lines, and they mean a `git checkout <sha> -- site/library/Legacy` to consult the
old tree does not silently double the index.

---

## 2026-08-27 — One API, not two

`server.ts` was a 555-line hand-maintained twin of `api/index.ts` (749 lines), and
`routes/skill-packs.ts` (335) a twin of `api/skill-packs.ts` (394). Both copies are gone.
`api/index.ts` now exports its Express app; `server.ts` is 71 lines that import it, mount the
production skill-packs handler, and add Vite's HMR middleware — the one thing production does
not have and the only reason the file exists. Net ~880 lines deleted.

The three "parity bugs" on the roadmap were all the same bug — a stale copy — so all three
went with it:

| was | now |
|:---|:---|
| `GET /api/prompts/:id` missing in dev; fell through to Vite and returned the SPA's HTML | serves JSON, same handler as prod |
| dev ignored `lightweight`, shipping the full library every page load | honours it and the prebuilt index — 1.28 MB vs 9.3 MB |
| dev's GitHub mode filtered the tree on `prompts/`, renamed to `library/` long ago | one GitHub implementation, the working one |

Two more divergences surfaced while collapsing them. `server.ts` had its own
`isGitHubConfigured()` that ignored `USE_GITHUB_MODE`, so a `GITHUB_TOKEN` sitting in the
environment for unrelated reasons silently flipped dev onto that broken GitHub path and
served an empty library. And `api/index.ts` split a forward-slashed prompt id on `path.sep`
in the single-prompt route — correct on Vercel, wrong on Windows, where every prompt came back
with `section` set to the entire path and `category` set to `Uncategorized`. Both fixed.

`routes/skill-packs.ts` also carried a `GET /:packId/stats` route that the production handler
never had and no frontend code calls. It was deleted rather than ported.

New: `npm run test:routes` asserts the seven expected routes are registered on the shared app,
wired into CI. Verified by running it against a deliberately wrong expectation and confirming
it fails.

---

## 2026-08-27 — A CI gate on the prompt index

`.github/workflows/ci.yml`: on every PR and every push to `main`, `npm ci` →
`npm run lint` → `npm run build:index`, then fail if the rebuilt index differs from the
committed one. Catches "edited the library, forgot to rebuild" at the PR instead of three
commits later.

Two fields are stripped before comparing, because neither can match by construction:
`buildTime` is stamped at each run, and `lastModified` is `stat.mtime` — a fresh CI checkout
sets that to the checkout time for *every* file, so comparing it would fail 100% of runs and
teach everyone to ignore the gate. Everything that encodes actual content is still compared,
verified by adding a throwaway library file and confirming the check goes red.

---

## 2026-08-27 — Nine more skills resynced, dead upstreams settled, model IDs swept

Three "Now" items off the roadmap in one pass.

**Nine of the ten remaining `behind` skills are now `current`** — `autoresearch`,
`interaction-design`, `academy-guide`, `python-design-patterns`, `pptx`, `find-skills`,
`skill-creator`, `golang-popular-libraries` and `matlab`. Re-running the checker:
`behind` 10 → 1, `current` 32 → 41, `upstream-gone` 6 → 0.

`pptx` was the big one. Anthropic moved the whole OOXML tree from `ooxml/` into
`scripts/office/`, so the resync pruned 59 stale files (the duplicated ISO-29500 schema set,
the old validation package, `html2pptx.js`) and wrote 56 in the new layout — a net 28k lines
deleted from the deploy root.

`x-twitter-scraper` was deliberately skipped here — its upstream ships ~60 `references/*.md`
files that are SEO landing copy ("best-x-api-alternative", "reliable-twitter-data-api-2026")
rather than skill content, and pulling them adds marketing pages to a library that already has
a payload problem. That call was overtaken: the parallel branch below (#325) pulled all 68 of
them, and the merge kept them. The skill is now `drifted` at 0% — upstream has edited the
SKILL.md since — not `behind`.

The two branches resynced overlapping sets the same day, so the entry below covers ten skills
where this one covers nine. Both landed; the union is what shipped, and the post-merge report
is [audits/upstream-drift-2026-08-27.md](audits/upstream-drift-2026-08-27.md): `behind` **0**,
`current` 41, `drifted` 52, plus 6 forks the checker now skips.

**The six dead upstreams are now marked as forks we own.** All six were re-verified against
the live upstream trees — `spreadsheet`, `sora`, `using-neon`, `gh-fix-ci`,
`git-context-controller` and `linear` really are gone (openai/plugins still ships a `linear`
plugin, but it is MCP-only now, with no `skills/` directory). Each carries
`match: fork` plus a note, and `check-upstream-drift.mjs` skips that verdict, so the weekly
job stops re-reporting six things nobody is going to fix.

**Deprecated model IDs swept** across 35 guide and agent files. Claude: `claude-3-5-sonnet`,
`claude-3-7-sonnet`, `claude-3-sonnet` → `claude-sonnet-5`; `claude-3-opus` →
`claude-opus-5`; `claude-3-haiku` → `claude-haiku-4-5`. OpenAI: `gpt-4o` → `gpt-5.6-sol`,
`gpt-4o-mini` → `gpt-5.6-luna`, verified against OpenAI's live model list.

Three scopes were left alone on purpose: `5_System_Prompts/` (an archive of what specific
models were actually shipped with — the old IDs are the point), `3_Skills/Development/API/claude-api`
(upstream-managed, and its migration docs need the old IDs), and version-history or
competitor-comparison lines like "### vs Claude 3.5". `openai_cli_guide.md` was also skipped:
it is built around GPT-4o with pricing, rate-limit and capability tables, so it needs a
rewrite rather than a find-and-replace.
## 2026-08-26 — The `behind` tier is empty

The remaining ten skills the drift report flagged as `behind` — missing more than a quarter
of their upstream's content — are now byte-identical to upstream. Verified by re-running
`check-upstream-drift.mjs` against all 99 attributed skills: `behind` 10 → **0**, `current`
32 → **42**. The verdict table no longer has a `behind` section to print.

| skill | upstream | was missing |
|:---|:---|---:|
| `Development/autoresearch` | github/awesome-copilot | 73% |
| `Design/interaction-design` | wshobson/agents | 72% |
| `Platform_Integrations/academy-guide` | anthropics/skills | 71% |
| `Development/Python/python-design-patterns` | wshobson/agents | 68% |
| `Business/Marketing/x-twitter-scraper` | xquik-dev/x-twitter-scraper | 67% |
| `Content/pptx` | anthropics/skills | 60% |
| `AI_ML/find-skills` | vercel-labs/skills | 55% |
| `Content/skill-creator` | anthropics/skills | 52% |
| `Development/golang-popular-libraries` | samber/cc-skills-golang | 31% |
| `Data/matlab` | k-dense-ai/scientific-agent-skills | 30% |

**Three of them were shipping a support tree with no SKILL.md to go with it.**
`x-twitter-scraper`, `golang-popular-libraries` and `matlab` gained 68, 4 and 20 support
files respectively — `x-twitter-scraper` was a lone `SKILL.md` in a directory whose upstream
carries 68 reference documents, so the skill named files that were never there.

**`pptx` was the reverse: a support tree from a layout that no longer exists.** Anthropic
folded the old sibling `ooxml` skill into pptx and moved its schemas from `ooxml/schemas/` to
`scripts/office/schemas/`, its validators from `ooxml/scripts/validation/` to
`scripts/office/validators/`, and dropped `html2pptx.js`, `inventory.py`, `rearrange.py` and
`replace.py` entirely. 59 local files were orphans of the old shape; 56 replaced them. Every
path the new `SKILL.md` references was checked to exist afterwards, and the same for
`skill-creator`, whose `references/output-patterns.md`, `references/workflows.md` and
`scripts/init_skill.py` are gone upstream and are referenced nowhere in the new body.

**`matlab`'s references shrank and that is an improvement.** Upstream rewrote all eight from
a generic MATLAB cheatsheet into R2026a-targeted guidance with `arguments` blocks, an
artifact-selection table and explicit "never run an untrusted project" warnings — denser
prose in fewer lines. The line count falls; the content does not.

Frontmatter is untouched as always, except the `upstream:` block: `ref` now names the commit
each skill was synced from and `checked` is today. Three skills gained a full 40-character
commit sha they did not have (36 skills now carry one, up from 33).

### The index diff is 20 lines, not 1,735

`lastModified` in `api/prompt-index.json` is the file's mtime, so rebuilding the index in a
fresh checkout rewrites it for all 1,725 prompts — churn that also makes the app's
Newest/Oldest sort meaningless. The committed index keeps the previous `lastModified` for
every file this change did not touch, so the diff is the ten resynced skills plus
`buildTime`. Prompt count is unchanged at 1,725; skill count unchanged at 323.

_Touched: 10 skill directories under `site/library/3_Skills/` (+105 files, −62, 34 changed),
`site/api/prompt-index.json`, `docs/audits/upstream-drift-2026-08-26.md`, `docs/ROADMAP.md`._

---

## 2026-08-26 — The six most-drifted skills pulled back level with upstream

The drift report shipped earlier the same day named 16 skills as `behind` — missing more
than a quarter of their upstream's content. The six worst are now `current`, verified by
re-running the same checker: `behind` 16 → 10, `current` 26 → 32.

| skill | upstream | was missing |
|:---|:---|---:|
| `Development/code-tour` | github/awesome-copilot | 91% |
| `Data/huggingface-gradio` | huggingface/skills | 86% |
| `Content/brainstorming` | obra/superpowers | 86% |
| `AI_ML/huggingface-llm-trainer` | huggingface/skills | 84% |
| `AI_ML/Agent_Development/discernment-nudge` | anthropics/skills | 77% |
| `Development/API/claude-api` | anthropics/skills | 77% |

Five of the six were stubs — a paraphrased summary of the upstream skill rather than a copy
of it. `code-tour` carried 295 words against upstream's 3,160 and none of its 20 personas or
step types. What shipped to visitors was a description of a skill, not the skill.

`claude-api` was a different failure: the body was close, but the support tree had been left
at an old layout. Anthropic split each language's single `claude-api.md` into a directory and
renamed `agent-sdk/` to `managed-agents/`, so 42 files were missing and 9 were orphans of a
structure that no longer exists. It now mirrors upstream at 68 files, and the skill-pack zip
went from 26 entries to 90.

**Frontmatter is not synced, and that is the point.** `title` carries the decorated emoji
form the site renders, and `tags`/`category`/`subcategory`/`source` are this library's own
curation — none of it exists upstream. The drift checker strips frontmatter before comparing,
so syncing the body is exactly what moves a skill from `behind` to `current`. Only the
`upstream:` block is rewritten: `ref` to the sha synced from, `checked` to today, and `match`
to `exact`, which after the sync it genuinely is.

### New tooling

`scripts/resync-upstream.mjs` is the repair half of `check-upstream-drift.mjs` and shares its
resolution logic deliberately — stamped paths come from a mirror whose layout is not the
origin repo's, so the skill is located by directory name, not by trusting the path. It
mirrors the whole upstream skill directory and prunes local files upstream no longer has
(`--keep-extra` to opt out, `--dry-run` to preview), and never writes outside the named skill
directories. Line endings follow the local `SKILL.md`, so this library stays CRLF throughout
and the separate normalization decision is not pre-empted.

`scripts/upstream.test.mjs` grew a check for the re-stamping: a resync rewrites up to 68
files, and the one thing that must survive is the block the drift checker reads next week.
It asserts no duplicated keys, `repo`/`path` preserved, curation outside the block untouched,
and idempotency.

### A number that moved

The library now mentions the current Claude 5 model family in 47 files, up from zero — all 47
inside the resynced `claude-api` tree. Nothing else in the library names a current model, so
the roadmap's "sweep deprecated model IDs" item stands; its counts are updated.

_Touched: `scripts/resync-upstream.mjs`, `scripts/upstream.test.mjs`, 6 skill directories
under `site/library/3_Skills/` (+82 files, −9), `site/api/prompt-index.json`,
`docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/README.md`,
`docs/audits/upstream-drift-2026-08-26.md`._

---

## 2026-08-26 — Repository audit, security fixes, and upstream provenance

A full audit of the repo after several months idle, then the first remediation pass.
Findings and method: [audits/REPO-AUDIT-2026-08-26.md](audits/REPO-AUDIT-2026-08-26.md).

The headline is that the app was healthy — `tsc` clean, index deterministic, `main`
deployable — but two security bugs were live in production and the content pipeline did not
exist. Only 61 of 2,132 library files recorded where they came from, which is why "keep the
skills up to date" had been intractable: you cannot diff against an upstream you cannot name.

### Security

**Path traversal in the skill-download endpoint — confirmed exploitable, now closed.**
The endpoint guarded with `skillPath.startsWith('3_Skills/')` before calling
`path.join(LIBRARY_PATH, skillPath)`. That check is satisfied by `3_Skills/../../db`, so
`GET /api/skills/download/3_Skills%2F..%2F..%2Fdb` returned a 200 zip containing
`db/postgres.ts` — unauthenticated, with no middleware on the route at all. Four more
user-controlled sinks had the same shape, one of them an unauthenticated arbitrary file read.

New `site/lib/safe-path.ts` exports `resolveInside(root, rel)`: resolve first, compare
after, which is the only ordering that actually contains. All five sinks route through it.
In `api/index.ts` the check moved *above* the GitHub/filesystem split, because GitHub
normalises `..` inside `contents/` URLs too — guarding only the filesystem branch would have
left the deployed path open. Re-tested with five payloads: all `400`, legitimate skill zips
still `200`.

**Session tokens were not cryptographically random.** They came from `Math.random()`, a
non-cryptographic PRNG whose state is recoverable from observed output, and they are the
only thing authenticating a 30-day cookie — no signature, no server-side secret. Now
`randomBytes(32)`; ids use `randomBytes(6)`. Existing sessions must be purged
(`DELETE FROM user_sessions;`) because they were minted by the old generator.

**22 npm advisories to 0.** `npm audit fix` cleared 14, including two critical (`tar`,
`protobufjs`). The remaining 8 all traced to `@vercel/node`, which has no fixed release —
even 8.1.0 bundles vulnerable `undici` and `path-to-regexp`. But it was a devDependency
imported for exactly two `import type` aliases and it never executes, since Vercel supplies
the real runtime. Replaced with a 23-line `site/lib/vercel-types.ts` and removed.

**Also removed, all verified unreferenced:** `@google/genai`, `better-sqlite3` and
`@types/better-sqlite3` (superseded by the Postgres migration, still compiling a native
module on every install). Dropping `@google/genai` exposed a dead `define` in
`vite.config.ts` that inlined `process.env.GEMINI_API_KEY` into the client bundle — nothing
read it and it was unset, so nothing leaked, but it went before someone set the variable.
`server.ts` also stopped logging a user's email address on every My Library request.

### Upstream provenance — the freshness system

Attribution is by **content, not name**. Local skills were renamed on import
(`anthropic-brand-guidelines` vs upstream `brand-guidelines`, `docx-official` vs `docx`), so
directory matching identified only 72 of 347. Bodies survive renaming. Evidence comes from
seven directly-cloned publishers, which yield a real commit sha, plus a ~110k-skill mirror
whose paths encode the origin repo — that is what reaches the long tail of tiny publishers.

**99 of 323 skills attributed (31%), 32 with a commit sha.** The other 224 are recorded
honestly rather than guessed: 60 `ambiguous` (body present in three or more repos, so the
candidates are listed instead of one being picked) and 164 `unknown`. Both are still
stamped, because "we looked and could not tell" is a different fact from "nobody has
checked", and it stops the next person repeating the exercise.

Two rules earn most of the accuracy, and both were found by checking output rather than
trusting it:

- **First-party precedence.** A skill forked into forty repos is still its author's skill.
  Without this, `pptx`, `docx`, `xlsx` and `claude-api` were all credited to random personal
  dotfile repos that happened to sort first.
- **Path resolution, not path trust.** Mirror-derived paths follow the mirror's layout, not
  the origin repo's — it stores Anthropic's `claude-api` at `claude-api/SKILL.md` while the
  repo has it at `skills/claude-api/SKILL.md`. Taking them at face value reported **72 live
  files as deleted**; the real number is 6. The checker now fetches each repo's tree once and
  locates skills by directory name, which is also fewer API calls than fetching per file.

`check-upstream-drift.mjs` compares bodies with frontmatter stripped — local copies carry an
emoji `name:` and now an `upstream:` block, so a raw file comparison would flag all ~320
skills as drifted every week and the report would be worthless. A weekly workflow opens or
updates **one rolling issue** and never edits library content: the curation is the product,
and an auto-PR reflowing 300 files into the wrong categories would destroy it.

**First run: 16 behind, 51 drifted, 26 current, 6 upstream-gone.** It found worse than hand
inspection did — `code-tour` missing 91% of upstream, `huggingface-gradio` 86%,
`brainstorming` 86%, `claude-api` 77% plus 42 support files.

### Skill spec compliance

23 skills had no `name` and no `description`, so they could not load as skills at all — a
user downloaded the zip and got inert markdown. 171 more had a name the spec rejects,
almost always a decorative emoji prefix, and 164 had a name that did not match their
directory. **All 323 are now valid: 0 missing names, 0 missing descriptions, 0 invalid
names.**

The decorative form moved to `title:`, which is what the site renders anyway, and `name:`
became the directory slug. Paired with that, `build-prompt-index.js` and `api/index.ts` now
prefer `title` over `name` for skills — without that edit the site would have started
showing bare slugs. `server.ts` already preferred `title`, so this closed one dev/prod
divergence rather than adding another. Verified against the index before and after:
**323 in, 323 out, 265 titles unchanged, 58 improved, 0 regressed.**

Two bugs caught by checking the output, both now regression-tested:

- `description:` followed by indented continuation lines is a real multi-line YAML value but
  reads as empty. Treating it as missing and inserting a fresh `description:` orphaned the
  continuation, made the file unparseable, and silently dropped that skill from the index.
- An unquoted `name:` scalar that happens to contain quote characters lost its last
  character when quotes were stripped unconditionally.

**A correction to the audit's own claim:** moving the emoji out does *not* make skills
byte-identical to upstream. The `upstream:` block is added deliberately, so a whole-file
diff never matches again — measured 0 of 19 Anthropic skills. The drift checker strips
frontmatter anyway, so none of its verdicts change. Spec compliance was the entire payoff,
and it stands on its own.

### New tooling

| Script | Purpose |
|:---|:---|
| `scripts/attribute-upstream.mjs` | Stamp `upstream:` provenance by content matching. Idempotent |
| `scripts/check-upstream-drift.mjs` | Compare every attributed skill against its upstream |
| `scripts/fix-skill-frontmatter.mjs` | Enforce the Agent Skills spec without changing the UI |
| `.github/workflows/upstream-drift.yml` | Weekly check, one rolling issue |
| `site/lib/safe-path.ts` | Path containment guard |
| Three `*.test.mjs` files | Self-checks — the repo had no tests at all before |

### Documentation

Removed the legacy tree: `docs/archive/` (17 superseded planning docs from March 2026),
`docs/QUICK_REFERENCE.md` (it described a `prompts/` directory that no longer exists), and
`docs/library-update-logs/` (five per-section changelogs, three of them empty, all using the
pre-rename folder names). Everything is preserved in Git history. The two real entries from
those logs are folded into this file.

Fixed stale pre-rename path references across `CONTRIBUTING.md`, `templates/README.md`,
`development/DEBUG_UI.md`, `features/API.md` and `features/LIBRARY-MODE-IMPLEMENTATION.md`,
and rewrote `ARCHITECTURE.md`'s repo tree, which still described the layout from before the
app moved under `site/`.

_Touched: `site/lib/`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/server.ts`,
`site/db/postgres.ts`, `site/vite.config.ts`, `site/package.json`,
`site/scripts/build-prompt-index.js`, 323 `SKILL.md` files, `scripts/`,
`.github/workflows/`, `CLAUDE.md`, `docs/`._

---

## 2026-08-22 — Prompt list toolbar and grid extracted out of `App.tsx`

The last big block on the [roadmap](ROADMAP.md)'s `App.tsx` de-bulk list. Behavior-preserving:
the markup moved verbatim, nothing was restyled or repositioned.

**New components** — `App.tsx` **1,332 → 1,050 lines**
- `src/components/PromptListToolbar.tsx` — the header row above the prompt list: section
  title and count, the Total/Categories stat badges, the favorites / recent / tag filter
  dropdowns, and the sort `<select>`. It now owns *which* dropdown is open (one
  `openDropdown` value replacing three booleans in `App.tsx`) plus the outside-click
  handler that closes it; every filter value it edits still lives in `usePromptFilters`.
- `src/components/PromptGrid.tsx` — the main list: loading skeletons, the four empty
  states, the paginated card grid and its Previous/Next controls. Also exports
  `PromptCardGrid` (the responsive grid markup) and the `PromptCardActions` type.
- `PromptCardActions` bundles the eleven card-level props the three grids were each
  drilling into `PromptCard` by hand — featured, all-prompts and subcategory now pass one
  memoized object. Featured keeps its `lg:grid-cols-4` layout via `columns="featured"`.
- `App.tsx` shed three `useState` hooks, one `useEffect`, the local `cn()` helper (and its
  `clsx` / `tailwind-merge` imports), the now-unused `PromptCard` and `EmptyState`
  imports, and four `lucide-react` icons (`Tag`, `Star`, `ChevronDown`, `ChevronRight`).

**Scope note.** The roadmap item named one file, `PromptGrid.tsx`. It became two because
the featured section renders *between* the toolbar and the grid — folding the toolbar into
`PromptGrid` would have meant passing the featured block through as a slot, which is more
indirection than the split it was meant to avoid.

**Docs caught up while here** — `docs/features/FEATURED-PROMPTS.md` still showed a
`featuredPrompts` snippet that filtered `sortedPrompts` on the `featured` tag alone. The
real memo reads `sectionPrompts`, counts favorites as featured, and falls back to the four
most recently modified prompts so the row is never empty.

_Touched: `src/App.tsx`, `src/components/PromptGrid.tsx`,
`src/components/PromptListToolbar.tsx`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md`,
`docs/features/FEATURED-PROMPTS.md`, `CLAUDE.md`._

---

## 2026-08-19 — Weekly trending-skills sweep

Added 5 skills:

- **discernment-nudge** (`3_Skills/AI_ML/Agent_Development/discernment-nudge`) — [anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/discernment-nudge/SKILL.md)
- **academy-guide** (`3_Skills/Platform_Integrations/academy-guide`) — [anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/academy-guide/SKILL.md)
- **text-to-cad** (`3_Skills/Development/text-to-cad`) — [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)
- **design-award-evaluation** (`3_Skills/Design/design-award-evaluation`) — SeanJ1ang/design-judge-skills *(upstream has since been deleted)*
- **diagram-design** (`3_Skills/Design/diagram-design`) — [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)

---

## 2026-08-18 — Top bar extracted out of `App.tsx`

Next item on the [roadmap](ROADMAP.md)'s `App.tsx` de-bulk list. Behavior-preserving: the
markup moved verbatim, nothing was restyled or repositioned.

**New components** — `App.tsx` **1,393 → 1,332 lines**
- `src/components/TopBar.tsx` — the header row above the content area: mobile sidebar
  trigger, `ResourcesNav`, and the logged-in/logged-out auth controls. Takes the current
  user plus four callbacks; holds no state of its own.
- `src/components/LibraryHero.tsx` — the section heading and library search field shown
  whenever no prompt or subcategory is selected. `searchQuery` still lives in
  `usePromptFilters`, passed down as a controlled value.
- `App.tsx` dropped its now-dead `ResourcesNav` import and four unused `lucide-react`
  icons (`Search`, `Menu`, `Library`, `Trash2`) plus an unused `extractEmoji` import.

**Scope note.** The roadmap item also listed the sort control and the library-mode switcher
as part of the top bar. Neither is: the library-mode switcher already lives in
`Sidebar.tsx`, and the sort `<select>` belongs to the prompt-list toolbar, so it travels
with the `PromptGrid.tsx` extraction instead. Moving either into the header would have been
a redesign, not an extraction.

**Docs caught up while here** — all three described the pre-extraction shape
- `docs/ARCHITECTURE.md`'s component tree listed a `Header`/`ViewToggle`/`PromptList` structure
  that never shipped; it now names the actual component files.
- `docs/features/LIBRARY-MODE-IMPLEMENTATION.md` pointed at `App.tsx` line numbers that rotted
  through two extraction rounds — now symbol/file pointers, and the switcher is correctly
  attributed to `Sidebar.tsx`.
- `docs/features/API.md` said the page size is configurable in `App.tsx`; it is
  `ITEMS_PER_PAGE` in `src/hooks/usePromptFilters.ts`.

_Touched: `src/App.tsx`, `src/components/TopBar.tsx`, `src/components/LibraryHero.tsx`,
`docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`,
`docs/features/API.md`, `CLAUDE.md`._

---

## 2026-08-18 — Audit follow-through: rename drift, index correctness, App.tsx de-bulk

Working through the June 2026 project audit (removed 2026-08-26; see Git history).
The metadata items were mostly already done; verifying them surfaced four live bugs, all
from the `Skills/` → `3_Skills/` folder rename never reaching the backend.

**Index correctness** — public library **3,826 → 1,722** prompts, `api/prompt-index.json` **2.4 MB → 1.06 MB**
- `Legacy/` was being indexed and shipped to every browser: **1,705 entries** (45% of the payload)
  tagged `section: "Legacy"`, which no tab maps to — so they were undisplayable dead weight.
  Now skipped in `build-prompt-index.js`, `api/index.ts` (filesystem + GitHub walks) and `server.ts`.
- The "only index `SKILL.md`" rule still tested the pre-rename `Skills/` path, so **421 skill
  sub-files** (`examples/`, `references/`, `agents/`) were listed in the Skills tab as if they
  were skills. Skills tab now shows the correct **320**.
- Same stale name made `isSkill` always false, so skills used `title:` instead of their `name:`
  frontmatter field.
- Dev and prod disagreed on all of the above — `server.ts` had been updated for the rename,
  `api/index.ts` and the index builder had not.

**Reliability**
- **One malformed frontmatter file emptied the entire Public Library.** An unguarded `matter()`
  call in `server.ts` / `api/index.ts` threw and the handler returned `[]`. Bad files are now
  logged and skipped, matching the index builder. Fixed the 4 offending files at the source
  (broken quoting in `title:`), recovering 4 prompts.
- **Prompt ids are now always forward-slashed.** `path.relative` emits backslashes on Windows,
  so every tab filter (`id.startsWith('4_Prompts/')`) failed and local dev showed 0 prompts.
- **A missing/unreachable `DATABASE_URL` no longer crashes the dev server.** `initializeSchema()`
  threw before `app.listen`, so a fresh clone couldn't run the app at all — contradicting the
  documented "runs read-only without a database" behavior. It now warns and serves the
  Public Library.

**`App.tsx` de-bulk** — **2,845 → 1,393 lines**, ~40 → 27 `useState` hooks
- Extracted earlier: `ResourcesNav`, `Sidebar`, `PromptCard`, `PromptDetail`.
- New `src/hooks/usePromptFilters.ts`: owns search + debounce, tag filter, sort, and pagination
  plus everything derived from them. The five hardcoded per-tab path checks collapse into one
  `TAB_PATH_PREFIX` lookup.

**Metadata**
- `package.json` version `0.0.0` → `1.0.0`; `.env.example` referenced a `prompts/` directory
  that no longer exists.

_Touched: `src/App.tsx`, `src/hooks/usePromptFilters.ts`, `api/index.ts`, `server.ts`,
`scripts/build-prompt-index.js`, `api/prompt-index.json`, `package.json`, `.env.example`,
4 library files._

---

## 2026-04-29 — My Library, Skill Packs & search

**My Library actions**
- Added explicit **Remove from My Library** controls in card/detail views; clarified delete labels.

**Prompt add/copy**
- Fixed post-add refresh that could blank the list until reload; unified on a lightweight fetch with safer response handling.

**Skill Packs — public vs my library**
- Skill Packs now respect `library=public|my` in frontend and backend.
- New install-tracking table `user_skill_pack_installs`; My Library shows only packs the user added, Public shows the full catalog.
- Explicit add/remove lifecycle with confirm dialogs:
  - `POST /api/skill-packs/:packId/add-to-library`
  - `DELETE /api/skill-packs/:packId/remove-from-library`
- Imported skills tagged `skill-pack:<packId>` so removal cleans up every skill from that pack.

**Prompt creation**
- Create-Prompt section dropdown matches the app taxonomy (`1_Guides`…`5_System_Prompts`); new prompts force My Library mode; default section `4_Prompts`.

**Search**
- Ranking prioritizes title matches: starts-with → contains → other (tags/category/content).

_Touched: `src/App.tsx`, `PromptEditorModal.tsx`, `SkillPacksView.tsx`, `routes/skill-packs.ts`, `api/skill-packs.ts`, `db/postgres.ts`, `api/prompt-index.json`._

---

## 2026-03-28 — Agent frontmatter template compliance

Enforced the agent template's frontmatter requirements (`title`, `tags`, `category`,
`subcategory`) across `library/2_Agents/`, starting with 10 files in AI Engineering and MCP.
Existing `name`, `description`, `tools` and `model` fields were preserved.

The 2026-08-26 audit revisited this: 457 of 547 files in `2_Agents` still have no `name:` or
`description:`, so they cannot load as subagents at all. See the roadmap for the open
question of what that section should actually be.

---

## 2026-03-25 — Performance pass + content expansion

**Performance** (the library had grown to ~1,400 files and was freezing cold starts and the browser)
- **Prebuilt prompt index** (`scripts/build-prompt-index.js` → `api/prompt-index.json`): metadata + 200-char previews generated at build time. Cold start **2–5s → <100ms**.
- **Lightweight mode** (`?lightweight=true`): preview-only payloads, full content lazy-loaded. Initial payload **13MB → 278KB**.
- **`GET /api/prompts/:id`**: fetch a single prompt with full content (file-based or DB).
- **Pagination** at 50/page: DOM elements **1,427 → 50**, memory ~200MB → ~20MB. Resets to page 1 on filter change. (Adjustable in `src/App.tsx`.)
- **File-size filter**: skip files >500KB during index build (excludes two multi-MB bulk collections).
- **5-minute in-memory cache** for public-library lightweight requests.

**Content**
- 7 new MCP-server prompt collections (~135 prompts): GitHub, Playwright, Serper, Google Workspace, n8n, Supabase, Firebase.
- Featured prompts refreshed toward developer roles (21 total); contextual emojis added.

**Fixes / maintenance**
- Converted new MCP files from comma-string tags to YAML arrays (fixed `tags.forEach is not a function`).
- Added missing `#` headings to 3 `SKILL.md` files.
- Renamed `Mcp_Servers/` → `MCP_Servers/` for consistent acronym casing.

> Folder names above (`Prompt_Library/…`) reflect the pre-rename layout; the library has
> since moved to the numbered `1_Guides`…`5_System_Prompts` scheme.

---

_Superseded planning docs from March-June 2026 were removed on 2026-08-26; they remain in
Git history. The per-section `docs/library-update-logs/` tree was folded into this file at
the same time._
