# ADR-0013: Golden evaluation harness with a constrained player simulator

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

2. **Player simulator.** In the `eval` package only, a model plays the players, and each simulated player sees only its own `perSeatKnowledge` and the fact sheet. It answers what it is asked and nothing else. Any answer is checked against the fact sheet; an invented fact fails the *run*, not the judge. Cases with no investigation (pure rules questions) run with no simulator.
3. **Graders, deterministic first:**
    - penalty, branch, and escalation are compared exactly;
    - required citations are checked by set inclusion;
    - required facts are checked on the case log (FR-INV-2 AC);
    - no player-audience message may contain protected content (FR-ESC-4 AC);
    - every citation must resolve in the bundle (NFR-ACC-3);
    - the delivery pattern must match (FR-POL-2 AC).

   Only the free-text parts, the explanation and the tone (NFR-TONE-1), use a model grader with a written rubric (OQ-18). Model grades are reported but never override a deterministic failure.
4. **Variants for impartiality** (NFR-IMP-1): the harness generates swaps (reporting seat, order of events, wording paraphrase). All must reach the same branch.
5. **Sets are kept apart physically.** Held-out cases live outside the repository that AI roles work in. They are opened only by the eval runner at release time, and their results are reported as aggregates.
6. **Cost:** turns across cases run in lockstep through the Batch API (turn 1 of every case in one batch, then turn 2, …), at 50% off. Retrieval-recall and deterministic checks run in CI for free on every commit.
7. **Release gate** (FR-BUILD-3):
    - 100% of *validated easy* cases pass;
    - escalation behaviour on hard cases matches;
    - no protected-information leaks;
    - zero unresolvable citations;
    - then the product owner approves.

## Consequences

- AI roles have now read all 18 current scenarios, so none of them can be truly held out from those roles. OQ-29 asks how to form the held-out set.
- Validating the simulator itself matters: each run keeps the full simulated transcript for inspection.
