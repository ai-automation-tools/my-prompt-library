---
name: ui-ux-design
description: Design game user interfaces and user experience flows including HUD, menus, inventory screens, accessibility, and player feedback systems. Use when designing how the player interacts with game systems visually. Also trigger for "game UI", "game UX", "HUD design", "menu design", "inventory UI", "game accessibility", or "game interface".
---

# UI/UX Design — Interface & Player Experience

Design game interfaces that are invisible when they work and intuitive when discovered — HUDs, menus, feedback systems, and accessibility.

## Inputs

- Game mechanics and systems (use `/mechanics-design` for reference)
- Target platform (affects input method and screen real estate)
- Art style direction (use `/art-direction` for reference)
- Accessibility requirements

## Step 1: UI Inventory

List every screen and overlay the game needs:

```
IN-GAME (HUD):
  ├── Health / resource bars
  ├── Minimap / compass
  ├── Ability cooldowns
  ├── Ammo / item count
  ├── Objective tracker
  ├── Interaction prompts
  └── Damage indicators

MENUS:
  ├── Main menu (title screen)
  ├── Pause menu
  ├── Settings (video, audio, controls, accessibility)
  ├── Inventory / equipment
  ├── Map (full)
  ├── Quest / journal
  ├── Skill tree / upgrades
  ├── Shop / vendor
  ├── Crafting
  ├── Character / stats
  └── Codex / bestiary / lore

SYSTEM:
  ├── Loading screens
  ├── Save/load
  ├── Tutorial overlays
  ├── Achievement popups
  └── Dialog / conversation UI
```

## Step 2: HUD Design Principles

### Information Hierarchy

```
┌─────────────────────────────────────────────────┐
│ [Objective]                    [Minimap/Compass] │  ← PERSISTENT
│                                                  │
│                                                  │
│                                                  │
│                                                  │
│ [Interact: E]              ← CONTEXTUAL          │
│                                                  │
│                                                  │
│ [HP ████████░░]  [MP ██████░░░░]  [1][2][3][4]  │  ← PERSISTENT
│ [Ammo: 24/120]                    [Item: Potion] │
└─────────────────────────────────────────────────┘
```

### HUD Rules

| Rule | Why |
|------|-----|
| **Minimal by default** | Screen space = immersion. Less HUD = more game world |
| **Context-sensitive** | Show ammo when weapon is drawn, not while exploring |
| **Glanceable** | Player should read any element in <0.5 seconds |
| **Consistent position** | Health is always bottom-left (or wherever) — never moves |
| **Color-coded** | Red = danger, green = health, blue = mana — universal language |
| **Scalable** | Allow players to resize and reposition HUD elements |

## Step 3: Menu Flow

### Navigation Map

```
TITLE SCREEN
  ├── New Game → [Difficulty Select] → [Character Creation] → GAMEPLAY
  ├── Continue → [Save Select] → GAMEPLAY
  ├── Settings ─┐
  │             ├── Video
  │             ├── Audio
  │             ├── Controls
  │             ├── Gameplay
  │             └── Accessibility
  ├── Credits
  └── Quit

PAUSE MENU (in-game)
  ├── Resume
  ├── Inventory
  ├── Map
  ├── Quest Log
  ├── Settings
  ├── Save
  └── Quit to Menu → [Confirm?] → TITLE SCREEN
```

### Menu Design Rules

- **Max 2 clicks to any feature** from pause menu
- **B / Escape always goes back** — universal escape hatch
- **Remember cursor position** when returning to a menu
- **No dead-end screens** — every screen has a clear exit
- **Preview changes** in settings before applying (especially resolution)

## Step 4: Feedback Systems

### Feedback Layers

| Layer | Channel | Response Time | Example |
|-------|---------|---------------|---------|
| **Immediate** | Visual + Audio | <50ms | Hit flash, button click sound |
| **Confirmation** | Animation + UI | 100-300ms | Damage number popup, XP bar fill |
| **Reward** | Fanfare + Screen | 500ms-2s | Level up screen, loot reveal |
| **Progression** | Summary | End of session | Stats screen, rank change |

### Juice Checklist

Every player action should have at least 3 of these:

- [ ] **Screen shake** — impacts feel weighty
- [ ] **Particles** — sparks, debris, magic effects
- [ ] **Sound effect** — satisfying audio feedback
- [ ] **Animation** — squash & stretch, recoil
- [ ] **Flash / color shift** — hit confirmation
- [ ] **Number popup** — damage, XP, currency
- [ ] **UI reaction** — health bar shake, icon pulse
- [ ] **Haptic feedback** — controller rumble (if applicable)
- [ ] **Slow motion** — hit-stop on critical strikes
- [ ] **Camera response** — zoom, tilt, or flinch

## Step 5: Accessibility

### Accessibility Tiers

```
TIER 1 — MINIMUM (ship with these):
  ✓ Remappable controls
  ✓ Subtitles with speaker identification
  ✓ Scalable UI and text size
  ✓ Colorblind mode (deuteranopia, protanopia, tritanopia)
  ✓ Volume sliders (master, music, SFX, voice, UI)

TIER 2 — RECOMMENDED:
  ✓ High contrast mode
  ✓ Screen reader support for menus
  ✓ One-handed control scheme
  ✓ Toggle vs hold options for all inputs
  ✓ Difficulty modifiers (not just Easy/Hard)
  ✓ Motion sickness options (FOV slider, head bob toggle, screen shake toggle)

TIER 3 — EXCELLENT:
  ✓ Full audio descriptions
  ✓ Sign language interpretation for cutscenes
  ✓ Auto-aim / aim assist granularity
  ✓ Cognitive accessibility (simplified UI mode, objective reminders)
  ✓ Speed controls for timed events
  ✓ Skip options for non-gameplay segments
```

### Accessibility Audit Checklist

- [ ] Can a player with no color vision complete the game?
- [ ] Can a deaf player follow the story and react to threats?
- [ ] Can a player with limited mobility use all mechanics?
- [ ] Can a player with low vision read all text and UI elements?
- [ ] Are all time-sensitive actions adjustable or skippable?

## Step 6: Platform-Specific Considerations

| Aspect | PC | Console | Mobile |
|--------|-----|---------|--------|
| **Input** | Mouse + KB | Gamepad | Touch |
| **Cursor** | Precise | Snapping | Fat finger tolerance |
| **Text size** | 12px min | 24px min (10ft viewing) | 16px min |
| **Menu depth** | Deep ok | Max 3 levels | Max 2 levels |
| **Tooltips** | Hover | Hold button | Long press |
| **Inventory** | Grid + list | Grid with scroll | Scrolling list |
| **Safe zone** | Full screen | 90% (TV overscan) | Avoid notch/gesture areas |

## Output

Save to `artifacts/game-design/[project-name]-ui-ux.md` including:
- HUD wireframe (ASCII or description)
- Menu flow diagram
- Feedback specification per mechanic
- Accessibility feature list
- Platform adaptation notes

## Guidelines

- **The best UI is no UI** — if the game world can communicate it, skip the overlay
- Test on target hardware at target viewing distance
- Paper prototype menus before building them
- Don't innovate on navigation patterns — players expect Back to go back
- Accessibility is not a feature — it's a requirement
- Reference `/art-direction` for visual consistency with game style
