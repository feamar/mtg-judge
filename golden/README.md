# Golden test set

This set defines what a correct ruling is (PRD §8). Only the product owner can validate a case.

- `cases/`: **the structured test cases**, one YAML file per case, following [`schema/golden-case.schema.json`](schema/golden-case.schema.json) (ADR-0013). These are what the deterministic test suite will run.
- `scenarios/`: the narrative view of each case (Markdown), with the full source → proposition → consequence chain. `scenarios/INDEX.md` lists them.
- `concepts/`: concept models, such as priority, that scenarios refer to.
- `schema/`: the case schema.

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

- **20 cases**, all converted to the structured format. 18 came from the ChatGPT package, and 2 are from the owner's own questions of 2026-09-26 (Deflecting Swat / Necropotence, Pact of Negation / uncounterable).
- **Validation:** 15 VALIDATED, 5 SOURCE CHECK REQUIRED (Kinnan ×3, forgotten untap, Wheel/Tithe). For those five, the citations were checked to exist in the CR of 2026-09-25, and against current Oracle text and the IPG. Each has its open points listed in the case file.
- **Status conflicts for the owner to settle:** `judge-what-is-priority` and `etali-casting-during-resolution` say VALIDATED in their narrative (2026-09-23), but INDEX.md listed them as SOURCE CHECK REQUIRED. The cases follow the narrative, with an open point.
- **Citations:** the owner considers the existing scenarios' CR citations checked against the CR effective 2026-09-25 (2026-09-26). All CR rule numbers cited by the 20 cases exist in that version.
- **Easy/hard:** proposed only (14 easy, 6 hard). The owner confirms by setting `tag`.
- **Sets:** all 20 cases have been read by AI roles, so they are `dev` or `regression`, never `heldout`. The held-out set comes from the league export (ADR-0017 §4).
- **Gaps found during conversion** (in the open points): the Wheel/Tithe framework and "stack became empty" clause; missing penalties and delivery patterns for the forgotten-untap and One Ring disputes.
