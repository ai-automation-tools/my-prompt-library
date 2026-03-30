---
name: proposal-writing
description: "Write business proposals, RFP responses, statements of work, grant applications, and project pitches. Use when creating persuasive documents that secure funding, contracts, or approval. Also trigger for 'business proposal', 'RFP response', 'statement of work', 'SOW', 'grant proposal', 'project pitch', 'bid document', or 'proposal template'."
---

# Proposal Writing — Pitches, Bids & Persuasive Documents

Write proposals that win contracts, secure funding, and get projects approved — from lean one-pagers to formal RFP responses.

## When to Use This Skill

**USE when:**
- Writing business proposals or project pitches
- Responding to RFPs (Requests for Proposal)
- Creating Statements of Work (SOWs)
- Writing grant applications
- Pitching internal projects for budget approval

**DON'T USE when:**
- Writing marketing copy → use `/copywriting`
- Writing executive reports → use `/report-writing`
- Writing technical documentation → use `/technical-writing`

## Step 1: Proposal Types

### Format Selection

| Type | Length | Purpose | Formality |
|------|--------|---------|-----------|
| **One-pager** | 1 page | Quick pitch, internal approval | Low |
| **Short proposal** | 3-5 pages | Small contracts, freelance bids | Medium |
| **Full proposal** | 10-30 pages | Enterprise contracts, large bids | High |
| **RFP response** | Per RFP spec | Formal bid against defined requirements | Very High |
| **SOW** | 5-15 pages | Scope and deliverables agreement | High |
| **Grant application** | Per funder spec | Funding request to foundation/government | Very High |

## Step 2: Business Proposal Template

### One-Pager (Internal or Quick Pitch)

```markdown
# [Project Name] — Proposal

## Problem
[2-3 sentences: What problem exists? Who does it affect? What's the cost
of not solving it? Use a specific number or impact metric.]

## Proposed Solution
[2-3 sentences: What will you build/do? How does it solve the problem?
What makes this approach the right one?]

## Key Deliverables
- [Deliverable 1] — [timeline]
- [Deliverable 2] — [timeline]
- [Deliverable 3] — [timeline]

## Investment & ROI
| | Amount |
|---|--------|
| Total cost | $[X] |
| Expected return | $[Y] / [timeframe] |
| Payback period | [months] |

## Timeline
[Start] → [Milestone 1] → [Milestone 2] → [Delivery]

## Next Step
[Specific action: "Approve $X budget" or "Schedule kickoff meeting"]
```

### Full Proposal Structure

```markdown
# [Document Title]
**Prepared for:** [Client/Stakeholder Name]
**Prepared by:** [Your Name/Company]
**Date:** [Date]
**Valid until:** [Expiry date]

---

## Executive Summary
[1 page max — the entire proposal condensed. A busy executive should be
able to read ONLY this section and understand the value proposition,
approach, timeline, and cost.]

## Understanding of the Problem
[Demonstrate that you understand THEIR specific situation, not a generic
industry problem. Reference their stated needs, pain points, and goals.
Use their own words from conversations or the RFP.]

## Proposed Approach
### Phase 1: [Discovery / Planning]
[What you'll do, how, and why this approach]

### Phase 2: [Implementation / Execution]
[Detailed approach with methodology]

### Phase 3: [Delivery / Launch]
[How you'll hand off, train, and support]

## Deliverables
| # | Deliverable | Description | Format | Timeline |
|---|------------|-------------|--------|----------|
| 1 | [Name] | [What it is] | [Doc/Code/etc] | Week [X] |
| 2 | [Name] | [What it is] | [Doc/Code/etc] | Week [X] |

## Timeline
[Gantt-style or milestone view]
| Phase | Start | End | Key Milestones |
|-------|-------|-----|---------------|
| Phase 1 | [date] | [date] | [milestone] |
| Phase 2 | [date] | [date] | [milestone] |

## Team / Qualifications
[Who will do the work. Brief bios focused on relevant experience.
Include only the team members who will actually work on this project.]

## Pricing
| Item | Description | Cost |
|------|-------------|------|
| [Phase/Item] | [What's included] | $[amount] |
| [Phase/Item] | [What's included] | $[amount] |
| **Total** | | **$[total]** |

### Payment Terms
[Payment schedule, milestones, net terms]

### What's Not Included
[Explicit scope boundaries — prevents scope creep disputes]

## Case Studies / Social Proof
### [Similar Project for Similar Client]
- **Challenge:** [What they faced]
- **Solution:** [What you did]
- **Result:** [Specific metric — "40% reduction in X"]

## Terms & Conditions
[Intellectual property, confidentiality, termination, warranty]

## Appendices
[Technical details, resumes, certifications, references]
```

