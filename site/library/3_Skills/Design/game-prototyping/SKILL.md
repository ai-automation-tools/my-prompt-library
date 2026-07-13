---
name: game-prototyping
description: Plan and execute rapid game prototypes to validate mechanics, test assumptions, and find the fun before committing to full production. Use when building playable proofs-of-concept. Also trigger for "prototype", "game jam", "proof of concept", "find the fun", "playable demo", or "rapid prototype".
---

# Game Prototyping — Find the Fun Fast

Build the smallest possible playable version of your game to validate that the core mechanic is fun before investing in production.

## Inputs

- Core mechanic(s) to validate (use `/mechanics-design` for reference)
- Time budget (4 hours, weekend, 1 week, game jam)
- Engine/tools available
- What question this prototype must answer

## Step 1: Define the Prototype Goal

Every prototype must answer ONE question:

```
GOOD PROTOTYPE QUESTIONS:
  ✓ "Is the core movement fun?"
  ✓ "Does the combat feel satisfying?"
  ✓ "Can players understand the puzzle mechanic without a tutorial?"
  ✓ "Is the procedural generation creating interesting levels?"
  ✓ "Does co-op add to the experience or just complicate it?"

BAD PROTOTYPE QUESTIONS:
  ✗ "Is this game good?" (too broad)
  ✗ "Will people buy it?" (not testable with a prototype)
  ✗ "Does the art style work?" (build an art test, not a prototype)
```

### Prototype Scope Card

```markdown
## Prototype: [Name]
**Question:** [What this prototype must answer]
**Time budget:** [Hours/days]
**Success criteria:** [Observable indicator that the answer is "yes"]
**Failure criteria:** [Observable indicator to kill or pivot]
**What to build:** [Minimum features needed]
**What to skip:** [Explicitly listed cut scope]
```

## Step 2: Scope Ruthlessly

### The Prototype Pyramid

```
                    ┌───────────┐
                    │  CORE     │  ← BUILD THIS
                    │  MECHANIC │
                 ┌──┴───────────┴──┐
                 │   GAME FEEL     │  ← ADD IF TIME
                 │  (juice, SFX)   │
              ┌──┴─────────────────┴──┐
              │    SECONDARY SYSTEMS   │  ← PROBABLY SKIP
              │  (inventory, upgrades) │
           ┌──┴───────────────────────┴──┐
           │     CONTENT & POLISH         │  ← DEFINITELY SKIP
           │  (levels, art, story, menus) │
           └──────────────────────────────┘
```

### What to Use vs. What to Build

| Aspect | Prototype Approach |
|--------|-------------------|
| **Art** | Colored shapes, free assets, placeholder sprites |
| **Sound** | Free SFX libraries, silence is fine |
| **UI** | Debug text, no menus, hardcoded settings |
| **Levels** | One hand-crafted room/level |
| **Enemies** | 1-2 types, minimal AI |
| **Save system** | None — restart every time |
| **Menu** | Press R to restart, Escape to quit |
| **Polish** | Zero. Raw mechanics only |

## Step 3: Engine & Tool Selection

### Quick-Start by Game Type

| Game Type | Fastest Prototyping Tool | Why |
|-----------|------------------------|-----|
| 2D platformer | Godot / GameMaker | Built-in physics, fast iteration |
| 3D action | Unity / Unreal | Asset stores, established pipeline |
| Card game | Tabletop Simulator / Web | No engine needed |
| Puzzle game | HTML5 Canvas / Godot | Instant browser testing |
| Narrative | Twine / Ink / Ren'Py | Text-first, branch instantly |
| Board game | Paper prototype first | Fastest possible iteration |
| Mobile | Flutter / Unity | Cross-platform from start |
| Multiplayer | Fishnet/Mirror (Unity) / Godot | Built-in networking |

### Paper Prototyping

Before any code, consider a paper prototype for:
- Turn-based games
- Card games
- Board games
- Economy/resource systems
- Level layouts
- Puzzle mechanics

```
Paper prototype checklist:
  □ Index cards for game elements
  □ Dice/coins for randomness
  □ Tokens for player positions
  □ Pen and paper for tracking state
  □ A willing playtester
  □ 30 minutes

  If it's not fun on paper, code won't fix it.
```

