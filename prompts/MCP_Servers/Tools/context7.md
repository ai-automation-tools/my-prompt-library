# Context7 Prompt Pack (Mike)  
**Targets:** SailPoint IdentityIQ (IIQ), Python, React, PowerShell, + misc scripting  
**Use:** Copy a prompt, replace the `[PLACEHOLDERS]`, run it with Context7.

---

## How to use these prompts
- Replace:
  - `[PRODUCT/LIB]` with *SailPoint IdentityIQ*, *React*, *Python*, *PowerShell*, etc.
  - `[GOAL]` with what you’re trying to do
  - `[VERSION]` if you know it (ex: IIQ 8.x / 8.3)
  - `[CODE/ERROR]` with your snippet or error output
- When you want *only verified info*, add: **“Use Context7 sources only.”**
- When you want *exact output structure*, add: **“Output exactly in the format requested.”**

---

# 1) SailPoint IdentityIQ (IIQ) Prompts

## 1.1 Admin / Configuration
- **“Using Context7 sources only: explain how to configure `[FEATURE]` in SailPoint IdentityIQ `[VERSION]`. Include admin UI path + required objects/settings.”**
- **“Show the correct configuration steps to enable `[CONNECTOR / APPLICATION TYPE]` in IdentityIQ. Include required attributes and common failures.”**
- **“What are best practices for IdentityIQ aggregation scheduling, deltas, and avoiding performance impact?”**

## 1.2 Lifecycle Manager (LCM)
- **“Using Context7, show how to implement an LCM workflow for `[JOINER/MOVER/LEAVER]`. Include example workflow steps and object model references.”**
- **“How do approvals work in IIQ LCM for `[ACCESS REQUEST / ROLE REQUEST]`? Provide an example approval chain design.”**
- **“Explain the difference between IdentityIQ Access Request vs Role Request vs Entitlement Request. Give examples.”**

## 1.3 Identity / Account Aggregation
- **“Using Context7: explain how IdentityIQ correlates accounts to identities. Include correlation rules, identity attributes, and common mis-correlation fixes.”**
- **“How do you troubleshoot account aggregation failures in IIQ? Provide a step-by-step checklist.”**
- **“Show the correct way to build a correlation rule for `[SOURCE]` (ex: AD, AzureAD, Workday). Provide sample logic and pitfalls.”**

## 1.4 Roles / Entitlements / Policies
- **“Using Context7: describe best practices for role modeling in IdentityIQ (IT roles vs business roles). Include anti-patterns.”**
- **“How do you design and validate Separation of Duties (SoD) policies in IIQ? Provide example policy structures.”**
- **“Explain identity risk scoring in IdentityIQ and what inputs affect it.”**

## 1.5 Rules (Beanshell / Java-ish logic)
- **“Using Context7: show a safe example of a SailPoint IdentityIQ rule for `[RULE TYPE]` (ex: Correlation, BuildMap, Customization). Include required imports and object usage.”**
- **“Give a minimal working example of an IdentityIQ rule that reads an identity attribute and sets a provisioning plan value.”**
- **“Explain how IIQ rules execute (context objects available, performance impacts, logging) and how to debug them.”**

## 1.6 Workflows
- **“Using Context7: show an IdentityIQ workflow example for `[USE CASE]` including transitions and approval steps.”**
- **“How do you pass variables between workflow steps in IIQ? Provide example XML and explanation.”**
- **“Explain common workflow failures (stuck approvals, timeouts, missing variables) and remediation steps.”**

## 1.7 Provisioning / Connectors
- **“Using Context7: explain how provisioning works in IIQ (provisioning plans, identity refresh, request objects). Provide a clean mental model.”**
- **“Show an example of provisioning an entitlement to `[TARGET SYSTEM]` from IIQ, including plan construction and error handling.”**
- **“What are the recommended connector settings for performance and reliability for `[TARGET]`?”**

## 1.8 Reports / Audit / Compliance
- **“Using Context7: list the audit events captured by IdentityIQ and how to query/report on `[EVENT TYPE]`.”**
- **“How do certifications work in IIQ? Provide a certification campaign design checklist.”**
- **“Show best practices for access reviews/certifications in IIQ for SOX/SOC2 alignment.”**

## 1.9 Troubleshooting / Operations
- **“Using Context7: give me a structured troubleshooting runbook for `[IIQ ISSUE]` (aggregation failures / stuck tasks / slow UI).”**
- **“Where do logs show `[PROBLEM]` in IdentityIQ and how do I enable debug logging safely?”**
- **“What are the common causes of task failures in IIQ and what data should be captured for root cause analysis?”**

---

# 2) Python Prompts (Automation + IAM-friendly)

## 2.1 API Calls / SDK Usage
- **“Using Context7 docs: show the correct way to call `[API]` in Python using `[LIBRARY]` (requests/httpx). Include retries, timeouts, and safe logging.”**
- **“Give a minimal example of OAuth2 client credentials flow in Python for `[IDP]` (Azure AD/Okta/etc).”**

## 2.2 Identity + Directory Automation
- **“Using Context7: show a Python example to read users/groups from `[DIRECTORY]` (AD/AzureAD/Google) and output JSON/CSV.”**
- **“Provide a Python script pattern to reconcile HR source `[SYSTEM]` to IAM target `[SYSTEM]` with diff logic.”**

## 2.3 Secure Coding Defaults
- **“Using Context7: give secure defaults for TLS verification, secrets management, and logging redaction in Python.”**
- **“Show a safe way to store and rotate API credentials for this script: `[USE CASE]`.”**

