---
name: game-analytics
description: Design telemetry systems, define KPIs, analyze player behavior data, and set up dashboards for data-driven game design decisions. Use when instrumenting a game for analytics or interpreting player data. Also trigger for "game telemetry", "player analytics", "game metrics", "KPIs", "player retention", "funnel analysis", or "player behavior".
---

# Game Analytics — Telemetry, KPIs & Data-Driven Design

Instrument your game to understand player behavior, measure engagement, and make informed design decisions backed by data.

## Inputs

- Game design document (use `/game-design-document` for reference)
- Monetization model (affects which KPIs matter most)
- Analytics platform (Unity Analytics, GameAnalytics, custom, etc.)
- Privacy/compliance requirements (GDPR, COPPA)

## Step 1: Define Key Performance Indicators

### Universal Game KPIs

| KPI | Formula | Healthy Range | Concern Threshold |
|-----|---------|---------------|-------------------|
| **DAU** | Unique players per day | Growing or stable | >10% week-over-week decline |
| **MAU** | Unique players per month | Growing | <3× DAU (low stickiness) |
| **DAU/MAU** | Stickiness ratio | 0.2-0.5 | <0.15 |
| **D1 Retention** | % return day after install | 35-50% | <25% |
| **D7 Retention** | % return 7 days after install | 15-25% | <10% |
| **D30 Retention** | % return 30 days after install | 5-15% | <3% |
| **Session length** | Avg time per session | 15-45 min | <5 min or >3 hours |
| **Sessions/day** | Avg sessions per DAU | 1.5-3 | <1.2 |
| **FTUE completion** | % completing tutorial | >80% | <60% |

### F2P-Specific KPIs

| KPI | Formula | Healthy Range |
|-----|---------|---------------|
| **ARPDAU** | Revenue / DAU | $0.05-0.30 |
| **ARPPU** | Revenue / paying users | $5-25 |
| **Conversion rate** | Paying users / total users | 2-5% |
| **LTV** | Lifetime revenue per user | >CPI (cost per install) |
| **CPI** | Marketing spend / installs | Varies by platform |
| **LTV/CPI ratio** | Return on acquisition | >1.5 (profitable) |

### Premium Game KPIs

| KPI | Formula | Target |
|-----|---------|--------|
| **Completion rate** | % finishing main story | >30% |
| **Refund rate** | Refunds / sales | <5% |
| **Review score** | Avg user review | >80% positive |
| **Median playtime** | 50th percentile total hours | >50% of content |
| **Wishlist conversion** | Sales / wishlists at launch | 15-25% |

## Step 2: Event Taxonomy

### Event Naming Convention

```
[category]_[action]_[object]

Examples:
  game_start_session
  game_end_session
  player_complete_level
  player_die_combat
  player_purchase_item
  player_unlock_achievement
  ui_click_button
  economy_earn_currency
  economy_spend_currency
  social_send_invite
  error_crash_gameplay
```

### Core Event Catalog

```markdown
## Session Events
| Event | Parameters | Purpose |
|-------|-----------|---------|
| session_start | platform, version, device_id | Track DAU, sessions |
| session_end | duration, reason(quit/crash/timeout) | Session length |

## Progression Events
| Event | Parameters | Purpose |
|-------|-----------|---------|
| level_start | level_id, difficulty, player_level | Funnel tracking |
| level_complete | level_id, duration, deaths, score | Completion rates |
| level_fail | level_id, fail_point, attempt_number | Identify walls |
| checkpoint_reach | level_id, checkpoint_id, time | Pacing analysis |

## Economy Events
| Event | Parameters | Purpose |
|-------|-----------|---------|
| currency_earn | currency_type, amount, source | Source tracking |
| currency_spend | currency_type, amount, sink | Sink tracking |
| item_acquire | item_id, source(drop/craft/buy) | Item economy |
| iap_purchase | product_id, price, currency | Revenue |

## Combat / Gameplay Events
| Event | Parameters | Purpose |
|-------|-----------|---------|
| enemy_kill | enemy_type, weapon_used, time_to_kill | Balance data |
| player_death | cause, location, player_level | Difficulty tuning |
| ability_use | ability_id, target, result | Ability popularity |

## Social Events
| Event | Parameters | Purpose |
|-------|-----------|---------|
| friend_invite | method, result | Viral tracking |
| multiplayer_match | mode, duration, result | Multiplayer health |
```

## Step 3: Funnel Analysis

### Player Journey Funnel

