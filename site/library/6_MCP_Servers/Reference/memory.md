---
title: "🔌 Memory"
description: "A persistent knowledge graph of entities, relations and observations the model can build and query across sessions."
tags: ["mcp-server", "reference", "memory", "knowledge-graph"]
server:
  repo: modelcontextprotocol/servers
  path: src/memory
  license: "Apache-2.0 / MIT"
  maintainer: "MCP project (reference server)"
  transport: "stdio"
  checked: 2026-10-21
---

# Memory MCP server

A persistent knowledge graph of entities, relations and observations the model can build and query across sessions.

## Install

**Claude Code**

```bash
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    }
  }
}
```

## What it can do

- Create entities and the relations between them
- Add and remove observations on an entity
- Search the graph and read it back

## Notes

The graph is a local JSON file. A Docker image (`mcp/memory`) keeps it in a named volume instead.

## Details

| | |
|:---|:---|
| **Source** | [modelcontextprotocol/servers/src/memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) |
| **Maintainer** | MCP project (reference server) |
| **Licence** | Apache-2.0 / MIT |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | Node.js 24 or later |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
