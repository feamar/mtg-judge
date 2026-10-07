# AI MTG Judge: Vision

Imported 2026-10-05 from `mtg-judge/docs/PRD.md` v0.5 (code-and-specs start). Decisions keep their PRD ids and owners; new ones are marked (Frank, 2026-10-05).

## Problem
Online Discord tournaments wait 1–2 hours for a human judge; small in-person events have overloaded judges; players at home have none. (PRD §1)

## Users
Players, human judges, tournament organizers (TO), one global Admin (the product owner). Pilot user: the product owner. (PRD §3, D40)

## Core
An AI Magic: The Gathering judge in Discord that answers rules questions, rules on disputes with game fixes, and enforces policy (MTR, IPG, one addendum per event), handing off to a human judge on concrete triggers. Deterministic first, AI last (P2, D50). Teach first (P1). Impartial (P3). (PRD §1–2, D1)

## Features
| Feature | MVP |
| --- | --- |
| Discord bot, text input, cEDH, Competitive REL | MVP 1 (PRD §4) |
| Voice input, if spike S1 succeeds | MVP 1, droppable (D22) |
| Rules questions from the approved library; marked AI answer on a miss | MVP 1 (FR-Q, D50) |
| Disputes, game fixes, penalties up to a Warning; major infractions handed off | MVP 1 (D56) |
| Event context; frameworks MTRA (Notion) and plain MTR+IPG | MVP 1 (OQ-37, Frank 2026-09-28) |
| Ruling record, 7 days | MVP 1 (D39) |
| 1v1 constructed formats | none yet (Frank, 2026-10-05) |
| Regular REL (JAR) and casual play | none yet (Frank, 2026-10-05) |
| Phone app | none yet (Frank, 2026-10-05) |
| Penalty history across an event | none yet (Frank, 2026-10-05) |
| Languages other than English | none yet (Frank, 2026-10-05) |
| Photo, then webcam input | none yet (Frank, 2026-10-05) |
| Limited formats | none yet (Frank, 2026-10-05) |
| Portuguese Multiplayer Addendum | none yet (OQ-37, Frank 2026-09-28) |
| Event policies set by the TO (FR-CTX-5) | none yet (Frank, 2026-10-05) |
| Small in-person events | none yet (Frank, 2026-10-05) |
| More channels: WhatsApp, web | none yet (Frank, 2026-10-05) |

The PRD's rough order for the "none yet" features is kept as a note: the order above. (PRD §4)

## Constraints and quality levels
- Running cost under $20/month for the live bot; build and test on the Pro plan only (D14, D45).
- 100% of easy golden cases; up to ~2% escalated, with facts gathered (D12, D30).
- No invented citations; zero confidently wrong on messy input (NFR-ACC-3, NFR-ROB-1).
- GDPR: 7-day retention, pseudonymised text to the AI provider (NFR-PRIV-1, D44).
- Hand-offs happen on concrete triggers (D62) or an *unresolved* result; "uncertain" in D3 means exactly that, never a confidence score (Frank, 2026-10-05).
- The judge never invents a ruling, in any context, with or without a human judge available (FR-RUL-9). At home it returns *unresolved* with why. D35 is superseded. (Frank, 2026-10-05)
- Permanent non-goals: no event management (NG1), no Professional REL (NG3), no mixed frameworks (NG4).

## What the architecture must keep possible
| Later feature | Needs from the architecture |
| --- | --- |
| Other formats, RELs, frameworks, front ends, input types | All pluggable; no hard-coded player count, English, Discord or text-only pipeline (NFR-EXT-1, PRD §4) |
| More channels: WhatsApp, web | Front end behind a port (D31) |
| Photo, video, live-stream evidence | Non-text input path (D31) |
| Phone app running on-device or hybrid | Rules data shippable to a device (D31) |
| Penalty history across an event | A stable per-event player identity, kept apart from the pseudonymised text; retention set per event, not fixed at 7 days (Frank, 2026-10-05; review V5) |

Not kept possible: scaling to millions of users. The MVP's Discord bot doesn't scale that far and the architecture may rule it out. (Frank, 2026-10-05; narrows D31)
