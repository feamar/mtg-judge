# Development case: how the AI MTG Judge is delivered

Status: **proposed** (Elaboration 2) · Owner: Frank · Author: process engineer (planner role) · Decision record: [ADR-0023](../architecture/adr/0023-delivery-pipeline-and-gates.md)

This is the project's tailoring of the **Rational Unified Process (RUP)**. It defines:

- the phases and iterations;
- the roles, each played by one Claude Code agent;
- the stages every iteration runs;
- the artifacts each stage hands off;
- the gates that decide whether work is good enough;
- the approvals the owner gives.

**What** gets built in each iteration is in [PLAN.md](../plan/PLAN.md) and [backlog.json](../plan/backlog.json). **Why** is in the PRD and the architecture.

## 1. Principles

1. **Every stage ends in something the owner can inspect and approve.** The stage's agent writes a **stage report**. Part A is the approval package (§7): plain words, something to open, run or watch, the gate results, and the decisions needed.
2. **The project manager boots the next agent, and only after the owner's approval.** No agent starts another agent except the project manager. No stage starts on unapproved input.
3. **Handoffs are documents, not conversations.** Every agent starts in a fresh session. It reads **only** the approved stage report it was handed (Part B), plus the exact slices that report names. No agent carries memory from one stage to the next.
4. **Gates are the truth.** Code is good when its gates are green:
    - the locked tests;
    - the regression suites;
    - gatechain;
    - PDD `prove`, which runs mutation testing: it plants small bugs to check that the tests actually catch them.

   Opinion reviews add findings; they never overrule a gate.
5. **Tests are written before code, by a different agent, and then locked.** The implementer can't change them. A disagreement is a dispute (§8) or a change request (§6), never an edit.
6. **Fewest tokens that still give a correct result.** The rules in §9 are binding for every role.
7. **Requirements change only through the owner.** No agent edits the PRD's requirements, an ADR's decision, a golden case or an approved binding. It files a change request (§6).
8. [AGENTS.md](../../AGENTS.md) applies to every role: citations, `UNRESOLVED`, the golden set, and merges into `main` only after the owner's yes.

## 2. Phases and iterations

| Phase | Iteration | Goal | Ends with (what the owner inspects) | RUP milestone |
| --- | --- | --- | --- | --- |
| Inception | I | Vision and requirements | PRD v0.5, 348 golden cases ✓ | LCO ✓ |
| Elaboration | E1 | Architecture | ARCHITECTURE.md, ADR-0001..0022, S4 report ✓ | |
| | E2 | Process design (this document) | [E2 approval package](../iterations/E2/approval-package.md) | |
| | E3 | Build the delivery pipeline | Dry-run report: one real task through every stage | |
| | E4 | Architecture baseline: walking skeleton (M0 + M1), spike S2 | Live demo: a Tickets thread asks "what is priority?" and gets the approved, cited answer; the human handoff works | **LCA** |
| Construction | C1 | Rules questions from the library (M2); spikes S1, S3, S4-F | Demo + pass rate per rules family | |
| | C2 | Disputes, penalties, integrity (M3) | Demo of a dispute on buttons; zero leaks | |
| | C3 | Messy input and the AI edge (M4) | Robustness report: zero confidently wrong answers; 100% of easy gate cases | |
| | C4 | Operations on the owner's desktop (M5) | Outage test on the host | **IOC** |
| Transition | T1 | Release candidate (M6) | Release report against PRD §8 | |
| | T2 | Pilot on the live server | Pilot report | **PR** |

The exit criteria per iteration are in PLAN.md. They come from the milestone exits in [ROADMAP.md](../plan/ROADMAP.md) §3.

## 3. Roles

Each role is one instruction file in `.claude/agents/`. The owner is the fifteenth role.

