# ADR-0008: Hybrid investigation engine

Status: Proposed · Date: 2026-09-25 · Requirements: D29, FR-INV-1..3, FR-RUL-1..9, FR-ESC-1..2, FR-POL-1, P2, NFR-ACC-1, NFR-IMP-1

## Context

D29 is fixed: build-time procedures define which facts decide each ruling branch. The AI forms hypotheses and chooses the next question that would change the outcome, then words it naturally. It must never skip a fact that decides the ruling, and it must not work through a fixed checklist either. Every question is recorded with its hypothesis and its reason.

## Options considered

1. **The AI decides everything; procedures are only prompt context.** Cheap to build, but "must not skip a deciding fact" can't be guaranteed or tested.
2. **Fixed questionnaires per infraction.** Deterministic, but it breaks FR-RUL-6 and FR-INV-2 (no checklist), and it's unnatural in multi-hypothesis cases.
3. **Decision graph plus deterministic guard plus AI selection (chosen).**

## Decision

**Procedure = a decision graph over facts,** produced at build time for each `(framework, infraction)` pair:

```
Procedure {
  procedureId, frameworkId, infractionId, sourceSectionIds[],
  facts:    FactSpec[]      // what can be known
  branches: Branch[]        // candidate outcomes
  stop:     StopRule[]      // e.g. integrity concern → stop questioning (FR-ESC-4)
}
FactSpec { factId, description(i18n key), valueType, askWho: role-expression,
           evidenceHint?: "stream the table" | ..., cheapToCollect: bool }
Branch   { branchId, when: Predicate over facts,   // e.g. stackBecameEmpty == false
           ruling, fixSteps[], penaltyRef, deliveryDefault, escalate?: reason,
           sourceSectionIds[] }
```

- `askWho` is a role expression, never a seat number. Examples: `controllerOf(trigger)`, `opponentFurthestFromActive(excluding: infractor)`, `activePlayer`, `allAtTable`. That's what makes the multiplayer rules (FR-INT-3's AC under the MTRA) data rather than code.
- **Rules questions** (FR-Q) don't need a procedure. They go straight to retrieval and the `reason` role, with the same citation and verifier rules.

**At run time, each turn works like this:**

1. **Understand** (AI, `understand` role): turn the new message into *claims*. Each claim gets its speaker's seat and an origin (FR-RUL-4). A player's claim about the rules, the infraction, a count, or the remedy is stored as `Claim{kind: assertion}`, never as a fact.
2. **Update facts** (deterministic): a claim becomes a `Fact{origin: reported}` when it is uncontradicted, or when it is confirmed by the other players it affects. Conflicting claims become a `Dispute{factId, versions[]}`. The engine writes `Fact{origin: derived}` from rules, card text, or arithmetic (for example, trigger counts from the number of opponents). `observed` facts come from evidence items (stream, photo; later, D31).
3. **Hypotheses** (AI proposes, engine maintains): a set of `{infractionId | rulesQuestion, procedureId, status: live|dropped, supportingFacts, contradictingFacts}`, which can include integrity hypotheses. Several stay live at once (FR-RUL-6). The AI may add or drop a hypothesis, but only by naming the facts that justify it.
4. **Candidate questions** (deterministic): for every live hypothesis, the engine evaluates each branch predicate under three-valued logic (true/false/unknown). The **decisive unknown facts** are those whose value would change the branch, the penalty, the fix, or the escalation decision. They are the only legal next questions, plus confirmations of disputed facts. This is also the FR-INV-3 guarantee: the engine never asks for game state no branch needs.
5. **Select and word** (AI, `investigate` role): from those candidates, choose the one that best splits the hypotheses, pick who to ask (evaluating `askWho` against the seating), and word it. The engine records `QuestionAsked{factId, hypothesisIds, whyItMatters, audience}`. Choosing a fact outside the candidate set is rejected.
6. **Guard** (deterministic): the engine allows a ruling only when, for the chosen hypothesis, exactly one branch evaluates to true with no unknown decisive facts (FR-INV-2 AC). If a decisive fact is disputed and can't be resolved (FR-RUL-2), the engine either rules on the agreed facts, when both versions select the same branch, or escalates (FR-ESC-1e).
7. **Confirm understanding** (FR-RUL-5): before any ruling that depends on reconstructing events, the engine emits a summary for the players to confirm: question, history, facts relied on. A correction goes back to step 1.
8. **Compose** (AI, `reason` role, structured output): a `Ruling` holding the decision, the `CitationChain[]` (source → proposition → consequence), and the explanation. The engine fills the **penalty from the penalty table** and the **fix from the branch**, never from the model (FR-POL-1).
9. **Verify** (deterministic; see ARCHITECTURE.md §5.6). On failure the engine retries once with the verifier's findings, then escalates, or returns `UNRESOLVED` (FR-RUL-9).

**Intent is kept separate** (FR-RUL-7): the infraction is chosen from game-action facts only. Integrity hypotheses read the same facts but write only to `InvestigationNote`s and to the escalation decision (ADR-0009).

**Confidence (FR-ESC-1a, OQ-7)** is computed from signals the engine can see, not from what the model says about itself:

- the guard passed;
- no disputed decisive facts;
- the verifier passed on the first attempt;
- retrieval did not fall back to lexical search only;
- the case category is not on the always-escalate list.

The model's own rating is recorded, but it can only *lower* confidence. The threshold and the list of always-escalate categories are configuration, waiting on OQ-7.

## Consequences

- The FR-INV-2 AC ("asked for each required fact before ruling") becomes a check on the case log, testable without a model.
- NFR-IMP-1 is helped structurally: facts are keyed by seat role, not by who said them, and the branch predicate doesn't care about wording or order.
- Procedure quality is now the critical build artifact. Procedures are AI-drafted from the IPG and addenda, then reviewed (OQ-27). The golden set is their main test.
- Cases that fit no procedure (novel disputes) still work: the hypothesis set stays on rules-question reasoning, and the ordinary escalation rules apply.
