# ADR-0022: Integrity modes, integrity categories, and remedy authority

Status: Proposed · Date: 2026-09-28 · Requirements: D57–D59 (PRD v0.3), FR-POL-4, FR-ESC-1, FR-ESC-4, FR-ESC-5, FR-CTX-1, OQ-14 · Extends: ADR-0009, ADR-0021 · Source: the Judge Lab test bundle's metadata (`golden/import/judge-lab-architecture-testset.json`: `integrity_settings`, `integrity_workflow_contract`, `remedy_authority`), adopted by the owner on 2026-09-28

## Context

The owner's Judge Lab bundle carries 38 integrity cases, and they test workflow rules that weren't yet in the PRD. The owner adopted them as requirements on 2026-09-28. A correct ruling alone isn't enough: the app can still fail by accusing someone without support, exposing protected reasoning, doing a backup it isn't allowed to do, or escalating an ordinary mistake.

These are **application workflow rules**. They don't change the CR, the IPG, or the MTR.

## Decision

**1. Remedy authority** (D57). The bot may itself apply:

- **simple backups that the policy permits**;
- **prescribed partial fixes** (for example the IPG 2.5 partial fixes).

It needs no repeated authorisation for these. **A full backup is never executed by the bot**: it is always handed off to a human judge.

**2. Integrity mode per event** (D58). This is an event-context field, `integrityMode`, set by the TO:

- **`presume_good_faith`** (the default): ordinary rules and penalties apply, under a rebuttable presumption of good faith;
- **`request_table_confirmation`**: the bot invites the table to confirm the account, with the template *"Can the other players confirm the described sequence, or add any specific facts we have missed?"* It records what they report, not a vote, and not proof of innocence.

**Peer reports** may support good faith. They can **never** prove intent, **never** override strong indicators, are **not** a majority vote, and **declining never implies guilt**.

**3. Integrity categories** (D59). Every relevant case is classified deterministically from procedure predicates (ADR-0008):

| Category | What the bot does |
| --- | --- |
| `PERMITTED_OR_NOT_RELEVANT` (for example, not reminding an opponent of their trigger) | No integrity step at all |
| `ORDINARY_ERROR` | Good-faith handling. Necessary factual checks are done; missing facts are **asked for**, because good faith can't supply them. In table-confirmation mode: pending → ask the table; supports / declined / no new facts → apply the ordinary ruling; disagrees → clarify the specific facts (disagreement alone isn't strong evidence). |
| `STRONG_INDICATORS` | A **mandatory protected handoff** to a human, in both modes. Table support can't override it. No finding of guilt. |

**Not strong on its own:** an ordinary error, a detrimental missed trigger, a repeated error count, another player's refusal or disagreement, or not reminding an opponent of their trigger. This is the owner's answer to the core of OQ-14. Concrete strong indicators are defined case by case in the integrity test cases, for example a pattern of sleeve marks that distinguishes exactly the win-condition cards.

**4. Handoffs that can't be overridden**, whatever the integrity mode, table support, or event policy:

- strong indicators;
- a full backup;
- a player asking for a human judge.

These join ADR-0021's major-infraction handoff.

**5. The neutral handoff message** (the owner's wording, replacing earlier templates):

> *"Please pause the game and call a human Judge. Keep the current game state unchanged until they arrive."*

The bot still sends the protected handoff to the judge-only channel itself (ADR-0009, ADR-0021). The player message stays neutral and never contains the reason.

**6. Testing:** each integrity case runs once per available integrity setting (ADR-0013 §6).

## Consequences

- Ordinary mistakes stay ordinary. There's no escalation by suspicion alone, which matches "we are mostly here to help".
- **Data model:** the event context gains `integrityMode`. Procedures gain `integrityCategory` predicates, and each remedy step is tagged `simple-backup | partial-fix | full-backup`, so the full-backup handoff is deterministic.
