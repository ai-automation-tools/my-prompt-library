---
name: game-testing
description: Plan and execute game QA including functional testing, playtesting, performance testing, compatibility testing, and bug tracking workflows. Use when setting up quality assurance for a game project. Also trigger for "game QA", "playtest", "bug tracking", "game testing", "QA plan", "regression testing", or "compatibility testing".
---

# Game Testing — QA, Playtesting & Quality

Build a testing strategy that catches bugs, validates fun, and ensures quality across platforms — from unit tests to large-scale playtests.

## Inputs

- Game design document (use `/game-design-document` for reference)
- Target platforms and hardware matrix
- Team size and QA resources
- Current development phase (prototype, alpha, beta, release)

## Step 1: Testing Strategy by Phase

| Phase | Focus | Testing Types |
|-------|-------|--------------|
| **Prototype** | Is it fun? Does the core mechanic work? | Informal playtesting, smoke testing |
| **Alpha** | Do all features work? Major bugs? | Functional testing, integration testing |
| **Beta** | Is it polished? Edge cases? Performance? | Full regression, performance, compatibility |
| **Release candidate** | Is it ship-ready? | Certification, compliance, final regression |
| **Post-launch** | Are players happy? What's broken in the wild? | Crash reporting, analytics, hotfix validation |

## Step 2: Testing Types for Games

### Functional Testing

```
TEST CATEGORIES:
  ├── Core mechanics — Does every player action work correctly?
  ├── Game flow — Can you complete the game start to finish?
  ├── UI/Menus — Do all screens navigate correctly?
  ├── Save/Load — Does saving and loading preserve all state?
  ├── Edge cases — What happens at boundaries? (0 HP, max inventory, etc.)
  ├── State transitions — Menu → gameplay → pause → resume → quit
  └── Localization — Does translated text fit? Are strings correct?
```

### Playtest Types

| Type | Purpose | Participants | Frequency |
|------|---------|-------------|-----------|
| **Developer playtest** | Sanity check by the team | Dev team | Daily/weekly |
| **Friends & family** | Fresh eyes on UX/fun | Non-dev acquaintances | Bi-weekly |
| **Focused playtest** | Test specific feature/level | Targeted recruits | Per milestone |
| **Open beta** | Stress test, wide feedback | Public sign-up | Pre-launch |
| **Blind playtest** | No instructions, pure observation | Strangers | Monthly |

### Playtest Session Template

```markdown
## Playtest Session: [Date]
**Build:** [version]
**Tester:** [name/ID]
**Duration:** [minutes]
**Focus area:** [what to observe]

### Pre-Test
- [ ] Build deployed and stable
- [ ] Recording software running (screen + face if possible)
- [ ] Tester has signed NDA (if needed)
- [ ] No instructions given (blind test) OR specific task provided

### Observation Log
| Timestamp | Observation | Category | Severity |
|-----------|-------------|----------|----------|
| 0:30 | Didn't notice tutorial prompt | UX | Medium |
| 2:15 | Laughed at physics interaction | Fun | Positive |
| 4:00 | Died and didn't understand why | Clarity | High |

### Post-Test Questions
1. What was the most fun part?
2. What was the most frustrating part?
3. Was anything confusing?
4. Would you play more? Why/why not?
5. What would you change?

### Key Takeaways
[3-5 actionable findings]
```

## Step 3: Bug Tracking

### Bug Report Template

```markdown
## Bug: [Short descriptive title]
**ID:** BUG-[number]
**Severity:** [Critical / High / Medium / Low / Cosmetic]
**Priority:** [P0-Blocker / P1-High / P2-Medium / P3-Low]
**Platform:** [PC / Console / Mobile / All]
**Build:** [version]
**Reporter:** [name]
**Date:** [date]

### Reproduction Steps
1. [Precise step 1]
2. [Precise step 2]
3. [Precise step 3]

### Expected Result
[What should happen]

### Actual Result
[What actually happens]

### Reproduction Rate
[Always / Often / Sometimes / Rare / Once]

### Evidence
[Screenshot, video, log file]

### Environment
- OS: [version]
- GPU: [model]
- RAM: [amount]
- Resolution: [WxH]
- Settings: [quality preset]
```

### Severity Definitions

| Severity | Definition | Example | Response |
|----------|-----------|---------|----------|
| **Critical** | Game unplayable, data loss, crash | Save corruption, hard crash | Fix immediately, hotfix |
| **High** | Major feature broken, progression blocked | Can't complete level, softlock | Fix before next milestone |
| **Medium** | Feature partially broken, workaround exists | Ability sometimes fails | Fix in next sprint |
| **Low** | Minor issue, doesn't affect gameplay | Texture seam visible | Fix when convenient |
| **Cosmetic** | Visual polish issue | Font alignment off by 1px | Backlog |

