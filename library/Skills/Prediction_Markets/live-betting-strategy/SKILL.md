---
name: live-betting-strategy
description: "Strategies for in-play and live betting including momentum analysis, real-time odds evaluation, hedging mid-game, and situational edges during live events. Use when betting on events in progress, evaluating live odds movement, or identifying in-game value. Also trigger for 'live betting', 'in-play', 'in-game betting', 'cash out', 'live odds', 'momentum betting', or 'in-running'."
---

# Live Betting Strategy — In-Play Analysis & Execution

Exploit the unique dynamics of live / in-play betting where odds update in real-time and new information creates windows of value.

## When to Use This Skill

**USE when:**
- Betting on games or events currently in progress
- Evaluating whether live odds reflect true in-game state
- Hedging a pre-game bet during the event
- Identifying momentum-based or situational edges
- Deciding whether to use sportsbook "cash out" features

**DON'T USE when:**
- Analyzing pre-game lines → use `/sports-betting`
- Building prediction models → use `/odds-modeling`
- Scanning for cross-book arbs → use `/arbitrage-scanner`

## Step 1: How Live Betting Works

### Live Market Mechanics

```
PRE-GAME MARKET:                 LIVE MARKET:
  Set by oddsmakers              Algorithm-driven, updated per play
  Shaped by sharp money          Shaped by game events + money
  Moves slowly (hours/days)      Moves rapidly (seconds)
  Lower vig (4-5%)               Higher vig (6-12%)
  Higher limits                  Lower limits
  More efficient                 Less efficient (opportunity!)

LIVE ODDS UPDATE TRIGGERS:
  ├── Score changes (goal, touchdown, run, basket)
  ├── Game clock events (halftime, period end, 2-minute warning)
  ├── Key plays (red card, injury, turnover, penalty)
  ├── Momentum shifts (possession runs, sustained pressure)
  └── Money flow (heavy one-sided action)

MARKET SUSPENSION:
  During active plays (live ball), markets are briefly suspended
  Re-open with new odds reflecting the completed play
  → In fast sports (basketball), markets may be open <50% of game time
```

### The Live Betting Edge

```
WHY LIVE MARKETS ARE LESS EFFICIENT:
  1. Speed — algorithms can't always model context (is the backup QB good?)
  2. Overreaction — markets swing too far on single events
  3. Narrative lag — sportsbook models weight score over game flow
  4. Human insight — you can see things the algorithm can't
  5. Higher vig — but exploitable edges can exceed the extra vig

THE CATCH:
  ✗ Higher vig eats into thin edges
  ✗ Fast markets require fast decisions (impulse risk)
  ✗ Harder to track and audit live bets systematically
  ✗ Most sportsbooks heavily limit live winning bettors
```

## Step 2: Identifying Live Value

### Score vs. Game State Disconnect

```
THE CORE LIVE BETTING THESIS:
  Odds react to the SCORE, but value exists in the GAME STATE.

EXAMPLE — NFL:
  Team A was -7 pre-game. Team B scores first and leads 7-0.
  Live line: Team A -1 (shifted +6 points based on score)

  But consider:
  ├── Team B's TD was a fluke special teams return
  ├── Team A has dominated possession 70-30%
  ├── Team A's offense is moving the ball at will
  ├── Team B's TD was a 95-yard return (unsustainable)
  └── Pre-game assessment (-7) was based on quality gap

  TRUE EDGE: Team A is still the -7 caliber team, now available at -1
  → The score changed, but the underlying team quality didn't
  → Bet Team A live at -1

EXAMPLE — SOCCER:
  Pre-match: Team A -180 ML (heavy favorite)
  Score: 0-0 at 60 minutes
  Live: Team A -125 (odds softened due to no goal yet)

  But consider:
  ├── Team A has 2.8 xG to Team B's 0.3 xG
  ├── Team A has hit the woodwork twice
  ├── Team B's goalkeeper is having a career game
  ├── 30 minutes remain — plenty of time for xG to convert
  └── The score is unlucky, not indicative of quality gap

  TRUE EDGE: xG says Team A should be ahead — odds have softened unfairly
```

