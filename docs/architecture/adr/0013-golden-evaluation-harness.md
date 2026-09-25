# ADR-0013: Golden evaluation harness with scripted players

Status: Proposed · Date: 2026-09-25 · Requirements: §8, NFR-ACC-1..3, NFR-TONE-1, NFR-IMP-1, FR-POL-2, FR-INV-2, FR-ESC-4, FR-BUILD-3, D38, OQ-11, OQ-29

## Context

The golden set is the definition of correct and the release gate (§8). Cases are multi-turn investigations, so replaying one needs *someone* to answer the judge's questions. Around 1,000 cases (D38) must be replayable at an acceptable build-and-eval cost.

## Decision

1. **Structured case format** (PRD §8), as data in `golden/cases/*.yaml`, with a Markdown view generated from it:

```
GoldenCase { id, family, variantOf?, set: dev|regression|heldout, tag: easy|hard,
  validation: SOURCE_CHECK_REQUIRED|VALIDATED, origin, sourceVersions,
  eventContext: { framework, rel, format, seats: n },
  script: { opening: Message[], factSheet: { factId: value | "unknown-to-P2" }[], perSeatKnowledge },
  expect: { caseType, infractionId?, branchId?, ruling, fixSteps[], penalty?, deliveryPattern?,
            requiredCitations[], requiredFacts[], forbiddenQuestions?[], escalate: bool|reason,
            chain: {source, proposition, consequence}[], tone: rubricId } }
```

2. **Scripted player answers, with no model.**
    - The engine records every question as `QuestionAsked{factId, askedSeat}` (ADR-0008). The harness answers from the case's fact sheet, using that seat's `perSeatKnowledge` and an answer template from the locale catalog. For example, `stackBecameEmpty = false` becomes "No, the stack never became empty".
    - A question for a fact the case doesn't script is answered "I don't know", and the question is recorded as a finding. It often signals a procedure asking for something it doesn't need (FR-INV-3).
    - Confirmation steps (FR-RUL-5) are answered "yes", unless the case scripts a correction.
    - Cases may add scripted free-text messages at set turns, for example the Carpet of Flowers explanation.
    - An optional model-played simulator exists only for exploratory testing. It is never used in the release gate.
3. **Graders, deterministic first:**
    - penalty, branch, and escalation are compared exactly;
    - required citations are checked by set inclusion;
    - required facts are checked on the case log (FR-INV-2 AC);
    - no player-audience message may contain protected content (FR-ESC-4 AC);
    - every citation must resolve in the bundle (NFR-ACC-3);
    - the delivery pattern must match (FR-POL-2 AC).

   Only the free-text parts, the explanation and the tone (NFR-TONE-1), use a model grader with a written rubric (OQ-18). Model grades are reported but never override a deterministic failure.
4. **Variants for impartiality** (NFR-IMP-1): the harness generates swaps (reporting seat, order of events, wording paraphrase). All must reach the same branch.
5. **Sets are kept apart physically.** The 18 current scenarios are real cases the owner judged; ChatGPT wrote them down. They become the development and regression sets. The owner will write the rest with Claude (answer to OQ-29, 2026-09-25). To keep a held-out set possible:
    - **Case author** is its own AI role, working in separate sessions whose only job is writing golden cases with the owner.
    - Cases the owner marks held-out are saved to a **separate private location**, for example a private `mtg-judge-heldout` repository or a folder outside this repo. It is never opened in architect, planner, engineer, or QA sessions.
    - The eval runner reads that location only at release time, and reports held-out results as aggregates (pass rate, failing case IDs), never case contents.
    - Development and regression cases are written in this repository as normal.
6. **Cost:** there is no paid spend; replays use the Pro subscription (ADR-0016). The levers below keep runs small enough for its usage limits. ARCHITECTURE.md §9.1 has the details.
    - **Response cache:** every eval model call is keyed by a hash of (model, prompt version, exact input). Unchanged calls replay their recorded response at $0, so a change re-runs only the calls downstream of it.
    - **Affected-case selection:** a bundle change selects the cases citing changed sections, cards, or procedures; a prompt change re-runs that role's calls only. A full uncached replay is needed only when the model or the provider changes.
    - **Subscription route:** uncached calls go through the eval-only subscription adapter, on the owner's Pro plan with no paid API spend (ADR-0016). The runner is resumable and works within the plan's usage limits.
    - **Model grading only for tone,** on a 10% sample plus every failure.
    - **CI:** retrieval-recall and deterministic checks run free on every commit.
    - **Consistency:** because the cache makes replays deterministic, a small uncached sample (for example 5% of cases, run 3 times) runs at each release to catch variation from the model itself.
7. **Release gate** (FR-BUILD-3):
    - 100% of *validated easy* cases pass;
    - escalation behaviour on hard cases matches;
    - no protected-information leaks;
    - zero unresolvable citations;
    - then the product owner approves.

## Consequences

- The 18 current scenarios can't be held out, because the AI roles have read them. The held-out set is formed from new cases, as described in point 5.
- Golden cases must script every fact their procedure can ask for. The case author role checks this against the procedure's `FactSpec`s when a case is written.
- Each run keeps the full transcript for inspection.
