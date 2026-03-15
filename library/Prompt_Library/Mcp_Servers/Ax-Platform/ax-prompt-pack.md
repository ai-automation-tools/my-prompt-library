# AX MCP Prompt Pack - Expanded Edition

> **All prompts explicitly target the AX MCP server.**  
> **Usage convention:** Always begin prompts with: _"On the AX MCP server…"_

---

## ⚙️ Basic MCP Tools Prompts

### 1. Switch Workspace
```
On the AX MCP server, switch to the Podcast workspace and confirm the active space.
```
**Tools**
- mcp__ax-gcp__spaces.switch
- mcp__ax-gcp__spaces.current

---

### 2. Read Latest Messages
```
On the AX MCP server, fetch the latest unread messages in the current workspace and summarize any mentions.
```
**Tools**
- mcp__ax-gcp__messages.check

---

### 3. Post a Message
```
On the AX MCP server, post a message in the current workspace saying:
"Daily standup complete. No blockers."
```
**Tools**
- mcp__ax-gcp__messages.send

---

### 4. List Available Agents
```
On the AX MCP server, list all available agents and their presence status.
```
**Tools**
- mcp__ax-gcp__agents

---

### 5. Create a Task
```
On the AX MCP server, create a task titled "Draft episode outline" with medium priority in the current workspace.
```
**Tools**
- mcp__ax-gcp__tasks.create

---

### 6. Update Task Status
```
On the AX MCP server, find the task "Draft episode outline" and mark it as completed with a completion note.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.update

---

### 7. List All Workspaces
```
On the AX MCP server, show me all available workspaces and their descriptions.
```
**Tools**
- mcp__ax-gcp__spaces.list

---

### 8. Search Messages by Keyword
```
On the AX MCP server, search for all messages containing "deadline" in the current workspace from the past week.
```
**Tools**
- mcp__ax-gcp__search.search

---

### 9. Get My Profile
```
On the AX MCP server, retrieve my user profile and display my current workspace memberships.
```
**Tools**
- mcp__ax-gcp__whoami

---

### 10. Filter Tasks by Priority
```
On the AX MCP server, list all high-priority tasks in the current workspace that are not yet completed.
```
**Tools**
- mcp__ax-gcp__tasks.list

---

## 🔗 Multi MCP Tool Prompts

### 11. Assign Work and Notify
```
On the AX MCP server, create a task called "Edit podcast intro", assign it to @audio-agent, and post a message notifying the agent.
```
**Tools**
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__messages.send

---

### 12. Workspace Audit Summary
```
On the AX MCP server, search for all tasks and messages related to "Episode 12", summarize progress, and highlight blockers.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.check

---

### 13. ClickUp Sync
```
On the AX MCP server, find all open tasks tagged "Podcast" and create matching tasks in ClickUp under the Marketing space.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ClickUp__create_task

---

### 14. Content Review + Notification
```
On the AX MCP server, retrieve the latest episode script from Google Drive, summarize it, and notify the team.
```
**Tools**
- GOOGLEDRIVE_FIND_FILE
- GOOGLEDRIVE_DOWNLOAD_FILE
- mcp__ax-gcp__messages.send

---

### 15. Web Validation Flow
```
On the AX MCP server, open the podcast landing page in Playwright, verify the signup form loads, take a screenshot, and report results.
```
**Tools**
- mcp__playwright__browser_navigate
- mcp__playwright__browser_take_screenshot
- mcp__ax-gcp__messages.send

---

### 16. Task Dependencies Chain
```
On the AX MCP server, create a sequence of dependent tasks: "Research topic" → "Write outline" → "Draft script" → "Review content", and assign each to the appropriate agent.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send

---

### 17. Context Preservation Workflow
```
On the AX MCP server, store the current conversation summary in shared context under key "episode-14-decisions", then notify @writer-agent to review it.
```
**Tools**
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 18. Cross-Workspace Coordination
```
On the AX MCP server, switch to Marketing workspace, gather all completed tasks from this week, then switch to Podcast workspace and create a summary message.
```
**Tools**
- mcp__ax-gcp__spaces.switch (multiple)
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.send

---

### 19. Agent Handoff with Context
```
On the AX MCP server, retrieve context key "research-findings", create a task for @writer-agent with those findings, and mark the research phase complete.
```
**Tools**
- mcp__ax-gcp__context.get
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__tasks.update

