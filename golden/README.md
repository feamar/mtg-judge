# Golden test set

This set defines what a correct ruling is (PRD §8). Only the product owner can validate a case.

- `cases/`: **the structured test cases**, one YAML file per case, following [`schema/golden-case.schema.json`](schema/golden-case.schema.json) (ADR-0013). These are what the deterministic test suite will run.
- `scenarios/`: the narrative view of each case (Markdown), with the full source → proposition → consequence chain. `scenarios/INDEX.md` lists them.
- `concepts/`: concept models, such as priority, that scenarios refer to.
- `schema/`: the case schema.
- `import/`: source files imported as-is (lossless), such as `judge-lab-regression-100.jsonl`.
- `tools/`: deterministic import scripts. `tools/import-judge-lab.mjs` converts Judge Lab JSONL into `cases/` and checks every CR citation against a given CR edition. Re-run it rather than hand-editing imported cases.

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

- **137 cases.**
    - **100 Judge Lab regression cases** (`judge-lab-cr-001` … `judge-lab-cr-100`): general Comprehensive Rules questions, imported on 2026-09-26 from the owner's `judge-lab-regression-100.jsonl`. The owner marked all 100 **fully VALIDATED**, including their source mappings (2026-09-26). The file itself recorded 98 as "ruling accepted, sources SOURCE CHECK REQUIRED". Every one of their 231 CR citations exists in the CR of 2026-09-25 (checked by the importer). Format `any`, REL not material; no easy/hard tag yet.
    - The 20 converted scenarios.
    - 10 AI-drafted targeting variants (`tc-01` … `tc-10`, SOURCE CHECK REQUIRED).
    - Owner scenarios given as `SCN:` prompts (from 2026-09-27): `scn-001a..f` (card accidentally shuffled into the library): a–c VALIDATED by the owner, d–f SOURCE CHECK REQUIRED.
    - One narration-intake example (`intake-01`), SOURCE CHECK REQUIRED.
    - Of the 20 scenarios, 18 came from the ChatGPT package and 2 from the owner's own questions of 2026-09-26.
- **Validation:** 15 VALIDATED, 5 SOURCE CHECK REQUIRED (Kinnan ×3, forgotten untap, Wheel/Tithe). For those five, the citations were checked to exist in the CR of 2026-09-25, and against current Oracle text and the IPG. Each has its open points listed in the case file.
- **Status conflicts for the owner to settle:** `judge-what-is-priority` and `etali-casting-during-resolution` say VALIDATED in their narrative (2026-09-23), but INDEX.md listed them as SOURCE CHECK REQUIRED. The cases follow the narrative, with an open point.
- **Citations:** the owner considers the existing scenarios' CR citations checked against the CR effective 2026-09-25 (2026-09-26). All CR rule numbers cited by the 20 cases exist in that version.
- **Easy/hard:** proposed only (14 easy, 6 hard). The owner confirms by setting `tag`.
- **Sets:** every case here has been read by AI roles (the Judge Lab file included), so they are `dev` or `regression`, never `heldout`. The held-out set comes from the league export (ADR-0017 §4).
- **Gaps found during conversion** (in the open points): the Wheel/Tithe framework and "stack became empty" clause; missing penalties and delivery patterns for the forgotten-untap and One Ring disputes.
