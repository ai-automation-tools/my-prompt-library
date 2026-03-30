---
name: art-direction
description: Define the visual identity of a game including art style, color palettes, character design language, environment aesthetics, and asset pipelines. Use when establishing the look and feel of a game project. Also trigger for "art style", "visual style", "game aesthetics", "color palette", "character art", "pixel art", or "game graphics".
---

# Art Direction — Visual Identity & Style

Establish a cohesive visual identity that supports gameplay, evokes the right emotions, and is achievable within production constraints.

## Inputs

- Game concept and design pillars (use `/game-concept` for reference)
- Target platform and technical constraints (resolution, performance budget)
- Team art capabilities (solo dev? dedicated artist? AI-assisted?)
- Reference games and non-game visual inspirations

## Step 1: Art Style Selection

### Style Spectrum

```
REALISM ←─────────────────────────────────────→ ABSTRACTION

Photorealistic   Stylized     Cartoon     Minimalist    Abstract
(Unreal 5)     (Genshin)    (Cuphead)    (Monument     (Geometry
                                          Valley)       Wars)
   ↕               ↕           ↕            ↕             ↕
 COST: $$$$$    COST: $$$    COST: $$     COST: $       COST: $
 TEAM: 50+     TEAM: 10+    TEAM: 5+     TEAM: 1-3     TEAM: 1
```

### Common Art Styles for Games

| Style | Strengths | Weaknesses | Best For |
|-------|-----------|-----------|----------|
| **Pixel art** | Nostalgic, small team, fast iteration | Limited expression, perception of "cheap" | Platformers, RPGs, roguelikes |
| **Low-poly** | Clean, performant, stylish | Hard to do characters well | 3D exploration, strategy |
| **Hand-drawn** | Unique, expressive, artistic | Expensive to animate, inconsistency | Narrative games, platformers |
| **Cel-shaded** | Timeless, readable, bold | Can look flat without care | Action, adventure, RPGs |
| **Voxel** | Easy to create, destructible | Niche aesthetic, limited detail | Sandbox, building games |
| **Flat/vector** | Scalable, clean, accessible | Can feel sterile | Mobile, puzzle, UI-heavy |
| **Photorealistic** | Immersive, impressive | Expensive, uncanny valley, ages fast | AAA action, simulation |

## Step 2: Color Language

### Palette Construction

```
PRIMARY PALETTE (3-4 colors — dominant):
  ┌────────┬────────┬────────┬────────┐
  │ Main   │ Accent │ Neutral│ Alert  │
  │ #2B4C7E│ #E8A838│ #D4C5A9│ #C23B22│
  │ Deep   │ Warm   │ Parch- │ Blood  │
  │ Ocean  │ Gold   │ ment   │ Red    │
  └────────┴────────┴────────┴────────┘

EMOTIONAL COLOR MAP:
  Safe areas:     Warm, saturated (greens, golds)
  Danger zones:   Cool, desaturated (grays, deep purples)
  Boss arenas:    High contrast (dark base, vivid accents)
  Reward moments: Bright, warm burst (gold, white, particles)
```

### Color Rules

- **Gameplay readability > aesthetic beauty** — the player must instantly distinguish friend/foe/interactable
- **Consistent color coding across all systems** — red = damage everywhere, not just in combat
- **Palette shift signals progression** — Act 1 greens → Act 2 blues → Act 3 reds
- **Accessibility:** All critical information must be distinguishable without color alone (add shape, pattern, or icon)

## Step 3: Character Design Language

### Character Design Sheet

```markdown
## Character: [Name]

### Silhouette Test
[Can you identify this character from silhouette alone? If no, redesign]

### Key Visual Traits
- **Shape language:** [Circles = friendly, Squares = strong, Triangles = dangerous]
- **Dominant color:** [One color that IS this character]
- **Signature element:** [The one detail everyone remembers — hat, scar, weapon, hair]
- **Scale:** [Relative to player and other characters]

### Expression Range
[How does this character emote? Full face animation? Body language? Icon system?]

### Animation Priorities
1. Idle — [character at rest reveals personality]
2. Walk/Run — [most-seen animation, must feel right]
3. Attack — [satisfying, readable wind-up and follow-through]
4. Hit/Death — [clear feedback that damage occurred]
```

