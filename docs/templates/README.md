# Prompt Library Templates

This directory contains standardized templates for each type of content in the my-prompt-library project. Use these templates as a guide when creating new prompts, agents, skills, or system instructions.

## Available Templates

### 1. 📌 Prompt Library Template
**File:** `prompt-library-template.md`  
**Use for:** General-purpose prompts for AI assistants

This template is for traditional prompt engineering - creating reusable prompts that users can copy and paste into AI tools like ChatGPT, Claude, Gemini, etc.

**Key Features:**
- Standard frontmatter with tags, category, subcategory
- Title with emoji icon (📌)
- Purpose, instructions, output format sections
- Optional examples and tips
- Support for "featured" tag

**Example Subcategories:**
- Prompt_Library/Business/Marketing
- Prompt_Library/Engineering/Code_Review
- Prompt_Library/Writing/Content_Creation

---

### 2. 📋 Agent Instructions Template
**File:** `agent-instructions-template.md`  
**Use for:** Configuration guides and instructions for AI agents

This template documents how to configure and use AI coding assistants and agents (Claude Code, Codex, Cursor, etc.).

**Key Features:**
- Agent configuration settings (model, temperature, tools)
- Complete system prompt
- Workflow and procedures
- Example interactions
- Troubleshooting section
- Integration with other agents

**Example Subcategories:**
- Agent_Guides/Claude_Code/
- Agent_Guides/Codex/
- Agent_Guides/Cursor/

---

### 3. 🤖 Agents Template
**File:** `agents-template.md`  
**Use for:** Full agent definitions with behavior specs

This template defines complete autonomous agents with their capabilities, workflows, and communication protocols. These are full agent personas that can be instantiated.

**Key Features:**
- Agent name and description in frontmatter
- Multiple example use cases with context/user/assistant/commentary
- Tools and model specification
- Communication protocols (JSON examples)
- Phase-based workflows
- Progress tracking formats
- Integration points with other agents

**Example Categories:**
- Agents/Git/
- Agents/DevOps/
- Agents/Security/

---

### 4. 📝 System Prompts Template
**File:** `system-prompts-template.md`  
**Use for:** Complete LLM system instructions and platform configurations

This template documents the full system prompts used by AI platforms like v0.dev, Claude, ChatGPT, etc. These are comprehensive instruction sets that define how an AI system behaves.

**Key Features:**
- XML-style structured tags (`<system_info>`, `<capability>`, etc.)
- System identity and capabilities
- Response formatting rules
- Domain knowledge sections
- Citation and refusal guidelines
- Multiple interaction examples
- Constraints and limitations

**Example Subcategories:**
- System_Prompts/V0.Dev/
- System_Prompts/Claude/
- System_Prompts/ChatGPT/

---

### 5. 🔧 Skills Template
**File:** `skills-template.md`  
**Use for:** Reusable agent skills and tool integrations

This template defines specific skills that agents can use - usually involving external tools, CLIs, APIs, or specific workflows. Similar to OpenClaw skills or Claude Code slash commands.

**Key Features:**
- Skill name and description in frontmatter
- Prerequisites and setup instructions
- Usage examples with actual commands
- Configuration options
- Common workflows
- Troubleshooting section
- Integration with other skills
- Hooks configuration (if applicable)

**Example Categories:**
- Skills/Git/
- Skills/Docker/
- Skills/Cloud/

---

## Template Selection Guide

**Choose the right template based on:**

| If you're creating... | Use this template |
|----------------------|-------------------|
| A reusable prompt for ChatGPT/Claude | Prompt Library Template |
| Configuration docs for Claude Code | Agent Instructions Template |
| A complete autonomous agent persona | Agents Template |
| Full system instructions for an AI platform | System Prompts Template |
| A tool skill or CLI integration | Skills Template |

---

## Quick Start

### For Adding a New Prompt

1. **Copy the appropriate template:**
   ```bash
   cp docs/templates/prompt-library-template.md library/Prompt_Library/[Category]/[Subcategory]/your-prompt-name.md
   ```

2. **Update the frontmatter:**
   - Replace `[Your Prompt Title]` with actual title
   - Add 3-6 relevant tags
   - Set category and subcategory to match folder structure

3. **Fill in the content:**
   - Write clear purpose and instructions
   - Add examples if helpful
   - Replace all `[placeholder]` text

