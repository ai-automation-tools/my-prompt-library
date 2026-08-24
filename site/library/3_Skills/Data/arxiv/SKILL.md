---
title: "arxiv"
tags: ["research", "academic", "papers", "science", "api"]
category: "Skills"
subcategory: "Data"
source: "https://skillsmp.com/skills/nousresearch-hermes-agent-skills-research-arxiv-skill-md"
---

# arxiv

Search and retrieve academic papers from arXiv via the public REST API. No API key required.

## Overview

Use this skill to:

- Search papers by keyword, title, author, abstract, or category
- Fetch a specific paper by arXiv ID
- Read abstracts and PDF links quickly
- Generate citation-ready metadata and BibTeX

## Quick Reference

| Action | Command |
|--------|---------|
| Search papers | `curl "https://export.arxiv.org/api/query?search_query=all:QUERY&max_results=5"` |
| Get a paper by ID | `curl "https://export.arxiv.org/api/query?id_list=2402.03300"` |
| Read abstract page | `https://arxiv.org/abs/<id>` |
| Read PDF | `https://arxiv.org/pdf/<id>` |

## Query Syntax

| Prefix | Scope | Example |
|--------|-------|---------|
| `all:` | All fields | `all:transformer+attention` |
| `ti:` | Title | `ti:large+language+models` |
| `au:` | Author | `au:hinton` |
| `abs:` | Abstract | `abs:reinforcement+learning` |
| `cat:` | Category | `cat:cs.AI` |

## Query Examples

```bash
curl -s "https://export.arxiv.org/api/query?search_query=all:GRPO+reinforcement+learning&max_results=5"
curl -s "https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=10"
curl -s "https://export.arxiv.org/api/query?id_list=2402.03300,2401.12345"
```

## Sort and Pagination

| Parameter | Options |
|-----------|---------|
| `sortBy` | `relevance`, `lastUpdatedDate`, `submittedDate` |
| `sortOrder` | `ascending`, `descending` |
| `start` | zero-based offset |
| `max_results` | default 10, max 30000 |

## BibTeX

After fetching metadata, convert the Atom response into BibTeX for citation management or paper notes.

## Related Files

- `scripts/search_arxiv.py`
