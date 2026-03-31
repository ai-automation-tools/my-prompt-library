---
name: futures-trading
description: "Understand and trade futures contracts on commodities, indices, crypto, and event outcomes. Covers contract mechanics, margin, settlement, spreads, and risk. Use when analyzing futures markets, understanding contract specs, evaluating margin requirements, or building futures strategies. Also trigger for 'futures contract', 'commodities trading', 'futures margin', 'contract specs', 'futures spread', 'oil futures', 'crypto futures', or 'index futures'."
---

# Futures Trading — Contracts, Margin & Strategy

Understand futures contracts — from traditional commodities and financial indexes to crypto perpetuals and event futures — and how to trade them.

## When to Use This Skill

**USE when:**
- Understanding futures contract mechanics (specs, margin, settlement)
- Analyzing commodity, index, crypto, or event futures
- Evaluating margin requirements and leverage risk
- Building spread or hedging strategies
- Connecting prediction markets to traditional futures

**DON'T USE when:**
- Betting on sports outcomes → use `/sports-betting`
- Building predictive models → use `/odds-modeling`
- Managing betting capital → use `/bankroll-management`

## Step 1: Futures Contract Fundamentals

### What Is a Futures Contract?

```
A FUTURES CONTRACT is a binding agreement to buy or sell a specific
asset at a predetermined price on a specific future date.

KEY CHARACTERISTICS:
  ├── Standardized (exchange-defined size, expiry, quality)
  ├── Leveraged (control large notional value with small margin)
  ├── Zero-sum (every winner has a loser)
  ├── Mark-to-market (daily profit/loss settlement)
  └── Expiration (contracts expire — must roll or settle)

LONG POSITION:  You agree to BUY at the contract price
  → Profit if price goes UP
  → Loss if price goes DOWN

SHORT POSITION: You agree to SELL at the contract price
  → Profit if price goes DOWN
  → Loss if price goes UP
```

### Contract Specification Template

```markdown
## Contract: [Name]

| Spec | Value |
|------|-------|
| **Symbol** | [ticker] |
| **Exchange** | [CME, NYMEX, ICE, etc.] |
| **Underlying** | [what the contract represents] |
| **Contract Size** | [units per contract] |
| **Tick Size** | [minimum price movement] |
| **Tick Value** | [dollar value of one tick] |
| **Trading Hours** | [when the market is open] |
| **Expiration** | [monthly, quarterly, etc.] |
| **Settlement** | [physical delivery or cash settled] |
| **Initial Margin** | [$ required to open position] |
| **Maintenance Margin** | [$ required to maintain position] |
```

### Major Futures Markets

| Category | Contracts | Exchange | Key Drivers |
|----------|----------|----------|-------------|
| **Equity Index** | ES (S&P 500), NQ (Nasdaq), YM (Dow) | CME | Economy, earnings, Fed policy |
| **Energy** | CL (Crude Oil), NG (Natural Gas), RB (Gasoline) | NYMEX | OPEC, geopolitics, weather, demand |
| **Metals** | GC (Gold), SI (Silver), HG (Copper) | COMEX | Inflation, USD, industrial demand |
| **Agriculture** | ZC (Corn), ZS (Soybeans), ZW (Wheat) | CBOT | Weather, harvest, trade policy |
| **Rates** | ZN (10Y Treasury), ZB (30Y Bond), ZQ (Fed Funds) | CBOT | Fed policy, inflation data |
| **FX** | 6E (Euro), 6J (Yen), 6B (Pound) | CME | Interest rate differentials, trade |
| **Crypto** | BTC (Bitcoin), ETH (Ethereum) | CME | Sentiment, regulation, adoption |
| **Event** | Kalshi, CME Event contracts | Various | Election, weather, economic data |

## Step 2: Margin & Leverage

### How Margin Works

```
INITIAL MARGIN: Cash required to OPEN a position
MAINTENANCE MARGIN: Cash required to KEEP a position open
MARGIN CALL: When account equity drops below maintenance margin
  → Must deposit more funds or position is liquidated

EXAMPLE — E-mini S&P 500 (ES):
  Contract size: 50 × S&P 500 index
  S&P 500 at 5,200 → notional value: $260,000
  Initial margin: ~$13,200 (varies by broker/exchange)
  Leverage ratio: $260,000 / $13,200 = ~20:1

  1-point move in S&P = $50 per contract
  10-point move = $500 (3.8% of margin)
  50-point move = $2,500 (18.9% of margin)

  → A 2% market move can wipe out 40%+ of your margin
  → LEVERAGE IS THE MOST DANGEROUS FEATURE OF FUTURES
```

