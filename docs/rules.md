# Rules

State the rules every session follows, and what enforces each.

Drafted 2026-10-13 by mlmd's foundation pass from mtg-judge (`cycle/E3`, `5210244`). No gate exists
in this repository yet: the gates are built in phase 2. Until then a rule that will be gated is
marked **Reviewed (gated from phase 2)**: a person checks it at each document's review.

## R1 No paid API spend for building or testing
- **Says:** sessions build and test within the owner's Claude Pro subscription. No session calls a
  paid model API, including no paid cross-check against the live API.
- **From:** PRD D45, ADR-0016. The $20 monthly cap covers the live judge only.
- **Tier:** Reviewed, at each document's review and at each item's attack.

## R2 No AI session reads the held-out set
- **Says:** held-out golden cases are stored outside this repository and never shown to a session
  that builds or authors knowledge. Cases a session has already read can't become held-out.
- **From:** PRD D49, ADR-0013 §4.
- **Tier:** Reviewed (gated from phase 2: an ignore rule and a check that no held-out path is
  tracked).

## R3 No raw player data in the repository
- **Says:** raw league exports and any text with real Discord names or IDs never enter the
  repository. Pseudonymisation is done by a script, which fails when a known name or ID survives.
- **From:** PRD D51, NFR-PRIV-1; `docs/architecture/league-export-intake.md`.
- **Tier:** Reviewed (gated from phase 2).

## R4 No user-facing text in code
- **Says:** no user-facing string and no prompt text is written in code, in English or any other
  language. It comes from locale catalogs.
- **From:** PRD NFR-I18N-1, ADR-0014.
- **Tier:** Reviewed (gated from phase 2: a lint for string literals).

## R5 The ruling core does no I/O
- **Says:** the core that rules imports nothing from Discord, the AI provider, storage, Node
  built-ins or any adapter. Everything outside reaches it through ports.
- **From:** ADR-0001, ARCHITECTURE §2; serves NFR-EXT-1 and NFR-TECH-1 (the provider is replaceable
  without changing ruling logic).
- **Tier:** Reviewed (gated from phase 2). mtg-judge gates it with `pipeline/check-deps.mjs`; that
  check stays in mtg-judge. To be confirmed when `docs/architecture.md` is written.

## R6 Only the owner makes a drafted artifact reviewed
- **Says:** every AI-drafted procedure, penalty-table row, addendum edit, library entry and
  answering strategy stays marked as a draft until the owner approves it. No session marks one
  approved, and no release contains a draft.
- **From:** PRD FR-BUILD-4, D47; ADR-0007 §2.
- **Tier:** Reviewed (gated from phase 2: the bundle build refuses a draft).

## R7 Only the owner changes what a golden case expects
- **Says:** the golden set defines a correct ruling. No session changes a golden case's expected
  outcome, citations or status. A case that looks wrong is raised as an open question for the
  owner.
- **From:** PRD §8; ADR-0013.
- **Tier:** Reviewed.

## Set aside: the source's process rules

Not imported, because mlmd's own process replaces them: ADR-0023 (RUP and PDD cycles, 15 roles,
gates G0–G8 and H1–H6), ADR-0024 (the owner boots every session; STATUS lines), "the AI merges into
main after asking the owner" (mlmd's Merge stop does this), "an accepted ADR is never edited" (mlmd
keeps decisions in its documents), and "the architect may only add open questions".
