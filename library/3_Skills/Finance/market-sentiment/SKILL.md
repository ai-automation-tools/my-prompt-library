---
name: market-sentiment
description: "Analyze betting market sentiment including line movement, sharp vs public money, steam moves, reverse line movement, and market signals. Use when reading line movement to determine where the smart money is going. Also trigger for 'line movement', 'sharp money', 'public money', 'steam move', 'reverse line movement', 'RLM', 'where the money is', or 'wiseguy action'."
---

# Market Sentiment — Line Movement, Sharp Money & Signals

Read betting market signals to identify where informed money is flowing — distinguish sharp action from public noise and use line movement as an edge.

## When to Use This Skill

**USE when:**
- Interpreting why a line moved (sharp vs. public money)
- Identifying steam moves and reverse line movement (RLM)
- Determining which side the "smart money" favors
- Using market signals as an input to your own model
- Understanding sportsbook line-setting and adjustment behavior

**DON'T USE when:**
- Learning bet types → use `/sports-betting`
- Building predictive models → use `/odds-modeling`
- Finding cross-book arbs → use `/arbitrage-scanner`
- Betting in-play → use `/live-betting-strategy`

## Step 1: How Lines Are Set and Move

### Line Origination

```
OPENING LINE:
  Set by the sportsbook's quantitative models + oddsmakers
  Influenced by:
  ├── Power ratings (internal models)
  ├── Injuries / roster changes
  ├── Historical data and trends
  ├── Home/away, rest, travel
  └── Market expectations (where they think money will land)

MARKET MAKERS (set the line first):
  Pinnacle, Circa, CRIS — accept sharp action, respond with line moves
  Other books copy these lines with slight adjustments

RETAIL BOOKS (follow the market):
  DraftKings, FanDuel, BetMGM, Caesars
  Open near the market-maker line
  Adjust based on their own action AND market-maker movement
  → Often slower to adjust = opportunity for sharp bettors
```

### Why Lines Move

```
REASON 1: MONEY (the most common cause)
  Heavy one-sided action → book adjusts to balance exposure
  Public bet: $10,000 in small bets on Team A
  Sharp bet: $50,000 in one bet on Team B
  → The $50K sharp bet moves the line more than the $10K public sum

REASON 2: INFORMATION
  Injury report released → line adjusts to new team strength
  Weather forecast changes → totals adjust
  Lineup announcement → starters vs. bench players

REASON 3: MARKET CORRECTION
  A market maker (Pinnacle) moves their line
  Other books follow to avoid being "off-market"
  → This is derivative movement, not independent betting action

REASON 4: STEAM
  Multiple sharp bets hit the same side simultaneously across books
  Causes rapid, synchronized line movement
  → Strongest market signal available
```

## Step 2: Sharp vs. Public Money

### Identifying Sharp Action

```
SHARP MONEY INDICATORS:
  ✓ Line moves AGAINST the public betting percentage
    → 75% of bets on Team A, but the line moves toward Team B
    → This means large, few bets (sharp) outweigh many small bets (public)

  ✓ Early week line movement (NFL: Tuesday-Wednesday)
    → Sharps bet early when lines are softest
    → Public bets later (Thursday-Sunday)

  ✓ Line moves at market-making books (Pinnacle, Circa)
    → These books accept sharp action and react to it
    → If Pinnacle moves, it's because sharp money hit them

  ✓ Bet count vs. handle discrepancy
    → 70% of bets on Team A, but only 40% of money on Team A
    → The 30% of bets on Team B are large (sharp) wagers

  ✓ Reverse line movement at multiple books simultaneously
    → When the line moves against the betting consensus at 3+ books
    → This is the strongest sharp money signal

PUBLIC MONEY INDICATORS:
  ✗ Lines move WITH the betting percentage (70% on A, line moves toward A)
  ✗ Movement happens Thursday-Sunday (NFL) or day-of
  ✗ Driven by narratives ("hot team", "big rivalry", "primetime game")
  ✗ Focused on overs, home favorites, popular teams
```

### The Public's Tendencies

```
PUBLIC BETTORS TEND TO:
  ├── Bet favorites (especially home favorites)
  ├── Bet overs (high-scoring games are more fun to root for)
  ├── Follow recent results (recency bias — "they're on a hot streak")
  ├── Overvalue primetime/national TV games
  ├── Back popular brands (Cowboys, Lakers, Yankees)
  ├── Take parlays and teasers (worse EV, more excitement)
  └── Bet on big names (Mahomes, LeBron) regardless of matchup

CONTRARIAN VALUE:
  If 80%+ of bets are on one side AND the line hasn't moved:
  → The book is comfortable with the exposure
  → They WANT the public side to lose
  → Contrarian bet may have value (but isn't automatic — verify with model)
```

