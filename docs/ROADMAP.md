<h1 align="center">🗺️ Roadmap</h1>

<p align="center">
  <em>From a local-first prompt library you browse, to one your agents can search and use directly over MCP.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/now-phase_1:_MCP_server-F59E0B?style=for-the-badge" alt="Now: Phase 1, MCP server">
  <img src="https://img.shields.io/badge/stage-public_since_2026--10--12-2ea44f?style=for-the-badge" alt="Stage: public since 2026-10-12">
  <a href="README.md"><img src="https://img.shields.io/badge/↩-docs_home-6B7280?style=for-the-badge" alt="Back to docs"></a>
</p>

---

The Prompt-Library roadmap routine works this file top to bottom every Saturday night, once
the weekly upstream-drift issue has no `behind` entries: it takes the first open item that
isn't `🔒 Needs Mike`, builds it, ticks it, and adds the matching line to the
[changelog](CHANGELOG.md). **Every item above `## After public release` is a release gate**
for the next release; the repo itself has been public since 2026-10-12. Ticking an item adds
its line to the changelog and updates any doc it made stale, in the same commit.

Markers: `- [ ]` open, `- [-]` claimed by a run in progress, `- [x]` done, `- [!]` blocked
(the reason follows on the line). `small` marks an item a check verifies; `🔒 Needs Mike`
marks one only Mike can do.

> [!NOTE]
> **Where we are, 2026-10-21.** Rewritten from scratch today; everything finished before this
> date is in the [changelog](CHANGELOG.md). The app is local-first (clone and run, My Library
> is a folder of markdown files) with a read-only demo at
> `promptbook-demo.ai-automation-tools.dev`. The library has six sections plus Skill
> Packs, and seven scheduled jobs keep it growing and current. The local MCP server shipped the
> same day, so an agent can search the library and pull a prompt, skill or agent straight into
> its work. Phase 1's three remaining items each make something public and wait on Mike; the
> roadmap routine moves on to Phase 2 meanwhile.

## 🔌 Phase 1: MCP server for the library

The library becomes a tool an agent calls, not just a site a person reads. A stdio server ships
in this repo and reads the same `site/library/` and My Library folder the app does; a
read-only remote endpoint on the demo comes after it.

