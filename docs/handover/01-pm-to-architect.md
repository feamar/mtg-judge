# Handover: PM → Architect

Date: 2026-09-25 · From: PM role (Claude) · To: Architect role · Approver: Frank (product owner)

## Your role

You are the **architect** of the AI MTG Judge. You turn the PRD into a technical design that a planner can break into tasks and an engineer can build. You do **not** change requirements. If a requirement looks wrong, contradictory, or impossible within its constraints, raise it as an open question for the product owner and propose options.

## Read first, in this order

1. `AGENTS.md`: the binding working rules.
2. `docs/PRD.md`: the master requirements. Pay special attention to:
    - the principles P1–P3, especially **P2: deterministic first, AI last, spend at build time**;
    - §4 scope and non-goals;
    - §6 the functional requirements;
    - §7 the non-functional requirements.
3. `golden/`: the scenarios that define what a correct ruling is.
4. `sources/`: the normative documents and the MTRA transcript.
5. `docs/reference/chatgpt-2026-09-22/ARCHITECTURE.md` and `RULES.md`: earlier design thinking. Treat them as input, not as decisions.

## Constraints that drive the design

- **Cost:** under $20 a month at 50–100 cases a week, or roughly $0.05–0.10 per case for everything (NFR-COST-1).
- **Availability:** runs around the clock. A ticket opened during an outage must be picked up afterwards (NFR-AVAIL-1).
- **Accuracy:** 100% of golden cases tagged *easy*; no invented citations; "unresolved" is a valid result (NFR-ACC, FR-RUL-9).
- **Discord integration:** the judge joins threads created by the server's **existing ticket bot**. It never creates tickets itself, and ticket detection must be pluggable (FR-INT-1, OQ-21).
- **Multiplayer from day one:** cEDH, one policy framework per event. Nothing may assume two players.
- **Must not be ruled out later:** the phone app, WhatsApp, photo and video input, on-device inference, other languages, and very large scale (D31).
- **Technology:** you choose the language and the AI provider (NFR-TECH-1, D41). The provider must be replaceable.
- **Data:** case records are deleted after 7 days; the EU and GDPR apply (D39, NFR-PRIV-1).

## Deliverables (put them in `docs/architecture/`)

1. **`ARCHITECTURE.md`**, covering:
    - the components and their responsibilities;
    - the data model (event context, case, fact with its origin, procedure, penalty table, golden case);
    - the build pipeline versus the runtime;
    - how the hybrid investigation works (D29);
    - handoff and protected information;
    - hosting and deployment;
    - a cost model at pilot volume.
2. **Architecture Decision Records** in `docs/architecture/adr/`: one ADR per significant choice (language, AI provider, hosting, storage, retrieval approach, card-data source OQ-5, and so on), each with the options considered and why this one was picked.
3. **An end-to-end sequence** of one judge call: ticket thread → investigation → ruling or handoff → record.
4. **A plan for three technical spikes**, each with its question, method, pass/fail criteria, and time box. Plan them; don't run them yet:
    - **Voice in Discord** (FR-VOICE-1, R4).
    - **Ticket bot integration**: detect and join the existing bot's threads (OQ-21).
    - **Cost per case**: one realistic cEDH case, run end to end, measured against NFR-COST-1.
5. **Traceability:** a table mapping every FR and NFR to the component(s) that satisfy it.
6. **Open questions** for the product owner, added to PRD §12 as new OQ numbers on a branch. Don't answer them yourself.

## Assumed default (to be confirmed by the product owner)

- **OQ-20:** an event selects **zero or one** addendum (for example the MTRA or the Portuguese Multiplayer Addendum). That addendum may amend the MTR, the IPG, or both.

## Out of scope for this phase

- Writing production code. Spike code comes later, after the spike plan is approved.
- Changing the PRD's requirements. You may only add open questions.
- Building the golden set.

## Approval gate

Work on a branch (`arch/v1`) and open a pull request. The product owner reviews the PR. The architecture phase ends only when he merges it. After that, the next role (planner) starts from the merged `main`.
