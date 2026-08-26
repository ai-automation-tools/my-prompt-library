# Repository Audit — my-prompt-library

**Date:** 2026-08-26 · **Branch audited:** `chore/dedupe-skills` (1 commit ahead of `main`)
**Live:** `prompts.mikesailab.com` (Vercel)

> **Status — updated 2026-08-26, after the first remediation pass.**
> Everything under **"This week — security"** is done and verified, except the one item
> that is not a code change: **rotating the Neon password**. §2.1 traversal is closed
> (exploit re-run, now `400`), §2.2 tokens use `randomBytes(32)`, §2.4 is at **0 npm
> advisories** (was 22), §5.5's email log is gone. Freshness items 6, 7 and 8 are done
> as well: provenance is stamped, all 323 skills are spec-valid, and a weekly drift check
> ships. The resync work those enable (items 9-10) and everything under "Next" are open.
> The findings below are preserved as written at audit time; see the action plan at the
> end for what changed.

---

## Verdict

The app is **not** the problem. It typechecks clean, the index builds deterministically,
the frontend was already refactored down from 2,845 → 1,050 lines, and `main` is deployable.

Three things are actually wrong, in this order:

1. ~~**Two confirmed security bugs** — a working path traversal and session tokens generated
   with `Math.random()`.~~ **Fixed 2026-08-26** — see the action plan. The Neon password
   still needs rotating by hand.
2. ~~**No provenance on vendored content.** 2.9% of the library records where it came from.~~
   **Addressed 2026-08-26** — every skill now carries an `upstream:` block, 99 of 323 with a
   resolvable origin and the rest honestly marked `ambiguous` or `unknown`. A weekly job
   reports what has drifted. The resync work itself remains.
3. **Dev and prod have silently diverged.** `server.ts` and `api/index.ts` are two
   hand-maintained implementations of the same API and they no longer agree on routes or
   payload size.

Everything else is hygiene.

---

## Scorecard

| Area | State | Notes |
|:---|:---|:---|
| Build & typecheck | 🟢 Pass | `tsc --noEmit` clean; index rebuilds byte-identical except `buildTime` |
| Content freshness | 🟡 **Now measured** | 99/323 skills attributed, weekly drift check shipped. Resync work remains |
| Security (code) | 🟢 **Fixed** | Traversal closed and re-tested; tokens now `randomBytes(32)`. Was: 2 confirmed vulns |
| Security (deps) | 🟢 **0 advisories** | Was 22 (2 critical, 12 high). Three unused deps dropped along the way |
| Dev/prod parity | 🟠 Diverged | Two API implementations, ~2,000 duplicated lines, different behavior |
| Content quality | 🟡 **Skills fixed** | All 323 skills now spec-valid. 457/547 "agents" still aren't agents |
| Tests / CI | 🔴 None | No test files, no `.github/`, nothing gates a merge |
| Repo hygiene | 🟠 Bloated | 37 MB of `Legacy/` shipped; 5.8 MB of unindexed dead files; 6 stale branches |
| Docs | 🟢 Good | ROADMAP / ARCHITECTURE / CHANGELOG all refreshed 2026-08-22 |

---

## Inventory

Measured 2026-08-26, excluding `Legacy/`:

| Section | Files (`.md`) | Size | Indexed |
|:---|---:|---:|---:|
| `1_Guides` | 101 | 0.4 MB | ✅ |
| `2_Agents` | 548 | 7.9 MB | ✅ (2 skipped, see §4.4) |
| `3_Skills` | 724 (323 `SKILL.md` + 401 support) | 5.8 MB | 323 only |
| `4_Prompts` | 561 | 1.4 MB | ✅ |
| `5_System_Prompts` | 198 | 1.7 MB | ✅ |
| **Total indexed** | | | **1,725 prompts / 1.06 MB index** |
| `Legacy/` | 2,393 files | 37 MB | ❌ excluded, still tracked & deployed |

Deploy root (`site/`, excluding `node_modules` and `dist`) is **75 MB**, of which
**about half is content that never reaches a user**.

---

# Part 1 — The freshness problem

This is the question that prompted the audit, so it gets the most space.

## 1.1 The library has almost no provenance

Frontmatter key coverage across all 2,132 content files:

