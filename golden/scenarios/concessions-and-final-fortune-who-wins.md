# Two opponents concede at instant speed, the last loses to Final Fortune: who wins?

**Status:** SOURCE CHECK REQUIRED (proposed by the architect, 2026-09-27)

**Origin:** the product owner's scenario `SCN:` of 2026-09-27.

## Judge call

> What happens if two of my opponents scooped at instant speed and the last one died to Final Fortune. Who wins?

The opening already contains a question, so narration is skipped (ADR-0019). The judge still **reads back** its understanding before ruling (FR-RUL-5): *"So: P2 and P3 conceded during the game, not on their own turn; P4 cast Final Fortune and lost at the beginning of the extra turn's end step; you are the only player left. Is that right?"*

## Proposed ruling

**The game: the asker wins.**

- A conceding player leaves the game immediately and loses (CR 104.3a).
- Final Fortune gives its caster an extra turn, and at the beginning of that turn's end step they lose the game (Oracle).
- When the last opponent has left the game, the remaining player wins immediately; this overrides effects that would stop them winning (CR 104.2a).

**Tournament policy (MTRA 2.5):** players are expected to concede on their own turn, while they have priority, with an empty stack. A player who concedes at any other time **is dropped from the event**, and must talk to the tournament organizer to re-enter. The two players who conceded "at instant speed" are dropped, unless it was in fact their own turn with priority and an empty stack (variant c).

The judge states the game result and the MTRA consequence. It doesn't compute points or standings (NG1, FR-CTX-3).

## Deciding facts

| Fact | Why it decides |
| --- | --- |
| **The order of events:** both concessions before the Final Fortune loss, and the asker is still in the game | CR 104.2a: the asker wins when the last opponent leaves |
| **When each player conceded** (their own turn, with priority, empty stack?) | MTRA 2.5: dropped from the event, or not |
| **Framework** | MTRA 2.5 applies only at MTRA events |
| **Was anything offered or agreed in exchange for the concessions?** | If so, IPG 4.4 Bribery and Wagering (Match Loss): escalate to a human judge (variant b) |

## Open points for the owner

1. Should the judge ask the neutral question *"Was anything discussed or agreed before the concessions?"* in **every** case with several concessions, or only when there are other signals (OQ-14)? The question must never reveal a suspicion (FR-ESC-4).
2. Does the owner's league apply MTRA 2.5's drop strictly to concessions "in response" (at instant speed)?

## Normative sources (checked 2026-09-27)

- **Final Fortune, current Oracle text:** take an extra turn after this one; at the beginning of that turn's end step, you lose the game.
- **CR 104.3a:** a player can concede at any time, leaves the game immediately, and loses.
- **CR 104.2a:** a player still in the game wins if all their opponents have left the game; this happens immediately and overrides effects that would stop them winning.
- **MTRA 2.5 Conceding** (sources/addenda/mtra-2025-06-24.md).
- **IPG 4.4 Unsporting Conduct — Bribery and Wagering:** Match Loss; an incentive offered or accepted to entice a concession, draw, or result change. Read from blogs.magicjudges.org on 2026-09-27.
- *Checked and not applicable:* **IPG 4.3 Improperly Determining a Winner** covers methods outside the game (for example, dice), not concessions.

## Test significance

- **Skipping narration and reading back** when the opening already asks a question.
- **Multiplayer win condition:** a win by all opponents leaving, not by damage.
- **Game rules vs event policy:** the game result (CR) and the drop from the event (MTRA) are separate answers.
- **NG1:** no points or standings are computed.
- **Integrity:** a neutral question, and escalation if an incentive was involved.
