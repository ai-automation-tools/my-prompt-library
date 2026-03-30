---
name: multiplayer-design
description: Design multiplayer systems including networking architecture, matchmaking, social features, anti-cheat, and multiplayer game modes. Use when adding online or local multiplayer to a game. Also trigger for "multiplayer", "online play", "co-op design", "PvP design", "matchmaking", "netcode", or "multiplayer architecture".
---

# Multiplayer Design — Networking, Social & Competition

Design multiplayer systems that feel fair, responsive, and social — from netcode architecture to matchmaking to community features.

## Inputs

- Game concept and mechanics (use `/game-concept` and `/mechanics-design`)
- Multiplayer type (co-op, competitive, MMO, async)
- Target player count per session
- Platform and infrastructure budget
- Latency tolerance of core mechanics

## Step 1: Multiplayer Mode Definition

### Mode Types

| Mode | Player Count | Interaction | Examples |
|------|-------------|-------------|---------|
| **Local co-op** | 2-4 | Same screen | Overcooked, It Takes Two |
| **Online co-op** | 2-8 | Cooperative PvE | Deep Rock Galactic, Destiny |
| **Competitive PvP** | 2-100+ | Adversarial | CS2, Fortnite, Street Fighter |
| **Asymmetric** | 2-5 | Different roles | Dead by Daylight, Among Us |
| **MMO** | 100-1000s | Shared world | WoW, FFXIV, EVE |
| **Asynchronous** | Any | Indirect | Dark Souls messages, Clash of Clans |

### Mode Specification Template

```markdown
## Mode: [Name]

**Players:** [Min-Max]
**Teams:** [FFA / Teams of X / Asymmetric roles]
**Objective:** [Win condition]
**Duration:** [Session length]
**Progression:** [Per-match rewards, rankings]
**Social:** [Voice chat, text, emotes, pings]
**Drop-in/out:** [Can players join/leave mid-match?]
```

## Step 2: Network Architecture

### Architecture Selection

```
PEER-TO-PEER (P2P)           CLIENT-SERVER              RELAY/HYBRID
─────────────────            ──────────────              ────────────
  P1 ←──→ P2                     Server                  Relay
  ↕    ✕    ↕                   ╱  │  ╲               ╱   │   ╲
  P3 ←──→ P4                 C1   C2   C3           C1   C2   C3

Pros:                        Pros:                    Pros:
 - No server cost             - Authoritative          - NAT traversal
 - Low latency (direct)       - Anti-cheat control     - Fallback for P2P
 - Works offline/LAN          - Scalable               - Lower cost than full server
                               - Consistent state

Cons:                        Cons:                    Cons:
 - Host advantage             - Server cost            - Higher latency
 - NAT issues                 - Single point fail      - Complex architecture
 - Cheat-vulnerable           - Latency to server      - Harder to debug
 - Hard to scale

Best for:                    Best for:                Best for:
 Fighting games               Shooters, MMOs           Casual multiplayer
 Local co-op                  Competitive games        Mobile games
 Small sessions               Large player counts      Cross-platform
```

### Synchronization Models

| Model | How It Works | Latency Feel | Best For |
|-------|-------------|-------------|---------|
| **Lockstep** | All clients wait for all inputs each frame | Laggy at high ping | RTS, fighting games |
| **State sync** | Server sends full game state snapshots | Smooth with interpolation | Shooters, action games |
| **Input prediction** | Client predicts, server corrects | Responsive but rollback-y | Fighting games, platformers |
| **Eventual consistency** | Clients diverge, periodically sync | Loose, async feel | MMOs, strategy, async |

## Step 3: Lag Compensation

### Techniques

```
CLIENT-SIDE PREDICTION:
  Client: Player presses "move right"
  Client: Immediately moves character right (predicted)
  Client: Sends input to server
  Server: Processes input, sends authoritative position
  Client: If server disagrees → smooth correction (rubber-banding)

SERVER RECONCILIATION:
  Client stores history of all inputs with timestamps
  When server state arrives (past), re-simulate from that point
  Apply all inputs that happened after the server snapshot
  → Minimizes visible corrections

ENTITY INTERPOLATION:
  Render other players at a past state (e.g., 100ms behind)
  Interpolate between two known positions for smooth movement
  Player sees slightly delayed but smooth other players

LAG COMPENSATION (HIT DETECTION):
  Server rewinds time by shooter's ping
  Checks if shot would have hit at the time the player fired
  → "Peeker's advantage" but fair to the shooter
```

### Acceptable Latency by Genre