| Key | Files | Coverage |
|:---|---:|---:|
| `title` | 1,391 | 65% |
| `tags` | 1,391 | 65% |
| `description` | 447 | 21% |
| `name` | 443 | 21% |
| `source` | 61 | **2.9%** |
| `updated` | 26 | **1.2%** |
| `repository` | 26 | **1.2%** |
| `version` | 5 | 0.2% |

For 97% of the library there is no record of **where it came from**, **what commit it was
taken at**, or **when it was pulled**. That is the whole problem. A sync tool cannot be
written against content that does not declare its origin — you would be re-deriving 2,000
attributions by hand every time you wanted to check for updates.

Worse, the freshness signal the app *does* surface is fake: `lastModified` in
`prompt-index.json` is the **filesystem mtime**, which is set by whenever Git last checked
the file out. Every prompt on the live site currently claims it was modified 2026-08-24.
Nothing in the library is actually that new.

## 1.2 Measured drift against a live upstream

I compared all 19 skills the library shares with `anthropics/skills` (172k stars, last
pushed 2026-08-21) against upstream `main`.

**All 19 differ.** Splitting by *why*:

**12 differ only in frontmatter** — body byte-identical to upstream HEAD: `brand-guidelines`,
`internal-comms`, `mcp-builder`, `pdf`, `slack-gif-creator`, `web-artifacts-builder`,
`webapp-testing`, `theme-factory`, `skill-creator`, `canvas-design`, `algorithmic-art`,
`doc-coauthoring`. The only delta is the emoji prefix added to `name:` locally — and that
edit is itself a bug (§4.1). **These prove sync is tractable.**

**7 are materially stale:**

| Skill | Local | Upstream | Gap |
|:---|---:|---:|:---|
| `claude-api` | 2,505 words / 26 files | 10,165 words / 68 files | **75% of content missing**, 42 support files missing |
| `discernment-nudge` | 430 w | 1,751 w | 75% missing |
| `academy-guide` | 382 w | 1,209 w | 68% missing |
| `frontend-design` | 585 w | 1,336 w | 56% missing |
| `pptx` | 1,415 w | 3,129 w | 55% missing |
| `docx` | 2,611 w | 975 w | local is a **pre-refactor** copy; upstream moved detail into `references/` |
| `xlsx` | 1,608 w | 1,312 w | same — local predates the refactor |

`claude-api` is the sharpest case: upstream rewrote it on 2026-08-21 for the Python SDK
0.x → 1.x migration. The local copy predates that entirely, so anyone installing it gets
guidance for a superseded SDK.

**Extrapolate.** If the *best-maintained* publisher in the library — one whose skills were
clearly pulled recently — is 37% materially stale, the long tail (skillsmp.com scrapes,
`mcpmarket.com`, one-off GitHub repos) is worse and currently unmeasurable.

## 1.3 One upstream is already gone

`openclaw/skills` returns **404**. Roughly 10 files cite it as their source. Every other
sampled upstream is alive and moving fast:

| Upstream | Stars | Last push |
|:---|---:|:---|
| `obra/superpowers` | 278k | 2026-08-19 |
| `anthropics/skills` | 172k | 2026-08-21 |
| `wshobson/agents` | 39k | 2026-08-26 |
| `github/awesome-copilot` | 38k | 2026-08-26 |
| `vercel-labs/skills` | 30k | 2026-08-18 |
| `huggingface/skills` | 11k | 2026-08-25 |
| `openai/plugins` | 5k | 2026-08-26 |
| `NeverSight/learn-skills.dev` | 203 | 2026-08-26 |
| `openclaw/skills` | — | **404 — repo gone** |

All of them ship changes weekly or faster. A library synced by hand, twice a year, cannot
track that.

## 1.4 Model references are a year behind

Files referencing each model ID (excluding `Legacy/`):

| Model | Files | Status |
|:---|---:|:---|
| `claude-opus-4` | 23 | superseded |
| `claude-3-5-sonnet` | 22 | **deprecated** |
| `gpt-4o` | 18 | superseded |
| `claude-sonnet-4-5` | 12 | superseded |
| `claude-haiku-4-5` | 9 | still current |
| `claude-3-opus` / `-3-haiku` / `-3-7-sonnet` | 20 | **deprecated** |
| `gemini-1.5` | 7 | deprecated |
| `gpt-5` | 6 | superseded |
| **`claude-opus-5` / `claude-sonnet-5` / `claude-fable-5`** | **0** | **not referenced anywhere** |

