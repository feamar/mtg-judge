# ADR-0012: A ledger of AI calls and a monthly cap

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-COST-1, NFR-COST-2, R2, OQ-26

## Context

With the deterministic design (ADR-0008), most cases make no AI call. The estimated spend is about $4–11 a month at 430 cases, depending on the library hit rate (ARCHITECTURE.md §9). A cost mechanism is still needed as a safety net (NFR-COST-2), but a multi-level degradation ladder is not.

## Decision

1. **Ledger:** every `LlmPort` call records its role, tokens, computed cost, event, and case. Prices are configuration.
2. **Monthly cap** ($20, configurable). When month-to-date AI spend reaches the cap, the bot switches to **questions-only mode** (owner's answer to OQ-26, 2026-09-25):
    - rules questions are still answered: library answers cost nothing, and fallback answers use the cheapest model;
    - disputes are handed to human judges with the intake facts gathered (FR-ESC-2), and players are told neutrally that a human judge will take it.
3. **Alert:** the owner-only channel gets a message at 80% and at 100% of the cap. The daily summary shows spend and the library hit rate.
4. **Abuse limit:** at most N question cases per player per hour (configurable).

## Consequences

- There's no per-case token budget, no automatic model switching, and no bring-your-own-key. They can be added if real spend ever makes them worthwhile.
- The API key and the ledger exist only in the bot's environment. Build and test spend no API credits (ADR-0016).
