# ADR-0016: Authoring and AI tests run on the owner's Claude Pro subscription

Status: Accepted 2026-09-28 · Date: 2026-09-25 · Requirements: OQ-24, P2, FR-BUILD-1..3, FR-INV-1, FR-Q-4, §8

## Context

The owner decided on 2026-09-25 (OQ-24): **build and test run on this account, within the Claude Pro subscription.** There is no paid API spend for them, including no paid cross-check at release time.

There are two ways of paying:

- **The Pro subscription:** a fixed monthly fee with usage limits. It is for the owner working with Claude.
- **Anthropic API credits:** pay per token. They are needed for the **live bot**, which serves other players around the clock; a personal subscription can't power a service for others. The $20 cap is spent here.

## Decision

1. **Authoring happens in Claude Code sessions** on the owner's account:
    - a *knowledge author* writes ruling entries, procedures, penalty rows, question wording, templates, and lexicon terms, straight into the repository as files;
    - a *case author* writes golden cases, keeping held-out cases outside the repository (ADR-0013).

   The owner approves each item (OQ-27).
2. **The pipeline code never calls a model.** It imports sources, diffs, validates the authored files (schema, citations, completeness), and bundles.
3. **The deterministic golden suite needs no AI** (ADR-0013).
4. **The two small AI test sets** (`interpret`, `reason` fallback) run through Claude Code on the owner's account:
    - either through a small eval-only adapter for `LlmPort` that calls Claude Code headless;
    - or, if that isn't supported or permitted for this use, as an interactive session stepping through the cases.

   The engineer checks which option applies before building it. The bot can never load the eval-only adapter.

## Consequences

- $0 paid spend for build and test. Usage is small: authoring sessions, plus tens of AI test cases per release.
- The AI test sets reach the models by a different route than the live bot does (wrapper, output handling). This is accepted by the owner. The deterministic suite, which covers most behaviour, is unaffected.
- An API account is still needed for the live bot.
