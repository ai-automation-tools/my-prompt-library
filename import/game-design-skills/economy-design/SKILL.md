---
name: economy-design
description: Design in-game economies including currencies, progression systems, loot tables, monetization, and resource flow. Use when building the economic backbone of a game. Also trigger for "game economy", "loot table", "drop rates", "currency system", "progression design", "monetization strategy", or "reward system".
---

# Economy Design — Resources, Rewards & Progression

Design self-regulating game economies that motivate players, pace content, and avoid inflation death spirals.

## Inputs

- Game mechanics and systems (use `/mechanics-design` for reference)
- Monetization model (premium, F2P, hybrid)
- Target session length and player lifetime
- Content volume (how many items, upgrades, unlocks exist)

## Step 1: Currency Architecture

### Currency Types

| Currency | Earn Rate | Sink | Purpose |
|----------|-----------|------|---------|
| **Soft** (gold, coins) | Gameplay — plentiful | Consumables, basic gear | Moment-to-moment rewards |
| **Hard** (gems, crystals) | Rare gameplay + IAP | Premium items, time-skips | Scarcity / monetization |
| **Stamina** (energy) | Time-gated regen | Action cost | Session pacing |
| **Reputation** (faction, rank) | Specific actions | Tier unlocks | Long-term commitment |
| **Seasonal** (tokens, badges) | Time-limited events | Exclusive rewards | Engagement spikes |

### Currency Flow Diagram

```
SOURCES                          SINKS
───────                          ─────
Quest completion ──────┐    ┌──── Equipment purchase
Enemy drops ───────────┤    ├──── Consumables
Exploration ───────────┤    ├──── Crafting materials
Daily login ───────────┼──→ ├──── Upgrade costs
Achievements ──────────┤    ├──── Fast travel / services
Selling items ─────────┤    ├──── Cosmetics
Events ────────────────┘    └──── Repair / maintenance

BALANCE RULE: Total sources ≈ Total sinks over any 2-hour window
```

## Step 2: Progression Systems

### Progression Types

```
VERTICAL (power increase):
  Level 1 ──→ Level 2 ──→ Level 3
  10 ATK       15 ATK      22 ATK
  Used in: RPGs, ARPGs — player gets numerically stronger

HORIZONTAL (option increase):
  Unlock A ── Unlock B ── Unlock C
  Sword       Bow          Magic
  Used in: Roguelikes, Metroidvanias — player gets more versatile

PRESTIGE (reset & multiply):
  Run 1 (base) → Reset → Run 2 (1.5x) → Reset → Run 3 (2x)
  Used in: Idle games, roguelites — long-term retention loop

MASTERY (skill increase):
  Same tools, higher player skill → better outcomes
  Used in: Fighting games, platformers — no stat inflation
```

### XP / Level Curve

```
XP Required = BaseXP × (Level ^ ExponentFactor)

Common curves:
  Linear:      100, 200, 300, 400, 500...     (feels grindy late)
  Quadratic:   100, 200, 400, 700, 1100...    (balanced)
  Exponential: 100, 200, 400, 800, 1600...    (punishing late)
  Logarithmic: 100, 180, 245, 300, 348...     (fast early, plateaus)

RECOMMENDATION: Quadratic with diminishing returns on XP gain
  → Ensures each level feels meaningful without endless grind
  → Pair with content gates so leveling alone doesn't skip content
```

## Step 3: Loot & Drop Tables

### Drop Table Template

```markdown
## Loot Table: [Enemy/Chest/Event Name]

| Item | Rarity | Drop Rate | Min Qty | Max Qty | Conditions |
|------|--------|-----------|---------|---------|------------|
| Gold | Common | 100% | 5 | 15 | — |
| Health Potion | Common | 40% | 1 | 1 | — |
| Iron Ore | Uncommon | 20% | 1 | 3 | Zone ≥ 2 |
| Rare Sword | Rare | 2% | 1 | 1 | Boss only |
| Legendary Gem | Legendary | 0.5% | 1 | 1 | Hard mode |

### Pity System
After [X] drops with no Rare+ item:
  Rare guaranteed at drop [X+1]
  (Prevents extreme unlucky streaks)
```

