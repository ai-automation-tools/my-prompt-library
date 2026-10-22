---
title: "🔌 MongoDB"
description: "Query, inspect and manage MongoDB databases and MongoDB Atlas clusters in plain language, with a read-only mode for safe access."
tags: ["mcp-server", "cloud-platforms", "database", "mongodb", "atlas", "official"]
server:
  repo: mongodb-js/mongodb-mcp-server
  license: "Apache-2.0"
  maintainer: "MongoDB (official)"
  transport: "stdio"
  checked: 2026-10-22
---

# MongoDB MCP server

Query, inspect and manage MongoDB databases and MongoDB Atlas clusters in plain language, with a read-only mode for safe access.

## Install

**Claude Code**

```bash
claude mcp add mongodb --env MDB_MCP_CONNECTION_STRING=mongodb://localhost:27017/myDatabase -- npx -y mongodb-mcp-server@latest --readOnly
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "MongoDB": {
      "command": "npx",
      "args": ["-y", "mongodb-mcp-server@latest", "--readOnly"],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017/myDatabase"
      }
    }
  }
}
```

## What it can do

- Run `find`, `aggregate`, `count` and `explain` against collections, and inspect schemas, indexes and storage size
- Write data and manage collections and indexes (`insert-many`, `update-many`, `create-index`, `drop-collection`), unless `--readOnly` is set
- With Atlas API credentials, create clusters, manage access lists and connect to Atlas clusters

## Notes

The README's examples all pass `--readOnly`; drop it only when you want the agent to write. Pass the connection string and Atlas credentials in environment variables, not arguments (arguments show in process lists), and give the Atlas service account the minimum permissions. For Atlas the README recommends the `mongodb-atlas` plugin, which connects to MongoDB's hosted MCP server over OAuth.

## Details

| | |
|:---|:---|
| **Source** | [mongodb-js/mongodb-mcp-server](https://github.com/mongodb-js/mongodb-mcp-server) |
| **Maintainer** | MongoDB (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio |
| **Auth** | Connection string in an env var, or Atlas service-account credentials |
| **Needs** | Node.js 22.13+, a MongoDB connection string or Atlas API credentials |

_Install lines read from the server's README on 2026-10-22. The Monthly Upkeep re-checks every card._
