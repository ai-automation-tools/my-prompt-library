---
name: knowledge-base
description: "Build and organize knowledge bases, help centers, FAQ systems, and troubleshooting guides optimized for self-service support and search. Use when creating a structured support documentation system. Also trigger for 'knowledge base', 'help center', 'FAQ', 'troubleshooting guide', 'support docs', 'self-service support', 'help article', or 'support article'."
---

# Knowledge Base — Help Centers, FAQs & Troubleshooting

Build self-service support systems that answer user questions before they file a ticket — organized for findability, written for action.

## When to Use This Skill

**USE when:**
- Building a help center or knowledge base from scratch
- Writing FAQ pages or troubleshooting guides
- Organizing support content for search and discovery
- Reducing support ticket volume through documentation
- Creating internal knowledge bases for teams

**DON'T USE when:**
- Writing product documentation → use `/user-guides`
- Planning docs architecture → use `/content-strategy`
- Writing long-form technical docs → use `/technical-writing`

## Step 1: Knowledge Base Architecture

### Category Structure

```
HELP CENTER STRUCTURE:
  ├── Getting Started               ← New user essentials
  │   ├── Create your account
  │   ├── Set up your first project
  │   └── Invite team members
  │
  ├── Account & Billing             ← Self-service account management
  │   ├── Change your plan
  │   ├── Update payment method
  │   ├── Cancel subscription
  │   └── Download invoices
  │
  ├── [Core Feature 1]              ← Feature-organized
  │   ├── Overview
  │   ├── How to [common task]
  │   └── [Feature]-specific FAQ
  │
  ├── [Core Feature 2]
  │   └── ...
  │
  ├── Integrations                  ← Third-party connections
  │   ├── Connect [Integration A]
  │   ├── Connect [Integration B]
  │   └── Troubleshoot integrations
  │
  ├── Troubleshooting               ← Problem-solving
  │   ├── Common error messages
  │   ├── Performance issues
  │   └── Data issues
  │
  └── Policies & Legal              ← Required information
      ├── Terms of service
      ├── Privacy policy
      └── Data processing agreement

CATEGORY RULES:
  ✓ Max 6-8 top-level categories
  ✓ Max 15-20 articles per category
  ✓ Name categories after USER tasks, not internal team names
    ✓ "Account & Billing" (user perspective)
    ✗ "Customer Success" (internal team name)
  ✓ Most-visited categories first
```

### Article Types

| Type | Purpose | Structure | Length |
|------|---------|----------|--------|
| **How-to** | Complete a specific task | Steps with screenshots | 200-500 words |
| **FAQ** | Quick answer to common question | Question → direct answer | 50-200 words |
| **Troubleshooting** | Diagnose and fix a problem | Symptom → cause → fix | 200-400 words |
| **Overview** | Understand a feature/concept | What it is → what it does → when to use | 300-600 words |
| **Policy** | Legal/compliance information | Formal, complete, precise | As needed |

## Step 2: Help Article Template

### Standard Help Article

```markdown
# [How to / Task Verb] [Specific Action]

[1 sentence: what this article covers and who it's for]

[If applicable: "Available on: Pro, Business, Enterprise plans"]

---

## Before You Start
- [Prerequisite 1 — with link if needed]
- [Prerequisite 2]
- **Required role:** [Admin / Editor / Viewer]

## Steps

### 1. [Action verb] [object]
[Clear instruction]

[Screenshot with annotation — highlight the relevant UI element]

### 2. [Action verb] [object]
[Clear instruction]

### 3. [Action verb] [object]
[Clear instruction]

## Result
[What they should see when done — confirmation of success]

[Screenshot of the completed state]

---

## Related Articles
- [Related task 1](link)
- [Related task 2](link)

## Still Need Help?
[Contact support](link) — we typically respond within [timeframe].
```

### Troubleshooting Article

```markdown
# Fix: [Error Message or Problem Description]

## Symptom
[Exact error message or behavior the user is experiencing]

```
Error: CONNECTION_REFUSED - Unable to reach API endpoint
```

## Cause
[Brief explanation of what causes this — in plain language]

## Solution

### Option 1: [Most common fix]
1. [Step]
2. [Step]
3. [Verify fix worked]

### Option 2: [If Option 1 doesn't work]
1. [Step]
2. [Step]

### Option 3: [Less common cause]
1. [Step]
2. [Step]

## Still Not Working?
If none of the above solutions resolve the issue:
1. Collect your [error logs / diagnostic info]
2. [Contact support](link) with the following:
   - Your account ID
   - The error message
   - Steps you've already tried
   - When the issue started
```

### FAQ Article

```markdown
# [Question exactly as the user would ask it?]

[Direct answer — 1-2 sentences. Don't make them scroll.]

[If needed: additional context or nuance in 1-2 more sentences]

[If applicable: link to detailed how-to guide for step-by-step]
```

## Step 3: Writing for Self-Service

### Writing Rules

```
TITLES:
  ✓ Write as the user would search for it
  ✓ "How to reset your password" (matches search query)
  ✗ "Password Management Overview" (no one searches for this)
  ✓ "Fix: 'Connection refused' error" (matches the error they see)
  ✗ "Networking Troubleshooting" (too broad)

CONTENT:
  ✓ Answer first, explain second (inverted pyramid)
  ✓ One article = one topic (don't combine unrelated answers)
  ✓ Use the user's language, not internal jargon
  ✓ Include exact error messages (users copy-paste errors into search)
  ✓ Show, don't just tell (screenshots for UI tasks)

  ✗ Don't start with "This article explains..." (just explain)
  ✗ Don't include information they don't need for this task
  ✗ Don't reference internal ticket numbers or codenames
  ✗ Don't say "contact support" as the first option (self-service first)
```