| Role | File | Model | Booted in | Produces |
| --- | --- | --- | --- | --- |
| **Owner** | — | — | — | Approvals, decisions, inputs (test server, texts), knowledge review |
| **Project manager** | `project-manager.md` | Opus | By the owner, once per approval | Iteration briefs, iteration assessments, boots every other agent, runs the inner loop, keeps `STATE.md` |
| Requirements specifier | `requirements-specifier.md` | Sonnet | Change requests | OQ drafts in PRD §12, decision-log entries after the owner decides |
| Software architect | `architect.md` | Sonnet | Change requests that touch an ADR; design-pack review in E4 | ADR proposals, architecture notes |
| Process engineer | `process-engineer.md` | Sonnet | E2; process changes from an assessment | This document, the agent files, the templates |
| Toolsmith | `toolsmith.md` | Sonnet | E3; tooling defects | `pipeline/` scripts, gate configuration |
| Spike engineer | `spike-engineer.md` | Sonnet | Spike stages | `spikes/<id>/`, spike report |
| Designer | `designer.md` | Sonnet | Stage 2 | Design pack: task cards and the test list |
| Test implementer | `test-implementer.md` | Sonnet | Stage 3; gate G6 survivors; disputes | Locked failing tests, the test pack |
| Implementer | `implementer.md` | Sonnet | Stage 4 (code tasks) | Code that turns the locked tests green |
| Knowledge author | `knowledge-author.md` | Sonnet | Stage 4 (knowledge tasks) | `ai-draft` library content, bindings, lexicon |
| Case author | `case-author.md` | Sonnet | Stage 4 (case tasks); held-out sessions | Golden cases (SOURCE CHECK REQUIRED) |
| Integrator-tester | `integrator-tester.md` | Sonnet | Stage 5; pilot monitoring | Integration build, test evaluation, demo script |
| Reviewer | `reviewer.md` | Sonnet | Stage 6 | At most 10 findings |
| Deployment manager | `deployment-manager.md` | Sonnet | C4, T1, T2 | Deployment scripts, deployment log |

Only the project manager uses Opus, because it takes the judgement calls (escalations, splits, assessments) while reading only short documents.

## 4. The standard iteration (E4, C1–C4, T1)

Seven stages. Each has one role, one stage report, and one owner approval. The project manager boots the next stage only when the owner has approved the previous report.

| # | Stage | Role | Reads (Part B of the previous report, plus) | Writes | Gates before the report | Owner inspects |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Iteration brief** | Project manager | The previous assessment, the PLAN.md row, `backlog.json` | `01-brief.md` | Every task has acceptance criteria and a role | What you'll see at the end, the tasks in scope, the exit criteria in plain words |
| 2 | **Design pack** | Designer | `01-brief.md`, requirement and ADR slices, existing interfaces | `02-design.md` + `cards/<task>.md` | `card-lint` (§9) on every card; every exit criterion maps to a test or golden case | A one-page overview; the tests to write, each as "when …, the bot must …" with its requirement ID |
| 3 | **Test pack** | Test implementer | `02-design.md`, the cards, the golden cases named | Tests + `03-tests.md` | RED check: every new test fails for the right reason; then the tests are **locked** | Every test in plain words; the red run, which proves they test something |
| 4 | **Increment** | Implementer, knowledge author, case author (per task) | Its card, its locked tests, its digest if retrying | Code or content + `04-increment.md` (assembled by the project manager) | Inner loop (§8): G0–G6, or G8 for knowledge | Per task: green or escalated, attempts used; knowledge items next to their sources, for review |
| 5 | **Build & evaluation** | Integrator-tester | `04-increment.md`, the exit criteria | `05-evaluation.md` + `demo.md` | G7 on the iteration branch; the iteration's suites | Pass rate against every exit criterion; defects; a demo script you run yourself |
| 6 | **Review** | Reviewer | `05-evaluation.md`, the iteration's diff stat | `06-review.md` | — | At most 10 findings; blocking ones become tasks for the next iteration, or a rework loop now |
| 7 | **Iteration assessment** | Project manager | 01–06 | `07-assessment.md` | Every exit criterion ✓, or explicitly waived by the owner | The demo, the evidence per exit criterion, lessons, the proposed next iteration, and the **merge-to-main request** |

**Rejections.** If the owner rejects a report, the project manager re-boots the same stage with the reason. The new report replaces the old one; the old one is kept with the suffix `-rejected-n`.

**Stage 4 runs per task.** The owner doesn't approve each task: the gates do. The owner approves the assembled increment once.

## 5. Other stage chains

**E3: build the delivery pipeline.**

1. The project manager writes the brief.
2. The toolsmith builds the pipeline tasks from `backlog.json` (`T-P*`, `T-A1`, `T-A2`). Each is test-first, checked interactively, because the gates don't exist yet.
3. The integrator-tester does a dry run: one real task (T-A4) through stages 2–5.

