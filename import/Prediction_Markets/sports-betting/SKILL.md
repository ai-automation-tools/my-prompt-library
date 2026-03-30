---
name: sports-betting
description: "Sports betting fundamentals including spreads, moneylines, totals, parlays, teasers, props, and futures. Use when analyzing sports betting markets, converting odds formats, evaluating bet types, or building a sports betting strategy. Also trigger for 'point spread', 'moneyline', 'over under', 'parlay', 'prop bet', 'teaser', 'sports odds', or 'sportsbook'."
---

# Sports Betting — Lines, Markets & Bet Types

Understand and navigate sports betting markets — from reading lines to identifying value across every major bet type.

## When to Use This Skill

**USE when:**
- Analyzing sports betting lines (spreads, totals, moneylines)
- Converting between odds formats (American, decimal, fractional)
- Evaluating parlay/teaser/prop value
- Understanding how sportsbooks set and move lines
- Building a structured approach to sports wagering

**DON'T USE when:**
- Building predictive models → use `/odds-modeling`
- Sizing bets optimally → use `market-mechanics-betting` (Kelly Criterion)
- Scanning for arbitrage → use `/arbitrage-scanner`
- Analyzing line movement / sharp action → use `/market-sentiment`

## Odds Formats & Conversion

### The Three Formats

| Format | Example (same probability) | Where Used |
|--------|---------------------------|-----------|
| **American** | -150 / +130 | USA sportsbooks |
| **Decimal** | 1.67 / 2.30 | Europe, Australia, exchanges |
| **Fractional** | 2/3 / 13/10 | UK, horse racing |

### Conversion Formulas

```
AMERICAN → DECIMAL:
  Favorite (-):  Decimal = 1 + (100 / |American|)
    -150 → 1 + (100/150) = 1.667
  Underdog (+):  Decimal = 1 + (American / 100)
    +130 → 1 + (130/100) = 2.300

DECIMAL → IMPLIED PROBABILITY:
  Probability = 1 / Decimal
    1.667 → 59.9%
    2.300 → 43.5%

AMERICAN → IMPLIED PROBABILITY:
  Favorite (-):  Prob = |American| / (|American| + 100)
    -150 → 150/250 = 60.0%
  Underdog (+):  Prob = 100 / (American + 100)
    +130 → 100/230 = 43.5%

NOTE: Implied probabilities sum to >100% — the excess is the vig/juice
  60.0% + 43.5% = 103.5% → vig = 3.5%
```

### Vig (Juice) Removal

```
To find "true" odds, remove the overround:

Total implied probability = P1 + P2 = 103.5%
True P1 = P1 / total = 60.0% / 103.5% = 57.97%
True P2 = P2 / total = 43.5% / 103.5% = 42.03%

True probabilities sum to 100%
The sportsbook's margin was 3.5% (their edge)

STANDARD VIG BY SPORT:
  NFL/NBA sides:     -110/-110 → 4.55% vig
  MLB moneyline:     Varies → 3-5% vig
  Soccer 3-way:      Higher → 5-8% vig
  Props:             Higher → 5-10% vig
  Live betting:      Highest → 6-12% vig
```

## Bet Types

### 1. Moneyline (Winner)

```
The simplest bet — pick who wins.

Example:
  Lakers    -180  (implied 64.3%)
  Celtics   +155  (implied 39.2%)

EDGE CASE: What about ties/draws?
  NFL: Push (bet returned) — rare with OT
  Soccer: 3-way moneyline (Home / Draw / Away)
  MLB: No ties, extra innings until winner

WHEN TO USE MONEYLINE:
  ✓ Strong opinion on winner but not margin
  ✓ Underdog value (big plus-money)
  ✗ Heavy favorites (-300+) — poor risk/reward ratio
```

### 2. Point Spread (Against the Spread / ATS)

