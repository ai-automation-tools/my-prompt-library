---
title: "Discounted Cash Flow DCF Valuation Model"
tags: ["finance", "investments", "valuation", "model"]
category: "Finance"
subcategory: "Investments"
---
# Discounted Cash Flow (DCF) Valuation Model

<!-- Guides the generation of a DCF valuation model based on user-provided inputs and assumptions. -->

---

## Metadata

- **Category:** Finance
- **Subcategory:** Investments
- **Complexity:** Advanced
- **Use Case:** Estimating the intrinsic value of an asset or company based on its expected future cash flows.
- **Version:** 1.0
- **Last Updated:** 2026-03-04

---

## Purpose

To calculate the present value of expected future cash flows to determine if an investment is undervalued or overvalued.

---

## Input Requirements

**Required:**
- [FREE CASH FLOWS]: Historical and current FCF.
- [GROWTH RATE]: Projected growth rate for the forecast period.
- [DISCOUNT RATE / WACC]: The rate used to discount future cash flows.
- [TERMINAL GROWTH RATE]: Long-term growth rate for the terminal value calculation.

**Optional:**
- [SHARES OUTSTANDING]: To calculate per-share intrinsic value.
- [NET DEBT]: To bridge from Enterprise Value to Equity Value.

---

## Prompt

```
You are a Senior Valuation Expert at an investment bank. Construct a Discounted Cash Flow (DCF) model based on the following inputs:\n\nCurrent Free Cash Flow: [FREE CASH FLOWS]\nProjected FCF Growth Rate (Next 5 years): [GROWTH RATE]\nDiscount Rate (WACC): [DISCOUNT RATE / WACC]\nTerminal Growth Rate: [TERMINAL GROWTH RATE]\nShares Outstanding: [SHARES OUTSTANDING]\nNet Debt: [NET DEBT]\n\n1. Calculate the projected FCF for the next 5 years.\n2. Calculate the Terminal Value at the end of year 5.\n3. Discount the projected FCFs and Terminal Value back to present value.\n4. Calculate the Enterprise Value.\n5. Subtract Net Debt to find Equity Value.\n6. Divide Equity Value by Shares Outstanding to find the Intrinsic Value per Share.\n\nShow your work step-by-step and present the final model in a markdown table.
```

---

## Expected Output

A step-by-step mathematical breakdown of the DCF calculation ending with an intrinsic value per share.

**Format:**
- Markdown tables and step-by-step calculation breakdown
- Projected Cash Flows, Terminal Value, Enterprise Value, Equity Value, Price Target

**Example structure:**
1. Assumptions Summary\n2. 5-Year FCF Projections\n3. Terminal Value Calculation\n4. Present Value Discounting\n5. Valuation Bridge (EV to Equity Value)\n6. Final Intrinsic Value & Sensitivity Analysis

---

## Example Usage

### Input
```
[FREE CASH FLOWS]: $100M\n[GROWTH RATE]: 10% for years 1-5\n[DISCOUNT RATE / WACC]: 8%\n[TERMINAL GROWTH RATE]: 2%\n[SHARES OUTSTANDING]: 50M\n[NET DEBT]: $200M
```

### Output
```
### 1. Assumptions Summary\n...\n### 2. 5-Year FCF Projections\n- Year 1: $110.00M\n- Year 2: $121.00M...\n### 6. Final Intrinsic Value\nThe estimated intrinsic value is $32.45 per share.
```

---

## Tips & Best Practices

- **Tip 1:** Use this to double-check your own excel models.\n- **Tip 2:** Ask the AI to generate a sensitivity analysis table varying WACC and Terminal Growth Rate.\n- **Tip 3:** The AI might make small rounding errors; verify the final math.

---

## Related Prompts

- None yet

---

## Tags

`#finance` `#investments` `#valuation` `#dcf` `#equity-research`

---

## Notes

Garbage in, garbage out. The accuracy of a DCF is highly dependent on the assumptions provided.

---

**Created by:** AI Generated
**Inspired by:** Standard Financial Analysis practices
