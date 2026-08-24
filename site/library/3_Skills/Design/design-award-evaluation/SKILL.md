---
name: design-award-evaluation
description: A suite of evidence-driven skills for the design-award submission pipeline — finding verified award-winning precedents, scoring a design's award fit, comparing which awards suit it best, and checking a submission package before it ships. Backed by 22,000+ aggregated observations from major design competitions (iF, Red Dot, IDEA). Use when evaluating whether a design is award-worthy or preparing/vetting a competition submission, rather than relying on subjective taste.
source: https://github.com/SeanJ1ang/design-judge-skills
author: SeanJ1ang
repository: https://github.com/SeanJ1ang/design-judge-skills
stars: 1000
forks: 157
updated: 2026-08-19
license: Apache-2.0
---

# Design Award Evaluation

Treats "is this design any good" as a sourced research question, not a taste call, by grounding every judgment in verified precedent from official award-program sources.

## Prerequisites

- Node.js 18+ and the `npx skills` installer (also deployable to Codex, OpenCode, and other agent platforms)
- Reference material for the design being evaluated (images, spec sheet, or product description)

## When To Use

- Deciding which award programs actually fit a design before spending effort on an application
- Getting an evidence-backed quality/risk assessment of a design rather than a subjective opinion
- Finding verified, officially-sourced precedent cases in the same category to benchmark against
- Preparing or double-checking a submission package against a program's actual rules

## Usage

1. Route the request through the pipeline skill first when it's unclear which stage is needed — it decides the minimum set of stages to run.
2. Search for verified precedent: pull comparable award-winning or shortlisted works, cross-checked against official award pages rather than secondhand write-ups.
3. Run the evaluation skill for an evidence-backed score and risk report on the design itself.
4. Run the match skill to compare candidate award programs (e.g. iF Student vs. Red Dot Design Concept) and rank submission priority.
5. Use the information-prep skill to extract and draft the factual content an application needs.
6. Before submitting, run the submission-check skill against the target program's actual rules.

## Best Practices

- Treat official award pages as the source of truth; use general search results only as supporting context, never as the final citation.
- Don't skip straight to evaluation — precedent search first gives the evaluation something concrete to benchmark against.
- Re-run the submission check after any late edit to the application material, not just once at the start.

## References

- Repository: https://github.com/SeanJ1ang/design-judge-skills
