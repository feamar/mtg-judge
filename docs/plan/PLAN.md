# AI MTG Judge: Iteration plan (v3)

Status: **proposed** (Elaboration 2) · Approver: Frank · Process: [DEVELOPMENT-CASE.md](../process/DEVELOPMENT-CASE.md) · Tasks: [backlog.json](backlog.json)

This is RUP's software development plan: which iteration delivers what, and what the owner inspects to approve it. **How** each iteration runs (roles, stages, handoffs, gates) is in the development case. It has no dates: iterations start when the previous one's assessment is approved.

Replaces plan v1 (a task schedule) and v2 (a test loop). Their task content lives on in `backlog.json`, which now carries an `iteration` and an `agent` field per task. Their milestone definitions, test base and risks live in [ROADMAP.md](ROADMAP.md), which is kept as reference. Its dates are not part of the plan.

## 1. How to read an iteration row

- **Scope:** the `backlog.json` tasks with that `iteration` value, plus the spikes listed. The project manager orders them by `deps` in the iteration brief.
- **Exit criteria:** what stage 5 measures and stage 7 proves. They come from the milestone exits in ROADMAP §3.
- **The owner inspects:** the headline deliverable of the assessment. Every stage in between also ends with its own approval package (DEVELOPMENT-CASE §4).
- **Owner inputs:** things only the owner can provide. The project manager asks for them in the iteration brief. A spike without its inputs waits; the rest of the iteration doesn't.

## 2. Iterations

### E2: Process design (now)

- **Scope:**
    - this plan;
    - the development case;
    - `AGENT-RULES.md`;
    - the templates;
    - 14 agent files;
    - ADR-0023;
    - handover 03.
- **Exit:** the owner approves the [E2 approval package](../iterations/E2/approval-package.md).
- **The owner inspects:** that package, the project chart, and a read of any agent file.

### E3: Build the delivery pipeline

- **Scope** (6 tasks, toolsmith):
    - T-A1 monorepo scaffold;
    - T-A2 CI;
    - T-P1 gatechain + PDD + engineering-discipline;
    - T-P2 slice tool;
    - T-P3 gate script;
    - T-P4 boot mechanism check.

  Then the dry run (integrator-tester): T-A4 through stages 2–5.
- **Exit:**
    - every gate G0–G8 catches its planted failure;
    - the project manager boots each role and reads back its status line;
    - in the dry run, no agent needed to read beyond its handoff;
    - token cost per stage is recorded.
- **The owner inspects:** the dry-run report, plus the `pipeline/BOOT.md` and `pipeline/TOOLS.md` verdicts.
- **Owner inputs:** none.

### E4: Architecture baseline (walking skeleton), ends at LCA

- **Scope:**
    - the tasks with `iteration: E4` (foundations and skeleton: schemas, bindings, importers, bundle, review tool, minimal core, orchestrator, outbox, golden runner, console and Discord adapters, the priority entry);
    - spike **S2**.
- **Exit:**
    - all 348 cases validate;
    - every citation in the 265-case gate set resolves;
    - the dependency rule catches a planted violation;
    - the skeleton flow passes live **and** as a replay in CI;
    - the S2 report is written;
    - the architect's design-pack review is done.
- **The owner inspects:** a live demo. A Tickets thread asks "what is priority?", gets the approved answer with citations, and [Ask a human judge] posts the handoff.
- **Owner inputs:** a test Discord server with Tickets set up like live (for S2); the S2 verdict; the first knowledge review batch.

### C1: Rules questions from the library

- **Scope:**
    - the tasks with `iteration: C1` (full matcher and engine, rule modules, library families E0–E6 and E9, strategy self-check, case authoring);
    - spikes **S1**, **S3** (run on this iteration's build) and **S4-F**.
- **Exit:**
    - every easy rules-question gate case in families E1–E6 passes with an approved binding;
    - strategies reproduce their `derivedFrom` cases;
    - the S1 and S3 reports are written.
- **The owner inspects:** a demo, plus the pass rate per rules family.
- **Owner inputs:**
    - a voice channel and a 1-hour session (S1);
    - the voice decision;
    - about 30 real messy judge-call texts (S3);
    - knowledge review batches.

### C2: Disputes

- **Scope:** the tasks with `iteration: C2` (penalties, fixes, full escalation and integrity modes, event context, policy knowledge, MTRA case variants, the held-out runner). **The held-out set starts:** case-author sessions that the owner starts in the private repository.
- **Exit:**
    - all 50 gate disputes and all 68 integrity runs pass;
    - no protected content in any player message;
    - the FR-POL-1, FR-POL-4, FR-INT-3 and FR-ESC-4 acceptance criteria are each covered by a passing case.
- **The owner inspects:** a demo of a Missed Trigger dispute on buttons, where majors go to judges, plus the leak report.
- **Owner inputs:** signing off the MTRA variants; review batches; held-out sessions.

### C3: Messy input and the AI edge

- **Scope:** the tasks with `iteration: C3` (normaliser, narration intake, robustness runner, `interpret` and `reason`, the AI test runner on Pro, families E7, E8, E10 and E11).
- **Exit:**
    - 100% of the 188 easy gate cases pass;
    - hard cases escalate as expected;
    - zero confidently wrong answers at noise severities 1–3;
    - the AI sets are run and reported.
- **The owner inspects:** the robustness report and the AI-set report.
- **Owner inputs:** reading the AI-set results; review batches.

### C4: Operations on the owner's desktop, ends at IOC

- **Scope:** the tasks with `iteration: C4` (commands, catch-up, retention, deployment, spend cap, daily summary; voice only if kept).
- **Exit:**
    - the outage test passes (2 tickets picked up, 1 ignored, no duplicates);
    - retention deletes cases older than 7 days;
    - the questions-only mode trips at a test cap;
    - the bot restarts on boot.
- **The owner inspects:** the outage test on the host, plus the runbook.
- **Owner inputs:** confirming BIOS virtualization (Docker or service); the API key for the live bot (entered by the owner).

### T1: Release candidate

- **Scope:** the tasks with `iteration: T1` (the release report and its checks), plus the held-out run (aggregates only).
- **Exit:**
    - every PRD §8 release criterion is green;
    - the held-out and AI-set results are reported;
    - OQ-12 (the Wizards Fan Content Policy) is settled.
- **The owner inspects:** the release report.
- **Owner inputs:** the OQ-12 answer; release approval.

### T2: Pilot, ends at PR

- **Scope:** deploying to the live server; 2 weeks of monitoring.
- **Exit:** no leaks, the spend cap is respected, and the owner accepts the product.
- **The owner inspects:** the pilot report.
- **Owner inputs:** go-live credentials (entered by the owner); product acceptance.

## 3. Tasks not yet placed

These two tasks have `iteration: unassigned`. The project manager proposes a placement in a brief when their trigger occurs:

- **T-J4** (player-style variants of the third-person cases) waits for OQ-39;
- **T-J5** (`SCN:` prompts into golden cases) runs whenever the owner sends one.

## 4. Open questions

None new from this plan. OQ-37 to OQ-41 stand (ROADMAP §11). OQ-39 to OQ-41 affect C1–C3 exits, and the project manager raises them in the briefs that need them.
