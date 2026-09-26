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
  canBeCountered /* false for "can't be countered", CR 113.6g */,
  abilities: [Ability],
  derivation: { field → "parser" | "ai-draft" | "reviewed" } }

Ability { index, kind: "activated"|"triggered"|"static"|"spell-effect",
          costHasTap, addsMana, isLoyalty,
          isManaAbility /* CR 605.1a/b */, usesStack,
          targets: TargetSpec[] /* empty = untargeted (CR 115.1a–d, 115.10a) */,
          triggerEvent? /* "draw", "cast", "etb", "tap-for-mana", "leaves", "beginning-of-upkeep", … */,
          effectKinds[] /* "counter", "change-targets", "type-change", "control-change", "pt-change", "copy", … */,
          additionalEffects: bool /* does more than its main effect, e.g. Pact's upkeep clause */,
          creates: Ability[] /* abilities this effect CREATES: delayed triggers (CR 603.7), emblems, granted abilities */ }
TargetSpec { what: "spell"|"ability"|"spell-or-ability"|"permanent"|"creature"|"player"|"any"|…,
             restriction?: ControlledTerm /* "blue", "noncreature", "single-target", … from a closed vocabulary */ }
Modes      { [modeId]: { targets: TargetSpec[], kind, additionalEffects, creates } }   // modal spells: REB, Pyroblast, …
StackObject{ kind: "spell"|"ability", card, mode?, abilityIndex?, created?: bool, chosenTargets[] }  // what strategies reason about
```

Found by spike S4 (2026-09-26):

- **Modal spells need per-mode targets and effects.** Deflecting Swat vs Red Elemental Blast is decided by the *chosen mode's* target spec (CR 700.2a).
- **Effects can be conditional:** Pyroblast's "counter target spell if it's blue" is a different effect kind from "counter target blue spell", even though both "counter blue".
- **Restrictions need a controlled vocabulary**, so they are evaluated by code, not read as prose.
- **Strategies reason about stack objects** (a spell in a chosen mode, or an ability that is printed or created), not about cards alone.

**Abilities created by effects are features too** (found on 2026-09-26 with the owner's Deflecting Swat / Necropotence question). Necropotence's activated ability *creates* a delayed triggered ability ("Put that card into your hand at the beginning of your next end step"), and that created ability has **no targets**. The question "can Deflecting Swat target it, and what happens?" is decided entirely by features of the created ability. So `creates` is modelled recursively, with the same fields as a printed ability.

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
- **Matching order** (deterministic sources first):
    1. exact `RulingEntry`;
    2. an **official card ruling** tagged with the matched cards and intent (point 5);
    3. `AnswerStrategy` (via features);
    4. `interpret`, then match again;
    5. the `reason` fallback.
- **Answer text** is the approved template, filled with card names and the derived facts. **Citations** are the template's section IDs, the cards' Oracle text, and any official card ruling the strategy relies on.

**5. Official card rulings as a deterministic answer source** (found on 2026-09-26 with the owner's Pact of Negation question):

- Wizards' official rulings, which are in the card data (ADR-0006), often answer a player's question word for word. Pact of Negation's ruling (2021-03-19) says that if Pact resolves with a legal target but fails to counter it (for example because the spell can't be countered), the delayed trigger still triggers.
- The CR itself has no rule that says so directly. There it is an inference: "can't be countered" isn't a targeting restriction, so the target stays legal and Pact resolves (CR 608.2b, 101.2, 609.3, 603.7a). The official ruling states that inference with authority.
- **At build time,** each official ruling is tagged with its cards (already known) and with intents and concepts, such as `counter-vs-uncounterable` or `target-untargeted-ability`. Tagging follows the same route as features: a keyword parser first, then author sessions. The ruling's *text* is official and needs no review; only its tags do.
- **At run time,** a question matching a ruling's cards and intent is answered with the ruling's text, quoted and attributed, at no cost.
- **Strategies cite rulings too.** The "counter vs. can't be countered" strategy cites the CR chain *and* the official rulings on Pact of Negation and Abrupt Decay.

**6. Rules codification: three tiers.** The owner asked whether every CR rule can be codified for a deterministic engine. The decision: *not as a full game engine* (see Options 2). Instead, three tiers, each only as deep as questions require:

| Tier | What | Scope |
| --- | --- | --- |
| **1. Structured rules** | Every CR section already becomes a `Section` (ADR-0007). Each also gets a `ruleKind`: `definition`, `condition-effect`, `restriction`, `ordering`, `procedure`, or `judgement`. That tells us what can be codified at all, and which rules strategies may treat as mechanical. | The whole CR. Parser plus author tagging; review only where a strategy or module depends on the tag. |
| **2. Rule modules** | Small, tested, pure functions in `core`, each implementing one rule area and citing its sections. Examples: `isTargeted` / `isLegalTarget` / `resolvesOrFizzles` (115.1–115.10, 608.2b); `chooseNewTargets` (115.7a–e); `isManaAbility` (605.1a/b); `apnapOrder` (603.3b); `delayedTriggerCreated` (603.7a). Strategies call modules on card features, and the modules' outputs become `derived` facts. | Only the rule areas that questions cluster on, in the order the league-export triage shows. Each module is tested by its scenario family. |
| **3. Text** | All other rules stay as searchable text, used by the `reason` fallback (ADR-0005). | Everything else |

The owner's two questions of 2026-09-26 show the payoff. Both are answered by a small **targeting and countering** module over card features:

- **Swat → Necropotence's delayed trigger:** a legal target (113.1c, 115.2), no targets to change (115.1d, 115.10a, 115.7d), so no effect.
- **Pact → an uncounterable spell:** a legal target, so Pact resolves (608.2b); the counter part fails (101.2, 609.3); the created upkeep trigger still exists (603.7a).

Spike S4 measures what one module costs to build (SPIKES.md).

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
7. **Retention (owner, 2026-09-26, OQ-31):** the raw export is deleted once the pseudonymised scenarios have been made from it. That includes the held-out part, which is then kept only in its pseudonymised form. The TO agreed to the use. There is no player notice and no opt-out.

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
- **This is not a rules engine.** Strategies and rule modules answer the question types that have been worked out. Everything else still falls back, marked.
- **Rule modules are code, not data.** They live in `core`, and they change through the normal branch → owner-approved merge flow, not through a bundle release. Each module names the CR version it implements. A CR update that changes one of its sections flags the module and its scenario family as stale.
