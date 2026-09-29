# ADR-0024: The owner boots every agent session; the project manager writes boot instructions

Status: Proposed · Date: 2026-09-29 · Requirements: P2, FR-BUILD-1..4, §8 · Amends: ADR-0023 decision 3 (only) · Change request: `docs/iterations/E3/CR-1-owner-boots-sessions.md`

## Context

ADR-0023 decision 3 makes the project manager the only agent that boots agents, as subagents by default (T-P4 verdict, `pipeline/BOOT.md`). In E3 stage 2, both toolsmith sessions (T-P4 commit 750ad5c, T-A1 commit caf1141) did their work but wrote no stage report and ended without the `STATUS {...}` line (AGENT-RULES rules 5 and 7). The owner also wants to see and start every session personally. The owner decided on 2026-09-29 (CR-1 Decision line).

## Options considered

1. **Keep ADR-0023 decision 3** and only tighten the agent instructions. Rejected by the owner: no direct control over sessions.
2. **Amend decision 3** so the owner starts every session from a boot instruction written by the project manager (this ADR).
3. **Supersede ADR-0023 as a whole.** Unnecessary: decisions 1, 2 and 4–8 are unaffected.

## Decision

Option 2. ADR-0023 decision 3 is replaced by:

> 3. **Every stage writes a stage report.** Part A is the owner's approval package; Part B is the handoff. No stage starts on an unapproved report. **No agent starts another agent.** For each stage, task or SHIP attempt, the project manager writes a boot instruction to `docs/iterations/<cycle>/boot/<id>.md` — the role, the branch, the turn budget, the report to read, the report path to write, and a paste-in prompt that repeats AGENT-RULES rules 5 and 7 — and then stops. **The owner starts each role as a new Claude Code session** from that instruction. Every session ends by committing its stage report and printing the `STATUS {...}` line as its last line. The owner then tells the project manager "continue"; the project manager reads the STATUS line and the report headings only.

A session that ends without its report or STATUS line has not finished: the project manager records it as `blocked` and writes a boot instruction for a repair session.

Everything else in ADR-0023 stands. SHIP retry budgets (decision 5) are unchanged; each retry is one owner-started session.

**ADR-0016 is not touched.** It governs how build and eval are paid for (Pro subscription) and the eval-only headless adapter for `LlmPort`; it says nothing about how agents are booted. Sessions the owner starts run on the same subscription.

## Consequences

- The owner performs one extra step per session, most visibly in the SHIP inner loop (up to 3 attempts per unit). Accepted in exchange for control.
- The project manager needs no `Agent` tool; its file loses subagent booting. `pipeline/BOOT.md`'s subagent verdict (T-P4) becomes historical.
- Boot prompts carry the report and STATUS obligations themselves, so a session does not depend on a brief's Part B repeating them.
- Files the process engineer must change: DEVELOPMENT-CASE §7 "Booting"; `.claude/agents/project-manager.md` ("Booting", "SHIP inner loop", tools); `pipeline/BOOT.md`; AGENT-RULES rules 5, 7 and 10; `.claude/agents/toolsmith.md`; a boot-instruction template in `docs/process/templates/`.

## Revisit when

- Owner steps per cycle exceed what ~40 h/week allows (for example SHIP retries dominate).
- The E3 dry run shows sessions still ending without report or STATUS line despite the boot prompt.
