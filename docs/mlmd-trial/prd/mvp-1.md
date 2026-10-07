# MVP 1: Discord judge for online cEDH at Competitive REL

Filled 2026-10-06 from `mtg-judge/docs/PRD.md` v0.5 §4–8 (code-and-specs start).

## What it is for
A full judge in Discord for online cEDH tournaments at Competitive REL: rules questions, disputes with game fixes, penalties up to a Warning, and handoff to a human judge. (PRD §4)

**What result would be a no:** any incorrect ruling in the pilot. An *unresolved* result or a handoff is not an incorrect ruling (FR-RUL-9). (Frank, 2026-10-06)

## Behaviors
Next session: one behavior per PRD §6 requirement with contract, Failure and Edges, applying the decisions below; FR-CTX-5 and FR-CTX-2's 1v1 fallback are left out (not MVP 1).

## Decisions
| Decision | Who, when |
| --- | --- |
| MVP 1 keeps the PRD's full scope: the minimum viable product is a full product. The work is split into build batches to keep the overview (phase 4), not into smaller MVPs. | Frank, 2026-10-06 |
| Verdict: MVP 1 is a no if any ruling in the pilot is incorrect. | Frank, 2026-10-06 |
| On a server with no event context, an answer the bot can't settle is not escalated: the bot says so, explains why, suggests asking a human judge, and logs a library miss. | Frank, 2026-10-06 |
| *Unresolved* arises only for infractions and for fixing an illegal game state; the rules always settle a pure rules question. Play at home is JAR only; everywhere else a judge is available. | Frank, 2026-10-06 |
| A library miss whose AI answer the verifier can't confirm is not *unresolved*: the bot says it can't give a verified answer yet, hands off to the judge-only channel in a tournament or suggests a human judge elsewhere, and logs a library miss. It doesn't count as an incorrect ruling. Replaces FR-Q-6's "unresolved and escalated". | Frank, 2026-10-06 |

## Confirmed mlmd decisions
| Decision | Who, when |
| --- | --- |
| An *unresolved* result or a handoff is not an incorrect ruling for the verdict. | mlmd, confirmed by Frank 2026-10-06 |
| FR-CTX-2's 1v1 fallback is left out of MVP 1 (1v1 is "none yet"). | mlmd, confirmed by Frank 2026-10-06 |
