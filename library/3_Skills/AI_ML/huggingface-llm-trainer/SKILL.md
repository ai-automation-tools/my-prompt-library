---
name: "🏋️ huggingface-llm-trainer"
description: Fine-tune language and vision models on Hugging Face cloud GPU infrastructure using TRL. Use when the user wants to run SFT, DPO, GRPO, or reward modeling training jobs on HuggingFace Jobs — NOT for local training or inference-only tasks. Requires a paid HuggingFace account (Pro/Team/Enterprise).
source: https://github.com/huggingface/skills
---

# Hugging Face LLM Trainer

Fine-tune language and vision models using TRL (Transformer Reinforcement Learning) on HuggingFace's managed cloud GPU infrastructure.

## Prerequisites

- **Paid HuggingFace account** (Pro, Team, or Enterprise) — free tier does not support training jobs
- Write-enabled HuggingFace token (`HF_TOKEN`)
- Dataset formatted for your training method
- `hf_jobs()` MCP tool available in the environment

## Supported Training Methods

| Method | Use Case |
|--------|----------|
| **SFT** (Supervised Fine-Tuning) | Instruction following, domain adaptation |
| **DPO** (Direct Preference Optimization) | Align model to human preferences |
| **GRPO** (Group Relative Policy Optimization) | Reasoning and RLHF-style alignment |
| **Reward Modeling** | Train a reward model for RLHF pipelines |

## Submitting a Training Job

**Always use `hf_jobs()` MCP tool** with inline Python scripts using PEP 723 dependency declarations. Submit directly — do not save to local files first.

```python
# Example: SFT training script (submit via hf_jobs())
# /// script
# dependencies = ["trl", "datasets", "transformers", "trackio"]
# ///

from trl import SFTTrainer, SFTConfig
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
import trackio

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-1.5B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-1.5B-Instruct")
dataset = load_dataset("your-username/your-dataset", split="train")

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    args=SFTConfig(
        output_dir="./output",
        num_train_epochs=3,
        push_to_hub=True,
        hub_model_id="your-username/finetuned-model",
    ),
    callbacks=[trackio.TRLCallback()]
)
trainer.train()
```

## Hardware Recommendations

| Model Size | Recommended Hardware | Notes |
|------------|---------------------|-------|
| < 1B params | `t4-small` | Fast, cheapest option |
| 3–7B params | `a10g-large` | Good balance of speed/cost |
| 7–13B params | `a100-large` | Use LoRA to reduce memory |
| 13B+ params | `a100-large` + LoRA/QLoRA | Required for large models |

## Critical Rules

1. **Submit jobs immediately** when the user asks — don't ask for confirmation unless config is ambiguous
2. **Always include Trackio monitoring** in training scripts (`trackio.TRLCallback()`)
3. **Set timeout to minimum 1–2 hours** — default 30-minute timeout will kill most training jobs
4. **Always configure hub push** — the training environment is ephemeral; models not pushed to Hub are lost
5. **Validate datasets before training** — wrong format wastes expensive GPU time
6. **Provide job ID and monitoring URL** after submission; do not poll — wait for user to check status

## Dataset Validation

Before submitting a training job, verify:
- Dataset exists and is accessible
- Format matches the training method (e.g., SFT needs `messages` column; DPO needs `prompt`/`chosen`/`rejected`)
- No null values in required fields
- Token length is within model context window

```python
from datasets import load_dataset

ds = load_dataset("your-username/dataset")
print(ds["train"].features)
print(ds["train"][0])  # inspect first example
```

## After Job Submission

```python
# Get job status (do not poll — provide this for user to run manually)
from huggingface_hub import HfApi
api = HfApi()
job = api.get_training_job(job_id)
print(job.status, job.logs_url)
```

Monitor training at: `https://huggingface.co/jobs/<job_id>`
View Trackio metrics at: `https://trackio.ai`

## Cost Estimation

```python
# Rough estimates (check current HF pricing)
# t4-small:   ~$0.60/hr
# a10g-large: ~$1.50/hr  
# a100-large: ~$4.00/hr

# A 3-epoch SFT on a 7B model with 50k examples: ~2-4 hrs on a10g-large
```

## Converting to GGUF (for local deployment)

```python
# After training, convert to GGUF for llama.cpp / Ollama
from transformers import AutoModelForCausalLM
import subprocess

model_id = "your-username/finetuned-model"
subprocess.run(["python", "convert_hf_to_gguf.py", model_id, "--outtype", "q4_k_m"])
```

## Common Failures

| Error | Fix |
|-------|-----|
| Job timeout | Increase timeout to 4h+ |
| OOM (out of memory) | Use LoRA, reduce batch size, use larger hardware |
| Dataset format error | Validate column names match TRL expectations |
| Model not saved | Add `push_to_hub=True` and `hub_model_id` to config |
| Auth error | Check `HF_TOKEN` has write permissions |
