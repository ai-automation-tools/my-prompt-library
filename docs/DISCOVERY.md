# Discovery ledger

GitHub repos that `scripts/discover-repos.mjs` found and that the library might vendor or link:
skills, prompt collections, agent definitions and MCP servers that are **new** (created in the
last year with 200+ stars) or **popular** (2000+ stars) and that nothing here already tracks.
The weekly **Prompt-Library Discovery** job (`jobs\prompt-library-discovery` in the Routines
fleet, Tuesdays) appends rows and opens a `discovery/auto-*` PR; a person changes **Status**.

| Status | Meaning | Who acts |
|:---|:---|:---|
| `pending` | Found, not decided | Mike |
| `accept` | Vendor its content with provenance, and link it in the Resources menu | the Catalog Refresh job (content), `discover-repos.mjs --write` (link) |
| `link` | Worth a Resources-menu link, nothing to vendor | `discover-repos.mjs --write` |
| `reject` | Not for this library (stays here so it is not found again) | nobody |
| `done` | Content vendored; the catalog job sets this | nobody |

Rules the catalog job follows on an `accept` row: read the licence that run (a row that says
`none` is never vendored, only linked); copy at most 6 files per repo per run, each with an
`upstream:` block (`repo`, `path`, `ref`, `checked`, `match: exact`) and `tags`; skills go to
`3_Skills/<Category>/<Sub>/`, prompts to `4_Prompts/`, agent definitions to `2_Agents/`, in the
neighbours' format; MCP servers are linked only until the library has a section for them. Then
set the row to `done` and note what was taken.

Columns: repo, kind (`skills` / `prompts` / `agents` / `mcp`), stars when found, licence key,
last push, date found, status, note. Newest rows at the top. The script dedupes on the repo
column, so never delete a row: change its status instead.

| Repo | Kind | Stars | Licence | Pushed | Found | Status | Note |
|:---|:---|---:|:---|:---|:---|:---|:---|
| [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | skills | 0 | — | — | 2026-10-21 | pending | named by Mike as the kind of repo to pull in; stars and licence not read yet |
| [morluto/rea](https://github.com/morluto/rea) | skills | 0 | — | — | 2026-10-21 | pending | named by Mike; a reverse-engineering MCP server plus skills |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | skills | 0 | — | — | 2026-10-21 | pending | named by Mike; diagram-building skill |
<!-- discover-repos: new rows go above this line -->
