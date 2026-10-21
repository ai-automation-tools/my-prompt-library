---
title: "🔌 Supabase"
description: "Query and manage a Supabase project: tables, SQL, migrations, logs, edge functions and docs."
tags: ["mcp-server", "cloud-platforms", "database", "postgres", "backend", "official"]
server:
  repo: supabase/mcp
  license: "Apache-2.0"
  maintainer: "Supabase (official)"
  transport: "HTTP (remote)"
  checked: 2026-10-21
---

# Supabase MCP server

Query and manage a Supabase project: tables, SQL, migrations, logs, edge functions and docs.

## Install

**Claude Code**

```bash
claude mcp add --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<project-ref>&read_only=true"
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=<project-ref>&read_only=true"
    }
  }
}
```

## What it can do

- Run SQL and list tables
- Apply migrations and read logs
- Search the Supabase docs

## Notes

Scope it to one project with `project_ref` and start with `read_only=true`. Never connect it to production data you cannot afford to lose.

## Details

| | |
|:---|:---|
| **Source** | [supabase/mcp](https://github.com/supabase/mcp) |
| **Maintainer** | Supabase (official) |
| **Licence** | Apache-2.0 |
| **Transport** | HTTP (remote) |
| **Auth** | OAuth sign-in to your Supabase account |
| **Needs** | A Supabase account |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
