---
title: "Portfolio Stress Test"
tags: ["finance", "risk-management", "portfolio", "stress", "test"]
category: "Finance"
subcategory: "Risk_Management"
---
# Portfolio Stress Test

<!-- Simulates how a given portfolio might perform under specific extreme macroeconomic or market scenarios. -->

---

## Metadata

- **Category:** Finance
- **Subcategory:** Risk_Management
- **Complexity:** Advanced
- **Use Case:** Assessing downside risk and portfolio resilience against black swan events or sudden market shifts.
- **Version:** 1.0
- **Last Updated:** 2026-03-04

---

## Purpose

To evaluate the vulnerability of a portfolio to specific stress scenarios (e.g., inflation spikes, recession, sudden interest rate hikes) and identify the weakest links.

---

## Input Requirements

**Required:**
- [PORTFOLIO HOLDINGS]: List of assets, tickers, and their weights/values.
- [STRESS SCENARIO]: The specific scenario to model (e.g., 2008 Financial Crisis repeat, 100bps unexpected rate hike, oil price shock).

**Optional:**
- [TIME HORIZON]: Expected duration of the stress event.

---

## Prompt

```
You are a quantitative risk manager. Perform a stress test on the following portfolio:\n\n[PORTFOLIO HOLDINGS]\n\nScenario to simulate: [STRESS SCENARIO]\nTime Horizon: [TIME HORIZON]\n\nAnalyze how this scenario would impact the portfolio by:\n1. Estimating the potential drawdown for each asset class or specific holding.\n2. Identifying the biggest contributors to portfolio risk (the weak links).\n3. Identifying any assets that might act as a hedge or safe haven in this specific scenario.\n4. Estimating the overall portfolio drawdown.\n5. Recommending actionable hedging strategies or rebalancing moves to mitigate this specific risk without completely sacrificing upside.
```

---

## Expected Output

A risk report detailing vulnerabilities and offering mitigation strategies.

**Format:**
- Markdown report
- Estimated Drawdowns by Asset, Overall Portfolio Impact, Risk Drivers, Hedging Recommendations

**Example structure:**
1. Scenario Overview\n2. Asset-Level Impact Breakdown\n3. Overall Portfolio Drawdown Estimate\n4. Risk Concentration\n5. Recommended Mitigation Strategies

---

## Example Usage

### Input
```
[PORTFOLIO HOLDINGS]: 60% SPY, 30% TLT, 10% GLD\n[STRESS SCENARIO]: Stagflation (High inflation + slowing growth)\n[TIME HORIZON]: 12-18 months
```

### Output
```
### Scenario Overview: Stagflation\n...\n### Asset-Level Impact\n- **SPY (60%):** High vulnerability. Margin compression and lower multiples could lead to a 15-20% drawdown.\n- **TLT (30%):** High vulnerability. Rising yields due to sticky inflation would severely hurt long-duration bonds.\n...
```

---

## Tips & Best Practices

- **Tip 1:** Be as specific as possible with the stress scenario (e.g., 'China invades Taiwan' rather than just 'geopolitical tension').\n- **Tip 2:** Use this to test hypothetical portfolios before committing capital.\n- **Tip 3:** Ask for correlation analysis during the stress event, as correlations tend to go to 1 during crises.

---

## Related Prompts

- None yet

---

## Tags

`#finance` `#risk_management` `#stress-testing` `#portfolio-management` `#risk`

---

## Notes

The AI is estimating based on historical correlations and economic theory; actual black swan events may behave differently.

---

**Created by:** AI Generated
**Inspired by:** Standard Financial Analysis practices
