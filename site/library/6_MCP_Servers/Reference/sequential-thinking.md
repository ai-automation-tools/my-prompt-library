---
title: "🔌 Sequential Thinking"
description: "A scratchpad tool for step-by-step reasoning that can revise and branch earlier steps."
tags: ["mcp-server", "reference", "reasoning", "planning"]
server:
  repo: modelcontextprotocol/servers
  path: src/sequentialthinking
  license: "Apache-2.0 / MIT"
  maintainer: "MCP project (reference server)"
  transport: "stdio"
  checked: 2026-10-21
---

# Sequential Thinking MCP server

A scratchpad tool for step-by-step reasoning that can revise and branch earlier steps.

## Install

**Claude Code**

```bash
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    }
  }
}
```

## What it can do

- Record a numbered chain of thoughts
- Revise an earlier step or branch from it
- Adjust the planned number of steps as it goes

## Notes

Most useful with models that do not already reason at length on their own.

## Details

| | |
|:---|:---|
| **Source** | [modelcontextprotocol/servers/src/sequentialthinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) |
| **Maintainer** | MCP project (reference server) |
| **Licence** | Apache-2.0 / MIT |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | Node.js 24 or later |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
