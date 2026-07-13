---
name: "🧬 gnomAD Database"
description: Query gnomAD for population allele frequencies, constraint metrics, and loss-of-function intolerance. Use when interpreting variants, filtering common alleles, or prioritizing genes in rare disease workflows.
source: https://skillsmp.com/skills/k-dense-ai-claude-scientific-skills-scientific-skills-gnomad-database-skill-md
author: K-Dense-AI
repository: https://github.com/K-Dense-AI/claude-scientific-skills
stars: 16762
forks: 1830
updated: 2026-03-03
---

# gnomAD Database

Use gnomAD when human genetic variant interpretation needs real population frequency and constraint context.

## When To Use

- Check whether a variant is rare, common, or absent in the general population
- Compare ancestry-specific allele frequencies
- Use gene constraint metrics like `pLI` and `LOEUF`
- Support ACMG or ClinVar-style variant interpretation
- Prioritize candidate genes in rare disease analysis

## Primary Resources

- Browser: `https://gnomad.broadinstitute.org/`
- GraphQL API: `https://gnomad.broadinstitute.org/api`
- Downloads: `https://gnomad.broadinstitute.org/downloads`

## Practical Workflow

1. Identify the variant or gene and confirm the reference build.
2. Prefer `gnomad_r4` for current GRCh38 work.
3. Check overall and ancestry-specific allele frequency.
4. Review consequence and loss-of-function annotations.
5. For gene-level work, examine `LOEUF` and related constraint metrics.
6. Combine gnomAD evidence with disease context rather than treating absence as proof of pathogenicity.

## Interpretation Notes

- Rare does not mean pathogenic, but common usually argues against severe Mendelian causality
- `LOEUF` is generally more useful than `pLI` for current constraint work
- Homozygous counts matter for recessive interpretation
- Exome and genome datasets have different coverage tradeoffs

## Best Practices

- Be explicit about `GRCh37` vs `GRCh38`
- Check population breakdowns before making rarity claims
- Handle null or missing responses cleanly
- Batch and rate-limit API calls when querying many variants
