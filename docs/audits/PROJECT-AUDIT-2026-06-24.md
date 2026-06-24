# my-prompt-library — Project Audit

**Date:** 2026-06-24
**Scope:** Whole-repo health check + UI bulk analysis (`prompts.mikesailab.com`)
**Trigger:** "It's been a while; the data here is stale and the interface feels too bulky."

---

## TL;DR

The app is healthy and live, but two things have drifted:

1. **Docs & metadata are stale.** The README's project-structure section and the
   `docs/planning/PROJECT-STATUS.md` stats describe the *pre-rename* library layout and
   item counts that are ~3 months and thousands of files out of date. `.env.example`
   omits the single most important variable (`DATABASE_URL`).
2. **The interface is genuinely bulky — and most of it is in one file.** `src/App.tsx`
   is a **2,845-line monolith** holding ~40 `useState` hooks, the entire layout, and a
   **~490-line block of hardcoded external-link mega-menus** that compete with the app's
   real navigation. This is the "bulky" feeling, and it's fixable without a rewrite.

Nothing here is on fire. These are cleanup/maintainability items, prioritized below.

---

## 1. Current state (measured, not remembered)

| Thing | Reality on 2026-06-24 |
|:---|:---|
| Live URL | `prompts.mikesailab.com` (Vercel), deploy branch `main`, work branch `mike_desktop` |
| Frontend | React 19 + TS + Vite 6 + Tailwind v4, Fuse.js, lucide-react, `motion` |
| Backend | Express (`server.ts`, dev, port 3010) + Vercel serverless (`api/index.ts`, `api/skill-packs.ts`) |
| Data | Public Library = markdown files in `library/`; user data = Neon Postgres |
| `src/App.tsx` | **2,845 lines**, ~40 `useState` hooks in one component |
| Other components | EmptyState, LoginModal, SignupModal, PromptEditorModal (329), SkillPacksView (544), Toast |
| Backend LOC | server.ts 528, api/index.ts 710, api/skill-packs.ts 388, db/postgres.ts 426, routes 490, middleware 85 |
| `api/prompt-index.json` | 2.3 MB, **3,652 prompts**, built **2026-05-10** (stale vs. current files) |
| Library files (`.md`) | 1_Guides 101 · 2_Agents 548 · 3_Skills 741 · 4_Prompts 561 · 5_System_Prompts 198 · **Legacy 1,723** |

**Library folder layout is now numbered:** `1_Guides / 2_Agents / 3_Skills / 4_Prompts /
5_System_Prompts`, plus a `Legacy/` tree (`*_OLD`) that is not indexed or shipped. The
docs still describe the old flat names.

---

## 2. Stale data — findings & fixes

### 2.1 `docs/planning/PROJECT-STATUS.md` — badly out of date
- "Last Updated 2026-03-27"; reports **1,263 total items** and the old layout
  (`Agent_Guides/`, `Agents/`, `Skills/`, `System_Prompts/`). Current index has **3,652**
  prompts and the numbered folders. Phase 1/2/3 "gap-filling" plan is ~3 months idle.
- **Fix:** Either refresh the counts + structure section, or demote it to
  `docs/archive/` and stop treating it as current. Recommend the latter — the live
  source of truth for counts is `api/prompt-index.json` (`promptCount`), not a hand-kept doc.

### 2.2 `README.md` — project-structure section describes a layout that no longer exists
- Lines ~131–146 show `library/Prompt_Library/`, `Agent_Instructions/`, `Agent_Guides/`,
  `System_Prompts/`. Actual: `library/1_Guides … 5_System_Prompts` + `Legacy/`.
- The Environment-Variables block is fine, but **`.env.example` contradicts it** (below).
- **Fix:** Update the structure block to the numbered folders; one paragraph, low risk.

### 2.3 `.env.example` — missing `DATABASE_URL`
- The app's auth and "My Library" both require `DATABASE_URL` (`db/postgres.ts:15`), yet
  `.env.example` only documents `USE_GITHUB_MODE` + `GITHUB_*`. A new clone can't run
  auth without reading the code. (This audit added a complete `.env` with the full set.)
- **Fix:** Add `DATABASE_URL`, `NODE_ENV`, and `GEMINI_API_KEY` (optional) to `.env.example`.

### 2.4 Prompt index drift
- `api/prompt-index.json` was built 2026-05-10; library files have changed since.
- **Fix:** Run `npm run build:index` (also runs automatically in `vercel-build`), and
  consider a pre-deploy reminder so the committed index never lags the files.

