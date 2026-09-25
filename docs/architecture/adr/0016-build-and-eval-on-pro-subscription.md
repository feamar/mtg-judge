# ADR-0016: Build and evaluation run on the owner's Claude Pro subscription

Status: Proposed · Date: 2026-09-25 · Requirements: OQ-24, P2, FR-BUILD-1..3, FR-INV-1, FR-Q-4, §8, NFR-ACC-1 · Changes: ADR-0002 (`build-*` role), ADR-0007 (AI drafting), ADR-0012 §6, ADR-0013 §6

## Context

The owner decided on 2026-09-25 (answer to OQ-24): **all build and test work runs on this account, within the Claude Pro subscription.** There is no paid API spend for building or testing, not even a small cross-check against the paid API at release time (declined explicitly).

There are two separate ways to pay:

- **The Pro subscription:** a fixed monthly fee with usage limits. It is for the owner working with Claude, including Claude Code sessions like the architect's.
- **Anthropic API credits:** pay per token. They are needed for the **live bot**, which serves other players around the clock. A personal subscription can't be used to power a service for other people. The $20 runtime cap (NFR-COST-1) is spent here.

The earlier design used the paid Batch API for the build pipeline's AI drafting and for golden replays. That has to change.

## Decision

1. **The build pipeline's code never calls a model.** It is deterministic: import, normalise, diff, validate, bundle, release report.
2. **AI drafting becomes Claude Code work, done by a *knowledge author* role.** This covers concept tags, procedures, penalty rows, addendum edits, mnemonic drafts, and glossary checks.
    - The pipeline exports **work packets**: JSON files with the exact source sections, the target schema, and a versioned playbook in `pipeline/playbooks/`.
    - A Claude Code session on the owner's account processes the packets and writes drafts to `build/drafts/`.
    - The pipeline validates each draft against the schema, and checks that every cited section resolves.
    - The owner reviews every draft (OQ-27, ADR-0007).
    - A rebuild creates packets only for changed sections, so later rebuilds are small.
3. **Golden cases are written by the *case author* role,** in Claude Code sessions with the owner (ADR-0013 §5).
4. **Golden replays use a subscription `LlmPort` adapter.** It is used only by the `eval` package, on the owner's machine, and routes the judge's task-role calls through Claude Code logged in with the owner's account, instead of the paid API.
    - The bot's composition root **must not** be able to load this adapter. That is enforced by a package boundary and a test.
    - The adapter asks for the same models as the runtime config (Haiku 4.5 for `understand`, `investigate`, and `phrase`; Sonnet 5 for `reason`). If the subscription doesn't offer one of them, the run uses the nearest available model and records the substitution in its report.
    - **Before building it,** the engineer verifies that the current Claude Code headless or Agent SDK options support this use (structured output and model choice). They also confirm that personal, local use in this way fits Anthropic's current terms for the Pro plan. If either check fails, golden replays run as interactive Claude Code sessions that step through the harness. That is slower, but still inside the subscription.
5. **Usage limits** replace the dollar budget:
    - the eval runner is **resumable** (it checkpoints after every case) and runs within the subscription's limit windows;
    - it keeps the response cache and replays only the affected cases (ADR-0013);
    - a full replay of about 1,000 cases may take several days of limit windows, and is needed only when the model or provider changes.
6. **Deterministic checks** (retrieval recall, citations, penalty lookups, required facts, protected-information leaks) need no model and run on every commit, as before.
7. **The first live weeks double as calibration.** The runtime ledger (ADR-0012) records real token use per case from the first real case, and the governor enforces the cap from day one.

## Consequences

- **$0 marginal spend** for build and test. The only paid AI spend is the live bot's, capped at $20 a month.
- **Weaker evidence, accepted by the owner:** tests reach the same model family by a different route than production (wrapper prompt, output handling, possibly a substituted model). A golden pass is strong evidence, but not proof, that the live bot behaves the same way. The mitigations are the deterministic guard and verifier (ADR-0008), which don't depend on the route, plus the runtime ledger and escalation data from the first live weeks.
- **Build and test work competes with the owner's other use of the Pro plan,** because both draw on the same usage limits. The planner should schedule large drafting and replay jobs accordingly.
- An API account is still needed before launch, for the live bot only.

## Revisit when

- the owner changes the budget decision;
- the subscription route turns out to be unavailable or not permitted for this use;
- live results diverge noticeably from golden results.
