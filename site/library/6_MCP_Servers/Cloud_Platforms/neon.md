---
title: "🔌 Neon"
description: "Create Neon Postgres projects and branches, run queries and perform schema migrations by asking in natural language."
tags: ["mcp-server", "cloud-platforms", "database", "postgres", "neon", "official"]
server:
  repo: neondatabase/mcp-server-neon
  license: "MIT"
  maintainer: "Neon (official)"
  transport: "HTTP (remote)"
  checked: 2026-10-22
---

# Neon MCP server

Create Neon Postgres projects and branches, run queries and perform schema migrations by asking in natural language.

## Install

**Claude Code**

```bash
npx neon@latest init
```

This authenticates over OAuth, creates a Neon API key and configures Claude Code, Cursor or VS Code for you.

**Any MCP client** (`mcpServers` config, OAuth)

```json
{
  "mcpServers": {
    "Neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp?category=projects&category=branches&category=endpoints&category=querying&category=schema"
    }
  }
}
```

Restart the client; a browser window opens to authorize your Neon account. For an API key instead of OAuth, send it in an `Authorization: Bearer` header.

## What it can do

- Create and list projects, branches and compute endpoints
- Run SQL and inspect schemas
- Run schema migrations through Neon's branching

## Notes

Neon says this server is for local development and IDE use, not production: review every action the model proposes. With OAuth it works on your personal account by default; name an `org_id` or `project_id` in the prompt for organization projects. If IP Allow is on, add `34.192.103.46` and `23.22.233.166` to the allowlist.

## Details

| | |
|:---|:---|
| **Source** | [neondatabase/mcp-server-neon](https://github.com/neondatabase/mcp-server-neon) |
| **Maintainer** | Neon (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | OAuth, or a Neon API key in an `Authorization: Bearer` header |
| **Needs** | A Neon account; Node.js 18+ for the `init` command |

_Install lines read from the server's README on 2026-10-22. The Monthly Upkeep re-checks every card._