## Step 4: Performance Testing

### Performance Metrics

```
FRAME RATE:
  Target: [30/60/120 FPS]
  Minimum: [never below X FPS]
  Measurement: Average, 1% low, 0.1% low
  Tool: Built-in profiler, RenderDoc, PIX, Instruments

MEMORY:
  Budget: [MB/GB by platform]
  Monitor: Peak usage, leak detection over 1-hour session
  Alert: >80% of budget

LOAD TIMES:
  Initial load: <[X] seconds
  Level transition: <[X] seconds
  Fast travel / respawn: <[X] seconds

NETWORK (multiplayer):
  Tick rate: [Hz]
  Bandwidth per player: <[X] KB/s
  Latency tolerance: <[X] ms
```

### Performance Test Scenarios

| Scenario | What to Measure | Target |
|----------|----------------|--------|
| **Stress test** | Max entities on screen | Maintain target FPS |
| **Soak test** | 4-hour continuous play | No memory leaks |
| **Worst case** | Largest level + max effects | Above minimum FPS |
| **Loading** | Cold boot to gameplay | Under target time |
| **Streaming** | Moving through open world | No hitches >33ms |

## Step 5: Compatibility Testing

### Platform Matrix

```markdown
## PC Testing Matrix

| GPU Family | Min Spec | Recommended | High-End |
|-----------|---------|-------------|---------|
| NVIDIA | GTX 1060 | RTX 3060 | RTX 4080 |
| AMD | RX 580 | RX 6700 XT | RX 7900 XT |
| Intel | Arc A380 | Arc A770 | — |

| OS | Versions to Test |
|----|-----------------|
| Windows | 10 (21H2+), 11 |
| Linux | Ubuntu 22.04, SteamOS |
| macOS | Ventura, Sonoma (if applicable) |

| Input | Devices to Test |
|-------|----------------|
| Keyboard + Mouse | Standard, ultrawide support |
| Controller | Xbox, PlayStation, Switch Pro |
| Steam Deck | Handheld mode, docked |
```

### Certification Checklists

```
STEAM:
  □ Launches from Steam correctly
  □ Steam overlay works
  □ Cloud saves function
  □ Achievements trigger
  □ Controller support (if advertised)
  □ Steam Deck compatibility (if targeting)

CONSOLE (general):
  □ First-party controller support
  □ Platform-specific UI icons
  □ Suspend/resume works
  □ Trophy/achievement integration
  □ Rating board compliance (ESRB, PEGI)
  □ No crashes during soak test (4+ hours)
  □ Meets platform TRC/TCR requirements
```

## Step 6: Regression Testing

### Regression Suite Structure

```
SMOKE TEST (5 minutes — run every build):
  □ Game launches without crash
  □ New game starts and reaches gameplay
  □ Core mechanic functions (move, interact, combat)
  □ Save and load works
  □ Can pause and resume

CORE REGRESSION (30 minutes — run daily):
  □ All smoke tests +
  □ Complete tutorial/first level
  □ Inventory system functions
  □ All menu screens accessible
  □ Audio plays correctly
  □ No visual glitches in key areas

FULL REGRESSION (2-4 hours — run weekly/per milestone):
  □ All core regression +
  □ Complete full game path
  □ Test all difficulty settings
  □ Test all input methods
  □ Performance benchmarks pass
  □ Localization check (all languages)
  □ Edge case battery (0 items, max items, boundary values)
```

### Automated Testing for Games

```
UNIT TESTS:
  - Game logic calculations (damage formulas, drop rates)
  - State machine transitions
  - Pathfinding algorithms
  - Save/load serialization

INTEGRATION TESTS:
  - System interactions (combat + inventory + progression)
  - UI flow navigation
  - Network message handling

AUTOMATED GAMEPLAY:
  - Bot plays through levels (catches crashes, softlocks)
  - Random input fuzzing (monkey testing)
  - Overnight soak tests
  - Performance capture during automated runs
```

## Output

Save to `artifacts/game-design/[project-name]-test-plan.md`

## Guidelines

- **Test on target hardware** — your dev machine is not representative
- The best bug report includes exact reproduction steps and a video
- Playtest early, playtest often — don't wait until the game "looks good"
- Automate what's repetitive, human-test what requires judgment
- Track bug counts over time — rising counts in late development is a red flag
- Cross-reference `/mechanics-design` to ensure all mechanics are covered
- Cross-reference `/game-balancing` for balance-specific testing
- Use `/game-analytics` to track post-launch quality metrics
