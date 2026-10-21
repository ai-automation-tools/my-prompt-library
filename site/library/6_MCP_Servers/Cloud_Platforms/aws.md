---
title: "🔌 AWS"
description: "A family of AWS servers: documentation, the AWS API, infrastructure as code, IAM, and many service-specific ones."
tags: ["mcp-server", "cloud-platforms", "cloud", "aws", "infrastructure", "official"]
server:
  repo: awslabs/mcp
  license: "Apache-2.0"
  maintainer: "AWS Labs (official)"
  transport: "stdio"
  checked: 2026-10-21
---

# AWS MCP server

A family of AWS servers: documentation, the AWS API, infrastructure as code, IAM, and many service-specific ones.

## Install

**Claude Code**

```bash
claude mcp add aws-docs -e FASTMCP_LOG_LEVEL=ERROR -- uvx awslabs.aws-documentation-mcp-server@latest
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "aws": {
      "command": "uvx",
      "args": [
        "awslabs.aws-documentation-mcp-server@latest"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR",
        "AWS_DOCUMENTATION_PARTITION": "aws"
      }
    }
  }
}
```

## What it can do

- Search and read AWS documentation (`aws-documentation-mcp-server`)
- Call AWS APIs (`aws-api-mcp-server`)
- Work with infrastructure as code (`aws-iac-mcp-server`)

## Notes

Several servers in the repo are marked deprecated; check the table in its README before adding one. Use a least-privilege profile.

## Details

| | |
|:---|:---|
| **Source** | [awslabs/mcp](https://github.com/awslabs/mcp) |
| **Maintainer** | AWS Labs (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio |
| **Auth** | Your AWS credentials, for the servers that call AWS |
| **Needs** | uv (for uvx) |

_Install lines read from the server's README on 2026-10-21. The Monthly Upkeep re-checks every card._
