---
name: "📄 Feishu Doc"
description: Read, create, write, and append content in Feishu (Lark) Docs, Sheets, Bitable, and Wiki-linked documents. Use when working with Feishu knowledge and document workflows.
source: https://skillsmp.com/skills/openclaw-skills-skills-autogame-17-feishu-doc-skill-md
author: openclaw
repository: https://github.com/openclaw/skills
stars: 3823
forks: 1063
updated: 2026-02-16
---

# Feishu Doc

Use this skill for structured document work in Feishu or Lark instead of treating those docs like generic web pages.

## Prerequisites

- Feishu/Lark app credentials configured in `config.json` or environment variables
- Access to the target workspace and document tokens
- Supporting Feishu auth tooling already available in the environment

## Capabilities

- Read content from Docs, Sheets, Bitable, and Wiki-backed documents
- Create new blank documents
- Overwrite a document with Markdown
- Append Markdown sections to extend an existing document
- Work with document blocks when fine-grained edits are needed

## Long Document Pattern

1. Create or identify the document token first.
2. Split large output into logical sections.
3. Append sections sequentially instead of sending one oversized write.
4. Verify structure after each append for long-form content.

## Usage Guidance

- Read first before writing, especially on shared documents
- Prefer append workflows for reports, plans, and large generated content
- Preserve document structure by chunking at section boundaries
- Confirm whether the target is a Doc, Sheet, Bitable, or Wiki-linked page before mutating it