## Step 4: Build Sprint

### Hour-by-Hour Plan (8-hour prototype)

```
HOUR 1:   Project setup, core object creation
          → Player exists and can receive input

HOUR 2-3: Core mechanic implementation
          → The ONE thing this prototype tests is functional

HOUR 4:   Basic game loop (start → play → end → restart)
          → Playable from start to finish

HOUR 5:   Opposition/challenge (enemies, puzzles, time pressure)
          → There is something to play AGAINST

HOUR 6:   Game feel pass (screen shake, SFX, particles)
          → It feels satisfying to perform the core action

HOUR 7:   Difficulty tuning & edge case fixes
          → Playable without crashes or soft-locks

HOUR 8:   Build, deploy, document findings
          → Someone else can play it
```

### Prototype Code Rules

```
DO:
  ✓ Hardcode values (tweak in code, not UI)
  ✓ Use public fields / global state (speed over architecture)
  ✓ Copy-paste instead of abstracting
  ✓ Use print/debug statements liberally
  ✓ Name things descriptively (PlayerMoveSpeed, not pms)

DON'T:
  ✗ Write unit tests
  ✗ Create design patterns or abstractions
  ✗ Optimize performance
  ✗ Handle edge cases (unless they block testing)
  ✗ Plan for scalability
  ✗ Feel bad about the code quality

PROTOTYPE CODE IS DISPOSABLE.
If the prototype succeeds, rebuild from scratch for production.
```

## Step 5: Playtesting the Prototype

### Playtest Protocol

```
BEFORE:
  1. Write down 3 things you expect to observe
  2. Prepare a short task: "Try to reach the end of the level"
  3. Set up screen recording if possible

DURING:
  1. Hand the controls to someone else — do NOT explain mechanics
  2. Watch silently — note where they pause, struggle, laugh, or quit
  3. Ask them to think aloud: "What are you trying to do right now?"
  4. Don't defend the design — just observe and note

AFTER:
  1. Ask: "What was the most fun part?"
  2. Ask: "What was the most confusing part?"
  3. Ask: "Would you play more of this?"
  4. Compare observations to your 3 predictions
```

### Prototype Evaluation Matrix

| Signal | Verdict |
|--------|---------|
| Playtester asks "can I play again?" | Core mechanic validated |
| Playtester understands without explanation | Intuitive design |
| Playtester finds strategies you didn't plan | Emergent depth — great sign |
| Playtester disengages after 2 minutes | Core loop needs work |
| Playtester gets stuck and frustrated | Onboarding or clarity issue |
| You have to explain the mechanic | Not self-teaching — redesign |

## Step 6: Kill or Continue Decision

```
CONTINUE TO PRODUCTION if:
  ✓ The core mechanic is fun with placeholder art
  ✓ Players understand it without instruction
  ✓ You can envision 2+ hours of content built on this foundation
  ✓ The team is excited to keep working on it

ITERATE THE PROTOTYPE if:
  ~ The mechanic has potential but needs tuning
  ~ Players understand it but don't find it fun yet
  ~ One specific element is blocking the fun

KILL THE PROTOTYPE if:
  ✗ The core mechanic isn't fun and you can't see how to fix it
  ✗ Players are fundamentally confused by the concept
  ✗ The technical requirements exceed your resources
  ✗ No one on the team wants to keep working on it

  Killing a prototype is a SUCCESS — you saved months of wasted work.
```

## Output

Save prototype findings to `artifacts/game-design/[project-name]-prototype-[number].md` including:
- Prototype goal and question
- What was built
- Playtest observations
- Kill / iterate / continue decision with justification

## Guidelines

- **The prototype is the question, not the answer** — build to learn, not to ship
- You should feel embarrassed showing the prototype — if it looks polished, you over-built
- Prototype the riskiest mechanic, not the one you're most confident about
- Get it in front of players within 48 hours — your own opinion is unreliable
- Never prototype and produce in the same codebase — burn the prototype, start clean
- Use `/mechanics-design` to identify which mechanic needs validation most
- Use `/game-testing` for formal QA once you move past prototype stage
