---
name: report-writing
description: "Write business reports including executive summaries, status updates, postmortems, competitive analyses, data analyses, and quarterly reviews. Use when communicating findings, decisions, or status to stakeholders. Also trigger for 'executive summary', 'status report', 'postmortem', 'incident report', 'competitive analysis', 'quarterly review', 'business report', or 'data analysis report'."
---

# Report Writing — Analysis, Status & Decisions

Write reports that communicate findings clearly, support decisions with evidence, and respect the reader's time — from one-page status updates to in-depth analyses.

## When to Use This Skill

**USE when:**
- Writing executive summaries or board reports
- Creating status reports or project updates
- Writing postmortems or incident reports
- Producing competitive analyses or market research
- Summarizing data analysis for non-technical stakeholders

**DON'T USE when:**
- Writing persuasive proposals → use `/proposal-writing`
- Writing marketing content → use `/copywriting`
- Writing technical documentation → use `/technical-writing`

## Step 1: Report Types & Templates

### Executive Summary

```markdown
# [Topic] — Executive Summary

**Date:** [date]
**Author:** [name]
**Audience:** [who this is for]

## Bottom Line
[1-2 sentences — the single most important takeaway. If the reader
stops here, they have the answer.]

## Key Findings
1. [Finding with supporting metric]
2. [Finding with supporting metric]
3. [Finding with supporting metric]

## Recommendation
[What action should be taken, by whom, and by when]

## Risk / Trade-offs
- [Upside of recommendation]
- [Downside or risk of recommendation]
- [What happens if we do nothing]

## Supporting Data
[Brief chart, table, or summary — NOT a data dump.
Link to full analysis for those who want details.]
```

### Status Report

```markdown
# [Project/Team] Status Report — [Period]

**Status:** 🟢 On Track / 🟡 At Risk / 🔴 Blocked

## Summary
[2-3 sentences — what happened this period, overall trajectory]

## Completed
- [Deliverable/milestone completed]
- [Deliverable/milestone completed]

## In Progress
| Item | Owner | Due | Status | Notes |
|------|-------|-----|--------|-------|
| [item] | [name] | [date] | [%/status] | [blockers if any] |

## Blockers & Risks
| Issue | Impact | Mitigation | Owner |
|-------|--------|-----------|-------|
| [blocker] | [effect] | [plan] | [name] |

## Next Period Goals
- [ ] [Goal 1]
- [ ] [Goal 2]
- [ ] [Goal 3]

## Metrics
| KPI | Target | Actual | Trend |
|-----|--------|--------|-------|
| [metric] | [target] | [actual] | ↑↓→ |

## Decisions Needed
[Any decisions that require stakeholder input — be specific about
what you need decided, by whom, and by when]
```

### Postmortem / Incident Report

```markdown
# Incident Report: [Incident Title]

**Severity:** [P0-Critical / P1-High / P2-Medium / P3-Low]
**Date:** [when it happened]
**Duration:** [how long it lasted]
**Author:** [who wrote this report]
**Status:** [Resolved / Monitoring / Open]

## Summary
[2-3 sentences — what happened, who was affected, what the impact was]

## Timeline (all times in [timezone])
| Time | Event |
|------|-------|
| HH:MM | [First sign of issue] |
| HH:MM | [Alert triggered / reported] |
| HH:MM | [Investigation began] |
| HH:MM | [Root cause identified] |
| HH:MM | [Fix deployed] |
| HH:MM | [Confirmed resolved] |

## Impact
- **Users affected:** [number or percentage]
- **Duration:** [total downtime or degradation]
- **Revenue impact:** [if applicable]
- **Data loss:** [none / details]

## Root Cause
[Specific technical or process root cause — not "human error."
What systemic condition allowed this to happen?]

## Contributing Factors
- [Factor 1 — why the root cause wasn't caught earlier]
- [Factor 2 — why the blast radius was larger than expected]

## Resolution
[What was done to fix the immediate issue]

## Action Items
| # | Action | Owner | Priority | Due | Status |
|---|--------|-------|----------|-----|--------|
| 1 | [preventive action] | [name] | P1 | [date] | TODO |
| 2 | [detective action] | [name] | P2 | [date] | TODO |

## Lessons Learned
- [What went well during the response]
- [What could have gone better]
- [What surprised us]
```

### Competitive Analysis

```markdown
# Competitive Analysis: [Market/Category]

**Date:** [date]
**Author:** [name]

## Market Overview
[Current landscape — size, growth, key trends]

## Competitor Comparison

| Dimension | Us | Competitor A | Competitor B | Competitor C |
|-----------|----|-------------|-------------|-------------|
| **Pricing** | [plan] | [plan] | [plan] | [plan] |
| **Key Feature 1** | ✓/✗/Partial | ✓/✗/Partial | ✓/✗/Partial | ✓/✗/Partial |
| **Key Feature 2** | ✓/✗/Partial | ✓/✗/Partial | ✓/✗/Partial | ✓/✗/Partial |
| **Target Market** | [who] | [who] | [who] | [who] |
| **Strength** | [what] | [what] | [what] | [what] |
| **Weakness** | [what] | [what] | [what] | [what] |

## Positioning Map

```
          HIGH PRICE
              │
    Premium   │   Enterprise
    Niche     │   Full-Suite
              │
  NARROW ─────┼───── BROAD
              │
    Emerging  │   Mass Market
    Disruptor │   Value Play
              │
          LOW PRICE
