# 2_Agents - Agent Personas & Instructions

**Last Updated:** March 31, 2026  
**Status:** ✅ Reorganized (Phase 2 complete)

---

## 📂 Directory Structure

This directory contains complete agent definitions including personas, instructions, and example outputs.

### Categories (10 total)

```
2_Agents/
├── AI_ML/                  # AI & Machine Learning experts
├── Business/               # Business operations & strategy
├── Development/            # Software development & engineering
├── Security/               # Security & compliance
├── Finance/                # Financial analysis & planning
├── Content/                # Content creation & writing
├── Enterprise/             # Enterprise-specific roles
├── Domain_Specific/        # Healthcare, Legal, Education, Research
├── Platform_Agents/        # Platform-specific (aX, Gemini Gems)
└── Assistants/             # Personal assistants & helpers
```

---

## 📊 Statistics

- **Total Files:** 466
- **Categories:** 10 (reduced from 24)
- **Reduction:** 58%

### Files by Category

| Category | Files | Description |
|----------|-------|-------------|
| Development | 151 | Software engineering agents |
| Assistants | 71 | Personal & productivity helpers |
| AI_ML | 33 | AI/ML specialists |
| Platform_Agents | 34 | aX Platform, Gemini Gems agents |
| Finance | 32 | Financial analysts |
| Content | 30 | Writers & content creators |
| Business | 29 | Business operations |
| Domain_Specific | 19 | Healthcare, Legal, Research |
| Enterprise | 6 | Enterprise architecture & governance |
| Security | 6 | Security specialists |

---

## 🎯 Category Consolidations

### AI_ML (Merged from 3 categories)
- AI_Engineering
- Machine_Learning  
- Data_and_AI

### Development (Merged from 6 categories)
- Coding_Languages
- Developer
- DevOps
- Engineering
- Git
- Tools

### Content (Merged from 2 categories)
- Writing
- Content_Creators

### Domain_Specific (Merged from 4 categories)
- Healthcare
- Legal_Advisors
- Research
- Specialized

### Platform_Agents (Merged from 2 categories)
- Ax-Platform
- Gemini_Gems

### Assistants (Merged from 3 categories)
- Characters
- Lifestyle
- Other

---

## 📝 File Format

All agent files follow this format:

```markdown
---
title: "Agent Name"
tags: ["tag1", "tag2"]
category: "Agents"
subcategory: "AI_ML|Business|Development|etc."
---

# Agent Name

## Purpose
[What this agent does]

## Instructions
[System prompt / instructions]

## Output Format
[How the agent structures responses]

## Example
[Sample interaction]
```

---

## 🔍 Finding Agents

### By Development Role
- **Backend:** `Development/Backend/`
- **Frontend:** `Development/Frontend/`
- **DevOps:** `Development/DevOps/`
- **Infrastructure:** `Development/Infrastructure/`

### By Business Function
- **Marketing:** `Business/Marketing/`
- **Sales:** `Business/Sales/`
- **Operations:** `Business/Operations/`

### By Domain
- **Healthcare:** `Domain_Specific/Healthcare/`
- **Legal:** `Domain_Specific/Legal/`
- **Education:** `Domain_Specific/Education/`
- **Research:** `Domain_Specific/Research/`

---

## 🆕 What Changed

### Eliminated Categories
- ❌ AI_Engineering (merged into AI_ML)
- ❌ Machine_Learning (merged into AI_ML)
- ❌ Data_and_AI (merged into AI_ML)
- ❌ Coding_Languages (merged into Development)
- ❌ Developer (merged into Development)
- ❌ DevOps (merged into Development)
- ❌ Engineering (merged into Development)
- ❌ Git (merged into Development)
- ❌ Tools (merged into Development)
- ❌ Writing (merged into Content)
- ❌ Content_Creators (merged into Content)
- ❌ Characters (merged into Assistants)
- ❌ Lifestyle (merged into Assistants)
- ❌ Other (merged into Assistants)
- ❌ Specialized (merged into Domain_Specific)
- ❌ Healthcare (moved to Domain_Specific)
- ❌ Legal_Advisors (moved to Domain_Specific)
- ❌ Research (moved to Domain_Specific)
- ❌ Ax-Platform (moved to Platform_Agents)
- ❌ Gemini_Gems (moved to Platform_Agents)

### New Organization
- ✅ 10 clear categories
- ✅ Consistent naming
- ✅ Logical grouping
- ✅ No "Other" folder

---

## 📖 Related

- **Skills:** `../3_Skills/` - Reusable skill modules
- **Prompts:** `../4_Prompts/` - Prompt templates
- **Guides:** `../1_Guides/` - Tool documentation

---

**Migration Date:** March 31, 2026  
**Previous Structure:** `../Agents/` (archived)  
**Files Migrated:** 466
