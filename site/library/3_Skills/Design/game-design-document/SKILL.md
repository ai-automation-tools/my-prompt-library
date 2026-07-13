---
name: game-design-document
description: Create comprehensive Game Design Documents (GDDs) covering mechanics, systems, content, and technical requirements. Use when formalizing a game concept into a full design specification. Also trigger for "GDD", "design doc", "game spec", "write up the game design", or "document the game".
---

# Game Design Document — Full Specification

Transform a game concept into a structured, living design document that serves as the single source of truth for the entire project.

## Inputs

- A game concept or pitch (use `/game-concept` first if needed)
- Target platform and audience
- Scope constraints (team size, timeline, budget)

## GDD Structure

### Section 1: Overview

```markdown
# [Game Title] — Game Design Document
**Version:** 1.0
**Last Updated:** [date]
**Author(s):** [names]

## 1. Game Overview
- **Title:** [name]
- **Genre:** [primary] / [secondary]
- **Platform(s):** [targets]
- **Target Audience:** [age, gamer type, comparable audiences]
- **Target Rating:** [E, T, M equivalent]
- **Estimated Dev Time:** [months]
- **Team Size:** [count and roles]

## 2. Vision Statement
[2-3 sentences — the soul of the game. What experience are you creating?]

## 3. Design Pillars
1. [Pillar] — [explanation]
2. [Pillar] — [explanation]
3. [Pillar] — [explanation]
```

### Section 2: Gameplay

```markdown
## 4. Core Mechanics
### 4.1 Core Loop
[Diagram of the moment-to-moment gameplay loop]

### 4.2 Player Actions
| Action | Input | Result | Feedback |
|--------|-------|--------|----------|
| [verb] | [key/button] | [effect] | [visual/audio] |

### 4.3 Systems
[Detail each interconnected system:]
- Movement system
- Combat / interaction system
- Inventory / resource system
- Progression system

### 4.4 Win / Lose Conditions
- **Victory:** [conditions]
- **Failure:** [conditions]
- **Session end:** [what triggers end of play session]

## 5. Game Flow
### 5.1 First-Time User Experience (FTUE)
[Minute-by-minute breakdown of the first 10 minutes]

### 5.2 Session Flow
[Typical play session from start to quit]

### 5.3 Progression Arc
[How the game evolves over hours/days/weeks]
```

### Section 3: Content

```markdown
## 6. World & Setting
- **Setting:** [time, place, tone]
- **Lore summary:** [1 paragraph]
- **Key locations:** [list with descriptions]

## 7. Characters / Entities
| Name | Role | Mechanics | Visual Style |
|------|------|-----------|-------------|
| [name] | [player/NPC/enemy] | [abilities] | [reference] |

## 8. Levels / Maps / Stages
| Level | Theme | New Mechanic Introduced | Estimated Playtime |
|-------|-------|------------------------|-------------------|
| 1 | [theme] | [mechanic] | [minutes] |

## 9. Items / Equipment / Abilities
[Categorized tables of all collectible/usable game objects]

## 10. Narrative
[Story outline — see /narrative-design for deep work]
```

### Section 4: Technical

```markdown
## 11. Art Style
- **Visual reference:** [mood board description]
- **Resolution / aspect:** [targets]
- **Animation style:** [frame-by-frame, skeletal, 3D]

## 12. Audio
- **Music style:** [genre, mood, reference tracks]
- **SFX approach:** [realistic, stylized, retro]
- **Voice acting:** [yes/no, scope]

## 13. UI/UX
- **HUD elements:** [list]
- **Menu flow:** [diagram]
- **Accessibility features:** [list]

## 14. Technical Requirements
- **Engine:** [Unity, Unreal, Godot, custom]
- **Min specs:** [if PC]
- **Networking:** [offline, online, multiplayer type]
- **Save system:** [local, cloud, format]
- **Target FPS:** [30/60/120]
```

### Section 5: Production

```markdown
## 15. Milestones
| Milestone | Target Date | Deliverables |
|-----------|------------|-------------|
| Prototype | [date] | Core loop playable |
| Vertical Slice | [date] | One complete level |
| Alpha | [date] | All features, placeholder art |
| Beta | [date] | Content complete |
| Gold | [date] | Ship-ready |

## 16. Risk Register
| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| [risk] | High/Med/Low | High/Med/Low | [plan] |

## 17. Monetization (if applicable)
- **Model:** [premium, F2P, subscription]
- **IAP types:** [cosmetic, gameplay, expansion]
- **Ethical boundaries:** [no pay-to-win, etc.]
```

## Writing Guidelines

When filling each section:

1. **Be specific, not aspirational** — "enemies have 3 behavior states" not "smart AI"
2. **Use tables** for anything that has multiple instances (items, levels, characters)
3. **Include numbers** — damage values, cooldown times, costs, even if estimated
4. **Reference pillars** — every feature should trace back to a design pillar
5. **Mark unknowns** with `[TBD]` rather than guessing — the GDD is honest

## Output

Save to `artifacts/game-design/[project-name]-gdd.md`

## Guidelines

- The GDD is a **living document** — version it and update as design evolves
- Start with sections 1-5 (overview + gameplay) — the rest can be filled iteratively
- Every team member should be able to open the GDD and know what to build
- If a section exceeds 3 pages, consider breaking it into a sub-document
- Cross-reference other skills: `/narrative-design`, `/mechanics-design`, `/level-design`
- Include a changelog at the bottom tracking major design decisions