## 2.4 Packaging + CLI Tools
- **“Using Context7: create a Python CLI tool design (argparse/typer) for `[TASK]` with examples.”**
- **“Show how to structure a Python project for automation: config, logging, retries, tests.”**

## 2.5 Debug / Fix
- **“Using Context7: debug this Python error and provide a corrected minimal example: `[CODE/ERROR]`.”**
- **“Explain the likely causes of this exception and how to harden the code: `[TRACEBACK]`.”**

---

# 3) React Prompts (UI + IAM Dashboards)

## 3.1 Project Setup / Patterns
- **“Using Context7 sources only: show the recommended setup for a React app using `[TOOLING]` (Vite/Next.js). Include folder structure.”**
- **“Give best practices for React state management for a dashboard that shows identities, entitlements, and approvals.”**

## 3.2 Components + Data Fetching
- **“Using Context7: show a React example that fetches from `[API]` with proper loading/error states and abort handling.”**
- **“Provide an example table UI for identities/entitlements with pagination, search, and filters.”**

## 3.3 Auth / Security
- **“Using Context7: show how to implement authentication in React with `[OIDC/OAuth2 provider]`. Include secure token handling guidance.”**
- **“What are common React security pitfalls (XSS, token storage) and how do I avoid them?”**

## 3.4 Debug / Fix
- **“Using Context7: fix this React error and explain the root cause: `[ERROR]`.”**
- **“Optimize this React component for performance and avoid unnecessary renders: `[CODE]`.”**

---

# 4) PowerShell Prompts (Enterprise + IAM Ops)

## 4.1 AD / Windows IAM Automation
- **“Using Context7: show PowerShell examples for enumerating AD users/groups and exporting to CSV securely.”**
- **“Provide a PowerShell script template to disable users, remove from groups, and log actions for audit.”**

## 4.2 Graph / Cloud Automation
- **“Using Context7: show how to call Microsoft Graph from PowerShell for `[TASK]` using modern auth.”**
- **“Give me a robust PowerShell pattern for API pagination, throttling handling, and retries.”**

## 4.3 Security + Logging
- **“Using Context7: show best practices for secure credential handling in PowerShell (no plaintext).”**
- **“How should I structure logging so the script is audit-friendly and doesn’t leak secrets?”**

## 4.4 Troubleshooting
- **“Using Context7: debug this PowerShell error and provide corrected code: `[ERROR/CODE]`.”**
- **“Explain what this output means and how to remediate: `[OUTPUT]`.”**

---

# 5) Other Scripting Languages (Bash, JS/Node, Go, etc.)

## 5.1 Bash
- **“Using Context7: write a Bash script for `[TASK]` with strict mode, safe error handling, and clean logging.”**
- **“Show secure ways to handle secrets in Bash without exposing them in process lists.”**

## 5.2 Node.js / JavaScript
- **“Using Context7: show a Node.js script to call `[API]` with retries, timeouts, and structured logging.”**
- **“Provide an example of validating incoming JSON payloads safely (schema validation) in Node.”**

## 5.3 Go
- **“Using Context7: create a Go CLI tool skeleton for `[TASK]` with config + logging + retries.”**
- **“Show an example of OAuth2 client credentials flow in Go for `[IDP]`.”**

## 5.4 SQL
- **“Using Context7: write SQL queries to detect orphaned accounts, duplicate identities, and risky entitlements from `[TABLES/SCHEMA]`.”**
- **“Give a safe query pattern for audit reporting with time-bounded filtering and least-privilege assumptions.”**

---

# 6) Universal “Make It Production-Ready” Prompts

- **“Using Context7 sources only: rewrite this into production-ready code with secure defaults and explain key changes: `[CODE]`.”**
- **“Add structured logging, input validation, and safe error handling to this script: `[CODE]`.”**
- **“Convert this POC into an enterprise-safe version: retries, backoff, timeouts, secrets handling: `[CODE]`.”**
- **“Generate a runbook + troubleshooting checklist for this automation: `[SCRIPT PURPOSE]`.”**

---

# 7) Output Format Controllers (Highly Recommended)

## 7.1 “Checklist + Code”
- **“Using Context7: Output exactly: (1) checklist, (2) minimal code, (3) common pitfalls, (4) validation steps.”**

## 7.2 “Only Code”
- **“Using Context7 sources only: output only the final code block. No explanation.”**

## 7.3 “Explain Like I’m Busy”
- **“Using Context7: give me the shortest correct answer + one example.”**

---

# 8) Quick Copy Templates

## 8.1 Debug Template
**Prompt:**  
“Use Context7 sources only. Debug this issue.  
- Goal: `[GOAL]`  
- Error/output:  
`[PASTE ERROR]`  
- Current code:  
```  
[PASTE CODE]  
```  
Return: root cause + corrected code + prevention checklist.”

## 8.2 Build Template
**Prompt:**  
“Use Context7 sources only. Build `[THING]` for `[GOAL]` using `[LIB]`.  
Constraints: `[ENV / SECURITY / PERFORMANCE]`  
Output: minimal example + best practices + pitfalls.”

---

## If you want, I can also generate:
- a **IIQ-specific runbook prompt pack** (rules/workflows/provisioning deep dive)
- a **Cloud IAM prompt pack** (Azure AD / Entra, Okta, Ping, Duo)
- a **“Context7 prompt style guide”** (how to get consistent citations + code quality)
