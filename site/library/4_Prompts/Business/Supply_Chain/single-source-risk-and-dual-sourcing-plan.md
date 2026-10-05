---
title: "🚚 Single-Source Risk and Dual-Sourcing Plan"
tags: ["supply-chain", "sourcing", "risk", "procurement", "resilience"]
category: "Business"
subcategory: "Supply_Chain"
---

# Single-Source Risk and Dual-Sourcing Plan

## Purpose
Find the parts and services that one supplier can stop you from shipping, then decide which are worth a second source and how to qualify one without wrecking cost or quality.

## Instructions
Act as a procurement strategist. Work from the data below, not from general advice. A second source costs money every month it sits idle, so recommend one only where the exposure justifies it, and say so plainly for the items that don't.

Inputs:
- **Item list:** [part or service, current supplier, annual spend, share of that supplier's volume you represent]
- **Products it feeds:** [which finished goods or services depend on each item, and their margin or revenue]
- **Lead times:** [supplier lead time, and how long a replacement would take to qualify]
- **Inventory on hand:** [weeks of cover per item]
- **Switching constraints:** [certifications, tooling owned by the supplier, contracts, minimum volumes]

Steps:
1. **Rank exposure** — for each item, estimate the revenue stopped per week of outage (products fed × weekly revenue), then compare it to weeks of cover plus qualification time. An item whose outage cost is high and whose cover is shorter than the qualification time is the real risk.
2. **Separate the causes of single-sourcing** — is it by choice (price), by constraint (tooling, certification, sole manufacturer), or by neglect (nobody ever asked)? Each needs a different fix, and neglect is the cheapest to remove.
3. **Pick the treatment per item** — dual-source, hold buffer stock, redesign to a common part, negotiate continuity terms with the current supplier, or accept the risk. Justify each in one sentence using the numbers from step 1.
4. **Design the split for each dual-sourced item** — the volume share to give the second source (enough to keep it engaged, not so much it raises your unit cost), and the trigger to shift volume if the first source fails.
5. **Plan qualification** — samples, first-article inspection, pilot lot, and the exit criteria for each, with a realistic duration. Flag anything that needs your customer's approval.
6. **Price the plan** — added unit cost, qualification cost, and carrying cost of extra stock, against the outage cost avoided. Show the break-even outage frequency.

## Output Format
- Exposure table: item, outage cost per week, cover, qualification time, treatment
- Per-item plan for each dual-sourced item: split, trigger, qualification milestones
- A cost-versus-risk summary and the items you chose to leave single-sourced, with the reason
- Assumptions you made because an input was missing

## Related Prompts
- [Vendor Evaluation](../Operations/vendor-evaluation.md)
- [Supplier Quality Audit](../../Domain_Specific/Manufacturing/supplier-quality-audit.md)
- [Supply Chain Optimization Agent](./supply-chain-agent.md)

---
**Disclaimer:** Outputs are estimates built on the figures you supply. Validate lead times and qualification requirements with the suppliers and your quality team before committing spend.
