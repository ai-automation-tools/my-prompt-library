---
name: arbitrage-scanner
description: "Detect and evaluate arbitrage opportunities across sportsbooks and prediction markets. Calculate guaranteed-profit scenarios, middle bets, and cross-platform price discrepancies. Use when comparing odds across books, calculating arb percentages, evaluating middle opportunities, or building odds-comparison workflows. Also trigger for 'arb bet', 'sure bet', 'arbitrage', 'odds comparison', 'middle bet', 'risk-free bet', or 'line shopping'."
---

# Arbitrage Scanner — Cross-Market Profit Opportunities

Identify, calculate, and evaluate arbitrage opportunities where odds discrepancies across platforms guarantee profit regardless of outcome.

## When to Use This Skill

**USE when:**
- Comparing odds across multiple sportsbooks / prediction markets
- Calculating whether an arbitrage exists and its profit margin
- Evaluating middle bet opportunities
- Building a systematic line-shopping workflow
- Checking if a position can be hedged for guaranteed profit

**DON'T USE when:**
- Learning bet types → use `/sports-betting`
- Building predictive models → use `/odds-modeling`
- Sizing value bets (not arbs) → use `market-mechanics-betting`

## What Is Arbitrage?

```
ARBITRAGE: When odds across different platforms imply probabilities
that sum to LESS than 100%, guaranteeing profit regardless of outcome.

Example — Two-outcome event:
  Sportsbook A:  Team X at +150  (implied 40.0%)
  Sportsbook B:  Team Y at +130  (implied 43.5%)

  Total implied: 40.0% + 43.5% = 83.5%  ← UNDER 100% = ARB EXISTS

  Arb margin: 100% - 83.5% = 16.5% guaranteed profit

Typical reality:
  Most arbs are 1-5% margin (not 16.5%)
  After vig removal, many apparent arbs vanish
  Execution risk (odds change, limits, account restrictions)
```

## Step 1: Arb Detection

### Two-Outcome Arb Formula

```
Given:
  Odds A (decimal) = best odds on Outcome 1 (from any book)
  Odds B (decimal) = best odds on Outcome 2 (from any book)

Arb exists if:  (1/Odds_A) + (1/Odds_B) < 1

Arb percentage = (1 - ((1/Odds_A) + (1/Odds_B))) × 100

Example:
  Best Outcome 1: 2.50 (decimal) at BookA
  Best Outcome 2: 1.80 (decimal) at BookB

  Check: (1/2.50) + (1/1.80) = 0.400 + 0.556 = 0.956
  0.956 < 1.0 → ARB EXISTS
  Arb %: (1 - 0.956) × 100 = 4.4% guaranteed profit
```

### Three-Outcome Arb (Soccer, etc.)

```
Odds A = best Home win odds (any book)
Odds B = best Draw odds (any book)
Odds C = best Away win odds (any book)

Arb exists if:  (1/A) + (1/B) + (1/C) < 1

Example:
  Home: 3.20 (BookA)  |  Draw: 3.60 (BookB)  |  Away: 2.40 (BookC)
  Check: 0.3125 + 0.2778 + 0.4167 = 1.007
  1.007 > 1.0 → NO ARB (but close — monitor for movement)
```

### Stake Calculation

```python
def calculate_arb_stakes(total_stake, odds_a, odds_b):
    """Calculate how much to bet on each outcome for equal profit"""
    inv_a = 1 / odds_a
    inv_b = 1 / odds_b
    total_inv = inv_a + inv_b

    if total_inv >= 1:
        return None  # No arb exists

    stake_a = total_stake * (inv_a / total_inv)
    stake_b = total_stake * (inv_b / total_inv)

    profit_if_a = (stake_a * odds_a) - total_stake
    profit_if_b = (stake_b * odds_b) - total_stake

    return {
        'stake_a': round(stake_a, 2),
        'stake_b': round(stake_b, 2),
        'profit_if_a': round(profit_if_a, 2),
        'profit_if_b': round(profit_if_b, 2),
        'arb_pct': round((1 - total_inv) * 100, 2),
        'roi': round(min(profit_if_a, profit_if_b) / total_stake * 100, 2)
    }

# Example
result = calculate_arb_stakes(1000, 2.50, 1.80)
# stake_a: $418.60, stake_b: $581.40
# profit_if_a: $46.51, profit_if_b: $46.51
# arb_pct: 4.40%, roi: 4.65%
```

## Step 2: Types of Arbitrage

### Pure Arbitrage (Sure Bets)

```
DEFINITION: Guaranteed profit with zero risk
MARGIN: Typically 1-4%
FREQUENCY: Rare on major markets, more common on:
  - Cross-sport props
  - Niche leagues (lower divisions, esports)
  - Newly posted lines (before market corrects)
  - Cross-platform (sportsbook vs. exchange)

EXECUTION WINDOW: Seconds to minutes
  → Requires fast multi-account execution
  → Software tools are almost mandatory for consistent arbing
```

### Middle Bets

```
DEFINITION: Bet both sides at different spreads — win both if result
falls in the "middle" window. Guaranteed small loss if it doesn't.

Example:
  BookA: Team X -3.5 at -110
  BookB: Team X +4.5 at -110 (from opponent's perspective)

  If Team X wins by exactly 4:
    -3.5 bet wins (they won by more than 3.5) ✓
    +4.5 bet wins (opponent lost by less than 4.5) ✓
    → WIN BOTH SIDES

  If Team X wins by 5+: Win -3.5 bet, lose +4.5 bet → small loss
  If Team X wins by 3 or less: Lose -3.5 bet, win +4.5 bet → small loss

  COST: ~$9 in vig per $100 staked on each side
  MIDDLE HITS: ~8-12% of the time on 1-point middles in NFL
  EV: Positive if middle probability × payout > guaranteed vig cost
```

