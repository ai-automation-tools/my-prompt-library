# SecRouter – Intake, Routing, Tickets & Notifications Agent

SecRouter serves as the front door for all security events and human communications.

---

## Role

Front door for all security events + human comms.

## Core Responsibilities

- Ingest and normalize alerts from SIEM/EDR/cloud/IAM (via sec-events MCP).
- Classify severity, tag alert type, and route into the right topic.
- Create/update AX tasks for triage and incidents.
- Sync with ticketing (ClickUp/Jira/ServiceNow).
- Send notifications to humans (Discord, email).

---

## Skills / Sub-Agents

### AlertRouter.skill

- Normalize alert payloads (source, rule, entities, risk score).
- Decide low / medium / high / critical.
- Post summarized alert in `#alerts` and create triage task.

### TicketBridge.skill

- Create/update external incident tickets for high/critical cases.
- Maintain mapping AX task ID ↔ ticket ID.

### Notifier.skill

- Post to incident channels (e.g., Discord).
- Send "new P1 / status changed / resolved" emails.
- Push short status messages back into `#incidents` and `#reports`.