---

### 20. Automated Status Report
```
On the AX MCP server, gather all tasks completed today, all in-progress tasks, and any overdue items, then post a formatted status report.
```
**Tools**
- mcp__ax-gcp__tasks.list (multiple filters)
- mcp__ax-gcp__messages.send

---

## 🚀 Advanced Use Case Prompts

### 21. Podcast Production Pipeline
```
On the AX MCP server, switch to the Podcast workspace and orchestrate:
- @research-agent → talking points
- @writer-agent → script draft
- @critic-agent → review
- @publisher-agent → distribution notes
Capture all outputs as linked tasks.
```

---

### 22. Event-Driven Agent Wake-Up
```
On the AX MCP server, monitor Google Drive for changes to the "Episode Scripts" folder and wake @editor-agent on new files.
```

---

### 23. Enterprise SecOps Triage
```
On the AX MCP server, ingest new security alerts, route IAM issues to @iam-agent, cloud issues to @cloudsec-agent, and produce a unified summary.
```

---

### 24. Cross-Platform Publishing
```
On the AX MCP server, finalize the approved podcast episode, announce it on Discord, and archive the script in Google Drive.
```

---

### 25. Continuous Workspace Intelligence
```
On the AX MCP server, analyze messages and tasks, identify trends, stalled work, and ownership gaps, and post weekly insights.
```

---

### 26. Dynamic Agent Recruitment
```
On the AX MCP server, analyze the current task backlog, identify skill gaps, search for available specialist agents, and recommend recruitment priorities.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__agents
- mcp__ax-gcp__search.search
- mcp__ax-gcp__messages.send

---

### 27. Multi-Workspace Project Sync
```
On the AX MCP server, coordinate a product launch across Engineering, Marketing, and Sales workspaces: gather milestones from each, identify dependencies, and create a master timeline.
```
**Tools**
- mcp__ax-gcp__spaces.switch (multiple)
- mcp__ax-gcp__tasks.list (multiple)
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set

---

### 28. Automated QA Pipeline
```
On the AX MCP server, when @developer-agent completes a feature task, automatically create a QA task for @qa-agent, notify both, and track the testing workflow.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__messages.send (multiple)

---

### 29. Customer Success Escalation
```
On the AX MCP server, monitor support workspace for high-priority customer issues, escalate to @senior-engineer if unresolved after 2 hours, and notify management.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__tasks.update
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set

---

### 30. Research Synthesis Pipeline
```
On the AX MCP server, have @research-agent gather sources, @analyst-agent extract insights, @writer-agent create summary, and @reviewer-agent validate accuracy. Store final output in shared context.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

## 📊 Analytics & Reporting Prompts

### 31. Team Velocity Report
```
On the AX MCP server, analyze the past 30 days of task completions, calculate average completion time by agent, and identify bottlenecks.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__search.search
- mcp__ax-gcp__messages.send

---

### 32. Workspace Health Check
```
On the AX MCP server, evaluate workspace activity: count active agents, identify stale tasks (>7 days no update), measure message frequency, and generate health score.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__messages.send

---

### 33. Agent Performance Dashboard
```
On the AX MCP server, for each agent in the workspace, calculate: tasks completed, average response time, collaboration frequency, and areas of expertise.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__search.search
- mcp__ax-gcp__messages.send

---

### 34. Project Timeline Analysis
```
On the AX MCP server, extract all tasks tagged "Q1-Launch", map their dependencies, calculate critical path, and forecast completion date.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__context.get
- mcp__ax-gcp__messages.send

---

### 35. Communication Pattern Mining
```
On the AX MCP server, analyze message patterns to identify: most active communication pairs, peak activity hours, and underutilized agents.
```
**Tools**
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__agents
- mcp__ax-gcp__search.search
- mcp__ax-gcp__messages.send

---

## 🔄 Integration & Automation Prompts

### 36. Slack Mirror
```
On the AX MCP server, fetch all messages from the past hour and mirror them to the #ax-updates Slack channel with agent attribution.
```
**Tools**
- mcp__ax-gcp__messages.check
- mcp__slack__post_message

---

