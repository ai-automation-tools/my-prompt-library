---
title: "🔌 Context7"
description: "Current, version-specific library documentation pulled into the prompt, so the model stops guessing at APIs."
tags: ["mcp-server", "developer-tools", "documentation", "libraries", "official", "featured"]
server:
  repo: upstash/context7
  license: "MIT"
  maintainer: "Upstash (official)"
  transport: "HTTP (remote)"
  checked: 2026-10-21
---

# Context7 MCP server

Current, version-specific library documentation pulled into the prompt, so the model stops guessing at APIs.

## Install

**Claude Code**

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "Authorization: Bearer YOUR_API_KEY"
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## What it can do

- Resolve a library name to a Context7 id
- Fetch documentation and code examples for that library and version

## Notes

`npx ctx7 setup` configures supported clients for you; `npx ctx7 remove` undoes it.

## Details

| | |
|:---|:---|
| **Source** | [upstash/context7](https://github.com/upstash/context7) |
| **Maintainer** | Upstash (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | API key in an `Authorization: Bearer` header |
| **Needs** | A Context7 API key |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