### Common Live Value Patterns

| Pattern | What Happens | Where the Value Is |
|---------|-------------|-------------------|
| **Fluky early score** | Inferior team scores first on a trick play / error | Back the favorite at improved odds |
| **Dominant but scoreless** | Better team controlling play but can't convert | Back the better team before regression |
| **Star player exit** | Key player injured, odds shift dramatically | Evaluate if the shift is excessive |
| **Weather change** | Wind picks up, rain starts mid-game | Bet unders if conditions deteriorate |
| **Garbage time** | Losing team scoring late against prevent defense | Spreads narrow but game outcome isn't changing |
| **Momentum overreaction** | Team scores twice quickly, odds swing huge | Assess if momentum is sustainable or a spike |

## Step 3: Sport-Specific Live Strategies

### NFL Live Betting

```
HIGH-VALUE SITUATIONS:
  1. First quarter unders after early touchdowns
     → If both teams score TDs in Q1, public hammers the over
     → But defensive adjustments typically slow scoring in Q2-Q3
     → Line often over-adjusts upward after high-scoring first quarters

  2. Favorite trailing by 7-10 in the first half
     → Markets overweight early deficits
     → Superior teams (pre-game -7 or more) recover at high rates
     → Live spread often offers better value than pre-game

  3. Post-turnover line shifts
     → A pick-six shifts the spread dramatically
     → But turnovers are high-variance, often unpredictable
     → Quality gap hasn't changed — just the score

AVOID:
  ✗ Live betting the fourth quarter of blowouts (garbage time distortions)
  ✗ Live totals after a high-scoring first half (mean reversion is powerful)
```

### NBA Live Betting

```
HIGH-VALUE SITUATIONS:
  1. Run-response opportunities
     → Team goes on a 15-3 run, live odds swing dramatically
     → NBA games have natural scoring runs — they almost always even out
     → Bet against the run team when odds swing >5 points from pre-game

  2. Foul trouble for stars
     → Star picks up 2 fouls in Q1, odds shift
     → But the star will return and play 30+ minutes regardless
     → Market overreacts to temporary absence

  3. First half vs second half splits
     → Some teams are well-known second-half teams (better conditioning)
     → First-half deficit doesn't predict second-half performance linearly

AVOID:
  ✗ Betting final 2 minutes (intentional fouls, timeouts destroy all models)
  ✗ Reacting to early-game shooting variance (3PT% normalizes)
```

### Soccer Live Betting

```
HIGH-VALUE SITUATIONS:
  1. Red card adjustment
     → A red card (team plays with 10 players) shifts the line significantly
     → But 10-man teams often tighten up defensively and absorb pressure
     → "Under" goals after a red card often has value in the minutes after

  2. xG vs scoreline divergence
     → Team with 2.5 xG is losing 0-1 to team with 0.3 xG
     → This is extreme variance — the better team's odds are inflated
     → Live moneyline on the xG-dominant team often has value

  3. 0-0 at 60+ minutes
     → Under markets firm up (less time for goals)
     → But the 0-0 may also mean the game is tight and opens up late
     → Both sides can have value depending on game state vs. score

AVOID:
  ✗ Betting right after a goal (odds are most accurate then)
  ✗ Chasing late equalizers (emotional, not analytical)
```

## Step 4: Cash Out & Hedging

### When to Cash Out (Sportsbook Feature)

