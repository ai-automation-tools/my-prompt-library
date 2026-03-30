---
name: game-concept
description: Brainstorm and develop game concepts, exploring genres, themes, target audiences, and unique selling points. Use when starting a new game project from scratch or pivoting an existing idea. Also trigger for "game idea", "what kind of game", "I want to make a game", "game pitch", or "explore game concepts".
---

# Game Concept — Ideation & Vision

Generate and refine game concepts from a spark of an idea into a structured pitch ready for full design.

## Inputs

Gather whatever the user has — even a single sentence is enough to start:

- **Inspiration:** A theme, mechanic, feeling, or reference game
- **Platform targets:** PC, console, mobile, VR, web
- **Scope:** Solo jam game, indie release, or large-scale production
- **Team size & skills:** What's realistically buildable

If the user has nothing yet, run a guided brainstorm using the prompts below.

## Step 1: Idea Generation

If the user needs help finding an idea, work through these lenses:

### Genre × Theme Matrix

| | Sci-Fi | Fantasy | Horror | Slice-of-Life | Historical |
|---|--------|---------|--------|---------------|------------|
| **Platformer** | Gravity shifts | Enchanted forests | Haunted mansion | Rooftop courier | Ancient ruins |
| **Roguelike** | Space station | Dungeon crawl | Eldritch depths | Office survival | Time periods |
| **Strategy** | Colony sim | Kingdom builder | Cult management | City planner | War campaigns |
| **Puzzle** | Hacking | Alchemy | Escape room | Cooking | Archaeology |
| **RPG** | Cyberpunk | Classic quest | Survival horror | Life sim | Dynasty |

### Brainstorm Prompts

Ask the user 3-5 of these:

1. What game do you wish existed but doesn't?
2. What's a mechanic you love? What if it was the entire game?
3. What non-game experience would make a great game? (cooking, hiking, archaeology)
4. Take two genres that don't normally combine — what happens?
5. What emotion do you want the player to feel most?
6. What's the "one more turn / one more run" hook?
7. If you had to describe the game in a single verb, what is it?

## Step 2: Concept Pillars

Define 3-4 **design pillars** — the non-negotiable truths of the game:

```
Example — "Void Courier" (Sci-Fi Delivery Roguelike):
┌─────────────────────────────────────────────────┐
│  Pillar 1: MOMENTUM                             │
│  → The player should always be moving forward    │
│                                                  │
│  Pillar 2: RISK vs REWARD                        │
│  → Every delivery route is a gamble              │
│                                                  │
│  Pillar 3: EXPRESSIVE LOADOUTS                   │
│  → Ship customization changes how you play       │
│                                                  │
│  Pillar 4: EMERGENT STORIES                      │
│  → No two runs tell the same story               │
└─────────────────────────────────────────────────┘
```

## Step 3: Elevator Pitch

Write a **2-3 sentence pitch** that answers:
- What is it? (genre + platform)
- What do you do? (core verb / loop)
- Why is it special? (unique hook)

**Template:**
> [Title] is a [genre] game for [platform] where you [core action]. Unlike [comparable game], [unique differentiator]. The game targets [audience] and can be built by [team size] in [timeframe].

## Step 4: Core Loop Sketch

Map the **30-second, 5-minute, and session-level loops**:

```
30-second loop (moment-to-moment):
  → [Input action] → [Feedback] → [Micro-decision]

5-minute loop (encounter/level):
  → [Setup] → [Challenge] → [Resolution] → [Reward]

Session loop (meta-progression):
  → [Goal selection] → [Attempt] → [Outcome] → [Unlock/Progress]
```

## Step 5: Competitive Landscape

Identify 3-5 reference games and map where this concept sits:

```
                    Complex
                       │
           Dwarf       │    This Game
           Fortress    │       ★
                       │
  Niche ───────────────┼─────────────── Mainstream
                       │
           Obscure     │    Stardew
           Jam Game    │    Valley
                       │
                    Simple
```

## Step 6: Risk & Feasibility Check

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Scope creep | High | Define MVP feature set now |
| Tech unknown | Medium | Prototype risky mechanic first |
| Market saturation | Varies | Identify unique angle |
| Art bottleneck | High (solo) | Choose stylized/lo-fi aesthetic |

## Output

Save the concept brief to `artifacts/game-design/[project-name]-concept.md` with:
- Title and elevator pitch
- Design pillars
- Core loop diagram
- Target platform, audience, and scope
- Competitive positioning
- Top 3 risks

## Guidelines

- **Quantity before quality** in ideation — generate 5+ ideas before narrowing
- **The verb is the game** — if you can't describe the core action in one verb, keep refining
- Don't design the whole game here — that's what `/game-design-document` is for
- Kill ideas that excite the designer but bore the player
- Scope is king for indie/solo devs — a finished small game beats an abandoned epic