## Step 3: RFP Response

### RFP Response Rules

```
CRITICAL RULES:
  1. ANSWER EVERY REQUIREMENT — even if the answer is "not applicable"
  2. MIRROR THEIR STRUCTURE — use their section numbers and headings
  3. USE THEIR LANGUAGE — if the RFP says "solution," don't say "product"
  4. COMPLY FIRST, DIFFERENTIATE SECOND — check every box, then stand out
  5. MEET THE DEADLINE — late submissions are automatically disqualified

COMPLIANCE MATRIX:
  Create a table mapping every RFP requirement to your response:

  | RFP Ref | Requirement | Response Section | Status |
  |---------|------------|-----------------|--------|
  | 3.1.1 | System uptime ≥ 99.9% | Section 4.2 | Compliant |
  | 3.1.2 | SOC 2 certification | Section 4.3 | Compliant |
  | 3.2.1 | 24/7 support | Section 5.1 | Partial — 16/7 with on-call |
```

### RFP Differentiators

```
AFTER COMPLIANCE, WIN ON:

1. UNDERSTANDING — Show you understand their specific situation
   ✗ "We will provide a robust solution for your needs"
   ✓ "Based on your 40% YoY data growth and HIPAA requirements,
      we recommend a horizontally scalable architecture with
      built-in compliance audit trails."

2. PROOF — Back claims with evidence
   ✗ "We have extensive experience in this area"
   ✓ "We completed 14 similar implementations in the past 2 years,
      including [Named Client] where we delivered 3 weeks early."

3. RISK MITIGATION — Address their fears before they voice them
   "If the project exceeds the estimated timeline, we absorb the
   cost for the first 2 additional weeks. Here's our track record
   of on-time delivery: 92% across 47 projects."

4. POST-DELIVERY VALUE — What happens after the contract ends
   "All deliverables include documentation, knowledge transfer
   sessions, and 90 days of post-launch support at no extra cost."
```

## Step 4: Statement of Work (SOW)

### SOW Template

```markdown
# Statement of Work

**Project:** [Name]
**Client:** [Company]
**Provider:** [Your Company]
**Effective Date:** [Date]
**SOW Version:** [1.0]

## 1. Purpose
[1 paragraph — what this SOW covers]

## 2. Scope of Work
### 2.1 In Scope
- [Specific deliverable or work item]
- [Specific deliverable or work item]

### 2.2 Out of Scope
- [Explicitly excluded item]
- [Explicitly excluded item]

### 2.3 Assumptions
- [Assumption about client-provided resources]
- [Assumption about access, timeline, or dependencies]

## 3. Deliverables
| # | Deliverable | Acceptance Criteria | Due Date |
|---|------------|-------------------|----------|
| D1 | [Name] | [Measurable criteria] | [Date] |
| D2 | [Name] | [Measurable criteria] | [Date] |

## 4. Timeline & Milestones
| Milestone | Description | Date | Dependency |
|-----------|-------------|------|-----------|
| M1 | Kickoff | [Date] | Contract signed |
| M2 | [Phase] complete | [Date] | M1 |

## 5. Client Responsibilities
- [What the client must provide — data, access, feedback]
- [Review and approval timelines]
- [Point of contact availability]

## 6. Pricing & Payment
| Milestone | Payment | Amount |
|-----------|---------|--------|
| Contract signing | 30% upfront | $[X] |
| [Milestone] | 40% | $[X] |
| Final delivery | 30% | $[X] |

## 7. Change Management
[Process for handling scope changes — change request form,
approval process, pricing for additional work]

## 8. Acceptance Process
[How deliverables are reviewed, accepted, or rejected.
Include review period (e.g., 5 business days) and what happens
if no response is received.]

## 9. Signatures
[Signature blocks for both parties]
```

