---
title: "🔌 Cloudflare"
description: "Cloudflare's hosted servers: the full API, plus focused ones for docs, Browser Rendering, Workers observability and more."
tags: ["mcp-server", "cloud-platforms", "cloud", "workers", "dns", "official"]
server:
  repo: cloudflare/mcp-server-cloudflare
  license: "Apache-2.0"
  maintainer: "Cloudflare (official)"
  transport: "HTTP (remote)"
  checked: 2026-10-21
---

# Cloudflare MCP server

Cloudflare's hosted servers: the full API, plus focused ones for docs, Browser Rendering, Workers observability and more.

## Install

**Claude Code**

```bash
claude mcp add --transport http cloudflare https://mcp.cloudflare.com/mcp
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "cloudflare": {
      "url": "https://mcp.cloudflare.com/mcp"
    }
  }
}
```

## What it can do

- Reach Cloudflare's APIs through the API server
- Search Cloudflare docs (`docs.mcp.cloudflare.com`)
- Render pages with Browser Rendering (`browser.mcp.cloudflare.com`)

## Notes

The API server is maintained in `cloudflare/mcp`; the domain-specific ones live in this repo. Add only the servers you need.

## Details

| | |
|:---|:---|
| **Source** | [cloudflare/mcp-server-cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) |
| **Maintainer** | Cloudflare (official) |
| **Licence** | Apache-2.0 |
| **Transport** | HTTP (remote) |
| **Auth** | OAuth sign-in to your Cloudflare account |
| **Needs** | A Cloudflare account |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