```

## Threats & Opportunities
### Threats
- [Competitor move or market trend that could hurt us]

### Opportunities
- [Gap in competitor offerings we can exploit]

## Recommended Actions
1. [Specific strategic action with rationale]
2. [Specific strategic action with rationale]
```

### Data Analysis Report

```markdown
# [Analysis Topic] — Findings Report

**Date:** [date]
**Analyst:** [name]
**Data source:** [where the data came from]
**Period:** [date range analyzed]

## Key Takeaways
1. [Most important finding — lead with the insight, not the method]
2. [Second finding]
3. [Third finding]

## Methodology
[Brief: what data, what analysis, what tools. Enough to reproduce, not
a textbook chapter. Link to code/notebook for details.]

## Findings

### Finding 1: [Headline — insight, not description]
[Narrative explanation supported by chart/table]

[Chart or table — ALWAYS with a title and labeled axes]

**Implication:** [What this means for the business]

### Finding 2: [Headline]
[Continue pattern...]

## Limitations
- [Data gap or bias acknowledged]
- [Methodological caveat]

## Recommendations
| Recommendation | Expected Impact | Effort | Priority |
|---------------|----------------|--------|----------|
| [action] | [metric improvement] | [Low/Med/High] | [1/2/3] |

## Appendix
[Detailed tables, methodology notes, raw data references]
```

## Step 2: Writing Principles for Reports

### The Pyramid Principle (Minto)

```
START WITH THE ANSWER:
  ✗ "We analyzed 50,000 user sessions over 3 months using a
     combination of cohort analysis and regression modeling,
     and after controlling for seasonality, we found..."
  ✓ "Churn is driven by onboarding failure — 68% of churned users
     never completed setup. Here's what the data shows."

STRUCTURE: Answer → Supporting arguments → Evidence

  ANSWER: "We should expand to the EU market."
    ├── ARGUMENT 1: "Market size is $2.4B with 12% CAGR"
    │   └── Evidence: [market data, analyst reports]
    ├── ARGUMENT 2: "Our product already handles EU compliance"
    │   └── Evidence: [feature comparison, legal review]
    └── ARGUMENT 3: "3 competitors exited, leaving a gap"
        └── Evidence: [competitor analysis, market share data]
```

### Data Presentation Rules

```
CHARTS:
  ✓ Every chart has a title that states the INSIGHT, not the data
    ✓ "Revenue growth accelerated after pricing change"
    ✗ "Revenue by Quarter, 2024-2026"
  ✓ Label axes, include units
  ✓ Use consistent colors across charts
  ✓ Choose the right chart type:
    Comparison: Bar chart
    Trend: Line chart
    Composition: Stacked bar or pie (if ≤5 segments)
    Distribution: Histogram
    Relationship: Scatter plot

TABLES:
  ✓ Sort by the most important column (not alphabetically)
  ✓ Right-align numbers, left-align text
  ✓ Include totals/averages where relevant
  ✓ Highlight outliers or key rows (bold)

NUMBERS:
  ✓ Round appropriately (revenue: $2.4M not $2,387,421.73)
  ✓ Use relative AND absolute ("dropped 23%, from 1,200 to 924")
  ✓ Provide context ("23% — our largest quarterly decline since 2022")
```

## Step 3: Audience-Specific Adjustments

```
C-SUITE / BOARD:
  Length: 1-2 pages + appendix
  Lead with: Bottom line, recommendation, risk
  Avoid: Methodology details, technical jargon
  Include: Strategic implications, financial impact, decision request

MANAGEMENT:
  Length: 3-5 pages
  Lead with: Summary, key findings, action items
  Avoid: Raw data, exhaustive analysis
  Include: Owner assignments, timelines, resource needs

PEERS / TECHNICAL TEAM:
  Length: As needed
  Lead with: Findings and approach
  Include: Methodology, data sources, code references, limitations
  Audience can handle: Technical detail, nuance, uncertainty
```

## Output

Save reports to `artifacts/reports/[type]-[topic]-[date].md`

## Guidelines

- **Lead with the answer, not the journey** — readers want conclusions, not chronological narratives
- **One report, one purpose** — status reports inform, analyses recommend, postmortems prevent recurrence
- Every number needs context — "42ms response time" means nothing without "target: <100ms"
- Blameless postmortems are more useful — focus on systems, not individuals
- If the report is longer than 2 pages, it needs an executive summary
- Use `/technical-writing` for clarity and editing principles
- Use `spreadsheet` or `xlsx` for supporting data tables
- Use `pdf` or `docx` for final formatted delivery
