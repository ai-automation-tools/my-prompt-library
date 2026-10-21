---
title: "🔌 Git"
description: "Read and change a local Git repository: status, diffs, log, branches, staging and commits."
tags: ["mcp-server", "reference", "git", "version-control"]
server:
  repo: modelcontextprotocol/servers
  path: src/git
  license: "Apache-2.0 / MIT"
  maintainer: "MCP project (reference server)"
  transport: "stdio"
  checked: 2026-10-21
---

# Git MCP server

Read and change a local Git repository: status, diffs, log, branches, staging and commits.

## Install

**Claude Code**

```bash
claude mcp add git -- uvx mcp-server-git --repository /path/to/repo
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "/path/to/repo"
      ]
    }
  }
}
```

## What it can do

- Show status, diffs and the log
- Stage files and commit
- Create and switch branches

## Notes

Without `--repository`, every tool call names its own `repo_path`. The README calls the server early in development.

## Details

| | |
|:---|:---|
| **Source** | [modelcontextprotocol/servers/src/git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) |
| **Maintainer** | MCP project (reference server) |
| **Licence** | Apache-2.0 / MIT |
| **Transport** | stdio |
| **Auth** | None. Limited to the repository you pass with `--repository`. |
| **Needs** | uv (for uvx) or pip |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
