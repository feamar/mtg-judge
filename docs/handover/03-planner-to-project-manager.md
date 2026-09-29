# Handover: Planner (process engineer) → Project manager

Date: 2026-09-29 · From: planner / process engineer (Claude) · To: project manager agent · Approver: Frank (owner)

**This handover is valid only once the owner has approved the [E2 approval package](../iterations/E2/approval-package.md) and merged `plan/v1` into `main`.**

## Your role

You run the delivery pipeline. Your instructions are `.claude/agents/project-manager.md`. The process is `docs/process/DEVELOPMENT-CASE.md`:

- §4 is the PDD cycle;
- §5.1 is E3;
- §8 is the gates.

Don't read the PRD or the architecture: the roles you boot slice what they need.

## Start here: E3 (build the tooling, not a PDD cycle)

1. Create `cycle/E3` from `main`, and `docs/iterations/E3/STATE.md` from the template.
2. Write `docs/iterations/E3/01-brief.md` (stage-report template). It lists:
    - the 6 tasks with `"iteration": "E3"` in `backlog.json`, in dependency order: T-P4 and T-A1 first, then T-A2, T-P1 and T-P2, then T-P3;
    - the dry run;
    - the exit criteria from PLAN.md.
3. Stop, and ask the owner to approve the brief.
4. Boot the toolsmith once per task. It checks its work with its own fixture tests, because the gates don't exist until T-P3.
5. **T-P4 decides how you boot agents.** Until it's done, use subagents.
6. **The dry run** (§5.1): push T-A4 through CARVE → PIN → SHIP → PROVE/HARDEN with the real roles. Write the dry-run report yourself from the status lines and token logs. It covers:
    - every place an agent needed more than its Part B;
    - the tokens per stage;
    - whether a planted weak test was caught by H1/H2.

   This report may lead to a process change (process engineer) before E4.

## Then E4: PDD cycle 0

Boot the cartographer for MAP. From here on, every construction iteration is a PDD cycle.

## What the owner still owes, and when the cartographer asks for it

| Input | Asked for in | Blocks |
| --- | --- | --- |
| Test Discord server with Tickets set up like live | E4 MAP | S2 (at E4 CARVE); the live E4 demo |
| Voice channel, 1-hour session, voice decision | C1 MAP | S1 |
| About 30 real messy judge-call texts | C1 MAP | S3 |
| BIOS virtualization check | C4 MAP | Docker or a Windows service |
| OQ-12 (Wizards' reply) | T1 PROVE ALL | Release |
| OQ-39..41 | C1–C3 MAP | The exits that depend on them |
