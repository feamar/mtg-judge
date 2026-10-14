# Golden test set

This set defines what a correct ruling is (PRD §8). Only the product owner can validate a case.

- `cases/`: **the structured test cases**, one YAML file per case, following [`schema/golden-case.schema.json`](schema/golden-case.schema.json) (ADR-0013). These are what the deterministic test suite will run.
- `scenarios/`: the narrative view of each case (Markdown), with the full source → proposition → consequence chain. `scenarios/INDEX.md` lists them.
- `concepts/`: concept models, such as priority, that scenarios refer to.
- `schema/`: the case schema.
- `import/`: source files imported as-is (lossless), such as `judge-lab-regression-100.jsonl` and `judge-lab-architecture-testset.json` (the latter also holds the bundle's integrity-settings and remedy-authority metadata).
- `tools/`: deterministic import scripts. `tools/import-judge-lab.mjs` converts Judge Lab JSONL into `cases/` and checks every CR citation against a given CR edition. `tools/import-judge-lab-bundle.mjs` does the same for Judge Lab test bundles (upsert by id). Re-run them rather than hand-editing imported cases.

## Case format in short

Each case holds:

- `input.raw`: what players type;
- `input.cards`: the cards the resolver must find;
- `input.choices`: scripted answers to the judge's questions, by fact id;
- `expect`: the expected result:
    - kind, intent, and answer;
    - the deciding facts;
    - the infraction, penalty, fix, and delivery pattern where relevant;
    - the required citations (`CR:x`, `IPG:x`, `MTR:x`, `Oracle:<card>`, `Ruling:<card>@<date>`);
    - the required and forbidden questions;
    - behaviours that fail the case (`mustNot`);
    - whether it escalates;
- `validation.openPoints`: what the owner still has to confirm;
- `tagProposed`: the architect's easy/hard proposal. Only the owner sets `tag`.

## Current state (2026-09-26)

- **348 cases.**
    - **207 Judge Lab expansion cases** (`expansion-cr-101..202`, `expansion-pol-001..055`, `expansion-hard-*`), imported on 2026-09-28 from `judge-lab-architecture-testset.json` (bundle schema 1.0). The owner stated he verified all 207, so they are marked **VALIDATED**; the bundle's own records said "draft for owner review, sources SOURCE CHECK REQUIRED", which is kept in each case's note. All their CR citations exist in the CR of 2026-09-25 (checked by the importer). Formats: 106 Legacy (1v1, post-MVP), 93 cEDH, 7 general, 1 multiplayer. Dispositions: 189 resolved, 13 need clarification, 5 hand off to a human. 38 carry integrity-mode expectations. The owner's "Hard" bucket is kept as `tag: hard` (50 cases).
    - **100 Judge Lab regression cases** (`judge-lab-cr-001` … `judge-lab-cr-100`): general Comprehensive Rules questions, imported on 2026-09-26 from the owner's `judge-lab-regression-100.jsonl`. The owner marked all 100 **fully VALIDATED**, including their source mappings (2026-09-26). The file itself recorded 98 as "ruling accepted, sources SOURCE CHECK REQUIRED". Every one of their 231 CR citations exists in the CR of 2026-09-25 (checked by the importer). Format `any`, REL not material; no easy/hard tag yet.
    - The 20 converted scenarios.
    - 10 AI-drafted targeting variants (`tc-01` … `tc-10`), VALIDATED 2026-09-28.
    - Owner scenarios given as `SCN:` prompts (from 2026-09-27): `scn-001a..f` (card accidentally shuffled into the library): a–c VALIDATED by the owner, d–f VALIDATED; `scn-002a..d` (concessions and Final Fortune: who wins): all VALIDATED.
    - One narration-intake example (`intake-01`), VALIDATED 2026-09-28.
    - Of the 20 scenarios, 18 came from the ChatGPT package and 2 from the owner's own questions of 2026-09-26.
- **Validation:** all 348 cases VALIDATED. On 2026-09-28 the owner said to consider every drafted case validated (the 5 open scenarios, the `tc` family, `scn-001d..f`, `intake-01`). Earlier open points are kept in the case files as notes.
- **Status conflicts resolved:** `judge-what-is-priority` and `etali-casting-during-resolution` are VALIDATED (owner, 2026-09-28).
- **Citations:** the owner considers the existing scenarios' CR citations checked against the CR effective 2026-09-25 (2026-09-26). All CR rule numbers cited by the 20 cases exist in that version.
- **Easy/hard:** all 348 cases are tagged. The owner accepted the proposed tags on 2026-09-28 (OQ-11): **240 easy, 108 hard**, where 50 of the hard ones are the owner's own "Hard" bucket.
- **Sets:** every case here has been read by AI roles (the Judge Lab file included), so they are `dev` or `regression`, never `heldout`. The held-out set comes from the league export (ADR-0017 §4).
- **Gaps found during conversion** (in the open points): the Wheel/Tithe framework and "stack became empty" clause; missing penalties and delivery patterns for the forgotten-untap and One Ring disputes.
