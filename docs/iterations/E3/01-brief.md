# E3 · Stage 1: Brief

Role: project-manager · Branch: `cycle/E3` · Inputs: `docs/handover/03-planner-to-project-manager.md`, `docs/iterations/E2/approval-package.md` Part B

**Decision:** PENDING
<!-- Owner writes one of: APPROVED · APPROVED WITH NOTES: … · REJECTED: … -->

---

## Part A: for the owner (approval package)

### 1. What was done

- Opened iteration E3 on branch `cycle/E3`, with `docs/iterations/E3/STATE.md`.
- Set ADR-0023 to **Accepted 2026-09-29**, as you approved in E2, and updated the ADR index to match.
- This brief sets out E3: six tooling tasks, then a dry run, then the exit check. E3 is not a PDD cycle, because it builds the PDD tooling (DEVELOPMENT-CASE §5.1).

**The six tasks, in dependency order.** The toolsmith does all of them, one session per task. Each is test-first and checked by the toolsmith's own fixture tests, because the gates don't exist until T-P3.

| Order | Task | What it delivers | Needs |
| --- | --- | --- | --- |
| 1 | T-P4 | Boot check: subagents vs headless `claude -p` on the Pro plan, and what happens at usage limits (`pipeline/BOOT.md`). This decides how I boot agents from here on. | none |
| 1 | T-A1 | Monorepo scaffold: npm workspaces, strict TypeScript, Node 24 | none |
| 2 | T-A2 | CI on GitHub Actions: build, lint, unit tests, schema validation, golden suite, a lint for user-facing text | T-A1 |
| 2 | T-P1 | gatechain and PDD as pinned submodules in `tools/`, the engineering-discipline plugin, licence and Windows 10 check | T-A1 |
| 2 | T-P2 | `pipeline/slice.mjs`: prints one PRD, ADR, architecture, golden or rules item by reference | T-A1 |
| 3 | T-P3 | `pipeline/gate.mjs`: gates G0–G8, test locking, card lint, digests of at most 40 lines | T-P1, T-P2 |

**The dry run.** When all six are done, I push one real unit, **T-A4** (the case binding format), through CARVE → PIN → SHIP → PROVE/HARDEN with the real roles. I plant a weak test to see whether H1/H2 catch it. I then write the dry-run report from the status lines and token logs. It covers:

- every place an agent needed more than its Part B;
- **cost baseline** (your note): tokens and wall time per stage and per gate;
- **tuning proposal** (your note): options that trade review and testing depth against speed and tokens. Each option has a recommendation, and you decide each one before E4. The candidate options are: which hardening gates run every cycle and which only at PROVE ALL; mutation scope (changed lines or the whole module); noise seeds and property-run counts; turn budgets; the model per role; batching the TRIAGE, CARVE and PIN approvals into one; and skipping PIN characterisation for code that nothing depends on.

**Exit criteria** (PLAN.md §2, E3):

1. Every gate catches its planted failure, including a weak test caught by H1/H2 and an edited locked test caught by G0.
2. I boot each role and read back its status line.
3. The dry run shows that no handoff needed more than its Part B.
4. Tokens per stage are recorded, with the cost baseline and the tuning proposal, and you have decided each option before E4 starts.

### 2. How to inspect it

| What | How |
| --- | --- |
| This plan and its order | this file; `docs/iterations/E3/STATE.md` |
| ADR-0023 accepted | line 3 of `docs/architecture/adr/0023-delivery-pipeline-and-gates.md`; row 0023 in `docs/architecture/adr/README.md` |
| At E3 exit | the dry-run report, `pipeline/BOOT.md`, `pipeline/TOOLS.md` |

### 3. Gate results

| Gate or check | Result | Numbers |
| --- | --- | --- |
| None yet | n/a | The gates are built in T-P3 |

### 4. Decisions you need to take

1. Approve this brief, including the task order and the exit criteria. **Recommendation:** approve, so I can boot the toolsmith for T-P4 and T-A1.

### 5. What the next stage will do

The toolsmith builds T-P4 and T-A1, then T-A2, T-P1 and T-P2, then T-P3. I record each task's status and tokens in STATE.md.

---

## Part B: handoff to the next agent

- **Next role:** toolsmith (one session per task)
- **Job:** build the E3 task named in the boot prompt, test-first, with fixture tests. Order: T-P4, T-A1 → T-A2, T-P1, T-P2 → T-P3.
- **Read:** `docs/plan/backlog.json` (only the entry for your task ID); DEVELOPMENT-CASE §5.1; §8 for T-P3 only; ADR-0016 by slice for T-P4.
- **Allowed paths:** the outputs your backlog entry names, plus `pipeline/`, `tools/`, `.github/`, and root config files for T-A1 and T-A2.
- **Constraints:** ADR-0023 is Accepted. Log tokens and wall time per session in your report, because they feed the cost baseline (owner note, 2026-09-29).
- **Open issues:** OQ-37..41, none blocking E3.
- **Done when:** your task's backlog acceptance passes on its fixture tests, and your report exists with Part A's five headings.
