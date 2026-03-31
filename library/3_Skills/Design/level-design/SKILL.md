---
name: level-design
description: Design game levels, maps, and environments including layout, pacing, encounters, puzzles, and spatial flow. Use when planning or building individual levels, zones, or game spaces. Also trigger for "level layout", "map design", "zone design", "encounter design", "game world layout", or "dungeon design".
---

# Level Design — Spaces, Flow & Pacing

Design levels that teach, challenge, and reward players through spatial composition, encounter pacing, and environmental storytelling.

## Inputs

- Game mechanics and player abilities (use `/mechanics-design` for reference)
- Theme and narrative context for this level
- Target difficulty and playtime
- Available enemy/puzzle/item vocabulary

## Step 1: Level Purpose

Every level must answer these questions:

| Question | Answer |
|----------|--------|
| **What does the player learn?** | [new mechanic, enemy, or combination] |
| **What's the emotional arc?** | [tension → relief → triumph] |
| **What's the narrative beat?** | [story moment this level delivers] |
| **What's the reward?** | [tangible: item/upgrade; intangible: spectacle/reveal] |
| **How long should it take?** | [target playtime in minutes] |

## Step 2: Layout Theory

### Spatial Patterns

```
LINEAR            BRANCHING          ARENA
A → B → C → D    A → B ──→ D       ┌─────────┐
                      └─C─┘         │  COMBAT  │
                                    │  SPACE   │
                                    └─────────┘

HUB & SPOKE       LOOP              METROIDVANIA
    ┌─B            A → B            A → [locked] → D
Hub─┤              ↑     ↓               ↑
    └─C            D ← C            B → [key] → C
    └─D                                   └──unlock──┘

OPEN WORLD         VERTICAL           MAZE
┌──┬──┬──┐        ┌───┐              ┌─┬───┬─┐
│  │  │  │        │ 3 │              │ │   │ │
├──┼──┼──┤        ├───┤              │ └─┐ │ │
│  │  │  │        │ 2 │              │   │ │ │
├──┼──┼──┤        ├───┤              │ ┌─┘ │ │
│  │  │  │        │ 1 │              └─┴───┴─┘
└──┴──┴──┘        └───┘
```

### The Nintendo Method — Introduce, Develop, Twist, Conclude

```
INTRODUCE          DEVELOP           TWIST              CONCLUDE
Safe environment   Combine with      Subvert            Master test
to learn mechanic  existing skills   expectations       of full skill

[Platform appears  [Platform over    [Platform moves    [Platform over
 over safe ground]  over pit]         unexpectedly]      boss arena]
```

## Step 3: Pacing & Intensity Curve

Map the emotional intensity through the level:

```
Intensity
  10 │                              ★ BOSS
     │                         ╱    │
   8 │                    ╱───╱     │
     │              ╱────╱          │
   6 │         ╱───╱                │
     │    ╱───╱    ↑                │
   4 │───╱    Combat                │
     │   ↑    Encounter             │
   2 │  Explore                     │ Reward
     │   & Learn                    │ & Rest
   0 └──────────────────────────────┴──────→ Time
     Start                                  End
```

### Pacing Rules

- **Never more than 2 high-intensity encounters in a row** without a rest beat
- **Place save points / checkpoints before difficulty spikes**, not after
- **Alternate verb types** — fight → explore → puzzle → fight (not fight → fight → fight)
- **The approach to a boss should build tension** — longer hallway, music shift, environmental cues

## Step 4: Encounter Design

### Encounter Template

```markdown
## Encounter: [Name]
**Location:** [room/area description]
**Type:** Combat / Puzzle / Traversal / Social / Hybrid
**Duration:** [seconds or minutes]
**Difficulty:** [1-10 relative to level]

### Setup
[What the player sees when entering — initial read of the space]

### Challenge
[What the player must overcome — enemies, puzzle, obstacle]

### Solution Space
[Intended solutions AND emergent solutions to allow]

### Failure State
[What happens if the player fails — death, retry, penalty]

### Reward
[What the player gets — items, progress, narrative, shortcut]
```

### Enemy Composition Rules

```
SOLO: 1 strong enemy — tests player skill against single target
  → Best for: teaching enemy patterns, mini-bosses

PACK: 3-5 weak enemies — tests crowd control
  → Best for: area attacks, positioning skills

MIXED: 1 strong + 2-3 weak — tests priority targeting
  → Best for: mid-level encounters, tactical thinking

WAVE: Sequential groups — tests endurance and resource management
  → Best for: arena encounters, boss preludes

AMBUSH: Enemies appear from unexpected positions
  → Best for: keeping players alert, breaking routine
```

## Step 5: Spatial Communication

Guide the player without explicit markers:

| Technique | How It Works |
|-----------|-------------|
| **Light** | Bright areas attract, dark areas warn or hide secrets |
| **Color** | Warm colors invite, cool colors recede, red signals danger |
| **Lines** | Architecture, pipes, paths lead the eye to objectives |
| **Sound** | Audio cues pull attention — water, music, enemy sounds |
| **Landmarks** | Tall/unique structures orient the player in open spaces |
| **Breadcrumbs** | Collectibles or minor items trace the critical path |
| **Negative space** | Open areas after corridors signal "something happens here" |
| **Gating** | Locked doors, broken bridges — visible goals before access |

## Step 6: Level Document Template

```markdown
# Level [Number]: [Name]

## Overview
- **Setting:** [visual theme and mood]
- **Playtime:** [estimated minutes]
- **New Mechanics:** [what's introduced]
- **Story Beat:** [narrative purpose]

## Map Layout
[ASCII top-down or description of rooms/areas]

## Room-by-Room Breakdown
### Room 1: [Name]
- Purpose: [teach/challenge/reward/transition]
- Encounters: [list]
- Items: [list]
- Exits: [where they lead]

## Checkpoint Placement
[Mark save/checkpoint locations with justification]

## Secret Areas
[Optional content with discovery method and reward]

## Playtest Notes
[Space for iteration feedback]
```

## Output

Save to `artifacts/game-design/[project-name]-level-[number/name].md`

## Guidelines

- **Block out before detailing** — get the flow right with gray boxes before adding art
- **Playtest with no instructions** — if the player gets lost, the level failed, not the player
- Respect the player's time — don't pad levels with backtracking unless it reveals new content
- Every dead end should have a reward — never punish exploration
- Design the critical path first, then add optional paths and secrets
- Use `/mechanics-design` to verify levels use the full mechanic vocabulary
- Use `/game-balancing` to tune encounter difficulty after playtesting
