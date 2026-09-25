# ADR-0014: Locale catalogs and a protected glossary

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-I18N-1, D16, §4 architecture constraints, FR-CTX-1, NFR-TONE-1, P3

## Decision

- **No user-facing string and no prompt text lives in code.** Both come from locale catalogs (`locales/<lang>/messages.*`, `locales/<lang>/prompts/*`), shipped inside the knowledge bundle so that they are versioned with it. The MVP ships `en` only (D16).
- The **event context's `language`** selects the catalog. Almost everything players see is an approved template in that language: greetings, questions, answers, rulings, "please wait for a judge", confirmations (ADR-0008). A new language means translating the templates and the lexicon at build time, not generating text at run time. The only AI-written player text, the `reason` fallback, is prompted to write in the event's language.
- **Protected glossary:** the defined terms of the CR, MTR, and IPG (for example *priority*, *stack*, *Missed Trigger*, *Hidden Card Error*, *Warning*, *Turn Skip*) are extracted at build time from the sources, with their source section. Prompts instruct the model to keep them in English. The verifier checks that every glossary term in a non-English reply appears in its English form.
- **Greetings and stance phrases** (P3) are catalog entries with variables. `{issueSummary}` is filled from the matched topic's own label, for example "a missed trigger". If nothing matched yet, a generic variant is used.
- Discord-specific wording ("thread", "DM") is kept in the Discord adapter's own catalog, so another front end can use its own words (§4: Discord must not be hard-coded).

## Consequences

- Adding a language is mostly catalog translation plus golden variants in that language (Post-MVP 5).
