---
title: "🔌 Filesystem"
description: "Read, write, search and move files inside the directories you allow, and nowhere else."
tags: ["mcp-server", "reference", "files", "local", "featured"]
server:
  repo: modelcontextprotocol/servers
  path: src/filesystem
  license: "Apache-2.0 / MIT"
  maintainer: "MCP project (reference server)"
  transport: "stdio"
  checked: 2026-10-21
---

# Filesystem MCP server

Read, write, search and move files inside the directories you allow, and nowhere else.

## Install

**Claude Code**

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/dir
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/dir"
      ]
    }
  }
}
```

## What it can do

- Read and write files, create and list directories
- Move files and search by pattern
- Report file metadata
- Refuse any path outside the allowed directories

## Notes

Pass more than one directory to allow several. Give it the narrowest folder that does the job: anything inside is writable.

## Details

| | |
|:---|:---|
| **Source** | [modelcontextprotocol/servers/src/filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) |
| **Maintainer** | MCP project (reference server) |
| **Licence** | Apache-2.0 / MIT |
| **Transport** | stdio |
| **Auth** | None. Access is limited to the directories you pass on the command line. |
| **Needs** | Node.js 24 or later |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
