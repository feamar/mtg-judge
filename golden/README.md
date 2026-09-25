# Golden test set

This set defines what a correct ruling is (PRD §8). Only the product owner can validate a case.

- `scenarios/`: judge-call scenarios, one file per case. `scenarios/INDEX.md` lists them.
- `concepts/`: concept models, such as priority, that scenarios refer to.

## Current state (2026-09-25)

- 18 scenarios, imported from the ChatGPT package. They haven't been converted to the structured format (PRD §8) yet.
- Validation status comes from `scenarios/INDEX.md`, which lists 11 as VALIDATED and 7 as SOURCE CHECK REQUIRED. The file `judge-what-is-priority.md` says it's validated, but the index says it isn't; this needs reconciling.
- None of the scenarios is tagged *easy* or *hard* yet, and none has been split into the development, regression, or held-out set.
