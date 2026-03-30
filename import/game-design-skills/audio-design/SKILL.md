---
name: audio-design
description: Design game audio systems including music, sound effects, ambient soundscapes, adaptive audio, and audio implementation strategy. Use when planning the sonic identity of a game. Also trigger for "game music", "sound effects", "game audio", "soundtrack", "SFX design", "ambient sound", or "adaptive music".
---

# Audio Design — Sound, Music & Sonic Identity

Design the audio layer that makes games feel alive — from satisfying SFX to adaptive soundtracks to immersive ambience.

## Inputs

- Game concept and art direction (use `/game-concept` and `/art-direction` for reference)
- Platform and performance constraints
- Audio budget (original composition vs. licensed vs. procedural)
- Engine audio capabilities (FMOD, Wwise, built-in)

## Step 1: Audio Pillars

Define 3-4 sonic principles that guide every audio decision:

```
Example — Fantasy Action RPG:
┌─────────────────────────────────────────────┐
│  Pillar 1: WEIGHT                           │
│  → Every hit, step, and action feels heavy  │
│                                             │
│  Pillar 2: LIVING WORLD                     │
│  → Environments sound inhabited and dynamic │
│                                             │
│  Pillar 3: EMOTIONAL ARC                    │
│  → Music mirrors the player's journey       │
│                                             │
│  Pillar 4: CLARITY                          │
│  → Gameplay-critical sounds cut through mix │
└─────────────────────────────────────────────┘
```

## Step 2: Music Direction

### Music Style Definition

```markdown
## Music Brief

**Genre/Style:** [orchestral, synth, chiptune, ambient, rock, hybrid]
**Reference tracks:** [3-5 existing tracks that capture the target feel]
**Instrumentation:** [key instruments / synths / sound sources]
**Tempo range:** [BPM range for exploration, combat, menus]
**Key/Scale:** [if applicable — minor for dark, major for uplifting]
```

### Music Map

Assign music to game states:

| Game State | Music Style | Tempo | Intensity | Transition |
|------------|-------------|-------|-----------|------------|
| Main menu | Theme arrangement | 80 BPM | Medium | — |
| Exploration (safe) | Ambient, melodic | 70-90 BPM | Low | Crossfade 2s |
| Exploration (danger) | Tension, sparse | 90-100 BPM | Medium | Layer add 1s |
| Combat (normal) | Driving, rhythmic | 120-140 BPM | High | Hard cut + stinger |
| Combat (boss) | Epic, full orchestra | 140-160 BPM | Very High | Transition sting |
| Victory | Fanfare | — | Celebratory | 0.5s after last hit |
| Death | Somber | — | Low | Fade to silence |
| Cutscene | Scored to scene | Varies | Varies | Crossfade |
| Shop/NPC | Diegetic / calm | 80 BPM | Low | Duck + fade |

### Adaptive Music System

```
LAYER-BASED ADAPTIVE MUSIC:
  Layer 0: Ambient pad (always playing)
  Layer 1: Melodic theme (exploration)
  Layer 2: Percussion (tension/combat proximity)
  Layer 3: Full arrangement (active combat)
  Layer 4: Boss-specific layer (boss encounters)

  Triggers:
    Enter danger zone    → Add Layer 2
    Enemy aggro          → Add Layer 3, increase tempo
    Enemy defeated       → Remove Layer 3 over 4 beats
    Leave danger zone    → Remove Layer 2 over 8 beats
    Boss encounter       → Replace Layer 3 with Layer 4

HORIZONTAL RESEQUENCING:
  Track divided into segments that play in different orders
  based on game state:
    Explore: A → B → C → A → B → D (calm variants)
    Combat:  E → F → E → G (intense variants)
    Transition segments bridge between states
```

## Step 3: Sound Effects Design

### SFX Categories

```
PLAYER SFX:
  ├── Movement (footsteps, landing, jumping, climbing)
  ├── Combat (swing, impact, block, parry, reload)
  ├── Abilities (cast, charge, activate, cooldown)
  ├── Feedback (damage taken, heal, level up, death)
  └── UI (menu hover, select, back, error, notification)

WORLD SFX:
  ├── Environment (wind, water, fire, machinery)
  ├── Objects (doors, chests, switches, breakables)
  ├── NPCs (voice, footsteps, combat, reactions)
  ├── Creatures (idle, alert, attack, death)
  └── Weather (rain, thunder, snow crunch, storm)

SYSTEM SFX:
  ├── UI navigation (hover, click, tab switch)
  ├── Notifications (quest complete, achievement, save)
  ├── Transition (screen fade, loading, menu open/close)
  └── Error (invalid action, out of ammo, locked door)
```

