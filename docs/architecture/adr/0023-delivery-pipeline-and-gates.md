# ADR-0023: Delivery pipeline: RUP phases, PDD cycles, agent roles, owner approvals and hardening gates

Status: **Proposed** 2026-09-29 (revision 2, after the owner rejected revision 1's Construction and Transition) · Requirements: P2, FR-BUILD-1..4, NFR-ACC-1..3, NFR-ROB-1, NFR-IMP-1, NFR-EXT-1, NFR-TECH-1, §8 · Extends: ADR-0013, ADR-0016, ADR-0018 · Detail: `docs/process/DEVELOPMENT-CASE.md`

## Context

The system is built almost entirely by Claude Code agents on the owner's Pro plan (ADR-0016). The owner asked for:

- a repeatable delivery pipeline following RUP, with highly documented handoffs;
- an inspectable deliverable that the owner approves at the end of every stage;
- a project manager that boots the next agent;
- tests that gate the implementation, with feedback to the builder;
- the fewest feasible tokens.

The owner rejected revision 1, whose Construction and Transition used generic stages ("where is my test hardening?"). The owner asked for **PDD-type processes** there, based on [proof-driven development](https://github.com/AlexTavor/proof-driven-development), [gatechain](https://github.com/AlexTavor/gatechain) and [engineering-discipline](https://github.com/AlexTavor/engineering-discipline).

## Options considered

1. **A task schedule with one long session per milestone** (plan v1). There are no handoffs or approvals, and the context grows.
2. **A script loop with an overseer woken on escalation** (plan v2). Cheap, but it had no roles or owner approvals: "a test flow, not a build pipeline".
3. **RUP stages throughout** (revision 1). Its stages were brief, design, tests, increment, evaluation, review, assessment. Rejected: it had no characterisation before change, and no test hardening beyond one mutation check per task.
4. **RUP phases, with PDD cycles from the walking skeleton onwards, and a separate test-hardening stage with owner-set thresholds** (this revision).

## Decision

Option 4.

1. **Phases** follow RUP (Inception, Elaboration, Construction, Transition; LCO, LCA, IOC, PR). E3 builds the tooling. **E4 and C1–C4 are PDD cycles:** MAP → TRIAGE (owner) → CARVE → PIN → SHIP → PROVE/HARDEN → RE-MAP. **Transition** is PROVE ALL → RELEASE PIN → DEPLOY → PILOT MAP.
2. **Fifteen roles:** the owner plus 14 agents, each with one file in `.claude/agents/`. Only the project manager runs on Opus.
3. **Every stage writes a stage report.** Part A is the owner's approval package; Part B is the handoff. No stage starts on an unapproved report, and **the project manager is the only agent that boots agents** (as subagents by default; headless `claude -p` is the fallback, decided in E3).
4. **Behaviour is pinned before it changes.** The pinner writes characterisation tests for every touched function, and spec tests from the cards, before any implementation. They are locked. After release, the v1.0 baseline pins all released behaviour.
5. **SHIP** accepts a unit on gates G0–G5 (or G8 for knowledge): test lock and paths, build, the unit's tests, regression including every pin, `gatechain --fast`, and `pdd check` in block mode. Failures return as digests of at most 40 lines; the budgets are 3 attempts, then the project manager, then the owner.
6. **Test hardening is a separate stage with a separate agent** (the test hardener, which writes tests only), with gates H1–H6:
    - `pdd prove`: 100% of named boundaries;
    - `pdd grade`: ≥ 90% for `core`, ≥ 75% elsewhere (owner, 2026-09-29; per-module exceptions only through TRIAGE);
    - robustness via noisify, with zero confidently wrong answers;
    - property tests;
    - integrity, near-miss and leak tests, with zero leaks;
    - `gatechain --push`.

   A hardened test that exposes a real bug sends the unit back to SHIP.
7. **Spec problems become change requests** that the owner decides. No agent edits requirements, ADR decisions, golden cases or approved bindings.
8. **gatechain and PDD are pinned git submodules** behind `pipeline/gate.mjs`, so they can be replaced.

## Consequences

- The owner approves 6 stage reports per cycle and takes the TRIAGE decisions. That fits the owner's ~40 h/week.
- Hardening adds a stage and tests to every cycle. In exchange, "green" means proven: mutation grades, noise, properties and leaks are measured, not assumed.
- Tokens: fresh, small contexts per stage; the project manager reads only status lines and report headings; token use is logged per stage.
- There are three third-party tools by a single author: they are pinned, checked in E3 for licence and Windows support, and replaceable behind the gate script.
- Plans v1 and v2 and revision 1 are superseded. Their task content survives in `backlog.json`.

## Revisit when

- The E3 dry run shows a handoff that isn't self-sufficient, or subagents can't run a stage.
- The thresholds prove too costly or too weak: RE-MAP proposes, the owner decides.
- gatechain or PDD can't run on the host.
