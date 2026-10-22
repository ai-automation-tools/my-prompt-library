---
title: "🔌 Promptbook"
description: "This library as an MCP server: search prompts, agents, skills and MCP cards, read any item, pull a skill with its files, and save to My Library."
tags: ["mcp-server", "developer-tools", "prompts", "skills", "agents", "featured"]
server:
  repo: ai-automation-tools/promptbook
  path: site/mcp
  license: "Apache-2.0"
  maintainer: "ai-automation-tools (this project)"
  transport: "stdio"
  checked: 2026-10-21
---

# Promptbook MCP server

This library as an MCP server: search prompts, agents, skills and MCP cards, read any item, pull a skill with its files, and save to My Library.

## Install

**Claude Code** (clone the repo and run `npm install` in `site/` first; use the absolute path)

```bash
claude mcp add my-prompt-library -- npm --prefix /path/to/my-prompt-library/site run --silent mcp
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "my-prompt-library": {
      "command": "npm",
      "args": ["--prefix", "/path/to/my-prompt-library/site", "run", "--silent", "mcp"]
    }
  }
}
```

## What it can do

- Search every section and My Library by words, section, category or tags, and read any item in full
- Return a skill's `SKILL.md` with its support files, and list the Skill Packs
- Offer featured and My Library prompts as slash commands, plus `library_prompt` for any id
- Save, update and delete My Library prompts (not offered when `READ_ONLY=true`)

## Notes

It reads the folders on your disk, so nothing else needs to be running and nothing leaves the machine. My Library writes go to `MY_LIBRARY_DIR` (default `site/my-library/`). Set `READ_ONLY=true` in `site/.env` to hand it to an agent you only want reading.

## Details

| | |
|:---|:---|
| **Source** | [ai-automation-tools/promptbook/site/mcp](https://github.com/ai-automation-tools/promptbook/tree/main/site/mcp) |
| **Maintainer** | ai-automation-tools (this project) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio |
| **Auth** | None. Local files only |
| **Needs** | Node.js 20+, a clone of this repo with `npm install` run in `site/` |

_Install lines tested with Claude Code on 2026-10-21. The Monthly Upkeep re-checks every card._
