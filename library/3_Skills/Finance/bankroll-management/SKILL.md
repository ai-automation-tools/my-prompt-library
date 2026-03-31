---
name: bankroll-management
description: "Manage betting capital with staking plans, drawdown limits, risk-of-ruin calculations, and responsible gambling practices. Use when sizing a bankroll, choosing a staking strategy, setting stop-losses, or evaluating risk of ruin. Also trigger for 'bankroll', 'staking plan', 'risk of ruin', 'drawdown', 'stop loss', 'bet sizing', 'responsible gambling', or 'money management'."
---

# Bankroll Management — Capital Preservation & Risk Control

Protect your betting capital from variance, tilt, and ruin — the discipline layer that turns a positive-edge strategy into long-term profit.

## When to Use This Skill

**USE when:**
- Setting up a new betting bankroll
- Choosing a staking plan (flat, Kelly, percentage)
- Calculating risk of ruin for your edge and variance
- Setting stop-loss and drawdown limits
- Evaluating whether to increase or decrease bet sizes
- Addressing responsible gambling considerations

**DON'T USE when:**
- Finding edge → use `/odds-modeling` or `/sports-betting`
- Calculating optimal Kelly fraction → use `market-mechanics-betting`
- Comparing odds across books → use `/arbitrage-scanner`

## Step 1: Bankroll Setup

### How Much to Allocate

```
RULE #1: Your bankroll is money you can lose entirely
  → Never bet rent money, savings, or money you need
  → If losing it would cause financial stress, it's too much

STARTING BANKROLL GUIDELINES:
  Recreational bettor:    $200-1,000
  Serious recreational:   $1,000-5,000
  Semi-professional:      $5,000-25,000
  Professional:           $25,000+

BANKROLL vs NET WORTH:
  Maximum allocation: 5-10% of liquid net worth
  If bankroll reaches 0: STOP. Do not reload from other funds
  If bankroll grows 5x: Consider withdrawing the original stake
```

### Unit Sizing

```
1 UNIT = your standard bet size

CONSERVATIVE:  1 unit = 1% of bankroll
MODERATE:      1 unit = 2% of bankroll
AGGRESSIVE:    1 unit = 3% of bankroll
RECKLESS:      1 unit = 5%+ ← not recommended

Example ($5,000 bankroll, moderate):
  1 unit = $100
  Small bet: 0.5 units ($50)
  Standard bet: 1 unit ($100)
  Strong bet: 2 units ($200)
  Max bet: 3 units ($300) ← absolute ceiling

RECALCULATE UNITS:
  Upward:   Every time bankroll grows 20%+
  Downward: Every time bankroll drops 20%+
  → This is essentially manual Kelly criterion
```

## Step 2: Staking Plans

### Flat Staking

```
Every bet is the same size regardless of confidence.

PROS:
  ✓ Simple — no calculation needed
  ✓ Consistent — easy to track and evaluate
  ✓ Safe — no risk of over-betting bad estimates

CONS:
  ✗ Doesn't capitalize on high-confidence bets
  ✗ Suboptimal if you have reliable edge estimates

BEST FOR: Beginners, bettors without a quantitative model
SIZE: 1-2% of bankroll per bet
```

### Percentage Staking

```
Bet a fixed percentage of CURRENT bankroll (recalculates each bet).

Bankroll: $5,000, Stake: 2%
  Bet 1: $100  (2% of $5,000)
  Win at +100 → Bankroll: $5,100
  Bet 2: $102  (2% of $5,100)
  Lose → Bankroll: $4,998
  Bet 3: $99.96  (2% of $4,998)

PROS:
  ✓ Automatically sizes down during drawdowns
  ✓ Never reaches zero (mathematically)
  ✓ Sizes up during winning streaks

CONS:
  ✗ Slower growth than Kelly
  ✗ Doesn't account for varying edge

BEST FOR: Bettors who want automatic position sizing
```

### Kelly Criterion Staking

