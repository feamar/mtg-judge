# ADR-0008: Deterministic decision graphs for rulings and investigations

Status: Proposed · Date: 2026-09-25 · Requirements: P2, D29 (see OQ-30), FR-INV-1..3, FR-Q-1..5, FR-RUL-1..9, FR-ESC-1..2, FR-POL-1..2, NFR-ACC-1, NFR-IMP-1, NFR-TONE-1

## Context

P2 asks for everything that can be deterministic to be deterministic. The golden scenarios fall into three groups:

- concept explanations, such as priority;
- known card interactions (Kinnan, Blood Moon, Silence, and so on);
- infraction disputes (One Ring, Wheel/Tithe).

None of them needs AI at run time once the answer has been worked out and approved at build time.

On 2026-09-25 the owner decided:

1. **The next investigation question is chosen deterministically** from the procedure and asked with **pre-written, approved wording**, as buttons or choices where possible. This changes D29 and FR-INV-2; OQ-30 asks the PM to revise the PRD text.
2. **A rules question not covered by the approved library** gets an AI answer, clearly marked, verified, and logged for the library.

## Options considered

1. **The AI reasons every case,** with procedures as prompt context. This was the first draft of this ADR. It is expensive, needs AI tests for everything, and "never skip a deciding fact" can't be guaranteed.
2. **Procedures decide; the AI chooses and words the next question** (D29 as written). It is still AI on every turn, for something that can be written once.
3. **Decision graphs decide everything; AI only at the edges (chosen).**

## Decision

**One structure for everything the judge can rule on:** a decision graph of `FactSpec`s and `Branch`es (ARCHITECTURE.md §3.1). There are two artifact kinds:

- **`RulingEntry`**, the approved rulings library for rules questions: *concept* entries (priority) and *interaction* entries (Kinnan + Selvala; Faerie Mastermind + Tithe + Bowmasters, whose branches depend on the active player and turn order);
- **`Procedure`**, one per framework per infraction (FR-INV-1), with penalty, fix, integrity signals, and stop rules added.

Everything in a graph is written in author sessions at build time and **approved by the owner** (OQ-27): facts, question wording, answer templates, short in-game answers, citation chains, fix steps, and delivery patterns.

**At run time:**

1. **Match** (ARCHITECTURE.md §5.2): the card resolver and lexicon find candidate entries or procedures. Several candidates give a choice question; none gives one `interpret` call, then another match.
2. **Facts:** `derived` facts are computed from their `derivedBy` rule. Other facts come from:
    - buttons, directly as `reported` facts from that seat;
    - typed answers, through a deterministic normaliser, and through `interpret` only if that fails, mapping onto the fact's options.

   A player's claim about the rules, the infraction, a count, or the remedy is kept as `Claim{assertion}` and never becomes a fact (FR-RUL-4).
3. **Candidates stay live in parallel** (FR-RUL-6). A candidate is dropped only when a fact contradicts every one of its branches.
4. **Next question:** among the decisive unknown facts of the live candidates (three-valued evaluation of the branch predicates), ask the one with the highest priority in its graph. On a tie, ask the one that splits the live branches most evenly. The question uses its approved wording, is addressed to its `askWho` role, and is logged with `whyItMatters` (FR-INV-2). Facts no branch needs are never asked (FR-INV-3).
5. **Guard:** a ruling is allowed only when exactly one branch is true and no decisive fact is unknown (FR-INV-2 AC). Disputes are handled per ARCHITECTURE.md §5.4.
6. **Compose:** fill the branch's approved template. Penalty from `PenaltyRow`, fix from the branch, delivery pattern from the branch (FR-POL-1, FR-POL-2).
7. **Library miss** (rules question, no entry): the `reason` fallback (ADR-0002) with retrieval (ADR-0005), the verifier, a visible marker, and a `LibraryMiss` record.

**Integrity** (FR-ESC-4, FR-RUL-7):

- procedures carry **integrity signals** as predicates over facts. For One Ring / Carpet of Flowers: a protection effect is invoked after its controller let a prohibited action go ahead. OQ-14 is the owner's list of signals;
- signals write only to staff-only notes and to the stop rule. The infraction branch is decided from game-action facts alone.

## Consequences

- **The same facts always give the same ruling** (NFR-IMP-1) by construction. The FR-INV-2 AC becomes a plain check on the case log.
- **Most cases make no AI call.** Tests of the library and procedure paths are ordinary deterministic tests (ADR-0013).
- **Tone (NFR-TONE-1)** is checked once per approved template, not per case.
- **Coverage becomes the main risk:** early on, many questions miss the library. The fallback path and the miss log turn misses into new entries.
- **The owner's review load grows** with the library. Entries are small, and most of the first ones come from cases the owner already validated (R12).
