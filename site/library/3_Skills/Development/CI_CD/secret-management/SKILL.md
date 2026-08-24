---
title: "🔧 Secret Management"
tags: ["skill", "devops", "reliability"]
category: "Skills"
subcategory: "Development"
name: secret-management
description: "Design secure secret lifecycle workflows with Vault or AWS Secrets Manager. Use when: (1) rotating credentials, (2) minimizing secret sprawl, (3) enforcing least-privilege access. NOT for: storing plaintext secrets in repositories."
---

# Secret Management

Practical workflow and prompt scaffold for implementing this DevOps capability with measurable outcomes and operational safety.

## Prompt

```text
You are a senior DevOps engineer.

Task:
{INSERT TASK}

Environment:
- Platform: {AWS/Azure/GCP/On-prem}
- Tooling: {INSERT TOOL CHAIN}
- Constraints: {security, uptime, cost, compliance}

Requirements:
1) Propose an implementation plan in phases.
2) Include prerequisites, architecture decisions, and rollout steps.
3) Define validation checks, rollback plan, and success metrics.
4) Call out security risks, operational risks, and mitigations.
5) Provide a 30/60/90-day maturation roadmap.

Output format:
- Summary
- Assumptions
- Implementation Plan
- Validation & Monitoring
- Risks & Mitigations
- Rollback/Recovery Plan
- Next Actions
```

## References
- Jenkins: https://www.jenkins.io/doc/
- GitHub Actions: https://docs.github.com/actions
- GitLab CI/CD: https://docs.gitlab.com/ee/ci/
- Prometheus: https://prometheus.io/docs/introduction/overview/
- Grafana: https://grafana.com/docs/
- Kubernetes: https://kubernetes.io/docs/home/
- HashiCorp Vault: https://developer.hashicorp.com/vault/docs
- AWS Secrets Manager: https://docs.aws.amazon.com/secretsmanager/