The dry-run report is the approval package.

**Spike stage** (placed in an iteration by its brief):

1. The project manager writes the spike brief. It gives the SPIKES.md criteria and the owner inputs needed. A spike without its inputs waits, and the brief says so.
2. The spike engineer writes `S<n>-report.md`. It lists every criterion with its measured value and PASS, FAIL or OWNER-DECIDES, plus the options if it failed.

The owner gives the verdict. A spike never decides its own fail option.

**T2: pilot.**

1. The deployment manager deploys and writes the deployment log.
2. The integrator-tester monitors and writes the pilot report.
3. The owner accepts or rejects the product.

**Change request (CR)**, a side channel open to every role:

1. The agent stops and writes `docs/iterations/<it>/CR-<n>.md` from the template. Its stage status becomes `blocked`.
2. The project manager boots the requirements specifier, or the architect if an ADR is involved. They write the options and a proposed OQ or ADR text.
3. The owner decides.
4. The requirements specifier records the decision (PRD §10 and §12, per AGENTS.md).
5. The project manager resumes the blocked stage.

**Process change.** An assessment may propose one. The owner approves it; then the process engineer edits this document, the agent files or the templates, in a commit named `Process: …`.

## 6. Artifacts and where they live

```text
docs/process/DEVELOPMENT-CASE.md        this document
docs/process/AGENT-RULES.md             common rules every agent reads first
docs/process/templates/                 stage-report, design-card, change-request, status line
.claude/agents/<role>.md                one instruction file per role
docs/plan/PLAN.md                       iteration scope and exit criteria
docs/plan/backlog.json                  every task: acceptance, deps, role, iteration
docs/iterations/<it>/STATE.md           project manager's state: stages, approvals, next action
docs/iterations/<it>/NN-<stage>.md      stage reports (Part A for the owner, Part B for the next agent)
docs/iterations/<it>/cards/<task>.md    task cards (the designer's output)
docs/iterations/<it>/digests/           gate failure digests, ≤ 40 lines each
docs/iterations/<it>/CR-<n>.md          change requests
pipeline/                               gate, slice and support scripts (built in E3)
spikes/<id>/                            spike code, never merged into packages
```

## 7. Stage reports, approvals and booting

**Stage report.** Every stage writes one, from [templates/stage-report.md](templates/stage-report.md).

- **Part A, for the owner (the approval package):**
    1. what was done, in plain words;
    2. how to inspect it: a file, a command, or a demo;
    3. gate results, with numbers;
    4. decisions needed, each with options and a recommendation;
    5. what the next stage will do.
- **Part B, for the next agent (the handoff):** the inputs to read (paths and slice references), constraints, open issues, and the exact job of the next stage. The next agent reads Part B, never Part A's prose.

**Approval.** The owner writes one of these in the report's `Decision` line, or tells the project manager, which records it:

- `APPROVED`;
- `APPROVED WITH NOTES: …` (the notes are copied into Part B);
- `REJECTED: …`.

**Booting.** The owner starts (or resumes) the project manager with `claude --agent project-manager`, then says "continue", or "continue E4".

