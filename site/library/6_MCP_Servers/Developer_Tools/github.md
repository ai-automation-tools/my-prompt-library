---
title: "🔌 GitHub"
description: "Issues, pull requests, code search, Actions and repository contents, from GitHub's own server."
tags: ["mcp-server", "developer-tools", "github", "git", "code-review", "official", "featured"]
server:
  repo: github/github-mcp-server
  license: "MIT"
  maintainer: "GitHub (official)"
  transport: "HTTP (remote), stdio (Docker)"
  checked: 2026-10-21
---

# GitHub MCP server

Issues, pull requests, code search, Actions and repository contents, from GitHub's own server.

## Install

**Claude Code**

```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

**Any MCP client** (`mcpServers` config). The remote server; clients that support OAuth sign in on first use.

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

## What it can do

- Read and create issues and pull requests, review and comment
- Search code and read files across repositories
- Inspect Actions runs and security alerts

## Notes

Give the token the narrowest scopes the work needs, and keep it in a `.env` file, never in a committed config.

## Details

| | |
|:---|:---|
| **Source** | [github/github-mcp-server](https://github.com/github/github-mcp-server) |
| **Maintainer** | GitHub (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio (Docker) |
| **Auth** | OAuth on the remote server, or a personal access token |
| **Needs** | Docker for the local server; nothing for the remote one |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