## Step 3: Key Market Signals

### Reverse Line Movement (RLM)

```
DEFINITION: When the line moves in the opposite direction of the
             majority of bets placed.

EXAMPLE:
  Open:   Team A -3 (-110)
  Bets:   78% on Team A
  Current: Team A -2.5 (-110)  ← Line moved AWAY from the public side

  WHY THIS HAPPENS:
  The 22% of bets on Team B represent MORE MONEY than the 78% on Team A
  → A few large sharp bets outweigh many small public bets
  → The book respects the sharp money and adjusts

RLM STRENGTH TIERS:
  Weak:    60-65% on one side, line moves 0.5 points against → noise
  Moderate: 70-75% on one side, line moves 1+ point against → worth noting
  Strong:  80%+ on one side, line moves 1+ point against → significant signal
  Extreme: 85%+ on one side, line moves through key number → follow the move

IMPORTANT: RLM is not a standalone strategy
  → Use it as ONE input alongside your own model
  → Sharp money is wrong 40-45% of the time (they're not omniscient)
```

### Steam Moves

```
DEFINITION: Rapid, simultaneous line movement across multiple
             sportsbooks within seconds/minutes.

HOW TO IDENTIFY:
  Time: 0:00  Pinnacle: Team A -3.0
  Time: 0:02  Circa: Team A -3.0 → -3.5
  Time: 0:05  Pinnacle: Team A -3.0 → -3.5
  Time: 0:08  DraftKings: Team A -3.0 → -3.5
  Time: 0:12  FanDuel: Team A -3.0 → -3.5
  → STEAM MOVE detected on Team A

STEAM MOVE SIGNIFICANCE:
  ✓ Multiple sharp bettors or syndicates acting on the same information
  ✓ Often triggered by injury news, weather, or model outputs
  ✓ The fastest and most reliable sharp money indicator
  ✓ Books that haven't yet moved represent "stale lines" — value window

TRADING THE STEAM:
  1. Monitor for multi-book simultaneous movement
  2. If a book hasn't adjusted yet → bet before they do
  3. Window is usually 30 seconds to 5 minutes
  4. Requires multiple funded accounts and fast execution
  5. Books will limit/ban accounts that consistently bet stale lines
```

### Closing Line Value (CLV)

```
THE MOST IMPORTANT CONCEPT IN SPORTS BETTING:

  CLV = the difference between YOUR price and the CLOSING price

  You bet Team A -3 (-110) on Tuesday
  Line closes at Team A -4.5 (-110) on Sunday

  CLV: You got +1.5 points of value
  → The market agreed with your position AND moved past it
  → Getting consistent positive CLV is the strongest signal of long-term profit

WHY CLV MATTERS MORE THAN P/L:
  - Individual bets are coin flips with edge (noisy)
  - P/L over 100 bets is still noisy
  - CLV over 100 bets reveals whether you're consistently beating the market
  - A bettor with negative P/L but positive CLV is UNLUCKY, not WRONG
  - A bettor with positive P/L but negative CLV is LUCKY, not SKILLED

  → Track CLV for every bet. Review monthly.
  → If CLV is positive over 500+ bets, you have a real edge
```

## Step 4: Reading the Market Timeline

### NFL Weekly Line Movement Pattern

```
MONDAY-TUESDAY (Market Opens):
  └── Lines posted at market-making books
  └── Sharpest window — early bets set initial direction
  └── Limits are lowest — books testing the market

WEDNESDAY-THURSDAY (Sharp Phase):
  └── Injury reports influence movement
  └── Syndicate / sharp group bets land
  └── Major line moves happen here
  └── If a line hasn't moved, sharps agree with the open

FRIDAY-SATURDAY (Transition Phase):
  └── Public money starts flowing
  └── Lines adjust for public action
  └── Some late-week sharp moves on updated info
  └── Line begins to firm up toward close

SUNDAY MORNING (Pre-Kickoff):
  └── Final injury reports (90 minutes before kickoff)
  └── Inactive lists confirmed
  └── Final sharp moves (often on weather/injury)
  └── Lines close — market is maximally efficient

OPTIMAL BETTING WINDOWS:
  Sharp approach: Bet Tuesday-Wednesday for best prices
  Contrarian: Bet Sunday morning against inflated public sides
  Steam chasers: Monitor for multi-book moves Wed-Sat
```