### Rarity Distribution Guidelines

| Rarity | Color | Drop Rate Range | Power Boost | Player Expectation |
|--------|-------|----------------|-------------|-------------------|
| Common | White/Gray | 60-80% | Baseline | Every encounter |
| Uncommon | Green | 15-25% | +10-20% | Every few encounters |
| Rare | Blue | 3-8% | +25-40% | Once per session |
| Epic | Purple | 0.5-2% | +50-75% | Once per week |
| Legendary | Orange/Gold | 0.05-0.5% | +100%+ | Memorable event |

## Step 4: Sink Design

### Healthy Sinks (remove currency without feeling punitive)

| Sink Type | Psychological Feel | Example |
|-----------|-------------------|---------|
| **Upgrades** | Investment → power | Weapon enhancement |
| **Cosmetics** | Self-expression | Outfits, skins, dyes |
| **Convenience** | Time saved | Fast travel, auto-sort |
| **Crafting** | Creative agency | Combine materials → items |
| **Gambling** | Excitement | Gacha, mystery boxes (careful!) |
| **Maintenance** | Realistic pressure | Repair, rent, upkeep |
| **Charity** | Social warmth | Donate to NPC, rebuild town |

### Inflation Prevention

```
WARNING SIGNS:
  ✗ Players accumulate currency with nothing to spend on
  ✗ Late-game items are 1000x the price of early items
  ✗ New sinks feel artificial ("gold tax" out of nowhere)

PREVENTION:
  ✓ Every source has a proportional sink in the same game phase
  ✓ Currency generation scales slower than content unlocks
  ✓ Late-game sinks are desirable, not mandatory
  ✓ Prestige resets provide natural currency drain
```

## Step 5: Monetization Ethics (F2P)

### Ethical Monetization Matrix

| ✅ Ethical | ⚠️ Borderline | ❌ Predatory |
|-----------|--------------|-------------|
| Cosmetics only | XP boosters | Pay-to-win stats |
| Battle pass (known items) | Loot boxes (known odds) | Hidden loot box odds |
| One-time unlock DLC | Energy refills | Artificial difficulty walls |
| Season pass (content) | Convenience purchases | Social pressure mechanics |
| Supporter packs | Gacha with pity | Targeting vulnerable players |

### Battle Pass Template

```
FREE TRACK:       [F1]──[F2]──[F3]──[F4]──[F5]... (every 3 tiers)
PREMIUM TRACK:    [P1]──[P2]──[P3]──[P4]──[P5]... (every tier)

Tier progression: 1000 XP per tier
Daily play grants: ~500-800 XP (2 tiers/day casual)
Season length: 60 days
Total tiers: 100
Casual player reaches: Tier 60-80
Hardcore reaches: Tier 100 by day 40

RULE: Free track must feel rewarding, not punishing
RULE: No FOMO on gameplay-affecting items
```

## Step 6: Economy Simulation

Before shipping, validate the economy mathematically:

```python
# Simplified economy simulation
def simulate_session(hours=2):
    gold_earned = quest_rewards(3) + enemy_drops(hours) + exploration(hours)
    gold_spent = consumables(hours) + repairs(hours) + one_upgrade()
    net_gold = gold_earned - gold_spent

    # Net should be slightly positive (player feels rich, not broke)
    # Target: 10-20% surplus per session
    assert 0.10 <= (net_gold / gold_earned) <= 0.20, "Economy imbalanced"
```

## Output

Save to `artifacts/game-design/[project-name]-economy.md`

## Guidelines

- **The player should always feel slightly short** — enough to want more, not enough to feel stuck
- **Never let paying players trivialize content** — monetization sells time, not victory
- Test with simulated 100-hour playthroughs before real players touch it
- Every currency needs a clear answer to "why can't this just be gold?"
- Cross-reference with `/mechanics-design` for system interactions
- Use `/game-balancing` to tune values after playtesting
