# Roadmap — my-prompt-library

**Updated:** 2026-08-31 · **Live:** `prompts.mikesailab.com` (Vercel) · **Deploy branch:** `main`

Single source of truth for *what's next*. Shipped work lives in [CHANGELOG.md](CHANGELOG.md).
The current items come from [audits/REPO-AUDIT-2026-08-26.md](audits/REPO-AUDIT-2026-08-26.md);
skill drift from [audits/upstream-drift-2026-08-27.md](audits/upstream-drift-2026-08-27.md).

---

## Snapshot

| | |
|:---|:---|
| Stack | React 19 + TS + Vite 6 + Tailwind v4 · Express/Vercel serverless · Neon Postgres |
| Public Library | Markdown under `site/library/` — `1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`. 27.3 MB, all of it reachable |
| User data | Postgres: `users`, `user_prompts`, `user_sessions`, `user_skill_pack_installs` |
| Prompt index | `site/api/prompt-index.json` — **3,088** prompts, 1.91 MB (`npm run build:index`), LF-normalized, id-sorted, reproducible on Linux and Windows |
| Skills | **323**, all spec-valid. **99** carry a resolvable upstream, 36 with a commit sha. Of the 93 still tracked: **41** are byte-identical, **0** are `behind`, 52 are `drifted` (≤21%). The other 6 are forks we own |
| `src/App.tsx` | **1,082 lines** (was 2,845), 25 `useState` hooks |
| CI | `.github/workflows/ci.yml` — lint, route table, prompt-index freshness. Green since 2026-08-27 |
| Line endings | LF everywhere, enforced by `.gitattributes`; the index is byte-reproducible on Linux and Windows |
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
- [ ] **Triage the 52 `drifted` skills.** With `behind` cleared, this is the whole remaining
      backlog and it is a different shape: the worst is 21% (`rspack-tracing`), 43 of the 52
      are under 5%, and 23 of those are the `wealth-management` set from one repo. Sizes are
      comparable, so these are edits — a resync here is a judgment call per skill, not a
      mechanical catch-up. Current list:
      [audits/upstream-drift-2026-08-27.md](audits/upstream-drift-2026-08-27.md) — still
      current: the 2026-08-31 drift run reproduced it exactly (93 checked, 41 `current`,
      52 `drifted`, 0 `behind`).
- [ ] **Rewrite `1_Guides/API_Providers/openai_cli_guide.md`.** The model-ID sweep skipped
      it: the guide is built around GPT-4o, with pricing, rate-limit and capability tables
      that a find-and-replace would turn into confident wrong numbers. Everything else in
      `1_Guides` and `2_Agents` now names a current model.

---

## Next — dev/prod parity

The two API implementations had silently diverged, and that was the bug class that kept
biting. Collapsed 2026-08-27: `server.ts` is now a 71-line dev wrapper that imports the
same Express app `api/index.ts` exports and adds Vite's HMR middleware; `routes/skill-packs.ts`
is gone, with dev mounting the production `api/skill-packs.ts` handler directly.

- [x] ~~**Collapse to one implementation.**~~ ~880 duplicated lines deleted. Divergence is
      now structurally impossible — there is one handler set. `npm run test:routes` pins the
      route table in CI.
- [x] ~~**`GET /api/prompts/:id` exists only in production.**~~ Dev serves it now.
- [x] ~~**The dev server ships 15.5 MB per page load.**~~ Dev honours `lightweight` and the
      prebuilt index: 1.28 MB against 9.3 MB for the full listing.
- [x] ~~**Add a CI gate.**~~ Shipped: `.github/workflows/ci.yml` runs `npm ci` →
      `npm run lint` → `npm run build:index` on every PR and fails if the rebuilt index
      differs from the committed one. `buildTime` and `lastModified` are stripped before
      comparing — both are timestamps that cannot match on a fresh checkout (see the
      freshness item under *Later*); everything that encodes actual content is compared.

---

## Then — build, payload, hygiene

- [x] ~~**Delete `library/Legacy/`.**~~ Gone: 2,379 files, 37 MB, half the library payload.
      Before deleting, every file was hashed against the live tree — 1,956 were byte-identical
      duplicates and 404 were older revisions of a file that survived under the same name. The
      33 with no counterpart at all split cleanly: 16 were support files their upstreams have
      since deleted (`pptx`'s `html2pptx.js`, `skill-creator`'s `init_skill.py`, the per-language
      `claude-api` stubs), and 17 were archived system prompts. Of those 17, three were the same
      prompt under a different filename; **the other 14 were promoted into `5_System_Prompts/`**
      rather than deleted, which is why the index went 1,725 → 1,739. Everything else is in Git
      history (`git checkout <sha> -- site/library/Legacy`).
- [x] ~~**Code-split the bundle.**~~ One 976 KB chunk became eight. First paint now costs
      **706 KB / 200 KB gzipped** (was 976 / 265) and no chunk trips Vite's 500 KB warning.
      `React.lazy` on `SkillPacksView`, `PromptDetail`, `PromptEditorModal` and the two auth
      modals moves 184 KB of react-markdown off the critical path; `manualChunks` splits
      React (397 KB) and motion (128 KB) into chunks that survive a content deploy in cache.
      The remaining entry chunk is 181 KB.
