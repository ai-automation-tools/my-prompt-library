---
name: "Together GPU Clusters"
description: Provision and operate Together AI GPU clusters for distributed training, inference, and HPC workloads.
source: https://skillsmp.com/skills/neversight-learn-skills-dev-data-skills-md-zainhas-togetherai-skills-together-gpu-clusters-skill-md
author: NeverSight
repository: https://github.com/NeverSight/learn-skills.dev
stars: 103
forks: 24
updated: 2026-03-22
---

# Together GPU Clusters

## Overview

Provision GPU clusters on Together AI for distributed training, large-scale inference, and HPC workloads.

- **Hardware**: NVIDIA H100, H200, B200 (80GB SXM)
- **Cluster types**: On-demand (pay-as-you-go) or Reserved (committed)
- **Orchestration**: Kubernetes or Slurm
- **Management**: tcloud CLI, Terraform, SkyPilot, REST API
- **Networking**: InfiniBand for high-bandwidth inter-node communication

## Installation

```shell
# Python (recommended)
uv init
uv add together
```

```shell
# or with pip
pip install together
```

```shell
# TypeScript / JavaScript
npm install together-ai
```

Set your API key:

```shell
export TOGETHER_API_KEY=<your-api-key>
```

## Workflow

1. Choose hardware and cluster size
2. Create cluster via tcloud CLI, Terraform, or API
3. Configure orchestration (K8s or Slurm)
4. Run workloads
5. Monitor health and manage nodes
6. Delete when done

## Quick Start with CLI

The CLI supports two equivalent command forms. The examples below use `together beta clusters`, but you can also use `tcloud cluster` after installing `tcloud`.

### Install

```shell
# Option A: Together CLI (included with Together Python SDK)
pip install together

# Option B: Standalone tcloud binary
# Mac (Universal)
curl -LO https://tcloud-cli-downloads.s3.us-west-2.amazonaws.com/releases/latest/tcloud-darwin-universal.tar.gz
tar xzf tcloud-darwin-universal.tar.gz

# Linux (AMD64)
curl -LO https://tcloud-cli-downloads.s3.us-west-2.amazonaws.com/releases/latest/tcloud-linux-amd64.tar.gz
tar xzf tcloud-linux-amd64.tar.gz
```

### Authenticate

```shell
# Together CLI
together auth login

# tcloud
tcloud sso login
```

### List Available Regions

```shell
together beta clusters list-regions
```

### Create a Cluster

```shell
# On-demand Kubernetes cluster
together beta clusters create \
  --name my-training-cluster \
  --num-gpus 8 \
  --gpu-type H100_SXM \
  --region us-central-8 \
  --driver-version CUDA_12_6_560 \
  --billing-type ON_DEMAND \
  --cluster-type KUBERNETES

# Reserved Slurm cluster with shared storage
together beta clusters create \
  --name my-slurm-cluster \
  --num-gpus 16 \
  --gpu-type H200_SXM \
  --region us-central-8 \
  --driver-version CUDA_12_6_560 \
  --billing-type RESERVED \
  --duration-days 30 \
  --cluster-type SLURM \
  --volume <VOLUME_ID>
```

### Check Status

```shell
together beta clusters list
together beta clusters retrieve <CLUSTER_ID>
```

### Scale a Cluster

```shell
together beta clusters update <CLUSTER_ID> --num-gpus 16
```

### Get Credentials (Kubernetes)

```shell
together beta clusters get-credentials <CLUSTER_ID>
export KUBECONFIG=~/.kube/config
kubectl get nodes
```

### Create and Manage Shared Storage

```shell
together beta clusters storage create \
  --volume-name my-shared-data \
  --size-tib 2 \
  --region us-central-8

together beta clusters storage list
together beta clusters storage retrieve <VOLUME_ID>
together beta clusters storage delete <VOLUME_ID>
```

### Delete a Cluster

```shell
together beta clusters delete <CLUSTER_ID>
```

## Kubernetes vs Slurm

**Choose Kubernetes when:**
- Running containerized workloads
- Need auto-scheduling and scaling
- Using cloud-native ML frameworks (KubeFlow, Ray)

**Choose Slurm when:**
- Traditional HPC workloads
- Multi-node MPI training
- Familiar with Slurm job scripts
- Need fine-grained resource allocation

## Key CLI Commands

| `together beta clusters` | `tcloud cluster` | Description |
|--------------------------|------------------|-------------|
| `clusters create` | `cluster create` | Create a new cluster |
| `clusters list` | `cluster list` | List all clusters |
| `clusters retrieve <ID>` | `cluster get <ID>` | Get cluster details |
| `clusters update <ID>` | `cluster scale <ID>` | Update or scale a cluster |
| `clusters delete <ID>` | `cluster delete` | Delete a cluster |
| `clusters list-regions` | -- | List regions and GPU types |

## Terraform Integration

```hcl
resource "together_gpu_cluster" "training" {
  name             = "my-training-cluster"
  num_gpus         = 8
  instance_type    = "H100-SXM"
  region           = "us-central-8"
  billing_type     = "prepaid"
  reservation_days = 30

  shared_volume {
    name     = "training-data"
    size_tib = 5
  }
}
```

```shell
terraform init
terraform plan
terraform apply
```

## SkyPilot Integration

```yaml
resources:
  accelerators: H100:8
  cloud: kubernetes

setup: |
  pip install torch transformers

run: |
  torchrun --nproc_per_node=8 train.py
```

```shell
sky launch sky.yaml
```

## Health Monitoring

```shell
tcloud cluster health my-cluster
```

- Automatic health checks on GPU, network, and storage
- Unhealthy nodes flagged for repair or replacement
- Node repair can be triggered manually or automatically

## Storage

- **NFS**: Shared filesystem across all nodes
- **Object storage**: S3-compatible for large datasets
- Persistent storage survives node restarts

## Billing

- **On-demand**: Per-GPU-hour billing, no commitment
- **Reserved**: Committed capacity with discounted rates
- Billed while cluster is running (even if idle)

## Resources

- Official docs: https://docs.together.ai/docs/gpu-clusters-overview
- Quickstart: https://docs.together.ai/docs/gpu-clusters-quickstart
- API reference: https://docs.together.ai/reference/clusters-create
