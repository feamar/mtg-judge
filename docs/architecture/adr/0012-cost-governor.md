# ADR-0012: Budget ledger and degradation ladder

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-COST-1, NFR-COST-2, R2, NFR-LAT-1, OQ-24, OQ-26

## Context

The runtime cap is $20 a month (NFR-COST-1). The product owner confirmed on 2026-09-25 that build and evaluation spend is a **separate budget**, not yet sized (OQ-24). NFR-COST-2 asks the architect to propose how costs are kept under the cap.

## Decision

1. **Ledger.** Every `LlmPort` and `SttPort` call records its token or minute usage and its computed cost, tagged by `budgetScope` (`runtime` or `build-eval`), event, case, and task role. Prices are configuration.
2. **Per-case ceiling.** A soft token budget per case (default derived from spike S3). A case that exceeds it is handed off with its facts (FR-ESC-2), because an unusually expensive case is usually a hard case.
3. **Monthly runtime ladder**, evaluated before each call from month-to-date spend against a *linear* allowance (days elapsed ÷ days in month × cap):

| Level | Trigger (month-to-date spend vs. allowance) | Behaviour |
| --- | --- | --- |
| L0 Normal | ≤ 100% | Default model routing |
| L1 Lean | > 100% | `reason` runs at lower effort, retrieval context is trimmed, the Haiku-first route is used for rules questions tagged simple by the concept index |
| L2 Essential | > 120%, or 85% of the full monthly cap spent | Only dispute rulings and rules questions; no deep "outside a game" explanations (FR-Q-5); the verifier retry is dropped (a failure escalates instead) |
| L3 Cap reached | 100% of the cap spent | **Waiting on OQ-26.** The proposed default is to hand every new case to human judges with the intake facts gathered (FR-ESC-2), and tell players neutrally that a human judge will take it. |

4. **Bring-your-own key (NFR-COST-2 option):** the event context may hold a TO-supplied API key, stored encrypted. Spend on that key is tracked separately and doesn't count toward the owner's cap. It is not built in the MVP, but the ledger's `payer` field keeps it possible.
5. **Rate limit** per player per event, against abuse: at most N open question-cases per player per hour, configurable.
6. **Build and eval spend** runs through the Batch API (50% off). It goes to the `build-eval` scope and is reported per pipeline run. It never touches the runtime cap.

## Consequences

- The owner sees spend per case, per role, and per event, which is exactly the data needed to tune model routing.
- Level changes are logged and reported to the owner-only channel.