```
Install              100%  ████████████████████████████████████████
 ↓
Launch game           85%  ██████████████████████████████████
 ↓
Complete tutorial     62%  ████████████████████████
 ↓
Finish level 1       55%  ██████████████████████
 ↓
Finish level 5       30%  ████████████
 ↓
Reach mid-game       18%  ███████
 ↓
Reach end-game        8%  ███
 ↓
Complete game          5%  ██

DROP-OFF ALERTS:
  >20% drop at any single step → investigate that step
  Tutorial completion <60% → FTUE is broken
  Level 1→2 drop >30% → first level too hard or unclear
```

### FTUE (First-Time User Experience) Funnel

```
Track minute-by-minute for the first 10 minutes:

Minute 0-1:  Player starts → first input
Minute 1-2:  Basic movement → first interaction
Minute 2-3:  Core mechanic introduced → first success
Minute 3-5:  First challenge → first fail/retry → overcome
Minute 5-10: Loop established → player "gets it"

MEASURE:
  - Drop-off at each minute mark
  - Time to first meaningful action
  - Time to first "aha moment"
  - % who reach the "hook" moment
```

## Step 4: Heatmaps & Spatial Analytics

### Player Movement Heatmaps

```
Visualize where players go (and don't go):

DEATH HEATMAP:
  Hot spots = difficulty spikes or unfair encounters
  Cold areas = too easy or never reached

MOVEMENT HEATMAP:
  Hot spots = popular paths, bottlenecks
  Cold areas = missed content, poor signposting

TIME-SPENT HEATMAP:
  Hot spots = engaging areas or stuck points
  Cold areas = rushed through or skipped

IMPLEMENTATION:
  Log player position every [5-10] seconds
  Include: position(x,y,z), player_state, timestamp
  Aggregate across [1000+] players for meaningful data
  Visualize as overlay on level map
```

## Step 5: Dashboard Design

### Essential Dashboards

```
DAILY HEALTH DASHBOARD:
  ┌──────────────────────────────────────────────┐
  │  DAU: 12,450 (↑3.2%)   Revenue: $1,850     │
  │  D1 Retention: 42%     Sessions/DAU: 2.1    │
  │  Avg Session: 22min    Crash Rate: 0.3%     │
  ├──────────────────────────────────────────────┤
  │  [DAU chart - 30 days]                       │
  │  [Retention cohort table]                    │
  │  [Top 5 crash reports]                       │
  └──────────────────────────────────────────────┘

CONTENT DASHBOARD:
  ┌──────────────────────────────────────────────┐
  │  [Progression funnel]                        │
  │  [Level completion rates]                    │
  │  [Average deaths per level]                  │
  │  [Most/least popular abilities]              │
  │  [Session end points - where do players quit]│
  └──────────────────────────────────────────────┘

ECONOMY DASHBOARD:
  ┌──────────────────────────────────────────────┐
  │  [Currency sources vs sinks over time]       │
  │  [Average player wealth by level]            │
  │  [Most/least purchased items]                │
  │  [Conversion funnel (if F2P)]                │
  └──────────────────────────────────────────────┘
```

## Step 6: Privacy & Ethics

### Data Collection Principles

```
COLLECT:
  ✓ Aggregated gameplay metrics (anonymous)
  ✓ Crash reports with opt-in
  ✓ Session data for game health
  ✓ Economy data for balance

DON'T COLLECT:
  ✗ Personal identifying information beyond account ID
  ✗ Chat logs without consent
  ✗ Device data beyond what's needed for compatibility
  ✗ Location data (unless game requires it)

COMPLIANCE:
  □ GDPR: Consent before collecting, right to deletion
  □ COPPA: Parental consent for under-13 (if applicable)
  □ Platform policies: Follow Steam/Apple/Google data guidelines
  □ Privacy policy: Published and accessible in-game
  □ Opt-out: Players can disable non-essential telemetry
```

### Ethical Analytics

- Never use analytics to make the game more addictive — use them to make it more fun
- Dark patterns (artificial urgency, FOMO, obfuscated costs) are detectable in data — and unethical
- Share findings with the team — data hoarding creates power imbalances
- A/B test to improve player experience, not just revenue

## Output

Save to `artifacts/game-design/[project-name]-analytics.md`

## Guidelines

- **Instrument from day one** — retrofitting analytics is painful and error-prone
- **Less is more** — track 20 meaningful events, not 200 noisy ones
- Data without action is waste — every metric should have a decision it informs
- Look at distributions, not averages — the average player doesn't exist
- Cohort analysis > snapshot analysis — compare groups over time, not all players at once
- Cross-reference `/game-balancing` to use data for balance decisions
- Cross-reference `/game-testing` to set up automated metric validation
- Use `/economy-design` to define what economy metrics to track