Zero files in the entire library mention the current Claude 5 family. 34 files still say
"Claude 3.5" in prose. This is the most visible staleness to a visitor — it is the first
thing that signals the library is not maintained.

48 files link `docs.anthropic.com`. Those still 301 to `platform.claude.com`, so they work,
but they read as dated.

## 1.5 Link rot

- **ResourcesNav** (the curated external directory, 33 links): **2 dead** —
  `docs.anthropic.com/en/docs/agents-and-tools/overview` and
  `learnprompting.org/docs/basics/system_prompts`.
- **Library content**: 138 unique GitHub repo links; sampled 60, found 4 dead (~7%) —
  including `SeanJ1ang/design-judge-skills`, which is cited as a `source:`. Extrapolates to
  roughly 8–10 dead repos linked from content.

## 1.6 What to actually build

The lazy version, in dependency order. **Step 1 is the only one that matters** — every
other step is trivial once it exists, and impossible before.

**Step 1 — Stamp provenance. One-time backfill.**

Add to every vendored file's frontmatter:

```yaml
upstream:
  repo: anthropics/skills
  path: skills/claude-api/SKILL.md
  sha: a1b2c3d          # commit the copy was taken at
  fetched: 2026-08-26
  license: MIT
```

`scripts/add-frontmatter.mjs` already exists — extend it. The ~60 files that have `source:`
migrate mechanically. The rest match by skill/agent name against the nine known upstreams
above, which cover the large majority; anything that does not match gets
`upstream: original` and is excluded from sync forever. Budget a day.

**Step 2 — One drift script. ~120 lines, no new dependencies.**

`scripts/check-upstream-drift.mjs`: read every `upstream:` block → `gh api` the file at
upstream `main` → compare body hash *after stripping frontmatter* (this is the §1.2 method,
and it correctly separated 12 cosmetic diffs from 7 real ones) → emit a markdown table of
`{ file, local_sha, upstream_sha, words_local, words_upstream, verdict }`.

Verdicts: `current` / `cosmetic-only` / `behind` / `upstream-gone`.

**Step 3 — One weekly GitHub Action that opens an issue and changes nothing.**

```yaml
on: { schedule: [{ cron: '0 9 * * 1' }] }
```

Runs step 2, opens (or updates) a single issue titled `Upstream drift — <date>` with the
table. You triage. **Do not auto-merge upstream content** — the curation *is* the product,
and an auto-PR that reflows 300 files into the wrong categories destroys it.

**Step 4 — Surface freshness in the UI.**

Replace the fake `lastModified` (filesystem mtime) in `build-prompt-index.js` with
`upstream.fetched`, and add a `stale` boolean the card can render. A visitor seeing
"synced 2026-08-24" on every single card is worse than showing no date at all.

> **Lazier alternative worth considering:** for the three or four publishers vendored
> *wholesale* (`anthropics/skills`, `huggingface/skills`, `vercel-labs/skills`), a git
> submodule plus a mapping file gets you `git submodule update --remote` and zero sync code.
> Not the primary recommendation because it fights the curated category tree — but if
> freshness ever matters more than categories, it replaces steps 1–3 for those repos in an
> afternoon.

---

# Part 2 — Security (fix first)

## 2.1 🔴 Path traversal in the skill-download endpoint — CONFIRMED EXPLOITABLE

`site/server.ts:473` and `site/api/index.ts:689`:

```ts
const skillPath = decodeURIComponent(req.params.skillPath).replace(/\\/g, '/');
if (!skillPath.startsWith('3_Skills/')) {            // ← the only check
  return res.status(400).json({ error: "Invalid skill path..." });
}
const fullPath = path.join(LIBRARY_PATH, skillPath); // ← escapes the check
```

`startsWith('3_Skills/')` is satisfied by `3_Skills/../../anything`. Verified against the
running dev server:

```
GET /api/skills/download/3_Skills%2F..%2F..%2Fdb
→ 200 application/zip, 2,789 bytes
→ archive contains: postgres.ts (13,004 bytes)
```

That is the database layer zipped and served to an unauthenticated caller. The identical
code is in the Vercel handler, where it exposes anything inside the lambda bundle. The
endpoint has **no auth middleware at all**.