### Leverage Risk Table

| Account Size | Contracts (ES) | Notional | Leverage | 2% Adverse Move |
|-------------|----------------|----------|----------|----------------|
| $25,000 | 1 | $260K | 10:1 | -$5,200 (-20.8%) |
| $25,000 | 2 | $520K | 20:1 | -$10,400 (-41.6%) |
| $25,000 | 5 | $1.3M | 52:1 | -$26,000 (-104%) → MARGIN CALL |

```
POSITION SIZING RULE:
  Risk per trade: 1-2% of account
  Set stop-loss BEFORE entering
  Calculate contracts: max_loss / (stop_distance × tick_value)

  Account: $50,000, Risk: 1% ($500), Stop: 10 points on ES
  Contracts = $500 / (10 × $50) = 1 contract
```

## Step 3: Contract Types

### Standard vs. Micro vs. Event

```
E-MINI S&P 500 (ES):
  Size: $50 × index
  Margin: ~$13,200
  Who: Professional and funded retail traders

MICRO E-MINI S&P 500 (MES):
  Size: $5 × index (1/10th of ES)
  Margin: ~$1,320
  Who: Retail traders, smaller accounts

NANO / EVENT CONTRACTS:
  Size: Fixed payout ($1 per contract on Kalshi, binary outcomes)
  Margin: Contract price (e.g., $0.65 to buy "Yes" at 65%)
  Who: Prediction market participants, retail speculators
```

### Cash-Settled vs. Physical Delivery

```
CASH-SETTLED (most financial futures):
  At expiration, no asset changes hands
  The difference between contract price and settlement price is paid in cash
  Example: ES settles to the S&P 500 index value
  → No risk of accidentally receiving 1,000 barrels of oil

PHYSICAL DELIVERY (some commodity futures):
  At expiration, the actual commodity must be delivered/received
  Example: CL (crude oil) → 1,000 barrels delivered to Cushing, OK
  → Retail traders must CLOSE positions before first notice day
  → April 2020: WTI went NEGATIVE because holders couldn't take delivery
```

### Perpetual Futures (Crypto)

```
CRYPTO PERPETUALS (no expiration):
  ├── No settlement date — positions can be held indefinitely
  ├── Funding rate: periodic payments between longs and shorts
  │   → If funding is positive: longs pay shorts (bullish sentiment)
  │   → If funding is negative: shorts pay longs (bearish sentiment)
  ├── Tracks spot price via funding mechanism
  ├── Leverage: Often 1x-100x+ (extremely dangerous at high leverage)
  └── 24/7 trading (no market close)

FUNDING RATE AS SIGNAL:
  High positive funding (>0.05% per 8hr):
    → Market is excessively long → contrarian short signal
  High negative funding (<-0.05% per 8hr):
    → Market is excessively short → contrarian long signal
  → Not a timing tool — but useful for gauging sentiment extremes
```

## Step 4: Trading Strategies

### Directional Trading

```
LONG: Buy contract expecting price to rise
SHORT: Sell contract expecting price to fall

ENTRY FRAMEWORK:
  1. Fundamental thesis (why should price move?)
  2. Technical entry (when to enter?)
  3. Position size (how much?)
  4. Stop-loss (where am I wrong?)
  5. Target (where do I take profit?)

RISK:REWARD MINIMUM: 1:2
  Risk $500 to make $1,000
  Even with 40% win rate, this is profitable:
    40 wins × $1,000 = $40,000
    60 losses × $500 = $30,000
    Net: +$10,000
```

### Spread Trading

```
CALENDAR SPREAD (same product, different expirations):
  Buy December Gold / Sell February Gold
  Profit from changes in the relationship between months
  Lower margin than outright positions
  Lower risk than directional trading

INTER-COMMODITY SPREAD (related products):
  Crack spread: Buy crude oil / Sell gasoline + heating oil
  Crush spread: Buy soybeans / Sell soybean meal + soybean oil
  → Profit from refining/processing margin changes

CORRELATION TRADE:
  Long Gold / Short Silver (trading the gold-silver ratio)
  Long ES / Short NQ (trading tech vs. broad market)
  → Hedged exposure to the specific relationship
```

### Hedging

