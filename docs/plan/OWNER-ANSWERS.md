# Product-owner answers given during the planning phase

The planner may only add open questions to the PRD; it doesn't change requirements or the decision log. Answers that touch requirements are recorded here and as answered open questions in PRD §12, for the PM to move into the decision log. The PRD is the master copy.

| Date | Topic | Question | Answer | Applied in |
| --- | --- | --- | --- | --- |
| 2026-09-28 | OQ-37: MVP frameworks | Which policy frameworks must the MVP support? (The PRD glossary lists the Portuguese addendum as an MVP option; the handover says MTRA only; 59 of the 68 policy cases use plain MTR+IPG.) | **MTRA (Notion) + plain MTR/IPG.** The Portuguese addendum moves to post-MVP. | PLAN §1.3, WP-F |
| 2026-09-28 | OQ-38: Legacy integrity cases | How should the Legacy integrity cases count? | **Gate the release too.** The question said "33"; the correct count is 29 Legacy, plus 4 Regular REL cases that are asked about separately (PLAN §9). | PLAN §2, §6 |
| 2026-09-28 | Review capacity | Hours a week for reviewing drafted items | **About 8 hours a week or more.** | PLAN §7 |
| 2026-09-28 | Spike plan | Approve `docs/architecture/SPIKES.md`? | **Approved as written.** Spike code may now be written in `spikes/`. | PLAN §8 |
| 2026-09-28 | Plan shape | What should the plan be? | **A delivery pipeline, not a schedule.** RUP, closely followed, with highly documented handoffs. Every stage ends in something inspectable that the owner approves; then the project manager boots the next agent. Tests gate the implementation, with a feedback loop to the builder. Fewest feasible tokens. Dates don't matter. | DEVELOPMENT-CASE.md, PLAN.md v3, ADR-0023 |
| 2026-09-28 | Building blocks | Tests and code approach | **gatechain, engineering-discipline and PDD** (github.com/AlexTavor) as the starting point | ADR-0023, DEVELOPMENT-CASE §8 |
| 2026-09-28 | Orchestration and models | How the loop runs; which models | Lean orchestration. Sonnet for the roles; **Opus only for the project manager and escalations.** | DEVELOPMENT-CASE §3 |
| 2026-09-28 | Owner capacity | Hours a week | **About 40 h/week** (corrects the earlier 8 h/week) | ROADMAP header |
| 2026-09-29 | E2 revision 1 | Approve the RUP process design? | **Rejected.** Construction and Transition must be PDD-type processes, and test hardening was missing. | DEVELOPMENT-CASE rev 2, ADR-0023 rev 2 |
| 2026-09-29 | Hardening thresholds | Which mutation-score threshold? | **Tiered:** 100% of named boundaries killed (`pdd prove`); module grade ≥ 90% for `core`, ≥ 75% for adapters and pipeline | DEVELOPMENT-CASE §8.2 |
| 2026-09-29 | Hardener | Who hardens the tests? | **A separate test-hardener agent** that writes tests only | `.claude/agents/test-hardener.md` |
| 2026-09-29 | Elaboration and PDD | Should Elaboration use PDD too? | **E4 yes (PDD cycle 0), E3 no** (it builds the PDD tooling) | PLAN.md §2 |
| 2026-09-29 | E2 revision 2 | Approve the process design? | **Approved with notes:** "my worry here is that it would be too expensive, need to tune auto-reviewing & testing vs speed and tokens." Becomes an E3 exit criterion: a cost baseline plus a tuning proposal for the owner to decide. | E2 package Part B, handover 03, PLAN.md E3 |
