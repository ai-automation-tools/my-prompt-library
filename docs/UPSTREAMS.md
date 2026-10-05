# Upstreams

Every external service, API, and platform the prompt library app depends on, what the code
assumes about each, and where to check whether that assumption still holds. The biweekly
**Prompt-Library Upstream Check** routine (`upstream/auto-*` PRs) works from this file. Keep it
current by hand too: a new API call is a new row.

App code paths are under `site/`, the Vercel Root Directory.

**Not in scope here:** the vendored skills and prompts under `site/library/`. Their upstream
repos are tracked per file in frontmatter and checked weekly by
`.github/workflows/upstream-drift.yml` (`scripts/check-upstream-drift.mjs`), which opens an
issue and never edits content. This file is about the app, not the library.

**Last checked** is filled in by the routine, and only with a date it actually read the
source. `—` means never checked.

## Data and APIs

| Upstream | What the code assumes | Code | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Neon Postgres via `pg`** | `pg` `^8.23.0`; one `Pool` from `DATABASE_URL`, `max: 10`, `ssl: { rejectUnauthorized: false }` in production; parameterized queries only | `site/db/postgres.ts` | neon.com/docs/changelog; neon.com/docs/connect/connect-securely; github.com/brianc/node-postgres/blob/master/CHANGELOG.md | — |
| **GitHub REST API** *(GitHub mode, `USE_GITHUB_MODE=true`)* | `Authorization: token <GITHUB_TOKEN>`, `Accept: application/vnd.github.v3+json`, no `X-GitHub-Api-Version` header. Calls `GET /repos/{o}/{r}/git/ref/heads/{branch}`, `GET /repos/{o}/{r}/git/trees/{sha}?recursive=1`, `GET /repos/{o}/{r}/contents/{path}?ref={branch}` | `site/api/index.ts` | docs.github.com/en/rest/about-the-rest-api/api-versions; github.blog/changelog (label: api) | — |

## Static assets

| Upstream | What the code assumes | Code | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Google Fonts** | `fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=DM+Sans:ital,opsz,wght@…&display=swap` via CSS `@import` | `site/src/index.css` | developers.google.com/fonts/docs/css2 | — |

## Hosting and runtime

| Upstream | What the code assumes | Where | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Vercel** | `vercel.json` `version: 2`; `functions["api/skill-packs.ts"].includeFiles: "library/3_Skills/**"`; rewrites `/api/skill-packs/:path*` → `/api/skill-packs`, `/api/(.*)` → `/api`, everything else → `/index.html`; `vercel-build` script; Node functions on default runtime settings (no `engines` pin) | `site/vercel.json`, `site/package.json`, `site/api/*.ts` | vercel.com/changelog; vercel.com/docs/functions/runtimes/node-js/node-js-versions; vercel.com/docs/project-configuration | — |
| **Node.js** | No `engines` field, so Vercel's project default picks the runtime; CI pins `node-version: "22"`; `@types/node` `^22` | `site/package.json`, `.github/workflows/ci.yml`, `.github/workflows/upstream-drift.yml` | nodejs.org/en/about/previous-releases (EOL dates) | — |
| **GitHub Actions** | `actions/checkout@v4`, `actions/setup-node@v4`, `ubuntu-latest`, `gh` CLI preinstalled on the runner | `.github/workflows/*.yml` | github.com/actions/checkout/releases; github.com/actions/setup-node/releases; github.blog/changelog (label: actions) | — |

## Framework majors

| Upstream | Declared in `site/package.json` | Check at | Last checked |
|:---|:---|:---|:---|
| React / react-dom | `^19.3.0` | react.dev/blog | — |
| Express | `^4.22.3` (Express 5 is a breaking major) | expressjs.com/en/changelog; github.com/expressjs/express/releases | — |
| Vite, @vitejs/plugin-react | `^6.2.0`, `^5.2.0` | github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md | — |
| Tailwind CSS v4, @tailwindcss/vite | `^4.1.14`, `^4.3.3` | github.com/tailwindlabs/tailwindcss/releases | — |
| TypeScript | `~5.9.3` | devblogs.microsoft.com/typescript | — |
| bcryptjs, cookie-parser, express-rate-limit, helmet | `^3.0.3`, `^1.4.7`, `^8.7.0`, `^8.3.0` (auth path; the limiter and headers sit in front of it) | each package's GitHub releases | — |
| fuse.js, react-markdown, remark-gfm, gray-matter, archiver, motion, lucide-react, dotenv | see `package.json` | each package's GitHub releases | — |

Flag breaking majors, EOL runtimes, and security advisories only. Routine bumps are
Dependabot's job.