### Search Optimization

```
HELP USERS FIND THE RIGHT ARTICLE:

TITLE:
  Include the exact words users search for
  "How to export data as CSV" — not "Data Export Functionality"

KEYWORDS / TAGS:
  Add synonyms: "export" + "download" + "save" + "extract"
  Add error codes: "ERR_429" + "rate limit" + "too many requests"
  Add product names: "Dashboard" + "Analytics" + "Reports"

FIRST PARAGRAPH:
  Include the answer or problem statement in the first 50 words
  Search snippets pull from the first paragraph

INTERNAL LINKS:
  Link between related articles → helps search engines AND users
  "If this doesn't solve your issue, see [related article]"

REDIRECTS:
  When you rename or merge articles, ALWAYS set up redirects
  Broken links from bookmarks and search engines erode trust
```

## Step 4: FAQ Design

### FAQ Page Structure

```markdown
# Frequently Asked Questions

## Getting Started
<details>
<summary>How do I create an account?</summary>

Visit [signup page](url) and enter your email. You'll receive a
confirmation email within 2 minutes. Click the link to activate.

[Full guide: Create your account →](link)
</details>

<details>
<summary>Is there a free plan?</summary>

Yes — the Free plan includes [X features] for up to [Y users].
No credit card required. [Compare plans →](link)
</details>

## Billing
<details>
<summary>How do I cancel my subscription?</summary>

Go to Settings → Billing → Cancel Plan. Your access continues until
the end of your current billing period. [Detailed steps →](link)
</details>

## Technical
<details>
<summary>What browsers are supported?</summary>

Chrome 90+, Firefox 88+, Safari 15+, Edge 90+.
Internet Explorer is not supported.
</details>
```

### FAQ Rules

```
✓ Use the EXACT question users ask (check support tickets and search queries)
✓ Answer in the FIRST sentence — don't build up to it
✓ Keep answers under 100 words — link to detailed articles for more
✓ Group by topic, not by when the question was asked
✓ Put the most-asked questions first within each group
✓ Update FAQ based on support ticket trends monthly
✗ Don't include questions nobody actually asks ("What is your mission?")
✗ Don't use FAQ to avoid writing proper documentation
✗ Don't duplicate content between FAQ and help articles — link instead
```

## Step 5: Internal Knowledge Base

### Internal KB Structure

```
INTERNAL KNOWLEDGE BASE (team-facing):
  ├── Onboarding                    ← New hire ramp-up
  │   ├── First week checklist
  │   ├── Tool access setup
  │   └── Team norms and practices
  │
  ├── Processes                     ← How we do things
  │   ├── Deployment process
  │   ├── Incident response runbook
  │   ├── On-call rotation guide
  │   └── Code review guidelines
  │
  ├── Architecture                  ← How things work
  │   ├── System architecture overview
  │   ├── Service dependency map
  │   └── Data flow diagrams
  │
  ├── Runbooks                      ← Operational procedures
  │   ├── [Service A] runbook
  │   ├── [Service B] runbook
  │   └── Common alerts and responses
  │
  └── Reference                     ← Lookup information
      ├── Environment URLs and credentials
      ├── Team contacts and escalation paths
      └── Vendor account information
```

### Internal Article Template

```markdown
# [Process/System Name]

**Owner:** [team or person]
**Last verified:** [date]
**Review schedule:** [quarterly / annually]

## Overview
[What this is and when you need it]

## [Process Steps / Architecture Description / Runbook]
[Content]

## Contacts
| Role | Person | Reach Via |
|------|--------|----------|
| Owner | [name] | [Slack/email] |
| Backup | [name] | [Slack/email] |

## Related
- [Link to related internal doc]
- [Link to external vendor docs]
```

## Step 6: Measuring Knowledge Base Effectiveness

### Metrics

```
COVERAGE:
  % of support tickets answered by existing KB articles
  Target: 80%+ of common issues have articles
  Track: Map top 50 support tickets to KB articles

DEFLECTION:
  Support tickets created AFTER viewing KB article
  Target: <20% of article viewers still create a ticket
  Track: Article view → ticket creation funnel

FINDABILITY:
  % of searches with 0 results
  Target: <10%
  Track: Search analytics, "no results" queries

SATISFACTION:
  "Was this article helpful?" ratings
  Target: >75% positive
  Track: Thumbs up/down on every article

FRESHNESS:
  % of articles reviewed in the last 6 months
  Target: 100% reviewed, <5% stale
  Track: Last-reviewed date on every article
```

### Continuous Improvement Loop

```
MONTHLY:
  1. Pull top 20 support tickets from last month
  2. For each: does a KB article answer this?
     YES → Is the article findable? Is it accurate?
     NO → Create a new article
  3. Pull search queries with no results → create content
  4. Pull lowest-rated articles → rewrite or delete
  5. Update FAQ based on new trends

QUARTERLY:
  1. Full freshness audit (which articles are >6 months old?)
  2. Review category structure (does it still make sense?)
  3. Analyze deflection rate trends
  4. Plan new content based on product roadmap
```

## Output

Save knowledge base content to:
- Help articles: `help/[category]/[article-slug].md`
- FAQ: `help/faq.md`
- Internal KB: `internal/[category]/[article-slug].md`

## Guidelines

- **Write titles as search queries** — "How to reset password" not "Password Management"
- **Answer first, explain later** — users want solutions, not context
- The best KB article is one the user never has to read — because the product is intuitive
- Every support ticket is a documentation failure — track and fill gaps continuously
- Internal KBs die without owners — assign an owner to every article with a review date
- Use `/technical-writing` for writing clarity within articles
- Use `/content-strategy` for overall knowledge base architecture
- Use `/style-guide` for consistency across all articles
- Use `documentation-templates` for article templates
