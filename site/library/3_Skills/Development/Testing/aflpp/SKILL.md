---
title: "aflpp"
tags: ["fuzzing", "security", "testing", "c-cpp"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/skills/trailofbits-skills-plugins-testing-handbook-skills-skills-aflpp-skill-md"
---

# aflpp

Use AFL++ for multi-core fuzzing of C and C++ targets when you need stronger coverage, mature mutation strategies, or better campaign throughput than simpler single-process setups.

## Overview

Use this skill when:

- You are fuzzing a C or C++ target
- Multi-core execution matters
- A libFuzzer campaign has plateaued or needs a parallel alternative
- You need corpus management, crash triage, and long-running fuzzing workflows

## Prerequisites

- Clang or GCC toolchain compatible with AFL++
- A dedicated fuzzing environment, ideally a VM or container
- Seed corpus with at least one non-empty input

## Workflow

1. Decide whether AFL++ is the right fuzzer versus libFuzzer or a more custom framework.
2. Write or adapt a deterministic harness with clear input ownership and cleanup.
3. Compile with the best viable AFL++ mode, preferring LTO then LLVM then GCC plugin.
4. Start with a minimal valid corpus and run the campaign across available cores.
5. Inspect crashes, hangs, coverage growth, and corpus quality.
6. Minimize the corpus and convert confirmed failures into reproducible tests.

## Harness Rules

- Reset state between executions
- Avoid randomness and time-dependent behavior
- Validate input sizes early
- Free allocated resources
- Keep the harness small and deterministic

## Operational Tips

- Use Docker or a disposable VM if system tuning is required
- Add sanitizers when memory safety signals matter more than peak throughput
- Track `execs/sec`, `stability`, crash counts, and queue growth
- Preserve crashing inputs with the exact invocation needed to replay them

## Guardrails

- Do not disable OS protections on a normal development machine
- Do not fuzz production systems
- Prefer reproducible harnesses over clever but fragile setups
- Treat corpus design as part of the test strategy, not an afterthought
