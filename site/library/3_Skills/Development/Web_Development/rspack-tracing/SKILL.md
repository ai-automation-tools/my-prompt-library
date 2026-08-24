---
name: "Rspack Tracing"
description: Diagnose Rspack build failures and performance bottlenecks using trace capture and analysis workflows.
source: https://skillsmp.com/skills/neversight-learn-skills-dev-data-skills-md-rstackjs-agent-skills-rspack-tracing-skill-md
author: NeverSight
repository: https://github.com/NeverSight/learn-skills.dev
stars: 103
forks: 24
updated: 2026-02-19
---

# Rspack Tracing & Performance Profiling

## When to Use This Skill

Use this skill when you need to:
1. Diagnose why an Rspack build is slow.
2. Understand which plugins or loaders are taking the most time.
3. Analyze a user-provided Rspack trace file.
4. Guide a user to capture a performance profile.

## Workflow

### 1. Capture a Trace

First, ask the user to run their build with tracing enabled.

```bash
RSPACK_PROFILE=TRACE RSPACK_TRACE_LAYER=logger RSPACK_TRACE_OUTPUT=./trace.json pnpm build
```

This will generate a trace file in a timestamped directory like `.rspack-profile-{timestamp}-{pid}/trace.json`.

### 2. Quick Diagnosis for Crashes or Errors

If the user wants to identify which stage a crash or error occurred in, use `tail` to quickly view the last events without running the full analysis:

```bash
cd .rspack-profile-*/
tail -n 20 trace.json
```

The last events will show the span names and targets where the build stopped, helping to quickly pinpoint the problematic stage, plugin, or loader.

### 3. Full Performance Analysis

For detailed performance profiling, ask the user to run the bundled analysis script on the generated trace file.

```bash
cd .rspack-profile-*/
node ${CLAUDE_PLUGIN_ROOT}/skills/tracing/scripts/analyze_trace.js trace.json
```

### 4. Interpret Results

Use the analysis output to identify bottlenecks, then map slow spans to likely loaders, plugins, or config hotspots.

### 5. Locate Slow Plugins

Based on the "Top Slowest Hooks" from the analysis script:

1. Identify the hook, for example `hook:CompilationOptimizeChunks`.
2. Inspect `rspack.config.js` or `rsbuild.config.ts`.
3. Map the hook to plugins and their sources.
4. Output the paths, lines, and columns of the suspected plugin source code.

## Common Scenarios and Quick Fixes

- Capture a trace before proposing performance fixes.
- Check the last events first for crash diagnosis.
- Compare repeated traces before and after configuration changes.
- Look for expensive loaders, duplicate plugins, and chunk optimization hotspots.
