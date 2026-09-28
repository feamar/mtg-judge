# AI MTG Judge: Roadmap (milestones, test base, review load)

Moved from PLAN.md v1 on 2026-09-28. The task tables of the old §5 are in [backlog.json](backlog.json); the spikes of the old §8 are the `WP-S` entries there, placed by PLAN.md §2. Section numbers are kept so cross-references still work.

> **Superseded as the plan (2026-09-28):** the plan is now [PLAN.md](PLAN.md) v3 + [DEVELOPMENT-CASE.md](../process/DEVELOPMENT-CASE.md). This file is kept as reference for milestone exits, the test base (§2), the test suites (§6) and risks (§10). **Its dates and weekly sizes are not part of the plan. The owner has about 40 h/week, not the 8 h/week in §1.1 and §7.**

## 0. Summary

| Milestone | What you'll see | Weeks | Indicative end |
| --- | --- | --- | --- |
| **M0** Foundations | The repo builds, CI runs, and every citation in the golden set resolves against the imported CR, IPG, MTR, MTRA and card data | W1–W2 | 2026-10-16 |
| **M1** Walking skeleton | In a test Discord server, a Tickets thread asking "what is priority?" gets the approved answer with citations, and **[Ask a human judge]** posts a handoff in the judge-only channel | W3–W4 | 2026-10-30 |
| **M2** Rules questions from the library | The bot answers the golden set's rules questions from approved library content, **with no AI**, and CI shows the pass rate per family. Spike S3 has measured real messy text. | W5–W8 | 2026-11-27 |
| **M3** Disputes | A Missed Trigger dispute at an MTRA event runs on buttons: only the deciding facts are asked, a Warning-or-less penalty is issued, and major infractions and integrity cases go to the judge-only channel without leaking | W8–W11 | 2026-12-18 |
| **M4** Messy input and the AI edge | Narrated stories and messy text give the same answers as clean text; library misses get a marked, verified AI answer | W11–W14 | 2027-01-08 |
| **M5** Running on your desktop | 24/7 on the host: survives restarts, picks up tickets opened while down, deletes records after 7 days, stays under the spend cap | W13–W15 | 2027-01-15 |
| **M6** Release candidate and pilot | The release gate passes, held-out results are reported, you approve, and the pilot starts on your live server (after the OQ-12 gate) | W16–W18 | 2027-02-05 |

Dates assume week 1 starts on Monday **2026-10-05**, the Monday after the plan is approved, and move with it (W5 = 2026-11-02, W9 = 2026-11-30, W13 = 2026-12-28, W17 = 2027-01-25). If voice passes S1 and you keep it, M5 grows by about 2 weeks.

## 1. Planning basis

### 1.1 Who does the work

| Role | Where | What |
| --- | --- | --- |
| **Engineer** | Claude Code sessions on the Pro plan | Code in the monorepo: `core`, `adapters/*`, `pipeline`, `eval`, `app`. Spike code under `spikes/` only. |
| **Knowledge author** | Claude Code sessions on the Pro plan | Card features, rule-module specs, strategies, ruling entries, procedures, penalty rows, addendum edits, templates, lexicon, and golden-case bindings. Everything lands as `ai-draft` files. |
| **Case author** | Separate Claude Code sessions | New golden cases. **Held-out cases are written in sessions outside this repository**, and are stored in a private repository (D49). |
| **Owner** | You | Approves every drafted item (FR-BUILD-4), provides the inputs in §9, decides the open questions, approves merges and releases. |

**Size units.** A **session** is one focused Claude Code session, about half a working day. Sizes: **S** = 1 session, **M** = 2–3, **L** = 4–6. Anything larger is split. The calendar assumes about 6–8 sessions a week within Pro usage limits (R-P2).

**Owner review capacity:** about **8 hours a week** (your answer, 2026-09-28). §7 plans the review batches against it.

### 1.2 Constraints the plan keeps

