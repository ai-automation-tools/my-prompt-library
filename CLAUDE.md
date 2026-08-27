# CLAUDE.md — my-prompt-library (`prompts.mikesailab.com`)

> Repo-local guide. The workspace-wide rules live in
> `D:\AI_Agents\Projects\Mikes_AI_Lab\Agents\Claude\CLAUDE.md` and still apply —
> this file overrides them where they conflict.

## What this is

Full-stack prompt-template manager deployed at **`prompts.mikesailab.com`** (Vercel).
Two libraries: a **Public Library** (curated, file-backed under `library/`) and a
per-user **My Library** (PostgreSQL/Neon). Also serves **Skill Packs** (zipped skill
bundles) and a large **System Prompts** archive.

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind v4, Fuse.js search, lucide-react icons, `motion`.
- **Backend:** one Express app in `api/index.ts`, run by Vercel as a serverless function and
  by `server.ts` in dev. There is no second copy — `server.ts` imports it. `api/skill-packs.ts`
  is a separate Vercel function (see `vercel.json`); dev mounts it onto the same app.
- **Data:** Public Library = markdown files in `library/` (Git-versioned). User data = Postgres (Neon).
- **Deploy:** Vercel. Working branch **`mike_desktop`**, deploy branch **`main`**. `vercel-build` rebuilds the prompt index.

> **Repo layout:** the entire deployable app (source, `api/`, `library/`, build config,
> `package.json`) lives under **`site/`**. Run all `npm` commands from `site/`. On Vercel,
> the project's **Root Directory** must be set to **`site`**. Root-level `docs/`, `images/`,
> `scripts/` (utility scripts) and repo meta stay outside the deploy root.

## Run it

```bash
cd site
npm install
cp .env.example .env      # then set DATABASE_URL (Neon) — see .env
npm run dev               # tsx server.ts → http://localhost:3010
```

Other scripts: `npm run build` (build:index → tsc → vite build), `npm run build:index`
(regenerates `api/prompt-index.json` from `library/`), `npm run lint` (`tsc --noEmit`),
`npm run test:routes` (asserts the shared Express app still exposes all seven API routes).

CI (`.github/workflows/ci.yml`) runs `npm ci` → `lint` → `test:routes` → a rebuild of the
prompt index, failing if the rebuilt index differs from the committed one. Rebuild and commit
`api/prompt-index.json` whenever you touch `library/`.

## Layout

Everything under `site/` is the deployable app (Vercel Root Directory = `site`).
Paths below are relative to `site/`.

```
site/
  src/                 React app
    App.tsx            1,082 lines (was 2,845) — still the app shell + 25 useState hooks
    hooks/             usePromptFilters (search, tags, sort, pagination)
    components/        TopBar, LibraryHero, Sidebar, ResourcesNav, PromptListToolbar,
                       PromptGrid (also exports PromptCardGrid + PromptCardActions),
                       PromptCard, PromptDetail, LoginModal, SignupModal,
                       PromptEditorModal, SkillPacksView, Toast, EmptyState
    contexts/          AuthContext
    themes.css         16 themes
  server.ts            71-line dev wrapper: imports the app `api/index.ts` exports,
                       mounts the prod skill-packs handler, adds Vite HMR (port 3010)
  api/index.ts         Vercel handler: prompts, auth, GitHub-mode public library
  api/skill-packs.ts   Vercel handler for skill packs (bundles library/3_Skills/**)
  routes/, middleware/ auth.ts (bcrypt + cookie sessions). No skill-packs router — dev runs
                       the production api/skill-packs.ts handler.
  db/postgres.ts       Postgres layer (users, user_prompts, user_sessions, user_skill_pack_installs)
  library/             Public content, numbered sections (see below)
  scripts/build-prompt-index.js   Walks library/ → api/prompt-index.json (site build step).
                       Sorts by id and skips files over 500 KB.
  scripts/api-routes.test.mjs     Pins the route table (npm run test:routes)
  package.json, vite.config.ts, tsconfig.json, vercel.json, index.html

(repo root, outside the deploy root)
  scripts/             Utility scripts (add-frontmatter.mjs, prompt_generation/, *.py helpers)
  docs/                Documentation (see docs/README.md; analysis in docs/audits/)
  images/              README / branding assets
  .github/workflows/ci.yml        lint + test:routes + prompt-index freshness gate
  .gitattributes       Everything is LF, in the repo and the working tree
```

## Library structure (current — numbered)

`library/1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`. (`Legacy/`,
the pre-rename `*_OLD` trees, was deleted 2026-08-27; the readers still skip a folder by that
name, so restoring it from history would not put it back in the index.) The frontend tab ids
(`agent-guides`, `agents`, `skills`, `prompt-library`, `system-prompts`) map to these
folders via `getSectionFolder()` in `App.tsx`. After adding/removing content, run
`npm run build:index` so `api/prompt-index.json` reflects it.

> Note: older docs and the README still describe the pre-rename flat layout
> (`Prompt_Library/`, `Agents/`, `Skills/`, `System_Prompts/`). Treat the numbered
> folders above as authoritative.

## Conventions

- React 19 functional components + hooks; strict TS, no `any`. Tailwind utility-first.
- Auth = bcrypt hashes + cookie sessions (30-day). Secure cookies off in dev (`NODE_ENV`).
- Parameterized SQL only (`db/postgres.ts`). Never expose `DATABASE_URL` client-side.
- Never commit `.env*` (gitignored), `DATABASE_URL`, or GitHub tokens.
- **LF only.** `.gitattributes` sets `eol=lf` repo-wide. `contentPreview` is embedded in
  `api/prompt-index.json` verbatim, so a CRLF file makes the index unreproducible on Linux and
  the CI gate fails.
- **Lowercase, case-unique paths under `library/`.** Two files differing only in case are one
  file on Windows and two on Linux; that desynced the index once already.
- When bulk-importing content, check what you are about to publish: an upstream corpus put
  350 contributor email addresses one commit away from a public site.
- Match the existing file's style. `App.tsx` is huge — when touching the UI, prefer
  extracting into `src/components/` or `src/hooks/` over growing it back (see docs/ROADMAP.md).

## Env vars

| Var | Needed for | Notes |
|:---|:---|:---|
| `DATABASE_URL` | auth + My Library | Neon Postgres connection string. App runs read-only public library without it but auth/My-Library break. |
| `NODE_ENV` | cookie security, dev branch | `development` locally. |
| `USE_GITHUB_MODE` | public library source | `false` = read local `library/` files (default dev); `true` = fetch from GitHub. |
| `GITHUB_TOKEN` / `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | GitHub mode only | Only when `USE_GITHUB_MODE=true`. |
