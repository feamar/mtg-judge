# ADR-0006: Card data from Scryfall bulk files

Status: Proposed · Date: 2026-09-25 · Requirements: OQ-5, FR-Q-1, FR-Q-2, FR-BUILD-1, NFR-VER-1, R10, OQ-12

## Context

OQ-5 leaves the choice between Scryfall and Gatherer to the architect. The judge needs current Oracle text, the characteristics needed for rules reasoning (types, mana value, color identity, and so on), and the official rulings, all versioned and available offline, because the pipeline builds a bundle (ADR-0007).

## Options considered

| | Scryfall bulk data | Gatherer |
| --- | --- | --- |
| Access | Documented bulk JSON files (`oracle_cards`, `rulings`), refreshed daily, no API key | Website. No documented bulk export for third parties. |
| Oracle text | Current Oracle text per `oracle_id` | Authoritative publisher of Oracle text |
| Rulings | Official rulings are included and marked by source | Official |
| Versioning | Each bulk file has an `updated_at` timestamp | No simple way to snapshot |
| Risk | Third-party site. Its terms and WotC's Fan Content Policy apply (OQ-12). | Scraping is fragile and may not be permitted |

## Decision

- The pipeline downloads the Scryfall **`oracle_cards`** and **`rulings`** bulk files on each build (a manual step, D25). It records their `updated_at` and hash in the bundle manifest, and stores the cards keyed by `oracle_id`.
- Only rulings whose source is Wizards of the Coast are used as normative card rulings. Any other rulings are dropped.
- **Gatherer stays the authority:** the pipeline spot-checks the Oracle text of every card named in the golden set against Gatherer, as a manual review item in each release checklist.
- **Card knowledge is prefetched:** at build time, each card's rules-relevant features (for example, which abilities are mana abilities) are derived and stored in the bundle next to its Oracle text. Strategies decide on these features without AI (ADR-0017).
- The runtime never calls Scryfall. Everything comes from the bundle, which keeps run time deterministic and offline-capable (D31).
- The pipeline follows Scryfall's published API guidelines (a descriptive User-Agent, rate limits).

## Consequences

- A card changed by an Oracle update between rebuilds shows up in the build diff, and the golden cases that cite it are flagged as stale (PRD §8).
- Between rebuilds the bundle can lag behind Gatherer by up to one rebuild cycle. This is the explicit consequence of D25.

## Revisit when

OQ-12 finds a licensing problem with Scryfall-derived data, or WotC publishes an official bulk Oracle export.
