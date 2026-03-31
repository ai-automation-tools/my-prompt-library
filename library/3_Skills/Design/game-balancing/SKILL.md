---
name: game-balancing
description: Balance game systems including difficulty curves, stat tuning, economy rates, matchmaking fairness, and player power progression. Use when tuning numbers and systems for fair, engaging gameplay. Also trigger for "game balance", "difficulty tuning", "stat balancing", "nerf", "buff", "power curve", or "difficulty curve".
---

# Game Balancing — Tuning for Fair & Engaging Play

Systematically balance game systems so every choice is interesting, every challenge is fair, and every player feels appropriately challenged.

## Inputs

- Implemented mechanics and systems (use `/mechanics-design`)
- Economy design (use `/economy-design`)
- Playtest data or intuited pain points
- Target difficulty philosophy (punishing, moderate, accessible)

## Step 1: Balance Philosophy

Define your approach before touching numbers:

| Philosophy | Description | Examples |
|------------|-------------|---------|
| **Fair challenge** | Player skill determines outcome | Dark Souls, Celeste |
| **Power fantasy** | Player should feel overpowered | Doom Eternal, Dynasty Warriors |
| **Strategic depth** | Many viable paths, no dominant one | Chess, Civilization |
| **Accessible** | Anyone can finish, mastery is optional | Mario, Animal Crossing |
| **Adaptive** | Game adjusts to player skill | Resident Evil 4, Left 4 Dead |

### Difficulty Curve Shapes

```
Intensity
   │
10 │           ╱──╲     ╱──★
   │          ╱    ╲   ╱
 8 │         ╱      ╲─╱
   │        ╱
 6 │      ╱─╲
   │     ╱   ╲──╱
 4 │   ╱─╲
   │  ╱   ╲──╱
 2 │╱
   │ Tutorial
 0 └──────────────────────────→ Progress
   │ Zone 1  │ Zone 2 │ Zone 3 │ Boss │

SAWTOOTH PATTERN: Ramp up → boss → rest → ramp up → boss
Each "tooth" starts slightly higher than the previous rest point
```

## Step 2: Stat Balancing Framework

### The Triangle Method

For any set of competing options (characters, weapons, builds):

```
         POWER
          /\
         /  \
        /    \
       /  ★   \       ★ = sweet spot
      /        \      Every option trades between
     /          \     these three axes
    /____________\
 SPEED          DEFENSE

NO option should be best at 2+ axes simultaneously
EVERY option should excel at exactly 1 axis
```

### Stat Budget System

Give each entity a fixed "point budget":

```
Example — Character classes with 100 point budget:

| Class   | HP  | ATK | DEF | SPD | Special |
|---------|-----|-----|-----|-----|---------|
| Warrior | 30  | 25  | 25  | 10  | 10      | Total: 100
| Rogue   | 15  | 20  | 10  | 30  | 25      | Total: 100
| Mage    | 15  | 30  | 10  | 15  | 30      | Total: 100
| Tank    | 35  | 10  | 35  | 10  | 10      | Total: 100

RULE: Total budget is equal across all options
RULE: Minimum value on any axis is never zero
RULE: Maximum value on any axis is capped at 35% of budget
```

### DPS Normalization

```
All weapons should converge on similar DPS with different feels:

Weapon        | Damage | Speed    | DPS
──────────────|────────|──────────|──────
Dagger        | 10     | 2.0/sec  | 20
Sword         | 20     | 1.0/sec  | 20
Hammer        | 40     | 0.5/sec  | 20
Bow           | 15     | 1.3/sec  | 19.5

Then add specialization:
  Dagger: +50% crit chance (burst potential)
  Sword: +20% AoE (crowd control)
  Hammer: +30% stagger (control)
  Bow: +range (safety)

→ Equal effectiveness, different playstyles
```

## Step 3: Difficulty Tuning

### Dynamic Difficulty Adjustment (DDA)

```
TRACKING METRICS:
  - Deaths per checkpoint
  - Time to complete area
  - Health at area exit
  - Items consumed per area
  - Player accuracy / hit rate

ADJUSTMENT LEVERS (invisible to player):
  If dying too much:
    → Reduce enemy damage by 5-10%
    → Increase health pickup drops
    → Slow enemy attack speed slightly
    → Add invisible safety nets (extra i-frames)

  If cruising too easily:
    → Add 1-2 extra enemies in encounters
    → Reduce resource drops slightly
    → Enemies use advanced behaviors sooner
    → Reduce checkpoint density

RULES:
  ✓ Never make adjustments obvious
  ✓ Never adjust player stats — only world/enemy parameters
  ✓ Allow players to disable DDA in settings
  ✓ Difficulty settings override DDA
```

### Manual Difficulty Settings

