# ADR-0017: Answering strategies over prefetched card features

Status: Proposed · Date: 2026-09-25 · Requirements: P2, D38, FR-Q-1, FR-Q-4, FR-BUILD-1..3, §8, NFR-ACC-1, NFR-COST-1 · Extends: ADR-0006, ADR-0008, ADR-0013

## Context

ADR-0008 makes the judge deterministic, with approved `RulingEntry`s keyed by specific cards. That covers only the card combinations someone wrote down. cEDH has thousands of playable cards, so a per-combination library misses often, and every miss is an AI call.

The owner's direction (2026-09-25):

- **add many more scenarios;**
- work out their proper answers;
- **derive a cheap way to encode the answering strategies**, with AI only as the fallback;
- treat **card knowledge as a prefetch**.

## Options considered

1. **One entry per card combination** (ADR-0008 as it was). Simple, but coverage grows only one combination at a time.
2. **A full rules engine** that simulates the game. It would answer anything, but it is a multi-year project, and its bugs would look authoritative.
3. **Strategies over card features (chosen).** A strategy encodes how a *kind* of question is answered. Precomputed card features decide which strategy applies and which branch is taken.

## Decision

**1. Card features, prefetched at build time.** One `CardFeatures` record per card, stored in the bundle with the card-data version:

```
CardFeatures { oracleId, dataVersion,
  abilities: [{ index, kind: "activated"|"triggered"|"static"|"spell-effect",
                costHasTap, addsMana, targets, isLoyalty,
                isManaAbility /* CR 605.1a/b */, usesStack,
                triggerEvent? /* "draw", "cast", "etb", "tap-for-mana", "leaves", … */,
                effectKinds[] /* "type-change", "control-change", "pt-change", "copy", "cast-during-resolution", … */ }],
  derivation: { field → "parser" | "ai-draft" | "reviewed" } }
```

- **The deterministic Oracle parser first:** templated wording such as "{T}: Add {G}." and "Whenever an opponent draws a card, …" covers a large share of abilities for free.
- **The knowledge author (Claude Code, Pro plan, ADR-0016)** tags what the parser can't.
- The **owner reviews** features on cards used by strategies and scenarios. Other AI-tagged features are marked `ai-draft`, and a strategy may rely on them only if the strategy allows it.
- **Priority order for tagging:** cards in scenarios, then a cEDH staples list, then cards from `LibraryMiss` logs, then everything else.
- A new Oracle or CR version re-derives the affected features, and flags the strategies and scenarios that depend on them as stale. The Kinnan/Selvala scenario is the example: its author ties the answer to a 2026 change to CR 605.1a. That scenario is still SOURCE CHECK REQUIRED.

**2. Answering strategies.** A strategy is the same decision-graph structure as ADR-0008, generalised over features instead of fixed cards:

```
AnswerStrategy { strategyId, intent /* "does-X-trigger-Y", "how-much-mana", "who-acts-first", "does-effect-end", … */,
  appliesWhen: Predicate /* over the mentioned cards' features + concepts */,
  facts: FactSpec[]      /* many derivedBy card features; the rest asked as buttons (seat, turn, zone …) */,
  branches: Branch[]     /* approved answer templates with {card} variables; citation-chain templates */,
  derivedFrom: GoldenCaseId[], approvedBy, approvedOn }
```

- `RulingEntry` stays for **concepts** (priority) and for genuine one-offs that don't generalise.
- **Matching order:** exact `RulingEntry`, then `AnswerStrategy` (via features), then `interpret` and match again, then the `reason` fallback.
- **Answer text** is the approved template, filled with card names and the derived facts. **Citations** are the template's section IDs, plus the cards' Oracle text.

**3. The scenario workshop: how strategies are made**, in author sessions on the Pro plan:

1. **Generate scenarios in families.** The case author writes a scenario and its variants with the owner, each variant changing one deciding fact: a different card with the same shape, a different active player, a changed Oracle text. Families from the cEDH interactions that come up most go first.
2. **Settle the proper answer.** Each scenario gets its expected answer and source → proposition → consequence chain. It stays SOURCE CHECK REQUIRED until the owner validates it.
3. **Derive the strategy.** The knowledge author abstracts a family into one `AnswerStrategy`, plus the card features it needs.
4. **Prove it.** The strategy must reproduce every validated scenario it was derived from, in the deterministic suite (ADR-0013). Held-out scenarios with other cards then test whether it generalises.
5. **The owner approves** the strategy (OQ-27).
6. **Feed back:** live `LibraryMiss` logs and exported cases (FR-LOG-3) become new scenarios, and the loop starts again.

**4. Historical corpus intake.** The owner is exporting about 2,000 answered questions from the cEDH league's ticket bot history (2026-09-25). The intake runs in this order:

1. **Private storage.** The raw export is **never** committed to this repository, which is public on GitHub. It is kept in a folder outside the repository, or in a separate private repository.
2. **Held-out split first**, before any AI session reads the data:
    - a random ~20% is set aside as held-out, stored separately and read only by release test runs (ADR-0013);
    - the split is recorded as a list of IDs, with no content.
3. **Pseudonymisation by script.** Discord names, IDs, and mentions become `P1`…`Pn` and `J1`…`Jn`, and message links are removed. This is deterministic, with no AI.
4. **Deterministic triage.** The card resolver and lexicon tag each question with its cards, intent, and rules-question vs dispute. Frequency counts give the order in which scenario families are written, and the measured case mix (OQ-25).
5. **Answers are candidates.** Historical answers seed the expected answer of a scenario, but stay SOURCE CHECK REQUIRED until the owner validates them (D23, §8).
6. **Spike S3's 30 texts** are drawn from the non-held-out part.

## Consequences

- **Coverage grows by strategy, not by card pair.** That should push the hit rate up much faster, and AI spend down (ARCHITECTURE.md §9).
- **The golden set does double duty:** it defines correctness (§8), and it is the training material that strategies are derived from. D38's ~1,000 scenarios become mostly *families*, which also eases the review load (R12).
- **Held-out scenarios become a real measure** of generalisation, because they use cards the strategy wasn't written from.
- **New risk: a wrong card feature makes the judge wrong for every question about that card.** Mitigations:
    - review of features used by strategies;
    - `ai-draft` features can be excluded per strategy;
    - [Why?] shows the feature-derived facts ("Selvala's ability is not a mana ability, CR 605.1a");
    - the [Ask a human judge] button;
    - staleness flags on Oracle and CR changes.
- **This is not a rules engine.** Strategies answer the question types that have been worked out. Everything else still falls back, marked.
