---
name: 🔵 Azure DevOps CI/CD Pipeline
description: Create Azure DevOps pipelines for building, testing, and deploying applications to Azure services.
metadata:
  short-description: Create Azure DevOps pipelines for building, testing, and deploying applications to Azure services.
---

# Azure DevOps CI/CD Pipeline

## Overview

Build comprehensive CI/CD pipelines using Azure DevOps for deploying applications to Azure App Service, AKS, or Azure Functions.

## Usage

```
Create an Azure DevOps pipeline for [application]:
- Source: [GitHub/Azure Repos]
- Build: [.NET/Node.js/Python/etc.]
- Test: Unit tests, integration tests
- Deploy to: [Azure App Service/AKS/Functions]
- Environments: Dev, Staging, Production
```

## Examples

### .NET Web App
"Build Azure DevOps pipeline for ASP.NET Core app: restore, build, test, publish, deploy to Azure App Service with blue-green deployment."

### React Frontend
"Create pipeline for React app: npm install, build, run tests, deploy to Azure Static Web Apps with preview environments for PRs."

### Docker to AKS
"Set up pipeline to build Docker image, push to ACR, deploy to AKS with Helm, run smoke tests."

## Pipeline Stages

1. **Build:**
   - Checkout code
   - Restore dependencies
   - Build application
   - Run unit tests
   - Code coverage

2. **Artifact:**
   - Publish build artifacts
   - Push Docker images (if applicable)

3. **Deploy:**
   - Deploy to Dev (automatic)
   - Deploy to Staging (approval)
   - Deploy to Production (approval)
   - Health checks

4. **Post-Deployment:**
   - Smoke tests
   - Notifications (Slack, Teams)

## Output Format

1. azure-pipelines.yml file
2. Variable groups setup
3. Service connections needed
4. Approval gates configuration
5. Documentation