- [ ] **Defer `motion` if 128 KB on first paint is worth it.** It is the only sizeable
      dependency left that loads before anything renders, and `LazyMotion` + the `m` components
      would cut most of it — but `motion/react` is imported in 10 files, so this is a refactor,
      not a config change.
- [x] ~~**Split or delete the two multi-MB bulk files.**~~ Split. Both were the
      f/awesome-chatgpt-prompts corpus in `<details>` form, over the 500 KB index ceiling and
      therefore unreachable, and `promptsdotchat-opensource.md` was 1,168 of its 1,169 prompts
      already inside `act-as-an-expert.md`. The union is now **1,349 individual files** under
      `4_Prompts/Awesome_ChatGPT/General/`. `2_Agents` 7.7 → **2.1 MB**; the library 30.3 →
      **27.3 MB** while gaining 1,347 files.
- [ ] **The listing payload is now the biggest thing on first load.** Every visit fetches the
      whole lightweight index: **311 KB gzipped**, up from 159 KB, against 200 KB for all the
      JS. That is proportional to going 1,739 → 3,088 prompts, not a regression in kind, but it
      now outweighs the bundle. Server-side pagination, or serving `contentPreview` only for
      the first page, is the fix.
- [x] ~~**Add `.gitattributes` and normalize line endings.**~~ Done, and it was not cosmetic:
      the CI index gate could not pass on *any* PR, because `contentPreview` is embedded in
      `prompt-index.json` verbatim and carried `
` when built on Windows against `
` when
      rebuilt on a Linux runner. `eol=lf` (not a bare `text=auto`) is what makes the two
      checkouts agree. 647 files renormalized, verified line-endings-only.
- [ ] **Prune merged branches.** Thirteen are now fully merged into `main`:
      `automation/add-skillsmp-skills-pr`, `chore/dedupe-skills`, `codex/add-skillsmp-skills`,
      `feat/upstream-provenance`, `fix/library-content-in-lambda`, `fix/security-hardening`,
      `main-backup-5_15_26`, `mike_desktop`, `roadmap/auto-2026-08-18`,
      `roadmap/auto-2026-08-22`, `roadmap/auto-2026-08-26`, `roadmap/auto-2026-08-26b`,
      `skills/trending-2026-08-19`. Two need a decision rather than a delete:
      `mike_desktop` is the working branch `CLAUDE.md` documents but is identical to `main`
      (resume it or drop the convention), and `main-backup-5_15_26` is a backup whose reason
      for existing has expired.
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
- [ ] **Decide what `2_Agents` is.** 460 of 546 files have no `name:`/`description:`, so they
      cannot load as subagents — they are role-play prompts filed in the wrong section.
      Either move them to `4_Prompts` or rename the section "Agent Prompts" and stop implying
      they are installable. (Splitting the bulk files already moved 1,349 prompts out of
      `2_Agents` and into `4_Prompts`, which is the same argument applied to two files.)
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

See [CHANGELOG.md](CHANGELOG.md).

**2026-08-31**: the `upstream.match` tier `behind` was renamed `similar`, ending a collision
with `check-upstream-drift.mjs`'s freshness verdict of the same name. Seven skills had read
as rotting for a fortnight when the field only ever recorded *how* their origin was matched —
two of them by shingles that scored a similarity of 1. Renamed in `attribute-upstream.mjs`
so it cannot be re-emitted, and in the seven stamped files. No downstream behaviour moved:
the drift checker still selects the same 93 targets.

**2026-08-27** was a payload and reproducibility day. `library/Legacy/` is gone — 2,393 files
and 37 MB that no reader indexed — but not before hashing every file against the live tree and
rescuing the 14 system prompts that existed nowhere else. The two multi-MB bulk files in
`2_Agents` turned out to hold 1,349 prompts nobody could open, now split into individual files
under `4_Prompts/Awesome_ChatGPT/`. The bundle went from one 976 KB chunk to eight, cutting
first paint to 200 KB gzipped.

And the CI gate shipped the day before turned out to be unpassable, for three separate reasons
that only a Linux runner could see: CRLF line endings baked into `contentPreview`, the same
file tracked under two spellings of one directory, and an index ordered by whatever the
filesystem happened to return. All three are fixed and CI is green.

Earlier that day: the `behind` tier emptied — every skill the drift report named is level with
its upstream — the six dead upstreams marked as forks we own, deprecated model IDs swept out of
35 guide and agent files, and the dev/prod API split collapsed onto one Express app (~880
duplicated lines gone, taking all three parity bugs with them).

**2026-08-26**: a full repository audit, two confirmed security vulnerabilities fixed,
all 22 npm advisories cleared, upstream provenance stamped across the skills library, a weekly
drift check shipped, and the six most-drifted skills — `code-tour`, `huggingface-gradio`,
`brainstorming`, `huggingface-llm-trainer`, `discernment-nudge` and `claude-api` — pulled back
level with their upstreams by the new `scripts/resync-upstream.mjs`.
