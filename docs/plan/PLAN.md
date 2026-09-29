# AI MTG Judge: Iteration plan (v3, revision 2)

Status: **proposed** (Elaboration 2) · Approver: Frank · Process: [DEVELOPMENT-CASE.md](../process/DEVELOPMENT-CASE.md) · Tasks: [backlog.json](backlog.json)

This plan (RUP's software development plan) says what each iteration covers and what the owner inspects to approve it. **How** they run is in the development case:

- Elaboration: RUP;
- E4 and every Construction iteration: a **PDD cycle** (MAP → TRIAGE → CARVE → PIN → SHIP → PROVE/HARDEN → RE-MAP);
- Transition: PROVE ALL → RELEASE PIN → DEPLOY → PILOT MAP.

There are no dates: an iteration starts when the previous one's last report is approved. The milestone definitions, test base and risks are kept for reference in [ROADMAP.md](ROADMAP.md).

## 1. How a cycle uses this plan

- **Scope:** the `backlog.json` tasks with that `iteration` value, and the spikes listed. The cartographer turns them into a proposed unit roadmap at MAP; the owner triages it.
- **Exit criteria:** proven at PROVE/HARDEN and checked at RE-MAP. They come from ROADMAP §3.
- **Hardening:** every cycle meets the thresholds of DEVELOPMENT-CASE §8.2 (H1–H6) on the modules it changed. The exit criteria below come on top of them.
- **Owner inputs:** only the owner can provide these. The cartographer lists them in MAP. A spike without its inputs waits; the rest of the cycle doesn't.

## 2. Iterations

### E2: Process design (now)

- **Scope:** the development case, AGENT-RULES, templates, 14 agent files, ADR-0023, this plan, handover 03.
- **Exit:** the owner approves the [E2 approval package](../iterations/E2/approval-package.md).

### E3: Build the delivery and PDD tooling (not a PDD cycle)

- **Scope** (toolsmith):
    - T-A1 scaffold;
    - T-A2 CI;
    - T-P1 gatechain, PDD and engineering-discipline;
    - T-P2 slice tool;
    - T-P3 gate script (SHIP gates, hardening gates, lock, card-lint, thresholds file);
    - T-P4 boot mechanism check.
- **Then** a dry run: T-A4 through CARVE → PIN → SHIP → PROVE/HARDEN.
- **Exit:**
    - every gate catches its planted failure, including a weak test caught by H1/H2 and an edited locked test caught by G0;
    - the project manager boots each role and reads back its status line;
    - the dry run shows no handoff needed more than its Part B;
    - tokens per stage are recorded.
- **The owner inspects:** the dry-run report, `pipeline/BOOT.md` and `pipeline/TOOLS.md`.

### E4: PDD cycle 0, the walking skeleton (ends at LCA)

- **Scope:** the tasks with `iteration: E4` (schemas, bindings, importers, bundle, review tool, minimal core, orchestrator, outbox, golden runner, console and Discord adapters, the priority entry). Spike **S2** runs at CARVE, and the architect reviews the cards.
- **Exit:**
    - all 348 cases validate;
    - every citation in the 265-case gate resolves;
    - the dependency rule catches a planted violation;
    - the skeleton flow passes live and as a CI replay;
    - hardening H1–H6 passes on `core`.
- **The owner inspects:** a live demo (a Tickets thread asks "what is priority?", gets the cited answer, and [Ask a human judge] hands off), plus the first hardening report.
- **Owner inputs:** a test Discord server with Tickets set up like live; the S2 verdict; the first knowledge review batch.

### C1: PDD cycle 1, rules questions from the library

- **Scope:** the tasks with `iteration: C1` (full matcher and engine, rule modules, families E0–E6 and E9, strategy self-check, case authoring). Spikes **S1**, **S3** and **S4-F** run at CARVE, where they're the riskiest assumption.
- **Exit:**
    - every easy rules-question gate case in E1–E6 passes, with an approved binding;
    - strategies reproduce their `derivedFrom` cases;
    - H3 robustness gives zero confidently wrong answers on these families.
- **The owner inspects:** a demo, plus pass rates and mutation grades per family and module.
- **Owner inputs:** a voice session and the voice decision (S1); about 30 real messy texts (S3); knowledge review batches.

### C2: PDD cycle 2, disputes and integrity

- **Scope:** the tasks with `iteration: C2` (penalties, fixes, escalation and integrity modes, event context, policy knowledge, MTRA variants, the held-out runner). **The held-out set starts:** case-author sessions that the owner starts in the private repository.
- **Exit:**
    - all 50 gate disputes and all 68 integrity runs pass;
    - H5 finds zero leaks, including the near-miss variants;
    - the FR-POL-1, FR-POL-4, FR-INT-3 and FR-ESC-4 acceptance criteria are each covered.
- **The owner inspects:** a Missed Trigger dispute on buttons; the leak and integrity report.
- **Owner inputs:** MTRA-variant sign-off; review batches; held-out sessions.

### C3: PDD cycle 3, messy input and the AI edge

- **Scope:** the tasks with `iteration: C3` (normaliser, narration, robustness runner, `interpret`/`reason`, the AI test runner, E7, E8, E10, E11).
- **Exit:**
    - 100% of the 188 easy gate cases pass;
    - hard cases escalate as expected;
    - H3 gives zero confidently wrong answers at severities 1–3 over the whole gate;
    - the AI sets are reported.
- **The owner inspects:** the robustness report and the AI-set report.

### C4: PDD cycle 4, operations (ends at IOC)

- **Scope:** the tasks with `iteration: C4` (commands, catch-up, retention, deployment, spend cap, daily summary; voice only if kept).
- **Exit:**
    - the outage test passes (2 tickets picked up, 1 ignored, no duplicates);
    - retention deletes cases older than 7 days;
    - the questions-only mode trips at a test cap;
    - the bot restarts on boot.
- **The owner inspects:** the outage test on the host; the runbook.
- **Owner inputs:** BIOS virtualization check; the API key, entered by the owner.

### Further cycles

When RE-MAP or the pilot finds work that isn't in any row above, the project manager proposes C5, C6, …, each a PDD cycle, and the owner approves it before its MAP starts.

### T1: Release: PROVE ALL → RELEASE PIN

- **Scope:** the tasks with `iteration: T1`; system-wide hardening; the held-out aggregates; the v1.0 baseline.
- **Exit:**
    - every PRD §8 criterion has evidence;
    - H1–H6 pass on every module;
    - OQ-12 is settled;
    - the v1.0 baseline is green and locked.
- **The owner inspects:** the release proof; the baseline report; then approves the release.

### T2: Pilot: DEPLOY → PILOT MAP (ends at PR)

- **Scope:** deploy to the live server; 2 weeks live; map the real calls back into the spec.
- **Exit:** no leaks; the spend cap is respected; the owner accepts the product.
- **The owner inspects:** the deployment log; the pilot report with the proposed new golden cases.

## 3. Tasks not yet placed

T-J4 waits for OQ-39, and T-J5 (`SCN:` prompts) runs whenever the owner sends one. The cartographer proposes them in the MAP of the cycle where they fit.

## 4. Open questions

None new. OQ-37 to OQ-41 stand (ROADMAP §11); OQ-39 to OQ-41 surface in the MAPs of C1–C3.
