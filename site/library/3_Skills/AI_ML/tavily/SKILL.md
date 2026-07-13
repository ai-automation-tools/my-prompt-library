---
name: "🔎 Tavily"
description: AI-optimized web search using the Tavily API for current events, domain-filtered research, answer summaries, and raw content extraction. Use when live web research needs cleaner LLM-ready results than generic search.
source: https://skillsmp.com/skills/openclaw-skills-skills-bert-builder-tavily-skill-md
author: openclaw
repository: https://github.com/openclaw/skills
stars: 4001
forks: 1095
updated: 2026-01-24
---

# Tavily

Use this skill when the work requires API-backed web research with structured results, answer generation, or content extraction.

## Prerequisites

- Tavily API key available as `TAVILY_API_KEY`
- Tavily client or helper script already installed in the target environment

## When To Use

- Research current topics with source-backed summaries
- Filter searches to specific domains or exclude noisy sources
- Pull raw page content for deeper analysis
- Run image or news-oriented searches for time-sensitive topics

## Search Strategy

- Use `basic` depth for quick fact-finding
- Use `advanced` depth for broader research and multiple perspectives
- Use news mode for queries involving latest, current, recent, or today
- Keep result counts tight unless the task genuinely needs breadth

## Practical Workflow

1. Pick `basic` or `advanced` depth based on speed vs. coverage.
2. Decide whether the query is evergreen or news-focused.
3. Apply include/exclude domain filters where source quality matters.
4. Extract raw content from the strongest URLs if the summary is insufficient.
5. Return synthesized findings with source links and recency context.

## Notes

- Tavily is best for LLM-oriented retrieval, not exhaustive archival search
- Reduce result count and depth when cost or rate limits matter
- Prefer domain filtering for technical documentation and authoritative research