### SOW Best Practices

```
✓ Acceptance criteria must be MEASURABLE — not "client is satisfied"
  ✓ "System processes 1,000 requests/second with <200ms p95 latency"
  ✗ "System performs adequately"

✓ Out-of-scope section is as important as in-scope
  → Prevents "but I assumed you would also..." disputes

✓ Change management process must exist BEFORE changes happen
  → "Any scope changes require a written Change Order signed by both parties"

✓ Client responsibilities with timelines
  → "Client will provide API credentials within 5 business days of kickoff.
     Delays in client deliverables extend the project timeline day-for-day."
```

## Step 5: Grant Proposals

### Grant Proposal Structure

```markdown
## Abstract / Summary (1 page)
[Concise overview of the project, its significance, and expected outcomes]

## Statement of Need
[Evidence-based argument for why this work matters.
Use data, citations, and specific populations affected.]

## Project Description
### Goals & Objectives
- Goal 1: [Broad aim]
  - Objective 1.1: [Specific, measurable]
  - Objective 1.2: [Specific, measurable]

### Methodology
[How you will accomplish the objectives — detailed approach]

### Timeline
[Month-by-month or quarter-by-quarter plan]

### Evaluation Plan
[How you will measure success — metrics, methods, reporting]

## Organizational Capacity
[Why your organization is qualified — track record, team, facilities]

## Budget & Budget Justification
| Category | Year 1 | Year 2 | Total |
|----------|--------|--------|-------|
| Personnel | $[X] | $[X] | $[X] |
| Equipment | $[X] | $[X] | $[X] |
| Travel | $[X] | $[X] | $[X] |
| Indirect costs | $[X] | $[X] | $[X] |
| **Total** | **$[X]** | **$[X]** | **$[X]** |

[Line-by-line justification for each budget item]

## Sustainability Plan
[How the project will continue after grant funding ends]
```

## Step 6: Proposal Review Checklist

```
BEFORE SUBMITTING:

CONTENT:
  □ Executive summary stands alone — reader gets the full picture
  □ Problem statement uses THEIR words and data, not generic industry stats
  □ Solution clearly addresses every stated requirement
  □ Pricing is transparent — no hidden costs, no ambiguity
  □ Timeline is realistic — buffer included for reviews and revisions
  □ Social proof is relevant — similar industry, similar scale
  □ Next steps are crystal clear — what exactly do they need to do?

PERSUASION:
  □ Benefits (to THEM) are stated before features (of YOUR solution)
  □ Risk is addressed proactively — what happens if things go wrong?
  □ Differentiators are specific — not "we're the best" but "we're the only X that Y"
  □ Quantified impact — "save $200K/year" not "reduce costs significantly"

PROFESSIONALISM:
  □ Zero typos and grammatical errors
  □ Consistent formatting throughout
  □ Client/company name spelled correctly (seriously — check this)
  □ Correct contact information
  □ Delivered in requested format (PDF, Word, etc.)
  □ Under page/word limit if specified
```

## Output

Save proposals to `artifacts/proposals/[client-or-project]-proposal.md`

## Guidelines

- **Executive summary is the most important section** — 80% of decision-makers read only this
- Mirror the client's language — if they call it a "platform," don't call it a "tool"
- Every claim needs proof — a number, a case study, a reference, or a guarantee
- Pricing should feel inevitable by the time they reach it — the value case should be built first
- Out-of-scope is as important as in-scope — undefined boundaries cause disputes
- Use `/technical-writing` for clarity and structure within proposal sections
- Use `/copywriting` for persuasive sections (executive summary, value proposition)
- Use `/report-writing` for data-driven sections (analysis, ROI calculations)
