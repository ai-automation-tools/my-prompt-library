---
name: technical-writing
description: "Technical writing proficiency covering clarity principles, audience analysis, information structure, editing techniques, and style enforcement. Use when writing or improving any technical content — docs, specs, guides, or explanations. Also trigger for 'technical writing', 'write clearly', 'simplify this', 'rewrite for clarity', 'plain language', 'writing style', or 'editing pass'."
---

# Technical Writing — Clarity, Structure & Precision

Write technical content that is clear on first read, structured for scanning, precise without jargon, and useful without being verbose.

## When to Use This Skill

**USE when:**
- Writing or editing any technical document for clarity and precision
- Analyzing audience and adjusting complexity level
- Structuring information for maximum comprehension
- Applying plain language principles to dense material
- Performing editing passes (developmental, line, copy)

**DON'T USE when:**
- Creating specific document formats → use `docx`, `pdf`, `pptx`, `xlsx`
- Writing marketing copy → use `/copywriting`
- Generating API docs → use `/api-documentation`
- Building a style guide → use `/style-guide`

## Principle 1: Know Your Reader

### Audience Analysis Framework

| Dimension | Questions to Answer |
|-----------|-------------------|
| **Role** | Developer? Manager? End user? Mixed? |
| **Expertise** | Beginner? Intermediate? Expert? |
| **Goal** | Learn a concept? Complete a task? Solve a problem? Make a decision? |
| **Context** | Reading at a desk? On mobile? In a crisis? Scanning quickly? |
| **Prior knowledge** | What can you assume they already know? |
| **Next action** | What should they do after reading? |

### Adjusting for Audience

```
BEGINNER READER:
  ✓ Define terms on first use
  ✓ Provide context before details
  ✓ Use analogies to familiar concepts
  ✓ Include complete examples with expected output
  ✓ Link to prerequisites

EXPERT READER:
  ✓ Skip basics — get to the point
  ✓ Use precise terminology (they know it)
  ✓ Focus on what's different or non-obvious
  ✓ Provide reference tables, not tutorials
  ✓ Include edge cases and caveats

MIXED AUDIENCE:
  ✓ Layer information: summary → details → deep dive
  ✓ Use expandable sections for advanced content
  ✓ Lead every section with the key takeaway
  ✓ Let beginners read top-down, experts skip to what they need
```

## Principle 2: Structure for Scanning

### The Inverted Pyramid

```
┌─────────────────────────────────────┐
│           MOST IMPORTANT            │  ← Lead with the answer
│         Key fact or action          │
├─────────────────────────────────────┤
│        SUPPORTING DETAILS           │  ← Context and explanation
│     How, why, when, exceptions      │
├─────────────────────────────────────┤
│       BACKGROUND / REFERENCE        │  ← Nice to know
│    History, alternatives, theory    │
└─────────────────────────────────────┘

80% of readers only read the top layer.
If they stop reading at any point, they should already have the key info.
```

### Structural Patterns

| Pattern | When to Use | Structure |
|---------|------------|-----------|
| **Task-based** | How-to guides, procedures | Steps: 1 → 2 → 3 → Done |
| **Reference** | API docs, configuration | Alphabetical or categorical tables |
| **Conceptual** | Architecture, design decisions | Problem → Solution → Tradeoffs |
| **Tutorial** | Learning new skills | Setup → Build → Verify → Extend |
| **Troubleshooting** | Debugging, FAQ | Symptom → Cause → Fix |

### Heading Hierarchy Rules

```
GOOD:
  # Install the CLI          ← Action verb, specific
  ## Prerequisites            ← Clear scope
  ## Step 1: Download          ← Numbered, scannable
  ## Step 2: Configure         ← Parallel structure
  ## Troubleshooting           ← Predictable location

BAD:
  # Introduction               ← Says nothing
  ## About Installation         ← "About" adds no value
  ## Some Important Information ← Vague
  ## Miscellaneous              ← Junk drawer
  ## Continued                  ← Reader is lost
```

## Principle 3: Write Clear Sentences

### The Clarity Checklist

```
FOR EVERY SENTENCE, CHECK:
  □ Can the reader parse it in one pass? (If not, split it)
  □ Is the subject-verb distance short? (If not, restructure)
  □ Is the actor clear? (If not, use active voice)
  □ Are there unnecessary words? (If so, cut them)
  □ Is the meaning unambiguous? (If not, be more specific)
```

### Active vs. Passive Voice

```
PASSIVE (avoid):
  "The configuration file is read by the server at startup."
  "Errors can be handled by implementing a retry mechanism."
  "The data was processed."

ACTIVE (prefer):
  "The server reads the configuration file at startup."
  "Implement a retry mechanism to handle errors."
  "The pipeline processed the data."

EXCEPTION — passive is OK when:
  The actor is unknown: "The file was corrupted."
  The action matters more: "The request is authenticated before processing."
  The actor is obvious: "The results are sorted by date."
```

### Cut Ruthlessly

| Wordy | Concise |
|-------|---------|
| In order to | To |
| Due to the fact that | Because |
| At this point in time | Now |
| In the event that | If |
| It is important to note that | [delete — just state the note] |
| Provides the ability to | Lets / Enables |
| A large number of | Many |
| Prior to | Before |
| With regard to | About / For |
| Make a determination | Decide |
| Has the capability to | Can |
| It should be noted that | [delete] |
| As a matter of fact | [delete] |
| In a manner similar to | Like |