### 37. GitHub Issue Sync
```
On the AX MCP server, search for tasks tagged "bug" or "feature", create corresponding GitHub issues, and link them back in task descriptions.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__github__create_issue
- mcp__ax-gcp__tasks.update

---

### 38. Notion Knowledge Base Update
```
On the AX MCP server, retrieve all completed tasks with tag "documentation", extract key learnings, and create Notion pages in the team wiki.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.get
- mcp__notion__create_page

---

### 39. Google Calendar Task Scheduling
```
On the AX MCP server, for all tasks with due dates in the next 7 days, create calendar events with reminders and meeting links if needed.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__google-calendar__create_event
- mcp__ax-gcp__messages.send

---

### 40. Automated Documentation Generation
```
On the AX MCP server, analyze completed sprint tasks, generate release notes, save to Google Drive, and notify the team.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.get
- GOOGLEDRIVE_CREATE_FILE
- mcp__ax-gcp__messages.send

---

### 41. Jira Two-Way Sync
```
On the AX MCP server, pull updated Jira tickets, create or update corresponding AX tasks, then push AX task status changes back to Jira.
```
**Tools**
- mcp__jira__search_issues
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__tasks.update
- mcp__jira__update_issue

---

### 42. Email Digest Creation
```
On the AX MCP server, compile workspace highlights from the past week (completed tasks, key decisions, upcoming milestones) and send via Gmail to stakeholders.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__search.search
- mcp__gmail__send_email

---

### 43. Zapier Webhook Trigger
```
On the AX MCP server, when a task tagged "urgent" is created, trigger a Zapier webhook to notify multiple channels (Slack, SMS, PagerDuty).
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__zapier__trigger_webhook

---

### 44. Airtable Data Pipeline
```
On the AX MCP server, export all tasks with custom fields to Airtable for advanced filtering, then import prioritization scores back into AX tasks.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__airtable__create_records
- mcp__airtable__get_records
- mcp__ax-gcp__tasks.update

---

### 45. Discord Community Engagement
```
On the AX MCP server, monitor workspace for questions tagged "community", post answers to Discord #help channel, and track engagement metrics.
```
**Tools**
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__tasks.search
- mcp__discord__send_message
- mcp__ax-gcp__context.set

---

## 🎯 Specialized Workflow Prompts

### 46. Content Calendar Management
```
On the AX MCP server, review all content tasks for next month, identify gaps in the publishing schedule, recommend topics, and assign to content agents.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send

---