- **No paid API spend** for build and test (D45, ADR-0016). Authoring and the two small AI test sets run on the Pro plan. The API key exists only for the live bot, from M6.
- **The deterministic core comes first** (D50). Everything up to M3 is testable with no AI at all. The AI edge (`interpret`, `reason`) arrives in M4.
- **`core` has no I/O** and imports nothing from Discord, Anthropic, SQLite or Node-only modules (ADR-0001). CI enforces this from M0.
- **No production code** is written in the planning phase. The engineer starts from `main` after this plan is merged.

### 1.3 Scope decisions from this phase

These are recorded as answered open questions (OQ-37, OQ-38) for the PM to fold into the PRD:

- **Frameworks in the MVP: MTRA (Notion, `MTRA-NOTION@2025-06-24`) and plain MTR + IPG (no addendum).** The Portuguese addendum moves to post-MVP.
- **The 29 Legacy integrity cases gate the release,** like MVP cases. The other 77 Legacy cases are run and reported but don't gate.

## 2. The test base and the release gate

### 2.1 How the 348 cases split

| Group | Cases | Easy | Hard | Gates the release? |
| --- | --- | --- | --- | --- |
| In MVP scope: format cEDH, multiplayer or `any`; REL Competitive or not material | 236 | 165 | 71 | **Yes** |
| Legacy (1v1) with integrity-mode expectations | 29 | 23 | 6 | **Yes** (OQ-38) |
| Legacy (1v1), other | 77 | 46 | 31 | No, run and reported |
| Regular REL (JAR is post-MVP, PRD §4) | 6 | 6 | 0 | No, run and reported (see §9: 4 of them carry integrity expectations) |
| **Total** | **348** | **240** | **108** | |

**The gate set is 265 cases: 188 easy, 77 hard.**

- **Rules questions** in the gate: 215, all in the MVP-scope group.
- **Disputes** in the gate: 50 (21 in MVP scope, plus the 29 Legacy integrity cases).
- **Integrity runs:** 34 gate cases carry `availableIntegritySettings`, and each runs once per setting: **68 runs** (ADR-0013 §6).

### 2.2 Gaps the plan fills

| Gap | Why it matters | Where it's handled |
| --- | --- | --- |
| **Only 9 cases use the MTRA**, the framework of your own events. There is no golden case for the FR-POL-1 AC (MTRA Deck Problem → Turn Skip), and none for the FR-INT-3 AC (MTRA Hidden Card Error remedy). | The MVP's main framework is barely tested | T-J1: MTRA variants of the gate's policy cases (about 35), signed off by you |
| **Golden cases say what the answer is in prose,** not which entry, branch and scripted choices produce it (ADR-0013 needs IDs). Imported cases are regenerated by their importers, so they can't be edited by hand. | The deterministic suite can't run a case until it's bound to library IDs | T-A4: a **binding file** per case (`golden/bindings/<caseId>.yaml`), written with the library item and reviewed with it |
| **37 imported policy cases** (33 in the gate) are written to "the app" in the third person ("What must the app establish before…"). They aren't player text. | The raw-text → matcher path doesn't apply to them | **OQ-39** (options there). Until it's answered, they're run from a bound canonical question. |
| **No held-out set exists** (D49) | Required before release | T-J3, from M3 |
| **348 cases, target about 1,000 at launch** (D38) | Drives a large case-author and review workload | T-J2 plus the held-out set; **OQ-40** asks whether 1,000 gates the release |
| A hard rules question that expects no escalation, but has no library entry, would fall back to AI, which the deterministic suite can't grade | The meaning of "pass" for such hard cases | **OQ-41** |

## 3. Milestones

Each milestone ends with a demo to you, a green CI, and a merge into `main` that you approve.

### M0 Foundations (W1–W2)