```
Bet on the margin of victory.

Example:
  Chiefs    -6.5  (-110)
  Bills     +6.5  (-110)

  Chiefs must win by 7+ for Chiefs -6.5 to cash
  Bills can lose by 6 or less (or win) for Bills +6.5 to cash

KEY NUMBERS (NFL):
  3:  ~15% of games decided by exactly 3 (FG margin)
  7:  ~10% of games decided by exactly 7 (TD margin)
  → Getting +3 vs +2.5 or +7 vs +6.5 is significant value

HALF-POINT HOOKS:
  -6.5 vs -7:   The half-point eliminates pushes
  Buying a half-point costs ~10 cents of juice
  Worth it across key numbers (3, 7, 10, 14)
```

### 3. Totals (Over/Under)

```
Bet on combined score of both teams.

Example:
  Game Total: 224.5  Over -110 / Under -110

  Both teams combine for 225+ → Over wins
  Both teams combine for 224 or less → Under wins

FACTORS AFFECTING TOTALS:
  ├── Pace of play (fast = higher totals)
  ├── Defensive efficiency
  ├── Weather (outdoor sports — wind, cold push unders)
  ├── Altitude (Denver = higher totals in baseball)
  ├── Injuries to key offensive/defensive players
  └── Rest days / back-to-back scheduling
```

### 4. Parlays

```
Combine multiple bets — all must win.

TRUE ODDS PARLAY:
  Bet 1: -110 (decimal 1.909)
  Bet 2: -110 (decimal 1.909)
  Bet 3: -110 (decimal 1.909)

  True parlay decimal = 1.909 × 1.909 × 1.909 = 6.96
  $100 bet wins $596

SPORTSBOOK PARLAY (often use preset payouts):
  3-leg parlay at -110 each → usually pays 6:1 ($600)
  → Sportsbook edge increases with each leg

PARLAY MATH REALITY:
  | Legs | Win Probability (50% each) | Payout | Expected Value |
  |------|---------------------------|--------|----------------|
  | 2    | 25.0%                     | ~2.6:1 | -$3.40 per $100 |
  | 3    | 12.5%                     | ~6:1   | -$12.50 per $100 |
  | 4    | 6.25%                     | ~10:1  | -$31.25 per $100 |
  | 5    | 3.125%                    | ~20:1  | -$37.50 per $100 |

  → EV gets WORSE with each leg
  → Parlays are the sportsbook's best friend

CORRELATED PARLAYS (where value exists):
  Same-game: "Team wins + team's star scores 25+"
  Weather: "Under on total + running back over rushing yards"
  → If the legs are positively correlated, parlay odds may offer value
  → Most sportsbooks now restrict obviously correlated parlays
```

### 5. Teasers

```
Modified parlays where you buy points across multiple selections.

NFL STANDARD TEASER (6 points):
  Original: Chiefs -7 / Cowboys -3
  Teased:   Chiefs -1 / Cowboys +3

  Both adjusted lines must cover for the teaser to win

OPTIMAL TEASER STRATEGY (Wong Teasers):
  ✓ NFL only (most studied, best data)
  ✓ 6-point teasers crossing key numbers 3 AND 7:
    - Favorites -7.5 to -8.5 → tease to -1.5 to -2.5
    - Underdogs +1.5 to +2.5 → tease to +7.5 to +8.5
  ✓ 2-team teasers only (more legs = worse EV)
  ✗ Avoid teasing totals (less valuable key numbers)
  ✗ Avoid NBA/MLB teasers (less data, different scoring patterns)
```

### 6. Props (Proposition Bets)

```
Bets on specific player or game events, not final score.

PLAYER PROPS:
  Patrick Mahomes Over/Under 275.5 passing yards
  LeBron James Over/Under 27.5 points
  Shohei Ohtani Over/Under 6.5 strikeouts

GAME PROPS:
  First team to score
  Will there be overtime?
  Total touchdowns (odd/even)
  First half spread / total

PROP VALUE INDICATORS:
  ✓ Less efficient markets (less sharp money, wider vig)
  ✓ Correlation opportunities (build your own model)
  ✓ Injury/situation edges (you can react faster than the line)
  ✗ Higher vig than sides/totals (5-10% vs 4.5%)
  ✗ Lower limits (sportsbooks protect themselves on thin markets)
```

### 7. Futures

