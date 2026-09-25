# Traceability: requirements to components

Status: Proposed · Date: 2026-09-25 · Covers every FR (PRD §6) and NFR (PRD §7), plus the principles and non-goals that constrain the design. Component names are those in [ARCHITECTURE.md §2](ARCHITECTURE.md#2-components).

"Verified by" names how QA will show the requirement is met: **G** = golden case, **U** = unit or property test, **I** = integration test, **S** = spike, **R** = review or release checklist.

## Functional requirements

| ID | Component(s) | Mechanism | ADR | Verified by |
| --- | --- | --- | --- | --- |
| FR-CTX-1 | Event context & roles; Discord adapter (slash commands) | `EventContext` fields; TO-role check on create and edit | — | U, I |
| FR-CTX-2 | Case orchestrator; Event context | No context → rules-question path only, plus the catalog message | — | G, U |
| FR-CTX-3 | Event context (schema); Knowledge (answers only) | No pairing/standing/timer entities exist; MTR procedure answers only | — | R, U |
| FR-CTX-4 | Event context | `shareCode`; guild membership gives automatic context; read-only link | — | U; form of link is OQ-28 |
| FR-ADM-1 | Event context & roles | Global Admin user ID in config; `GuildRoleMapping` | — | U, I |
| FR-INT-1 | TicketSource plugins; Discord adapter | Detect, parse, and join the existing bot's containers; pluggable per context | 0010 | S2, I |
| FR-INT-2 | Discord adapter; Case orchestrator | Author → `Participant.seat` on every message | 0011 | G, U |
| FR-INT-3 | Audience guard; Investigation engine | `PlayerPrivate` only for `InvestigationQuestion`; `Remedy` is `Table`-only; `askWho` role expressions | 0008, 0009 | G (Hidden Card Error AC), U |
| FR-Q-1 | Knowledge; Ruling composer; Verifier | Retrieval → `reason` with citations restricted to retrieved IDs | 0005 | G |
| FR-Q-2 | Knowledge (card resolver); Case orchestrator | Fuzzy candidates → confirmation question before answering | 0005, 0006 | G, U |
| FR-Q-3 | Knowledge; `reason` prompt | MTR/addendum sections are retrievable; no event data exists to apply them to | — | G |
| FR-Q-4 | Knowledge (concept index, mnemonics); Build pipeline | Mnemonics curated at build time, approved by the owner; the answer cites the deciding rules only | 0005, 0007 | G (layers AC), R |
| FR-Q-5 | Ruling composer (`phrase` depth rule) | In-game minimum depth; full chain kept and shown on request | — | G (priority scenario) |
| FR-RUL-1 | Investigation engine | Only decisive facts are candidates | 0008 | G, U |
| FR-RUL-2 | Investigation engine; Escalation policy | `Dispute` with judgement-call basis, rule on agreed facts, or escalate | 0008 | G, U |
| FR-RUL-3 | Ruling composer | `Ruling{decision, fixSteps, chain, explanation}` | 0008 | G |
| FR-RUL-4 | Investigation engine | `Claim` versus `Fact{origin}`; assertions never become facts; verifier check | 0008 | G (Wheel/Tithe), U |
| FR-RUL-5 | Case orchestrator | `Confirming` state before rulings that depend on reconstruction | 0008 | G |
| FR-RUL-6 | Investigation engine | Several live hypotheses, updated each turn | 0008 | G (One Ring AC) |
| FR-RUL-7 | Investigation engine | Infraction from game-action facts only; integrity hypotheses write to notes | 0008, 0009 | G (One Ring AC) |
| FR-RUL-8 | Audience guard; `reason`/`phrase` prompts; output lint | Hidden-information lint; play-advice lint | 0009 | G (Underworld Breach/LED), U |
| FR-RUL-9 | Verifier; Ruling composer | `outcome: unresolved` → escalate; counted as success | 0008 | G |
| FR-POL-1 | Knowledge (penalty tables); Ruling composer; Verifier | `PenaltyRow` lookup; the model never chooses the penalty | 0007, 0008 | G (MTRA Deck Problem AC), U |
| FR-POL-2 | Ruling composer | Deterministic default, overridden by `phrase` with a recorded reason | — | G (pattern per case) |
| FR-POL-3 | Ruling composer; Outbox | Base-penalty label; copy to `Staff` | 0009 | G, U |
| FR-INV-1 | Build pipeline; Knowledge | `Procedure` per framework per infraction | 0007, 0008 | R, U (schema validation) |
| FR-INV-2 | Investigation engine | Decisive-fact candidates, AI selection, guard, `QuestionAsked` record | 0008 | G (required facts AC) |
| FR-INV-3 | Investigation engine | Game state asked only when it is a decisive fact | 0008 | G (forbidden questions) |
| FR-ESC-1 | Escalation policy | Checks (a)–(e) every turn; confidence from signals (OQ-7) | 0008 | G, U |
| FR-ESC-2 | Escalation policy; Investigation engine | Collect `cheapToCollect` facts before handoff | 0008 | G |
| FR-ESC-3 | Escalation policy; Outbox | `Handoff` to `Staff` | 0009 | G, U |
| FR-ESC-4 | Audience guard; Escalation policy | Staff-only notes, player-safe projection, stop rule, lint | 0009 | G (AC: no leak in any player message) |
| FR-ESC-5 | Case orchestrator; locale catalog | Fixed catalog message on escalation | 0014 | G |
| FR-LOG-1 | CaseStore (event log) | Log plus versions on every event; 7-day retention job | 0004, 0011 | U, I |
| FR-LOG-2 | Event context & roles; Discord adapter | Judge/TO-only read commands | — | U |
| FR-LOG-3 | CaseStore; Eval harness | `/judge export` → pseudonymised golden candidate | 0011, 0013 | I |
| FR-VOICE-1 | Spike S1 | Feasibility spike before the MVP | 0015 | S1 |
| FR-VOICE-2 | Voice adapter; SttPort | Transcript → `MessageReceived{modality: voice}`; summons-only listening window | 0015 | S1, I |
| FR-BUILD-1 | Build pipeline | Importers, derived artifacts, bundle | 0006, 0007 | R, U |
| FR-BUILD-2 | Build pipeline | `sourceSectionIds` on every artifact; validation stage | 0007 | U |
| FR-BUILD-3 | Build pipeline; Eval harness | Readable diff; release gate; owner approval | 0007, 0013 | R |

## Non-functional requirements

| ID | Component(s) | Mechanism | ADR | Verified by |
| --- | --- | --- | --- | --- |
| NFR-ACC-1 | Eval harness; Investigation engine; Verifier | Guard + verifier; release gate on 100% of validated easy cases | 0008, 0013 | G |
| NFR-ACC-2 | Escalation policy; Cost governor | Escalation with facts gathered; escalation rate reported | 0008 | G, production reporting |
| NFR-ACC-3 | Verifier; Knowledge | Citations must resolve in the loaded bundle and come from the retrieval set | 0005, 0007 | G, U |
| NFR-COST-1 | Cost governor; LlmPort routing; hosting | Model routing, caching, $0 hosting, ledger | 0002, 0003, 0012 | S3, monthly report |
| NFR-COST-2 | Cost governor | Degradation ladder; rate limits; TO key possible later | 0012 | U, S3 |
| NFR-AVAIL-1 | Case orchestrator; TicketSource; host | Event log, catch-up on startup, restart policy | 0003, 0011 | S2, I |
| NFR-LAT-1 | LlmPort routing; Discord adapter | Haiku on most turns; typing indicator; measured | 0002 | S3 |
| NFR-I18N-1 | Locale catalogs; Knowledge (glossary); Verifier | No strings in code; protected glossary | 0014 | U (lint for string literals), R |
| NFR-PRIV-1 | CaseStore (retention, deletion); LlmPort (pseudonymisation); Voice adapter (consent) | 7-day deletion, Admin delete command, seat labels in prompts, voice consent | 0002, 0004, 0015 | U, I; processor question is OQ-23 |
| NFR-VER-1 | CaseStore; Knowledge (manifest) | `systemVersion` and `bundleVersion` on every case event | 0004, 0007, 0011 | U |
| NFR-TECH-1 | All | TypeScript; Anthropic behind `LlmPort` | 0001, 0002 | R, adapter conformance tests |
| NFR-EXT-1 | Ports and adapters; Knowledge (IDs for format/REL/framework) | Nothing hard-coded in `core` | 0001, 0007, 0010 | R, U (dependency-rule check) |
| NFR-TONE-1 | Locale catalogs; `phrase` role; Eval harness | Catalog frames; tone rubric grader (OQ-18) | 0013, 0014 | G |
| NFR-IMP-1 | Investigation engine; LlmPort (seat labels); Eval harness | Facts keyed by seat role; variant swaps in the golden set | 0008, 0013 | G (variants) |

## Principles and non-goals

| ID | Where it is enforced |
| --- | --- |
| P1 Teach first | Ruling composer: explanation always present; delivery patterns (FR-POL-2) |
| P2 Deterministic first | Knowledge bundle, penalty tables, procedures, guard, verifier; the AI is limited to four runtime task roles (ADR-0002) |
| P3 Face of the game | Catalog greetings (disputes only), tone rubric, neutral escalation templates (ADR-0009, ADR-0014) |
| NG1 No event management | No pairing, standing, or timer entities in the data model (§3.2); FR-Q-3 answers only |
| NG3 No Professional REL | `rel` values come from the bundle, which contains Regular and Competitive only |
| NG4 No mixing frameworks | `EventContext.frameworkId` is a single value (OQ-20: zero or one addendum) |
| §4 architecture constraints (player count, English, Discord, text-only) | `Seating` with N seats; ADR-0014; adapters; `Evidence` (ARCHITECTURE.md §8) |