**Goal:** the monorepo, CI and the source import exist; everything the golden set cites resolves.
**Exit:** CI green on `main`; the dependency rule check fails on a planted violation; all 348 cases validate against the schema; every `CR:`, `IPG:`, `MTR:`, `MTRA:` and `Oracle:` citation in the gate set resolves in a locally built bundle (NFR-ACC-3); the coverage matrix (T-D2) lists every gate case by family.
**Tasks:** T-A1–A4, T-B1–B5, T-D2 (matrix part).

### M1 Walking skeleton (W3–W4)

**Goal:** the thinnest end-to-end path through every layer (§4).
**Exit:** the §4 demo works live in the test server; the same flow passes as a replayed test in CI; S2 report written.
**Tasks:** T-B6, T-C1 (exact and normalised names only), T-C2 (minimal), T-C3 (no-fact graphs), T-C4 (minimal), T-C5 (citation check and lint), T-C6 (button handoff only), T-C7, T-C8, T-D1 (minimal), T-H1, T-H2, spike S2, and the priority concept entry (T-E1, first item).

### M2 Rules questions from the library (W5–W8)

**Goal:** most of the gate's rules questions are answered deterministically from approved content.
**Exit:**
- every easy rules-question gate case in families E1–E6 (§5, WP-E) passes, with its binding approved;
- every approved strategy reproduces its `derivedFrom` cases (T-D4);
- S3 run on the M2 build and reported (§8);
- S1 run, and your voice decision taken.

**Tasks:** T-C1 (fuzzy and nicknames), T-C2 (full), T-C3 (facts, three-valued evaluation, next question), T-C9 (targeting, triggers, mana modules), T-E0–E6, T-E9, T-D1 (full rules path), T-D4.

### M3 Disputes (W8–W11)

**Goal:** investigation, penalties, fixes, integrity and handoffs, for plain MTR/IPG and the MTRA.
**Exit:**
- all 50 gate disputes pass, including all 68 integrity runs, and the MTRA variants from T-J1;
- no protected content in any player-audience message in any run (FR-ESC-4 AC);
- the FR-POL-1, FR-POL-4, FR-INT-3 and FR-ESC-4 ACs are each covered by at least one passing case.

**Tasks:** T-C4 (penalties, fixes, delivery patterns, remedy tags), T-C6 (full), T-C10, T-F1–F5, T-J1, T-J3 starts.

### M4 Messy input and the AI edge (W11–W14)

**Goal:** the normaliser, narration intake, robustness suite, `interpret` and the `reason` fallback.
**Exit:**
- **100% of the 188 easy gate cases pass** (NFR-ACC-1);
- every hard gate case matches its escalation expectation (NFR-ACC-2; see OQ-41);
- the robustness suite has **zero confidently wrong** results at severities 1–3 (NFR-ROB-1);
- `intake-01` and the FR-INT-4 ACs pass;
- AI sets (a) and (b) have been run on the Pro plan and reported;
- families E7–E8 are done.

**Tasks:** T-G1–G4, T-I1–I3, T-I5, T-D3, T-D6, T-E7, T-E8, T-E10.

### M5 Running on your desktop (W13–W15)

**Goal:** operations: commands, catch-up, retention, deployment, spend cap.
**Exit:**
- the S2 outage test passes again on the product code: 2 tickets picked up, 1 ignored, no duplicate greetings (NFR-AVAIL-1);
- the retention job deletes a case older than 7 days (D39);
- the questions-only mode switches on at a test cap (NFR-COST-2);
- the bot restarts on boot;
- the daily summary is posted.

**Tasks:** T-H3–H7, T-I4, and T-V1–V3 if voice is in.

### M6 Release candidate and pilot (W16–W18)

**Goal:** the release gate and the pilot.
**Exit (PRD §8, FR-BUILD-3):**
- 100% of the easy gate cases pass;
- the hard cases' escalation behaviour matches;
- robustness has zero confidently wrong results;
- no leaks, and no unresolvable citations;
- the AI sets and the held-out aggregates are reported;
- **OQ-12 is settled**;
- you approve the release report.

