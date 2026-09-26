# Golden test set

This set defines what a correct ruling is (PRD §8). Only the product owner can validate a case.

- `scenarios/`: judge-call scenarios, one file per case. `scenarios/INDEX.md` lists them.
- `concepts/`: concept models, such as priority, that scenarios refer to.

## Current state (2026-09-26)

- 20 scenarios. 18 were imported from the ChatGPT package. Two were added on 2026-09-26 from the product owner's questions and validated by him: Deflecting Swat / Necropotence, and Pact of Negation / uncounterable spell. None has been converted to the structured format (PRD §8, ADR-0013) yet.
- **Citations checked against the CR of 2026-09-25:** the product owner considers the CR citations in the existing scenarios checked against the Comprehensive Rules effective 2026-09-25 (decision of 2026-09-26). This does not change any scenario's validation status.
- Validation status comes from `scenarios/INDEX.md`, which lists 13 as VALIDATED and 7 as SOURCE CHECK REQUIRED. The file `judge-what-is-priority.md` says it's validated, but the index says it isn't; this needs reconciling.
- None of the scenarios is tagged *easy* or *hard* yet, and none has been split into the development, regression, or held-out set.
