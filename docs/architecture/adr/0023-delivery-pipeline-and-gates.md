# ADR-0023: Delivery pipeline: RUP stages, agent roles, owner approvals and mechanical gates

Status: **Proposed** 2026-09-28 · Requirements: P2, FR-BUILD-1..4, NFR-ACC-1..3, NFR-IMP-1, NFR-EXT-1, NFR-TECH-1, §8 · Extends: ADR-0013 (harness), ADR-0016 (Pro plan) · Detail: `docs/process/DEVELOPMENT-CASE.md`

## Context

The system is built almost entirely by AI agents in Claude Code sessions on the owner's Pro plan (ADR-0016). The owner asked for the following (2026-09-28):

- a repeatable delivery pipeline that follows the Rational Unified Process;
- highly documented handoffs;
- an inspectable deliverable the owner approves at the end of every stage;
- a project-manager agent that boots the next agent;
- tests that gate whether an implementation is good, with feedback to the builder;
- the smallest feasible token use.

The owner named three building blocks:

- [gatechain](https://github.com/AlexTavor/gatechain): mechanical validation gates, with exit codes 0, 1 and 2;
- [proof-driven-development](https://github.com/AlexTavor/proof-driven-development) (PDD): CARVE → SHIP → PROVE, with `pdd check` gates, and `pdd prove` mutation testing, which plants small bugs to check that the tests catch them;
- [engineering-discipline](https://github.com/AlexTavor/engineering-discipline): Claude Code skills for test adequacy and code structure.

## Options considered

1. **One long agent session per milestone.** Simple, but the context grows with every task, handoffs are implicit, and the owner has nothing to approve until the end.
2. **A script-driven loop with an overseer woken only on escalation.** Cheapest in tokens, but the stages weren't separate RUP roles, and the owner had no approval point per stage. The owner rejected it as "a test flow, not a build pipeline".
3. **RUP stages with one role per agent, document handoffs, owner approval per stage, the project manager booting roles as fresh subagents, and mechanical gates inside the implementation stage.**

## Decision

Option 3.

1. **Phases and iterations** follow RUP: Inception, Elaboration (E1–E4, ending at LCA with the walking skeleton), Construction (C1–C4, ending at IOC), Transition (T1–T2, ending at PR).
2. **Fifteen roles**, the owner plus fourteen agents, each defined by one file in `.claude/agents/`. Only the project manager runs on Opus; the others run on Sonnet.
3. **Every stage writes a stage report.** Part A is the owner's approval package; Part B is the handoff to the next agent. **No stage starts on an unapproved report.**
4. **The project manager is the only agent that boots other agents.** By default it boots them as Claude Code subagents; the fallback is headless `claude -p --agent`, if E3's check (T-P4) finds subagents unsuitable. Each boot is a fresh context holding only its handoff.
5. **Tests are written by a separate agent, before the code, and then locked.** A code task is accepted by gates G0–G8, not by opinion:
    - the test lock and allowed paths;
    - build, type, lint and dependency checks;
    - the task tests and the regression suites;
    - `gatechain --fast`, and `--push` at integration;
    - `pdd check`;
    - `pdd prove` (mutation adequacy);
    - for knowledge tasks: bundle and citation validation plus golden cases.
6. **Failures return as digests** of at most 40 lines. The budgets are 3 attempts, 2 PROVE rounds, and 1 project-manager escalation action, then the owner.
7. **Spec problems become change requests** decided by the owner. No agent edits requirements, ADR decisions, golden cases or approved bindings.
8. gatechain and PDD are pinned git submodules, wrapped by `pipeline/gate.mjs`, so either can be replaced without changing the stages.

## Consequences

- The owner approves about 7 stage reports per iteration, plus change requests and knowledge review batches. That fits the owner's stated ~40 h/week.
- Tokens are spent per stage on small, fresh contexts. The project manager reads only status lines, Part A headings and digests. Usage per stage is logged for tuning.
- It adds three third-party tools by a single author. Mitigations: pinned commits, a licence and Windows check in E3, and replaceability behind the gate script.
- Iteration E3 (building the pipeline) comes before any product code.
- It supersedes the task-schedule shape of plan v1 and the script-loop shape of plan v2. Their task content survives in `docs/plan/backlog.json`.

## Revisit when

- E3's dry run shows a handoff that isn't self-sufficient, or subagents can't run a stage.
- The token use per iteration exceeds what the Pro plan allows.
- gatechain or PDD can't run on the host.
