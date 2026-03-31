# Prompt: Spawn and Configure a Sub-Agent (Task Tool)

**Use when:** You want Claude Code to delegate a scoped task to a new agent instance with its own instructions, tools, and context — running independently and returning a result.

---

## Prompt — Simple Sub-Agent

```
Use the Task tool to spawn a sub-agent for the following:

**Goal:** [Describe exactly what the sub-agent should accomplish]
**Input it receives:** [What context, files, or data to pass in]
**Expected output:** [What it should return — e.g. JSON object, file written to path, summary string]
**Tool access:** [Which tools it needs — be specific to limit blast radius]
**Success criteria:** [How to know it completed correctly]

The sub-agent's system prompt should be minimal and goal-specific. It should not have access to our full conversation context — only what it needs.

After it returns, validate the output against the success criteria before using it.
```

---

## Prompt — Multi-Agent Pipeline (Sequential)

```
Design and run a sequential multi-agent pipeline for this workflow:

**Workflow name:** [e.g. "Research → Analyze → Report"]
**Final goal:** [What the full pipeline should produce]

Agents in order:
1. **[Agent 1 name]:** [Task] → outputs [what]
2. **[Agent 2 name]:** [Task, receives Agent 1 output] → outputs [what]
3. **[Agent 3 name]:** [Task, receives Agent 2 output] → outputs [what]

For each agent, use the Task tool and pass ONLY the output from the previous step — no extra context. Each agent should be unaware of the others. After all agents complete, synthesize the final output.
```

---

## Prompt — Parallel Sub-Agents (Fan-Out)

```
I need to run multiple independent tasks in parallel. Use the Task tool to launch ALL of the following sub-agents simultaneously (do not await one before launching the next):

- **Agent A — [Name]:** [Task A description]. Return: [output format]
- **Agent B — [Name]:** [Task B description]. Return: [output format]
- **Agent C — [Name]:** [Task C description]. Return: [output format]

Once all agents complete, collect their results and synthesize into: [final output format].

If any agent fails, report its error but continue with the others.
```

---

## Prompt — Self-Reviewing Agent Loop

```
Complete the following task, then have a second agent review the output:

**Task:** [Describe the primary task]

Step 1: Complete the task and produce a draft output.

Step 2: Spawn a sub-agent via the Task tool with this prompt:
"You are a rigorous reviewer. Review the following output for correctness, completeness, edge cases, and security issues:

[DRAFT OUTPUT]

Return a JSON object with:
- issues: array of { severity: 'critical'|'major'|'minor', description: string, suggestion: string }
- approved: boolean
- revised_output: string (your corrected version, or the original if no changes needed)"

Step 3: If the reviewer returns issues with severity 'critical' or 'major', apply the revisions.
Step 4: Show me the final output and a summary of what was changed.
```

---

## Prompt — Specialized Agent with Persistent Identity

```
Create a specialized agent configuration for long-running use:

**Agent name:** [e.g. "SecurityReviewer", "DataAnalyst", "APIDesigner"]
**Domain:** [e.g. security auditing, financial analysis, API design]
**Persistent instructions to encode in system prompt:**
  - [Instruction 1 — e.g. "Always follow OWASP Top 10 guidelines"]
  - [Instruction 2]
  - [Instruction 3]
**Allowed tools:** [specific list]
**Output format it always returns:** [e.g. structured JSON, markdown report]
**Memory file:** [path to a file it should read at start and update on completion]

Please:
1. Write the full system prompt for this agent
2. Show how to invoke it via the Task tool
3. Create the memory file template at the specified path
4. Document the agent in CLAUDE.md under an "Agents" section
```

---

## Task Tool Reference

The Task tool spawns an independent Claude instance:
- It does NOT share your conversation history
- Pass context explicitly in the prompt
- It can use any tools you grant it
- It runs to completion and returns a string result
- Multiple Task calls in the same turn run in parallel automatically

**Pattern for passing structured context:**
```
Complete the following task:

CONTEXT:
<context>
[paste relevant data, file contents, or prior results here]
</context>

TASK:
[specific instructions]

RETURN FORMAT:
[exactly what to return and how]
```
