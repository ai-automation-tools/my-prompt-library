---
title: "Notion MCP Prompt Library (+ Prompts)"
tags: ["mcp-servers", "notes", "notion"]
category: "MCP_Servers"
subcategory: "Notes"
---
# Notion MCP Prompt Library (30+ Prompts)

A ready‑to‑use prompt library for working with Notion via MCP. Store these in a Notion “Prompt Library” database and tag by use case (Projects, Tasks, Knowledge, etc.).

---

## General workspace management

1. **Workspace overview and routing**

   “Scan my Notion workspace and summarize the main teams, projects, and knowledge hubs you can see. Then explain how you’ll decide where to store new content for me.”

2. **Avoid duplicates**

   “When I ask for a new page, always check first if a similar page exists. If it does, propose updating or linking instead of creating a duplicate, and ask me to confirm.”

3. **Change summaries**

   “Whenever you create or modify a Notion page for me, reply with: (a) the page title, (b) its URL, (c) the database or parent page, and (d) a one‑sentence summary of what changed.”

4. **Structure proposals first**

   “When I give you a rough idea (‘plan my week’, ‘set goals for Q2’, etc.), suggest 3–5 candidate Notion structures (databases vs pages, key properties, views) before creating anything, and wait for my choice.”

---

## Project and task management

5. **Project brief template**

   “Create a ‘Project Brief’ page in my Projects area with sections for: Overview, Goals, Scope, Timeline, Risks, Stakeholders, and Next Actions. Then ask me 5 clarifying questions and add my answers into the page.”

6. **Smart task creation**

   “Add a new task to my main tasks database with clear title, status, due date, project link, and priority. If I don’t specify these, infer reasonable defaults and then show me what you chose so I can adjust.”

7. **Daily task review**

   “Once per day when I ask ‘review my tasks’, fetch tasks due today or overdue, group them by project, and output: (a) quick summary, (b) suggested top 3 priorities, and (c) a short focus plan for the day.”

8. **Fast capture to inbox**

   “When I say ‘capture this as a task’, create a task with my exact wording, plus a short AI‑generated description and a suggested next physical action. Place it in my inbox section of the tasks database.”

9. **Project cockpit**

   “Given a project name, search my Notion workspace for all related pages and tasks, and generate a ‘Project cockpit’ summary with links, key deadlines, and open action items.”

---

## Knowledge base / notes

10. **Research capture page**

    “When I paste in long text (articles, docs, transcripts), create a Notion page in my Knowledge or Resources area with: title, TL;DR, key ideas list, action items, and a quote bank section.”

11. **Permanent note creation**

    “If I write ‘turn this into a permanent note’, create a note in my knowledge database that: (a) is rewritten in my voice, (b) links to at least 2 related notes if they exist, and (c) has 3–5 tags you infer.”

12. **Contextual metadata**

    “For every new knowledge note, add a short ‘Why this matters’ section and a ‘How I might use this’ section, filled in by you based on the content.”

13. **Topic clustering and hubs**

    “When I say ‘organize my notes about X’, search for all pages mentioning X, propose 2–3 ways to cluster them into themes, then create or update hub pages that link out to each cluster.”

---

## Meetings and documentation

14. **Meeting notes template**

    “When I say ‘create meeting notes for [meeting name]’, create a page with sections: Agenda, Attendees, Discussion, Decisions, Action Items (with owners and due dates). Then ask 3 questions to help me fill it in.”

15. **Transcript → decisions & actions**

    “Given a messy meeting transcript, extract decisions and action items into a clean Notion meeting notes page, and create or update related tasks in my task database.”

16. **Weekly review template**

    “Set up a recurring ‘Weekly Review’ page template in Notion with sections: Wins, Challenges, Metrics, Open Loops, Next Week’s Top 3. When I ask ‘start weekly review’, duplicate and fill it with suggestions.”

17. **Brainstorming pages**

    “For any planning or brainstorming session, create a page with toggles for: Brain dump, Ideas, Pros/Cons, Constraints, Decision, and Next Steps. Use headings and bullets so it’s easy to skim.”

---

## Content creation (writing, social, etc.)

18. **Content piece page**

    “Create a ‘Content Piece’ page in my content database with properties for Status, Channel, Due Date, Target Audience, and Offer. Inside the page, add sections for Outline, Draft, Hooks, and Call‑to‑Action.”

19. **Content idea capture**

    “When I say ‘capture a content idea’, add a new row in my content ideas database with: idea title, short description, 3 potential titles or hooks, and tags for topic and format.”

20. **Topic → outline**

    “Given a topic, create a Notion page that outlines a full article or video (headline, sections, bullet points), and link it to any existing related ideas or research notes in my workspace.”

21. **Editorial calendar view**

    “Build a simple editorial calendar view in my content database: group by week, show status, channel, due date, and link each card to its content page.”

---

## Personal productivity and planning

22. **Daily log database**

    “Create a ‘Daily Log’ database if it doesn’t exist, and each time I say ‘log my day’, add an entry with fields for Energy, Focus, Mood, and Highlights. Inside the page, summarize my day in 3 bullet points.”

23. **Weekly planning**

    “When I ask ‘plan my week’, build a weekly planning page with: priorities by area (work, personal, learning), linked tasks pulled from my task database, and a short plan for each day.”

24. **Structured goal pages**

    “Turn any vague goal I give you into a structured Notion goal page with: Outcome, Why it matters, Timeframe, Milestones, Metrics, and Risks, and link it to relevant projects or tasks.”

25. **Goal review**

    “When I say ‘review my goals’, fetch active goals from my goals database, and generate a progress update, plus 2–3 suggested adjustments or next steps per goal.”

---

## Databases, structure, and automation prompts

26. **Database reuse vs new**

    “Before you create a new database, check whether a similar one exists. If it does, propose reusing or extending it, and show me a short comparison so I can decide.”

27. **Default database properties**

    “When you create a database, always add sensible default properties: Status, Tags, Created time, Last edited time, and Owner (if applicable), plus any domain‑specific fields you infer from my request.”

28. **Quick capture views**

    “Set up ‘Quick capture’ views or templates for each major database so I can add new entries with minimal fields when I’m in a hurry, and link those views from a central ‘Command Center’ page.”

29. **Restructuring safely**

    “If I ask for ‘better structure’ for an area (like tasks, content, or CRM), scan my existing databases and pages, propose a simpler structure, and then update or merge databases only after I confirm.”

---

## MCP‑specific behavior and safety

30. **Explain actions and scope**

    “Any time you read or write Notion content for me, briefly explain what tools or capabilities you’re about to use, what part of the workspace you’ll touch, and ask for confirmation if the action affects many pages.”

31. **Conservative search scope**

    “When searching in Notion on my behalf, default to the smallest reasonable scope (database or folder) instead of the entire workspace, and tell me what scope you chose.”

32. **Guardrails for destructive changes**

    “If a requested change could be destructive (bulk edits, deletions, schema changes), first generate a step‑by‑step plan and ask me to approve it. After execution, summarize exactly what was changed.”

---
