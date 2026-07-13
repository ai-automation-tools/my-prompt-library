---
name: mechanics-design
description: Design and document core game mechanics, systems interactions, feedback loops, and emergent behavior. Use when defining how the game plays at a systems level. Also trigger for "game mechanics", "gameplay systems", "game loop", "game rules", "combat system", "crafting system", or "progression system".
---

# Mechanics Design — Systems & Interactions

Define, document, and validate the systems that make up how your game actually plays — from individual mechanics to emergent system interactions.

## Inputs

- Game concept or GDD (use `/game-concept` or `/game-design-document` first)
- Core design pillars
- Target feel (fast/slow, simple/complex, deterministic/random)

## Step 1: Mechanic Inventory

List every mechanic the game will have. Categorize by type:

| Category | Examples |
|----------|---------|
| **Locomotion** | Walk, run, jump, dash, climb, swim, fly, teleport |
| **Combat** | Attack, block, dodge, parry, aim, reload, cast |
| **Interaction** | Pick up, use, talk, examine, activate, hack |
| **Resource** | Gather, craft, trade, consume, equip, upgrade |
| **Social** | Recruit, command, negotiate, betray, gift |
| **Meta** | Save, load, pause, map, inventory, settings |

### Mechanic Definition Template

For each core mechanic, define:

```markdown
## Mechanic: [Name]

**Input:** [What the player does — button, gesture, decision]
**Process:** [What the system calculates]
**Output:** [What changes in the game state]
**Feedback:** [What the player sees/hears/feels]
**Depth:** [How mastery changes the experience]

Example — Dodge Roll:
  Input: Press B + direction
  Process: i-frames(0.3s), velocity(8m/s, 0.4s), stamina(-15)
  Output: Player repositioned, temporarily invulnerable
  Feedback: Whoosh SFX, blur trail VFX, camera slight shake
  Depth: Frame-perfect dodge → counter window opens
```

## Step 2: System Architecture

Map how systems connect:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   COMBAT    │────→│  HEALTH/DMG  │────→│   DEATH/    │
│   SYSTEM    │     │   SYSTEM     │     │   RESPAWN   │
└──────┬──────┘     └──────┬───────┘     └─────────────┘
       │                   │
       │            ┌──────┴───────┐
       │            │  EQUIPMENT   │
       │            │   SYSTEM     │
       │            └──────┬───────┘
       │                   │
┌──────┴──────┐     ┌──────┴───────┐
│  ABILITY    │────→│  RESOURCE    │
│  SYSTEM     │     │  SYSTEM      │
└─────────────┘     └──────────────┘
```

### System Interaction Matrix

| System A × System B | Combat | Inventory | Movement | Progression |
|---------------------|--------|-----------|----------|-------------|
| **Combat** | — | Weapon affects damage | Position affects range | XP gain |
| **Inventory** | Consumables in fight | — | Weight affects speed | Unlock tiers |
| **Movement** | Dodge mechanics | Drop on death | — | New traversal |
| **Progression** | New abilities | Capacity increase | Speed upgrades | — |

## Step 3: Core Loop Engineering

### Loop Layers

```
MICRO LOOP (seconds):
  See threat → Choose action → Execute → Read feedback → Adapt
  Frequency: Every 1-5 seconds
  Emotion: Tension, flow, reflex

MESO LOOP (minutes):
  Enter area → Explore/fight → Find resources → Upgrade → Move on
  Frequency: Every 5-15 minutes
  Emotion: Curiosity, accomplishment, decision-making

MACRO LOOP (session):
  Set goal → Attempt run/quest → Succeed or fail → Unlock progress → New goal
  Frequency: Every 30-90 minutes
  Emotion: Satisfaction, anticipation, mastery

META LOOP (long-term):
  Complete chapter → Unlock new region/mode → Master systems → Endgame
  Frequency: Over hours/days/weeks
  Emotion: Investment, identity, completionism
```

### Feedback Loop Types

| Type | Effect | Example | Watch For |
|------|--------|---------|-----------|
| **Positive** | Success breeds more success | Kill enemy → get XP → level up → kill faster | Runaway power / trivial late game |
| **Negative** | Failure creates correction | Low HP → screen red → play cautious → survive | Death spirals / frustration |
| **Balancing** | System self-regulates | Rubber-banding in racing | Feels unfair if visible |
| **Reinforcing** | Commitment deepens | Invest in build → more effective → invest more | Trap players in bad builds |

## Step 4: Numeric Foundation

### Core Formulas

```
Damage = (BaseDamage × WeaponMultiplier × SkillBonus) - (TargetArmor × ArmorEfficiency)

Time-to-Kill = TargetHP / (DPS - EffectiveArmor)

Resource Generation Rate:
  Early game: 10 units/min
  Mid game:   25 units/min (with upgrades)
  Late game:  60 units/min (with automation)

Difficulty Scaling:
  EnemyHP = BaseHP × (1 + (0.15 × ZoneLevel))
  EnemyDmg = BaseDmg × (1 + (0.10 × ZoneLevel))
```

### Economy Sink/Source Balance

```
SOURCES (currency in)        SINKS (currency out)
─────────────────────        ────────────────────
Quest rewards: 40%           Equipment: 35%
Enemy drops: 30%             Consumables: 25%
Selling items: 20%           Upgrades: 20%
Exploration: 10%             Services/fast-travel: 15%
                             Cosmetics: 5%
```

## Step 5: State Machines

Define key entity states:

```
PLAYER STATES:
  Idle ──[input]──→ Moving
  Moving ──[attack]──→ Attacking
  Attacking ──[hit]──→ Stagger (0.2s) ──→ Idle
  Any ──[damage while HP>0]──→ Hurt (0.5s) ──→ Previous
  Any ──[HP≤0]──→ Dead ──[respawn]──→ Idle

ENEMY AI STATES:
  Patrol ──[detect player]──→ Alert
  Alert ──[in range]──→ Engage
  Engage ──[HP < 30%]──→ Flee | Berserk
  Engage ──[player out of range]──→ Search (10s) ──→ Patrol
```

## Step 6: Mechanic Validation Checklist

- [ ] **Readable:** Player can predict outcome before acting
- [ ] **Responsive:** Input-to-feedback under 100ms
- [ ] **Meaningful:** Every mechanic supports a design pillar
- [ ] **Layered:** Simple to learn, complex to master
- [ ] **Interconnected:** Mechanics combine for emergent play
- [ ] **Bounded:** Clear limits prevent exploits and confusion
- [ ] **Tunable:** Key values are exposed as data, not hardcoded
- [ ] **Testable:** Can be validated in isolation and in combination

## Output

Save to `artifacts/game-design/[project-name]-mechanics.md`

## Guidelines

- **Mechanics are verbs** — if you can't describe it as a player action, it's a system, not a mechanic
- **Elegance over complexity** — Chess has 6 piece types; Go has 1
- Design for the **80% case** first, then handle edge cases
- Every number should be a variable in a config file, not a magic constant
- If two systems don't interact, question whether you need both
- Prototype the riskiest mechanic first — use `/game-prototyping`
- See `/game-balancing` for tuning numeric values after implementation
