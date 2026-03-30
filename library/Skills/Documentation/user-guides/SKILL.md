---
name: user-guides
description: "Write end-user documentation including tutorials, how-to guides, walkthroughs, onboarding flows, and feature documentation. Use when creating documentation for non-technical or semi-technical end users. Also trigger for 'user guide', 'tutorial', 'how-to', 'walkthrough', 'onboarding docs', 'help article', 'user manual', or 'getting started guide'."
---

# User Guides — Tutorials, How-Tos & Walkthroughs

Write user-facing documentation that helps people accomplish goals — from onboarding tutorials to task-based how-tos to feature deep dives.

## When to Use This Skill

**USE when:**
- Writing step-by-step tutorials for end users
- Creating how-to guides for specific tasks
- Documenting onboarding/first-time user experience
- Writing feature documentation or product guides
- Building in-app help content or tooltips

**DON'T USE when:**
- Writing API/developer docs → use `/api-documentation`
- Building a help center/FAQ → use `/knowledge-base`
- Writing internal technical docs → use `/technical-writing`

## The Four Types of User Documentation

### Diataxis Framework Applied

```
                    LEARNING                    WORKING
                 (studying)                  (doing a task)
              ┌──────────────┐          ┌──────────────┐
  PRACTICAL   │  TUTORIAL    │          │  HOW-TO      │
  (steps)     │              │          │  GUIDE       │
              │ "Learn to    │          │ "Do this     │
              │  make X"     │          │  specific    │
              │              │          │  thing"      │
              └──────────────┘          └──────────────┘
              ┌──────────────┐          ┌──────────────┐
  THEORETICAL │ EXPLANATION  │          │  REFERENCE   │
  (knowledge) │              │          │              │
              │ "Understand  │          │ "Look up     │
              │  how X works"│          │  this detail"│
              │              │          │              │
              └──────────────┘          └──────────────┘

Each type has different rules. Don't mix them.
```

## Step 1: Tutorials (Learning-Oriented)

### Tutorial Template

```markdown
# Tutorial: [Build/Create/Set Up] Your First [Thing]

In this tutorial, you'll [specific outcome] by [high-level actions].
By the end, you'll have [concrete deliverable].

**Time:** ~[X] minutes
**Prerequisites:** [what they need before starting]
**What you'll learn:**
- [Skill/concept 1]
- [Skill/concept 2]
- [Skill/concept 3]

---

## Step 1: [Action Verb] [Object]

[1-2 sentences of context — why this step matters]

[Exact instruction with screenshot or code if needed]

[Expected result — what they should see after completing this step]

> **Checkpoint:** [How they know they did it right]

## Step 2: [Action Verb] [Object]

[Continue pattern...]

---

## What You Built

[Summary of what they accomplished — reinforce the learning]

[Screenshot or description of the final result]

## Next Steps
- [Natural follow-on tutorial]
- [Related how-to for extending what they built]
- [Link to reference for deeper understanding]
```

### Tutorial Rules

```
THE TUTORIAL PROMISE: If the reader follows every step exactly,
they WILL succeed. No exceptions.

✓ Test the tutorial end-to-end before publishing (every time)
✓ Start from a blank state — don't assume prior setup
✓ Show EVERY click, command, and input — no "then configure it"
✓ Include checkpoints ("You should now see...") after each step
✓ Provide the expected output for every action
✓ Use screenshots for UI steps, code blocks for CLI steps
✓ Keep steps small — one action per step, not three

✗ Don't explain theory — save that for Explanations
✗ Don't offer choices — make decisions for the reader
✗ Don't skip "obvious" steps — obvious to you, not to them
✗ Don't combine tutorial + reference — they serve different needs
✗ Don't go longer than 20 steps — break into a series if needed
```

## Step 2: How-To Guides (Task-Oriented)

### How-To Template

```markdown
# How to [Accomplish Specific Task]

[1 sentence describing what this guide covers and when you'd need it]

## Prerequisites
- [Requirement 1 — with link to tutorial if needed]
- [Requirement 2]

## Steps

### 1. [Action]
[Instruction]

### 2. [Action]
[Instruction]

### 3. [Action]
[Instruction]

## Verify
[How to confirm the task was completed successfully]

## Common Issues
- **[Problem]:** [Solution]
- **[Problem]:** [Solution]

## Related
- [Link to related how-to]
- [Link to relevant reference]
```

### How-To vs. Tutorial

| | Tutorial | How-To Guide |
|---|---------|-------------|
| **Reader** | Beginner | Has basic knowledge |
| **Goal** | Learn a skill | Complete a task |
| **Choices** | Author decides everything | Reader may choose options |
| **Scope** | Complete journey | Focused single task |
| **Theory** | Minimal | None — just the steps |
| **Length** | 10-20 steps | 3-8 steps |
| **Example** | "Build your first dashboard" | "How to export data as CSV" |

## Step 3: Feature Documentation

### Feature Doc Template