**Fix** (both files):

```ts
const fullPath = path.resolve(LIBRARY_PATH, skillPath);
if (!fullPath.startsWith(path.resolve(LIBRARY_PATH, '3_Skills') + path.sep)) {
  return res.status(400).json({ error: 'Invalid skill path' });
}
```

## 2.2 🔴 Session tokens are not cryptographically random

`site/db/postgres.ts:336`:

```ts
const token = `${Math.random().toString(36).substr(2)}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
```

`Math.random()` is a non-cryptographic PRNG — V8 uses xorshift128+, whose internal state is
recoverable from a modest number of observed outputs. `Date.now()` contributes no entropy
an attacker does not already have. These tokens are the **only** thing authenticating a
30-day session cookie: there is no JWT signature and no server-side secret.

The same pattern generates user IDs (line 70) and prompt IDs (line 156), which is a
collision risk rather than a security one.

**Fix:**

```ts
import { randomBytes } from 'node:crypto';
const token = randomBytes(32).toString('base64url');
```

Then invalidate existing sessions (`DELETE FROM user_sessions`).

*Also:* `.substr()` is deprecated at all three call sites.

## 2.3 The same traversal shape in four more places

- `api/index.ts:398` — `GET /api/prompts/:id` → `path.join(LIBRARY_PATH, promptId)`, no
  containment check. Arbitrary file *read*, returned as JSON. Unexploitable locally only
  because `server.ts` never implements this route (§3.2) — it is live on Vercel.
- `api/index.ts:549` and `server.ts:406` — `copy-to-my-prompts`, same pattern, behind auth.
- `api/skill-packs.ts:91` and `routes/skill-packs.ts:52` — same pattern.

One shared helper, `resolveInside(root, relPath)`, covers every call site including §2.1.

## 2.4 🟠 Dependency advisories

**22 total: 2 critical, 12 high, 7 moderate, 1 low.**

| Severity | Package | Fix |
|:---|:---|:---|
| CRITICAL | `protobufjs` ≤7.6.4 | `npm audit fix` (safe) |
| CRITICAL | `tar` ≤7.5.20 | `npm audit fix` (safe) |
| HIGH | `vite` ≤6.4.2 — path traversal, arbitrary file read via dev-server WebSocket, `server.fs.deny` bypass on Windows | `npm audit fix` (safe) |
| HIGH | `ws`, `lodash`, `js-yaml`, `nanoid`, `postcss`, `picomatch`, `brace-expansion`, `@mapbox/node-pre-gyp` | `npm audit fix` (safe) |
| HIGH | `undici`, `path-to-regexp`, `esbuild`, `ajv` — all transitive via `@vercel/node@3` | requires `@vercel/node@8` (major) |

**20 of 22 clear with a plain `npm audit fix`.** Do that today. The remaining 4 all trace to
`@vercel/node` being five majors behind and belong in one deliberate upgrade.

## 2.5 What is fine

- ✅ `.env` is gitignored and has never been committed (`git log -- .env` is empty).
- ✅ The local `DATABASE_URL` is a placeholder (`HOST`), not a live credential.
- ✅ All SQL in `db/postgres.ts` is parameterized. No injection found.
- ✅ Cookies are `httpOnly`, `sameSite: 'lax'`, `secure` in production.
- ✅ bcrypt cost 10 — acceptable.

> **Still outstanding:** the standing note about rotating the Neon password is **not**
> resolved by the local `.env` being a placeholder. The credential was in Git history and
> the history was scrubbed — but a scrub does not un-leak. Rotate it in the Neon dashboard.

---

# Part 3 — Dev/prod divergence

## 3.1 Two hand-maintained implementations of one API

| Concern | Local dev | Vercel |
|:---|:---|:---|
| Prompts + auth | `server.ts` (552 lines) | `api/index.ts` (740 lines) |
| Skill packs | `routes/skill-packs.ts` (335) | `api/skill-packs.ts` (394) |

~2,000 lines of largely parallel logic — same handler bodies, different routing (Express
params vs. hand-rolled regex on `urlPath`). Nothing enforces that they agree. They already
do not:

## 3.2 `GET /api/prompts/:id` exists only in production

`src/App.tsx:378` fetches it on every prompt click. `server.ts` never defines that route, so
locally it falls through to Vite and returns the SPA's HTML:

```
GET /api/prompts/1_Guides%2FAPI_Providers%2Fanthropic-api-guide.md
→ 200 text/html  (<!doctype html>…)
```

The frontend swallows it — `if (response.ok)` is true for the HTML, `.json()` throws, the
`catch` logs and silently reuses the cached prompt object. It *looks* fine locally only
because of the next bug.

## 3.3 The dev server ships 15.5 MB per page load

`server.ts` has zero handling for the `lightweight` query param that both `api/index.ts` and
`src/App.tsx:252` rely on:

```
GET /api/prompts?library=public&lightweight=true
  dev  → 15,499,260 bytes   (4.6 MB gzipped — all 1,725 prompts at full length)
  prod →  ~1,060,000 bytes  (prebuilt index, 200-char previews)
