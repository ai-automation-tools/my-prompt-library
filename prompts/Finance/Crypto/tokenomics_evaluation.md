# Tokenomics Evaluation

<!-- Assesses the economic model, supply dynamics, and utility of a cryptocurrency project. -->

---

## Metadata

- **Category:** Finance
- **Subcategory:** Crypto
- **Complexity:** Intermediate
- **Use Case:** Evaluating new crypto projects or tokens to understand long-term viability and inflation risks.
- **Version:** 1.0
- **Last Updated:** 2026-03-04

---

## Purpose

To break down the tokenomics of a crypto asset, identifying potential red flags like high inflation, centralization of supply, or lack of token utility.

---

## Input Requirements

**Required:**
- [PROJECT NAME / TOKEN]: The name and ticker of the crypto project.
- [TOKENOMICS DETAILS]: Information on total supply, circulating supply, emission schedule, utility, and distribution (or a link to the whitepaper).

**Optional:**
- [COMPARABLE TOKENS]: Similar projects for benchmarking.

---

## Prompt

```
You are a crypto research analyst specializing in tokenomics. Evaluate the tokenomics for [PROJECT NAME / TOKEN].\n\nHere are the details:\n[TOKENOMICS DETAILS]\n\nPlease analyze the following:\n1. **Supply Dynamics:** Evaluate the Total Supply, Circulating Supply, and Max Supply. What is the current inflation rate?\n2. **Distribution & Vesting:** Are the allocations fair? Are there massive unlocks coming up that could dump the price? Analyze the vesting schedule for team and investors.\n3. **Token Utility:** What is the actual use case of the token? Is it necessary for the network to function, or is it purely for governance/speculation?\n4. **Value Accrual:** How does the token capture value? Are there burn mechanisms, staking rewards, or fee sharing?\n5. **Red Flags:** Highlight any centralization risks or exploitative mechanisms.\n\nProvide a comprehensive summary and a final rating (Bullish, Neutral, Bearish) on the tokenomics structure alone.
```

---

## Expected Output

A structured assessment of the token's economic design and potential risks.

**Format:**
- Markdown document with clear sections for each evaluation criteria
- Supply Analysis, Distribution Risks, Utility Assessment, Value Accrual, Red Flags

**Example structure:**
1. Overview & Core Metrics\n2. Supply & Inflation Dynamics\n3. Vesting & Distribution Analysis\n4. Token Utility & Demand Drivers\n5. Value Accrual Mechanisms\n6. Risk Factors & Red Flags\n7. Conclusion & Rating

---

## Example Usage

### Input
```
[PROJECT NAME / TOKEN]: Arbitrum (ARB)\n[TOKENOMICS DETAILS]: 10B max supply, 1.27B circulating. 42.78% DAO Treasury, 26.94% Team/Advisors, 17.53% Investors... Token used for DAO governance.
```

### Output
```
### Overview & Core Metrics\n...\n### Risk Factors & Red Flags\n- **Low Initial Float:** High fully diluted valuation (FDV) compared to market cap suggests massive future unlock pressure...\n...
```

---

## Tips & Best Practices

- **Tip 1:** Be sure to provide the exact vesting schedule details if possible, as this is critical for crypto evaluation.\n- **Tip 2:** Differentiate between utility tokens, governance tokens, and value-accruing tokens.\n- **Tip 3:** Ask the AI to model potential price impacts of upcoming major unlock events.

---

## Related Prompts

- None yet

---

## Tags

`#finance` `#crypto` `#tokenomics` `#web3` `#fundamental-analysis`

---

## Notes

Crypto tokenomics can change via governance votes; ensure the data provided is up-to-date.

---

**Created by:** AI Generated
**Inspired by:** Standard Financial Analysis practices
