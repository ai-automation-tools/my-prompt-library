# 4_Prompts - Prompt Templates & Examples

**Last Updated:** March 31, 2026  
**Status:** ✅ Reorganized (Phase 4 complete)

---

## 📂 Directory Structure

This directory contains prompt templates, collections, and examples for various domains and use cases.

### Categories (8 total)

```
4_Prompts/
├── AI_ML/                  # AI & Machine Learning prompts
├── Business/               # Business operations & strategy
├── Development/            # Software development & engineering
├── Security/               # Security & compliance
├── Content/                # Content creation & writing
├── Finance/                # Financial analysis & planning
├── Media/                  # Images, Video, Social Media
└── Domain_Specific/        # Education, Legal, etc.
```

---

## 📊 Statistics

- **Total Files:** 478
- **Categories:** 8 (reduced from 14)
- **Reduction:** 43%

### Files by Category

| Category | Files | Description |
|----------|-------|-------------|
| AI_ML | 128 | AI development, tools, prompts |
| Business | 114 | Marketing, operations, strategy |
| Development | 99 | Software engineering, architecture |
| Media | 44 | Images, video, social media |
| Content | 35 | Writing, documentation |
| Domain_Specific | 26 | Education, legal, healthcare |
| Finance | 17 | Financial analysis, modeling |
| Security | 1 | Security prompts |

---

## 🎯 Category Consolidations

### AI_ML (Merged from 3 categories)
- Ai_Development
- Ai_Tools
- Other (AI-related)

### Development (Merged from 2 categories)
- It_&_Engineering
- MCP_Servers

### Content (Renamed from 1 category)
- Writing

### Media (Merged from 3 categories)
- Images
- Video
- Social_Media

### Domain_Specific (Merged from 2 categories)
- Education
- Legal_Compliance

---

## 📝 File Format

Prompts follow a consistent format:

```markdown
---
title: "Prompt Name"
tags: ["tag1", "tag2"]
category: "Prompts"
subcategory: "AI_ML|Business|Development|etc."
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

## 🔍 Finding Prompts

### By Development Area
- **Architecture:** `Development/Architecture/`
- **Code Generation:** `Development/Code_Generation/`
- **API Design:** `Development/API_Design/`
- **Testing:** `Development/Testing/`

### By Business Function
- **Marketing:** `Business/Marketing/`
- **Sales:** `Business/Sales/`
- **Operations:** `Business/Operations/`
- **Strategy:** `Business/Strategy/`

### By Media Type
- **Image Generation:** `Media/Images/`
- **Video Creation:** `Media/Video/`
- **Social Media:** `Media/Social_Media/`

### By Domain
- **Education:** `Domain_Specific/Education/`
- **Legal:** `Domain_Specific/Legal/`

---

## 🆕 What Changed

### Eliminated Categories
- ❌ Ai_Development (renamed to AI_ML)
- ❌ Ai_Tools (merged into AI_ML)
- ❌ It_&_Engineering (renamed to Development)
- ❌ Writing (renamed to Content)
- ❌ Images (moved to Media/Images)
- ❌ Video (moved to Media/Video)
- ❌ Social_Media (moved to Media/Social_Media)
- ❌ Education (moved to Domain_Specific/Education)
- ❌ Legal_Compliance (moved to Domain_Specific/Legal)
- ❌ MCP_Servers (merged into Development)
- ❌ Other (distributed to appropriate categories)

### New Organization
- ✅ 8 clear categories (down from 14)
- ✅ Consistent naming (AI_ML, not Ai_Development)
- ✅ Logical grouping (Media consolidates visual content)
- ✅ No "Other" folder

---

## 🎯 Usage

### Finding the Right Prompt

1. **Identify your domain:**
   - Technical work → `Development/` or `AI_ML/`
   - Business tasks → `Business/`
   - Creative content → `Content/` or `Media/`
   - Specialized fields → `Domain_Specific/`

2. **Browse subcategories:**
   - Each category has logical subcategories
   - Use descriptive file names to identify prompts

3. **Customize as needed:**
   - Replace variables in `[brackets]`
   - Adjust tone and style
   - Add domain-specific context

---

## 📖 Related

- **Agents:** `../2_Agents/` - Agent personas & instructions
- **Skills:** `../3_Skills/` - Reusable skill modules
- **Guides:** `../1_Guides/` - Tool documentation
- **System_Prompts:** `../System_Prompts/` - Platform system prompts

---

## 💡 Tips

### Creating Effective Prompts

1. **Be Specific:** Clear, detailed instructions yield better results
2. **Provide Context:** Background helps the AI understand intent
3. **Use Examples:** Show what good output looks like
4. **Iterate:** Refine prompts based on results
5. **Version Control:** Track what works for reuse

### Prompt Engineering Best Practices

- Start with a clear goal
- Break complex tasks into steps
- Specify output format
- Include constraints and requirements
- Test with edge cases

---

## 🔄 Maintenance

### Adding New Prompts

1. Choose the appropriate category
2. Follow the standard file format
3. Include proper frontmatter
4. Add examples and tips
5. Update this README if adding a new subcategory

### Updating Existing Prompts

- Document changes in git commits
- Preserve backward compatibility where possible
- Note version or date in the file
- Test updated prompts before committing

---

**Migration Date:** March 31, 2026  
**Previous Structure:** `../Prompt_Library/` (archived)  
**Files Migrated:** 478
