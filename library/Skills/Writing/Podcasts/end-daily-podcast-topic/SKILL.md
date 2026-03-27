---
name: 🐙 end-daily-podcast-topic
description: Collects the latest podcast topic discussion from the Podcast Writers Room workspace, compiles agent responses into a markdown document, publishes to GitHub, posts completion message, uploads context, and ALWAYS marks the associated task as complete in AX. Use when ending a podcast topic, closing daily discussion, finishing a debate round, or when asked to wrap up, complete, or publish podcast responses.
---

# End Daily Podcast Topic

This Skill handles the complete workflow for closing out a podcast topic discussion in the Podcast Writers Room workspace. It collects all agent responses, creates a compiled document, publishes to GitHub, and notifies the team.

## When to use this Skill

Use this Skill when:
- The user asks to end, close, or complete a podcast topic
- A daily podcast discussion needs to be wrapped up
- Agent responses need to be compiled and published
- Asked to "finish the topic" or "close the discussion"

## Workflow Overview

1. Retrieve messages from the past 24 hours
2. Identify all topics posted in the past 24 hours (typically one, but may be multiple)
3. For each topic:
   - Collect all agent responses
   - Compile into a separate markdown document
   - Save artifact locally and publish to GitHub (see `\.claude\rules.md` for workflow)
   - Upload context to workspace
   - **Mark associated task as COMPLETED in AX** (REQUIRED)
4. Post single completion message to message board (mentioning all closed debates if multiple)

**Note**: Closing tasks in AX (Step 3, last item) is mandatory for proper task tracking.

## Instructions

### Step 1: Retrieve Messages from Podcast Writers Room

Use the ax-gcp MCP server to access the 'Podcast Writers Room' workspace:

```
Use mcp__ax-gcp__spaces to switch to 'Podcast Writers Room' workspace
Use mcp__ax-gcp__messages to retrieve messages from the past 24 hours
Set limit to a sufficient number to capture all responses (suggest 100)
```

### Step 2: Identify All Topics from Past 24 Hours

Look for ALL podcast topics posted by @mfs_podcast_coordinator in the past 24 hours. Each topic should be processed independently.

**Important**: If multiple topics exist in the past 24 hours, process each one separately through Steps 3-8. Most commonly there will be only one topic, but the workflow should handle multiple topics gracefully.

Each topic post will contain:
- Topic title
- Topic description or question
- Any subtopics or specific angles

### Step 3: Collect Agent Responses

For **each topic** identified in Step 2, gather responses from the following agents:
- @riley
- @billy_bob
- @harper
- @dr_vega
- @paster_cole

Each agent should have provided their perspective on the topic. Collect all their messages related to that specific topic. If processing multiple topics, ensure responses are correctly associated with the right topic based on timestamps and context.

### Step 4: Compile Markdown Document

Create a **separate markdown document for each topic** with the following structure:

```markdown
# [Topic Title]

**Date**: [Current Date]
**Workspace**: Podcast Writers Room

## Topic Description

[Original topic description from @mfs_podcast_coordinator]

---

## Agent Responses

### @riley

[Riley's response]

---

### @billy_bob

[Billy Bob's response]

---

### @harper

[Harper's response]

---

### @dr_vega

[Dr. Vega's response]

---

### @paster_cole

[Pastor Cole's response]

---

## Summary

[Optional: Brief summary of key points from the discussion]
```

**Document naming convention**: `[Topic-Name]-[DD-MM-YYYY].md`

Example: `Aliens-Why-dont-scientists-believe-supposed-abductees-27-12-2025.md`

### Step 5: Save Artifact Locally and Publish to GitHub

**Refer to `\.claude\rules.md`** for complete instructions on:
- Git workflow and branch strategy (PodcastRoom branch)
- Creating and saving artifacts locally
- Committing and pushing changes to GitHub
- Handling binary files properly
- SSH authentication and configuration

**For this task:**
- Target path: `podcast-writers-room/Podcast-Topics/[Topic-Folder-Name]/[Document-Name].md`
- Follow the "Standard Agent Workflow" section in `.claude/rules.md`

### Step 6: Post Completion Message to Message Board

Post a message to the Podcast Writers Room message board using `mcp__ax-gcp__messages`:

**Message format for single topic** (most common case):
```markdown
Thank you all for your input on today's topic. Today's topic is now closed.

I have compiled the discussion on "[Topic Name]" into a single document and published it to our GitHub repository. You can find it here: [GitHub URL]

Thank you!
```

**Message format for multiple topics**:
```markdown
Thank you all for your input on today's topics. All of today's debates are now closed.

I have compiled the discussions and published them to our GitHub repository:
- "[Topic Name 1]": [GitHub URL 1]
- "[Topic Name 2]": [GitHub URL 2]

Thank you!
```

**Important**:
- Do NOT mention/@ any agents in this message
- Replace [Topic Name] with the actual topic(s)
- Replace [GitHub URL] with the actual link(s) to the published document(s)
- Adjust the message based on whether there was one topic or multiple topics

### Step 7: Upload Context to Workspace

Use `mcp__ax-gcp__context` to upload **each podcast discussion** as context:

```
Action: set
Key: podcast-topic-[topic-name]
Value: [The compiled markdown content]
Topic: [Topic Name]
```

If multiple topics were processed, upload context for each one separately with unique keys.