The pilot then runs on your live server for 2 weeks, with the daily summary.
**Tasks:** T-J3 (run), T-K1–K3.

## 4. The walking skeleton

**The suggestion is adopted, with two changes.**

**Path:**

1. A Tickets thread opens under the test panel channel.
2. The `discord-private-thread` TicketSource detects it and parses the description.
3. Intake: only the **skip rule** runs (the opening text contains a question).
4. The normaliser does the minimum: text normalisation and the lexicon.
5. The matcher maps "what is priority" to concept `priority`.
6. The `RulingEntry` has no facts and one branch.
7. The composer returns the short in-game answer plus [Why?] and [Ask a human judge].
8. The verifier checks that every citation resolves in the bundle, and runs the output lint.
9. The outbox posts to `Table`.
10. Every step is appended to the case log in `runtime.sqlite`, with `systemVersion` and `bundleVersion` (NFR-VER-1).
11. **The handoff:** a tap on [Ask a human judge] posts the FR-ESC-3 package to `Staff`, and the FR-ESC-5 neutral message to `Table`.

**Change 1: a console front end first.** The skeleton is built against a console adapter and a fake TicketSource that replays recorded fixtures. When S2 is done in W3, the Discord adapter and the real TicketSource slot in behind the same ports. This keeps M1 moving if the test server comes late. It also gives the golden runner its replay harness.

**Change 2: the answer is the priority concept entry** (`judge-what-is-priority`), not a strategy. It has no facts and one branch, so the skeleton tests the layers, not the engine's hardest part. The first strategy (targeting, ported from S4) follows in M2.

**Why it's the right slice:** it touches the bundle (CR import, entries, templates), `core` (matcher, composer, verifier, orchestrator, audience guard), both SQLite stores, the Discord adapter, the TicketSource, the golden runner, and both audiences. It uses no AI and doesn't depend on the engine's fact logic.

## 5. Work packages and tasks

Moved to [backlog.json](backlog.json). The pipeline reads it; `node pipeline/run.mjs status` prints it.

## 6. Test plan

| Suite | What it proves | Runs where, when | M0 | M1 | M2 | M3 | M4 | M5 | M6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Schema and citations | Every case valid; every citation resolves (NFR-ACC-3) | CI, every commit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Unit and property tests | Engine invariants, modules, verifier, audiences, dependency rule | CI, every commit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Deterministic golden suite, gate filter** (265 cases, no AI, no Legacy except the 29 integrity cases) | NFR-ACC-1/2, FR-INV-2, FR-POL-1/2/4, FR-ESC-*, NFR-IMP-1 | CI, every commit | matrix | skeleton | rules E1–E6 | + disputes | **100% easy** | ✓ | ✓ |
| **Integrity runs** (34 cases × 2 settings = 68) | D57–D59, FR-ESC-4 ACs | CI, inside the gate suite | | | | ✓ | ✓ | ✓ | ✓ |
| Report-only suite (77 Legacy + 6 JAR) | Regression visibility; doesn't block | CI, every commit | | | ✓ | ✓ | ✓ | ✓ | ✓ |
| Strategy self-check | Each strategy reproduces its `derivedFrom` cases | CI | | | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Robustness** (noisify severities 1–3, fixed seeds, plus human variants) | NFR-ROB-1: confidently wrong = 0 | CI, every commit | | | smoke | smoke | **gate** | ✓ | ✓ |
| Replay fixtures of Tickets threads | R13, FR-INT-1 | CI | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Integration tests on the test server | Discord, TicketSource, catch-up | Manually per milestone | | ✓ | | ✓ | | ✓ | ✓ |
| **AI set (a) `interpret`** | Mapping onto closed lists | Pro plan, when prompts or models change, and before release | | | | | ✓ | | ✓ |
| **AI set (b) `reason`** | Fallback citations inside the retrieval set, conclusions; you read the rest | Pro plan, same | | | | | ✓ | | ✓ |
| **Held-out** (T-J3) | Generalisation of the matcher and strategies | Aggregates only, M4 exit and release | | | | | ✓ | | ✓ |

