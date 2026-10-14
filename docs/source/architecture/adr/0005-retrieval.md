# ADR-0005: Deterministic matching and retrieval; no embeddings in v1

Status: Accepted 2026-09-28 · Date: 2026-09-25 · Requirements: P2, FR-Q-1, FR-Q-2, FR-Q-4, NFR-ACC-3, FR-BUILD-1, FR-BUILD-2

## Context

At run time the judge first has to find **what** the player is asking about. Then, only on a library miss, it has to find the rules text that the `reason` fallback may cite (ADR-0008, ADR-0002). P2 asks for both to be deterministic wherever possible.

## Options considered

1. **Vector search.** It handles paraphrase well, but needs an embedding model, is hard to explain, and often retrieves text that sounds relevant but is normatively wrong.
2. **Deterministic matching and retrieval, with lexical search as the last resort (chosen).**

## Decision

**Matching** (every case, no AI):

1. **Card resolver:**
    - exact name, then normalised name (case, punctuation, accents, "//" faces), then fuzzy candidates with scores;
    - player nicknames ("Tithe", "Bowmasters") come from the lexicon;
    - more than one plausible card gives a choice question (FR-Q-2).
2. **Lexicon:** approved player phrases are mapped to concept, intent, and infraction IDs, per locale. It is authored at build time and grows from `LibraryMiss` logs.
3. **Library lookup**, deterministic sources in this order (ADR-0017):
    - `RulingEntry`s whose cards ⊆ the resolved cards and whose concepts or intents match;
    - **official card rulings** of the resolved cards whose tags match the intent;
    - `AnswerStrategy`s whose `appliesWhen` holds for the cards' prefetched features;
    - for disputes, `Procedure`s whose triggers match, in the event's framework.

**Retrieval** (library misses only, as input for `reason`):

1. **Exact references** in the question ("CR 603.3b") are resolved by section ID.
2. **Concept → core sections:** each concept lists its curated core sections, authored and approved at build time.
3. **Cross-references** of those sections, one hop.
4. **Oracle text and official rulings** of the resolved cards.
5. **SQLite FTS5 (BM25)** over section text, when steps 1–4 return too little. Each use is logged to find gaps in the concepts.

`reason` may cite **only** the IDs it was given, and the verifier enforces this (NFR-ACC-3).

## Consequences

- Matching and retrieval can both be tested for free in CI, against golden cases' raw texts and required citations.
- Embeddings can be added later behind the same interface if held-out matching or retrieval recall stays too low after the lexicon and concepts have been improved.
