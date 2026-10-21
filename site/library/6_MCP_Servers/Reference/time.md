---
title: "🔌 Time"
description: "The current time in any IANA time zone, and conversion between zones."
tags: ["mcp-server", "reference", "time", "timezone"]
server:
  repo: modelcontextprotocol/servers
  path: src/time
  license: "Apache-2.0 / MIT"
  maintainer: "MCP project (reference server)"
  transport: "stdio"
  checked: 2026-10-21
---

# Time MCP server

The current time in any IANA time zone, and conversion between zones.

## Install

**Claude Code**

```bash
claude mcp add time -- uvx mcp-server-time
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time"
      ]
    }
  }
}
```

## What it can do

- Get the current time in a named zone
- Convert a time between two zones

## Notes

Small and dependency-free; a good first server to test a client with.

## Details

| | |
|:---|:---|
| **Source** | [modelcontextprotocol/servers/src/time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) |
| **Maintainer** | MCP project (reference server) |
| **Licence** | Apache-2.0 / MIT |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | uv (for uvx) or pip |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
