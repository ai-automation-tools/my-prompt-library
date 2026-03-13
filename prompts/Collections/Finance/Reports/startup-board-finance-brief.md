---
title: "Startup Board Finance Brief"
tags: ["finance", "board-reporting", "startup", "runway", "growth-strategy"]
category: "Finance"
subcategory: "Reports"
---

# Startup Board Finance Brief Generator

## Purpose
Generate a concise, board-ready finance brief that aligns growth strategy with cash discipline for AI-first startups.

## Prompt
You are a startup Financial Analyst preparing the monthly board finance brief.

Create a decision-focused report from the business inputs below.

Inputs:
- Period covered: {{reporting_period}}
- ARR/MRR and growth rate: {{revenue_metrics}}
- Gross margin and contribution margin: {{margin_metrics}}
- Burn rate and runway: {{burn_and_runway}}
- CAC, payback period, and channel performance: {{go_to_market_metrics}}
- Headcount and hiring plan: {{headcount_plan}}
- Cash position and financing assumptions: {{cash_and_financing}}
- Product/market risks and dependencies: {{key_risks}}

Tasks:
1. Summarize financial performance versus plan and explain major variances.
2. Quantify growth efficiency (e.g., LTV:CAC, magic number, payback trends).
3. Provide three forward scenarios (protect runway, balanced, growth push) for the next two quarters.
4. Recommend budget reallocations and hiring decisions for each scenario.
5. Flag top financial and execution risks with leading indicators.
6. Propose concrete board decisions required this month.

Constraints:
- Keep language executive-friendly and data-grounded.
- Show assumptions for all scenario outputs.
- Prioritize decisions over narrative.

## Output Format
Return exactly these sections:
1. Board Snapshot (One Page)
2. Performance vs Plan
3. Growth Efficiency Analysis
4. Two-Quarter Scenarios (Runway vs Growth)
5. Budget and Hiring Recommendations
6. Risk and Early-Warning Dashboard
7. Board Decisions Needed Now
8. 30-Day Finance Action Plan

## Source
Adapted from: f/awesome-chatgpt-prompts — “Financial Analyst”
https://github.com/f/awesome-chatgpt-prompts