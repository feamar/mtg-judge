# ADR-0004: SQLite for runtime state; a separate read-only SQLite knowledge bundle

Status: Proposed · Date: 2026-09-25 · Requirements: FR-LOG-1..3, D39, FR-BUILD-1..3, NFR-VER-1, D31, NFR-COST-1

## Context

There are two very different kinds of data:

1. **Knowledge:** source sections, card data, procedures, penalty tables, concepts, and mnemonics. It is produced at build time, is read-only at run time, is versioned per release, and must eventually be shippable to a phone (D31).
2. **Runtime state:** event contexts, admin and TO role mappings, cases and their event logs, the budget ledger. It is small at pilot volume (at most about 430 cases a month, each deleted after 7 days).

## Options considered

- **SQLite for both (chosen).** Zero cost and no extra service to run. The knowledge bundle is a single file that can be diffed, hashed, shipped, and opened on a phone. The FTS5 full-text index is built in (ADR-0005).
- **PostgreSQL + pgvector,** as in the ChatGPT package. Stronger for concurrent writers and scale-out, but it is an extra service on the host and adds nothing at pilot volume.
- **JSON files.** Simplest, but no querying, no transactions, and no full-text search.

## Decision

- **`knowledge-<bundleVersion>.sqlite`**: produced by the pipeline and opened **read-only** at run time. Its manifest table records the version, content hash, and effective date of every source document, plus the pipeline version (NFR-VER-1). The runtime can hold two bundles at once, which allows a controlled switch-over during an event.
- **`runtime.sqlite`**: WAL mode, reached only through repository interfaces in `core` (`CaseStore`, `EventContextStore`, `BudgetLedger`). No SQL outside the SQLite adapter.
- **Retention (D39):** a job deletes every case and its events once `closedAt + 7 days` has passed. Cases never closed are deleted once `openedAt + 7 days` has passed, after a handoff note to the judge-only channel. Exported golden candidates are pseudonymised on export and are not case records (FR-LOG-3).
- **Deletion on request (NFR-PRIV-1):** an Admin command deletes every case event authored by a given Discord user, and replaces that participant's references with a tombstone.

## Consequences

- One process writes runtime state. That is fine for one bot instance. Scaling out means swapping the repository adapter for PostgreSQL. `core` doesn't change.
- The knowledge bundle doubles as the future on-device rules store (D31) and as the golden-set replay fixture: every eval run names the bundle it used.

## Revisit when

More than one bot instance is needed, or the knowledge bundle outgrows what a phone can reasonably hold.
