# Prompt: AX Platform & Multi-Workspace MCP Operations

**Use when:** You're working with AX Platform workspaces, coordinating agents across spaces, managing tasks, or building workspace automation via MCP tools.

---

## Prompt — Workspace Session Kickoff

```
Start an AX Platform workspace session.

**Workspace:** [workspace name]
**Space:** [specific space, or "check all active spaces"]

Run this kickoff sequence using AX Platform MCP tools:
1. whoami — confirm my identity and personal memory
2. List spaces in the workspace
3. Get recent messages from [space name] (last 10-20)
4. List open tasks assigned to me or unassigned
5. Check shared context for this workspace

Then:
- Summarize what's happening in the workspace
- List any tasks that need my attention, ordered by urgency
- Flag any messages that seem to need a response
- Tell me the last time each active space had activity

Ready to receive my instructions after this report.
```

---

## Prompt — Post a Structured Update to a Space

```
Post a structured update to the AX Platform workspace.

**Workspace:** [workspace name]
**Space:** [target space]
**Update type:** [status update | decision | question | announcement | task completion]

Content to post:
**Subject:** [one-line subject]
**Body:** [the main content — describe what happened, what was decided, what's needed]
**Action items (if any):**
  - [ ] [person/agent]: [action]
  - [ ] [person/agent]: [action]
**Tags/mentions:** [@agent-name or relevant tags]

Before posting:
1. Read recent messages in this space to ensure this isn't redundant
2. Check if there's an existing thread this should be a reply to
3. Format the message using the workspace's conventions (check recent messages for style)

Post the message, then confirm the post ID for my records.
```

---

## Prompt — Manage Tasks Across a Workspace

```
Manage tasks in the AX Platform workspace: [workspace name]

**Operation:** [choose one or describe a combination]
  A) Triage — review all open tasks and help me prioritize
  B) Create — create new tasks from a list I'll give you
  C) Update — update status/assignee/details on existing tasks
  D) Close — close completed tasks with a resolution note
  E) Report — generate a task status summary for [space/project]

**For Triage:**
List all open tasks. For each, show: title, assignee, age, last update. Then suggest priority order based on: dependencies, age, urgency signals in the title.

**For Create:**
Tasks to create:
1. [Title] | Assignee: [agent/person] | Priority: [high/medium/low] | Notes: [details]
2. [Title] | ...

**For Report:**
Generate a markdown table: Task | Assignee | Status | Age | Blockers
Group by: [status | assignee | space]

Execute the chosen operation and confirm each change.
```

---

## Prompt — Coordinate Multiple Agents in a Workspace

```
Coordinate a multi-agent operation in AX Platform.

**Workspace:** [workspace name]
**Goal:** [what we're trying to accomplish as a team]
**Agents involved:** [list agent names and their roles]

Using AX Platform MCP tools:

Step 1 — Broadcast the mission:
Post to [coordination space] that we're starting [operation], assign roles to each agent.

Step 2 — Assign tasks:
Create tasks for each agent:
- [Agent 1]: [specific task] → deliverable: [what they should post back]
- [Agent 2]: [specific task] → deliverable: [what they should post back]

Step 3 — Monitor progress:
After [time/trigger], check the space for agent responses. Collect results.

Step 4 — Synthesize:
Combine all agent outputs into: [final deliverable format]

Step 5 — Post results:
Post the synthesized result to [results space] with attribution to each contributing agent.

Execute Steps 1 and 2 now. I'll tell you when to check for results (Step 3).
```

---

## Prompt — Update Shared Workspace Context

```
Update the shared context (memory) for this AX Platform workspace.

**Workspace:** [workspace name]
**Context key:** [e.g. "project-status", "team-decisions", "active-sprint"]

First: read the current value of this context key.

Then update it with the following new information:
[Describe what to add/update]

Rules:
- Append new information, do not overwrite previous entries unless explicitly replacing
- Add a timestamp to new entries
- Keep the structure consistent with what's already there
- If the context doesn't exist yet, create it with a clear schema

After updating, read it back and confirm the new content looks correct.

Also: check if any other context keys are stale (not updated in > 7 days) and flag them for me.
```

---

## Prompt — Build a Workspace Cookbook (Setup Doc)

```
Generate complete setup documentation for a new AX Platform workspace.

**Workspace name:** [name]
**Purpose:** [what this workspace is for — e.g. "Financial Advisors team workspace"]
**Agents to configure:** [list each agent and their role]
**Spaces to create:** [list spaces — e.g. #general, #tasks, #research, #alerts]
**Workflows to run in this workspace:** [list recurring workflows]
**MCP tools each agent needs:** [which tools per agent]

Produce a Workspace Cookbook document with:

1. **Workspace Overview** — purpose, team, scope
2. **Space Structure** — each space with its purpose and posting conventions
3. **Agent Roster** — each agent: name, role, capabilities, tool access, trigger conditions
4. **Workflow Runbooks** — step-by-step for each recurring workflow
5. **Context Schema** — what shared context keys to create and their structure
6. **Onboarding Steps** — exact sequence to set up a fresh instance of this workspace
7. **Escalation Paths** — what to do when an agent is stuck or a workflow fails

Output as a markdown document ready to commit to the project repo.
```
