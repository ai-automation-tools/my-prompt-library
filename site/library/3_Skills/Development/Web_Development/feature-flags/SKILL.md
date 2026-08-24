---
title: "feature-flags"
tags: ["react", "frontend", "testing", "flags"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/skills/facebook-react-claude-skills-feature-flags-skill-md"
---

# feature-flags

Handle feature-flagged React development and tests, especially when flags differ by environment, channel, or forked configuration.

## Overview

Use this skill when:

- A feature-flagged behavior is failing in tests
- A new flag needs to be added consistently across environments
- Channel-specific or variant-specific behavior is hard to reason about
- You need to decide between skipping a test and asserting both paths

## Workflow

1. Find the canonical flag definition and all environment-specific fork files.
2. Confirm the default value and any variant-specific overrides.
3. Identify whether the test should be gated entirely or should assert both branches.
4. Update every required flag location, not just the default file.
5. Run targeted tests for each relevant channel or variant.

## Testing Patterns

Use a full test gate when the feature is unavailable without the flag.

Use inline branching when both code paths should remain testable under different flag states.

## Checklist For New Flags

1. Add the flag to the default definition file.
2. Add corresponding entries to every forked or channel-specific file.
3. Decide which environments use explicit values versus variant-driven values.
4. Update tests with the right gating pattern.
5. Verify both enabled and disabled behavior where variants exist.

## Common Mistakes

- Updating only the primary flag file and forgetting forks
- Using full test gating where both branches should be asserted
- Forgetting to test both variant states
- Treating flag names as strings when the framework expects typed accessors or callbacks

## Guardrails

- Keep flag behavior explicit across environments
- Prefer narrow, targeted tests over broad snapshot churn
- Document whether a failure is caused by configuration drift or by actual product behavior