### Shape Language

```
CIRCLES / CURVES          SQUARES / RECTANGLES      TRIANGLES / POINTS
───────────────           ────────────────────      ──────────────────
Friendly, soft,           Strong, stable,           Dangerous, fast,
approachable              reliable, heavy           cunning, dynamic

Heroes, companions,       Tanks, defenders,         Villains, rogues,
cute creatures            buildings, bosses         projectiles, traps
```

## Step 4: Environment Art Direction

### Environment Mood Template

```markdown
## Zone: [Name]

### Visual Identity
- **Biome/Theme:** [Forest, Desert, Tech Facility, Dreamscape...]
- **Time of day:** [Dawn, midday, dusk, night, timeless]
- **Weather:** [Clear, rain, fog, snow, magical]
- **Lighting mood:** [Warm/cool, high-key/low-key, colored light]
- **Palette:** [Primary, secondary, accent for this zone]

### Landmark Elements
[3-5 visually distinct features that orient the player]

### Density & Detail
- Foreground: [High detail — what the player interacts with]
- Midground: [Medium detail — the play space]
- Background: [Low detail / skybox — establishes scale and mood]

### Environmental Storytelling
[What does this space tell the player without words?]
```

## Step 5: Asset Pipeline

### Asset Naming Convention

```
[category]_[name]_[variant]_[state].[ext]

Examples:
  char_hero_idle_01.png
  env_tree_oak_autumn.fbx
  ui_btn_primary_hover.svg
  fx_explosion_fire_small.png
  prop_chest_wooden_open.png
```

### Asset Budget (per platform)

| Asset Type | Mobile | PC (Indie) | PC (High-end) |
|-----------|--------|-----------|--------------|
| Sprite sheet | 1024×1024 | 2048×2048 | 4096×4096 |
| Character tris | 500-2K | 5K-15K | 30K-100K |
| Environment tris | 200-1K | 2K-10K | 10K-50K |
| Texture size | 256-512px | 512-2048px | 2048-4096px |
| Draw calls/frame | <100 | <500 | <2000 |

### Art Production Workflow

```
Concept Art → Style Guide → Block-out → Draft Asset → Review → Final → Export
     ↓            ↓            ↓           ↓          ↓        ↓
  Explore      Lock style    Gray box    First pass  Iterate  Optimize
  options      + palette     geometry    with color   polish   compress
```

## Step 6: Style Guide Document

Every game should have a visual style guide covering:

```markdown
# [Game Title] — Visual Style Guide

## Art Philosophy
[1-2 sentences on the visual soul of the game]

## Do / Don't
| DO | DON'T |
|----|-------|
| Use thick outlines (2px+) | Use thin/inconsistent outlines |
| Limit palette to 16 colors | Use full RGB spectrum |
| Exaggerate proportions | Aim for anatomical accuracy |

## Color Palette
[Swatches with hex codes and usage rules]

## Typography
- **HUD:** [Font] at [size]
- **Menu headings:** [Font] at [size]
- **Body text:** [Font] at [size]

## Reference Sheet
[Collage of reference images that capture the target feel]
```

## Output

Save to `artifacts/game-design/[project-name]-art-direction.md`

## Guidelines

- **Consistency > quality** — a unified low-fi style beats inconsistent high-fi
- Style should serve gameplay — if the player can't read the action, the art failed
- Pick a style your team can sustain for the full project, not just a vertical slice
- Look outside games for inspiration — film, architecture, nature, fashion, graphic design
- Test art at the actual play scale — zoom out before polishing details
- Reference `/ui-ux-design` to ensure HUD and menus match the art direction