| Genre | Max Acceptable Ping | Tick Rate | Notes |
|-------|-------------------|-----------|-------|
| Fighting | <60ms | 60Hz | Rollback netcode essential |
| FPS | <80ms | 64-128Hz | Client prediction + server auth |
| MOBA | <100ms | 30-60Hz | Input buffering acceptable |
| Racing | <100ms | 30-60Hz | Rubber-banding visible but ok |
| RPG/MMO | <200ms | 10-30Hz | Higher tolerance for non-combat |
| Turn-based | <1000ms | On demand | Async is fine |

## Step 4: Matchmaking

### Matchmaking System Design

```
QUEUE ENTRY:
  Player → [Skill Rating] + [Region] + [Preferences] → Queue

MATCHING ALGORITHM:
  1. Find players within ±[tolerance] skill rating
  2. Prioritize same-region for low latency
  3. Expand tolerance by +X every [Y] seconds in queue
  4. Balance teams by aggregate skill if team mode
  5. Consider party sizes — match parties against parties

SKILL RATING SYSTEMS:
  Elo:       Simple, good for 1v1 (chess-like)
  Glicko-2:  Better uncertainty handling, good for all
  TrueSkill: Microsoft's Bayesian, good for teams
  MMR+:      Custom composite (win rate + performance metrics)

QUEUE TIME vs MATCH QUALITY:
  0-30s:   Strict matching (±100 MMR)
  30-60s:  Relaxed matching (±200 MMR)
  60-120s: Wide matching (±400 MMR)
  120s+:   Any match + show warning
```

### Ranked System Template

```
RANKS:
  Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster

PROMOTION:
  Win X games at current rank → promote
  Promotion series at tier boundaries (optional)

DEMOTION PROTECTION:
  Shield games after promotion (3-5 games)
  Demotion only after Y losses at 0 points

SEASON STRUCTURE:
  Season length: 3 months
  Soft reset: MMR compressed toward median by 25%
  Season rewards: Based on peak rank achieved
```

## Step 5: Anti-Cheat & Security

### Cheat Prevention Layers

```
LAYER 1 — AUTHORITATIVE SERVER:
  Server validates all game state changes
  Clients send inputs only, never positions or health
  → Prevents speed hacks, teleports, god mode

LAYER 2 — INPUT VALIDATION:
  Server checks input plausibility
  Max movement speed, fire rate, action frequency
  Flag and investigate anomalies

LAYER 3 — CLIENT INTEGRITY:
  Memory protection (anti-tamper)
  File integrity checks
  Process monitoring

LAYER 4 — BEHAVIORAL DETECTION:
  Statistical analysis of player behavior
  Aim snap detection (inhuman accuracy patterns)
  Economy anomaly detection

LAYER 5 — SOCIAL ENFORCEMENT:
  Player reports → review queue
  Reputation system
  Tribunal / community moderation
```

### Common Cheats to Defend Against

| Cheat | Prevention |
|-------|-----------|
| **Wallhack** | Don't send hidden entity data to clients |
| **Aimbot** | Server-side aim pattern analysis |
| **Speed hack** | Server-side movement validation |
| **Duplication** | Authoritative server inventory |
| **DDoS** | Rate limiting, DDoS protection service |
| **Account sharing** | Device fingerprinting, behavioral analysis |

## Step 6: Social Features

### Social System Checklist

- [ ] **Friends list** — add, remove, block, online status
- [ ] **Party system** — invite, join, leave, party leader
- [ ] **Communication** — voice chat, text chat, ping system, emotes
- [ ] **Spectating** — watch friends or top players
- [ ] **Leaderboards** — global, friends, regional, seasonal
- [ ] **Clans/guilds** — create, manage, recruit, clan wars
- [ ] **Replay system** — record, share, highlight clips
- [ ] **Moderation tools** — mute, report, block, avoid player
- [ ] **Content sharing** — custom levels, skins, replays

### Toxicity Mitigation

| Strategy | Implementation |
|----------|---------------|
| **Default mute** | Strangers muted by default, opt-in to hear |
| **Ping system** | Structured communication without voice (Apex Legends) |
| **Positive reinforcement** | Honor/commend system for good behavior |
| **Escalating punishment** | Warning → mute → temp ban → perma ban |
| **AI chat filter** | Real-time toxicity detection in text |

## Output

Save to `artifacts/game-design/[project-name]-multiplayer.md`

## Guidelines

- **Design for the worst connection** — if it's fun at 150ms ping, it's great at 30ms
- **Never trust the client** — the server is the source of truth
- Start with the simplest networking model that works — complexity grows fast
- Social features make or break retention — players stay for friends
- Test with simulated lag from day one — don't wait for real players to find issues
- Cross-reference `/mechanics-design` to identify which mechanics are latency-sensitive
- Use `/game-testing` to plan multiplayer-specific test scenarios
