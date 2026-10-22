# AGENTS.md — Promptbook (`promptbook-demo.ai-automation-tools.dev`)

> Repo-local guide for every coding agent (Codex, Gemini CLI, opencode; Claude Code imports it
> from `CLAUDE.md`). The workspace-wide rules live in
> `D:\AI_Agents\Projects\Mikes_AI_Lab\Agents\Claude\CLAUDE.md` and still apply —
> this file overrides them where they conflict.

## What this is

Local-first prompt-template manager: you clone the repo and run it on your own machine.
**`promptbook-demo.ai-automation-tools.dev`** (Vercel) is a **read-only** demo of the
Public Library. The old `prompts.mikesailab.com` and `prompts.ax-platform.com` hosts were detached
2026-10-14. The bare `promptbook.ai-automation-tools.dev` is the static homepage in `homepage/` (GitHub Pages).
Two libraries: a **Public Library** (curated, file-backed under `library/`) and **My Library**
(the user's own prompts, one markdown file each in a local folder, `lib/my-library.ts`). Also
serves **Skill Packs** (zipped skill bundles) and a large **System Prompts** archive.

**There are no accounts.** Login, Neon/Postgres and GitHub mode were removed 2026-10-21: whoever can
reach the server owns My Library, so `server.ts` binds to `127.0.0.1`. Don't reintroduce auth or a
database for the local app; if the hosted demo ever needs writes, that is a new decision for Mike.

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind v4, Fuse.js search, lucide-react icons, `motion`.
- **Backend:** one Express app in `api/index.ts`, run by Vercel as a serverless function and
  by `server.ts` in dev. There is no second copy — `server.ts` imports it. `api/skill-packs.ts`
  is a separate Vercel function (see `vercel.json`); dev mounts it onto the same app.
- **Data:** Public Library = markdown files in `library/` (Git-versioned). My Library = markdown files in
  `my-library/` (gitignored; `MY_LIBRARY_DIR` moves it), frontmatter holds title/section/category/tags/dates.
- **Read-only mode:** `READ_ONLY=true`, or automatically on Vercel (`VERCEL` is set). The server 403s every
  write route; the UI reads the same rule at build time (`__READ_ONLY__` in `vite.config.ts`,
  `src/lib/mode.ts`) and hides the library switch, New prompt, Save to My Library and pack add/remove.
- **Deploy (demo only):** Vercel. Working branch **`mike_desktop`**, deploy branch **`main`**. `vercel-build` rebuilds the prompt index.

> **Repo layout:** the entire deployable app (source, `api/`, `library/`, build config,
> `package.json`) lives under **`site/`**. Run all `npm` commands from `site/`. On Vercel,
> the project's **Root Directory** must be set to **`site`**. Root-level `docs/`, `images/`,
> `scripts/` (utility scripts) and repo meta stay outside the deploy root.

## Run it

```bash
cd site
npm install
npm run dev               # tsx server.ts → http://localhost:3010 (Vite HMR)
npm start                 # build, then serve dist/ the same way
```

No `.env` is needed; `.env.example` lists the three optional settings (`MY_LIBRARY_DIR`, `HOST`, `READ_ONLY`).

Other scripts: `npm run build` (build:index → tsc → vite build), `npm run build:index`
(regenerates `api/prompt-index.json` from `library/`), `npm run lint` (`tsc --noEmit`),
`npm run test:routes` (asserts the shared Express app still exposes all eight API routes and no auth router),
`npm run test:my-library` (round-trips the My Library file store in a temp folder).

CI (`.github/workflows/ci.yml`) runs `npm ci` → `lint` → `test:routes` → `test:my-library` → the two repo-root
provenance self-checks (`scripts/upstream.test.mjs`, `scripts/skill-frontmatter.test.mjs`) →
a rebuild of the prompt index, failing if the rebuilt file is not byte-identical to the committed one.
Rebuild and commit `api/prompt-index.json` whenever you touch `library/`.

## Layout

Everything under `site/` is the deployable app (Vercel Root Directory = `site`).
Paths below are relative to `site/`.

```
site/
  src/                 React app
    App.tsx            ~1,050 lines — the app shell: state, data fetching, handlers, layout
    hooks/             usePromptFilters (search, tags, sort, pagination)
                       usePromptPreviews (batched card blurbs — the listing has no body text)
                       usePromptContent (copy state + fetching a prompt's real body)
                       useLibraryRoute (section/category/subcategory/?prompt= URL state)
    hooks/useTheme     Light | Dark (`html.light`, key `my-prompt-library.theme`) and the colour palette
                       (`html[data-palette]`, key `my-prompt-library.palette`, sky/violet/emerald/ember;
                       both keys keep the pre-rename name so saved preferences survive);
                       index.html applies both before first paint
    lib/               mode (READ_ONLY), cn (clsx + tailwind-merge), sections (the seven sections: tab id, folder,
                       label, icon, accent token, blurb — every tab switch reads from here)
    components/        TopBar (brand, section nav + phone sheet, ⌘K trigger, Resources menu,
                       New prompt, Settings, ThemeSwitch), Sidebar (library switch, category tree),
                       Breadcrumbs, SettingsModal (mode + palette, local data, shortcuts),
                       CommandPalette (⌘K: prompts / sections / actions / themes),
                       LibraryHero (title, blurb, CountUp stats, in-section search),
                       PromptListToolbar, PromptGrid (also exports PromptCardGrid,
                       PromptCardActions, LoadingSkeleton), PromptCard (spotlight card),
                       PromptDetail, SkillPacksView, EmptyState, Toast, ResourcesNav,
                       ThemeSwitch, PromptEditorModal
    components/ui/     primitives (Button, IconButton, Chip, Tag, Kbd, Modal*, Notice), CountUp
    index.css          House-style tokens (dark on :root, light on html.light), per-section accent
                       (--c), base + component classes (.btn, .input, .chip, .spot, .popover,
                       .topbar, .nav, .theme-sw, .site-footer …) in Tailwind layers
  server.ts            The local server: imports the app `api/index.ts` exports, mounts the
                       skill-packs handler, adds Vite HMR (or serves dist/ with --production).
                       Port 3010 on 127.0.0.1 (HOST overrides).
  api/index.ts         The Express app (also the Vercel handler): Public Library + My Library.
                       `?lightweight=true` returns metadata only — a listing prompt's
                       `content` is NOT the prompt. Card blurbs come from
                       POST /api/prompts/previews, full bodies from GET /api/prompts/:id.
  api/skill-packs.ts   Skill packs handler (bundles library/3_Skills/**). A pack counts as in My
                       Library while any My Library prompt carries its `skill-pack:<id>` tag.
  lib/my-library.ts    My Library file store + READ_ONLY. Ids are file names, restricted to
                       [a-z0-9-] so an id can never name a path outside the folder.
  lib/safe-path.ts     resolveInside(): keeps library paths inside library/
  lib/library.ts       Shared by the API and the MCP server: LIBRARY_PATH, the section keys,
                       the prebuilt-index loader and readLibraryItem(). Never writes to stdout.
  mcp/server.ts        The MCP server (npm run mcp; stdio, @modelcontextprotocol/server v2):
                       search, get, browse, skills, Skill Packs, My Library writes (not
                       registered when READ_ONLY), featured + My Library prompts as MCP
                       prompts. docs/mcp-server.md, docs/features/MCP-SERVER.md. Must never log to stdout:
  mcp/setup.ts         imported first; sends console.log/info/debug to stderr and loads .env
                       quietly (dotenv 17 prints to stdout otherwise)
                       Adding a library section means adding it to SECTIONS in lib/library.ts
                       too; test:mcp fails until the two lists match.
  library/             Public content, numbered sections (see below)
  scripts/build-prompt-index.js   Walks library/ → api/prompt-index.json (site build step).
                       Sorts by id and skips files over 500 KB. Carries `lastModified` and
                       `buildTime` forward for unchanged entries, so rebuilding an untouched
                       library leaves the file byte-identical.
  scripts/api-routes.test.mjs     Pins the route table (npm run test:routes)
  scripts/my-library.test.mjs     File-store self-check (npm run test:my-library)
  scripts/mcp-server.test.mjs     MCP server end to end over stdio (npm run test:mcp)
  package.json, vite.config.ts, tsconfig.json, vercel.json, index.html

(repo root, outside the deploy root)
  scripts/             Library tooling: check-upstream-drift.mjs (the Monday issue, with a per-section
                       health table), attribute-upstream.mjs + resync-upstream.mjs (provenance),
                       sync-agent-skills.mjs (copies new skills from the org's agent-skills repo into
                       3_Skills, stamped, and refreshes the ones already here; run weekly by the
                       Routines fleet with no model), build-skill-packs.mjs (one generated pack per
                       3_Skills folder with 6+ skills, plus dead-path repair of the hand packs; same
                       job), discover-repos.mjs (gh search for new/popular skills, prompt, agent and
                       MCP repos → docs/DISCOVERY.md rows for a person to accept; `link` rows
                       become Resources-menu links in site/library/resources.json),
                       check-resources.mjs (dead-link report for that menu), check-mcp-servers.mjs (flags MCP cards whose repo
                       is missing, renamed, archived, relicensed or quiet), backfill-tags.mjs
                       (path-derived tags for any file with none; the Monthly Upkeep keeps it at
                       zero), the two *.test.mjs self-checks, prompt_generation/
  homepage/            Static homepage (one index.html, no build) → GitHub Pages via
                       .github/workflows/homepage.yml; pinned by scripts/homepage.test.mjs
  docs/                Documentation (see docs/README.md; analysis in docs/audits/)
  docs/diagrams/       Code-pinned Archify data-flow diagram. Edit only the .json, rebuild with
                       node scripts/build-diagram.mjs --pin-head (copies into homepage/diagram/)
  images/              README / branding assets
  .github/workflows/ci.yml        lint + test:routes + provenance self-checks +
                                  prompt-index freshness gate
  .gitattributes       Everything is LF, in the repo and the working tree
```

## Library structure (current — numbered)

`library/1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`, `6_MCP_Servers`. (`Legacy/`,
the pre-rename `*_OLD` trees, was deleted 2026-08-27; the readers still skip a folder by that
name, so restoring it from history would not put it back in the index.) The frontend tab ids
(`agent-guides`, `agents`, `skills`, `prompt-library`, `system-prompts`, `mcp-servers`) map to these
folders via `getSectionFolder()` in `App.tsx`. After adding/removing content, run
`npm run build:index` so `api/prompt-index.json` reflects it.

> Note: older docs and the README still describe the pre-rename flat layout
> (`Prompt_Library/`, `Agents/`, `Skills/`, `System_Prompts/`). Treat the numbered
> folders above as authoritative.

## Conventions

- React 19 functional components + hooks; strict TS, no `any`. Tailwind utility-first.
- **Design system: the org house style** (`web-house-style` skill). Colours are tokens on `:root`
  in `src/index.css` (`--bg`, `--surface`, `--line`, `--fg`…`--fg-5`, `--accent`, `--c`), redefined
  under `html.light`: `#060606` ground with a dot grid, zinc surfaces, sky accent (sky-700 in light),
  Inter + JetBrains Mono, 12/8/6px radii. Use the tokens (`text-[var(--fg-3)]`), never a raw
  Tailwind palette colour or a hex, so both themes stay correct; accent-tinted text mixes toward
  `--mix-ink` by `--tint-k`. `--c` is the current section's accent (`--sec-*`, 400 shade dark /
  700 light, set from `data-section` on `<html>`); cards, glyphs and tonal buttons tint from it.
  Dark is the default whatever the OS says; the Light | Dark pill is the last control in the top bar.
  Settings (gear) adds a colour palette on top of the mode: each `html[data-palette]` block swaps
  only `--accent` (+ hover/ink/glow) and, in dark, tints `--bg` a hair; never the rest of the set.
  Shared controls are classes in `@layer components` (`.btn`, `.input`, `.chip`, `.spot`)
  wrapped by `components/ui/primitives.tsx`; reach for those before writing a new button.
