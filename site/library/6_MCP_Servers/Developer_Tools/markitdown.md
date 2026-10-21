---
title: "🔌 MarkItDown"
description: "Convert PDFs, Office files, images, audio and web pages to Markdown a model can read."
tags: ["mcp-server", "developer-tools", "documents", "conversion", "pdf", "official"]
server:
  repo: microsoft/markitdown
  path: packages/markitdown-mcp
  license: "MIT"
  maintainer: "Microsoft (official)"
  transport: "stdio, Streamable HTTP, SSE"
  checked: 2026-10-21
---

# MarkItDown MCP server

Convert PDFs, Office files, images, audio and web pages to Markdown a model can read.

## Install

**Claude Code**

```bash
pip install markitdown-mcp && claude mcp add markitdown -- markitdown-mcp
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "markitdown-mcp",
      "args": []
    }
  }
}
```

## What it can do

- Convert a file path, http(s) or data URI to Markdown

## Notes

`markitdown-mcp --http --host 127.0.0.1 --port 3001` serves it over HTTP. Keep it bound to localhost: it reads any file the user can.

## Details

| | |
|:---|:---|
| **Source** | [microsoft/markitdown/packages/markitdown-mcp](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp) |
| **Maintainer** | Microsoft (official) |
| **Licence** | MIT |
| **Transport** | stdio, Streamable HTTP, SSE |
| **Auth** | None |
| **Needs** | Python 3.10+ |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
