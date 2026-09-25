# ADR-0005: Deterministic retrieval first; no embeddings in v1

Status: Proposed · Date: 2026-09-25 · Requirements: P2, FR-Q-1, FR-Q-2, FR-Q-4, NFR-ACC-3, FR-BUILD-1, FR-BUILD-2

## Context

The ChatGPT package proposed hybrid retrieval: exact lookup, BM25, vectors, and graph traversal. P2 says anything that can be deterministic must be. Cost also argues against paying for an embedding call on every turn.

## Options considered

1. **Vector search first.** It handles paraphrase well, but it is the least explainable option and needs an embedding model at run time. It also tends to retrieve text that sounds similar but is normatively wrong.
2. **Deterministic retrieval with lexical search as the fallback (chosen).**
3. **All of the above from day one.** Most of the complexity arrives before there is any evidence that it's needed.

## Decision

The `Knowledge` service answers these queries against the bundle, in this order:

1. **Exact reference:** `CR 603.3b`, `IPG 2.1`, `MTRA Hidden Card Error`, and similar, resolved through the section ID index.
2. **Card resolver:** exact name, then normalised name, then fuzzy candidates with scores. If there is no single confident match, the engine asks the player which card they mean (FR-Q-2). It returns the current Oracle text and official rulings, with the card-data version.
3. **Concept index:** at build time every section is tagged with concepts (for example `priority`, `apnap`, `mana-ability`, `layer-4`, `missed-trigger`). The tags are drafted by AI and reviewed. At run time, the `understand` role emits concept tags from a closed list, and the index returns the curated core sections for each concept, the cross-references one hop away, and any approved mnemonic (FR-Q-4).
4. **Cross-reference graph:** the rule-to-rule references parsed from the source text (for example "see rule 117.3") are expanded one hop for the sections selected above.
5. **Lexical fallback:** SQLite FTS5 (BM25) over section text. It is used when steps 1–4 return too little, and the engine logs each use so that gaps in the concept index can be found.

Retrieval returns section IDs plus exact text. The `reason` role may cite **only** IDs that were in its retrieval set; the verifier enforces this (NFR-ACC-3, ADR-0008).

## Consequences

- Retrieval is testable without a model: each golden case lists its required citations, so recall can be measured in CI for free.
- The quality of the concept tags matters. Tagging runs at build time with a strong model, and its output is diffed and reviewed on every rebuild.
- **Embeddings** can be added later behind the same `Knowledge` interface (for example `sqlite-vec` inside the bundle, computed at build time). The trigger is measured retrieval recall on the development set falling below target.

## Revisit when

Retrieval recall on the development golden set is below 100% for the required citations of *easy* cases, and the misses can't be fixed by improving the concept tags.
