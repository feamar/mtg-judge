# ADR-0011: Cases are append-only event logs; catch-up on startup

Status: Accepted 2026-09-28 · Date: 2026-09-25 · Requirements: NFR-AVAIL-1, FR-LOG-1, NFR-VER-1, FR-RUL-6, FR-INV-2, FR-LOG-3

## Context

A ticket opened while the bot is down must be picked up when it comes back (NFR-AVAIL-1). A restart in the middle of a case must not lose the investigation. The record must hold the transcript, the facts, the procedure, the ruling, and the versions (FR-LOG-1). Investigation questions must be recorded together with their reasons (FR-INV-2).

## Decision

**1. Event-sourced cases.** A case is a sequence of `CaseEvent`s: `TicketDetected`, `MessageReceived`, `ClaimExtracted`, `FactEstablished`, `DisputeOpened`, `HypothesisUpdated`, `QuestionAsked`, `UnderstandingConfirmed`, `RulingComposed`, `VerificationResult`, `MessageSent`, `Escalated`, `InvestigationNoteWritten`, `CaseClosed`, and so on.

- The current state is a fold over the events, so the orchestrator itself holds no state.
- Every event records `systemVersion` (build SHA) and `bundleVersion` (NFR-VER-1). The FR-LOG-1 record is simply the log plus a projection over it.

**2. A per-case single-writer queue.** Incoming messages for one case are handled in order. Different cases run concurrently.

**3. Idempotency:**

- `MessageReceived` is keyed by the Discord message ID;
- each outbound `MessageSent` has a deterministic key, recorded *before* sending. After a crash, a message that was intended but not confirmed is checked against the channel history before it is sent again.

**4. Catch-up on startup** and after a gateway reconnect with a gap:

- For each event context, call `TicketSource.listOpen`.
- For a ticket without a case, start one with `TicketDetected{late: true}`. The greeting acknowledges the delay ("Sorry for the wait, players!"; the exact wording comes from the catalog, OQ-18).
- For a known open case, fetch the messages after the last `MessageReceived` ID and feed them in.
- Tickets closed while the bot was down are marked closed without posting.

**5. Idle handling:** a case waiting on players keeps waiting, with no timers (NG1 excludes round timers, not this). After a configurable silence, the judge posts one gentle nudge. Escalated cases wait for a human.

## Consequences

- Replaying a real case against a new engine version is possible in principle, but the product uses the golden set for version comparison (FR-LOG-3). The log is kept only 7 days (D39).
- Exporting a golden candidate is a projection of the log (pseudonymised: seats, not users).
- Scale-out (D31) means partitioning cases across workers by case ID. The single-writer rule holds per partition.
