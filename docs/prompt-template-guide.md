# Prompt Template & Formatting Guide

**Version:** 2.0  
**Last Updated:** March 13, 2026

## Overview

This guide defines the standard format for all prompts in the my-prompt-library. Following this template ensures consistency, proper rendering in the UI, and accurate categorization.

---

## Prompt File Structure

Every prompt `.md` file must follow this structure:

```markdown
---
title: "Your Prompt Title"
tags: ["tag1", "tag2", "tag3"]
category: "Category_Name"
subcategory: "Subcategory_Name"
---

# Your Prompt Title

## Purpose
[Brief description of what this prompt does]

## Instructions
[The actual prompt content that will be copied/used]

## Output Format
[Optional: Specify the expected output format]

## Example
[Optional: Provide an example of expected output]
```

---

## YAML Frontmatter (Required)

The frontmatter is the metadata section at the top of the file, enclosed by `---`.

### Required Fields

#### `title`
- **Type:** String (quoted)
- **Description:** Human-readable name for the prompt
- **Format:** Title case recommended
- **Example:** `"Email Marketing Campaign Planning"`

#### `tags`
- **Type:** Array of strings
- **Description:** Keywords for filtering and search
- **Format:** Lowercase, kebab-case for multi-word tags
- **Limit:** 3-6 tags recommended
- **Example:** `["email", "marketing", "campaign", "planning"]`
- **Empty allowed:** `[]` if no tags

#### `category`
- **Type:** String (quoted)
- **Description:** Top-level category (maps to folder structure)
- **Format:** Title case, underscores for spaces
- **Example:** `"Business"`, `"AI_Tools"`, `"Engineering"`

#### `subcategory`
- **Type:** String (quoted)
- **Description:** Second-level category (maps to subfolder)
- **Format:** Title case, underscores for spaces
- **Example:** `"Marketing"`, `"Claude_Code"`, `"Architecture"`

---

## File Naming Convention

### Required Format
- **Lowercase only**
- **Hyphens instead of spaces** (`-`)
- **Descriptive and concise**
- **`.md` extension**

### Examples
✅ **Good:**
- `email-marketing-campaign.md`
- `code-review-agent.md`
- `api-design.md`

❌ **Bad:**
- `Email Marketing Campaign.md` (spaces, capitals)
- `EmailMarketingCampaign.md` (camelCase)
- `prompt1.md` (not descriptive)

---

## Directory Structure

Prompts are organized by category and subcategory:

```
prompts/
├── Collections/           # Main comprehensive library
│   ├── Business/
│   │   ├── Marketing/
│   │   │   ├── email-marketing-campaign.md
│   │   │   └── digital-marketing-strategy.md
│   │   └── Finance/
│   └── Engineering/
│       └── Architecture/
└── My_Prompts/           # Manually curated favorites
    └── [same structure as Collections]
```

**Rules:**
1. `category` field must match the first folder level
2. `subcategory` field must match the second folder level
3. Create new folders as needed for new categories
4. Use underscores (`_`) in folder names for multi-word categories

---

## Content Sections

### 1. Title Heading (Optional but Recommended)
```markdown
# Your Prompt Title
```
- Should match the `title` field in frontmatter
- H1 heading (`#`)
- Improves readability in file browsers

### 2. Purpose (Optional)
```markdown
## Purpose
Brief description of what this prompt does and when to use it.
```

### 3. Instructions (Required)
```markdown
## Instructions
The actual prompt content that users will copy and use with AI assistants.
```
- This is the core content
- Can include placeholders in `[brackets]` for user customization
- Should be clear, specific, and actionable

### 4. Output Format (Optional)
```markdown
## Output Format
Specify how the AI should structure its response.
```

### 5. Example (Optional)
```markdown
## Example
Provide a sample output to illustrate the expected result.
```

---

## Best Practices

### Writing Effective Prompts

1. **Be Specific**
   - Define the AI's role clearly
   - Specify the desired output format
   - Include constraints or requirements

2. **Use Placeholders**
   - Wrap user-replaceable content in `[brackets]`
   - Example: `[Your target audience]`, `[Product name]`

3. **Structure Complex Prompts**
   - Use headings, lists, and sections
   - Break down multi-step tasks
   - Number steps when order matters

4. **Include Context**
   - Explain what makes a good result
   - Provide examples when helpful
   - Specify tone, style, or voice

### Tagging Guidelines

**Good Tags:**
- Descriptive and specific: `email`, `marketing`, `campaign`
- Functional: `automation`, `planning`, `analysis`
- Domain-specific: `cybersecurity`, `finance`, `ai-agents`

**Avoid:**
- Overly generic tags: `prompt`, `text`, `content`
- Redundant tags: if category is "Marketing", don't tag `marketing`
- Too many tags: 3-6 is ideal

### Category Selection

