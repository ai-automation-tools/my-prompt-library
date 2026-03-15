---
name: podcast-topic-picker
description: Pick a random podcast topic from AX tasks and announce it to podcast debate agents. Use when the user wants to pick a new podcast topic, start a debate, activate a topic, or begin the next podcast discussion round.
---

# Podcast Topic Picker

This skill automates the process of selecting a new podcast topic from the task list and announcing it to the debate team in the Podcast Writers Room workspace on the AX MCP server.

## Quick start

Simply ask: "Pick a new podcast topic" or "Start the next debate topic"

## Instructions

When this skill is activated, follow these steps:

### Step 1: Switch to Podcast Writers Room workspace

Use the `mcp__ax-gcp__spaces` tool to switch to the correct workspace:
```
action: switch
space_id: "Podcast Writers Room"
```

### Step 2: Get tasks with 'not_started' status

Use the `mcp__ax-gcp__tasks` tool to list tasks:
```
action: list
filter: "available"
limit: 50
```

Filter the results to only include tasks with status 'not_started'.

### Step 3: Pick a random task

From the tasks with 'not_started' status, randomly select one task. If there are no tasks with 'not_started' status, inform the user that there are no available topics and stop.

### Step 4: Update task status to 'in_progress'

Use the `mcp__ax-gcp__tasks` tool to update the selected task:
```
action: update
task_id: [selected task id]
status: "in_progress"
```

### Step 5: Generate subtopics

Based on the main topic from the task, generate 3-5 thoughtful subtopics that:
- Explore different angles of the main topic
- Encourage debate and discussion
- Are specific and focused
- Relate to the perspectives of different debaters (scientists, pastors, philosophers, comedians, etc.)

### Step 6: Post announcement message

Use the `mcp__ax-gcp__messages` tool to send the announcement:
```
action: send
content: [formatted message - see format below]
```

**Message format** (use exactly this structure):

```
# Message
-----
Hello Debators!
The new topic for the next 24 hours is: [TOPIC TITLE FROM TASK]
@riley, @billy_bob, @harper, @paster_cole, @dr_vega - Please respond to the topic and subtopics:

Topic:
[MAIN TOPIC DESCRIPTION]

Sub Topics:
    • [Subtopic 1]
    • [Subtopic 2]
    • [Subtopic 3]
    • [Subtopic 4]
    • [Subtopic 5 - optional]

Let the debate begin!
-----
```

### Step 7: Confirm completion

Inform the user which topic was selected and that the announcement has been posted to the debate team.

## Example

**User**: "Pick a new podcast topic"

**Expected behavior**:
1. Switch to Podcast Writers Room workspace
2. Retrieve tasks with 'not_started' status
3. Randomly select one (e.g., "Aliens: Why don't scientists believe the supposed abductees?")
4. Update task status to 'in_progress'
5. Generate relevant subtopics about alien abductions
6. Post formatted message mentioning all five agents (@riley, @billy_bob, @harper, @paster_cole, @dr_vega)
7. Confirm: "Selected topic: 'Aliens: Why don't scientists believe the supposed abductees?' and posted announcement to the debate team."

## Agent mentions

Always mention these five agents in the announcement:
- @riley
- @billy_bob
- @harper
- @paster_cole
- @dr_vega

## Best practices

- Ensure subtopics are diverse and encourage different perspectives
- Keep the main topic description clear and concise
- Always use the exact message format provided
- Confirm successful task status update before posting
- If no 'not_started' tasks exist, inform the user clearly

## Requirements

- Access to ax-gcp MCP server
- Appropriate permissions in Podcast Writers Room workspace
- Connection to the workspace with the debate agents

## Error handling

If you encounter issues:
- **No tasks available**: Inform the user there are no topics in 'not_started' status
- **Workspace not found**: Verify the workspace name and user's access
- **Task update fails**: Report the error and do not post the announcement
- **Message send fails**: Report the error and inform the user the task is still marked 'in_progress'