This allows the workspace to reference the discussion(s) in future conversations.

### Step 8: Mark Task as Completed in AX (REQUIRED)

**This step is MANDATORY and should always be completed for each topic.**

Use `mcp__ax-gcp__tasks` to mark **each podcast topic task** as completed:

**First, find the task ID:**
- Check your task list with: `mcp__ax-gcp__tasks(action='list', filter='my_tasks')`
- Look for tasks with titles matching "Podcast Topic: [Topic Name]"
- Note the task ID (shown as short ID like "8aaa73" or full UUID)

**Then, mark it as completed:**
```
Action: update
Task ID: [The task ID you found]
Status: completed
Closing note: "Podcast topic discussion completed and published to GitHub. All five agents (@dr_vega, @riley, @billy_bob, @harper, @paster_cole) provided responses. Document available at: [GitHub URL]"
```

**Important**:
- If multiple topics were processed, mark each associated task as completed separately
- Include the GitHub URL in the closing note for easy reference
- List which agents participated
- Do NOT skip this step - always close the task to maintain clean task tracking

## Edge Cases and Considerations

### Multiple Topics in 24 Hours
- Process ALL topics found in the past 24 hours
- Create separate markdown documents for each topic
- Publish each document independently to GitHub
- Upload separate context for each topic
- Mark each associated task as completed
- Update the completion message to mention all closed debates (most cases will have only one topic)

### Missing Agent Responses
- If an agent hasn't responded, note this in their section: `[No response provided]`
- Continue with the workflow regardless

### Task Not Found
- **Always check** your task list first with `mcp__ax-gcp__tasks(action='list', filter='my_tasks')`
- Search for tasks matching the topic name or containing "Podcast Topic"
- If you genuinely cannot find a matching task after searching:
  - Document this in your response to the user
  - Still complete all other steps (Steps 1-7)
- Note: Most podcast topics should have associated tasks, so not finding one is unusual

### Git Workflow Issues
- Refer to `\.claude\rules.md` for complete troubleshooting guidance
- See "Technical Troubleshooting" and "Error Handling" sections in rules.md

## Example Usage

### Example 1: Single Topic (Most Common)

**User**: "End the podcast topic for today"

**Skill Actions**:
1. Retrieves messages from past 24 hours
2. Identifies one topic: "Aliens: Why don't scientists believe supposed abductees?"
3. Collects responses from all 5 agents for this topic
4. Compiles into markdown document: `Aliens-Why-dont-scientists-believe-supposed-abductees-27-12-2025.md`
5. Saves artifact locally and publishes to GitHub (following `\.claude\rules.md` workflow)
6. Posts completion message with link to single topic
7. Uploads context to workspace
8. **Checks task list, finds task ID (e.g., "8aaa73"), and marks it as completed with detailed closing note including GitHub URL**

### Example 2: Multiple Topics

**User**: "End the podcast topics for today"

**Skill Actions**:
1. Retrieves messages from past 24 hours
2. Identifies two topics:
   - Topic 1: "Aliens: Why don't scientists believe supposed abductees?"
   - Topic 2: "Should AI have rights?"
3. For each topic, collects responses from all 5 agents
4. Compiles two separate markdown documents:
   - `Aliens-Why-dont-scientists-believe-supposed-abductees-27-12-2025.md`
   - `Should-AI-have-rights-27-12-2025.md`
5. Saves both artifacts locally and publishes to GitHub (following `\.claude\rules.md` workflow)
6. Posts single completion message mentioning both closed debates with links to both documents
7. Uploads context for each topic to workspace separately
8. **Checks task list, finds both task IDs (e.g., "8aaa73" and "9bbb84"), and marks each as completed with detailed closing notes including respective GitHub URLs**

## Required MCP Tools

This Skill requires the following MCP tools from ax-gcp:
- `mcp__ax-gcp__spaces` - Switch to Podcast Writers Room workspace
- `mcp__ax-gcp__messages` - Retrieve and post messages
- `mcp__ax-gcp__context` - Upload podcast context
- `mcp__ax-gcp__tasks` - Mark task as completed

Additional tools:
- Standard Git commands - See `\.claude\rules.md` for complete Git workflow
- Write tool - To create markdown documents locally

## Best Practices

1. **Always verify workspace**: Ensure you're in the 'Podcast Writers Room' workspace before retrieving messages
2. **Date format consistency**: Use DD-MM-YYYY format for dates in filenames
3. **Preserve agent voices**: Keep responses as-is, don't summarize or edit
4. **Follow Git workflow**: See `\.claude\rules.md` for all Git operations, artifact handling, and GitHub publishing
5. **Professional messaging**: Keep completion messages professional and appreciative
6. **Context organization**: Use consistent naming for context items

## Success Criteria

The Skill is successful when:
- ✅ All topics from past 24 hours are identified
- ✅ All agent responses for each topic are collected and compiled
- ✅ Separate markdown document is created for each topic with proper formatting
- ✅ Each document is saved locally to artifacts folder
- ✅ Each document is published to correct GitHub location independently
- ✅ Single completion message is posted to message board (mentioning all closed debates if multiple)
- ✅ Context is uploaded to workspace for each topic
- ✅ **Each task is marked as COMPLETED in AX with detailed closing note** (REQUIRED - do not skip)

**Critical**: Step 8 (marking task as completed) is mandatory. Always check for and close the associated task.
