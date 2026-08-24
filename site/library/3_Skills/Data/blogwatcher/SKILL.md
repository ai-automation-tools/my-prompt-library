---
title: "blogwatcher"
tags: ["rss", "blogs", "monitoring", "feeds"]
category: "Skills"
subcategory: "Data"
source: "https://skillsmp.com/skills/nousresearch-hermes-agent-skills-research-blogwatcher-skill-md"
---

# blogwatcher

Monitor blogs and RSS or Atom feeds with `blogwatcher-cli`.

## Overview

Use this skill to:

- Track blog updates over time
- Discover feeds automatically from a site URL
- Fall back to HTML scraping when RSS is unavailable
- Import feed subscriptions from OPML
- Maintain read and unread state locally

## Installation

One option:

```bash
go install github.com/JulienTant/blogwatcher-cli/cmd/blogwatcher-cli@latest
```

Other supported options include Docker and prebuilt binaries from the upstream releases page.

## Common Commands

### Managing blogs

```bash
blogwatcher-cli add "My Blog" https://example.com
blogwatcher-cli add "My Blog" https://example.com --feed-url https://example.com/feed.xml
blogwatcher-cli add "My Blog" https://example.com --scrape-selector "article h2 a"
blogwatcher-cli blogs
blogwatcher-cli remove "My Blog" --yes
blogwatcher-cli import subscriptions.opml
```

### Scanning and reading

```bash
blogwatcher-cli scan
blogwatcher-cli scan "My Blog"
blogwatcher-cli articles
blogwatcher-cli articles --all
blogwatcher-cli articles --blog "My Blog"
blogwatcher-cli read 1
blogwatcher-cli unread 1
blogwatcher-cli read-all
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BLOGWATCHER_DB` | SQLite database path |
| `BLOGWATCHER_WORKERS` | Concurrent scan workers |
| `BLOGWATCHER_SILENT` | Reduced scan output |
| `BLOGWATCHER_YES` | Skip confirmations |
| `BLOGWATCHER_CATEGORY` | Default article category filter |

## Notes

- Default database path: `~/.blogwatcher-cli/blogwatcher-cli.db`
- Supports OPML import from feed readers such as Feedly and Inoreader
- Categories from feeds can be stored and filtered
- HTML scraping can be used when feed discovery fails