1. The project manager reads `STATE.md`.
2. It checks the last report's decision.
3. It boots the next role as a **subagent** (Claude Code's Agent tool, with `subagent_type` set to the role name). The prompt names only the report's path.
4. It reads back only the subagent's status line (§9) and Part A's headings.
5. It updates `STATE.md`, commits, and stops with a one-line message to the owner: "Stage N ready for your approval: <path>".

**Fallback.** If subagents can't run long enough, the project manager runs the same role headless (`claude -p --agent <role>`) through Bash. E3's dry run chooses.

## 8. The inner loop and the gates (stage 4)

For each task, in dependency order:

1. The project manager boots the implementer, or the knowledge or case author, with the card.
2. The role finishes with `done`, `dispute` or `blocked`.
3. The project manager runs `node pipeline/gate.mjs --task <id>`. This costs no tokens.
4. The result decides the next step:
    - **green:** the task branch is merged into the iteration branch;
    - **red:** the digest goes to a **fresh** session of the same role, with its previous attempt notes (at most 5 lines per attempt). The budget is **3 attempts**.
    - **G6 survivors** (mutants the tests missed): back to the test implementer (2 rounds). Its tests are re-locked, then the implementer continues.
    - **Dispute** (at most 15 lines: test, claim, spec line): a fresh test implementer rules, and never sees the code.
        - The test contradicts the card: it fixes and re-locks the test. The attempt isn't counted.
        - The test matches the card: the test is upheld, and the attempt counts.
        - The spec itself is in doubt: it files a change request.
    - **Budget spent:** the project manager itself decides one of:
        - HINT: at most 20 lines added to the card, then 2 more attempts;
        - SPLIT the task;
        - RETEST: back to the test implementer with a reason;
        - RESET: discard the branch and re-ship;
        - a change request to the owner.
    - **Hard cap:** 10 sessions per task, then the owner decides.

| Gate | Checks |
| --- | --- |
| G0 lock | Test files match their locked hashes; the diff stays inside the card's allowed paths |
| G1 build | Typecheck, lint, dependency rule (`core` has no I/O, ADR-0001), string-literal lint (NFR-I18N-1) |
| G2 task | The card's tests |
| G3 regression | All unit and property tests; the golden gate suite on the bound cases, once per integrity setting |
| G4 gatechain | `npx gatechain --fast` |
| G5 pdd check | `pdd check`, with its blocking gates (silent failure, dead branch, no-op paths, trace requirements) |
| G6 prove | `pdd prove` on the boundaries the task changed (mutation adequacy) |
| G7 integration | `npx gatechain --push` and the iteration's full suites (ROADMAP §6), on the iteration branch |
| G8 knowledge | Bundle validation, citation resolution (NFR-ACC-3), the family's golden cases. Replaces G5–G6 for knowledge tasks. |

**The digest** is written by the gate script and capped at 40 lines:

- the failing gate;
- at most 5 failures, each as test name → `covers:` tags → expected vs actual (300 characters at most) → `file:line`;
- or, for G6, the surviving mutants.

## 9. Context and token rules (binding)

- **Fresh sessions only.** Every agent reads [AGENT-RULES.md](AGENT-RULES.md), its own file, and Part B of the report it was handed. Nothing else is preloaded.
- **Never read big documents whole.** `PRD.md`, `ARCHITECTURE.md`, the ADRs and source documents are read by ID or heading:
    - with `node pipeline/slice.mjs <ref>` once E3 has built it;
    - until then, with Grep on the ID, plus context lines.
- **Card limits (`card-lint`):**
    - at most 80 lines;
    - a read list of at most 8 `file:line-line` ranges;
    - every test maps to a requirement ID or golden case;
    - an estimated change of at most 400 non-test lines, otherwise the task is split.
- **Status line.** Every agent's final message ends with:

  `STATUS {"result":"done|dispute|blocked|split","report":"<path>","note":"≤200 chars"}`
- **The project manager never reads code, diffs, logs or full test output.** It reads only status lines, Part A headings, digests and `STATE.md`.
- **Session limits:** the project manager boots subagents with a stated turn budget (§3 files give theirs). Token use per session is logged in `STATE.md`, so the assessment shows what each stage cost.

## 10. Traceability

Every test carries a `covers:` tag, for example `// covers: FR-Q-1 golden:<caseId>`. gatechain `trace` and PDD `trace-requirements` fail any stated requirement with no test.

The chain is: requirement → golden case → binding → test → code, and each link can be checked by a tool.

## 11. The golden set and the held-out set

- In-repo golden cases are specification. Test and knowledge roles read them **by ID**.
- New cases stay SOURCE CHECK REQUIRED until the owner signs them off.
- **The held-out set** is written only by case-author sessions that the owner starts **in the private repository**. No agent in this repository ever reads held-out cases. The held-out runner prints aggregates only, and the project manager sees only those aggregates.

## 12. Git

| Branch | Created by | Merged by |
| --- | --- | --- |
| `it/<iteration>` | Project manager, from `main`, in stage 1 | Project manager, into `main`, **only after the owner's yes** in stage 7 (AGENTS.md) |
| `task/<id>` | Project manager, in stage 4 | Project manager, into `it/<iteration>` after the gates are green (no owner yes needed: not `main`) |
| `spike/<id>` | Project manager | Never into `main` (only the report, via the iteration branch) |

Commits are small, and name the stage or task ID and the reason.
