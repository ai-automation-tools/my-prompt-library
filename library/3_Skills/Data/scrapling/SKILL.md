---
title: "scrapling"
tags: ["web-scraping", "browser", "crawler", "research"]
category: "Skills"
subcategory: "Data"
source: "https://skillsmp.com/skills/nousresearch-hermes-agent-optional-skills-research-scrapling-skill-md"
---

# scrapling

Web scraping with Scrapling for HTTP fetching, dynamic browser automation, Cloudflare-aware stealth fetching, and spider crawling.

## Overview

Use this skill when:

- Static HTML scraping is faster than a full browser workflow
- A JS-rendered site needs a real browser
- Anti-bot or Cloudflare protection blocks normal fetching
- Multi-page crawling is needed
- Built-in extraction tools do not return the required data

This skill is for educational and research use. Respect site terms and applicable laws.

## Installation

```bash
pip install "scrapling[all]"
scrapling install
```

Minimal HTTP-only install:

```bash
pip install scrapling
```

## Fetching Modes

| Mode | Tooling | Use When |
|------|---------|----------|
| HTTP | `Fetcher` / `FetcherSession` | Static pages and APIs |
| Dynamic | `DynamicFetcher` / `DynamicSession` | JS-rendered pages and SPAs |
| Stealth | `StealthyFetcher` / `StealthySession` | Bot-protected pages |
| Spider | `Spider` | Multi-page crawls |

## CLI Examples

```bash
scrapling extract get "https://example.com" output.md
scrapling extract fetch "https://example.com" output.md --css-selector ".dynamic-content"
scrapling extract stealthy-fetch "https://protected-site.com" output.html --solve-cloudflare
scrapling extract post "https://example.com/api" output.json --json '{"query":"search term"}'
```

## Python Examples

### Static page

```python
from scrapling.fetchers import Fetcher

page = Fetcher.get("https://quotes.toscrape.com/")
quotes = page.css(".quote .text::text").getall()
```

### Dynamic page

```python
from scrapling.fetchers import DynamicFetcher

page = DynamicFetcher.fetch("https://example.com", headless=True)
items = page.css(".js-loaded-content::text").getall()
```

### Stealth mode

```python
from scrapling.fetchers import StealthyFetcher

page = StealthyFetcher.fetch(
    "https://protected-site.com",
    headless=True,
    solve_cloudflare=True,
)
```

## Pitfalls

- Run `scrapling install` after installation for browser-backed modes
- Dynamic and stealth timeouts are in milliseconds
- Cloudflare solving adds latency
- Stealth mode consumes real browser resources
- Always review robots.txt and site terms first