### SFX Design Sheet Template

```markdown
## Sound: [Name]
**Category:** [Player / World / System]
**Trigger:** [What causes this sound to play]
**Duration:** [Length in seconds]
**Variations:** [Number of random alternatives to prevent repetition]
**Priority:** [1-5, where 1 = must play, 5 = can be culled]
**3D/2D:** [Spatialized or flat]
**Attenuation:** [Falloff distance if 3D]
**Pitch variance:** [±X% randomization]
**Layer composition:** [What sub-sounds make up this SFX]
```

### The 3-Layer SFX Method

Every important SFX should have 3 layers:

```
Layer 1: BODY — The core of the sound (sword slash = metallic swipe)
Layer 2: SWEETENER — The satisfying detail (slash = whoosh of air)
Layer 3: IMPACT — The consequence (slash = flesh/armor contact)

Combined with:
  Pitch variance: ±5-15% per play
  Volume variance: ±2-4 dB per play
  Variant count: 3-5 recordings per sound
  → Prevents "machine gun effect" (repetitive identical sounds)
```

## Step 4: Ambient Soundscape

### Ambience Construction

```
BASE LAYER: Continuous tone (room tone, wind, hum)
  ↑ Always playing, very low volume

EVENT LAYER: Random one-shots (bird call, creak, drip)
  ↑ 5-30 second random intervals, varies per zone

PROXIMITY LAYER: Position-based emitters (waterfall, fire, forge)
  ↑ 3D spatialized, volume by distance

REACTIVE LAYER: State-based changes (time of day, weather, player action)
  ↑ Crossfade between variants

Zone example — Forest:
  Base: Wind through leaves (loop)
  Events: Bird calls (10-20s), branch snap (30-60s), insect buzz (5-15s)
  Proximity: River (3D, 20m range), campfire (3D, 8m range)
  Reactive: Day → birdsong, Night → crickets + owl, Rain → drips on canopy
```

## Step 5: Audio Mix

### Mix Priority Stack

```
PRIORITY 1 (never duck):  Player combat SFX, critical alerts
PRIORITY 2 (slight duck):  Enemy combat SFX, voice/dialogue
PRIORITY 3 (moderate duck): Music, ambient events
PRIORITY 4 (heavy duck):   Background ambience, distant sounds
PRIORITY 5 (cull first):   Environmental detail, decorative SFX

DUCKING RULES:
  When Priority 1 plays → Duck Priority 3-5 by 3-6 dB
  During dialogue → Duck music by 6-9 dB, pause ambient events
  In menus → Fade gameplay audio to 20%, play menu music
```

### Voice Count Budget

| Platform | Max Simultaneous Sounds | Recommended |
|----------|------------------------|-------------|
| Mobile | 16-32 | 24 |
| PC (indie) | 32-64 | 48 |
| Console | 64-128 | 96 |
| PC (AAA) | 128-256 | 192 |

## Step 6: Audio Asset List

Create a master spreadsheet:

| ID | Name | Category | Trigger | Variations | Priority | Status |
|----|------|----------|---------|-----------|----------|--------|
| SFX_001 | player_footstep_dirt | Player/Move | Walk on dirt | 5 | 3 | TODO |
| SFX_002 | sword_slash | Player/Combat | Light attack | 4 | 1 | Done |
| MUS_001 | theme_main | Music/Menu | Main menu | 1 | 2 | WIP |
| AMB_001 | forest_day_base | Ambient/Base | Forest zone | 2 | 4 | TODO |

## Output

Save to `artifacts/game-design/[project-name]-audio.md`

## Guidelines

- **Sound is 50% of the experience** — budget accordingly, not as an afterthought
- **Silence is a sound design tool** — the absence of sound creates tension better than any SFX
- Record/source more variations than you think you need — repetition kills immersion
- Mix at the volume your players will use, on the hardware they'll use
- Test with headphones AND speakers — spatial audio behaves very differently
- Cross-reference `/mechanics-design` — every mechanic needs audio feedback
- Cross-reference `/ui-ux-design` — every UI interaction needs a sound
