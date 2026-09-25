# Architecture Decision Records

One file per significant choice. An ADR is never edited after it is accepted, except to change its status. To change a decision, write a new ADR that supersedes it.

Status values: **Proposed** (in review in a PR), **Accepted** (merged by the product owner), **Superseded by ADR-n**.

| ADR | Decision | Status |
| --- | --- | --- |
| [0001](0001-language-and-runtime.md) | TypeScript on Node.js LTS, in one monorepo | Proposed |
| [0002](0002-ai-provider-and-model-routing.md) | Anthropic Claude behind a provider-neutral `LlmPort`, routed by task role | Proposed |
| [0003](0003-hosting.md) | Host on the product owner's always-on machine, in Docker Compose, with outbound connections only | Proposed |
| [0004](0004-storage.md) | SQLite for runtime state; a separate read-only SQLite knowledge bundle | Proposed |
| [0005](0005-retrieval.md) | Deterministic retrieval first (IDs, card resolver, concept index, FTS5); no embeddings in v1 | Proposed |
| [0006](0006-card-data-source.md) | Card data from Scryfall bulk files (resolves the architect's half of OQ-5) | Proposed |
| [0007](0007-source-import-and-knowledge-bundle.md) | Every source document is imported into atomic, versioned, hashed sections; artifacts are released as one bundle | Proposed |
| [0008](0008-hybrid-investigation-engine.md) | Procedures are decision graphs over facts; the AI chooses and words the next question, a deterministic guard decides when ruling is allowed | Proposed |
| [0009](0009-audience-separation.md) | Every outbound message carries a typed audience; protected information never enters a player-facing prompt | Proposed |
| [0010](0010-ticket-detection-adapter.md) | Ticket detection is a `TicketSource` plugin, configured per event context | Proposed |
| [0011](0011-durable-case-log-and-catch-up.md) | Cases are append-only event logs; on startup the bot reconciles open tickets | Proposed |
| [0012](0012-cost-governor.md) | A budget ledger and a degradation ladder enforce NFR-COST-1/2 | Proposed |
| [0013](0013-golden-evaluation-harness.md) | Golden cases are replayed against the engine with scripted players, a response cache, and affected-case selection | Proposed |
| [0014](0014-internationalisation.md) | All user-facing text and prompts come from locale catalogs; CR/MTR/IPG terms are a protected glossary | Proposed |
| [0015](0015-speech-to-text.md) | Voice, if it ships, goes through an `SttPort`; local transcription only | Proposed (depends on spike S1) |
| [0016](0016-build-and-eval-on-pro-subscription.md) | Build and evaluation run on the owner's Claude Pro subscription; the paid API is used only by the live bot | Proposed |

## Template

```markdown
# ADR-NNNN: <title>

Status: Proposed · Date: YYYY-MM-DD · Requirements: <FR/NFR/D/OQ IDs>

## Context
## Options considered
## Decision
## Consequences
## Revisit when
```
