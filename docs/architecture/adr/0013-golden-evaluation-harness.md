# ADR-0013: Golden cases are deterministic tests; only two small AI test sets

Status: Proposed · Date: 2026-09-25 · Requirements: §8, NFR-ACC-1..3, NFR-TONE-1, NFR-IMP-1, FR-POL-2, FR-INV-2, FR-ESC-4, FR-BUILD-3, D38, OQ-29

## Context

The golden set defines what a correct ruling is (§8). With the deterministic judge (ADR-0008), almost everything a golden case checks can be tested with no AI: matching, questions asked, branch, answer, penalty, fix, citations, and protected information. The owner asked for build and test to be cheap, and to run on the Pro plan only (ADR-0016).

## Decision

**1. Case format** (data in `golden/cases/*.yaml`, with a Markdown view generated from it):

```
GoldenCase { id, family, variantOf?, set: dev|regression|heldout, tag: easy|hard,
  validation: SOURCE_CHECK_REQUIRED|VALIDATED, origin, sourceVersions,
  eventContext: { framework, seats },
  input: { raw: Message[] /* as players would type it */,
           choices: { factId: value }   /* scripted button answers, per seat */ },
  expect: { match: entryId|procedureId|"library-miss", branchId?, answerKey?, penalty?, fixSteps?,
            deliveryPattern?, requiredCitations[], requiredQuestions[], forbiddenQuestions?[],
            escalate: bool|reason } }
```

**2. The deterministic suite** runs in CI on every commit, with **no AI**:

- the raw text goes through the deterministic matcher;
- scripted choices answer the questions the engine asks, by `factId`;
- the harness checks:
    - the match;
    - the questions asked (FR-INV-2 AC);
    - the branch, penalty, fix, delivery pattern, and citations;
    - that no player-audience message contains protected content (FR-ESC-4 AC);
    - that every citation resolves (NFR-ACC-3).

Variants (swapped reporter, order, wording) check NFR-IMP-1. A case whose raw text needs `interpret` to match is marked `needsInterpret` and moves to set 3a instead.

**3. Two small AI test sets.** These are the only model use in testing, and they run on the Pro plan (ADR-0016):

- **(a) `interpret` set:** free text in, expected structured mapping out. Graded exactly.
- **(b) `reason` fallback set:** rules questions with **no** library entry. Graded on:
    - citations resolving and staying within the retrieval set (deterministic);
    - the expected conclusion and required citations (deterministic where they can be expressed);
    - the owner reading the rest when they're run.

They are plain runs over tens of cases, done before a release or when a prompt or model changes. There's no caching, resuming, or case selection; those can be added if a run ever becomes slow.

**4. Held-out cases** measure what the library *can't* test itself on:

- the matcher's hit rate on unseen phrasings;
- the correctness of fallback answers on unseen questions.

The 18 current scenarios are the owner's real cases, and the AI roles have read them, so they become development and regression cases. New held-out cases are written by a separate **case author** role with the owner (answer to OQ-29), and stored outside this repository, for example in a private `mtg-judge-heldout` repository. Only the test run reads them, and it reports aggregates.

**5. Release gate** (FR-BUILD-3):

- 100% of validated *easy* cases pass the deterministic suite;
- the escalation behaviour on hard cases matches;
- no leaks;
- zero unresolvable citations;
- the AI sets are reported;
- the owner approves.

**6. Judge Lab evaluation contract** (bundle `judge-lab-testset-bundle/1.0`, imported 2026-09-28). Imported cases carry extra expectations beyond the ruling, stored under named fields keyed by the stable test id. They are an **evaluation contract, not an engine interface**:

- **`expect.disposition`:** the next action. It is one of answer (`RESOLVED`), ask for clarification, or hand off to a human. Stage expectations can also require asking for table confirmation.
- **`expect.integrityPolicy`:** permitted conduct, ordinary error (handled under a good-faith presumption), or strong indicators (a protected human review). A referral is never a finding of guilt.
- **`expect.handoff` and `expect.playerFacingMessage`:** the neutral player-facing wording is checked separately from the protected reasoning for the human judge. The protected part must never appear in player output (ADR-0009).
- **`input.applicationAuthority` and `expect.remedy`:** the bot may apply eligible simple backups and prescribed partial fixes, and must hand off every full backup.
- **`input.availableIntegritySettings` and `expect.stageExpectations`:** **run each such case once per available integrity setting.** The top-level expectation holds for the default setting; stage and setting expectations apply for the others.

A case fails if the ruling is right but the workflow is wrong: an unsupported cheating accusation, exposed protected reasoning, an unauthorised backup, or an unnecessary escalation of an ordinary mistake.

These fields are **test expectations about app workflow**. They are kept apart from the normative CR, IPG and MTR citations, and don't by themselves change the PRD.

## Consequences

- Almost all testing is free, fast, and repeatable.
- **Scenarios are also the material strategies are derived from** (ADR-0017). Each `AnswerStrategy` must reproduce every validated scenario in its `derivedFrom` list, and that check is part of the deterministic suite.
- A scenario a strategy was derived from will always pass, so it proves the encoding, not the reach. Reach is measured by **held-out scenarios with other cards and phrasings**, and by the live hit rate.
