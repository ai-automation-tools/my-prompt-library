---
name: style-guide
description: "Create and enforce writing style guides covering voice, tone, terminology, formatting conventions, and editorial rules for consistent documentation. Use when establishing or applying writing standards across a team or project. Also trigger for 'style guide', 'voice and tone', 'writing standards', 'editorial guidelines', 'terminology glossary', 'content standards', or 'brand voice'."
---

# Style Guide — Voice, Tone & Editorial Standards

Create and maintain style guides that enforce consistent writing across teams, products, and documentation sets.

## When to Use This Skill

**USE when:**
- Creating a new style guide for a product, team, or company
- Auditing existing content for style consistency
- Defining voice, tone, and terminology standards
- Establishing formatting and structural conventions
- Onboarding writers to an existing style guide

**DON'T USE when:**
- Writing the actual content → use `/technical-writing`, `/copywriting`, etc.
- Removing AI patterns → use `/humanizer`
- Building document templates → use `documentation-templates`

## Step 1: Voice & Tone

### Voice (Permanent — Who You Are)

```
Voice is your brand's PERSONALITY. It doesn't change by context.

DEFINING YOUR VOICE:
  Answer these questions:
  1. If your product were a person, how would they speak?
  2. What 3 adjectives describe your communication style?
  3. What words would you NEVER use?

VOICE SPECTRUM:
  Formal ←——————→ Casual
  Corporate ←———→ Conversational
  Technical ←———→ Accessible
  Authoritative ←→ Collaborative
  Serious ←———→ Playful

EXAMPLE VOICE DEFINITION:
  "We're the knowledgeable friend who happens to be an expert.
  We're confident without being condescending, helpful without
  being patronizing, and clear without oversimplifying."

  ✓ "Here's how to set up your database in 5 minutes."
  ✗ "In this section, we shall endeavor to elucidate the database
     configuration procedure."
  ✗ "OMG setting up a database is SO easy, you're gonna love this!!"
```

### Tone (Variable — How You Adapt)

```
Tone SHIFTS based on context. Same voice, different situations.

| Context | Tone Shift | Example |
|---------|-----------|---------|
| **Onboarding** | Warm, encouraging | "Welcome! Let's get you set up." |
| **Error message** | Calm, helpful | "Something went wrong. Here's how to fix it." |
| **Security alert** | Direct, serious | "Action required: your API key was exposed." |
| **Release notes** | Excited, informative | "You asked, we built it. Here's what's new." |
| **Docs** | Clear, neutral | "The timeout parameter accepts values from 1-300." |
| **Apology** | Honest, accountable | "We messed up. Here's what happened and what we're doing." |

TONE SHOULD NEVER:
  ✗ Blame the user ("You entered the wrong password")
  ✓ State the fact ("That password doesn't match our records")
  ✗ Be sarcastic in error states
  ✗ Be overly cheerful about serious issues
  ✗ Shift so far from your voice that it feels like a different brand
```

## Step 2: Word List & Terminology

### Building a Terminology Glossary

```markdown
## Terminology Standards

### Product Terms
| Term | Use | Don't Use | Notes |
|------|-----|-----------|-------|
| workspace | Always lowercase | Workspace, work space | Our core unit |
| API key | Capitalize API, lowercase key | api key, API Key | |
| dashboard | Lowercase unless starting sentence | Dashboard | |
| sign in | Two words (verb) | login, log in, signin | "Sign-in" as adjective |
| set up | Two words (verb) | setup | "Setup" only as noun/adj |

### Industry Terms
| Term | Our Usage | Notes |
|------|----------|-------|
| cloud | Lowercase | Not capitalized unless brand name |
| open source | No hyphen (noun/adj) | "Open-source" only before a noun per some guides |
| real time | Two words (noun), "real-time" (adj) | Context-dependent |
| email | No hyphen, no capital | Not "e-mail" or "Email" |

### Banned Words
| Don't Use | Use Instead | Why |
|-----------|------------|-----|
| simply/just | [delete] | Dismissive of difficulty |
| obviously | [delete] | What's obvious to you isn't to the reader |
| leverage | use | Jargon |
| utilize | use | Unnecessarily complex |
| please | [delete from instructions] | Docs aren't a conversation |
| Note: | [use a callout if important] | Overused; breaks flow |
| easy/simple | [delete or be specific] | Subjective; frustrating if they struggle |
```

## Step 3: Grammar & Mechanics

### Standard Rules

```markdown
## Grammar Decisions (Pick One, Be Consistent)

### Oxford Comma
**Decision:** [Yes / No]
Example (Yes): "APIs, SDKs, and libraries"
Example (No):  "APIs, SDKs and libraries"

### Sentence Case vs. Title Case (Headings)
**Decision:** [Sentence case / Title Case]
Sentence case: "How to set up your account"
Title case:    "How to Set Up Your Account"

### Numbers
- Spell out one through nine; use numerals for 10+
- Always use numerals with units: "3 seconds", "5 MB"
- Use commas in thousands: 1,000 / 10,000 / 1,000,000
- Use "K" and "M" for casual contexts: "10K users"

### Punctuation
- Periods inside quotation marks (US) or outside (UK): [choose]
- No period at the end of bullet points that aren't complete sentences
- Period at the end of bullet points that are complete sentences
- Em dash with no spaces: "The result—a faster system—was clear"
- No exclamation marks in documentation (one per page max in marketing)

### Capitalization
- Product names: always as branded (e.g., "GitHub" not "Github")
- Features: lowercase unless proper noun ("the dashboard", not "the Dashboard")
- Job titles: capitalize before name, lowercase after ("CEO Jane Smith" / "Jane Smith, the CEO")
```

