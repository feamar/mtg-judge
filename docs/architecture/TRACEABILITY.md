# Traceability: requirements to components

Status: Proposed · Date: 2026-09-25 · Covers every FR (PRD §6) and NFR (PRD §7), plus the principles and non-goals that constrain the design. Component names are those in [ARCHITECTURE.md §2](ARCHITECTURE.md#2-components).

"Verified by" names how QA will show the requirement is met: **G** = golden case in the deterministic suite (no AI), **AI set (a)/(b)** = the small `interpret` and `reason` test sets (ADR-0013), **U** = unit or property test, **I** = integration test, **S** = spike, **R** = review or release checklist.

## Functional requirements

| ID | Component(s) | Mechanism | ADR | Verified by |
| --- | --- | --- | --- | --- |
| FR-CTX-1 | Event context & roles; Discord adapter (slash commands) | `EventContext` fields; TO-role check on create and edit | — | U, I |
| FR-CTX-2 | Case orchestrator; Event context | No context → rules-question path only, plus the catalog message | — | G, U |
| FR-CTX-3 | Event context (schema); Knowledge (answers only) | No pairing/standing/timer entities exist; MTR procedure answers only | — | R, U |
| FR-CTX-4 | Event context; Discord adapter | Guild membership gives the context automatically; elsewhere a read-only join code (`/judge join <code>`), per the owner's 2026-09-25 answer to OQ-28 | — | U, I |
| FR-ADM-1 | Event context & roles | Global Admin user ID in config; `GuildRoleMapping` | — | U, I |
| FR-INT-1 | TicketSource; Discord adapter | Detect, parse, and join the existing bot's containers; pluggable per context | 0010 | S2, I |
| FR-INT-2 | Discord adapter; Case orchestrator | Author → `Participant.seat` on every message | 0011 | G, U |
| FR-INT-3 | Audience guard; Decision-graph engine | `PlayerPrivate` only for `InvestigationQuestion`; `Remedy` is `Table`-only; `askWho` role expressions | 0008, 0009 | G (Hidden Card Error AC), U |
| FR-Q-1 | Matcher; Knowledge (rulings library); Ruling composer; Verifier; AI edge (`reason`) | Approved `RulingEntry` with citation chain; on a library miss, `reason` with citations restricted to retrieved IDs, verified and marked | 0005, 0008 | G; AI set (b) |
| FR-Q-2 | Matcher (card resolver) | Fuzzy candidates → choice question before answering | 0005, 0006 | G, U |
| FR-Q-3 | Knowledge (library entries citing the MTR or addendum) | Answers only; no event data exists to apply them to | 0008 | G |
| FR-Q-4 | Knowledge (library entries, mnemonics); author sessions | Mnemonic and short answer on the entry, approved by the owner; the chain cites only the deciding rules | 0007, 0008 | G (layers AC), R |
| FR-Q-5 | Ruling composer | Each branch has an approved short in-game answer; [Why?] shows the full answer and chain | 0008 | G (priority scenario) |
| FR-RUL-1 | Decision-graph engine; narration intake (ADR-0019: facts from the narration, only missing ones asked) | Only decisive facts are candidates | 0008 | G, U |
| FR-RUL-2 | Decision-graph engine; Escalation policy | `Dispute` with judgement-call basis, rule on agreed facts, or escalate | 0008 | G, U |
| FR-RUL-3 | Ruling composer | `Ruling{decision, fixSteps, chain, explanation}` | 0008 | G |
| FR-RUL-4 | Decision-graph engine | `Claim` versus `Fact{origin}`; assertions never become facts; verifier check | 0008 | G (Wheel/Tithe), U |
| FR-RUL-5 | Case orchestrator; Normaliser (read-back of the canonical question) | `Confirming` state before rulings that depend on reconstruction | 0008 | G |
| FR-RUL-6 | Decision-graph engine | Several live candidates (entries, procedures), updated each turn | 0008 | G (One Ring AC) |
| FR-RUL-7 | Decision-graph engine | Infraction from game-action facts only; integrity signals write to staff notes | 0008, 0009 | G (One Ring AC) |
| FR-RUL-8 | Audience guard; approved templates; `reason` prompt; output lint | Templates reviewed for play advice; hidden-information and play-advice lint on everything sent | 0009 | G (Underworld Breach/LED), U |
| FR-RUL-9 | Verifier; Ruling composer | `outcome: unresolved` → escalate; counted as success | 0008 | G |
| FR-POL-1 | Knowledge (penalty tables); Ruling composer; Verifier | `PenaltyRow` lookup; the model never chooses the penalty; issued by the bot only up to a Warning, otherwise recommended to a human judge (ADR-0021) | 0007, 0008 | G (MTRA Deck Problem AC), U |
| FR-POL-2 | Ruling composer; Knowledge (branch) | Delivery pattern set on each branch at build time, approved with it | 0008 | G (pattern per case) |
| FR-POL-4 | Ruling composer; Escalation policy | Remedy steps tagged simple-backup / partial-fix / full-backup; full backups always handed off (ADR-0022) | 0022 | G (Judge Lab integrity cases) |
| FR-POL-3 | Ruling composer; Outbox | Base-penalty label; copy to `Staff` | 0009 | G, U |
| FR-INV-1 | Build pipeline; Knowledge | `Procedure` per framework per infraction | 0007, 0008 | R, U (schema validation) |
| FR-INV-2 | Decision-graph engine | Decisive-fact candidates, deterministic selection with approved wording (owner, 2026-09-25; OQ-30), guard, `QuestionAsked` record | 0008 | G (required facts AC) |
| FR-INV-3 | Decision-graph engine | Game state asked only when it is a decisive fact | 0008 | G (forbidden questions) |
| FR-ESC-1 | Escalation policy; Discord adapter ([Ask a human judge] button) | Checks (a)–(e) every turn, plus (f): base penalty more severe than a Warning, handed off as a recommendation (ADR-0021, OQ-36); (a) uses concrete signals instead of a confidence score (OQ-7) | 0008 | G, U |
| FR-ESC-2 | Escalation policy; Decision-graph engine | Collect `cheapToCollect` facts before handoff | 0008 | G |
| FR-ESC-3 | Escalation policy; Outbox | `Handoff` to `Staff` | 0009 | G, U |
| FR-ESC-4 | Audience guard; Escalation policy; integrity categories and modes (ADR-0022) | Staff-only notes, player-safe projection, stop rule, lint | 0009 | G (AC: no leak in any player message) |
| FR-ESC-5 | Case orchestrator; locale catalog | Fixed catalog message on escalation | 0014 | G |
| FR-LOG-1 | CaseStore (event log) | Log plus versions on every event; 7-day retention job | 0004, 0011 | U, I |
| FR-LOG-2 | Event context & roles; Discord adapter | Judge/TO-only read commands | — | U |
| FR-LOG-3 | CaseStore; Tests | `/judge export` → pseudonymised golden candidate | 0011, 0013 | I |
| FR-VOICE-1 | Spike S1 | Feasibility spike before the MVP | 0015 | S1 |
| FR-VOICE-2 | Voice adapter; SttPort | Transcript → `MessageReceived{modality: voice}`; summons-only listening window | 0015 | S1, I |
| FR-BUILD-1 | Build pipeline | Importers, derived artifacts, bundle | 0006, 0007 | R, U |
| FR-BUILD-2 | Build pipeline | `sourceSectionIds` on every artifact; validation stage | 0007 | U |
| FR-BUILD-3 | Build pipeline; Tests | Readable diff; release gate; owner approval | 0007, 0013 | R |

## Non-functional requirements

| ID | Component(s) | Mechanism | ADR | Verified by |
| --- | --- | --- | --- | --- |
| NFR-ACC-1 | Tests; Decision-graph engine; Verifier | Guard + verifier; release gate on 100% of validated easy cases | 0008, 0013 | G |
| NFR-ACC-2 | Escalation policy; Spend cap | Escalation with facts gathered; escalation rate reported | 0008 | G, production reporting |
| NFR-ACC-3 | Verifier; Knowledge | Citations must resolve in the loaded bundle and come from the retrieval set | 0005, 0007 | G, U |
| NFR-COST-1 | Deterministic core; AI edge; hosting; Spend cap | Most cases make no AI call; $0 hosting; ledger | 0002, 0003, 0008, 0012 | S3, monthly report |
| NFR-COST-2 | Spend cap | Monthly cap with questions-only mode; per-player rate limit | 0012 | U, S3 |
| NFR-AVAIL-1 | Case orchestrator; TicketSource; host | Event log, catch-up on startup, restart policy | 0003, 0011 | S2, I |
| NFR-LAT-1 | Deterministic core; Discord adapter | Most replies involve no AI call; typing indicator during fallback | 0002, 0008 | S3 |
| NFR-I18N-1 | Locale catalogs; Knowledge (glossary); Verifier | No strings in code; protected glossary | 0014 | U (lint for string literals), R |
| NFR-PRIV-1 | CaseStore (retention, deletion); LlmPort (pseudonymisation); Voice adapter (consent) | 7-day deletion, Admin delete command, seat labels in prompts, voice consent | 0002, 0004, 0015 | U, I; third-party processing accepted by the owner (OQ-23) |
| NFR-VER-1 | CaseStore; Knowledge (manifest) | `systemVersion` and `bundleVersion` on every case event | 0004, 0007, 0011 | U |
| NFR-TECH-1 | All | TypeScript; Anthropic behind `LlmPort` | 0001, 0002 | R, adapter conformance tests |
| NFR-EXT-1 | Ports and adapters; Knowledge (IDs for format/REL/framework) | Nothing hard-coded in `core` | 0001, 0007, 0010 | R, U (dependency-rule check) |
| NFR-TONE-1 | Locale catalogs (approved templates) | Each template is checked once against the tone rubric (OQ-18) when approved; the `reason` fallback text is checked in AI set (b) | 0008, 0014 | R, AI set (b) |
| NFR-IMP-1 | Decision-graph engine; Normaliser | Deterministic by construction: same facts → same branch. Wording variants (generated noise, human, speech) must yield the same canonical question and byte-identical answer | 0008, 0013, 0018 | G (variants); robustness suite |

## Principles and non-goals

| ID | Where it is enforced |
| --- | --- |
| P1 Teach first | Ruling composer: explanation always present; delivery patterns (FR-POL-2) |
| P2 Deterministic first | Approved rulings library and procedures, pre-worded questions, penalty tables, guard, verifier. AI only at two edges: `interpret` and the `reason` fallback (ADR-0002, ADR-0008). |
| P3 Face of the game | Catalog greetings (disputes only), tone rubric, neutral escalation templates (ADR-0009, ADR-0014) |
| NG1 No event management | No pairing, standing, or timer entities in the data model (§3.2); FR-Q-3 answers only; drops and other event-management actions are referred to the TO, never executed or announced (ADR-0020) |
| NG3 No Professional REL | `rel` values come from the bundle, which contains Regular and Competitive only |
| NG4 No mixing frameworks | `EventContext.frameworkId` is a single value (OQ-20: zero or one addendum) |
| §4 architecture constraints (player count, English, Discord, text-only) | `Seating` with N seats; ADR-0014; adapters; `Evidence` (ARCHITECTURE.md §8) |
