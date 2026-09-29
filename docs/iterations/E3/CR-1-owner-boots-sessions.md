# CR-1: The owner boots every role as a new Claude Code session; agents must end as specified

Raised by: project-manager in E3 stage 2 (after tasks T-P4, T-A1) · Blocks: T-A2, T-P1, T-P2, T-P3, dry run · Kind: architecture + process

**Decision:** DECIDED by the owner in chat, 2026-09-29: (1) the project manager no longer starts agents; it writes a boot instruction and the owner starts each role as a new Claude Code session; (2) fix the agent instructions so every role behaves as specified. The architect writes the ADR text and the process engineer applies it; the owner approves both.

## What's in doubt

1. ADR-0023 decision 3: "the project manager is the only agent that boots agents (as subagents by default; headless `claude -p` is the fallback, decided in E3)".
2. DEVELOPMENT-CASE §7 "Booting", `.claude/agents/project-manager.md` "Booting" and "SHIP inner loop", `pipeline/BOOT.md` (T-P4 verdict: subagents).
3. AGENT-RULES rules 5 and 7 (stage report, final `STATUS {...}` line) and `.claude/agents/toolsmith.md`.

## Why

- Both toolsmith sessions (T-P4 commit 750ad5c, T-A1 commit caf1141) did the work but wrote **no stage report** and ended **without the `STATUS {...}` line** required by AGENT-RULES rule 7. Their prompts named the brief, whose Part B did not repeat the rule.
- The owner wants tight control: they want to see and start every session themselves, not have the project manager spawn them.

## Options

1. As decided: the project manager writes, per stage/unit, a boot instruction (a command plus a paste-in prompt) into `docs/iterations/<cycle>/boot/` and stops; the owner starts the session, which ends with the report and the STATUS line; the owner tells the project manager "continue". Consequence: more owner steps per stage (notably the SHIP inner loop's retries), tighter control, no subagent spawning.

## Recommendation

<Architect.>

## Proposed text

<Architect: amendment to ADR-0023 decision 3, and whether ADR-0016 is touched.>