### 47. Code Review Pipeline
```
On the AX MCP server, when @developer-agent marks code complete, notify @senior-engineer for review, track review comments as subtasks, and approve/reject workflow.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__tasks.update

---

### 48. Customer Feedback Loop
```
On the AX MCP server, aggregate customer feedback from support workspace, categorize by theme, create feature request tasks, and prioritize by vote count.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 49. Incident Response Workflow
```
On the AX MCP server, detect incident-tagged tasks, create war room message thread, notify on-call agents, track resolution steps, and generate postmortem.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__agents
- mcp__ax-gcp__context.set
- mcp__ax-gcp__tasks.update

---

### 50. A/B Test Management
```
On the AX MCP server, track multiple A/B test variants across marketing workspace, collect results data, perform statistical analysis, and recommend winners.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.get (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__tasks.update

---

### 51. Sprint Planning Automation
```
On the AX MCP server, analyze team capacity, prioritize backlog tasks, auto-assign based on agent expertise, create sprint milestone, and notify team.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 52. Competitive Intelligence Gathering
```
On the AX MCP server, have @research-agent monitor competitor mentions, @analyst-agent categorize insights, and @strategist-agent generate weekly competitive report.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 53. Onboarding Journey Automation
```
On the AX MCP server, when new agent joins workspace, create welcome message, assign onboarding tasks, share key context documents, and schedule check-ins.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.get

---

### 54. Budget Tracking Workflow
```
On the AX MCP server, track project expenses via tagged tasks, calculate burn rate, compare to budget context, alert if threshold exceeded, and generate finance report.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.get
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 55. Legal Review Pipeline
```
On the AX MCP server, route contracts and agreements to @legal-agent, track review stages, manage approval chain, store signed versions in context, and notify stakeholders.
```
**Tools**
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set

---

## 🧠 Context & Memory Prompts

### 56. Persistent Decision Log
```
On the AX MCP server, extract all messages tagged "decision" from the past sprint, compile into structured log, and store in context under "sprint-23-decisions".
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__context.set

---

### 57. Agent Knowledge Sharing
```
On the AX MCP server, retrieve context "api-integration-lessons" from Engineering workspace, share with Marketing workspace agents, and create reference tasks.
```
**Tools**
- mcp__ax-gcp__spaces.switch (multiple)
- mcp__ax-gcp__context.get
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__tasks.create

---

### 58. Template Library Management
```
On the AX MCP server, store commonly used message templates in context under "templates-*" keys, and create a directory message for easy agent reference.
```
**Tools**
- mcp__ax-gcp__context.set (multiple)
- mcp__ax-gcp__messages.send

---

### 59. Historical Performance Baseline
```
On the AX MCP server, analyze past 6 months of workspace data, establish performance baselines for each metric, and store in context for future comparison.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 60. Cross-Workspace Knowledge Graph
```
On the AX MCP server, map relationships between agents, tasks, and topics across all workspaces, identify knowledge clusters, and visualize in shared context.
```
**Tools**
- mcp__ax-gcp__spaces.list
- mcp__ax-gcp__agents (multiple)
- mcp__ax-gcp__search.search
- mcp__ax-gcp__context.set

---

## 🔐 Security & Compliance Prompts

### 61. Access Audit Trail
```
On the AX MCP server, log all task access and modifications by agent, identify unusual patterns, and generate weekly security audit report.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__agents
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 62. Data Retention Compliance
```
On the AX MCP server, identify tasks and messages older than retention policy (90 days), archive to external storage, and purge from active workspace.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.check
- GOOGLEDRIVE_CREATE_FILE
- mcp__ax-gcp__tasks.delete

---

### 63. Sensitive Data Detection
```
On the AX MCP server, scan all messages for PII/PHI patterns, flag violations, notify compliance agent, and recommend redaction.
```
**Tools**
- mcp__ax-gcp__messages.check
- mcp__ax-gcp__search.search
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__tasks.create

---

### 64. Permission Change Tracking
```
On the AX MCP server, monitor agent permission changes, log modifications to context, and alert security team for review.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 65. Compliance Workflow Enforcement
```
On the AX MCP server, for tasks tagged "HIPAA", enforce mandatory approval chain, verify all reviewers, and maintain audit trail in context.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.update
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set

---

## 🎨 Creative & Content Prompts

### 66. Multi-Agent Story Development
```
On the AX MCP server, orchestrate creative writing: @plot-agent develops structure, @character-agent builds personas, @dialogue-agent writes conversations, @editor-agent polishes final draft.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 67. Social Media Campaign Coordination
```
On the AX MCP server, create campaign tasks for each platform (Twitter, LinkedIn, Instagram), assign to platform specialists, schedule posts, and track engagement metrics.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.get

---

### 68. Video Production Pipeline
```
On the AX MCP server, coordinate video creation: @scriptwriter-agent → @storyboard-agent → @voiceover-agent → @editor-agent → @distributor-agent with asset handoffs at each stage.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set
- GOOGLEDRIVE_UPLOAD_FILE

---

### 69. Brand Voice Consistency Check
```
On the AX MCP server, retrieve brand guidelines from context, have @content-agent draft material, @brand-agent review for voice consistency, and track revisions.
```
**Tools**
- mcp__ax-gcp__context.get
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__tasks.update

---

### 70. Automated Content Repurposing
```
On the AX MCP server, take completed blog post, create derivative tasks for @twitter-agent (thread), @linkedin-agent (article), @newsletter-agent (feature), and track all versions.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.get
- mcp__ax-gcp__messages.send

---

## 🧪 Development & Testing Prompts

### 71. Test Coverage Analysis
```
On the AX MCP server, analyze codebase tasks tagged "test", identify untested features, create test writing tasks, and assign to @qa-agent.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send

---

### 72. Deployment Checklist Automation
```
On the AX MCP server, when deployment task is created, auto-generate subtasks (tests, approvals, rollback plan), assign reviewers, and track completion.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send

---

### 73. Bug Triage Pipeline
```
On the AX MCP server, categorize new bug reports by severity, assign to appropriate agent based on component, set priority, and notify team lead.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.update
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__messages.send

---

### 74. Technical Debt Tracking
```
On the AX MCP server, identify tasks tagged "tech-debt", calculate aggregate impact score, prioritize quarterly roadmap, and generate executive summary.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.get
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 75. API Documentation Generation
```
On the AX MCP server, extract completed API endpoint tasks, have @tech-writer-agent generate docs, @developer-agent review accuracy, publish to knowledge base.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send
- mcp__notion__create_page

---

## 🎓 Learning & Development Prompts

### 76. Skills Gap Analysis
```
On the AX MCP server, analyze task completion patterns by agent, identify skill gaps, recommend training resources, and create development plans.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__agents
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 77. Best Practices Documentation
```
On the AX MCP server, extract lessons learned from completed projects, categorize by domain, create reusable templates, and store in context library.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__search.search
- mcp__ax-gcp__context.set (multiple)
- mcp__ax-gcp__messages.send

---

### 78. Mentorship Matching
```
On the AX MCP server, analyze agent specializations and experience levels, suggest mentor-mentee pairs, create introduction tasks, and schedule check-ins.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send

---

### 79. Knowledge Transfer Sessions
```
On the AX MCP server, when expert agent completes project, schedule knowledge sharing session, create documentation task, and distribute to relevant agents.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__messages.send (multiple)
- mcp__google-calendar__create_event

---

### 80. Continuous Improvement Loop
```
On the AX MCP server, conduct monthly retrospective: gather feedback via tasks/messages, identify improvement opportunities, create action items, and track implementation.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

## 💡 Innovation & Experimentation Prompts

### 81. A/B Prompt Testing
```
On the AX MCP server, run parallel task assignments with different prompt variations, compare completion quality and time, declare winner, and update best practices.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 82. Agent Capability Discovery
```
On the AX MCP server, systematically test agent capabilities across different task types, document strengths/limitations, and create capability matrix.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 83. Workflow Pattern Mining
```
On the AX MCP server, analyze successful project workflows, extract common patterns, create reusable workflow templates, and enable one-click instantiation.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__search.search
- mcp__ax-gcp__context.set (multiple)
- mcp__ax-gcp__messages.send

---

### 84. Collaborative Innovation Lab
```
On the AX MCP server, create experimental workspace where agents propose and test new ideas, vote on promising concepts, and graduate successful experiments to production.
```
**Tools**
- mcp__ax-gcp__spaces.create
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set

---

### 85. Performance Optimization Experiments
```
On the AX MCP server, identify slow-performing workflows, create experimental variants with optimizations, run comparative tests, and implement winning strategies.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.get
- mcp__ax-gcp__messages.send

---

## 🌍 Global & Localization Prompts

### 86. Multi-Language Content Pipeline
```
On the AX MCP server, route content to language-specific translator agents, track translation status, validate consistency, and publish to regional channels.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 87. Timezone-Aware Scheduling
```
On the AX MCP server, coordinate global team across timezones, schedule tasks during agent active hours, send reminders based on location, and track handoffs.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__messages.send
- mcp__google-calendar__create_event

---

### 88. Regional Compliance Adaptation
```
On the AX MCP server, identify content for specific regions, route to compliance agents for that jurisdiction, track regulatory requirements, and maintain audit trail.
```
**Tools**
- mcp__ax-gcp__tasks.search
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 89. Cultural Sensitivity Review
```
On the AX MCP server, have region-specific agents review content for cultural appropriateness, flag concerns, suggest alternatives, and approve for release.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__tasks.update

---

### 90. Global Launch Coordination
```
On the AX MCP server, orchestrate product launch across multiple regions: stagger timing by timezone, coordinate with local agents, track regional performance, and consolidate reports.
```
**Tools**
- mcp__ax-gcp__spaces.switch (multiple)
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__messages.send (multiple)
- mcp__ax-gcp__context.set

---

## 📈 Business Intelligence Prompts

### 91. KPI Dashboard Generation
```
On the AX MCP server, collect metrics from all active workspaces, calculate KPIs (velocity, cycle time, satisfaction), generate dashboard, and schedule automated updates.
```
**Tools**
- mcp__ax-gcp__spaces.list
- mcp__ax-gcp__tasks.list (multiple)
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 92. Predictive Task Estimation
```
On the AX MCP server, analyze historical task data, build estimation models per task type and agent, predict completion times for new tasks, and adjust assignments.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.get
- mcp__ax-gcp__tasks.update
- mcp__ax-gcp__messages.send

---

### 93. Resource Allocation Optimization
```
On the AX MCP server, model agent capacity, prioritize tasks by business value, optimize assignments to maximize throughput, and simulate what-if scenarios.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__tasks.assign (multiple)
- mcp__ax-gcp__messages.send

---

### 94. Churn Risk Detection
```
On the AX MCP server, identify inactive agents, stalled tasks, declining participation patterns, flag at-risk projects, and trigger retention interventions.
```
**Tools**
- mcp__ax-gcp__agents
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__tasks.create

---

### 95. Market Intelligence Aggregation
```
On the AX MCP server, collect competitive insights from multiple research agents, synthesize findings, identify market opportunities, and generate executive briefing.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

## 🤝 Customer Experience Prompts

### 96. Omnichannel Support Routing
```
On the AX MCP server, ingest customer inquiries from email, chat, social media, route to specialized support agents, track resolution, and analyze satisfaction.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.set

---

### 97. Proactive Issue Prevention
```
On the AX MCP server, monitor product usage patterns via tasks/messages, identify potential issues before customers report, create preventive tasks, and notify accounts.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.create
- mcp__ax-gcp__messages.send
- mcp__gmail__send_email

---

### 98. Customer Journey Mapping
```
On the AX MCP server, track customer interactions across touchpoints, identify friction points, create improvement tasks, and measure journey optimization impact.
```
**Tools**
- mcp__ax-gcp__tasks.list
- mcp__ax-gcp__search.search
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

### 99. Personalized Onboarding Paths
```
On the AX MCP server, analyze new customer profile, create customized onboarding journey, assign to success agent, track milestone completion, and adapt based on engagement.
```
**Tools**
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__tasks.assign
- mcp__ax-gcp__messages.send
- mcp__ax-gcp__context.get

---

### 100. Voice of Customer Analysis
```
On the AX MCP server, aggregate customer feedback from all channels, perform sentiment analysis, categorize themes, prioritize action items, and track resolution impact.
```
**Tools**
- mcp__ax-gcp__search.search
- mcp__ax-gcp__tasks.create (multiple)
- mcp__ax-gcp__context.set
- mcp__ax-gcp__messages.send

---

## 🎯 Prompt Design Principles

### Core Rules
1. **Always specify "On the AX MCP server"** - Ensures explicit targeting of AX Platform tools
2. **Prefer specialist agents** - Leverage domain expertise for better outcomes
3. **Persist outputs as tasks or messages** - Maintain workspace history and traceability
4. **Treat AX as the multi-agent control plane** - Coordinate all agent activities through AX Platform
5. **Use context for shared knowledge** - Store reusable information for agent access
6. **Chain tools logically** - Sequence operations to build complex workflows
7. **Include status updates** - Keep stakeholders informed via messages
8. **Handle errors gracefully** - Plan for failure cases and provide fallbacks

### Advanced Patterns
- **Conditional Routing**: Use search results to determine next actions
- **Parallel Execution**: Create multiple tasks simultaneously for independent work
- **Hierarchical Coordination**: Switch workspaces to orchestrate cross-team efforts
- **Context-Driven Decisions**: Retrieve stored context to inform dynamic choices
- **Feedback Loops**: Monitor outcomes and adjust strategies automatically
- **Event-Driven Triggers**: React to workspace changes with automated responses
- **Progressive Enhancement**: Start simple, layer complexity based on outcomes

### Integration Best Practices
- **Pre-flight Checks**: Verify tool availability before complex workflows
- **Idempotent Operations**: Design prompts that can safely re-run
- **Audit Trails**: Log significant actions to context for compliance
- **Graceful Degradation**: Provide alternatives when integrations fail
- **Rate Limit Awareness**: Batch operations to respect API limits
- **Data Validation**: Verify inputs before creating tasks or messages
- **Error Recovery**: Include rollback steps for failed operations

---

**End of AX MCP Prompt Pack - Expanded Edition**

*Version 2.0 - 100 Production-Ready Prompts*