```
PURPOSE: Offset existing risk exposure

EXAMPLES:
  Farmer with corn crop → SHORT corn futures (lock in sale price)
  Airline with fuel costs → LONG crude oil futures (lock in purchase price)
  Investor with stock portfolio → SHORT index futures (protect against drawdown)
  Bitcoin holder → SHORT BTC futures (hedge downside risk)

HEDGE RATIO:
  Contracts needed = (Portfolio value × Beta) / (Contract size × Index price)
  $500K portfolio, Beta 1.1, ES at 5,200:
  Contracts = ($500,000 × 1.1) / ($50 × 5,200) = 2.1 → SHORT 2 ES contracts
```

## Step 5: Prediction Markets as Futures

### Event Futures vs. Traditional Futures

```
SIMILARITIES:
  ├── Both are contracts on future outcomes
  ├── Both have market-determined prices
  ├── Both involve buyers and sellers
  └── Both settle at a known future date

DIFFERENCES:
  | Feature | Traditional Futures | Event Futures |
  |---------|-------------------|---------------|
  | Outcome | Continuous price | Binary (Yes/No) |
  | Settlement | Cash/physical at market price | Fixed payout ($1 for Yes) |
  | Leverage | High (margin-based) | None (pay full contract price) |
  | Underlying | Commodities, indices | Events, elections, data releases |
  | Regulation | CFTC (well-established) | CFTC (newer framework) |

KALSHI EVENT CONTRACTS:
  "Will CPI be above 3% in March?" → Yes at $0.72, No at $0.28
  If Yes: receive $1.00 (profit: $0.28)
  If No: receive $0.00 (loss: $0.72)
  → Effectively a binary option with event outcome settlement
  → See kalshi-markets skill for API/data access
```

### Trading the Macro Connection

```
EVENT FUTURES ←→ TRADITIONAL FUTURES:

"Fed to cut rates in June" at $0.40 on prediction market
  → If you believe rate cuts → also consider:
    LONG ZN (Treasury notes — rates down = bonds up)
    LONG GC (Gold — lower rates = weaker USD = gold up)
    LONG ES (Stocks — lower rates = risk-on)

"Oil production cut by OPEC" at $0.55
  → If you believe production cut → also consider:
    LONG CL (Crude oil — less supply = higher price)
    SHORT XLE puts (Energy stocks benefit)

STRATEGY: Use prediction markets for signal, trade traditional futures for leverage
  → Prediction markets are often more informationally efficient on political/event risk
  → Traditional futures offer more liquidity and leverage
```

## Step 6: Risk Controls for Futures

### Mandatory Rules

```
1. ALWAYS use stop-losses — futures can move against you faster than you can react
2. NEVER risk more than 2% of account on a single trade
3. NEVER hold a position you can't monitor (overnight gap risk)
4. ALWAYS know the margin requirements BEFORE entering
5. ALWAYS understand the contract specs (size, tick value, settlement type)
6. NEVER add to a losing position ("averaging down" with leverage = death)
7. ALWAYS have a plan for what to do if the market halts (limit up/down)
8. ALWAYS account for rollover costs when holding positions across expirations
```

### Max Position Limits

```
SUGGESTED MAXIMUMS BY ACCOUNT SIZE:

| Account | Max Notional Exposure | Max Contracts (ES) | Max % in One Trade |
|---------|----------------------|--------------------|--------------------|
| $25K    | $125K (5:1)          | 0-1                | 5% risk            |
| $50K    | $250K (5:1)          | 1-2                | 3% risk            |
| $100K   | $500K (5:1)          | 2-4                | 2% risk            |
| $250K+  | $1.25M (5:1)         | 5-10               | 1% risk            |

NOTE: These are CONSERVATIVE limits
  → Professional leverage is often 2-3:1, not 20:1
  → The leverage available to you is NOT the leverage you should use
```

## Output

Save trading plan to `artifacts/prediction-markets/futures-plan.md`

## Guidelines

- **Leverage amplifies everything** — wins, losses, emotions, and mistakes
- The margin you can use is not the margin you should use — target 3-5:1 max
- Futures are zero-sum — for every dollar you make, someone else loses one
- Understand what you're trading — contract specs, delivery, and settlement before you enter
- Event futures (Kalshi, CME) bridge prediction markets and traditional finance — use both
- Use `/bankroll-management` for capital preservation discipline
- Use `market-mechanics-betting` for position sizing with Kelly
- Use `kalshi-markets` or `polymarket` for prediction market-specific data