```
EASY:
  Enemy HP: ×0.7 | Enemy DMG: ×0.5 | Resources: ×1.5
  Target audience: Story-focused players, accessibility

NORMAL:
  Enemy HP: ×1.0 | Enemy DMG: ×1.0 | Resources: ×1.0
  Target audience: Default experience, most players

HARD:
  Enemy HP: ×1.3 | Enemy DMG: ×1.5 | Resources: ×0.75
  Target audience: Experienced players seeking challenge

NIGHTMARE:
  Enemy HP: ×2.0 | Enemy DMG: ×2.0 | Resources: ×0.5
  + New enemy behaviors, reduced checkpoints
  Target audience: Mastery-seekers, second playthrough

CUSTOM:
  Individual sliders for each parameter
  Target audience: Accessibility, personalization
```

## Step 4: Economy Balancing

### Inflation Detection

```
HEALTHY ECONOMY:
  Session 1:  Earn 500g, spend 400g, net +100g
  Session 10: Earn 2000g, spend 1800g, net +200g
  Session 50: Earn 8000g, spend 7500g, net +500g
  → Slight surplus grows, player feels increasingly wealthy

INFLATED ECONOMY:
  Session 1:  Earn 500g, spend 400g, net +100g
  Session 10: Earn 2000g, spend 500g, net +1500g  ← PROBLEM
  Session 50: Earn 8000g, spend 1000g, net +7000g ← CRISIS
  → Nothing to spend on, currency meaningless

FIX: Add sinks that scale with player wealth
  - Ascending upgrade costs (exponential, not linear)
  - Consumables that stay relevant at all stages
  - Cosmetic/prestige purchases for wealthy players
```

### Reward Pacing

```
REWARD CADENCE:
  Small reward:    Every 1-2 minutes (gold, ammo, minor item)
  Medium reward:   Every 5-10 minutes (equipment, ability, upgrade)
  Large reward:    Every 30-60 minutes (major unlock, boss drop)
  Milestone:       Every 2-4 hours (new area, story beat, achievement)

RULE: The player should never go more than 3 minutes without some reward
RULE: Anticipated rewards (visible before earned) drive engagement
```

## Step 5: Competitive Balancing

### Win Rate Analysis

```
TARGET: Every character/weapon/strategy wins 45-55% in fair matchups

OVERPOWERED (>55% win rate):
  Options: Reduce stats / increase cooldowns / narrow use case
  Approach: Small nerfs (5-10%) — overnerving creates new problems

UNDERPOWERED (<45% win rate):
  Options: Buff stats / add utility / lower skill floor
  Approach: Buff underperformers before nerfing overperformers

ROCK-PAPER-SCISSORS:
  Character A beats B (60-40)
  Character B beats C (60-40)
  Character C beats A (60-40)
  → Healthy asymmetric balance. Each has a counter.
```

### Balance Change Process

```
1. IDENTIFY: Data shows Problem X (win rate, pick rate, player feedback)
2. DIAGNOSE: Is it a numbers problem or a design problem?
   - Numbers: Stat is too high/low → adjust value
   - Design: Mechanic is fundamentally unfun/broken → redesign
3. PROPOSE: Draft specific change with expected impact
4. TEST: Internal playtest with the change
5. SHIP: Release in patch notes with explanation
6. MONITOR: Track metrics for 1 week post-change
7. FOLLOW UP: Adjust if data shows over/under correction

RULE: Never change more than 3 things at once
RULE: Change by 10-20%, not 50% — small moves, frequent patches
```

## Step 6: Balance Spreadsheet Template

Create a master balance sheet:

```
| Entity | HP | ATK | DEF | SPD | DPS | TTK | Win% | Notes |
|--------|-----|-----|-----|-----|-----|-----|------|-------|
| Warrior| 150 | 25  | 20  | 8   | 20  | 7.5s| 51%  | OK    |
| Rogue  | 80  | 18  | 8   | 15  | 27  | 5.6s| 53%  | Watch |
| Mage   | 70  | 35  | 5   | 10  | 28  | 5.4s| 49%  | OK    |
| Tank   | 200 | 12  | 30  | 5   | 9.6 | 21s | 47%  | Buff? |

TTK = Time to kill (HP / incoming DPS)
Win% = from playtest data
```

## Output

Save to `artifacts/game-design/[project-name]-balance.md`

## Guidelines

- **Balance is never done** — it's an ongoing process throughout development and post-launch
- **Data over feelings** — "it feels OP" means nothing without win rates and pick rates
- **Buff before nerf** — bringing weak options up feels better than bringing strong ones down
- Small changes compound — a 10% nerf across 3 stats is a 27% total reduction
- Playtest with your worst player AND your best player — both need a good experience
- Cross-reference `/mechanics-design` for system interactions that affect balance
- Cross-reference `/economy-design` for resource flow balance
- Use `/game-analytics` to set up telemetry for ongoing balance data
