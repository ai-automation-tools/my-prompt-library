---
name: 🚀 GCP Kubernetes (GKE) Deployment
description: Deploy containerized applications to Google Kubernetes Engine with CI/CD, monitoring, and auto-scaling.
metadata:
  short-description: Deploy containerized applications to Google Kubernetes Engine with CI/CD, monitoring, and auto-scaling.
---

# GCP Kubernetes (GKE) Deployment

## Overview

Deploy and manage containerized applications on Google Kubernetes Engine following best practices for production workloads.

## Usage

```
Deploy [application] to GKE:
- Cluster configuration (node pools, regions)
- Kubernetes manifests (Deployments, Services, Ingress)
- Helm charts (if applicable)
- CI/CD pipeline (Cloud Build, GitHub Actions)
- Monitoring (Cloud Logging, Prometheus)
```

## Examples

### Microservices Architecture
"Deploy a microservices application to GKE with: multiple services, Istio service mesh, Cloud SQL, Cloud Storage, CI/CD with Cloud Build."

### ML Model Serving
"Set up GKE cluster for serving ML models with: GPU nodes, horizontal pod autoscaling, load balancer, Cloud Monitoring."

### Stateful Application
"Deploy a stateful app to GKE with: StatefulSets, persistent volumes (Cloud Filestore/PD), backup strategy."

## Components Provided

- **GKE Cluster:** Terraform configuration
- **Kubernetes Manifests:** YAML for deployments, services, ingress
- **Helm Charts:** (if requested)
- **CI/CD Pipeline:** Cloud Build or GitHub Actions
- **Monitoring:** Stackdriver, Prometheus setup
- **Security:** Workload Identity, Network Policies

## Output Includes

1. GKE cluster setup (Terraform)
2. Kubernetes deployment files
3. CI/CD pipeline config
4. Monitoring/logging setup
5. Deployment instructions
6. Troubleshooting guide

