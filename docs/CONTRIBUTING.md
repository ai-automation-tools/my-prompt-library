# Contributing Guide

Thank you for contributing to my-prompt-library! This guide will help you add high-quality content.

---

## Quick Start

1. **Choose content type** - Prompt, Agent Guide, Agent, System Prompt, or Skill?
2. **Use appropriate template** - See [templates/](templates/)
3. **Follow formatting rules** - See sections below
4. **Submit PR** - With clear description

---

## Content Types

We have 5 content categories, each with its own template:

| Type | Use For | Template |
|------|---------|----------|
| 📌 **Prompt Library** | General AI prompts | [template](templates/prompt-library-template.md) |
| 💻 **Agent Guides** | Platform documentation | [template](templates/agent-guides-template.md) |
| 🤖 **Agents** | Agent definitions | [template](templates/agents-template.md) |
| 📝 **System Prompts** | LLM instructions | [template](templates/system-prompts-template.md) |
| 🔧 **Skills** | Tool integrations | [template](templates/skills-template.md) |

See [templates/README.md](templates/README.md) for detailed usage guide.

---

## Required Metadata

**All content MUST include these 4 fields in frontmatter:**

```yaml
---
title: "📌 Your Title Here"        # Required: With emoji icon
tags: ["tag1", "tag2", "tag3"]    # Required: 3-6 keywords
category: "Category_Name"          # Required: Top-level category
subcategory: "Subcategory_Name"    # Required: Second-level category
---
```

### Field Rules

**1. `title`**
- Include emoji icon (📌 💻 🤖 📝 🔧)
- Quoted string
- Descriptive and clear
- Example: `"📌 Email Marketing Campaign"`

**2. `tags`**
- Array of 3-6 keywords
- Lowercase recommended
- No redundant tags (don't repeat category names)
- Example: `["email", "marketing", "b2b"]`

**3. `category`**
- Quoted string
- Must match folder structure
- Example: `"Prompt_Library"`, `"Agents"`, `"Skills"`

**4. `subcategory`**
- Quoted string
- Must match subfolder structure
- Example: `"Business"`, `"Git"`, `"Claude_Code"`

---

## File Naming

**Format:** lowercase with hyphens

✅ **Good:**
- `email-marketing-campaign.md`
- `git-workflow-manager.md`
- `claude-code-flags.md`

❌ **Bad:**
- `Email Marketing.md` (spaces, capitals)
- `emailMarketing.md` (camelCase)
- `prompt123.md` (not descriptive)

---

## Directory Structure

Place files in correct location based on category/subcategory:

```
library/
├── Prompt_Library/
│   └── [Category]/
│       └── [Subcategory]/
│           └── your-prompt.md
│
├── Agent_Guides/
│   └── [Platform]/
│       └── your-guide.md
│
├── Agents/
│   └── [Category]/
│       └── your-agent.md
│
├── System_Prompts/
│   └── [Platform]/
│       └── your-system.md
│
└── Skills/
    └── [Category]/
        └── [skill-name]/
            └── SKILL.md
```

---

## Writing Quality Content

### Be Specific
- Define clear purpose and use cases
- Provide concrete examples
- Include expected outcomes

### Use Placeholders
- Wrap replaceable content in `[brackets]`
- Example: `[Your company name]`, `[Target audience]`

### Structure Well
- Use headings for organization
- Break down complex tasks
- Number steps when order matters

### Add Examples
- Show real usage scenarios
- Demonstrate expected output
- Illustrate best practices

---

## Best Practices by Type

### 📌 Prompt Library
- Clear role definition for the AI
- Specific instructions and constraints
- Output format specification
- Example inputs/outputs

### 💻 Agent Guides
- Platform/tool overview
- Configuration steps
- Usage examples with commands
- Troubleshooting section

### 🤖 Agents
- Multiple use case examples
- Tools and model specification
- Communication protocols
- Integration points

### 📝 System Prompts
- Complete system identity
- Capabilities and constraints
- Response formatting rules
- Multiple examples

### 🔧 Skills
- Prerequisites and setup
- Usage examples with real commands
- Configuration options
- Troubleshooting guide

---

## Validation Checklist

Before submitting, verify:

- [ ] Used correct template for content type
- [ ] All 4 required metadata fields present
- [ ] Title includes appropriate emoji icon
- [ ] Tags are relevant (3-6)
- [ ] File name is lowercase with hyphens
- [ ] File is in correct directory
- [ ] Category/subcategory match folders
- [ ] All `[placeholders]` are clear
- [ ] Examples are concrete and helpful
- [ ] No sensitive information included
- [ ] Markdown formatting is correct
- [ ] Tested with AI assistant (for prompts)

---

## Submission Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b add-[content-name]
   ```
3. **Add your content** using appropriate template
4. **Test locally** if applicable
5. **Commit with clear message**
   ```bash
   git commit -m "Add [content-type]: [brief description]"
   ```
6. **Push to your fork**
7. **Open Pull Request** with:
   - Clear title
   - Description of content
   - Why it's valuable
   - Any relevant links

---

## Common Mistakes

### ❌ Invalid YAML
```yaml
title: Missing Quotes
tags: [no, quotes]
```
**Fix:** Always quote strings

### ❌ Wrong Directory
File: `library/Agents/Marketing/email-agent.md`  
Metadata: `category: "Marketing"`

**Fix:** Category should be `"Agents"`, subcategory should be `"Marketing"`

### ❌ Missing Icon
```yaml
title: "My Prompt"  # Missing emoji
```
**Fix:** `title: "📌 My Prompt"`

### ❌ Poor Tags
```yaml
tags: ["prompt", "content", "text"]  # Too generic
```
**Fix:** `tags: ["email", "marketing", "b2b"]` (specific and useful)

---

## Need Help?

- **Templates:** See [templates/README.md](templates/README.md)
- **Examples:** Browse existing content in [library/](../library/)
- **Questions:** Open an issue with `question` label
- **Feedback:** Open an issue with `feedback` label

---

## Code of Conduct

- Be respectful and constructive
- Provide helpful feedback
- Focus on content quality
- Credit sources when applicable
- No spam or low-effort content

---

**Thank you for contributing! 🎉**
