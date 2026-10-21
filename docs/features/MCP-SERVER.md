# MCP server

My Prompt Library as a [Model Context Protocol](https://modelcontextprotocol.io/) server, so an
agent can search the library and use what it finds without anyone copying text out of a browser.
Built 2026-10-21 (roadmap Phase 1). Install lines for users are in the
[README](../../README.md#use-it-from-an-agent); this page is how it works and why.

## Shape

| | |
|:---|:---|
| Entry | `site/mcp/server.ts`, run by `npm run mcp` in `site/` |
| SDK | `@modelcontextprotocol/server` 2.x (the v2 line; v1 `@modelcontextprotocol/sdk` is maintenance-only) |
| Transport | stdio, through `serveStdio()`, which serves both 2026-era and 2025-era clients from one factory |
| Reads | `site/library/` and `api/prompt-index.json` through `site/lib/library.ts`, My Library through `site/lib/my-library.ts`, Skill Packs through `getAllPacks()` in `api/skill-packs.ts` |
| Config | `site/.env` (`MY_LIBRARY_DIR`, `READ_ONLY`), loaded quietly by `site/mcp/setup.ts` |
| Test | `npm run test:mcp` (`site/scripts/mcp-server.test.mjs`), in CI |

The server shares code with the API instead of copying it. `lib/library.ts` holds the library
path, the index loader and the single-item reader that both use; `GET /api/prompts/:id` and the
copy route were moved onto it in the same change.

## Stdout belongs to the protocol

A stdio server's stdout carries JSON-RPC and nothing else. Two things here would have broken
that: library code that logs with `console.log`, and dotenv 17, which announces itself on
stdout. `mcp/setup.ts` is imported first, before anything that can log, and points
`console.log`, `console.info` and `console.debug` at stderr, then loads `.env` with
`quiet: true`. The server never imports `api/index.ts` (the Express app logs on load). The test's
handshake fails if anything slips onto stdout.

## Tools

All tools return markdown text. Read tools carry `readOnlyHint`.

| Tool | Input | Returns |
|:---|:---|:---|
| `search_library` | `query?`, `section?` (prompts, agents, guides, system-prompts, skills, mcp-servers), `tags?` (all must match), `category?`, `library?` (all, public, my), `limit?` (1–50, default 10) | One line per hit: title, id, place, tags. Fuse.js over title, tags, category, subcategory and the opening text; with no query, the filtered items by title |
| `get_item` | `id` | The full markdown. Library ids are paths (`4_Prompts/…/x.md`); a bare slug is a My Library id |
| `list_sections` | none | The six sections with counts and what each holds, plus the My Library count |
| `list_categories` | `section` | Category and subcategory folders with counts |
| `get_skill` | `id`: skill folder or its `SKILL.md` id | `SKILL.md` plus the list of support files with sizes |
| `get_skill_file` | `skill`, `path` | One text file inside the skill. Refuses paths outside the folder, files over 500 KB and binaries |
| `list_skill_packs` | none | Every pack: id, name, skill count, generated or hand-picked |
| `get_skill_pack` | `id` | The pack's skills with their `SKILL.md` ids |
| `save_to_my_library` | `id` to copy, or `title` + `content` (+ `section`, `category`, `subcategory`, `tags`) | The new My Library id. A copy refuses a duplicate title in the same place, as the app does |
| `update_my_prompt` | `id` + any of `title`, `content`, `category`, `subcategory`, `tags` | Confirmation |
| `delete_my_prompt` | `id` | Confirmation. `destructiveHint`; the server's instructions tell the agent to ask first |

**Writes.** The three write tools are not registered at all when `READ_ONLY` is true (or
`VERCEL` is set), and each handler checks again. They go through `lib/my-library.ts`, whose ids
are `[a-z0-9-]` file names, so no id can name a path outside the folder.

**Containment.** Every caller-supplied path goes through `resolveInside()`: library ids against
`site/library/`, skill folders against `site/library/3_Skills/` (and the folder must hold a
`SKILL.md`), support files against their skill folder. The test tries `../` escapes against
each and fails if one returns anything.

## Prompts

MCP prompts appear in clients as slash commands, and clients list all of them. Registering all
~2,200 prompts and system prompts would bury the menu, so the server registers:

- `library_prompt` with arguments `id` and `input`: any prompt, system prompt or agent by id;
- every `featured` prompt and system prompt, by a slug of its file name;
- every My Library prompt, as `my-<id>`.

Each takes an optional `input`, appended after the prompt text as one user message. The
factory runs per connection, so the My Library list is current as of connecting.

## How it stays current

The server reads the library from disk on every call, so **content needs no step of its own**:
whatever the scheduled jobs add or fix is served as soon as the clone has it. What keeps the
clone, the code and the dependencies current:

| What | Kept current by |
|:---|:---|
| Library content (prompts, skills, agents, MCP cards, packs) | The Prompt-Library job fleet, merged to `main` by the Org PR Sweep |
| The clone a user-scope MCP config runs from | The daily repo sync (`Sync-Repos.ps1`) merges `main` into `mike_desktop` |
| `site/node_modules` after a dependency change | The same sync: `my-prompt-library` is in its `$repoInstallDirs` map, so a pulled change to `site/package-lock.json` runs `npm ci` in `site/`, after stopping the local app and any `node` process rooted in the repo (MCP sessions reconnect with `/mcp`), then restarts the app |
| SDK minor and patch releases | Dependabot's weekly grouped PR for `/site` |
| SDK majors and MCP spec revisions | The biweekly upstream check, from the `docs/UPSTREAMS.md` row |
| Every change to any of the above | CI runs `npm run test:mcp` on every PR, including every automation PR |
| A new library section | `test:mcp` fails until `SECTIONS` in `lib/library.ts` lists the same folders as `src/lib/sections.ts` |
| This server's own card in `6_MCP_Servers/` | The Monthly Upkeep's `check-mcp-servers.mjs` |

The count in the server's instructions comes from the index at start-up, so it never goes stale.

## Not built yet

These are on the roadmap and need Mike's go-ahead, because each makes something public:

- a read-only remote endpoint on the demo (Streamable HTTP at `/api/mcp`);
- an npm package, so `npx` works without a clone;
- a listing in the official MCP registry.