```
Optimal bet size based on estimated edge:

  Kelly % = (bp - q) / b
  where:
    b = decimal odds - 1
    p = estimated probability of winning
    q = 1 - p

Example:
  Odds: +150 (decimal 2.50, b = 1.50)
  Your estimated win probability: 45%
  Kelly% = (1.50 × 0.45 - 0.55) / 1.50 = 8.33%

FRACTIONAL KELLY (RECOMMENDED):
  Full Kelly: 8.33%     ← Too aggressive for most bettors
  Half Kelly: 4.17%     ← Good balance of growth and safety
  Quarter Kelly: 2.08%  ← Conservative, survives estimation errors

WHY FRACTIONAL?
  Full Kelly assumes your probability estimate is PERFECT
  In reality, your estimates have error
  Half Kelly achieves 75% of full Kelly growth with much lower variance
  Quarter Kelly achieves 50% of growth with very low ruin risk

BEST FOR: Bettors with a quantitative model and calibrated probabilities
→ See market-mechanics-betting for detailed Kelly implementation
```

### Confidence-Tiered Staking

```
Assign tiers based on confidence level:

| Tier | Confidence | Stake | Example |
|------|-----------|-------|---------|
| 1-Star | Slight lean | 0.5 units | Marginal edge, uncertain model |
| 2-Star | Moderate edge | 1 unit | Standard edge, solid reasoning |
| 3-Star | Strong edge | 2 units | Clear misprice, high confidence |
| 4-Star | Exceptional | 3 units | Rare — maybe 5% of all bets |
| 5-Star | Max conviction | 4-5 units | Extremely rare — arb-level confidence |

RULES:
  Tier distribution should be roughly:
  1-Star: 30% of bets
  2-Star: 40% of bets
  3-Star: 20% of bets
  4-Star: 8% of bets
  5-Star: 2% of bets

  If you're rating everything 4-5 stars, you're overconfident
```

## Step 3: Risk of Ruin

### Calculating Risk of Ruin

```
Risk of Ruin = probability of losing your entire bankroll

SIMPLIFIED FORMULA (for even-money bets):
  RoR = ((1 - edge) / (1 + edge)) ^ (bankroll / unit_size)

Example:
  Edge: 3% (win 51.5% of -110 bets)
  Bankroll: 100 units
  RoR = ((1 - 0.03) / (1 + 0.03)) ^ 100 = 0.97/1.03 ^ 100 = 0.26%

| Bankroll (units) | 2% Edge RoR | 3% Edge RoR | 5% Edge RoR |
|-----------------|-------------|-------------|-------------|
| 25 units        | 22.5%       | 14.1%       | 5.4%        |
| 50 units        | 5.1%        | 2.0%        | 0.3%        |
| 100 units       | 0.26%       | 0.04%       | <0.01%      |
| 200 units       | <0.01%      | <0.01%      | <0.01%      |

TAKEAWAY: At 100+ units with 2%+ edge, ruin is negligible
  → But 25-unit bankrolls are genuinely dangerous even with edge
```

### Variance & Expected Drawdowns

```
Even with a positive edge, expect significant drawdowns:

AT 53% WIN RATE (-110 ODDS), OVER 1,000 BETS:
  Expected max drawdown: ~25-35 units
  Longest losing streak: ~12-17 bets
  Probability of being down after 100 bets: ~35%
  Probability of being down after 500 bets: ~15%
  Probability of being down after 1,000 bets: ~5%

EMOTIONAL PREPARATION:
  You WILL have 10+ bet losing streaks
  You WILL have months where you lose money
  You WILL question whether your edge is real
  → This is normal variance, not evidence of broken strategy
  → Only long-term sample sizes (500+ bets) reveal true edge
```

## Step 4: Stop-Loss & Circuit Breakers

### Drawdown Limits

```
SESSION STOP-LOSS:
  Lose X units in one day → stop betting for the day
  Recommended: 5-10 units
  Why: Prevents tilt-driven decisions after bad sessions

WEEKLY STOP-LOSS:
  Lose X units in one week → reduce stakes by 50% for 1 week
  Recommended: 15-20 units
  Why: Forces reflection and prevents chasing

MONTHLY STOP-LOSS:
  Lose X units in one month → pause for 1 week, review entire approach
  Recommended: 25-30 units
  Why: Distinguishes variance from broken strategy

CRITICAL DRAWDOWN:
  Bankroll drops below 50% of starting amount:
  → STOP. Review everything.
  → Have your model audited by someone else
  → Only resume after identifying the problem (or confirming variance)
```

