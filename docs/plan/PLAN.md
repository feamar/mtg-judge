# AI MTG Judge: Build pipeline plan (v2)

Date: 2026-09-28 · Planner: Claude · Approver: Frank (owner) · Branch: `plan/v1` · **Status: DRAFT, unfinished** (see §13)

This plan explains **how** the judge gets built. The same repeatable pipeline builds every milestone:

1. it writes the tests first;
2. it generates the code;
3. mechanical gates decide whether the code is good enough;
4. if it isn't, the builder gets a short failure digest and tries again.

**What** gets built, and in which order, is in [ROADMAP.md](ROADMAP.md) (milestones M0–M6, the test base, review load, risks) and [backlog.json](backlog.json) (every task with its acceptance criteria).

**Building blocks** (owner's choice, 2026-09-28): [gatechain](https://github.com/AlexTavor/gatechain) (mechanical gates), [proof-driven-development](https://github.com/AlexTavor/proof-driven-development) (PDD: CARVE → SHIP → PROVE, mutation-checked tests), [engineering-discipline](https://github.com/AlexTavor/engineering-discipline) (Claude Code skills for how tests and code are written). To be proposed as ADR-0023.

## 0. Summary

| Command | What it does |
| --- | --- |
| `node pipeline/run.mjs build --milestone M2` | Runs every ready task of M2 through the task loop (§3), in dependency order |
| `node pipeline/run.mjs build --task T-C3` | Runs one task |
| `node pipeline/run.mjs gate [--task T-C3 \| --suite gate]` | Runs only the gates (no AI, no tokens) |
| `node pipeline/run.mjs spike S2` | Runs one spike through the spike suite (§7) |
| `node pipeline/run.mjs eval-ai` | The two small AI test sets on the Pro plan (ADR-0016) |
| `node pipeline/run.mjs status` | Tasks by state, open owner questions, and tokens used per task |
| `node pipeline/run.mjs resume` | Continues after a stop, a crash or a Pro usage limit |

**Prime directive: the fewest tokens that still give a correct result.** Every rule below serves it.

- The loop, the gates and the digests are a **script**. They cost no tokens.
- Every AI step is a **fresh session**, with a small task card as its whole context.
- The Opus overseer **wakes only** for escalations and milestone ends.

## 1. Principles

1. **Gates are the truth, not opinions.** A task is good when its gates are green: its tests, the regression suites, gatechain and PDD's mutation proof. Nobody reviews code diffs routinely; you review knowledge items and milestone demos.
2. **Tests come first and are then locked.** The test author writes them from the specification without seeing any implementation. The builder can't change them. A disagreement goes through the dispute path (§5), never through an edit.
3. **Tests must actually constrain the code.** PDD `prove` mutates the changed boundaries. A mutant that survives means a weak test, and the work goes back to the test author, not the builder.
4. **One task, one card, fresh sessions.** No agent carries a conversation from one task to the next. Everything it needs is on the card or reachable with the slice tool (§6).
5. **The script decides the routine; agents decide only what needs judgement.** Retries, ordering, merges into build branches, digests and budgets are all code.
6. **Spec problems go to you, as open questions.** No agent changes the PRD, the architecture, a golden case or an approved binding. It stops and asks through the inbox (§10).

## 2. Agents

The instructions will live in `.claude/agents/<name>.md` (not written yet, §13). Every agent ends with one status line (§6.3).

| Agent | Model | Job | Reads | Never reads | Writes |
| --- | --- | --- | --- | --- | --- |
| **overseer** | Opus | Handles escalations: gives a hint, splits a task, sends it back to the tests, or asks you. Writes milestone reports. | status lines, digests, the card, `usage.jsonl` | code, full documents, held-out anything | card hints, backlog splits, `inbox/OWNER.md` |
| **carver** | Sonnet | Turns a backlog entry into a **task card**: the spec slice, interfaces, the test list, the read list. Splits oversized tasks (PDD CARVE). | backlog entry, slices, `git ls-files`, existing type signatures | implementation bodies | `pipeline/cards/<id>.md` |
| **test-author** | Sonnet | Writes the failing tests from the card; strengthens tests when PROVE finds survivors; rules on disputes | card, slices, interface stubs, the golden cases the card names | implementation files | test files, stubs (`throw new NotImplemented`) |
| **builder** | Sonnet | Makes the locked tests green within the card's scope | card, tests, digest, attempt notes, files on the read list | other tasks' cards, held-out anything | implementation files only |
| **knowledge-author** | Sonnet | Builder for knowledge tasks (WP-E, WP-F, lexicon, bindings); everything lands as `ai-draft` | card, source slices, the family's golden cases | held-out anything | knowledge files, bindings |
| **case-author** | Sonnet | Writes new in-repo golden cases (T-J1, T-J2); held-out cases only in the private repo (§9) | card, sources | implementation; held-out anything (in this repo) | `golden/cases/*` as SOURCE CHECK REQUIRED |
| **auditor** | Sonnet | Once per work package: the judgement checks gates can't make (cohesion, naming, one meaning per term) | the WP's diff stat, and the files it names | cards, tests | `pipeline/audits/<WP>.md`, ≤ 10 findings; blocking ones become backlog tasks |
| **spike-runner** | Sonnet | Runs a spike: throwaway code, measurements, a one-page report | the spike's `SPIKES.md` section, its needs from you | product packages (read-only use only) | `spikes/<id>/`, `docs/architecture/spikes/<id>-report.md` |
| **gate** | (script) | Runs the gates and writes the digest | — | — | `pipeline/state/digests/` |

**Skills** from engineering-discipline, loaded on demand (the per-edit reminder hook is off, via `.no-engineering-sop`, to save tokens):

| Agent | Skills |
| --- | --- |
| carver | decompose-by-attention, pr-sizing, design-completeness, derisk-gate |
| test-author | assert-by-shape, boundary-tests, no-op-paths, property-based-testing, keep-properties-honest, requirements-traceability |
| builder, knowledge-author | guard-clauses, name-and-bundle, silent-failure-census, characterize-before-change |
| auditor | cohesion-review, one-meaning-per-term, footgun-register |
| overseer | decision-gate |
| spike-runner | derisk-gate, reproducibility-baseline |

## 3. The task loop

```text
backlog ─► CARVE ─► RED ─► SHIP ─► GATES ─► MERGE (build/<M>) ─► done
           carver   test-    builder  script   script
                    author     ▲        │
                               └─digest─┘  ≤3 attempts, then overseer
                    ▲                    │
                    └── PROVE survivors ─┘  ≤2 rounds, then overseer
```

| Step | Who | Done when | On failure |
| --- | --- | --- | --- |
| **1 CARVE** | carver | The card passes `card-lint`: every section present; ≤ 80 lines; read list ≤ 8 file ranges; every test maps to a requirement ID or golden case; estimated change ≤ 400 non-test lines | Too big: it writes a split proposal; the overseer approves it into the backlog |
| **2 RED** | test-author | Tests compile against the stubs and **every new test fails** with `NotImplemented` or an assertion (not a syntax or import error). The script records a hash of each test file, which **locks** it. | Retries once, then the overseer |
| **3 SHIP** | builder (or knowledge-author) | It claims done, or files a dispute | — |
| **4 GATES** | script | G0–G6 green (§4) | Red: a digest goes back to step 3. Surviving mutants go back to step 2. |
| **5 MERGE** | script | Merged into `build/<M>`, and G7 green on the result | Red after merge: automatic revert, task re-queued with the digest |

**Task states:** `queued → carved → red → shipping(n) → green → merged`, plus `escalated`, `parked-owner`, `split`. A task is ready when all its `deps` are `merged`. One task at a time by default.

**Milestone end:** the script runs the full milestone suite (ROADMAP §6); the overseer writes `pipeline/reports/<M>.md` (one page: exit criteria ✓/✗, tokens, open questions) and asks you in the inbox: *"Merge `build/<M>` into main?"* Only an AI session that has your yes performs that merge (AGENTS.md).

## 4. Gates

Cheap first; the run stops at the first red one. Exit codes 0 (green), 1 (defect), 2 (no verdict = red).

| Gate | Checks | When |
| --- | --- | --- |
| **G0 lock** | Test files match their RED hashes; diff stays inside the card's allowed paths | Every run |
| **G1 build** | Typecheck, lint, dependency rule (ADR-0001), string-literal lint (NFR-I18N-1) | Every run |
| **G2 task tests** | The card's own tests | Every run |
| **G3 regression** | All unit and property tests, plus the golden **gate** suite restricted to bound cases, per integrity setting | Every run |
| **G4 gatechain fast** | `npx gatechain --fast` | Every run |
| **G5 pdd check** | `pdd check` (silent-failure, dead-branch, no-op-paths, trace-requirements, …) | Every run |
| **G6 prove** | `pdd prove` on changed boundaries; survivors go to the test author | Every run |
| **G7 merge** | `npx gatechain --push` and the milestone's full suites (ROADMAP §6) | After merge into `build/<M>` |
| **G8 knowledge** | Bundle validation, citation resolution (NFR-ACC-3), the family's golden cases | Knowledge tasks, instead of G5–G6 |

**The digest** (`pipeline/state/digests/<id>-<n>.md`) is all the builder sees of a failure, capped at **40 lines**: the failing gate; at most 5 failures as test → `covers:` tags → expected vs actual (≤ 300 chars) → `file:line`; for G6, surviving mutants. Raw logs stay in `pipeline/state/logs/` (gitignored); agents read them only by line range named by the overseer.

**Traceability:** every test carries `// covers: FR-Q-1 golden:<caseId>`. gatechain `trace` and PDD `trace-requirements` fail a requirement with no test; the coverage matrix (T-D2) reads the same tags.

## 5. Feedback and escalation

| Situation | Route | Budget |
| --- | --- | --- |
| Gates red (G0–G5) | digest → builder, fresh session, plus its attempt notes (≤ 5 lines each) | 3 attempts |
| G6 survivors | survivor list → test author → RED → builder | 2 rounds |
| **Builder disputes a test** (≤ 15 lines: test, claim, spec line) | test author, fresh, sees card + test + dispute, **never the code**: (a) test contradicts card → fix, re-lock, attempt not counted; (b) test matches card → upheld with one reason, attempt counts; (c) card or spec in doubt → overseer | 1 ruling |
| Budget spent, or `blocked` | **overseer** (Opus) gets card, last 3 digests, attempt notes; picks one: **HINT** (≤ 20 lines, 2 more attempts), **SPLIT**, **RETEST**, **RESET**, **OWNER** | 1 action, then OWNER |
| Golden case, binding, requirement or ADR in doubt | **OWNER**: question in `inbox/OWNER.md` with options and a proposed OQ text; task `parked-owner`; loop continues with other tasks | — |
| Hard cap | 10 sessions on one task | → OWNER |

**Changing code merged earlier** (PDD PIN): the carver adds "characterise first", and the test author pins current behaviour of touched functions before writing the new tests.

## 6. Keeping context small

1. **Card** (`pipeline/cards/<id>.md`, ≤ 80 lines): Goal · Requirements (exact sliced text) · Golden cases (IDs) · Interfaces · Tests to write (name → covers) · Allowed paths · Read list (≤ 8 ranges) · Out of scope · Hints · Attempts.
2. **Slice tool:** `node pipeline/slice.mjs <ref>` prints only one ID or heading (`FR-Q-1`, `D50`, `OQ-39`, `ADR-0008§3`, `ARCH§5.6`, `golden:<caseId>`, `CR:603.3b`). Agents never open PRD, ARCHITECTURE or a source document in full.
3. **Status line:** every session ends with `PIPELINE-STATUS {"result":"done|dispute|blocked|split","note":"≤200 chars"}`; the script parses only that.
4. **Session limits:** `--max-turns` (carver 15, test-author 30, builder 40, overseer 10, spike-runner 60); `--output-format json` logs tokens to `pipeline/state/usage.jsonl`; `status` shows tokens per task and agent.
5. **Kept out:** held-out cases (§9); raw logs; skills load only on trigger.

## 7. The spike suite

Separate from the product loop. Spike code stays in `spikes/<id>/`; G0 enforces that.

`spike card (SPIKES.md section via slice) → NEEDS check → spike-runner → report gate → owner verdict`

- **NEEDS check (script):** the spike's owner inputs must be marked `provided` in the inbox, else `parked-owner`.
- **Report gate (script):** report exists, ≤ 80 lines; every SPIKES.md pass criterion appears with a measured value and PASS / FAIL / OWNER-DECIDES; "ADRs to confirm or supersede" present; diff only in `spikes/<id>/` and `docs/architecture/spikes/`. Red → spike-runner (2 attempts) → overseer.
- **Human steps:** the spike-runner writes `spikes/<id>/OWNER-STEPS.md` and stops `blocked`; `resume` continues once you've ticked them off.
- **Verdict:** always yours (D37, D22, S3 thresholds).

| Spike | Runs | Needs from you | Unblocks | If it fails |
| --- | --- | --- | --- | --- |
| **S2** Tickets | W4 (2 days) | Test server with Tickets set up like live | T-H2, live M1 demo, T-H4 | Options to you; M1 finishes on console |
| **S1** Voice | W6–W7 (3 days) | Voice channel; 1 h with 2+ speakers | Voice decision; WP-V | Voice dropped (D22), ADR-0015 superseded |
| **S3** Coverage/cost | W9, on the **M2 build** | ~30 real messy texts by 2026-11-23 | Authoring order; cost; T-G1/T-I3 thresholds | Stricter thresholds or escalate: your choice |
| **S4-F** Targeting follow-up | After S3 | — | T-E2 exit | Add missing features, re-run |

S3 uses the product through its CLI, read-only; `interpret`/`reason` run in a Pro-plan session as SPIKES.md describes.

## 8. Bootstrap: stage P (W1, interactive engineer sessions)

| ID | Task | Acceptance | Size |
| --- | --- | --- | --- |
| **T-P0** | Headless check (ADR-0016): `claude -p` with agent prompt, `--model`, `--max-turns`, JSON output on Pro; permitted? usage-limit behaviour? | Note in `pipeline/HEADLESS.md`. If unusable, **fallback B**: overseer is an interactive session spawning the same agents as subagents and calling the same gate script | S |
| T-A1, T-A2 | Scaffold and CI (backlog) | As in backlog | M + S |
| **T-P1** | gatechain + PDD as submodules in `tools/`, configs; engineering-discipline via `--plugin-dir`; licence + Windows check | A planted swallowed error fails G4/G5; a planted weak test fails `pdd prove` | S |
| **T-P2** | `pipeline/slice.mjs` | Fixture test per reference kind; unknown ID exits 1 | S |
| **T-P3** | `pipeline/gate.mjs` (G0–G8, digest cap, locking, RED check) | One planted failure per gate → right digest in ≤ 40 lines | M |
| **T-P4** | `pipeline/run.mjs` (DAG, state, loop, budgets, escalation, inbox, resume, usage log, card-lint) | A scripted fake agent drives one task through every path of §3 and §5 | M |
| **T-P5** | Dry run on T-A4 with real agents | Task merges; token report complete; lessons folded into agent files | S |

**Schedule effect:** M0 starts W2; every ROADMAP date moves one week later (M6 ≈ 2027-02-12).

## 9. Knowledge, cases and the held-out set

- **Knowledge tasks** use the same loop: the "tests" are the family's validated golden cases plus G8; output is `ai-draft`.
- **Your review (FR-BUILD-4)** doesn't block the loop: green items queue for review batches (ROADMAP §7, ~8 h/week) via T-B6. A milestone can't close with gate cases on unapproved items.
- **Case authoring** (T-J1, T-J2, `SCN:`): schema + citation gate; SOURCE CHECK REQUIRED until you sign off.
- **Held-out set** (T-J3, D49): case-author sessions **started in the private repo only**; the `heldout` step prints aggregates (T-D5); the overseer sees only those.

## 10. Your touchpoints

All in **`pipeline/inbox/OWNER.md`** (ID, date needed, options, recommendation; answer inline, then `resume`): main merges, spec-level disputes (become PRD OQs), spike inputs and verdicts, review batches, milestone demos. Input dates: ROADMAP §9, plus one week.

## 11. Risks of the pipeline

| Risk | Mitigation |
| --- | --- |
| Headless `claude -p` unusable/not permitted on Pro | T-P0 first; fallback B |
| Pro usage limits stop a run | File-based state; `resume`; tokens tracked per task |
| gatechain/PDD fail on Windows or licence doesn't fit | T-P1; run under WSL/Docker, or swap G4–G6 behind the same gate interface |
| Tests from the card miss the spec's intent | `covers:` tags; 265-case gate suite as backstop; disputes with spec slices |
| Agents game the gates | G0 locking + allowed paths, gatechain `excuses`/`census`, PDD `prove` |
| Single-author tools | Pinned submodules, wrapped by the gate script |

## 12. Open questions

None new. OQ-37..OQ-41 still stand (ROADMAP §11).

## 13. Not done yet (planning session hit the usage limit)

- The agent instruction files `.claude/agents/{overseer,carver,test-author,builder,knowledge-author,case-author,auditor,spike-runner}.md`.
- ADR-0023 (proposed) for the pipeline and gates.
- Adding T-P0..T-P5 and the spike entries (S2, S1, S3, S4-F) to `backlog.json`, and the one-week shift note in ROADMAP.md.
