# Roadmap — my-prompt-library

**Updated:** 2026-06-24 · **Live:** `prompts.mikesailab.com` (Vercel) · **Branches:** work `mike_desktop` → deploy `main`

Single source of truth for *what's next*. Forward-looking only — shipped work lives in
[CHANGELOG.md](CHANGELOG.md); the detailed code/UI analysis behind the near-term items is in
[audits/PROJECT-AUDIT-2026-06-24.md](audits/PROJECT-AUDIT-2026-06-24.md).

---

## Snapshot

| | |
|:---|:---|
| Stack | React 19 + TS + Vite 6 + Tailwind v4 · Express/Vercel serverless · Neon Postgres |
| Public Library | Markdown files in `library/` (numbered: `1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`; `Legacy/` not shipped) |
| User data | Postgres: `users`, `user_prompts`, `user_sessions`, `user_skill_pack_installs` |
| Prompt index | `api/prompt-index.json` — **3,652** prompts (rebuild with `npm run build:index`) |
| Health | Production-ready and live. Items below are maintainability/UX, not outages. |

> Counts are read from `api/prompt-index.json` (`promptCount`), not kept by hand here.

---

## Now — quick wins (low risk, do first)

Documentation/metadata drift. Roughly a half-day total, mostly mechanical.

- [ ] **`.env.example`:** add `DATABASE_URL`, `NODE_ENV`, optional `GEMINI_API_KEY` (currently only documents GitHub-mode vars, so a fresh clone can't run auth).
- [ ] **`README.md`:** fix the project-structure block to the numbered `library/` folders; correct the live URL to `prompts.mikesailab.com`.
- [ ] **`docs/README.md`:** drop `npm run type-check` (it's `npm run lint`) and the stale `*.vercel.app` demo link.
- [ ] **`package.json`:** rename `react-example` → `my-prompt-library`, bump version off `0.0.0`.
- [ ] **Rebuild the prompt index** so `api/prompt-index.json` matches current `library/` files.
- [ ] Prune root clutter: `backup/`, loose `check_skills.py` / `get_popular_skills.py` / `get_raw_urls.py` (move under `scripts/` or delete), `import/`.

---

## Next — de-bulk the UI (`src/App.tsx`)

`App.tsx` is a **2,845-line monolith** with ~40 `useState` hooks. Behavior-preserving
refactors, shipped one small PR at a time, each verified against a Vercel preview. See the
audit for line-level detail.

- [ ] **Top-bar "External Resources" mega-menus (~490 lines):** the five hardcoded link
      dropdowns (CLI/Prompts/Skills/Tools/Agent Templates) compete with the real sidebar nav.
      Data-drive them (`const RESOURCES = [...]` → one `<ResourceMenu>` component) — deletes
      ~400 lines outright. **Highest impact.**
- [ ] **Extract components** out of `App.tsx`: `Sidebar`, `PromptCard`, `PromptDetail`
      (move `PromptCard` out of render so its `memo` actually helps).
- [ ] **Lift filter/search state** into a `usePromptFilters` hook.
- [ ] Target: `App.tsx` from ~2,845 → ~600–800 lines, no behavior change.
- [ ] **UX decision (needs Mike):** does the external-link directory belong in the primary
      nav at all, or move to the sidebar / a footer / a dedicated `/resources` page?

---

## Later — content & features

### Library content (was PROJECT-STATUS "Phase 2/3" gap-filling)
- [ ] Expand thin categories: Healthcare, Education, Legal/Compliance, E-commerce, Personal Productivity.
- [ ] Long-tail: Data Science, Blockchain/Web3, Design, industry verticals (Real Estate, Energy, Agriculture).
- [ ] Refresh `5_System_Prompts` as new frontier models ship.

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
| Monthly | Add/refresh `5_System_Prompts` as models release. |
| Quarterly | Audit prompts for accuracy; review/rotate featured prompts. |
| As needed | Keep MCP-server prompt collections current as those APIs evolve. |

---

## Done

See [CHANGELOG.md](CHANGELOG.md). Highlights: Postgres/Neon migration, Public-vs-My library
modes, Skill Packs add/remove lifecycle, title-prioritized search, and the 2026-03 performance
pass (prebuilt index, lightweight mode, pagination — cold start 2–5s → <100ms).