### Sentence Length

```
TARGET: 15-25 words per sentence on average

TOO LONG (40+ words):
  "The system processes the incoming requests by first validating the
  authentication tokens against the identity provider, then checking
  the authorization rules defined in the policy engine, and finally
  routing the request to the appropriate backend service."

FIXED (3 sentences, 12-18 words each):
  "The system validates authentication tokens against the identity provider.
  It then checks authorization rules in the policy engine.
  Finally, it routes the request to the appropriate backend service."

RHYTHM: Vary sentence length — short sentences create emphasis.
  Long sentences handle complex relationships.
  Mix them. Like this. Then expand when the idea requires room to breathe.
```

## Principle 4: Choose Words Precisely

### Terminology Rules

```
RULE 1: ONE TERM, ONE MEANING
  Pick "server" or "instance" or "node" — use the same word every time.
  Switching terms for variety causes confusion in technical writing.

RULE 2: DEFINE ON FIRST USE
  "The orchestrator (the service that coordinates workflow execution)
  schedules tasks across available workers."

RULE 3: AVOID JARGON WITHOUT CONTEXT
  ✗ "Rehydrate the state from the snapshot."
  ✓ "Restore the application state from the saved snapshot."

RULE 4: BE SPECIFIC
  ✗ "The system handles errors appropriately."
  ✓ "The system retries failed requests three times, then logs the error
     and returns a 503 status code."

RULE 5: AVOID WEASEL WORDS
  ✗ "relatively fast", "quite large", "fairly simple"
  ✓ "responds in under 200ms", "exceeds 10GB", "requires 3 lines of code"
```

### Numbers and Measurements

```
ALWAYS INCLUDE UNITS:
  ✗ "The timeout is 30."
  ✓ "The timeout is 30 seconds."

USE CONCRETE NUMBERS:
  ✗ "The system can handle a large number of requests."
  ✓ "The system handles up to 10,000 requests per second."

PROVIDE CONTEXT FOR SCALE:
  ✗ "Response time: 45ms"
  ✓ "Response time: 45ms (typical range: 20-100ms)"
```

## Principle 5: Edit in Passes

### The Three-Pass Editing Method

```
PASS 1 — STRUCTURAL (developmental edit):
  □ Is the information in the right order?
  □ Are there gaps in logic or missing steps?
  □ Does each section justify its existence?
  □ Is the scope consistent throughout?
  □ Does the document deliver on its title's promise?

PASS 2 — CLARITY (line edit):
  □ Is every sentence clear on first read?
  □ Are paragraphs focused on one idea?
  □ Are transitions smooth between sections?
  □ Is active voice used where appropriate?
  □ Are examples concrete and relevant?

PASS 3 — POLISH (copy edit):
  □ Spelling and grammar correct?
  □ Formatting consistent (headings, lists, code blocks)?
  □ Links working?
  □ Code examples tested and correct?
  □ Terminology consistent throughout?
```

### Common Technical Writing Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| **Buried lead** | 3 paragraphs of context before the command | Command first, context after |
| **Wall of text** | No headings, no breaks for 500 words | Break into sections every 100-200 words |
| **Assumed knowledge** | "Just run the migration" (what migration?) | Name the specific command and prerequisites |
| **Screenshot without context** | [image] | "The Settings panel (shown below) contains..." |
| **Outdated info** | "Click the gear icon" (UI changed) | Date-stamp procedures, review quarterly |
| **Missing error handling** | Steps 1-5 with no troubleshooting | Add "If you see X, try Y" after risky steps |

## Principle 6: Format for Comprehension

### When to Use Each Format

| Format | Best For | Avoid When |
|--------|---------|-----------|
| **Paragraph** | Explanations, context, decisions | Procedures, reference data |
| **Numbered list** | Sequential steps, ranked items | Unordered information |
| **Bullet list** | Features, requirements, options | Sequences, procedures |
| **Table** | Comparisons, reference data, parameters | Narrative content |
| **Code block** | Commands, config, examples | Prose descriptions |
| **Callout/admonition** | Warnings, tips, important notes | Regular content |
| **Diagram** | Architecture, flow, relationships | Simple lists |

### Paragraph Rules

```
ONE IDEA PER PARAGRAPH.
  If a paragraph covers two topics, split it.

LEAD WITH THE POINT.
  First sentence = topic sentence. Reader should know the paragraph's
  purpose from the first line.

KEEP PARAGRAPHS SHORT.
  3-5 sentences for explanatory content.
  1-2 sentences for procedural context between steps.
  Never exceed 7 sentences in technical writing.
```

## Output

When applying these principles, either:
- Edit the document in place with improvements
- Save revised version to the same path with tracked changes noted
- Provide a before/after comparison for review

## Guidelines

- **Clarity is not dumbing down** — clear writing demonstrates understanding, not simplicity
- **Write for the scanner first** — most readers scan headings and first sentences, then read selectively
- **Test your writing** — hand it to someone in your target audience and watch where they get stuck
- Every document should answer: "What does the reader need to DO after reading this?"
- Use `/humanizer` to remove AI-generated writing patterns after drafting
- Use `/style-guide` to enforce consistency across a documentation set
- Use `documentation-templates` for structural starting points