## Step 4: Formatting Standards

### Structural Rules

```markdown
## Formatting Standards

### Headings
- Use sentence case for all headings
- Maximum 3 levels of nesting (H1, H2, H3 — avoid H4+)
- Headings must be descriptive: "Configure authentication" not "Configuration"
- Never skip heading levels (H1 → H3 without H2)

### Lists
- Use numbered lists for sequential steps (order matters)
- Use bullet points for non-sequential items (order doesn't matter)
- Keep list items parallel in structure
  ✓ "Install the CLI. Configure your account. Deploy your app."
  ✗ "Installing the CLI. You need to configure. Deployment."
- Maximum 7-9 items in a list; group if more

### Code
- Use inline code for: commands, file names, parameter names, values
- Use code blocks for: multi-line code, configuration, terminal output
- Always specify the language in code blocks: ```python, ```bash, ```json
- Code examples must be copy-pasteable and working

### Links
- Use descriptive link text: [Learn about authentication](url)
- Never use: [click here](url) or [this page](url)
- External links should open in a new tab (where supported)

### Images
- Every image needs alt text (accessibility)
- Annotate screenshots with callouts for clarity
- Maintain consistent image widths within a document
- Use SVG or high-resolution PNG for diagrams

### Tables
- Use tables for structured comparison data, not for layout
- Left-align text, right-align numbers
- Include header row; bold if supported
- Sort by the most useful column
```

## Step 5: Content Patterns

### Standard Content Patterns

```markdown
## Content Patterns

### Callouts / Admonitions
Use consistently across all docs:

> **Note:** Supplementary information that adds context.

> **Tip:** Optional advice that improves the experience.

> **Important:** Information the reader must know to succeed.

> **Warning:** Something that could cause data loss, cost money,
> or break their setup if ignored.

### Prerequisite Blocks
Always placed before the first step:

**Before you begin:**
- [Requirement with link to setup guide]
- [Requirement]
- [Required access level or permissions]

### Next Steps
Always end task-based content with actionable links:

**Next steps:**
- [Natural follow-on task with link]
- [Related concept to learn with link]
- [Reference material for deeper understanding]
```

## Step 6: Style Guide Template

### Complete Style Guide Outline

```markdown
# [Company/Product] Writing Style Guide

## 1. Voice & Tone
- Voice definition (3 adjectives + "we are / we aren't" spectrum)
- Tone variations by context (table)
- Example passages showing voice in action

## 2. Audience
- Primary audience persona(s)
- What we assume they know / don't know
- How we adjust for expertise levels

## 3. Terminology
- Product glossary (terms + correct usage)
- Industry terms (our conventions)
- Banned words list (with alternatives)

## 4. Grammar & Mechanics
- Oxford comma decision
- Heading case decision
- Number formatting
- Punctuation conventions
- Capitalization rules

## 5. Formatting
- Heading hierarchy and rules
- List conventions
- Code formatting
- Link text standards
- Image/screenshot guidelines
- Table formatting

## 6. Content Patterns
- Callout types and when to use each
- Prerequisite blocks
- Next steps format
- Error message format

## 7. Examples
- Before/after rewrites showing style guide applied
- Template passages for common content types

## 8. Review Checklist
- Checklist reviewers use to verify style compliance
```

## Style Audit Process

```
AUDITING EXISTING CONTENT:

1. SELECT 5-10 representative pages across content types
2. CHECK each page against the style guide:
   □ Voice and tone consistent?
   □ Terminology matches glossary?
   □ Formatting follows standards?
   □ Grammar rules applied?
   □ Content patterns used correctly?
3. CATEGORIZE issues:
   - Systematic (appears everywhere → update templates)
   - One-off (single page → fix individually)
4. PRIORITIZE: High-traffic pages first
5. FIX in batches, not all at once
6. AUTOMATE: Use linters (Vale, textlint) for enforceable rules
```

## Output

Save style guide to `artifacts/style-guide/[company-or-project]-style-guide.md`

## Guidelines

- **A style guide nobody reads is useless** — keep it short, searchable, and linked from writing tools
- Start small — voice, terminology, and 10 formatting rules. Expand as questions arise.
- Automate what you can (Vale, textlint, custom linters) — human review catches what tools miss
- Update the style guide when you make a decision — don't let tribal knowledge accumulate
- Show examples, not just rules — "don't use passive voice" is abstract; a before/after is concrete
- Use `/technical-writing` for the principles behind the rules
- Use `/humanizer` to audit content for AI-generated patterns
- Use `documentation-templates` for structural patterns to complement the style guide