```
Bets on season-long or tournament outcomes.

Examples:
  Super Bowl winner: Chiefs +500
  NBA MVP: Jokic +350
  Premier League relegation: Leicester +200

FUTURES CHARACTERISTICS:
  ├── Tied-up capital (money locked until season ends)
  ├── High vig (10-30% overround on futures markets)
  ├── Early value (lines are softest before season starts)
  ├── Hedging opportunities (if your team reaches finals, bet the other side)
  └── Middle possibilities (take multiple positions over time as odds shift)

FUTURES VALUE TIMELINE:
  Pre-season:  Softest lines, most value, longest capital lock
  Early season: Overreaction to small samples → contrarian value
  Mid-season:  Lines sharpen, less value
  Late season:  Value only on overlooked teams
  Playoffs:     Hedging window for existing futures
```

## Sport-Specific Considerations

### NFL

```
MARKET EFFICIENCY: Most efficient (most bet volume)
KEY NUMBERS: 3, 7, 6, 10, 14
LINE MOVES: Lines move most Sunday morning (injury reports, weather)
SHARP WINDOW: Early week (Tuesday/Wednesday) for opening value
PUBLIC BIAS: Home favorites, prime-time overs, popular teams
```

### NBA

```
MARKET EFFICIENCY: High (second most volume in US)
KEY NUMBERS: Less important than NFL (higher scoring)
REST IMPACT: Back-to-backs significantly affect performance
INJURY IMPACT: Star player absence moves lines 3-5 points
PUBLIC BIAS: Overs, big-market teams, national TV games
```

### MLB

```
MARKET EFFICIENCY: Moderate
STARTING PITCHER: Dominates line — listed pitcher rules
WEATHER: Wind direction at Wrigley can swing totals 2+ runs
RUN LINE: -1.5/+1.5 is the MLB "spread" (not as efficient as NFL)
PUBLIC BIAS: Overs, popular teams, aces
REVERSE RLM: Line moving toward the underdog starter = sharp signal
```

### Soccer

```
MARKET EFFICIENCY: Very high in top European leagues
3-WAY MONEYLINE: Home / Draw / Away (draw is key — ~25% of matches)
ASIAN HANDICAP: Eliminates the draw — half/quarter line system
TOTAL GOALS: Usually 2.5 (over/under)
PUBLIC BIAS: Home teams, big clubs, overs
IN-PLAY: ~70% of soccer handle is live betting (European markets)
```

## Building Your Edge

### The Value Bet Framework

```
Step 1: ESTIMATE true probability (your model or analysis)
Step 2: CONVERT sportsbook odds to implied probability
Step 3: COMPARE — if your estimate > implied prob, you have edge

  Your estimate:     55% chance Team A wins
  Sportsbook implied: 50% (even odds, +100)
  Edge = 55% - 50% = 5% → BET

  Your estimate:     55% chance Team A wins
  Sportsbook implied: 60% (Team A -150)
  Edge = 55% - 60% = -5% → PASS

Step 4: SIZE the bet using Kelly Criterion
  → See market-mechanics-betting skill

Step 5: TRACK results over 500+ bets to validate edge
```

### Record Keeping

```markdown
## Bet Tracking Spreadsheet Columns

| Date | Sport | Bet Type | Selection | Odds | Stake | Result | P/L | Closing Line | CLV |
|------|-------|----------|-----------|------|-------|--------|-----|-------------|-----|

KEY METRIC — CLOSING LINE VALUE (CLV):
  If you bet Team A -3 (-110) and the line closes at -4 (-110):
  → You got a better number than the market settled on
  → Consistent positive CLV is the best predictor of long-term profit
  → More reliable than short-term P/L (which is noisy)
```

## Guidelines

- **The line is the market's best estimate** — you need a specific, quantifiable reason to disagree
- **Volume matters** — 100 bets tells you nothing; 1,000+ starts to reveal if you have edge
- **Closing Line Value (CLV) is king** — beating the closing line consistently = long-term winner
- Parlays are entertainment, not strategy (except correlated same-game parlays with modeled edge)
- The vig is real — you need to win ~52.4% at -110 just to break even
- Use `/odds-modeling` to build the predictive models that generate your edge
- Use `market-mechanics-betting` for optimal bet sizing once you've found edge
- Use `/bankroll-management` to protect your capital through variance
