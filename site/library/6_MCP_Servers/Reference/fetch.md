---
title: "🔌 Fetch"
description: "Fetch a web page and hand it to the model as Markdown, in chunks it can page through."
tags: ["mcp-server", "reference", "web", "http"]
server:
  repo: modelcontextprotocol/servers
  path: src/fetch
  license: "Apache-2.0 / MIT"
  maintainer: "MCP project (reference server)"
  transport: "stdio"
  checked: 2026-10-21
---

# Fetch MCP server

Fetch a web page and hand it to the model as Markdown, in chunks it can page through.

## Install

**Claude Code**

```bash
claude mcp add fetch -- uvx mcp-server-fetch
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": [
        "mcp-server-fetch"
      ]
    }
  }
}
```

## What it can do

- Fetch a URL and convert the HTML to Markdown
- Read long pages in chunks with a start index
- Return raw content when asked

## Notes

The server can reach any address the machine can, including local network services. Run it where that is acceptable.

## Details

| | |
|:---|:---|
| **Source** | [modelcontextprotocol/servers/src/fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) |
| **Maintainer** | MCP project (reference server) |
| **Licence** | Apache-2.0 / MIT |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | uv (for uvx) or pip |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
