---
name: narrative-design
description: Design game narratives including story structure, world-building, character arcs, dialogue systems, and environmental storytelling. Use when building the story layer of a game. Also trigger for "game story", "game lore", "world building", "dialogue tree", "character backstory", "game narrative", or "branching story".
---

# Narrative Design — Story, World & Dialogue

Craft compelling game narratives that serve gameplay rather than fight it — from world-building to dialogue trees to environmental storytelling.

## Inputs

- Game concept or GDD (use `/game-concept` or `/game-design-document` first)
- Tone and genre (dark fantasy, comedic sci-fi, grounded realism, etc.)
- Narrative delivery method (cutscenes, dialogue, environmental, emergent)
- Player agency level (linear, branching, open-world, procedural)

## Step 1: Narrative Framework

Choose the story structure that fits the game:

```
LINEAR          BRANCHING        HUB & SPOKE      EMERGENT
   │            ┌─B1─┐           ┌──Q1             [Events]
   A            │     │       Hub┤──Q2             [Systems]
   │            A──B2─D          │──Q3             [Combine]
   B            │     │          └──Q4             [Stories]
   │            └─B3─┘
   C
   │
 (RPG,         (Visual         (Open-world        (Roguelike,
  Adventure)    Novel)          RPG)               Sim)
```

### Story Architecture Table

| Element | Description |
|---------|-------------|
| **Central Conflict** | What's at stake? What force opposes the player? |
| **Theme** | The underlying message or question the game explores |
| **Tone** | The emotional register (grim, whimsical, tense, cozy) |
| **Player Role** | Who is the player in this world? What's their motivation? |
| **Narrative Arc** | Setup → Rising Action → Climax → Resolution |
| **Time Span** | Hours, days, years — how much time passes in-fiction? |

## Step 2: World-Building

Build the world in concentric rings — only detail what the player touches:

```
Ring 1 — IMMEDIATE: What the player sees and interacts with
  → Locations, NPCs, items, environmental details

Ring 2 — CONTEXTUAL: What explains Ring 1
  → History, factions, politics, economy, religion

Ring 3 — DEEP LORE: What enriches but never blocks progress
  → Ancient history, mythology, Easter eggs, codex entries
```

### World Bible Template

```markdown
## World: [Name]

### Geography & Regions
| Region | Climate | Culture | Conflict | Player Relevance |
|--------|---------|---------|----------|-----------------|
| [name] | [type]  | [desc]  | [desc]   | [what happens here] |

### Factions
| Faction | Goal | Method | Ally/Enemy | Player Interaction |
|---------|------|--------|-----------|-------------------|
| [name]  | [want] | [how] | [relations] | [quests/combat/trade] |

### Timeline
| Era/Event | When | Impact on Present |
|-----------|------|-------------------|
| [event]   | [date] | [consequence]   |

### Rules of the World
- [Magic/Tech system and its limits]
- [Social norms and taboos]
- [What's possible and impossible]
```

## Step 3: Character Design

### Character Sheet Template

```markdown
## [Character Name]
- **Role:** [protagonist / antagonist / mentor / companion / NPC]
- **Archetype:** [hero, trickster, sage, etc.]
- **Want:** [external goal — what they pursue]
- **Need:** [internal goal — what they must learn]
- **Flaw:** [the thing that holds them back]
- **Arc:** [who they are at start] → [who they become]
- **Voice:** [speech patterns, vocabulary, verbal tics]
- **Design Hook:** [one visual/behavioral trait that makes them instantly recognizable]
```

### Character Relationship Map

```
        MENTOR ──teaches──→ PROTAGONIST ←──opposes── ANTAGONIST
           │                    │    │                    │
        trusts              bonds  conflicts           commands
           │                    │    │                    │
        ALLY ←──rivals──→  COMPANION  RIVAL ←──serves── MINION
```

## Step 4: Dialogue System Design

### Dialogue Types

| Type | Use Case | Implementation |
|------|----------|---------------|
| **Linear** | Exposition, tutorials | Single NPC speech, no choices |
| **Branching** | Key story moments | Player picks from 2-4 options |
| **Hub** | Companion conversations | Return to ask different topics |
| **Bark** | Ambient world-building | Triggered by proximity/events |
| **Systemic** | Dynamic reactions | NPCs respond to player state/reputation |

### Dialogue Node Structure

```
[Node ID: intro_merchant_01]
Speaker: Merchant Vela
Condition: player.reputation.town >= 5
Line: "Word travels fast. You're the one who cleared the eastern pass?"

  → [Choice A] "That was me." → [node: merchant_friendly]
     Tag: confident, +reputation
  → [Choice B] "What's it to you?" → [node: merchant_suspicious]
     Tag: aggressive, -reputation
  → [Choice C] [Say nothing] → [node: merchant_default]
     Tag: silent
```

### Writing Style Guide

- **Show, don't tell** — reveal world through conversation, not exposition dumps
- **Every line serves two purposes** — advance plot AND reveal character
- **Read it aloud** — if it sounds unnatural spoken, rewrite it
- **Match vocabulary to character** — a soldier and a scholar don't use the same words
- **Subtext over text** — what characters don't say matters more than what they do

## Step 5: Environmental Storytelling

Design stories told without words:

| Technique | Example |
|-----------|---------|
| **Spatial arrangement** | A table set for two, one chair knocked over |
| **Sequential discovery** | Audio logs numbered 1-5 placed along a path |
| **Contrast** | A child's drawing in a war-torn building |
| **Repeated motifs** | The same symbol appearing in increasingly ominous contexts |
| **Absence** | An empty cage with claw marks on the inside |

## Step 6: Narrative Integration Checklist

- [ ] Story supports core gameplay — narrative motivates player actions
- [ ] Player agency is respected — choices have visible consequences
- [ ] Pacing matches gameplay — story beats align with difficulty curves
- [ ] Lore is discoverable, not mandatory — completionists find more, not a wall
- [ ] Characters react to game state — acknowledge player achievements/failures
- [ ] Environmental details reinforce theme — world tells the same story as dialogue

## Output

Save to `artifacts/game-design/[project-name]-narrative.md`

## Guidelines

- **Gameplay first** — story serves the game, not the other way around
- **Kill your darlings** — if lore doesn't enhance the player experience, cut it
- Don't write a novel — write a world that generates stories
- Players remember how a moment *felt*, not what was *said*
- Test dialogue by reading it aloud in character — awkward phrasing breaks immersion
- Use `/game-design-document` to ensure narrative aligns with the GDD
