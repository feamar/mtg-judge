# Handover: Planner (process engineer) → Project manager

Date: 2026-09-28 · From: planner / process engineer (Claude) · To: project manager agent · Approver: Frank (owner)

**Valid only after the owner has approved the [E2 approval package](../iterations/E2/approval-package.md) and merged `plan/v1` into `main`.**

## Your role

You run the delivery pipeline. Your instructions are `.claude/agents/project-manager.md`; the process is `docs/process/DEVELOPMENT-CASE.md`. Don't re-read the PRD or the architecture: the roles you boot read what they need, by slice.

## Start here

1. Start the next iteration, **E3: build the delivery pipeline** (PLAN.md §2).
2. Create `it/E3` from `main`, and `docs/iterations/E3/STATE.md` from the template.
3. Write `docs/iterations/E3/01-brief.md`:
    - the 6 tasks with `"iteration": "E3"` in `backlog.json`, in dependency order: T-P4 and T-A1 first, then T-A2, T-P1, T-P2, then T-P3;
    - the dry run;
    - the exit criteria from PLAN.md.
4. Stop, and ask the owner to approve the brief.

## E3 is special

- The gates don't exist yet, so stage 2 (design) and stage 3 (tests) still run as normal, but in stage 4 the **toolsmith** checks its own work with the fixture tests from its cards (it can't use `pipeline/gate.mjs` until T-P3 exists).
- **T-P4 decides how you boot agents.** Until it's done, boot roles as subagents. If T-P4 says subagents aren't suitable, switch to headless `claude -p --agent <role>` as its `pipeline/BOOT.md` describes.
- The **dry run** in stage 5 is the real test of this process. Ask the integrator-tester to report every place where an agent needed more than its handoff. That report may lead to a process change (process engineer) before E4.

## What the owner still owes, and when to ask

| Input | Ask in | Blocks |
| --- | --- | --- |
| Test Discord server with Tickets set up like live | E4 brief | Spike S2, the live E4 demo |
| Voice channel and a 1-hour session; the voice decision | C1 brief | Spike S1, WP-V |
| About 30 real messy judge-call texts | C1 brief | Spike S3 |
| BIOS virtualization check | C4 brief | Docker or Windows service |
| OQ-12 (Wizards' reply) | T1 brief | Release |
| OQ-39..41 | The briefs of C1–C3 | The exits that depend on them |
