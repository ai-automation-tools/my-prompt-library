# Changelog

Shipped work, newest first. Forward-looking plans live in [ROADMAP.md](ROADMAP.md).

---

## 2026-08-18 — Audit follow-through: rename drift, index correctness, App.tsx de-bulk

Working through [audits/PROJECT-AUDIT-2026-06-24.md](audits/PROJECT-AUDIT-2026-06-24.md).
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

_Older history and superseded planning docs are under [archive/](archive/)._