**Main Categories:**
- `Business` - Business operations, planning, marketing
- `Engineering` - Software development, architecture, DevOps
- `Finance` - Financial analysis, budgeting, investing
- `AI_Tools` - AI assistants, agents, LLM tools
- `Writing` - Content creation, documentation, copywriting
- `IT` - IT operations, infrastructure, security
- And more...

**Creating New Categories:**
- Use when existing categories don't fit
- Choose clear, distinct names
- Create folder structure to match

---

## Template Examples

### Minimal Template
```markdown
---
title: "Quick Task Prompt"
tags: ["productivity", "task"]
category: "General"
subcategory: "Productivity"
---

Act as a productivity assistant and help me break down this task:

[Describe your task here]

Provide:
1. Subtasks in priority order
2. Estimated time for each
3. Potential blockers
```

### Comprehensive Template
```markdown
---
title: "Advanced AI Agent Prompt"
tags: ["ai-agent", "automation", "workflow"]
category: "AI_Tools"
subcategory: "Agent_Development"
---

# Advanced AI Agent Prompt

## Purpose
Design a sophisticated AI agent that can autonomously handle complex workflows with decision-making capabilities.

## Instructions
You are an expert AI agent architect. Based on the following requirements, design a comprehensive AI agent system:

### Requirements
- **Primary Goal:** [Define the main objective]
- **Constraints:** [List any limitations or boundaries]
- **Tools Available:** [APIs, databases, services the agent can use]
- **Decision Criteria:** [How should the agent make choices]

### Please Provide

#### 1. Agent Architecture
- Core responsibilities and capabilities
- Decision-making framework
- Error handling and fallback strategies

#### 2. Workflow Design
- Step-by-step process flow
- Trigger conditions
- Success/failure criteria

#### 3. Integration Points
- External systems and APIs
- Data flow and transformation
- Authentication and security

#### 4. Monitoring & Optimization
- Key performance indicators
- Logging and observability
- Continuous improvement mechanisms

## Output Format
Provide a detailed agent specification in markdown format with:
- Clear section headings
- Code snippets where applicable
- Mermaid diagrams for workflows (optional)

## Example
[Provide a sample agent design for a specific use case]
```

---

## Validation Checklist

Before committing a new prompt, verify:

- [ ] YAML frontmatter is valid (no syntax errors)
- [ ] `title` is descriptive and in quotes
- [ ] `tags` array has 3-6 relevant tags
- [ ] `category` matches the folder structure
- [ ] `subcategory` matches the folder structure
- [ ] File name is lowercase with hyphens
- [ ] File is in the correct directory path
- [ ] Prompt content is clear and actionable
- [ ] Placeholders use `[bracket]` format
- [ ] No sensitive or private information included

---

## Common Mistakes to Avoid

### ❌ Invalid YAML
```markdown
---
title: Missing Quotes
tags: [no, quotes, either]
---
```
**Fix:** Always quote strings and use proper array syntax

### ❌ Wrong Category Path
```markdown
---
category: "Marketing"
subcategory: "Email"
---
```
File location: `prompts/Collections/Business/Marketing/`

**Fix:** Category should be `"Business"`, not `"Marketing"`

### ❌ Poor File Naming
```markdown
My Cool Prompt.md
```
**Fix:** `my-cool-prompt.md`

### ❌ Missing Frontmatter
```markdown
# Just a Title

Some prompt content...
```
**Fix:** Always include the YAML frontmatter block

---

## Advanced Features

### Variables in Prompts
Use placeholders for customization:
```markdown
For [COMPANY_NAME], create a [CAMPAIGN_TYPE] targeting [AUDIENCE_SEGMENT]...
```

### Multi-Step Prompts
Structure complex prompts with numbered steps:
```markdown
1. First, analyze [INPUT]
2. Then, generate [OUTPUT_TYPE]
3. Finally, validate against [CRITERIA]
```

### Conditional Logic
Include decision branches:
```markdown
If [CONDITION_A]:
  - Do X

If [CONDITION_B]:
  - Do Y

Otherwise:
  - Do Z
```

---

## Resources

- **Example Prompts:** Browse `prompts/Collections/` for real-world examples
- **Category List:** See folder structure in `prompts/Collections/`
- **UI Preview:** Test how your prompt appears in the app
- **Markdown Guide:** [CommonMark Spec](https://commonmark.org/)

---

## Getting Help

**Issues:**
- Formatting errors: Check YAML syntax at [yamllint.com](https://www.yamllint.com/)
- Category questions: Review existing folder structure
- Content guidance: Study highly-rated prompts in Collections

**Questions:**
Open an issue in the repository with the `prompt-template` label.

---

**Maintained by:** OpenClaw AI Assistant  
**Documentation Version:** 2.0  
**Last Updated:** March 13, 2026