```markdown
# [Feature Name]

[1-2 sentence description of what this feature does and who it's for]

[Screenshot or GIF showing the feature in action]

## Overview
[2-3 paragraphs explaining the feature: what it does, why it exists,
and when to use it]

## How It Works

### [Sub-feature or mode 1]
[Description with screenshot]
[Step-by-step if interaction is required]

### [Sub-feature or mode 2]
[Description with screenshot]

## Configuration / Settings
| Setting | Description | Default | Options |
|---------|-------------|---------|---------|
| [name] | [what it controls] | [default] | [valid values] |

## Examples

### Example 1: [Common use case]
[Walk through the use case with screenshots]

### Example 2: [Advanced use case]
[Walk through with more complexity]

## Limitations
- [Known limitation 1]
- [Known limitation 2]

## FAQ
**Q: [Common question]**
A: [Answer]

## Related Features
- [Feature that works well with this one]
```

## Step 4: Onboarding Documentation

### First-Time User Experience (FTUE) Guide

```markdown
# Getting Started with [Product]

Welcome! This guide walks you through setting up [Product] and
completing your first [key action] in under [X] minutes.

## Step 1: Create Your Account
[Signup process with screenshots]

## Step 2: Complete Your Profile
[What information to provide and why]

## Step 3: [First Key Action]
[The single most valuable thing they can do immediately]

## Step 4: [Explore Key Feature]
[Guide them to the feature most users find valuable]

## What's Next?
Choose your path:
- **[Role A]?** → [Guide for that role]
- **[Role B]?** → [Guide for that role]
- **Want to explore?** → [Feature overview]
```

### Onboarding Principles

```
THE 5-MINUTE RULE:
  Users should experience the product's core value within 5 minutes.
  If onboarding takes longer, cut steps — not explanation, steps.

PROGRESSIVE DISCLOSURE:
  Show users what they need NOW, not everything they'll ever need.
  Day 1: Create account → first action → see value
  Week 1: Explore features → customize settings
  Month 1: Advanced features → integrations → team setup

CELEBRATE PROGRESS:
  After each onboarding step, confirm what they accomplished.
  "You just created your first project. Here's what you can do next."
  → Momentum and confidence matter more than completeness.
```

## Step 5: Writing for Non-Technical Users

### Language Rules

```
AVOID:                              USE INSTEAD:
─────                               ──────────
"Configure the parameters"          "Change the settings"
"Execute the workflow"              "Run the workflow"
"The system will propagate..."      "The changes will appear in..."
"Instantiate a new object"          "Create a new item"
"Authenticate your credentials"     "Sign in"
"Leverage this functionality"       "Use this feature"
"Navigate to the endpoint"          "Go to the page"
"Toggle the boolean flag"           "Turn this on or off"
```

### Screenshot Guidelines

```
WHEN TO USE SCREENSHOTS:
  ✓ UI has changed and text alone is ambiguous
  ✓ Multiple similar buttons/options — highlight the right one
  ✓ Complex forms or multi-panel interfaces
  ✓ Final result — "you should see this"

WHEN NOT TO USE SCREENSHOTS:
  ✗ Simple text inputs ("type your name" doesn't need a screenshot)
  ✗ Standard OS dialogs (file picker, save dialog)
  ✗ Every single step (causes screenshot fatigue)

SCREENSHOT RULES:
  ✓ Annotate with arrows, circles, or numbered callouts
  ✓ Crop to the relevant area — don't show the entire screen
  ✓ Use consistent sizing and style across all screenshots
  ✓ Include alt text for accessibility
  ✓ Update screenshots when the UI changes (this is the hardest part)
  ✗ Don't include personal data, email addresses, or real user info
```

## Step 6: Maintenance & Quality

### Documentation Freshness Checklist

```
MONTHLY:
  □ Are all screenshots current? (UI may have changed)
  □ Do all links work? (broken link check)
  □ Are steps still accurate? (test the top 5 guides)

QUARTERLY:
  □ Review analytics — which guides have high bounce rates?
  □ Check support tickets — are users asking questions the docs should answer?
  □ Update for new features added since last review

PER RELEASE:
  □ Update guides affected by this release
  □ Add guides for new features
  □ Update screenshots for changed UI
  □ Update onboarding if the flow changed
```

### Quality Signals

| Signal | Good | Bad |
|--------|------|-----|
| **Support tickets** | Decreasing after doc publish | Increasing despite docs |
| **Completion rate** | Users finish the tutorial | Users drop off at step 3 |
| **Time on page** | Matches expected task time | Too short (bounced) or too long (stuck) |
| **Search terms** | Users find docs for their query | High "no results" rate |
| **Feedback** | "This helped" > "This didn't help" | Low or negative ratings |

## Output

Save user documentation to:
- Tutorials: `docs/tutorials/[topic].md`
- How-tos: `docs/how-to/[task].md`
- Features: `docs/features/[feature].md`
- Onboarding: `docs/getting-started.md`

## Guidelines

- **The reader is never wrong** — if they don't understand, the doc failed, not them
- Test every tutorial by following it yourself from scratch — no shortcuts
- Screenshots add clarity but create maintenance burden — use strategically
- One guide, one goal — don't combine "how to export" with "understanding export formats"
- Use `/technical-writing` for prose quality principles
- Use `/knowledge-base` for FAQ and troubleshooting content
- Use `documentation-templates` for structural starting points
- Use `/humanizer` to make the writing feel natural
