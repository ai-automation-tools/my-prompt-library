---
name: ☁️ AWS Infrastructure Setup
description: Set up AWS infrastructure using Terraform/CloudFormation with best practices for security, scalability, and cost optimization.
metadata:
  short-description: Set up AWS infrastructure using Terraform/CloudFormation with best practices for security, scalability, and cost optimization.
---

# AWS Infrastructure Setup

## Overview

Deploy production-ready AWS infrastructure with Infrastructure as Code (IaC), following AWS Well-Architected Framework principles.

## Usage

```
Set up AWS infrastructure for [application type]:
- Infrastructure: [EC2/ECS/Lambda/etc.]
- Database: [RDS/DynamoDB/etc.]
- Storage: S3, CloudFront
- Networking: VPC, subnets, security groups
- IaC Tool: [Terraform/CloudFormation]
```

## Examples

### Web Application Stack
"Create AWS infrastructure for a Node.js web app with: ALB, ECS Fargate, RDS PostgreSQL, S3 for static assets, CloudFront CDN. Use Terraform."

### Serverless API
"Set up serverless infrastructure with API Gateway, Lambda functions, DynamoDB, and Cognito auth using AWS SAM/CloudFormation."

### Data Pipeline
"Design AWS data pipeline with: S3 ingestion, Lambda processing, Kinesis streaming, Redshift warehouse, QuickSight dashboards."

## Best Practices Included

- **Security:** IAM least privilege, encryption, security groups
- **Scalability:** Auto-scaling, load balancing
- **Reliability:** Multi-AZ deployment, backups
- **Cost Optimization:** Reserved instances, S3 lifecycle policies
- **Monitoring:** CloudWatch alarms, logging

## Output Format

1. Terraform/CloudFormation code
2. Architecture diagram description
3. Cost estimate
4. Security considerations
5. Deployment instructions
6. Monitoring setup

