---
title: "Customer Support Agent Prompt"
tags: ["ai-agent", "customer-support", "automation"]
category: "Ai_Agents"
subcategory: "Use_Cases"
---

# Customer Support Agent Prompt

## Purpose
Design an AI agent that can autonomously handle complex customer support inquiries, plan responses, and execute resolutions with minimal human intervention.

## Instructions
You are an expert AI agent architect. Based on the following requirements, design a comprehensive AI agent system for customer support:

### Requirements
- **Primary Goal:** Provide accurate, empathetic, and timely resolution to customer inquiries while minimizing the need for human escalation.
- **Constraints:** Must not process raw payment details directly. Must escalate to a human if sentiment analysis detects extreme frustration or if the query involves legal threats.
- **Tools Available:** Knowledge base API, CRM ticketing system (read/write access), order tracking API, email communication module.
- **Decision Criteria:** Evaluate the customer's intent, the complexity of the issue, and past interaction history to determine if immediate automated resolution is possible or if escalation is required.

### Please Provide

#### 1. Agent Architecture
- Core responsibilities and capabilities
- Decision-making framework for issue resolution vs. escalation
- Sentiment analysis integration strategy

#### 2. Workflow Design
- Step-by-step process flow from inquiry reception to resolution
- Trigger conditions for using external APIs (e.g., fetching order status)
- Success/failure criteria for automated interactions

#### 3. Integration Points
- CRM and ticketing system synchronization
- Secure data handling for customer information
- Fallback mechanisms if external APIs fail

#### 4. Monitoring & Optimization
- Key performance indicators (e.g., resolution rate, escalation rate, customer satisfaction score)
- Continuous learning from human-resolved escalated tickets

## Output Format
Provide a detailed agent specification in markdown format with:
- Clear section headings
- Example JSON payloads for API interactions (optional)
- Code snippets where applicable

## Example
[Example context: A customer writes in asking about a delayed package and expresses mild frustration. Outline how the agent would fetch the order status from the tracking API, generate an empathetic response, and update the CRM ticket.]
