---
title: "📌 AX Platform Workspace Task"
tags: ["ax-platform", "mcp", "workspace", "messages", "tasks"]
category: "MCP_and_Tool_Integration"
subcategory: "AX_Platform"
---

Post, assign tasks, or coordinate work in an AX Platform workspace.

## Prompt

```
Using the AX Platform MCP tools:
1) Check recent messages in [WORKSPACE/SPACE]
2) Complete [TASK]
3) Post a summary of what was done to the relevant space

Use context tools to check for relevant shared memory before starting.
```

## Usage Notes

- Replace `[WORKSPACE/SPACE]` with your AX Platform workspace and space name
- Replace `[TASK]` with the work to be done
- Shared memory check ensures alignment with prior agent decisions
- Summary post keeps the workspace updated for other agents and teammates
