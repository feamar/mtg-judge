# E2 · Process design: approval package

Role: process engineer (planner) · Branch: `plan/v1` · Inputs: `docs/handover/02-architect-to-planner.md`, owner answers of 2026-09-28

**Decision:** REJECTED (2026-09-29): "Construction and Transition should be replaced with more PDD type processes. Where is my test hardening?"
<!-- Write one of: APPROVED · APPROVED WITH NOTES: … · REJECTED: … -->

---

## Part A: for the owner

### 1. What was done

The delivery pipeline you asked for, following RUP:

- **phases and iterations:** E2 now, then E3 builds the pipeline, E4 is the walking skeleton (LCA), C1–C4 are construction (IOC), T1–T2 are transition (PR);
- **15 roles:** you, plus 14 agents, each with its own instruction file;
- **the same 7 stages in every iteration:** brief → design pack → test pack → increment → build & evaluation → review → assessment. Each stage ends in a report whose Part A is your approval package, and after your approval **the project manager boots the next agent**.
- **gates:** inside the increment stage, tests written first by a different agent and then locked, plus gatechain and PDD `prove` (mutation testing), decide whether code is good. A failure goes back to the builder as a short digest, and after 3 tries the project manager steps in. Spec problems come to you as change requests.
- **token rules:** fresh sessions, handoff-only reading, slices instead of whole documents, and a 40-line digest cap. The project manager never reads code.

### 2. How to inspect it

| What | Where | Time |
| --- | --- | --- |
| **The process** (start here) | [DEVELOPMENT-CASE.md](../../process/DEVELOPMENT-CASE.md): §2 phases, §3 roles, §4 the 7 stages, §7 how approval and booting work | 15 min |
| What each iteration delivers and what you inspect | [PLAN.md](../../plan/PLAN.md) §2 | 10 min |
| The decision, for the record | [ADR-0023](../../architecture/adr/0023-delivery-pipeline-and-gates.md) | 5 min |
| The agents: read at least these three | [.claude/agents/project-manager.md](../../../.claude/agents/project-manager.md), [test-implementer.md](../../../.claude/agents/test-implementer.md), [implementer.md](../../../.claude/agents/implementer.md) | 10 min |
| The other 11 agents | `.claude/agents/` | optional |
| What every agent must obey | [AGENT-RULES.md](../../process/AGENT-RULES.md) | 3 min |
| What a handoff looks like | [templates/stage-report.md](../../process/templates/stage-report.md), [design-card.md](../../process/templates/design-card.md), [change-request.md](../../process/templates/change-request.md) | 5 min |
| Where the tasks went | [backlog.json](../../plan/backlog.json): 78 tasks, each with an `iteration` and an `agent` | optional |
| The first instructions for the project manager | [handover 03](../../handover/03-planner-to-project-manager.md) | 3 min |

### 3. Gate results

| Check | Result |
| --- | --- |
| Every role in DEVELOPMENT-CASE §3 has an agent file | ✓ 14/14 |
| Every backlog task has an iteration (or a stated trigger) and an agent | ✓ 76 placed; 2 wait on triggers (T-J4 on OQ-39, T-J5 on your `SCN:` prompts) |
| The PRD is unchanged | ✓ (no requirement edited, no new OQ needed) |
| Nothing merged into `main` | ✓ |

### 4. Decisions you need to take

1. **Approve ADR-0023** (the pipeline decision). *Recommended: approve.*
2. **Boot mechanism.** The default is that the project manager starts the other agents as subagents inside its own session. Headless `claude -p` is the fallback. E3's task T-P4 tests both, and whether headless use is fine on your Pro plan. *Recommended: approve the default; T-P4 confirms it.*
3. **The project manager on Opus, everything else on Sonnet**, as you answered earlier. *Confirm.*
4. **Merge `plan/v1` into `main`** once you approve. The project manager then starts E3 from `main`.
5. **Close the planning phase** (AGENTS.md: only you end a phase).

### 5. What the next stage will do

You start `claude --agent project-manager` and say "continue". It opens E3 and writes the E3 brief, which is your next approval package. After that, the toolsmith builds the pipeline tooling, and a dry run pushes one real task through every stage.

---

## Part B: handoff to the project manager

- **Next role:** project-manager
- **Job:** open iteration E3, as in `docs/handover/03-planner-to-project-manager.md`.
- **Read:** `docs/handover/03-planner-to-project-manager.md`; PLAN.md §2 (E3); the `backlog.json` entries with `iteration: E3`.
- **Allowed paths:** `docs/iterations/E3/`
- **Constraints:** the owner's notes on this package, if any. Only boot after `plan/v1` has been merged into `main`.
- **Open issues:** OQ-37..41 (PRD §12), none blocking E3.
- **Done when:** `docs/iterations/E3/01-brief.md` is written and awaiting the owner.
