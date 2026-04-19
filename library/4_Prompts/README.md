# 4_Prompts - Prompt Templates & Examples

**Last Updated:** April 19, 2026  
**Status:** ✅ Reorganized (main category expansion)

---

## 📂 Directory Structure

This directory contains prompt templates, collections, and examples for various domains and use cases.

### Categories (12 total)

```
4_Prompts/
├── AI_ML/                  # AI & Machine Learning prompts
├── Automation/             # Automation tools & integrations
├── Business/               # Business operations & strategy
├── Content/                # Content creation & writing
├── Data/                   # Data analysis & data-adjacent prompts
├── DevOps/                 # Platform, infra, and operational tooling
├── Domain_Specific/        # Education, Legal, etc.
├── Engineering/            # Software engineering & core development
├── Finance/                # Financial analysis & planning
├── IT_Security/            # Security, IAM, governance, response
└── Media/                  # Images, Video, Social Media
```

---

## 📊 Current Snapshot

### Files by Category

| Category | Files |
|----------|-------|
| AI_ML | 139 |
| Automation | 9 |
| Business | 139 |
| Content | 44 |
| Data | 2 |
| DevOps | 13 |
| Domain_Specific | 27 |
| Engineering | 79 |
| Finance | 17 |
| IT_Security | 17 |
| Media | 44 |

---

## 🎯 What Changed (April 19, 2026)

Main category expansion was completed to reduce overload in `Development/`.

### Added main categories
- ✅ `Engineering/`
- ✅ `DevOps/`
- ✅ `IT_Security/`
- ✅ `Data/`
- ✅ `Automation/`

### Rebalanced from `Development/`
`Development/` was split into the categories above and removed.

Examples:
- Core software prompts moved to `Engineering/` (architecture, API design, testing, code generation, version control)
- Platform/ops prompts moved to `DevOps/` (Firebase, Google Workspace, Supabase, operations)
- Security/IAM/governance prompts moved to `IT_Security/`
- Data-oriented prompts moved to `Data/`
- Tool/integration workflows moved to `Automation/` (n8n, Notion, Obsidian, Serper)

---

## 🔍 Finding Prompts

### By development workstream
- **Core build/code tasks:** `Engineering/`
- **Infra/platform/ops tasks:** `DevOps/`
- **Security and IAM tasks:** `IT_Security/`
- **Data tasks:** `Data/`
- **Automation/workflow tasks:** `Automation/`

### Other domains
- **AI prompts:** `AI_ML/`
- **Business prompts:** `Business/`
- **Content prompts:** `Content/`
- **Media prompts:** `Media/`
- **Education/Legal:** `Domain_Specific/`
- **Finance:** `Finance/`

---

## 📝 File Format

Prompts should follow a consistent format:

```markdown
---
title: "Prompt Name"
tags: ["tag1", "tag2"]
category: "Prompts"
subcategory: "AI_ML|Business|Engineering|DevOps|IT_Security|..."
---

# Prompt Title

## Context
[Background and use case]

## Prompt
[The actual prompt text]

## Variables
[Template variables if applicable]

## Example Output
[Sample response]

## Tips
[Best practices for using this prompt]
```

---

## 🔄 Maintenance

### Adding New Prompts

1. Choose the most specific category first
2. Follow the standard file format
3. Include frontmatter + examples where useful
4. Update this README if a new subcategory is introduced

### Updating Existing Prompts

- Keep changes documented in git history
- Preserve naming consistency
- Prefer moving prompts over duplicating prompts

---

**Migration Notes:**
- Previous balancing pass: March 31, 2026
- Category expansion pass: April 19, 2026
