# ADR-0014: Locale catalogs and a protected glossary

Status: Accepted 2026-09-28 · Date: 2026-09-25 · Requirements: NFR-I18N-1, D16, §4 architecture constraints, FR-CTX-1, NFR-TONE-1, P3

## Decision

- **No user-facing string and no prompt text lives in code.** Both come from locale catalogs (`locales/<lang>/messages.*`, `locales/<lang>/prompts/*`), shipped inside the knowledge bundle so that they are versioned with it. The MVP ships `en` only (D16).
- The **event context's `language`** selects the catalog. Almost everything players see is an approved template in that language: greetings, questions, answers, rulings, "please wait for a judge", confirmations (ADR-0008). A new language means translating the templates and the lexicon at build time, not generating text at run time. The only AI-written player text, the `reason` fallback, is prompted to write in the event's language.
- **Protected glossary:** the defined terms of the CR, MTR, and IPG (for example *priority*, *stack*, *Missed Trigger*, *Hidden Card Error*, *Warning*, *Turn Skip*) are extracted at build time from the sources, with their source section. Prompts instruct the model to keep them in English. The verifier checks that every glossary term in a non-English reply appears in its English form.
- **Answer templates may vary by REL** (owner decision, 2026-09-26; PRD OQ-32):
    - at **Competitive REL** (the MVP), an answer states only what is legal and what happens, never why a player might want to do it, because that is play advice (FR-RUL-8);
    - at **Regular REL** (JAR, post-MVP), a branch may add a `regularRelNote` template telling the player that the action won't achieve what they seem to be trying to do. For example: "Deflecting Swat can target that trigger, but it won't change anything, because the trigger has no targets."

  A `Template` is therefore keyed by locale and, optionally, REL. The engine picks the variant for the event context's REL, and the note is approved together with the branch.
- **Greetings and stance phrases** (P3) are catalog entries with variables. `{issueSummary}` is filled from the matched topic's own label, for example "a missed trigger". If nothing matched yet, a generic variant is used.
- Discord-specific wording ("thread", "DM") is kept in the Discord adapter's own catalog, so another front end can use its own words (§4: Discord must not be hard-coded).

## Consequences

- Adding a language is mostly catalog translation plus golden variants in that language (Post-MVP 5).
