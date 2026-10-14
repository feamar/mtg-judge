# Development case: how the AI MTG Judge is delivered

Status: **proposed** (Elaboration 2, revision 2) · Owner: Frank · Author: process engineer (planner role) · Decision record: [ADR-0023](../architecture/adr/0023-delivery-pipeline-and-gates.md)

This document tailors two methods to this project.

- **RUP** gives the phase frame: Inception, Elaboration, Construction, Transition, with the milestones LCO, LCA, IOC and PR.
- **Proof-driven development** ([PDD](https://github.com/AlexTavor/proof-driven-development)) gives the way work is done from the walking skeleton onwards. Every increment is one **PDD cycle**: MAP → TRIAGE → CARVE → PIN → SHIP → PROVE/HARDEN → RE-MAP.

It defines:

- the roles, each played by one Claude Code agent;
- the stages and what each hands off;
- the gates, including the **test-hardening** gates;
- the owner's approvals.

**What** each cycle covers is in [PLAN.md](../plan/PLAN.md) and [backlog.json](../plan/backlog.json).

## 1. Principles

1. **Every stage ends in something the owner can inspect and approve.** The stage's agent writes a **stage report**. Part A is the approval package (§7).
2. **The project manager boots the next agent, and only after the owner's approval.** No other agent starts agents. No stage starts on unapproved input.
3. **Handoffs are documents.** Every agent starts in a fresh session. It reads only Part B of the approved report it was handed, plus the slices that report names.
4. **Proof, not opinion.** Work is accepted by mechanical gates, not by opinion reviews:
    - **SHIP** makes the tests green under the gates;
    - **PROVE/HARDEN** shows that the tests actually constrain the behaviour, with mutation grades, noise, properties and integrity runs.

   Green without proof isn't done.
5. **Behaviour is pinned before it's changed.** Code that a unit touches gets characterisation tests first. Released behaviour becomes a baseline that every later change is checked against.
6. **Tests and code come from different agents.** The pinner writes tests before the code exists; the test hardener strengthens them afterwards. Neither writes implementation, and the implementer never edits a test.
7. **The golden cases are the recovered specification.** Requirements change only through the owner, by change request (§5).
8. **Fewest tokens that still give a correct result** (§9).
9. [AGENTS.md](../../AGENTS.md) applies to every role: citations, `UNRESOLVED`, the golden set, and merges into `main` only after the owner's yes.

## 2. Phases and iterations

| Phase | Iteration | How it runs | Ends with (what the owner inspects) | RUP milestone |
| --- | --- | --- | --- | --- |
| Inception | I | done | PRD v0.5, 348 golden cases ✓ | LCO ✓ |
| Elaboration | E1 | done | Architecture, ADR-0001..0022, S4 ✓ | |
| | E2 | Process design (this document) | [E2 approval package](../iterations/E2/approval-package.md) | |
| | E3 | Build the delivery and PDD tooling (§5.1) | The dry-run report | |
| | **E4** | **PDD cycle 0:** the walking skeleton, plus spike S2 | Live demo of the skeleton, and its hardening report | **LCA** |
| Construction | C1–C4 | **PDD cycles 1–4** (§4), one capability each; more cycles if RE-MAP finds work | For each cycle: demo, hardening report, re-map | **IOC** after C4 |
| Transition | T1 | **PROVE ALL → RELEASE PIN** (§5.3) | Release proof, and the v1.0 behaviour baseline | |
| | T2 | **DEPLOY → PILOT MAP** (§5.3) | Pilot report, and new cases mapped from real calls | **PR** |

## 3. Roles

Each role has one file in `.claude/agents/`. The owner is the fifteenth role.

| Role | File | Model | Stage(s) | Produces |
| --- | --- | --- | --- | --- |
| **Owner** | — | — | TRIAGE, every approval | Roadmap sign-off, approvals, decisions, inputs, knowledge review |
| **Project manager** | `project-manager.md` | Opus | All: boots every role | `STATE.md`, the SHIP inner loop, escalations, merge requests, the E3 dry-run report |
| Cartographer | `cartographer.md` | Sonnet | MAP, RE-MAP, PILOT MAP | System map, risk inventory, trap register, proposed roadmap; the cycle's evidence |
| Carver | `carver.md` | Sonnet | CARVE | Unit cards: interfaces, spec tests to write, pins needed, allowed paths |
| Spike engineer | `spike-engineer.md` | Sonnet | CARVE (riskiest assumption) | Spike report |
| Pinner | `pinner.md` | Sonnet | PIN, RELEASE PIN | Characterisation tests (green) and spec tests (red), locked |
| Implementer | `implementer.md` | Sonnet | SHIP (code units) | Code that turns the locked tests green |
| Knowledge author | `knowledge-author.md` | Sonnet | SHIP (knowledge units) | `ai-draft` library content, bindings, lexicon |
| Case author | `case-author.md` | Sonnet | SHIP (case units); held-out sessions | Golden cases, SOURCE CHECK REQUIRED |
| **Test hardener** | `test-hardener.md` | Sonnet | PROVE/HARDEN, PROVE ALL | Stronger tests, mutation grades, robustness and integrity evidence |
| Deployment manager | `deployment-manager.md` | Sonnet | C4 units, DEPLOY | Packaging, runbook, deployment log |
| Requirements specifier | `requirements-specifier.md` | Sonnet | Change requests | OQ drafts; decision records after the owner decides |
| Software architect | `architect.md` | Sonnet | Architecture change requests; E4 CARVE review | ADR proposals, the carve review |
| Process engineer | `process-engineer.md` | Sonnet | E2; approved process changes | This document, the agent files, the templates |
| Toolsmith | `toolsmith.md` | Sonnet | E3; tooling defects | `pipeline/`, the gatechain and PDD configuration |

## 4. The PDD cycle (E4, C1–C4)

The reports go in `docs/iterations/<cycle>/`. There is one owner approval per stage. SHIP's per-unit loop runs without the owner; the owner approves its assembled result.

| # | Stage | Role | Does | Writes | Gates | Owner inspects |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **MAP** | Cartographer | Runs `pdd map` on the code. Maps the cycle's scope (PLAN.md row, `backlog.json`) against the spec: requirements and golden cases that are unbound, unproven or at risk, known traps, and code the units will touch. **Proposes** a risk-ranked unit roadmap and the per-module mutation thresholds (§8). | `01-map.md` + roadmap ledger | Every gate case and requirement in scope is on the map | The map, the risk inventory and the proposed roadmap, in plain words |
| 2 | **TRIAGE** | **Owner** (the project manager records) | The owner approves, denies, edits, splits or reorders units (`pdd roadmap`). Sign-off freezes the ledger (`pdd roadmap signoff`). | `02-triage.md` (ledger decisions) | — | *(The owner's own stage.)* |
| 3 | **CARVE** | Carver (+ spike engineer, + architect in E4) | Turns each unit into a card (at most 400 non-test lines). The **riskiest assumption** gets a thin end-to-end spike first; S1, S2 and S3 run here, in the cycle that needs them. | `03-carve.md` + `cards/<unit>.md` (+ spike reports) | `card-lint`; the riskiest spike PASSES, or its verdict goes to the owner | The unit cards as "when …, the bot must …"; the spike verdicts |
| 4 | **PIN** | Pinner | (a) **Characterises** the current behaviour of everything the units touch; these tests must pass. (b) Writes the **spec tests** from the cards and golden cases; these must fail. Locks both sets. | Tests + `04-pin.md` | RED check; `pin-values`, `boundary-tests` | What's pinned (green), what's specified (red), in plain words |
| 5 | **SHIP** | Implementer, knowledge author, case author (per unit) | Makes each unit green under the SHIP gates, one commit per unit; the project manager runs the inner loop (§8) | Code or content + `05-ship.md` (assembled by the project manager) | G0–G5 (or G8) | Per unit: green or escalated, attempts; knowledge items next to their sources |
| 6 | **PROVE / HARDEN** | **Test hardener** | **Test hardening** (§8.2): mutation-grades every changed module and kills the survivors; noise variants of every golden case in scope; property tests; integrity-setting runs; near-miss and leak tests; `gatechain --push` on the cycle branch. A hardened test that exposes a real bug sends that unit back to SHIP. | `06-harden.md` | H1–H6 | The hardening report: grades against thresholds, survivors killed, robustness and leak numbers, bugs found |
| 7 | **RE-MAP** | Cartographer | Re-runs `pdd map` on the merged cycle branch. Records what is now proven, drift and new traps. Checks every exit criterion. Writes the demo script, and **proposes the next cycle's units**. | `07-remap.md` + `demo.md` | Every exit criterion ✓, or waived by the owner | The evidence per exit criterion, the demo you run, the new traps, and the **merge-to-main request** |

**Rejections.** If the owner rejects a report, the project manager re-boots the same stage with the reason. The old report is kept as `-rejected-<n>`.

## 5. Other chains

### 5.1 E3: build the tooling

E3 can't use the PDD cycle, because it builds the PDD tooling.

1. The project manager writes the E3 brief: the tasks with `iteration: E3`.
2. The toolsmith builds each task test-first, checked by its own fixture tests.
3. The project manager runs a **dry run**: one real unit (T-A4) through CARVE, PIN, SHIP and PROVE/HARDEN. It writes the dry-run report from the status lines and token logs:
    - was every handoff self-sufficient?
    - what did each stage cost in tokens?
    - did a planted weak test get caught by H1/H2?

### 5.2 Spikes

A spike runs inside CARVE when the riskiest assumption needs one.

- The project manager boots the spike engineer with the SPIKES.md section and the owner inputs.
- A spike without its inputs waits, and CARVE continues with the other units.
- The report gives every criterion as PASS, FAIL or OWNER-DECIDES. **The owner gives the verdict.**

### 5.3 Transition

| # | Stage | Role | Does | Gates | Owner inspects |
| --- | --- | --- | --- | --- | --- |
| T1.1 | **PROVE ALL** | Test hardener | System-wide hardening: `pdd grade` on every module; the full golden gate suite; all 68 integrity runs; robustness at all severities; the AI sets on Pro; held-out aggregates (generalisation) | H1–H6 over the whole system; every PRD §8 criterion; OQ-12 settled | The release proof: each §8 criterion with its evidence |
| T1.2 | **RELEASE PIN** | Pinner | Freezes the released behaviour as the **v1.0 characterisation baseline**. From now on, every change must pass it, or change it through an approved unit. | Baseline green; release tag | The baseline report; the owner approves the release |
| T2.1 | **DEPLOY** | Deployment manager | Installs on the host with the runbook; the owner enters the credentials; smoke test | Smoke test green | The deployment log |
| T2.2 | **PILOT MAP** | Cartographer | Two weeks live. Maps real calls against the spec: misses, wrong escalations, near-leaks. They become proposed golden cases and roadmap units. | No leaks; spend under the cap | The pilot report and the proposed cases; the owner accepts the product |

### 5.4 Change requests

This is a side channel, open to every stage.

1. The agent writes `CR-<n>.md` from the template, and stops with `blocked`.
2. The project manager boots the requirements specifier, or the architect if an ADR is involved, who writes the options and a proposed OQ or ADR text.
3. The owner decides.
4. The decision is recorded (PRD §10 and §12, per AGENTS.md).
5. The blocked stage resumes.

### 5.5 Process changes

A RE-MAP may propose a process change. After the owner approves it, the process engineer edits this document, the agent files or the templates (commit `Process: …`).

## 6. Artifacts

```text
docs/process/DEVELOPMENT-CASE.md, AGENT-RULES.md, templates/
.claude/agents/<role>.md
docs/plan/PLAN.md, backlog.json
docs/iterations/<cycle>/STATE.md                          project manager's state
docs/iterations/<cycle>/01-map.md … 07-remap.md, demo.md  stage reports
docs/iterations/<cycle>/cards/<unit>.md                   unit cards
docs/iterations/<cycle>/digests/                          gate digests, ≤ 40 lines
docs/iterations/<cycle>/CR-<n>.md                         change requests
docs/process/traps.md                                     trap register (the cartographer's, cumulative)
.pdd/                                                     PDD configuration, roadmap ledger, thresholds
pipeline/                                                 gate and slice scripts (E3)
spikes/<id>/                                              spike code, never merged into packages
```

## 7. Stage reports, approvals and booting

**Stage report** ([templates/stage-report.md](templates/stage-report.md)):

- **Part A, for the owner:**
    1. what was done;
    2. how to inspect it;
    3. gate results, with numbers;
    4. decisions needed, with options and a recommendation;
    5. what the next stage will do.
- **Part B, for the next agent:** what to read, allowed paths, constraints, open issues, and the exact job.

**Approval.** The owner writes one of these in the `Decision` line, or tells the project manager, which records it:

- `APPROVED`;
- `APPROVED WITH NOTES: …` (the notes are copied into Part B);
- `REJECTED: …`.

**Booting.** The owner starts `claude --agent project-manager` and says "continue".

1. The project manager reads `STATE.md` and checks the last report's decision.
2. It boots the next role as a **subagent** (the Agent tool, `subagent_type` set to the role name). The prompt names only the input report.
3. It reads back only the status line.
4. It updates `STATE.md`, commits, and stops with: "Stage <N> ready for your approval: <path>".

**Fallback:** headless `claude -p --agent <role>`, if E3's T-P4 finds subagents unsuitable.

## 8. Gates

### 8.1 SHIP gates and the inner loop

Per unit, in dependency order:

1. The project manager boots the unit's role with its card.
2. The project manager runs `node pipeline/gate.mjs --unit <id>` (it costs no tokens) and acts on the result:
    - **green:** merged into the cycle branch;
    - **red:** the digest goes to a **fresh** session of the same role, with its attempt notes. The budget is 3 attempts.
    - **dispute** (at most 15 lines): a fresh **pinner** rules without seeing the code. It fixes the test (the attempt isn't counted), upholds it (the attempt counts), or files a change request.
    - **budget spent:** the project manager chooses HINT (at most 20 lines on the card, then 2 more attempts), SPLIT, RE-PIN, RESET, or a change request. The hard cap is 10 sessions per unit.

| Gate | Checks |
| --- | --- |
| G0 lock | Tests match their locked hashes; the diff stays inside the card's allowed paths |
| G1 build | Typecheck, lint, dependency rule (ADR-0001), string-literal lint (NFR-I18N-1) |
| G2 unit | The card's spec tests |
| G3 regression | All tests, including **every characterisation pin** (from v1.0 on, the release baseline), plus the golden gate suite on bound cases, once per integrity setting |
| G4 gatechain | `npx gatechain --fast` |
| G5 pdd check | Block mode: `pin-values`, `boundary-tests`, `no-op-paths`, `silent-failure`, `dead-branch`, `cover-the-mirror`, `trace-requirements`, `cohesion` |
| G8 knowledge | Bundle validation, citation resolution (NFR-ACC-3), the family's golden cases. Replaces G4–G5 for knowledge and case units. |

### 8.2 Test hardening (PROVE / HARDEN, and PROVE ALL)

The test hardener runs these, and strengthens the tests until they pass. **It never edits implementation.**

When a new, correct test fails because the code is wrong, the hardener locks the test and writes a digest. That unit goes back to SHIP, with a budget of 2 rounds, then the project manager.

| Gate | Checks | Threshold (owner, 2026-09-29) |
| --- | --- | --- |
| **H1 boundaries** | `pdd prove` on every named boundary in changed code | **100%** killed |
| **H2 mutation grade** | `pdd grade` per changed module | **≥ 90%** for `core` (engine, verifier, escalation, audiences, composer, matcher); **≥ 75%** for adapters, `pipeline`, `eval`, `app` |
| **H3 robustness** | `golden/tools/noisify.mjs` at severities 1–3, with fixed seeds, over every golden case in scope, plus stored human variants | **Zero confidently wrong** (NFR-ROB-1); the answer is the same as for clean text, or a clarifying question |
| **H4 properties** | Property tests for the engine's invariants: facts in any order give the same branch (NFR-IMP-1); replaying the case log gives the same state; the audience guard holds for every content type | All pass, 1,000 runs each, seeds recorded |
| **H5 integrity and leaks** | Every integrity case, once per setting; near-miss variants (one fact changed); leak tests over every player-audience message | Every expectation met; **zero leaks** |
| **H6 branch proof** | `npx gatechain --push` (`mutate-diff`, `graded`, `trace`) on the cycle branch | Exit 0 |

In **MAP**, the cartographer may propose different thresholds for a module, with a reason. They apply only after the owner approves them in TRIAGE.

**The digest** is capped at 40 lines:

- the failing gate;
- at most 5 failures, each as test → `covers:` tags → expected vs actual → `file:line`;
- or the surviving mutants, each as `file:line`, the operator and the original.

## 9. Context and token rules (binding)

- **Fresh sessions only.** An agent reads AGENT-RULES.md, its own file, and Part B of its input.
- **Big documents are read by slice** (`node pipeline/slice.mjs <ref>`; before E3, Grep with context), never whole.
- **Cards** are at most 80 lines, with a read list of at most 8 ranges, and every test mapped to a requirement or golden case.
- **The status line** ends every agent's final message:

  `STATUS {"result":"done|dispute|blocked|split","report":"<path>","note":"≤200 chars"}`
- **The project manager never reads code, diffs, logs or full test output.** Tokens per stage are logged in `STATE.md`.

## 10. Traceability

Every test carries a `covers:` tag, for example `// covers: FR-Q-1 golden:<caseId>`. Characterisation tests carry `// pins: <module>`.

The chain is: requirement → golden case → binding → spec test → code → mutation grade. gatechain `trace` and PDD `trace-requirements` enforce it.

## 11. The golden set and the held-out set

- Golden cases are read by ID, and new ones stay SOURCE CHECK REQUIRED until the owner signs them off.
- **Held-out cases** are written only in case-author sessions that the owner starts in the private repository. No agent here reads them, and results are reported as aggregates only (PROVE ALL).

## 12. Git

| Branch | Created by | Merged by |
| --- | --- | --- |
| `cycle/<id>` | Project manager, from `main`, at MAP | Project manager, into `main`, **only after the owner's yes** at RE-MAP (AGENTS.md) |
| `unit/<id>` | Project manager, at SHIP | Project manager, into `cycle/<id>`, when the SHIP gates are green |
| `spike/<id>` | Project manager, at CARVE | Never into `main` (only the report travels, via the cycle branch) |
