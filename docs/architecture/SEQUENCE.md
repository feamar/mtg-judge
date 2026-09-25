# End-to-end sequence: one judge call

Status: Proposed · Date: 2026-09-25 · See [ARCHITECTURE.md](ARCHITECTURE.md) §5–6 and ADRs 0008–0011.

**Example:** a 4-player cEDH pod at an MTRA event. A player opens a ticket through the server's ticket bot: *"P2 says their One Ring trigger gives protection, but they let P3 target them earlier."* This follows the validated One Ring / Carpet of Flowers scenario. The rules content is illustrative; the sequence is the point.

```mermaid
sequenceDiagram
  autonumber
  actor P as Players (ticket)
  participant TB as Existing ticket bot
  participant DA as Discord adapter + TicketSource
  participant OR as Case orchestrator
  participant ST as CaseStore (event log)
  participant IE as Investigation engine
  participant KN as Knowledge (bundle)
  participant LLM as LlmPort
  participant VE as Verifier + Escalation policy
  participant OB as Outbox (audience guard)
  actor J as Judge-only channel

  P->>TB: Call a judge in the judge channel
  TB->>DA: Creates ticket container (channel or thread), adds reporter, judges, TO
  DA->>DA: TicketSource.matches() / parse() (waits for the description if "not-yet")
  DA->>OR: TicketDetected{containerRef, reporter, description}
  OR->>ST: append TicketDetected (systemVersion, bundleVersion)
  OR->>LLM: understand(description) [Haiku]
  LLM-->>OR: claims, card mentions, concepts, caseType=dispute
  OR->>KN: resolve cards ("The One Ring", "Carpet of Flowers"), hypotheses → procedures
  OR->>IE: open hypotheses: H1 Missed Trigger (MTRA procedure), H2 integrity (staff-only)
  OR->>OB: Table: greeting from catalog, acknowledging the ticket ("Players! I see there's a question about a trigger. What happened?")
  OB->>P: greeting

  loop Until the guard passes, or an escalation trigger fires
    P->>DA: message(s)
    DA->>OR: MessageReceived (author → seat)
    OR->>ST: append
    OR->>LLM: understand(message) [Haiku, player-safe projection]
    LLM-->>OR: claims (reported / assertion)
    OR->>IE: update facts, disputes, hypotheses
    IE->>KN: branch predicates, FactSpecs, askWho
    IE-->>OR: decisive unknown facts (candidates)
    alt candidates remain
      OR->>LLM: investigate(candidates, player-safe state) [Haiku]
      LLM-->>OR: chosen factId, addressee role, wording
      OR->>ST: append QuestionAsked{factId, hypIds, whyItMatters}
      OR->>OB: Table or PlayerPrivate: question
      OB->>P: question
    else integrity stop rule reached (H2)
      OR->>OB: Table: neutral catalog message "A human judge has been called, please pause the relevant actions"
      OR->>OB: Staff: handoff + InvestigationNotes
      OB->>J: handoff
      Note over OR: Case → Held → Escalated. Sequence ends here for this branch.
    end
  end

  OR->>OB: Table: "Here's how I understand it: … Is that right?" (FR-RUL-5)
  P->>OR: "Yes" (or a correction → back into the loop)
  OR->>KN: retrieve sections for the chosen branch (IDs, concept index, cross-refs)
  OR->>LLM: reason(branch, facts, retrieved sections) [Sonnet]
  LLM-->>OR: chain[source→proposition→consequence], explanation
  OR->>KN: PenaltyRow(MTRA, infraction), branch fix steps
  OR->>VE: verify(ruling)
  alt verifier passes and no FR-ESC-1 trigger
    OR->>LLM: phrase(ruling, deliveryPattern, depth=in-game minimum) [Haiku]
    LLM-->>OR: player-facing text
    OR->>OB: lint → Table: ruling + fix steps + citations (penalty labelled as base)
    OB->>P: ruling
    OR->>OB: Staff: penalty copy (FR-POL-3)
    OB->>J: penalty copy
  else verifier fails twice / unresolved / trigger (a)(b)(e)
    OR->>IE: collect remaining cheap facts (FR-ESC-2)
    OR->>OB: Table: FR-ESC-5 catalog message; Staff: Handoff{summary, facts, disputes, citations, provisional reading, reason}
    OB->>J: handoff
  end
  OR->>ST: append RulingComposed / VerificationResult / MessageSent / Escalated
  opt a player contests (FR-ESC-1c)
    P->>OR: "That's wrong"
    OR->>OB: Table: "Would you like me to call a human judge to review this?"
    P->>OR: "Yes" → Escalated, handoff to J
  end
  TB->>DA: Ticket closed/archived
  DA->>OR: TicketClosed
  OR->>ST: append CaseClosed (retention clock: +7 days, D39)
```

## Notes

- **The record (FR-LOG-1)** is the event log from `TicketDetected` to `CaseClosed`. Every event carries `systemVersion` and `bundleVersion`. Judges and the TO can read the record with `/judge case <id>` (FR-LOG-2). Within 7 days, `/judge export <id>` produces a pseudonymised golden candidate marked SOURCE CHECK REQUIRED (FR-LOG-3).
- **Outage in the middle of the sequence:** if the bot restarts after step 12, catch-up (ADR-0011) replays the log, fetches any messages after the last recorded ID, and continues at the loop.
- **Latency (NFR-LAT-1):** Haiku turns run in single-digit seconds. The Sonnet `reason` step is the slow one, so the adapter shows Discord's typing indicator throughout. Spike S3 measures the real numbers.
- **Rules-question variant:** a single player asks "Judge, what is priority?" The flow is TicketDetected → understand (caseType=rulesQuestion) → retrieval (concept `priority`, CR 117.x, approved mnemonic) → reason + verify → a direct answer with no greeting (P3) and minimal in-game depth (FR-Q-5) → Delivered.
