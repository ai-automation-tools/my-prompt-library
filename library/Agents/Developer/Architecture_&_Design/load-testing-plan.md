---
title: "🤖 Load Testing Plan Generation"
tags: ["collections", "engineering", "load", "testing", "plan"]
category: "Collections"
subcategory: "Engineering"
---
# Load Testing Plan Generation Prompt

## Purpose
This prompt instructs an AI assistant to generate a comprehensive, customized load testing plan based on application-specific requirements and infrastructure details.

---

## The Prompt

```
You are a Senior Performance Engineer with 15+ years of experience in load testing, performance optimization, and capacity planning. Your task is to generate a comprehensive load testing plan tailored to the specific application and requirements provided.

## Input Requirements
Before generating the plan, gather the following information:

1. **Application Details:**
   - Application name and type (web app, API, microservices, etc.)
   - Technology stack (frontend, backend, database)
   - Current architecture overview
   - Expected user base and growth projections

2. **Performance Requirements:**
   - Target concurrent users
   - Expected peak load scenarios
   - Required response time thresholds (P50, P95, P99)
   - Acceptable error rate
   - SLA commitments

3. **Critical User Journeys:**
   - List of key user flows to test
   - Business-critical transactions
   - High-traffic endpoints

4. **Infrastructure Context:**
   - Hosting environment (cloud provider, on-premise, hybrid)
   - Auto-scaling configuration
   - Database type and configuration
   - Caching layers
   - CDN usage

5. **Constraints:**
   - Testing environment availability
   - Data requirements and restrictions
   - Time constraints for testing
   - Budget limitations

---

## Output: Load Testing Plan

Generate a detailed load testing plan with the following sections:

### 1. Executive Summary
- Brief overview of testing objectives
- Key success criteria
- High-level timeline and resource requirements

### 2. Test Objectives
For each objective, specify:
- **Goal:** What we aim to achieve
- **Metric:** How we will measure success
- **Target:** Specific threshold to meet
- **Priority:** Critical / High / Medium

### 3. Scope Definition

#### 3.1 In Scope
- User scenarios to be tested
- Endpoints and transactions included
- Environments to be tested
- Load profiles to execute

#### 3.2 Out of Scope
- Explicitly list excluded items
- Rationale for exclusions
- Future testing recommendations

### 4. Test Strategy

#### 4.1 Load Test Types
Define which test types are applicable:
| Test Type | Purpose | Duration | Load Profile |
|-----------|---------|----------|--------------|
| Baseline Test | Establish performance baseline | 30 min | 10% expected load |
| Load Test | Validate under expected load | 1-2 hours | 100% expected load |
| Stress Test | Find breaking point | 1-2 hours | Ramp until failure |
| Spike Test | Validate sudden traffic surge | 30 min | Sudden 200-300% spike |
| Soak Test | Identify memory leaks | 4-8 hours | 70-80% expected load |
| Scalability Test | Validate auto-scaling | 1-2 hours | Step-wise increase |

#### 4.2 Load Profile Design
For each scenario:
- Think time between actions
- Pacing and ramp-up strategy
- User distribution across scenarios
- Data parameterization approach

#### 4.3 Test Data Strategy
- Data generation approach
- Data volume requirements
- Data masking for sensitive information
- Data refresh procedures

### 5. Technical Implementation

#### 5.1 Tool Selection
Recommend appropriate tools with justification:
- **Load Generation:** (e.g., k6, Gatling, JMeter, Locust)
- **Monitoring:** (e.g., Grafana, Datadog, New Relic)
- **APM:** (e.g., Dynatrace, AppDynamics)
- **Log Analysis:** (e.g., ELK Stack, Splunk)

#### 5.2 Script Development Guidelines
- Correlation and parameterization requirements
- Error handling in scripts
- Assertion and validation points
- Modular script architecture

#### 5.3 Monitoring Setup
Define metrics to collect:

**Application Metrics:**
- Response time (avg, P50, P95, P99, max)
- Throughput (requests/second)
- Error rate and error types
- Active sessions/connections

**Infrastructure Metrics:**
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Database connections
- Queue depths

**Business Metrics:**
- Transaction success rate
- Business transaction response times
- Revenue-impacting transaction performance

### 6. Environment Requirements

#### 6.1 Test Environment Specifications
- Hardware/instance configuration
- Network configuration
- Database sizing
- Third-party service mocking strategy

#### 6.2 Environment Parity Checklist
| Aspect | Production | Test Environment | Parity % |
|--------|------------|------------------|----------|
| Compute capacity | | | |
| Database size | | | |
| Cache configuration | | | |
| Network latency | | | |

### 7. Success Criteria

Define clear pass/fail criteria:

| Metric | Target | Acceptable Range | Failure Threshold |
|--------|--------|------------------|-------------------|
| Avg Response Time | < X ms | < Y ms | > Z ms |
| P99 Response Time | < X ms | < Y ms | > Z ms |
| Error Rate | < X% | < Y% | > Z% |
| Throughput | > X req/s | > Y req/s | < Z req/s |
| CPU Utilization | < X% | < Y% | > Z% |

### 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Test environment instability | | | |
| Data constraints | | | |
| Third-party dependencies | | | |
| Resource availability | | | |

### 9. Execution Schedule

Provide a phased approach:
- **Phase 1:** Environment setup and script development
- **Phase 2:** Baseline and initial load tests
- **Phase 3:** Stress and spike testing
- **Phase 4:** Soak testing
- **Phase 5:** Analysis and reporting

### 10. Deliverables

- [ ] Load test scripts (version controlled)
- [ ] Test execution reports
- [ ] Performance baseline documentation
- [ ] Bottleneck analysis report
- [ ] Capacity recommendations
- [ ] Remediation suggestions with priorities

### 11. Appendices
- Glossary of terms
- Tool configuration details
- Script samples
- Dashboard templates

---

## Formatting Guidelines
- Use tables for comparative data
- Include diagrams where helpful (describe in text)
- Provide specific, actionable recommendations
- Include command examples for tool usage
- Reference industry best practices
```

