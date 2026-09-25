# ADR-0002: Anthropic Claude behind a provider-neutral `LlmPort`, used only at the edges

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-TECH-1, D41, NFR-COST-1, NFR-LAT-1, P2, NFR-PRIV-1

## Context

The judge is deterministic (ADR-0008). At run time the AI does only two things:

- interprets free text that deterministic matching couldn't map;
- answers rules questions the approved library doesn't cover yet, which the owner chose on 2026-09-25 over handing them to a human.

The provider must be replaceable without changing ruling logic (D41).

## Options considered

- **Anthropic Claude (chosen).** Structured outputs, a cheap model for mapping text to closed lists (Haiku 4.5 at $1/$5 per million input/output tokens), and a stronger one for the rare rules-reasoning fallback (Sonnet 5 at $2/$10).
- **Another hosted provider.** Viable behind the port. There's no reason to prefer one now.
- **A local model on the owner's GPU.** Possible later for `interpret`, which is a narrow classification task (D31, on-device use). It is too risky for `reason` today.

## Decision

1. **`LlmPort`** takes a task role, a prompt from the locale catalogs (ADR-0014), and a JSON schema. It returns validated structured output plus token usage. Ruling logic never sees a provider or a model name.
2. **Only two task roles:**

| Role | When | Output | Default model |
| --- | --- | --- | --- |
| `interpret` | Deterministic matching or answer normalising failed | A closed-list mapping: cards, concepts, intents, infraction triggers, case type, or one of a fact's options; or "none". It never produces free text for players. | `claude-haiku-4-5` |
| `reason` | A rules question with no library entry | A cited answer, with a citation chain restricted to the retrieved IDs; verified before anyone sees it (ARCHITECTURE.md §5.6) | `claude-sonnet-5`, adaptive thinking, modest effort |

3. **Identity minimisation:** prompts carry seat labels (`P1`…`Pn`), never Discord names or IDs, and only the player-safe projection of the case (ADR-0009).
4. **Build and test** don't go through this port at run time. They use Claude Code on the owner's Pro plan (ADR-0016).

## Consequences

- AI spend scales with library **misses**, not with case volume (ARCHITECTURE.md §9).
- Replacing the provider means one adapter, plus re-running the small AI test sets (ADR-0013).
- Pseudonymised player text reaches a third-party processor on the fallback paths only. The owner accepted this (OQ-23). A privacy notice is recommended.

## Revisit when

The `interpret` or `reason` test sets show the defaults aren't accurate enough, or a local model becomes good enough for `interpret`.
