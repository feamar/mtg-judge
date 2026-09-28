# End-to-end sequence: one judge call

Status: Proposed · Date: 2026-09-25 · See [ARCHITECTURE.md](ARCHITECTURE.md) §5–6 and ADRs 0008–0011.

**Example:** a 4-player cEDH pod at an MTRA event. A player opens a ticket through Tickets: *"P2 says their One Ring trigger gives protection, but they let P3 target them earlier with Carpet of Flowers."* This follows the validated One Ring / Carpet of Flowers scenario. The rules content is illustrative; the sequence is the point.

AI calls are marked **[AI]**. Everything else is deterministic.

```mermaid
sequenceDiagram
  autonumber
  actor P as Players (ticket thread)
  participant TB as Tickets (thread mode)
  participant DA as Discord adapter + TicketSource
  participant OR as Case orchestrator
  participant ST as CaseStore (event log)
  participant MA as Matcher
  participant EN as Decision-graph engine
  participant KN as Knowledge bundle
  participant LLM as LlmPort (AI edge)
  participant OB as Outbox (audience guard)
  actor J as Judge-only channel

  P->>TB: Open a ticket from the panel (optional form: description)
  TB->>DA: Private thread under the panel channel; judge bot added via Mention On Open
  DA->>OR: TicketDetected{thread, reporter, description}
  OR->>ST: append TicketDetected (systemVersion, bundleVersion)
  OR->>MA: match(description)
  MA->>KN: card resolver: "One Ring" → The One Ring, "Carpet of Flowers" → Carpet of Flowers
  MA->>KN: lexicon: "trigger", "protection", "let … target" → infraction trigger Missed Trigger
  MA-->>OR: dispute; candidate: Procedure(MTRA, Missed Trigger)
  opt nothing matched
    OR->>LLM: [AI] interpret(description, player-safe) → closed-list mapping
    LLM-->>OR: cards / concepts / infraction or "none"
  end
  OR->>OB: Table: greeting template ("Players! I see there's a question about a missed trigger. …")
  OB->>P: greeting

  loop Until the guard passes, or an escalation trigger fires
    OR->>EN: live candidates + known facts
    EN->>KN: branch predicates, FactSpecs
    EN-->>OR: next decisive fact (priority order, then best split)
    OR->>ST: append QuestionAsked{factId, whyItMatters, askedSeat}
    OR->>OB: Table (or PlayerPrivate): approved question + buttons, e.g. "P2, did you point out The One Ring's trigger when it happened? [Yes] [No]"
    OB->>P: question
    P->>DA: taps a button (or types an answer)
    DA->>OR: Choice(factId, value, seat) or text
    opt typed text the normaliser can't map
      OR->>LLM: [AI] interpret(text, options of this fact)
    end
    OR->>EN: Fact{reported, bySeat}; check integrity signals
    alt integrity stop rule reached
      OR->>OB: Table: neutral handoff message "Please pause the game and call a human Judge. Keep the current game state unchanged until they arrive."
      OR->>OB: Staff: handoff + investigation notes (from procedure signals)
      OB->>J: handoff
      Note over OR: Held → Escalated. The sequence ends here for this branch.
    end
  end

  OR->>OB: Table: confirmation template listing the established facts [That's right] [Something's wrong]
  P->>OR: [That's right]
  OR->>KN: branch answer template, citation chain, PenaltyRow(MTRA, Missed Trigger), fix steps
  OR->>OR: verifier (facts established, penalty = table, citations resolve, lint)
  OR->>OB: Table: ruling + fix + citations (penalty labelled "base, assuming no earlier infractions") [Why?] [Ask a human judge]
  OB->>P: ruling
  OR->>OB: Staff: penalty copy (FR-POL-3)
  OB->>J: penalty copy
  OR->>ST: append RulingComposed / MessageSent
  opt player taps [Ask a human judge] (FR-ESC-1c)
    OR->>OB: Staff: handoff; Table: FR-ESC-5 template
    OB->>J: handoff
  end
  TB->>DA: Ticket closed (thread archived; may be reopened)
  DA->>OR: TicketClosed
  OR->>ST: append CaseClosed (retention clock: +7 days, D39)
```

## Notes

- **AI calls in this example: none,** unless the description or a typed answer can't be matched.
- **Rules-question variant, library hit:**
    - "Judge, what is priority?": the lexicon gives concept `priority`, which matches its `RulingEntry`;
    - the approved short answer comes back with no greeting (P3) and minimal in-game depth (FR-Q-5), plus [Why?] and [Ask a human judge]. No AI.
- **Rules-question variant, library miss:**
    - the cards resolve, but no entry covers them;
    - retrieval (ADR-0005) feeds **[AI] `reason`**, the verifier runs, and the answer goes out with the "not yet reviewed" marker;
    - a `LibraryMiss` is logged. If the verifier fails, the result is `UNRESOLVED` and the case is escalated (FR-RUL-9).
- **The record (FR-LOG-1)** is the event log. `/judge case <id>` reads it (FR-LOG-2). `/judge export <id>` gives a pseudonymised golden candidate (FR-LOG-3).
- **Outage in the middle of a case:** catch-up replays the log and resumes at the pending question (ADR-0011).
