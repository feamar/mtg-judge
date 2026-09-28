# ADR-0007: Atomic, versioned source sections released as one knowledge bundle

Status: Proposed · Date: 2026-09-25 · Requirements: FR-BUILD-1..3, D25, §5, R6, R7, OQ-3, OQ-4, OQ-20, NFR-ACC-3, NFR-VER-1

## Context

Every ruling cites specific sections of the CR, MTR, IPG, Oracle text, or the event's addendum. Every citation must resolve to a real section in the loaded version (NFR-ACC-3). The sources arrive in different formats:

- the CR as a plain-text download from WotC;
- the MTR and IPG as web pages that mix normative text with annotations;
- the Portuguese addendum on GitHub Pages;
- the MTRA as a JavaScript-only Notion page, so today it arrives as a manual transcript (R7).

## Decision

**1. One importer per source**, all producing the same normalised shape:

```
SourceDocument { docId: "CR"|"MTR"|"IPG"|"ADD-PT"|"MTRA"|..., version, effectiveDate,
                 retrievedAt, origin: url|manual-transcript, contentHash }
Section        { sectionId: "CR:603.3b", docId, number, title?, text, parentId?,
                 order, textHash, refs: sectionId[] }
```

- **Section IDs are stable and human-readable,** because they are what citations point to.
- **Text is normalised on import, with the original kept.** Line endings are unified (the CR TXT has CRLF), and typographic quotes, apostrophes, and dashes are mapped to ASCII in a separate `searchText` field; the Unicode `text` stays as the citable original. Oracle text from the card data gets the same treatment.
    - *Why:* on 2026-09-26 a search of the current CR for "can't be countered" found nothing, because the CR writes "can’t" with a typographic apostrophe. Deterministic matching must not silently miss rules over punctuation.
- **Each section gets a `ruleKind`**: `definition`, `condition-effect`, `restriction`, `ordering`, `procedure`, or `judgement`. It is drafted by the parser and author sessions, and reviewed where a strategy or rule module depends on it (ADR-0017 §6, tier 1).
- **The MTR and IPG importers keep the normative text only.** Annotation blocks are stripped and recorded as stripped, so a reviewer can see what was dropped.
- **Manual transcripts are accepted** with `origin: manual-transcript` and a named transcriber, per `sources/README.md`.
- **Addenda keep their own numbering.** They also declare what they amend, as `AddendumEdit { addendumSectionId, amends: sectionId|infractionId, kind: replace|add|modify-penalty|modify-procedure }`. The edits are AI-drafted at build time and reviewed.
- **The MTRA on TopDeck.gg and the MTRA on Notion are treated as different documents** (owner, 2026-09-28, OQ-3). Each gets its own `docId` and version, and an event names exactly which one it uses. The current import is the Notion version (the manual transcript of 2025-06-24).

**2. Derived artifacts** are built from sections. Each one keeps `sourceSectionIds[]` (FR-BUILD-2):

- the **approved rulings library** (`RulingEntry`s), the concepts with their core sections, mnemonics, and the lexicon (ADR-0005, ADR-0008, FR-Q-4);
- **templates**: the approved wording for questions and answers (ADR-0014);
- the **infraction catalog**: one entry per IPG infraction, plus addendum-only infractions;
- the **penalty tables**: `(frameworkId, infractionId) → basePenalty, upgradePath, notes`, including replacements such as Game Loss → Turn Skip under the MTRA (FR-POL-1);
- the **procedures**, one per framework per infraction (FR-INV-1, ADR-0008).

These are written by the knowledge author role in Claude Code sessions on the owner's Pro subscription, as files in the repository. The pipeline validates them (ADR-0016). A source change flags every entry, procedure, and penalty row that cites a changed section as **stale** until it has been re-checked. Every AI-derived record is stored with `derivation: ai-draft|reviewed` and is never presented as source text (the ChatGPT package's rule about the three data layers).

**3. One knowledge bundle per release.** It contains all imported sections, the derived artifacts, card data (ADR-0006), and the locale catalogs (ADR-0014). The manifest records every document version and hash plus the pipeline version (NFR-VER-1).

**4. Release flow (D25, FR-BUILD-3):**

1. import;
2. produce a **readable diff** per document: sections added, removed, or changed, each with a word-level text diff;
3. rebuild the artifacts, with a diff of those too;
4. flag stale golden cases (those citing any changed section);
5. run the golden set (ADR-0013);
6. the pipeline writes a release report;
7. the product owner approves;
8. the bundle is promoted and the bot switches to it at the next case boundary.

**5. Precedence** between layers is data, not code: an ordered list in the bundle manifest (owner, 2026-09-28, OQ-4). There are two separate layers that never override each other:

- **game rules:** Oracle card text over the CR where they directly contradict (CR 101.1);
- **tournament policy:** the event's addendum over the MTR and IPG.

TO event policies are Post-MVP (ADR-0020).

**6. Frameworks (OQ-20, answered 2026-09-25):** an event selects **zero or one** addendum. The addendum may amend the MTR, the IPG, or both. With zero addenda the framework is the plain MTR + IPG, and the multiplayer gaps in the IPG are handled as `UNRESOLVED` where the text doesn't settle them (FR-RUL-9).

## Consequences

- A citation is always `sectionId @ bundleVersion`, so a ruling from last week can be checked against the exact text it used.
- Adding a new framework is a data task (importer + edits + procedures + golden cases), not an engine change (NFR-EXT-1).
- **The owner reviews each AI-drafted procedure, penalty row, and addendum edit** before the first release (answer to OQ-27, 2026-09-25). After that, only the artifacts that changed in a rebuild are reviewed.
    - A record moves from `ai-draft` to `reviewed` only by the owner's approval. A bundle with any `ai-draft` procedure or penalty row can't be released.
    - The review queue presents each item next to the exact source sections it cites, so each review is a side-by-side check.
