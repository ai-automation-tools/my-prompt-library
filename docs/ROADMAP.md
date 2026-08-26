# Roadmap — my-prompt-library

**Updated:** 2026-08-26 · **Live:** `prompts.mikesailab.com` (Vercel) · **Deploy branch:** `main`

Single source of truth for *what's next*. Shipped work lives in [CHANGELOG.md](CHANGELOG.md).
The current items come from [audits/REPO-AUDIT-2026-08-26.md](audits/REPO-AUDIT-2026-08-26.md).

---

## Snapshot

| | |
|:---|:---|
| Stack | React 19 + TS + Vite 6 + Tailwind v4 · Express/Vercel serverless · Neon Postgres |
| Public Library | Markdown under `site/library/` — `1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`. `Legacy/` is excluded from the index |
| User data | Postgres: `users`, `user_prompts`, `user_sessions`, `user_skill_pack_installs` |
| Prompt index | `site/api/prompt-index.json` — **1,725** prompts, 1.06 MB (`npm run build:index`) |
| Skills | **323**, all spec-valid. **99** carry a resolvable upstream, 33 with a commit sha. **32** are byte-identical to upstream, 10 are still `behind` |
| `src/App.tsx` | **1,050 lines** (was 2,845), 25 `useState` hooks |
| Security | 0 npm advisories; path traversal closed; session tokens are CSPRNG |
| Health | Live and production-ready. Everything below is content, maintainability, or polish |

> Counts come from `api/prompt-index.json` (`promptCount`) and the drift report, not from
> hand-maintained numbers here.

---

## Now — blocking or near-term

- [ ] **Rotate the Neon password and purge sessions.** The credential was scrubbed from Git
      history but never rotated, and a scrub does not un-leak. In the same Neon session run
      `DELETE FROM user_sessions;` — every existing cookie was minted by the old
      `Math.random()` token generator. Everyone gets logged out once.
- [ ] **Fill in the real `DATABASE_URL`** in `site/.env` (still a placeholder, so auth and
      My Library are dead locally). The dev server boots without it and serves the read-only
      Public Library.
- [ ] **Resync the 10 skills still `behind`.** Same job, next tier: `autoresearch` (73%),
      `interaction-design` (72%), `academy-guide` (71%), `python-design-patterns` (68%),
      `x-twitter-scraper` (67%), `pptx` (60%), `find-skills` (55%), `skill-creator` (52%),
      `golang-popular-libraries` (31%), `matlab` (30%). Read each diff before committing —
      the resync overwrites the body, and a few of these may be deliberately trimmed rather
      than stale. Full list:
      [audits/upstream-drift-2026-08-26.md](audits/upstream-drift-2026-08-26.md).
- [ ] **Decide on 6 dead upstreams.** Those skills point at files their publisher has since
      removed, including 3 from `openai/skills`. Re-home them or mark them as forks we own.
- [ ] **Sweep deprecated model IDs.** 23 files pin `claude-3-5-sonnet`, 43 reference Claude
      3.x at all, and 18 use `gpt-4o`. The Claude 5 family now appears in 47 files, but every
      one of them is inside the resynced `Development/API/claude-api` tree — nothing else in
      the library names a current model. This is the most visible staleness to a visitor.

---

## Next — dev/prod parity

The two API implementations have silently diverged, and that is the bug class that keeps
biting. `server.ts` (552 lines) and `api/index.ts` (740) are hand-maintained twins; so are
`routes/skill-packs.ts` (335) and `api/skill-packs.ts` (394).

- [ ] **Collapse to one implementation.** Extract handler bodies into `api/handlers/*.ts`
      and have `server.ts` mount them through a thin Express adapter — roughly 900
      duplicated lines go away and divergence becomes structurally impossible.
      *Lazier alternative:* run `vercel dev` locally and delete `server.ts` outright. Smaller
      diff, but it costs the Vite HMR middleware, which is the only reason `server.ts` exists.
- [ ] **`GET /api/prompts/:id` exists only in production.** `App.tsx` calls it on every
      prompt click; locally it falls through to Vite and returns the SPA's HTML. The
      frontend swallows the failure and reuses its cached copy.
- [ ] **The dev server ships 15.5 MB per page load.** `server.ts` ignores the `lightweight`
      query param that both `api/index.ts` and `App.tsx` rely on, so dev sends every prompt
      at full length where prod sends a 1.06 MB index. This is also *why* the missing route
      above is invisible.
- [ ] **Add a CI gate.** One workflow, three steps: `npm ci` → `npm run lint` →
      `npm run build:index` and fail if `git diff --exit-code` shows anything beyond
      `buildTime`. That last check alone catches "edited the library, forgot to rebuild".

---

## Then — build, payload, hygiene

- [ ] **Delete `library/Legacy/`.** 2,393 tracked files, 37 MB, excluded from the index by
      all three readers — roughly half the deploy root, entirely unreachable. It is fully
      preserved in Git history (`git checkout <sha> -- site/library/Legacy` brings it back).
