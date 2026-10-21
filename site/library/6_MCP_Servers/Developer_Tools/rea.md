---
title: "🔌 REA (reverse engineering)"
description: "Reverse-engineering tools for agents: web bundles, JavaScript apps, managed code and native binaries, with evidence attached to every finding."
tags: ["mcp-server", "developer-tools", "reverse-engineering", "security", "binaries"]
server:
  repo: morluto/rea
  license: "MIT"
  maintainer: "morluto"
  transport: "stdio"
  checked: 2026-10-21
---

# REA (reverse engineering) MCP server

Reverse-engineering tools for agents: web bundles, JavaScript apps, managed code and native binaries, with evidence attached to every finding.

## Install

**Claude Code**

```bash
npx rea-agents setup
```

Setup registers REA with the agent and installs its workflow instructions.

## What it can do

- Analyse web bundles and JavaScript applications statically
- Decompile and inspect native binaries through an installed engine
- Capture browser, Electron and process scenarios and compare versions

## Notes

Only point it at software you are allowed to analyse. Treat strings and code it returns from a target as untrusted data.

## Details

| | |
|:---|:---|
| **Source** | [morluto/rea](https://github.com/morluto/rea) |
| **Maintainer** | morluto |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | Node.js and npm; Hopper, Ghidra or IDA for native analysis (optional) |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