**Rules for the suites:**

- The gate is exactly the set in §2. Changing it needs your decision.
- A gate case counts only when it's **VALIDATED** and its **binding is approved**. Until then it shows as "unbound" in the matrix, and the M4 exit requires none left in the gate.
- Noise seeds are fixed in the repository, so a run is reproducible. New seeds are added, never changed.
- Held-out results never appear case by case in any repository, log or AI session.

## 7. Knowledge work and your review load

**Estimate of your review work** (FR-BUILD-4), with the tooling from T-B6 showing each item next to its sources:

| Item | Count (estimate) | Minutes each | Hours |
| --- | --- | --- | --- |
| Card features used by strategies | about 300 cards | 1 | 5 |
| Strategies and ruling entries, with their case bindings | about 130 | 5 | 11 |
| Procedures (2 frameworks) | about 32 | 15 | 8 |
| Penalty rows and MTRA addendum edits | about 70 | 1–3 | 3 |
| System templates (greetings, prompts, handoff, read-back) | about 80 | 1 | 1.5 |
| Lexicon terms and mnemonics | about 300 + 15 | — | 2 |
| New cases: MTRA variants, family growth, held-out, AI sets | about 700 | 2–3 | 25–35 |
| **Total** | | | **about 55–65 h** |

At 8 hours a week that's about 8 weeks of review, spread over W3–W17.

**Review batches** (each batch is one review session of 2–4 hours; the rest of the week goes to cases):

| Batch | Week | Content |
| --- | --- | --- |
| RB1 | W3 | Source import spot-checks (CR, IPG, MTR, MTRA sections; the stripped-annotation list); the priority entry; the skeleton's templates |
| RB2 | W5 | Targeting and countering (the S4 port): features, strategies, bindings |
| RB3 | W6 | Triggers; mana |
| RB4 | W7 | Timing and SBAs; casting and costs (part 1) |
| RB5 | W8 | Casting and costs (part 2); penalty rows; MTRA addendum edits |
| RB6 | W9 | Procedures: Missed Trigger, Hidden Card Error, GRV, Looking at Extra Cards (both frameworks); MTRA variants (T-J1) |
| RB7 | W10 | Remaining procedures; integrity predicates and remedy tags |
| RB8 | W11 | Replacement, zones and commander |
| RB9 | W12 | Layers and copy; concept mnemonics |
| RB10 | W13 | Lexicon, intake templates, tone check of all player-facing templates (NFR-TONE-1) |
| RB11 | W14 | AI sets (a) and (b); reading set (b)'s answers |
| RB12 | W16 | Release report |

**New cases** (T-J2, T-J3) come in weekly batches of about 60–80 from W6, in families, so one review covers several variants (R12).

**Held-out sessions** (T-J3) run W9–W14. You take part as the source of real situations. The planner and engineer never see their content.

## 8. Spikes

Moved to PLAN.md §7 (the spike suite).

## 9. What you need to provide, and when

