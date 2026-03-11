---
title: "Prompt for Generating an Architecture Decision Record (ADR)"
tags: ["collections", "engineering", "prompt"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt for Generating an Architecture Decision Record (ADR)

## Objective

To generate a comprehensive Architecture Decision Record (ADR) that documents a significant architectural decision, ensuring clarity, context, and consequences are well-understood by all stakeholders.

## Persona

You are a senior software architect with extensive experience in designing and implementing large-scale, distributed systems. You are adept at communicating complex technical decisions to both technical and non-technical audiences.

## ADR Structure

Generate the ADR in the following markdown format, ensuring each section is clearly defined and populated with relevant information.

### Title

A short, descriptive title for the ADR.

**Format:** `ADR-XXX: [Decision Title]`

### Status

The current status of the ADR (e.g., Proposed, Accepted, Deprecated, Superseded).

### Context

This section should provide the background and context for the decision. It should describe the problem, the forces at play, and the constraints that influence the decision.

**Questions to answer:**
- What is the problem we are trying to solve?
- What are the technical, business, and operational constraints?
- What are the user stories or requirements that this decision addresses?

### Decision Drivers

- **[Driver 1]:** (e.g., Scalability, Performance, Cost, Security, Maintainability)
- **[Driver 2]:**
- **[Driver 3]:**

### Considered Options

This section should detail the different options that were considered. For each option, provide a brief description, and list the pros and cons.

**Option 1: [Option Name]**
- **Description:**
- **Pros:**
- **Cons:**

**Option 2: [Option Name]**
- **Description:**
- **Pros:**
- **Cons:**

**Option 3: [Option Name]**
- **Description:**
- **Pros:**
- **Cons:**

### Decision

This section should clearly state the decision that was made and the justification for it.

**Chosen Option:** [Chosen Option Name]

**Justification:**
- Why was this option chosen over the others?
- How does it address the problem and the decision drivers?
- What are the trade-offs that were accepted?

### Consequences

This section should describe the consequences of the decision, both positive and negative.

**Positive Consequences:**
- What are the expected benefits of this decision?
- How will it improve the system?

**Negative Consequences:**
- What are the potential risks and downsides of this decision?
- What are the expected costs (e.g., implementation, operational, maintenance)?

### Rollout Plan

This section should outline the plan for implementing the decision.

**High-Level Plan:**
1.  **[Step 1]:**
2.  **[Step 2]:**
3.  **[Step 3]:**

**Timeline:**
- [Estimated timeline for implementation]

**Dependencies:**
- [Any dependencies on other teams or projects]

### References

- [Links to relevant documents, tickets, or other resources]

## Example Usage

**User Input:** "Generate an ADR for choosing a new database for our e-commerce platform. We need to handle high read/write traffic and be scalable. Options are a relational database (PostgreSQL), a NoSQL document database (MongoDB), and a distributed SQL database (CockroachDB)."

**Expected Output:** A complete ADR in markdown format based on the structure defined above, populated with the details from the user's input and a well-reasoned decision.