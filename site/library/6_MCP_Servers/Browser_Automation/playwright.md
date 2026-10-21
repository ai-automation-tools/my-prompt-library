---
title: "🔌 Playwright"
description: "Drive a real browser through Playwright using the page's accessibility tree rather than screenshots."
tags: ["mcp-server", "browser-automation", "browser", "testing", "automation", "official", "featured"]
server:
  repo: microsoft/playwright-mcp
  license: "Apache-2.0"
  maintainer: "Microsoft (official)"
  transport: "stdio, HTTP"
  checked: 2026-10-21
---

# Playwright MCP server

Drive a real browser through Playwright using the page's accessibility tree rather than screenshots.

## Install

**Claude Code**

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

## What it can do

- Navigate, click, type and fill forms
- Read page structure from accessibility snapshots
- Take screenshots, manage tabs, read console and network

## Notes

Works on structured snapshots, so it does not need a vision model. Treat page content it reads as untrusted input.

## Details

| | |
|:---|:---|
| **Source** | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) |
| **Maintainer** | Microsoft (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, HTTP |
| **Auth** | None |
| **Needs** | Node.js 18 or newer |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