### Tilt Detection

```
WARNING SIGNS YOU'RE TILTING:
  ✗ Increasing bet sizes after losses ("I need to win it back")
  ✗ Betting on games you haven't analyzed ("I'll ride the momentum")
  ✗ Chasing with parlays ("one big hit will fix everything")
  ✗ Betting while emotional (angry, drunk, desperate)
  ✗ Deviating from your staking plan without analytical reason
  ✗ Checking your results obsessively throughout the day

TILT PROTOCOL:
  1. Recognize the sign
  2. Close all betting apps immediately
  3. Set a calendar reminder to revisit in 24 hours
  4. Review your process and results with fresh eyes tomorrow
  5. If the pattern repeats, take a full week off
```

## Step 5: Bankroll Growth & Withdrawals

### Growth Milestones

```
STRATEGY: Withdraw profits at milestones to "lock in" gains

Milestone 1: Bankroll reaches 150% of start → withdraw 20%
Milestone 2: Bankroll reaches 200% of start → withdraw 25%
Milestone 3: Bankroll reaches 300% of start → withdraw 30%
Recurring:   Every 50% growth → withdraw 25-30% of profits

ALTERNATIVE — SALARY MODEL (professional):
  Monthly withdrawal: Fixed amount if bankroll is above threshold
  Threshold: 80% of peak bankroll
  Amount: 10-15% of average monthly profit
  → Smooths out variance in personal income
```

### When to Increase Bet Sizes

```
INCREASE UNIT SIZE WHEN:
  ✓ Bankroll has grown 50%+ with 200+ bet sample
  ✓ CLV (Closing Line Value) is consistently positive
  ✓ Increase is proportional (keep units at 1-2% of new bankroll)
  ✓ You can emotionally handle the new bet amounts

DO NOT INCREASE WHEN:
  ✗ On a hot streak with <100 bet sample
  ✗ After a single big win
  ✗ When you "feel confident" without data backing
  ✗ When your bankroll grew from one lucky parlay
```

## Step 6: Responsible Gambling

### Self-Assessment

```
ANSWER HONESTLY:
  □ Have you bet more than you can afford to lose?
  □ Have you borrowed money to bet?
  □ Has betting caused relationship problems?
  □ Do you bet to escape problems or negative feelings?
  □ Have you tried to stop betting and couldn't?
  □ Do you feel restless when trying to stop?
  □ Have you lied to others about your betting?
  □ Have you chased losses with bigger bets?

  2+ YES answers → seek professional help
  Resources:
    National Problem Gambling Helpline: 1-800-522-4700
    gamblingtherapy.org
    National Council on Problem Gambling: ncpgambling.org
```

### Hard Limits

```
MANDATORY RULES:
  1. NEVER bet money you need for living expenses
  2. NEVER borrow money to fund betting
  3. NEVER increase stakes to chase losses
  4. ALWAYS set deposit limits at every sportsbook
  5. ALWAYS use a separate bank account for betting
  6. ALWAYS track every bet (not just wins)
  7. ALWAYS take time off — minimum 1 day per week with no bets
  8. ALWAYS have someone you trust who knows you bet and can intervene

  Betting should be +EV activity managed like an investment
  If it becomes compulsive behavior, seek help immediately
```

## Output

Save bankroll plan to `artifacts/prediction-markets/bankroll-plan.md`

## Guidelines

- **Survival is priority #1** — you can't realize edge if you go bust during a drawdown
- **Fractional Kelly (1/4 to 1/2) is the sweet spot** for almost everyone
- If you can't sleep because of your bets, you're betting too much
- Track CLV, not P/L, to evaluate your strategy — P/L is noisy, CLV reveals truth
- The house edge is small (2-5%) but relentless — you need genuine edge to overcome it
- Use `market-mechanics-betting` for Kelly Criterion calculation
- Use `/odds-modeling` to build the edge your bankroll management protects
- Use `/sports-betting` to understand the markets you're managing risk across
