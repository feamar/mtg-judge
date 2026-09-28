# ADR-0009: Typed audiences and prompt segregation for protected information

Status: Proposed · Date: 2026-09-25 · Requirements: FR-ESC-4, FR-ESC-3, FR-INT-3, FR-RUL-8, D6, D9, FR-LOG-2

## Context

- FR-ESC-4's AC is absolute: with a suspected Cheating case, no message in any player channel or DM may contain the suspicion or its reasoning.
- Players must not get information they aren't entitled to (FR-RUL-8).
- Private messages may be used to investigate, never to resolve (FR-INT-3).

A prompt instruction such as "don't mention cheating" is not a guarantee.

## Decision

1. **Every outbound message has a typed audience:**
    - `Table(caseId)`: the ticket thread, seen by the players and the event's judges and TO;
    - `PlayerPrivate(caseId, seat)`: a DM;
    - `Staff(eventId)`: the judge-only channel.

   The `Outbox` refuses any message whose audience doesn't match its content type.
2. **Content types are separated in the domain model.**
    - `InvestigationNote`, `IntegrityHypothesis`, `EscalationRationale`, and `ProvisionalReading` can only be rendered to `Staff`.
    - `Remedy` and `Ruling` can only be rendered to `Table` (FR-INT-3, D9). The engine can't produce a DM containing a remedy step.
    - `InvestigationQuestion` may go to `Table` or `PlayerPrivate`.
3. **Fixed templates and prompt segregation.**
    - Almost all player-facing text is an approved template (ADR-0008), so it can't contain a suspicion.
    - The two AI roles (`interpret`, `reason`) get only a *player-safe projection* of the case, with no integrity signals, notes, or rationale. The only AI that ever writes text for players (the `reason` fallback) never sees the suspicion, so it can't leak it.
4. **Stop rule** (FR-ESC-4): when an integrity hypothesis reaches the procedure's stop threshold, the engine freezes questioning. It sends the neutral "a human judge has been called, please don't continue the relevant game actions" message, which is a fixed catalog template and not generated. It then posts the handoff with the notes to `Staff`. The player message is the owner's neutral handoff message (ADR-0022 §5).
5. **Output lint (defence in depth):** before sending to `Table` or `PlayerPrivate`, a deterministic check:
    - scans for protected terms from a locale list (for example cheating, intent, suspicion, lying);
    - scans for any seat's hidden-zone contents, when the case marks those as hidden from the recipient.

   A hit blocks the message and escalates the case.
6. **Hidden information inside a remedy** (for example the MTRA Hidden Card Error) is carried out as instructions at the table ("show the set only to P3; P3 chooses; please don't discuss the choice"). The judge never asks for or relays the hidden cards itself.

**7. Major infractions** (ADR-0021): the penalty recommendation for anything more severe than a Warning is a `Staff`-only content type, like investigation notes. Players only get the neutral handoff template.

## Consequences

- The FR-ESC-4 AC can be tested by inspecting every `Table` and `PlayerPrivate` message in a golden replay.
- Wording that is neutral but awkward is better than a leak. The fixed templates for "please wait for a judge" are reviewed under the tone rubric (OQ-18).
- **DM fallback:** if a player has closed DMs, the engine asks the question in the thread instead, unless the procedure marks it `privateOnly`. In that case it escalates.
