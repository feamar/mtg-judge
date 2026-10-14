# mtg-judge (mlmd project)

What the project is: written from the Vision (`docs/vision.md`) once its first topic is settled.

## Reading order

1. `docs/vision.md`
2. `docs/behaviors.md`
3. the current increment's PRD (`docs/prd/pi-N.md`) and, if it belongs to one, its MVP's document
4. `docs/open-questions.md` before proposing anything
5. `docs/assumptions.md` before relying on anything the documents state as fact
6. `docs/architecture.md` before changing structure

Earlier increments' PRDs and finished MVPs' documents are records: read them for why something was
decided, not for what the product does.

Whenever a session finds a decision, rule, term, trap, assumption or issue, it updates the document
that holds it, in the same commit as the work.

**Claims:** nothing is stated as fact unless it was read or run in the current session. A name, a
file name or a search hit is a lead, not a fact.

## Trust

A checked box is a stop that waits for the operator.

- [ ] **LLD:** you accept an item's LLD before its code is written.
- [x] **Cycle end:** you use a finished cycle before the next one starts.
- [ ] **Merge:** an item merges into main on your word.
- [x] **Push:** main is pushed to origin on your word.
- [x] **Release:** an increment's release is tagged and deployed on your word.

@docs/rules.md
@docs/glossary.md
@docs/footguns.md
