# Changelog

Shipped work, newest first. Forward-looking plans live in [ROADMAP.md](ROADMAP.md).

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

`x-twitter-scraper` was deliberately skipped. Its upstream ships ~60 `references/*.md` files
that are SEO landing copy ("best-x-api-alternative", "reliable-twitter-data-api-2026") rather
than skill content. Pulling them would add marketing pages to a library that already has a
payload problem. It stays the sole `behind` entry until someone decides it is worth carrying.

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