### Closing Line Arbitrage

```
DEFINITION: Bet early at one book, then bet the other side at closing
when the line has moved in your favor.

Step 1: Bet Team A -3 (-110) early in the week
Step 2: Wait — line moves to Team A -5
Step 3: Bet Team B +5 (-110) at another book

Middle window: Team A wins by 4 → both bets win
Worst case: Small vig loss on one side

REQUIRES: Ability to identify line movement direction
  → See /market-sentiment for sharp money indicators
```

### Cross-Market Arbitrage

```
SPORTSBOOK vs PREDICTION MARKET:

Sportsbook:        Chiefs to win Super Bowl +500 (16.7% implied)
Prediction Market:  Chiefs Super Bowl "No" at $0.78 (22% implied "Yes")

If the prediction market implies a higher probability of "Yes":
  Bet "Yes" at the sportsbook (+500)
  Bet "No" on the prediction market ($0.78)

  → Different margin structures create opportunities
  → Prediction markets often have lower vig than sportsbooks

SPORTSBOOK vs EXCHANGE:

Sportsbook:  Team A at 2.10
Exchange:    Lay Team A at 2.00 (bet against)

  Back Team A at 2.10 (book)
  Lay Team A at 2.00 (exchange)
  → Guaranteed profit from the odds gap
  → Exchange commission reduces margin (typically 2-5%)
```

## Step 3: Line Shopping Workflow

### Without Arbing — Pure Value Capture

```
Even if no arb exists, line shopping saves money:

SAME BET, DIFFERENT PRICES:
  BookA: Team X -3 at -115
  BookB: Team X -3 at -110  ← SAVE $5 per $100
  BookC: Team X -3 at -105  ← SAVE $10 per $100

IMPACT OVER TIME:
  1,000 bets at $100 each:
    At -115: Need 53.5% win rate to break even
    At -105: Need 51.2% win rate to break even
    Difference: 2.3% fewer wins needed = ~23 fewer wins per 1,000 bets

  → LINE SHOPPING IS THE SINGLE EASIEST EDGE IN SPORTS BETTING
```

### Multi-Book Strategy

```
TIER 1 — SHARP BOOKS (set the line, high limits):
  Pinnacle, Circa, Bookmaker
  → Use for: reading the market, identifying true odds
  → Rarely limited but vig is low

TIER 2 — MAINSTREAM BOOKS (follow the line, medium limits):
  DraftKings, FanDuel, BetMGM, Caesars
  → Use for: best promos, boosts, occasional soft lines
  → Will limit winning accounts over time

TIER 3 — SOFT BOOKS (slow to adjust, low limits):
  Smaller regional books, offshore books
  → Use for: arb opportunities, stale lines
  → Limit quickly, but softest odds

STRATEGY: Track lines at Tier 1, bet at Tier 2/3 when discrepancy exists
```

## Step 4: Risk & Limitations

### Why Arbs Fail

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Odds change** | One side moves before you place the second bet | Bet simultaneously; don't arb margins <1.5% |
| **Account limits** | Sportsbooks limit or ban arb bettors | Round bet amounts, vary patterns, mix in recreational bets |
| **Max bet limits** | Can't place full arb stake at one book | Check max before committing to the other side |
| **Voided bets** | Book cancels one side (palpable error rule) | Never arb obviously wrong lines (likely to be voided) |
| **Settlement differences** | Books settle the same event differently (OT rules, etc.) | Verify settlement rules match before arbing |
| **Correlation** | Two "independent" outcomes are actually correlated | Verify true independence of arb legs |
| **Capital lock** | Money tied up in futures arbs for months | Accounts for opportunity cost in ROI calculation |

### Account Longevity Tips

```
STAY UNDER THE RADAR:
  ✓ Round bets to natural amounts ($50, $100 — not $47.83)
  ✓ Mix arb bets with recreational bets
  ✓ Don't arb every market — be selective
  ✓ Deposit and withdraw at normal intervals
  ✓ Take promotions / boosts (looks recreational)
  ✗ Don't bet exclusively on obscure markets
  ✗ Don't max-bet every arb at the exact limit
  ✗ Don't withdraw immediately after every win

REALITY: On soft books, profitable accounts get limited eventually
  → Diversify across many books
  → Focus on exchanges (Betfair, Smarkets) for unlimited arbing
```

## Step 5: Arb Tracking Spreadsheet

```markdown
| Date | Event | Book A | Odds A | Stake A | Book B | Odds B | Stake B | Total Stake | Arb % | Result | Profit |
|------|-------|--------|--------|---------|--------|--------|---------|-------------|-------|--------|--------|
| 3/30 | NYK vs LAL | DK | +145 | $420 | FD | -135 | $580 | $1000 | 2.1% | NYK W | $21.00 |

MONTHLY SUMMARY:
  Total arbs placed: [count]
  Total capital deployed: [sum of stakes]
  Total profit: [sum of profits]
  Average arb margin: [avg %]
  Failed arbs (odds moved): [count]
  Capital utilization rate: [active capital / total bankroll]
```

## Output

Save arb analysis to `artifacts/prediction-markets/arb-[event/date].md`

## Guidelines

- **Line shopping is mandatory** even if you never arb — always get the best price
- Arbs under 1.5% aren't worth the execution risk for manual bettors
- The best arb is the one where you also have a value opinion on one side
- Prediction markets (Kalshi, Polymarket) vs. sportsbooks are an underexplored arb surface
- Soft books will limit you — budget for account attrition as a cost of doing business
- Use `/sports-betting` to understand the markets you're arbing
- Use `market-mechanics-betting` for optimal stake calculation
- Use `/market-sentiment` to predict which side of an arb will move (bet the moving side last)