- [ ] **Code-split the bundle.** `dist/assets/index-*.js` is **983 KB** (265 KB gzipped) and
      Vite warns on every build. Route/modal-level `React.lazy` on `SkillPacksView`,
      `PromptEditorModal` and the auth modals is the obvious first cut.
- [ ] **Split or delete the two multi-MB bulk files.** `act-as-an-expert.md` (3.4 MB) and
      `promptsdotchat-opensource.md` (2.5 MB) are skipped by the 500 KB index filter, so they
      are unreachable in the app — yet they are 74% of `2_Agents`'s 7.9 MB and ship on every
      deploy.
- [ ] **Add `.gitattributes` and normalize line endings.** 2,131 of 2,132 content files are
      CRLF with no `.gitattributes`, so every cross-machine edit risks a whole-file diff.
      `*.md text eol=lf`, then normalize once.
- [ ] **Prune merged branches.** Six are fully merged into `main`:
      `automation/add-skillsmp-skills-pr`, `codex/add-skillsmp-skills`,
      `roadmap/auto-2026-08-18`, `roadmap/auto-2026-08-22`, `skills/trending-2026-08-19`,
      `mike_desktop`. Note `mike_desktop` is the documented working branch but is identical
      to `main` — either resume using it or drop the convention from `CLAUDE.md`.
- [ ] **Guard against index drift locally.** `vercel-build` rebuilds the index so a stale
      copy never reaches production, but it makes `git status` noisy. Either stop committing
      `api/prompt-index.json` or add a pre-commit rebuild.

---

## Later — content, structure, features

### Content provenance
- [ ] **Raise attribution coverage above 31%.** 60 skills are `ambiguous` (the body exists in
      three or more mirror repos, so no single origin is provable) and 164 are `unknown`.
      The mirror only indexes `SKILL.md`; matching support files would help.
- [ ] **Extend provenance beyond skills.** `2_Agents`, `4_Prompts` and `5_System_Prompts`
      have no `upstream:` stamping at all — the tooling is section-agnostic, it just has not
      been pointed at them.
- [ ] **Surface freshness in the UI.** `lastModified` in the index is the *filesystem mtime*,
      so every prompt on the live site claims it changed on the last checkout. Swap it for
      `upstream.checked` and render a stale badge.

### Library structure
- [ ] **Decide what `2_Agents` is.** 457 of 547 files have no `name:`/`description:`, so they
      cannot load as subagents — they are role-play prompts filed in the wrong section.
      Either move them to `4_Prompts` or rename the section "Agent Prompts" and stop implying
      they are installable.
- [ ] **Resolve the remaining semantic duplicates.** The byte-level dedupe cannot see them
      because names and frontmatter differ: 2 skill groups share an upstream file
      (`skill-creator`, `brand-guidelines`), and `2_Agents` has 16 near-duplicate topic
      groups — including **five** C# agents with no stated difference between them.
- [ ] Expand thin categories: Healthcare, Education, Legal/Compliance, E-commerce,
      Personal Productivity.
- [ ] Long-tail: Data Science, Blockchain/Web3, Design, industry verticals.

### Features
- [ ] Finish the `App.tsx` de-bulk — lift the remaining URL/routing state (`activeTab`,
      `activeCategory`, `activeSubcategory`, `promptPathParam` and their `history.pushState`
      effects) into a `useLibraryRoute` hook. Largest remaining block of state in the shell.
- [ ] Lazy-mount the 16-theme picker so it is not in every render tree.
- [ ] Role-based "starter pack" collections.
- [ ] User ratings / feedback on prompts.
- [ ] Programmatic API access for the public library.

---

## Maintenance cadence

| When | Task |
|:---|:---|
| Weekly (automated) | `upstream-drift.yml` runs Mondays 09:00 UTC and updates one rolling issue. Triage it — the job never edits content itself; `resync-upstream.mjs` is what repairs what it finds. |
| Each deploy | The prompt index rebuilds automatically (`vercel-build` runs `build:index`). |
| After adding content | Watch the build log for `[WARN] Failed to parse frontmatter` — those files are silently dropped from the library. |
| After adding skills | Re-run `attribute-upstream.mjs --write` to stamp provenance on the new ones. It is idempotent. |
| Monthly | Refresh `5_System_Prompts` as new frontier models ship. |
| Quarterly | Audit prompts for accuracy; review/rotate featured prompts. Re-check model IDs. |

---

## Done

See [CHANGELOG.md](CHANGELOG.md). Most recently, **2026-08-26**: a full repository audit,
two confirmed security vulnerabilities fixed, all 22 npm advisories cleared, upstream
provenance stamped across the skills library, a weekly drift check shipped, and the six
most-drifted skills — `code-tour`, `huggingface-gradio`, `brainstorming`,
`huggingface-llm-trainer`, `discernment-nudge` and `claude-api` — pulled back level with
their upstreams by the new `scripts/resync-upstream.mjs`.
