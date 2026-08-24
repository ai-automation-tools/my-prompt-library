---
name: "📝 Notion"
description: Use the Notion API to create, read, update, and query pages, databases, and blocks. Use when integrating with Notion workspaces, automating knowledge workflows, or managing structured content in Notion.
source: https://skillsmp.com/skills/openclaw-openclaw-skills-notion-skill-md
author: openclaw
repository: https://github.com/openclaw/openclaw
stars: 357320
forks: 72541
updated: 2026-03-07
---

# Notion

Use the Notion API for page management, structured data workflows, and block-level content updates.

## When To Use

- Create or update Notion pages
- Query Notion databases or data sources
- Append blocks to existing pages
- Build workspace automation around project tracking or knowledge management

## Setup

1. Create a Notion integration at `https://notion.so/my-integrations`
2. Store the API key securely
3. Share the target pages or databases with that integration

## Request Basics

Every request needs:

- `Authorization: Bearer <NOTION_KEY>`
- `Notion-Version: 2025-09-03`
- `Content-Type: application/json`

## Common Operations

### Search

```bash
curl -X POST "https://api.notion.com/v1/search" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2025-09-03" \
  -H "Content-Type: application/json" \
  -d '{"query": "page title"}'
```

### Read A Page

```bash
curl "https://api.notion.com/v1/pages/{page_id}" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2025-09-03"
```

### Query A Data Source

```bash
curl -X POST "https://api.notion.com/v1/data_sources/{data_source_id}/query" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2025-09-03" \
  -H "Content-Type: application/json"
```

## Important 2025 API Notes

- Notion now refers to databases as `data sources` in the API
- Creating pages still uses `database_id`
- Querying uses `data_source_id`
- Search results return databases as `object: "data_source"`

## Practical Notes

- IDs are UUIDs with or without dashes
- API rate limits are roughly three requests per second
- Block appends are capped per request
- View filters remain UI-only and are not fully controllable by API