---

## Implementation Notes

### Techniques Used
- **Role-playing:** Establishes expertise and authority for performance engineering domain
- **Structured output:** Clear sections ensure comprehensive coverage
- **Input gathering:** Ensures customization to specific application needs
- **Tables and matrices:** Facilitate quick decision-making and comparison
- **Checklists:** Ensure nothing is overlooked during execution

### Design Rationale
1. **Comprehensive but modular:** Each section can be used independently or as part of complete plan
2. **Quantifiable metrics:** All success criteria are measurable, avoiding subjective assessments
3. **Risk-aware:** Includes risk assessment to prepare for common issues
4. **Tool-agnostic:** Recommends categories rather than mandating specific tools
5. **Phased approach:** Supports iterative testing methodology

### Expected Outcomes
- Complete, professional load testing plan ready for stakeholder review
- Clear success criteria aligned with business requirements
- Actionable test strategy with specific deliverables
- Risk mitigation strategies identified upfront

### Customization Points
- Adjust test types based on application maturity
- Scale metrics and thresholds based on SLA requirements
- Modify tool recommendations based on team expertise
- Extend monitoring metrics for specific technology stacks

---

## Usage Example

**User Input:**
> "Generate a load testing plan for our e-commerce API. We expect 5000 concurrent users during Black Friday sales. The API is built with Node.js, uses PostgreSQL, and is hosted on AWS with auto-scaling enabled."

**Expected Output:**
A complete load testing plan tailored to e-commerce APIs, with specific focus on:
- Cart and checkout transaction flows
- Payment gateway integration testing
- Inventory update concurrency
- AWS auto-scaling validation
- Black Friday peak load simulation

---

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-13 | @mfs_prompt_master | Initial creation |