4. **Name the file correctly:**
   - Use lowercase with hyphens: `your-prompt-name.md`
   - Should match the content topic

5. **Test and validate:**
   - Check YAML frontmatter is valid
   - Verify file is in correct directory
   - Test the prompt with an AI assistant

### For Adding a New Agent

1. **Copy the agents template:**
   ```bash
   cp docs/templates/agents-template.md library/Agents/[Category]/agent-name.md
   ```

2. **Update the frontmatter:**
   - Set `name` (lowercase with hyphens)
   - Write comprehensive `description` with multiple examples
   - List required `tools`
   - Specify `model`

3. **Define the agent:**
   - Core responsibilities and workflow
   - Communication protocols
   - Integration points
   - Best practices

### For Adding a New Skill

1. **Create skill directory:**
   ```bash
   mkdir -p library/Skills/[Category]/[skill-name]
   cp docs/templates/skills-template.md library/Skills/[Category]/[skill-name]/SKILL.md
   ```

2. **Update the frontmatter:**
   - Set skill name (lowercase with hyphens)
   - Write one-sentence description with use cases
   - Add metadata fields
   - Configure hooks if needed

3. **Document the skill:**
   - Prerequisites and setup
   - Usage examples with real commands
   - Configuration options
   - Troubleshooting

---

## Icon Reference

Use these emojis at the start of titles based on content type:

- 📌 **Prompt Library** - General prompts
- 📋 **Agent Instructions** - Configuration guides
- 🤖 **Agents** - Full agent definitions
- 📝 **System Prompts** - LLM system instructions
- 🔧 **Skills** - Tool skills and integrations
- 🔐 **Security** - Security-related content
- 🚀 **DevOps** - CI/CD, deployment, infrastructure
- 💼 **Business** - Business-related prompts
- 🎨 **Design** - UI/UX, creative content
- 📊 **Analytics** - Data analysis, reporting

---

## Validation Checklist

Before committing new content, verify:

- [ ] Used the correct template for content type
- [ ] YAML frontmatter is valid (no syntax errors)
- [ ] All `[placeholders]` replaced with actual content
- [ ] File name is lowercase with hyphens
- [ ] File is in correct directory matching category/subcategory
- [ ] Title includes appropriate emoji icon
- [ ] Tags are relevant (3-6 recommended)
- [ ] Examples are concrete and actionable
- [ ] No sensitive information included
- [ ] Markdown formatting is correct
- [ ] Links work (if any)

---

## Directory Structure

Templates follow these directory patterns:

```
library/
├── Prompt_Library/              # General AI prompts
│   ├── [Category]/
│   │   └── [Subcategory]/
│   │       └── prompt-name.md
│
├── Agent_Guides/                # Agent configuration docs
│   └── [Agent_Platform]/
│       └── guide-name.md
│
├── Agents/                      # Full agent definitions
│   └── [Category]/
│       └── agent-name.md
│
├── System_Prompts/              # LLM system instructions
│   └── [Platform]/
│       └── system-name.md
│
└── Skills/                      # Reusable agent skills
    └── [Category]/
        └── [skill-name]/
            └── SKILL.md
```

---

## Examples in the Wild

Browse these existing prompts to see templates in action:

**Prompt Library:**
- `library/Prompt_Library/Ai_Development/Prompt_Engineering/prompt-generator.md`

**Agent Instructions:**
- `library/Agent_Guides/Claude_Code/flags-reference.md`

**Agents:**
- `library/Agents/Git/git-workflow-manager.md`

**System Prompts:**
- `library/System_Prompts/V0.Dev/v0.md`

**Skills:**
- `library/Skills/Git/gh-address-comments/SKILL.md`

---

## Additional Resources

- **Main Documentation:** See `docs/prompt-template-guide.md` for detailed formatting rules
- **Architecture:** See `docs/ARCHITECTURE.md` for project structure
- **Contributing:** See main `README.md` for contribution guidelines

---

## Need Help?

If you're unsure which template to use or how to structure content:

1. **Check existing examples** in the library that match your content type
2. **Review the full guide:** `docs/prompt-template-guide.md`
3. **Ask in issues** with the `documentation` label

---

**Last Updated:** March 28, 2026  
**Version:** 1.0
