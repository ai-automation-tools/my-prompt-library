# Roadmap — my-prompt-library

**Updated:** 2026-08-18 · **Live:** `prompts.mikesailab.com` (Vercel) · **Branches:** work `mike_desktop` → deploy `main`

Single source of truth for *what's next*. Forward-looking only — shipped work lives in
[CHANGELOG.md](CHANGELOG.md); the analysis that seeded the current items is in
[audits/PROJECT-AUDIT-2026-06-24.md](audits/PROJECT-AUDIT-2026-06-24.md).

---

## Snapshot

| | |
|:---|:---|
| Stack | React 19 + TS + Vite 6 + Tailwind v4 · Express/Vercel serverless · Neon Postgres |
| Public Library | Markdown files in `library/` (numbered: `1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`; `Legacy/` excluded from the index) |
| User data | Postgres: `users`, `user_prompts`, `user_sessions`, `user_skill_pack_installs` |
| Prompt index | `api/prompt-index.json` — **1,722** prompts, 1.06 MB (rebuild with `npm run build:index`) |
| `src/App.tsx` | **1,393 lines** (was 2,845), 27 `useState` hooks |
| Health | Production-ready and live. Items below are UX/content/maintainability, not outages. |

> Counts are read from `api/prompt-index.json` (`promptCount`), not kept by hand here.

---

## Now — decisions and follow-ups

- [ ] **Verify the smaller index on a Vercel preview before merging to `main`.** The public
      library legitimately drops from 3,826 → 1,722 entries: `Legacy/` (1,705 stale `*_OLD`
      duplicates) and 421 skill *sub-files* (`examples/`, `references/`) are no longer indexed.
      Nothing users could reach is gone, but the headline count on the live site changes.
- [ ] **UX decision (needs Mike):** does the external-link directory belong in the primary
      nav at all, or move to the sidebar / a footer / a dedicated `/resources` page? The
      menus are now data-driven in `components/ResourcesNav.tsx`, so any of these is cheap.
- [ ] **Fill in the real `DATABASE_URL`** in `site/.env` (currently a placeholder, so auth and
      My Library are dead locally). Pull it from the Vercel project env or the Neon dashboard.
      The dev server now boots without it and serves the read-only Public Library.
- [ ] **Prune root clutter — needs a call on each, all are Git-tracked with real content:**
      - `backup/` (224 files: old SQLite `db/`, plus a `My_Prompts/` tree) — archive or delete?
      - `import/` (795 files: `game-design-skills`, `Prediction_Markets`, `Writing_Documentation`)
        — is this staged content still waiting to be merged into `library/`, or dead?

---

## Next — finish the `App.tsx` de-bulk

`App.tsx` is down to **1,393 lines** from 2,845. The audit's target was ~600–800, so roughly
one more extraction pass. Behavior-preserving, one small PR at a time, each Vercel-previewed.

- [ ] **Extract the top bar / header** (search field, sort control, library-mode switcher,
      auth buttons) into `components/TopBar.tsx`.
- [ ] **Extract the prompt grid + pagination** into `components/PromptGrid.tsx` — it consumes
      `paginatedPrompts` / `totalPages` straight from `usePromptFilters`.
- [ ] **Lift the remaining URL/routing state** (`activeTab`, `activeCategory`, `activeSubcategory`,
      `promptPathParam` and their `history.pushState` effects) into a `useLibraryRoute` hook.
      This is the largest single block of `useState` + `useEffect` still in the monolith.
- [ ] Consider lazy-mounting the 16-theme picker so it isn't in every render tree.

---

## Then — build & payload

- [ ] **Code-split the bundle.** `dist/assets/index-*.js` is **976 KB** (264 KB gzipped) and Vite
      warns on every build. Route/modal-level `React.lazy` on `SkillPacksView`,
      `PromptEditorModal`, and the auth modals is the obvious first cut.
- [ ] **Recover the two multi-MB bulk files.** `act-as-an-expert.md` (3.4 MB) and
      `promptsdotchat-opensource.md` (2.5 MB) are skipped by the 500 KB index filter, so they
      are invisible in the app. Split them into individual prompts or drop them.
- [ ] **Guard against index drift in CI.** `vercel-build` rebuilds the index, so a stale
      committed copy never reaches production — but it does make local `git status` noisy.
      Either stop committing `api/prompt-index.json` or add a pre-commit rebuild.

---

## Later — content & features

### Library content
- [ ] Expand thin categories: Healthcare, Education, Legal/Compliance, E-commerce, Personal Productivity.
- [ ] Long-tail: Data Science, Blockchain/Web3, Design, industry verticals (Real Estate, Energy, Agriculture).
- [ ] Refresh `5_System_Prompts` as new frontier models ship.
- [ ] Decide the fate of `library/Legacy/` (1,723 files). It is no longer indexed or served;
      keeping it in Git is fine, but it should either be mined for salvageable prompts or removed.

### Features
- [ ] Role-based "starter pack" collections.
- [ ] User ratings / feedback on prompts.
- [ ] Integration examples (Zapier, Make, n8n).
- [ ] Programmatic API access for the public library.

---

## Maintenance cadence

| When | Task |
|:---|:---|
| Each deploy | Prompt index rebuilds automatically (`vercel-build` runs `build:index`). |
| After adding content | Watch the build log for `[WARN] Failed to parse frontmatter` — those files are silently dropped from the library. |
| Monthly | Add/refresh `5_System_Prompts` as models release. |
| Quarterly | Audit prompts for accuracy; review/rotate featured prompts. |
| As needed | Keep MCP-server prompt collections current as those APIs evolve. |

---

## Done

See [CHANGELOG.md](CHANGELOG.md). Most recently (2026-08-18): the audit's stale-metadata and
`App.tsx` de-bulk passes, plus the rename-drift bugs those passes uncovered — `Legacy/` and
skill sub-files leaking into the index, one bad frontmatter file emptying the whole library,
Windows-only backslash prompt ids, and a missing database taking down the dev server.