### 2.5 `package.json` identity
- `"name": "react-example"`, `"version": "0.0.0"` — leftover scaffold metadata.
- **Fix:** Rename to `my-prompt-library`; cosmetic but it's the kind of staleness that
  signals "nobody's looked at this in a while."

---

## 3. The "bulky interface" — what's actually heavy

The bulk is real and concentrated in **`src/App.tsx` (2,845 lines)**. Three distinct problems:

### 3.1 One monolithic component (~40 `useState` hooks)
`App()` owns *everything*: prompt data, selection, search + debounce, tags, sort,
pagination, sidebar state, theme menu, library mode, favorites, recently-viewed, **and
six independent "external resources" dropdown toggles** (`cliReposOpen`, `promptsOpen`,
`agentTemplatesOpen`, `skillsOpen`, `toolsOpen`, plus four sub-menu toggles). Every state
change re-renders the entire page tree. This is the root of the "bulky" feel both in the
code and (via re-renders) at runtime.

### 3.2 Two parallel navigation systems competing for attention
- **Left sidebar** (lines ~1199–1504): the *real* product nav — library-mode switcher,
  section dropdown, category list, favorites, recently-viewed, tag filter, 16-theme picker.
- **Top-bar center "External Resources" mega-menus** (lines ~1519–2011, **~490 lines**):
  **hardcoded external links** to Claude Code / Gemini CLI / Codex repos, prompt sites,
  agent templates, skills, tools. These have nothing to do with the user's library — they
  are a curated link directory bolted onto the primary nav bar, each entry repeating ~10
  lines of identical `<a>` markup.

The result: the most prominent horizontal nav real estate points *away* from the product,
while the actual content nav is in the sidebar. That duplication is the visual bulk.

**Fix options (pick one):**
- **Lightest:** Collapse the five top-bar mega-menus into a single "Resources" dropdown,
  or move them into the sidebar / a footer / a dedicated `/resources` page.
- **Better:** Drive them from a data array (`const RESOURCES = [{label, href, icon}]`) and
  `.map()` one `<ResourceMenu>` component — deletes ~400 lines of repeated JSX outright.

### 3.3 Inline sub-components defined inside render
`PromptCard` (and similar) are defined *inside* `App()` with `memo(...)`, so they're
recreated on each render and the `memo` buys little. Extracting to `src/components/`
restores the memoization benefit and shrinks the file.

### 3.4 Concrete decomposition target
Bring `App.tsx` from ~2,845 → roughly ~600–800 lines by extracting:

| Extract | Approx. source | Into |
|:---|:---|:---|
| External-resources menus | ~490 lines (data-driven) | `components/ResourcesNav.tsx` |
| Sidebar (categories, favorites, tags, theme) | ~300 lines | `components/Sidebar.tsx` |
| Prompt card | ~120 lines | `components/PromptCard.tsx` |
| Prompt detail view | ~190 lines (2613–2800) | `components/PromptDetail.tsx` |
| Search/sort/filter + pagination state | hooks | `hooks/usePromptFilters.ts` |

None of this changes behavior; it's mechanical extraction + lifting a few state slices.
Do it incrementally (one component per PR) so each diff stays reviewable and Vercel
preview-deploys verify nothing broke.

---

## 4. Smaller observations

- **Theme count:** 16 themes in `src/themes.css` + the `Theme` union in `App.tsx`. Fine,
  but it's another always-rendered menu; consider grouping or lazy-mounting the picker.
- **`backup/` directory** at repo root (old SQLite `db/index.ts`) — dead weight; archive
  or delete once confirmed unused.
- **Loose root scripts** (`check_skills.py`, `get_popular_skills.py`, `get_raw_urls.py`,
  `import/`) sit at the top level. If still useful, move under `scripts/`; otherwise prune.
- **`docs/archive/` already holds 17 historical docs** — good instinct; `PROJECT-STATUS.md`
  belongs there too.

---

## 5. Recommended order of work

1. **Stale-data quick wins (≈30 min, low risk):** fix `.env.example`, README structure
   block, `package.json` name; archive `PROJECT-STATUS.md`; rebuild the prompt index.
2. **Bulk win #1 (high impact):** data-drive + extract the top-bar external-resources
   menus → ~400 fewer lines, clearer nav. One PR.
3. **Bulk win #2:** extract `Sidebar`, `PromptCard`, `PromptDetail`; lift filter/search
   state into a hook. Two–three small PRs, each preview-deployed.
4. **Optional:** revisit the dual-nav UX — decide whether the external link directory
   stays in the top bar at all, or moves to a dedicated page.

Items in §1–§2 are documentation/metadata and safe to do immediately. Items in §3 are
refactors — behavior-preserving, but verify each against a Vercel preview before merging
to `main`.