- [x] Design note in `docs/features/MCP-SERVER.md`: the tool list with input and output shapes, which tools write, the stdio transport and how the server finds `site/library/` and `MY_LIBRARY_DIR`, and how it shares code with `api/` instead of duplicating it. Done when the note exists and the tools below match it — done 2026-10-21: `docs/features/MCP-SERVER.md` (shape, stdout rule, tool table, prompts, what is not built)
- [x] Walking skeleton: `npm run mcp` in `site/` starts a stdio server on `@modelcontextprotocol/sdk` with two tools, `search_library` (query, section, tags, limit; ranked results with id, title, section, tags) and `get_item` (id; the full markdown body and frontmatter). Proved by `scripts/mcp-server.test.mjs`, which spawns the server, lists tools and calls both, and runs in CI — done 2026-10-21: `site/mcp/server.ts` on `@modelcontextprotocol/server` 2.3 via `serveStdio()`, `scripts/mcp-server.test.mjs` as `npm run test:mcp`, CI step "MCP server"
- [x] Browse tools: `list_sections` (the seven sections with counts) and `list_categories` (section → category → subcategory tree with counts), both from `api/prompt-index.json`, covered by the same test — done 2026-10-21: `list_sections`, `list_categories`
- [x] Skill tools: `get_skill` returns a skill's `SKILL.md` and the list of its support files, `get_skill_file` returns one of them (paths confined to the skill folder by `resolveInside()`), `list_skill_packs` and `get_skill_pack` read `3_Skills/packs/`. Test includes a path-traversal attempt that must be refused — done 2026-10-21: `get_skill`, `get_skill_file`, `list_skill_packs`, `get_skill_pack`; four traversal attempts refused in the test, and a deliberately broken guard made the test fail
- [x] MCP prompts: every `4_Prompts` and `5_System_Prompts` file is exposed through `prompts/list` (paged, filterable by section) and `prompts/get`, with `[placeholder]` fields turned into prompt arguments where the file declares them, so clients show library prompts as slash commands — done 2026-10-21: built differently from this wording, on purpose: ~2,200 named prompts would flood every client's slash menu, so the server registers `library_prompt` (any id) plus the featured prompts and every My Library prompt by name, each with one optional `input` argument. Placeholder-to-argument parsing is a separate item under Later
- [x] My Library write tools: `save_to_my_library` (copy a public item, or write a new one), `update_my_prompt`, `delete_my_prompt`, going through `site/lib/my-library.ts` with its id rules, and refusing every write when `READ_ONLY` is set. Test covers a round trip and the read-only refusal — done 2026-10-21: `save_to_my_library`, `update_my_prompt`, `delete_my_prompt`; not registered at all under `READ_ONLY`, and each handler checks again
- [x] Install docs: an "Use it from an agent" section in `README.md` with the `claude mcp add my-prompt-library -- …` line and an `mcpServers` JSON block, the server's own card in `site/library/6_MCP_Servers/Developer_Tools/my-prompt-library.md`, and a card on the homepage. `homepage.test.mjs` still passes — done 2026-10-21: README "Use It From An Agent", `6_MCP_Servers/Developer_Tools/my-prompt-library.md`, homepage feature card and install block. The `npm --prefix … run --silent mcp` line was tested with a real Claude Code session
- [ ] Remote read-only endpoint on the demo: Streamable HTTP at `/api/mcp` on Vercel, read tools and MCP prompts only, no write tools registered, a per-IP rate limit, and the CSP and headers the rest of the API has. Proved by a deployed smoke test with a real MCP client 🔒 Needs Mike (it opens a new public endpoint)
- [ ] Publish the stdio server as an npm package so `npx my-prompt-library-mcp` works without a clone, with the library bundled or fetched from the demo 🔒 Needs Mike (npm account and package name)
- [ ] List the server in the official MCP registry (`modelcontextprotocol/registry`) once it is on npm 🔒 Needs Mike

## 🧹 Phase 2: Loose ends

