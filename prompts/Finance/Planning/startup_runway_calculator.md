# Startup Runway Calculator

<!-- Calculates and models startup cash runway under different growth and burn scenarios. -->

---

## Metadata

- **Category:** Finance
- **Subcategory:** Planning
- **Complexity:** Intermediate
- **Use Case:** Helping founders and finance leads project how many months of cash are left and plan fundraising timelines.
- **Version:** 1.0
- **Last Updated:** 2026-03-04

---

## Purpose

To provide a clear view of cash exhaustion dates based on current cash, burn rate, and projected changes in revenue/expenses.

---

## Input Requirements

**Required:**
- [CURRENT CASH BALANCE]: Total liquid cash available.
- [CURRENT MONTHLY BURN]: Average monthly net cash burn.
- [MONTHLY REVENUE]: Current monthly recurring revenue (MRR).
- [MONTHLY EXPENSES]: Current total monthly expenses.

**Optional:**
- [PROJECTED REVENUE GROWTH]: Expected MoM growth rate.
- [EXPECTED MAJOR EXPENSES]: Upcoming one-off costs or planned hiring.

---

## Prompt

```
You are a startup financial modeler. Calculate the cash runway for a startup based on the following inputs:\n\nCurrent Cash Balance: [CURRENT CASH BALANCE]\nCurrent Monthly Revenue: [MONTHLY REVENUE]\nCurrent Monthly Expenses: [MONTHLY EXPENSES]\nProjected Revenue Growth (MoM): [PROJECTED REVENUE GROWTH]\nUpcoming Major Expenses/Hiring: [EXPECTED MAJOR EXPENSES]\n\nModel three scenarios for the next 24 months (or until cash is depleted):\n1. **Base Case:** Using the inputs provided.\n2. **Worst Case:** Revenue growth is 0%, expenses increase by 10%.\n3. **Best Case:** Revenue growth doubles the projected rate, expenses stay flat.\n\nFor each scenario, provide:\n- The estimated runway in months.\n- The 'Zero Cash Date' (assuming starting from today's date).\n- The peak funding requirement if the company wants to reach profitability without raising again.\n\nPresent the results clearly, and provide strategic advice on when the founders should begin their next fundraising process.
```

---

## Expected Output

Scenario analysis of cash runway with clear depletion dates and fundraising advice.

**Format:**
- Markdown report with scenario summaries
- Base Case, Worst Case, Best Case, Zero Cash Dates, Fundraising Timeline

**Example structure:**
1. Current Financial Snapshot\n2. Scenario 1: Base Case\n3. Scenario 2: Worst Case\n4. Scenario 3: Best Case\n5. Strategic Fundraising Recommendations

---

## Example Usage

### Input
```
[CURRENT CASH BALANCE]: $2,000,000\n[MONTHLY REVENUE]: $50,000\n[MONTHLY EXPENSES]: $150,000\n[PROJECTED REVENUE GROWTH]: 5% MoM\n[EXPECTED MAJOR EXPENSES]: Hire 2 engineers in month 3 ($30k/mo added burn)
```

### Output
```
### Current Financial Snapshot\n- Current Burn: $100,000 / month\n- Static Runway (No changes): 20 Months\n\n### Scenario 1: Base Case\n- Estimated Runway: 22 Months\n- Zero Cash Date: ~August 2025\n...
```

---

## Tips & Best Practices

- **Tip 1:** Include specific dates for new hires or major marketing spends in the inputs for a more accurate model.\n- **Tip 2:** Use the 'Worst Case' scenario to set your absolute minimum fundraising deadlines.\n- **Tip 3:** Start fundraising at least 6 months before your worst-case Zero Cash Date.

---

## Related Prompts

- None yet

---

## Tags

`#finance` `#planning` `#startup` `#runway` `#cash-flow` `#fundraising`

---

## Notes

Startups are highly volatile; recalculate runway monthly rather than relying on a single long-term projection.

---

**Created by:** AI Generated
**Inspired by:** Standard Financial Analysis practices