### NBA/MLB Daily Patterns

```
NBA:
  Lines posted: ~24 hours before tip
  Sharp window: Morning of game day
  Public window: Afternoon/evening
  Key factor: Injury reports (often updated within hours of game)
  → NBA lines move later than NFL due to shorter cycle

MLB:
  Lines posted: After starting pitcher confirmation
  Sharp window: Morning (confirmed lineups)
  Public window: Afternoon
  Key factor: Starting pitcher (dominates the line)
  → Pitching changes after line is set can create major edges
  → "Listed pitcher" rules: know if your bet is action regardless
```

## Step 5: Building a Sentiment Dashboard

### Data Points to Track

```
FOR EACH GAME:
  ├── Opening line (with timestamp)
  ├── Current line (live tracking)
  ├── Line movement chart (over time)
  ├── Bet percentage (% of bets on each side)
  ├── Money percentage (% of handle on each side)
  ├── RLM indicator (bet% vs movement direction)
  ├── Steam alert (multi-book synchronized movement)
  ├── Pinnacle / Circa line vs. retail book lines
  └── Your model's fair line (for comparison)

SOURCES:
  Free: VegasInsider, Scores and Odds, OddsShark
  Paid: Action Network, Unabated, Sports Insights
  API: Odds API (for programmatic line tracking)
  Prediction markets: Kalshi (use kalshi-markets skill), Polymarket
```

### Interpreting Combined Signals

```
SIGNAL STRENGTH MATRIX:

| RLM | Steam | Model Agrees | Confidence |
|-----|-------|-------------|------------|
| ✓   | ✓     | ✓           | STRONG — multiple independent signals align |
| ✓   | ✓     | ✗           | MODERATE — market knows something, investigate |
| ✓   | ✗     | ✓           | MODERATE — your model + sharp money align |
| ✗   | ✓     | ✓           | MODERATE — steam without RLM can be noise |
| ✓   | ✗     | ✗           | WEAK — sharp money alone isn't enough |
| ✗   | ✗     | ✓           | YOUR MODEL — no market confirmation, proceed carefully |
| ✗   | ✗     | ✗           | NO SIGNAL — skip this game |

BEST SCENARIO: Your model identifies value, then the line moves in
your direction AFTER you've already bet → positive CLV confirmation
```

## Step 6: Common Traps

### Don't Fall For These

```
TRAP 1: "EVERYONE IS ON TEAM A — FADE THE PUBLIC"
  Reality: Public % alone is a weak signal
  Fix: Check if money % disagrees (RLM), not just bet count

TRAP 2: "THE LINE MOVED, SO SHARPS ARE ON THIS SIDE"
  Reality: Lines move for information too (injury, weather)
  Fix: Check WHY the line moved before assuming sharp action

TRAP 3: "STEAM MOVE = GUARANTEED WINNER"
  Reality: Steam moves win ~55-58%, not 100%
  Fix: Use steam as one input, not the entire thesis

TRAP 4: "I'LL JUST FOLLOW THIS SHARP BETTOR'S PICKS"
  Reality: Following picks without understanding the thesis = no edge
  Fix: Understand the reasoning, not just the selection

TRAP 5: "LINE MOVEMENT MEANS THE GAME IS FIXED"
  Reality: Lines move because of money and information flow
  Fix: Market mechanics explain 99.9% of line movement

TRAP 6: "PINNACLE'S CLOSING LINE IS THE TRUE PROBABILITY"
  Reality: It's the most efficient estimate, but still has 2-3% margin
  Fix: Use it as a benchmark, not as gospel
```

## Output

Save sentiment analysis to `artifacts/prediction-markets/sentiment-[event/date].md`

## Guidelines

- **CLV is the single best metric for evaluating your betting** — track it religiously
- Sharp money wins ~55-58% — they're informed, not infallible
- Line movement is a signal, not a strategy — never bet solely because a line moved
- The best scenario: your model finds value → then the line moves your way (positive CLV)
- The public is a useful counter-indicator when combined with RLM, not in isolation
- Use `/sports-betting` for understanding the markets you're reading signals on
- Use `/odds-modeling` to generate your own probability estimates for comparison
- Use `market-mechanics-betting` for edge calculation once you've identified a signal
- Use `/arbitrage-scanner` to exploit stale lines when steam moves haven't propagated