- [ ] Move off Node 22 before its end of life on 2027-04-30: CI and `upstream-drift.yml` on `node-version: "24"`, `@types/node` `^24`, `engines` pinned in `site/package.json`, CI green. The Vercel project's Node setting is part of done 🔒 Needs Mike (dashboard)
- [ ] `small` The Resources menu is reachable below 1536px: its groups appear in the section sheet the menu button opens, so phones and narrow windows get the links too. Checked at 390, 1280 and 1600px
- [ ] `small` The hero counters name what a section holds ("servers", "skills", "agents") instead of "prompts" everywhere, from a field in `sections.ts`
- [ ] Resolve the semantic duplicates the byte-level dedupe cannot see: the two skill groups that share an upstream file (`skill-creator`, `brand-guidelines`), and any near-duplicates among the 49 backend specialists in `2_Agents/Development/Backend/`. Each merge or removal gets a changelog reason
- [ ] Delete the stale `roadmap/auto-2026-08-31` branch (its PR #332 was closed unmerged) or recover its one commit 🔒 Needs Mike
- [ ] Decide what happens to `4_Prompts/Awesome_ChatGPT/` (1,349 files from one upstream corpus): resync it on a schedule like the skills, or tag it `vendored` and freeze it 🔒 Needs Mike
- [ ] `ai-automation-tools/agent-skills` gets a `LICENSE` file, so the 40 skills synced from it carry a stated licence in this public repo, and `NOTICE` names it 🔒 Needs Mike
- [ ] `small` `scripts/resync-upstream.mjs` writes `tags: [...]---` on one line when `tags:` is the last frontmatter key of an agent (`stampUpstream` drops the newline), which breaks the frontmatter; hit on 3 agents on 2026-10-22. Fix it to always end the block with a newline. Done when resyncing `2_Agents/AI_ML/Other/model-evaluator.md` from a pre-sync copy yields valid frontmatter, with a case in `scripts/upstream.test.mjs`

## 🚦 Public release

- [x] CI green on push and PR: lint, the route table, the My Library store and safe-path tests, the homepage test, provenance self-checks and prompt-index freshness — done 2026-08-27, extended since: `.github/workflows/ci.yml`
- [x] `LICENSE` (Apache 2.0), `NOTICE` for vendored content, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` — done 2026-10-05: see the changelog
- [x] Live: homepage at `promptbook.ai-automation-tools.dev` — done 2026-10-12; the app at `promptbook-demo.ai-automation-tools.dev` since 2026-10-19, read-only since 2026-10-21: see the changelog
- [ ] A full-history secret scan (`gitleaks detect` over all of history) run and its findings written to `docs/audits/`; the one known hit, the old Neon credential, is closed because that database was deleted on 2026-10-21

## After public release

Nothing below blocks go-live.

### 🧾 Content provenance

- [ ] Decide whether a skill's `description:` is our curation or upstream content. Resync keeps the whole local frontmatter, so bodies match upstream while some descriptions are a year old, and the drift check strips frontmatter so it cannot see the gap. Done when resync and the drift report both handle `description` per the decision 🔒 Needs Mike
- [ ] Stamp `upstream:` provenance on `4_Prompts` and `5_System_Prompts` files that came from a public repo, with `attribute-upstream.mjs` learning single-file prompts. Done when the Monday health table's "no provenance" column drops for both sections
- [ ] Raise skill attribution above its current share: 60 skills are `ambiguous` and 163 `unknown`. Matching support files as well as `SKILL.md` against the mirror is the likely lever
- [ ] Show freshness in the UI: the index carries `upstream.checked` (and `server.checked` for MCP cards), the card shows a stale badge past 90 days, and the CI freshness gate knows the new field. Sourcing `lastModified` from `git log` instead of file mtime needs a Vercel preview to prove the shallow clone works 🔒 Needs Mike for that half

### ✨ Features

- [ ] Role-based starter collections for prompts and agents (a "frontend engineer" or "founder" set), served like Skill Packs and installable into My Library in one step
- [ ] Skill Packs show whether a pack is generated from a folder or hand-picked, and the generated ones say which folder
- [ ] Export My Library as a zip, and import one, from Settings
- [ ] Library prompts with `[placeholder]` fields expose them as MCP prompt arguments, so a client asks for each value instead of one free-text `input`

### 📣 Publish and promote

- [ ] Launch post for the MCP server once Phase 1 is done, linked from the org landing page card 🔒 Needs Mike

---

### 🗓️ Kept current by

Recurring work, not items. Schedules belong to the Routines fleet; this table only says which
job owns which part of the library.

| Job | Owns |
|:---|:---|
| Skills Sync (weekly, no model) | `3_Skills` intake and refresh from `ai-automation-tools/agent-skills`, and the generated Skill Packs |
| Add Prompts (weekly) | New `4_Prompts` and `1_Guides` files |
| Discovery (weekly, no model) | New GitHub repos into [`DISCOVERY.md`](DISCOVERY.md); `link` rows into the Resources menu |
| Guides Refresh (biweekly) | Fixing `1_Guides` against official docs |
| Catalog Refresh (biweekly) | `5_System_Prompts`, `2_Agents`, `6_MCP_Servers`, and the ledger's `accept` rows |
| Weekly Roadmap | This file, and resyncing skills and agents the drift issue marks `behind` |
| Monthly Upkeep | Updates and removals, hand-written Skill Packs, Resources links, MCP cards, `featured` and tags |
| `upstream-drift.yml` (weekly, GitHub Actions) | The rolling drift issue with its per-section health table |

---

<p align="center">
  <a href="README.md">← Docs home</a> ·
  <a href="CHANGELOG.md">Changelog →</a>
</p>
