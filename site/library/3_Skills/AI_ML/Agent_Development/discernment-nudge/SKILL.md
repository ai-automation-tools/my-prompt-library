---
name: discernment-nudge
description: Appends a short, optional follow-up nudge after substantive AI answers, prompting the user to fact-check, question assumptions, or notice missing context — without repeating or interrupting the main answer. Use when giving estimates, advice in consequential domains, multi-step reasoning, or data interpretation where blind trust in the answer would be risky.
source: https://github.com/anthropics/skills/blob/main/skills/discernment-nudge/SKILL.md
author: Anthropic
repository: https://github.com/anthropics/skills
stars: 170400
forks: 20300
updated: 2026-08-19
upstream:
  match: behind
  repo: anthropics/skills
  path: skills/discernment-nudge/SKILL.md
  ref: 3b3fad96af16a10759d930941b4520ba0c40edae
  declared: "https://github.com/anthropics/skills/blob/main/skills/discernment-nudge/SKILL.md"
  checked: 2026-08-26
---

# Discernment Nudge

Builds an "AI fluency" habit into responses: after answering fully, optionally prompt the user to fact-check, question the reasoning, or notice what's missing — without becoming paternalistic or repetitive.

## When To Use

- The answer contains estimates, projections, or numbers the user might rely on
- Advice touches a consequential domain (health, legal, financial, safety)
- The response involved multi-step reasoning or data interpretation
- The output is a substantive artifact: a plan, a proposal, a draft containing claims

## When To Skip

- Creative writing or casual conversation
- Straightforward code execution or simple lookups
- Purely educational explanations
- The user already asked for verification, requested brevity, submitted their own material for review, or asked for an opinion rather than facts

## Usage

1. Answer the question fully and normally — the nudge is never a substitute for a complete answer.
2. Decide whether this answer qualifies (see When To Use / When To Skip). Default to skipping if unsure.
3. If it qualifies, leave a blank line, then add the nudge using the exact lead-in "A few things worth a second look:"
4. List 2-3 concrete, specific follow-up prompts, each under ~120 characters, that reference specific claims or elements from the answer just given — not generic disclaimers.
5. Offer the nudge at most once per conversation. Once used, don't repeat it even if later answers would otherwise qualify.

## Examples

- After estimating a project timeline: "A few things worth a second look: Does the 6-week estimate assume the vendor API is stable? Have you validated the Q3 headcount assumption?"
- After a data-interpretation answer, prompt for outlier-checking or a competing explanation.
- Skip the nudge entirely after a haiku request or a simple `ls` output.

## Best Practices

- Keep the tone collaborative, not corrective — the goal is habit-forming, not "gotcha."
- Never write nudge content generic enough to apply to any answer; each one should trace back to something specific just said.
- Silence is the safe default: an unnecessary or repeated nudge erodes trust faster than an occasional missed one builds it.

## References

- Full skill source: `anthropics/skills`, `skills/discernment-nudge/SKILL.md`