```
SPORTSBOOK CASH OUT:
  The sportsbook offers to settle your bet early at reduced profit.
  Example: You bet $100 on Team A at +300 to win $300.
  At halftime, Team A is winning. Cash out offer: $220.

SHOULD YOU CASH OUT?
  Almost always: NO.

  WHY:
  ├── Cash out prices include vig (you get less than fair value)
  ├── You made the bet because you had edge — the edge still exists
  ├── If you cash out every winner early, you cap upside but keep full downside
  └── The sportsbook wouldn't offer cash out if it wasn't profitable for THEM

WHEN CASH OUT IS JUSTIFIED:
  ✓ Your pre-game analysis was wrong (new info changed your view)
  ✓ Key injury changes the game fundamentally
  ✓ You need the money for a higher-edge opportunity right now
  ✗ You're scared of losing — this is emotional, not analytical
```

### Manual Hedging (Better Than Cash Out)

```
INSTEAD OF CASH OUT: Place a counter-bet at another sportsbook

Example — Super Bowl futures hedge:
  Pre-season: Bet $200 on Chiefs at +1000 to win $2,000

  Chiefs make the Super Bowl against Eagles.
  Live line: Eagles +130 (implied 43.5%)

  OPTION A — Cash out: Sportsbook offers $700 (vig-reduced)
  OPTION B — Hedge: Bet Eagles +130 at another book

  HEDGE CALCULATION:
  To guarantee equal profit on either outcome:
    Hedge stake = (Potential payout × 1 / (Opponent odds + 1)) adjusted

    Potential Chiefs win: $2,200 total return
    Bet $950 on Eagles at +130:
      If Chiefs win: +$2,200 - $950 = +$1,250
      If Eagles win: +$1,235 - $200 = +$1,035
    → Guaranteed $1,000+ profit vs. cash out $700

  Or: BET SOME on Eagles, LEAVE SOME upside on Chiefs
    Bet $500 on Eagles at +130:
      If Chiefs win: +$2,200 - $500 = +$1,700
      If Eagles win: +$650 - $200 = +$450
    → Guaranteed profit with more upside if Chiefs win
```

## Step 5: Discipline & Execution

### Live Betting Rules

```
PRE-COMMIT RULES (set BEFORE the game starts):
  1. Identify 1-3 specific scenarios where you will bet live
     → "I will bet Team A live if they trail by 7+ in Q1"
  2. Set max live bet budget per game (e.g., 2 units total)
  3. Set a timer — no live bets in the last 10% of the game
  4. Write down your thesis BEFORE placing the bet

EXECUTION RULES:
  ✓ Only bet live on games you're watching
  ✓ Only bet live on situations you identified pre-game
  ✓ Compare live odds to your pre-game model
  ✓ Account for the higher vig in your edge calculation
  ✗ Never bet live just because you're watching and it's exciting
  ✗ Never chase a pre-game loss with live bets
  ✗ Never exceed your pre-set live betting budget
```

### Live Bet Tracking

```markdown
| Time | Game | Situation | Pre-Game Line | Live Line | My Edge Thesis | Stake | Result |
|------|------|-----------|--------------|-----------|----------------|-------|--------|
| Q1 8:00 | KC vs BUF | BUF scores first on fumble return | KC -7 | KC -1 | Fluky score, KC still better | 1u | W |

POST-GAME REVIEW:
  Was my thesis correct? [yes/no]
  Was the live line truly mispriced? [yes/no]
  Would I make this bet again? [yes/no]
  Category: [score disconnect / momentum overreaction / situational edge]
```

## Output

Save live betting analysis to `artifacts/prediction-markets/live-[event]-[date].md`

## Guidelines

- **Pre-plan your live bets** — the worst live bets are impulse bets while watching
- The score changed, but did the team quality change? That's the core live betting question
- Live vig is higher (6-12%) — your edge needs to be larger to overcome it
- Manual hedging at a second sportsbook almost always beats the "cash out" button
- If you can't articulate your edge in one sentence, don't bet
- Use `/sports-betting` for understanding the bet types available live
- Use `/odds-modeling` to have a pre-game model to compare live odds against
- Use `/bankroll-management` for setting live betting session limits