```

15× heavier. It also means dev already holds every prompt's full content in memory, which is
exactly why §3.2 is invisible: you are testing against a materially different API than you
ship.

**Fix:** collapse to one implementation. Extract handler bodies into `api/handlers/*.ts` and
have `server.ts` mount them through a thin Express adapter. That deletes roughly 900
duplicated lines and makes divergence structurally impossible.

> **Lazier alternative:** run `vercel dev` locally and delete `server.ts` outright. Smaller
> diff, removes the second implementation entirely. It costs the Vite HMR middleware setup,
> which is the only reason `server.ts` exists.

## 3.4 No tests, no CI

No `*.test.*` / `*.spec.*` anywhere. No `.github/`. Nothing runs `tsc --noEmit` before a
merge, and nothing would have caught §3.2 or §3.3.

Minimum useful gate — one workflow, three steps: `npm ci` → `npm run lint` →
`npm run build:index` and fail if `git diff --exit-code` shows changes beyond `buildTime`.
That last check alone catches "someone edited the library and forgot to rebuild the index."

---

# Part 4 — Content quality

## 4.1 🔴 The emoji prefixes break the skill spec

Local skills carry decorated names:

```yaml
name: 🛠️ skill-creator
name: "✨ brand-guidelines"
```

The Agent Skills spec requires `name` to be lowercase alphanumeric-plus-hyphen and to
**match the containing directory**. Measured across 323 `SKILL.md`:

| Check | Count | Share |
|:---|---:|---:|
| `name` contains non-ASCII (emoji) | 165 | 51% |
| `name` does not match `^[a-z0-9-]+$` | 182 | 56% |
| `name` ≠ directory name (after stripping emoji) | 165 | 51% |
| **missing `name` entirely** | **23** | **7%** |
| **missing `description` entirely** | **23** | **7%** |

The 23 with no `name`/`description` **will not load as skills at all** — they are inert
markdown inside a downloaded zip. The 165 emoji names are a coin flip on whether a given
runtime rejects, silently renames, or tolerates them.

This is also what makes §1.2 harder than it needs to be: the emoji edit is the *only*
difference in 12 of 19 Anthropic skills. Move the emoji to `title:` — which the site already
uses for display — and those 12 become byte-identical to upstream: trivially syncable and
spec-valid at once.

**Fix:** one script. `name:` ← directory name, emoji → `title:`, backfill the 23 missing
pairs from the first `# Heading` and first paragraph. Half a day.

## 4.2 🟠 `2_Agents` is mostly not agents

**457 of 547** files in `2_Agents` have no `name:` or `description:` frontmatter, so they
cannot load as subagents. Only ~90 are real agent definitions. The rest are role-play
prompts and reference docs filed under the wrong section.

Model pins among the ~90 real ones:

| `model:` | Count |
|:---|---:|
| `sonnet` / `opus` / `haiku` / `inherit` — aliases, correct | 108 |
| `claude-3-5-sonnet` — **deprecated pin** | 3 |
| `"gpt-4o"` | 3 |
| `Claude Sonnet 4.5 (copilot)`, `gemini 2.5`, `GPT-5.2-Codex (copilot)` — free text, invalid | 5 |
| `claude-sonnet-4` | 1 |

**Either** move the 457 non-agents into `4_Prompts`, **or** relabel the section "Agent
Prompts" and stop implying they are installable. The current state is the worst of both — a
user downloads an "agent" and it does nothing.

## 4.3 Semantic duplicates survived the byte-level dedupe

The 2026-08-24 pass (347 → 323 skills) worked: only **2** duplicate content hashes and **2**
duplicate skill directory names remain library-wide.

But near-duplicates *by topic* remain — **16 groups** in `2_Agents` alone, after normalizing
away `pro|expert|developer|engineer|specialist|architect|senior`:

- **C#** — 5 files: `csharp-developer`, `CSharpExpert`, `c-sharp-pro`, `csharp-mcp-expert`, `csharp-dotnet-janitor`
- **React frontend** — 3 · **Python backend** — 3 · **social media manager** — 3
- 2 each: Vue, Rust, SEO, DevOps, copywriter, technical writer, penetration tester,
  smart contract auditor, market research analyst, whitepaper

For a *curated* library, five C# agents with no stated difference is worse than one good one.

## 4.4 Two files are 5.8 MB of dead weight

```
[SKIP] Large file: 2_Agents/Development/Other/act-as-an-expert.md          (3,363 KB)
[SKIP] Large file: 2_Agents/Development/Other/promptsdotchat-opensource.md (2,484 KB)
```

`build-prompt-index.js` skips anything over 500 KB, so these are **never indexed, never
searchable, never reachable** — yet they are 74% of `2_Agents`'s 7.9 MB and ship in every
deploy. They are bulk `awesome-chatgpt-prompts`-style dumps. Split them into individual
prompts or delete them.

## 4.5 Formatting

- **2,131 of 2,132** content files use CRLF line endings and there is **no `.gitattributes`**.
  Every cross-machine edit risks a whole-file diff. Add `*.md text eol=lf` and normalize once.
- Frontmatter shape is inconsistent across sections: `1_Guides` uses `title`/`tags`/`category`,
  `3_Skills` uses `name`/`description`, `2_Agents` uses both or neither. The index copes
  (`data.name || data.title || firstHeading || basename`), but it means no schema can be
  validated. Pick one shape per section and lint it.

---

# Part 5 — Repo hygiene

## 5.1 `Legacy/` — 37 MB shipped for nothing

2,393 tracked files, excluded from the index by all three readers
(`build-prompt-index.js`, `api/index.ts`, `server.ts`). Half the deploy root by size, zero
user-reachable value.

It is fully preserved in Git history. **Delete the directory**; recover with
`git checkout <sha> -- site/library/Legacy` if ever needed. That single change roughly halves
the deployed bundle.

## 5.2 Dependencies are broadly behind

**25 of 33 direct dependencies are outdated**, several by whole majors:

| Package | Current | Latest | Note |
|:---|:---|:---|:---|
| `@vercel/node` | 3.2.29 | 8.1.0 | source of the 4 advisories that cannot be fixed in place |
| `@google/genai` | 1.44.0 | 2.19.0 | major — **and nothing imports it** |
| `lucide-react` | 0.546.0 | 1.34.0 | major |
| `vite` | 6.4.1 | 8.2.2 | 2 majors; 6.x carries the HIGH advisories |
| `express` | 4.22.1 | 5.2.1 | major |
| `typescript` | 5.8.3 | 7.0.2 | 2 majors |
| `motion` | 12.35.2 | 13.1.1 | major |
| `archiver`, `better-sqlite3`, `@vitejs/plugin-react` | | | 1 major each |
| 14 others | | | patch/minor only — free |

**Suggested order:** (1) `npm audit fix` — clears 20 advisories, no breakage. (2) Take the
14 patch/minor bumps. (3) `@vercel/node@8` on its own branch — it is the security-relevant
one. (4) Leave `vite` / `typescript` / `express` majors for a deliberate session.

**Two dependencies appear unused** and are worth deleting rather than upgrading:
`@google/genai` (no import anywhere in `src/`, `api/`, or `server.ts`) and `better-sqlite3`
+ `@types/better-sqlite3` (superseded by the Postgres migration — a native module that has
to compile on every install, for nothing).

## 5.3 Branch sprawl

9 local / 8 remote branches. Six are **fully merged into `main`** and safe to delete:
`automation/add-skillsmp-skills-pr`, `codex/add-skillsmp-skills`, `roadmap/auto-2026-08-18`,
`roadmap/auto-2026-08-22`, `skills/trending-2026-08-19`, `mike_desktop`.

Only `chore/dedupe-skills` (current, 1 commit) is unmerged. No open PRs.

Note that `mike_desktop` is the documented working branch but is currently identical to
`main` — either resume using it or drop the convention from `CLAUDE.md`.

## 5.4 Working tree

Two uncommitted changes, both pre-existing and both intentional-looking: a move of
`docs/audits/PROJECT-AUDIT-2026-06-24.md` → `docs/archive/`. Commit or revert it.

## 5.5 Code smells (minor)

- `src/App.tsx` — 1,050 lines, **25 `useState`** + 10 `useEffect`. Down from 2,845, so the
  refactor worked; the remaining 25 hooks are the next natural extraction (a
  `useLibraryView` reducer would absorb most of them). Not urgent.
- **21 `: any`** in `api/index.ts` alone (46 across the codebase), despite `CLAUDE.md`
  mandating "strict TS, no `any`".
- 14 `console.log` calls on production request paths, including
  `[My Library] User: <id> <email>` at `server.ts:118` — that **logs a user's email on every
  request**. Remove it or gate it behind a debug flag.

---

# Prioritized action plan

## This week — security — ✅ DONE (except #4)

1. ✅ **Path traversal fixed.** New `site/lib/safe-path.ts` exports `resolveInside()`; all
   five user-controlled sinks route through it. In `api/index.ts` the skill-download check
   moved *above* the GitHub/filesystem split, because GitHub normalises `..` in `contents/`
   URLs too. `site/lib/safe-path.test.mjs` locks the behaviour in. The original exploit now
   returns `400`; legitimate skill zips still return `200`. §2.1, §2.3
2. ✅ **Session tokens** now `randomBytes(32).toString('base64url')`; user/prompt/session ids
   use `randomBytes(6)`. No `Math.random()` and no deprecated `.substr()` left in
   `db/postgres.ts`. **Still to do by hand:** `DELETE FROM user_sessions`, to invalidate
   every token minted by the old generator. §2.2
3. ✅ **0 npm advisories**, down from 22. `npm audit fix` cleared 14; the remaining 8 all
   traced to `@vercel/node` — a devDependency imported *only* for two `import type` aliases,
   whose latest release still ships vulnerable `undici` and `path-to-regexp` with no fixed
   version available. Replaced with `site/lib/vercel-types.ts` (23 lines) and removed.
   Also dropped `@google/genai` and `better-sqlite3` + `@types/better-sqlite3` — all three
   unused — and bumped `tsx` to 4.23.12. §2.4, §5.2
4. ⬜ **Rotate the Neon password.** Not a code change — needs the Neon dashboard. §2.5
5. ✅ **Email removed from the request log**, along with four other `[My Library]` debug
   lines in the same handler. §5.5

*Also done in passing:* removed the dead `process.env.GEMINI_API_KEY` define from
`vite.config.ts` — it inlined the key into the client bundle for a package nothing imported
— and dropped the now-stale `GEMINI_API_KEY` rows from `CLAUDE.md` and `.env.example`.

**Verified:** `tsc --noEmit` clean · `npm run build` clean · `npm audit` = 0 vulnerabilities ·
`lib/safe-path.test.mjs` passes · traversal re-tested with 5 payloads, all `400` ·
skill zip, prompt list, skill-packs list and unauthenticated My Library all still behave.

## This month — the freshness system — ✅ 6, 7 and 8 DONE

6. ✅ **Provenance stamped.** `scripts/attribute-upstream.mjs` matches on **content**, not
   name — local skills were renamed on import, so directory matching identified only 72 of
   347. Evidence comes from seven cloned publishers (which yield a real commit sha) plus a
   ~110k-skill mirror whose paths encode the origin repo, which is what reaches the long
   tail of tiny publishers.

   **99 of 323 skills attributed (31%), 32 with a commit sha.** The other 224 are recorded
   honestly rather than guessed: 60 `ambiguous` (body present in 3+ repos — the candidates
   are listed instead of picking one) and 164 `unknown`. Both are still stamped, because
   "we looked and could not tell" is a different fact from "nobody has checked".

   Two rules earn most of the accuracy, and both were found by checking output rather than
   trusting it:
   - **First-party precedence.** A skill forked into forty repos is still its author's. Without
     this, `pptx`/`docx`/`xlsx`/`claude-api` were all credited to random personal dotfile repos.
   - **Path resolution, not path trust.** Mirror paths follow the mirror's layout, not the
     origin's. Taking them at face value reported **72 live files as deleted**; the real
     number is 6.

7. ✅ **All 323 skills are now spec-valid** — 0 missing `name`, 0 missing `description`,
   0 invalid names (was 23 / 23 / 171). The decorative emoji moved to `title:`, `name:` is
   the directory slug, and the readers now prefer `title` (which also closes one dev/prod
   divergence, since `server.ts` already did). Index before vs after: 323 → 323, **265
   titles unchanged, 58 improved, 0 regressed.**

   > Correction to what this section originally claimed: this does **not** make the files
   > byte-identical to upstream. The `upstream:` block is added deliberately, so a whole-file
   > diff never matches again (measured: 0 of 19 Anthropic skills). The drift checker strips
   > frontmatter before comparing, so it never saw the emoji and none of its verdicts change.
   > The payoff is spec compliance alone — which is enough, since 23 skills genuinely could
   > not load.

8. ✅ **`check-upstream-drift.mjs` + weekly Action.** Compares bodies with frontmatter
   stripped — without that, all ~320 skills would report as drifted every week and the
   report would be worthless. Skips `unknown`/`ambiguous` rather than guessing. Opens or
   updates **one rolling issue** and never edits library content.

   **First run: 16 behind, 51 drifted, 26 current, 6 upstream-gone.** It found worse than
   this audit did by hand:

   | skill | upstream | missing |
   |:---|:---|---:|
   | `Development/code-tour` | github/awesome-copilot | **91%** |
   | `Data/huggingface-gradio` | huggingface/skills | **86%** |
   | `Content/brainstorming` | obra/superpowers | **86%** |
   | `AI_ML/huggingface-llm-trainer` | huggingface/skills | **84%** |
   | `AI_ML/.../discernment-nudge` | anthropics/skills | 77% |
   | `Development/API/claude-api` | anthropics/skills | 77% |

9. ⬜ **Resync the stale skills** — now a worklist, not a research project. Start with the
   table above. §1.2
10. ⬜ **Sweep deprecated model IDs** — 22 files on `claude-3-5-sonnet`, 20 on Claude 3.x,
    zero on Claude 5. §1.4

### Also found while doing this

- **12 duplicate groups the byte-level dedupe could not see**, because their names and
  frontmatter differ while their content is identical — e.g. `anthropic-brand-guidelines/`
  and `brand-guidelines/` are the same upstream file. On the deduplicated branch 2 groups
  remain (`skill-creator`, `brand-guidelines`). Deleting them is a curation call, so they
  are reported, not removed. §4.3
- **`openclaw/skills` is not the only dead upstream.** 6 skills point at files their
  publisher has since removed, including 3 from `openai/skills`.

## Next — structure

11. **Delete `Legacy/`** — 2,393 files, 37 MB, unreachable. Halves the deploy. §5.1
12. **Collapse the dual API** (or switch to `vercel dev` and delete `server.ts`). §3.3
13. **Add the CI gate** — `lint` + index-is-current. §3.4
14. **Decide what `2_Agents` is** — 457 of 547 files are not agents. §4.2
15. **Split or delete the two 3 MB prompt dumps.** §4.4
16. **Add `.gitattributes`, normalize CRLF, prune the 6 merged branches.** §4.5, §5.3
17. **Drop `@google/genai` and `better-sqlite3`** — both unused. §5.2

---

## Method

Static analysis of the working tree at `chore/dedupe-skills` (`5d46547`); `tsc --noEmit`;
`npm outdated` and `npm audit --json`; frontmatter parsed with `awk` across all 2,132
content files; upstream drift measured via `gh api` against each publisher's `main`,
comparing body hashes with frontmatter stripped; link liveness by `curl -L` (all 33
ResourcesNav links, plus a 60-link random sample of the 138 unique GitHub repo links).

The path traversal and the 15.5 MB payload were **reproduced against a running local
server**, not inferred.

Not covered: runtime behavior of the deployed Vercel functions, Neon schema and index
health, Vercel analytics, and per-file content accuracy beyond the frontmatter and
upstream-drift checks above.
