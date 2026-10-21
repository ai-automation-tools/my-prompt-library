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

None. Since 2026-10-21 the app calls no external service at runtime: the Public Library is read
from `site/library/` and My Library from local files. (Neon Postgres and the GitHub REST API were
tracked here until then.)

## Static assets

| Upstream | What the code assumes | Code | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Google Fonts** | `fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap` via a `<link>` in `index.html` (preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`) | `site/index.html` | developers.google.com/fonts/docs/css2 | — |

## Hosting and runtime

| Upstream | What the code assumes | Where | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Vercel** | `vercel.json` `version: 2`; `functions["api/skill-packs.ts"].includeFiles: "library/3_Skills/**"`; rewrites `/api/skill-packs/:path*` → `/api/skill-packs`, `/api/(.*)` → `/api`, everything else → `/index.html`; `vercel-build` script; Node functions on default runtime settings (no `engines` pin) | `site/vercel.json`, `site/package.json`, `site/api/*.ts` | vercel.com/changelog; vercel.com/docs/functions/runtimes/node-js/node-js-versions; vercel.com/docs/project-configuration | 2026-10-09 |
| **Node.js** | No `engines` field, so Vercel's project default picks the runtime; CI pins `node-version: "22"`; `@types/node` `^22` | `site/package.json`, `.github/workflows/ci.yml`, `.github/workflows/upstream-drift.yml` | nodejs.org/en/about/previous-releases (EOL dates) | 2026-10-09 |
| **GitHub Actions** | `actions/checkout@v4`, `actions/setup-node@v4`, `ubuntu-latest`, `gh` CLI preinstalled on the runner | `.github/workflows/*.yml` | github.com/actions/checkout/releases; github.com/actions/setup-node/releases; github.blog/changelog (label: actions) | 2026-10-09 |

## Framework majors

| Upstream | Declared in `site/package.json` | Check at | Last checked |
|:---|:---|:---|:---|
| MCP TypeScript SDK (`@modelcontextprotocol/server`; `@modelcontextprotocol/client` for the test) | `^2.3.1`. The server uses `McpServer`, `registerTool`/`registerPrompt` with zod v4 schemas, and `serveStdio()` from `@modelcontextprotocol/server/stdio`, which also serves 2025-era clients. A v3 major, or a spec revision `serveStdio` stops negotiating, breaks `site/mcp/server.ts`; `npm run test:mcp` is the check | github.com/modelcontextprotocol/typescript-sdk/releases; modelcontextprotocol.io/specification (changelog) | — |
| zod | `^4` (imported as `zod/v4` by the MCP server) | github.com/colinhacks/zod/releases | — |
| React / react-dom | `^19.3.0` | react.dev/blog | — |
| Express | `^4.22.3` (Express 5 is a breaking major) | expressjs.com/en/changelog; github.com/expressjs/express/releases | — |
| Vite, @vitejs/plugin-react | `^6.2.0`, `^5.2.0` | github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md | — |
| Tailwind CSS v4, @tailwindcss/vite | `^4.1.14`, `^4.3.3` | github.com/tailwindlabs/tailwindcss/releases | — |
| TypeScript | `~5.9.3` | devblogs.microsoft.com/typescript | — |
| helmet | `^8.3.0` (response headers) | github.com/helmetjs/helmet/releases | — |
| fuse.js, react-markdown, remark-gfm, gray-matter, archiver, motion, lucide-react, dotenv | see `package.json` | each package's GitHub releases | — |

Flag breaking majors, EOL runtimes, and security advisories only. Routine bumps are
Dependabot's job.
