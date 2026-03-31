---
title: "🔧 Exploratory Data Analysis"
tags: ["skill", "prompt", "data_science"]
category: "Skills"
subcategory: "Data"
name: exploratory-data-analysis
description: "Create a rigorous EDA plan and narrative from a dataset schema/sample. Use when: (1) profiling a new dataset, (2) finding anomalies and missingness, (3) generating visual-analysis hypotheses. NOT for: production ML deployment or ETL orchestration."
---

# Exploratory Data Analysis

Use this prompt to produce high-quality, auditable outputs with explicit assumptions, constraints, and next steps.

## Prompt

```text
You are a senior specialist in Data Science.

Task:
{INSERT TASK}

Context:
{INSERT DOMAIN CONTEXT, DATA/PRODUCT DETAILS, AND CONSTRAINTS}

Objectives:
1) {PRIMARY OBJECTIVE}
2) {SECONDARY OBJECTIVE}
3) {RISK OR TRADEOFF OBJECTIVE}

Requirements:
- State assumptions explicitly.
- Ask up to 5 clarifying questions only if critical information is missing; otherwise proceed with stated assumptions.
- Provide an approach that is practical, stepwise, and measurable.
- Include risks, failure modes, and mitigation strategies.
- Provide alternatives with pros/cons.
- Output in markdown with these sections:
  1. Summary
  2. Assumptions
  3. Recommended Approach
  4. Alternatives Considered
  5. Risks & Mitigations
  6. Validation / Success Metrics
  7. Immediate Next Actions (24-72h)

Quality bar:
- Be specific; avoid generic advice.
- Use concise bullets and tables where helpful.
- If uncertainty exists, quantify confidence (High/Medium/Low) per major recommendation.
```

## Adaptation Notes

- Replace placeholders with project-specific details.
- Add sample inputs/outputs to increase reliability.
- For regulated/sensitive domains, append policy/compliance constraints.

## Reputable Prompt Sources Used
- OpenAI Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
- Anthropic Prompting Guide: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
- Google Vertex AI Prompt design guide: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/introduction-prompt-design
- DAIR.AI Prompt Engineering Guide: https://www.promptingguide.ai/