- Motion: `motion/react` with `LazyMotion` + `m.*` (never `motion.*`, it defeats the split).
  Every animation must collapse under `prefers-reduced-motion` — index.css does this globally.
- `library/**/*` is excluded from `tsconfig.json`. Vendored skills ship their own `.ts`/`.py`
  sample code that imports packages the app does not depend on, so type-checking it just breaks
  `npm run lint` on the next content resync. The app never imports from `library/` — it reads it
  as data at runtime.
- No auth. Every write route goes through `requireWritable` (api/index.ts) or the `READ_ONLY`
  check (api/skill-packs.ts); a new write route must too, or the demo becomes writable.
- `helmet` runs with CSP off.
- Never commit `.env*` (gitignored) or anything under `site/my-library/`.
- **LF only.** `.gitattributes` sets `eol=lf` repo-wide. `contentPreview` is embedded in
  `api/prompt-index.json` verbatim, so a CRLF file makes the index unreproducible on Linux and
  the CI gate fails.
- **Lowercase, case-unique paths under `library/`.** Two files differing only in case are one
  file on Windows and two on Linux; that desynced the index once already.
- When bulk-importing content, check what you are about to publish: an upstream corpus put
  350 contributor email addresses one commit away from a public site.
- Match the existing file's style. `App.tsx` is huge — when touching the UI, prefer
  extracting into `src/components/` or `src/hooks/` over growing it back (the 2026-10-03 changelog entry shows how).

## Env vars

All optional; the app runs with none set.

| Var | Effect |
|:---|:---|
| `MY_LIBRARY_DIR` | Where My Library lives. Relative paths resolve against `site/`. Default `site/my-library`. |
| `HOST` | Listen address. Default `127.0.0.1`; `0.0.0.0` opens it to the network (there are no accounts). |
| `READ_ONLY` | `true` = Public Library only, writes 403. Implied on Vercel by `VERCEL`. |
| `NODE_ENV` | `production` serves `dist/` instead of Vite, same as `--production`. |