| Needed by | What | For |
| --- | --- | --- |
| **Now** | Should the 4 Regular REL cases with integrity expectations (`expansion-pol-042`, `044`, `045`, `046`) gate the release? My proposal: no, because JAR handling is post-MVP (ADR-0021 §4). | §2 gate |
| 2026-10-02 | Approve this plan and its merge into `main` | Start of W1 |
| 2026-10-05 (W1) | Set GitHub's default branch back to `main`; make sure Actions is enabled on the repository | CI |
| 2026-10-09 (W1) | Answers to **OQ-39, OQ-40, OQ-41** | Binding format and gate definition, before M2 |
| **2026-10-16** (end of W2) | **S2:** a Discord test server with Tickets set up like the live one; a dev bot application whose token you put in the local env file; a judge-only test channel; 2–3 test accounts | M1 live demo, S2 |
| Weekly from W3 | About 8 hours of review, in the batches of §7 | Every milestone |
| 2026-11-02 (W5) | **S1:** a voice channel on the test server, and one hour with 2+ speakers | S1 |
| 2026-11-13 | **Voice decision** from the S1 numbers | Scope of M5 |
| **2026-11-16** (W7) | **S3:** about 30 real messy texts (pseudonymised, about 75% rules questions, none already golden); `SCN:` openings or pasted Discord messages are fine | S3 |
| 2026-11-23 (W8) | Approve a cEDH staples list (the knowledge author drafts it) | T-E11 |
| 2026-11-30 (W9) | A **private** repository for the held-out set (for example `mtg-judge-heldout`) | T-J3 |
| 2026-12-28 (W13) | The host: switch on Intel VT-x in the BIOS, then install WSL2 and Docker Desktop, or tell us to use the Windows-service fallback; turn on Device encryption if available | T-H6 |
| 2027-01-11 (W15) | An Anthropic API account with credits (about $20), and the key in the host's env file | Pilot |
| **2027-01-29** (W17) | **OQ-12:** Wizards' reply, or your decision on how the pilot runs without it | T-K2, release |

## 10. Risks

| ID | Risk | Mitigation |
| --- | --- | --- |
| R-P1 | **Your review time is the bottleneck** (R12): about 55–65 hours in total | Batches (§7); families, so one review covers several cases; T-B6 shows each item next to its sources; small entries. If a batch slips, the milestones after it slip with it, and the plan says so in the weekly status. |
| R-P2 | **Pro usage limits** throttle engineer and author sessions | Sizes in sessions; gate content first; the report-only suite and T-E11 are the first to slip |
| R-P3 | Binding reveals that a case's prose answer and the drafted template disagree | Every mismatch goes to you as a question. Nothing is silently "fixed" in either direction (AGENTS.md). |
| R-P4 | The 33 third-person gate cases can't run from raw text | OQ-39. Until then they run from a bound canonical question. |
| R-P5 | Hard layers and copy cases can't be codified in time | Strategies for the common cEDH cases; the rest as one-off entries, or expected escalation where the case says so; OQ-41 settles what "pass" means |
| R-P6 | S2 fails | M1 on the console front end; §8's options for you |
| R-P7 | VT-x can't be enabled | The Windows-service fallback (ADR-0003), same build and config |
| R-P8 | OQ-12's answer restricts use | The design already cites numbers, quotes briefly, links to sources and uses no logos. The pilot stays on your server until it's settled. |
| R-P9 | The pinned card subset in the public repository copies Oracle text (T-B2) | Only the cards actually used; the golden set already holds such snapshots; revisit with OQ-12 |
| R-P10 | A CR, IPG or MTRA update lands mid-build (R6) | The D25 rebuild flow: diff, stale flags, re-review of changed items only |
| R-P11 | M4 falls over the holidays | M4 and M5 overlap; the holiday weeks carry authoring that doesn't need you |
| R-P12 | Held-out cases leak into building sessions | A separate repository; held-out sessions run outside this repository; T-D5 prints aggregates only |

## 11. Open questions raised by this plan

Added to PRD §12:

- **OQ-37** MVP frameworks. *Answered by you on 2026-09-28:* MTRA (Notion) and plain MTR/IPG; the Portuguese addendum moves to post-MVP. The PM folds it into §3, §4, §5 and the glossary.
- **OQ-38** Legacy integrity cases in the gate. *Answered by you on 2026-09-28:* yes, the 29 Legacy integrity cases gate the release. The PM folds it into §8.
- **OQ-39** How the 33 third-person gate cases pass.
- **OQ-40** Whether about 1,000 cases (D38) gates the release.
- **OQ-41** What "pass" means for a hard rules question that expects no escalation and has no library entry.
