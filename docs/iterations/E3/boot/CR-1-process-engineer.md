# Boot: process engineer for CR-1 (after the owner approves the architect's ADR text)

Start a **new** Claude Code session in `C:\Users\fshve\git\mtg-judge`, on branch `cycle/E3`.

Terminal: `claude --agent process-engineer`, then paste the prompt below.
Desktop app: open a new Code session in this folder and paste the prompt below.

```
You are the process engineer. Follow .claude/agents/process-engineer.md and docs/process/AGENT-RULES.md exactly.
Cycle E3, change request CR-1. Input: docs/iterations/E3/CR-1-owner-boots-sessions.md and docs/iterations/E3/CR-1-architect.md. Branch: cycle/E3. Turn budget: 40.
Apply the owner's decision: (1) the project manager no longer starts agents; it writes a boot file per stage/unit in docs/iterations/<cycle>/boot/ (a command plus a paste-in prompt, like this one) and stops; update .claude/agents/project-manager.md, DEVELOPMENT-CASE §7 and §8.1, and pipeline/BOOT.md. (2) Make every role file state, in its own text, the three things each session must do: write the stage report from the template at the named path, commit and push on the named branch, and end with exactly the STATUS line. Keep files lean. Write your report to docs/iterations/E3/CR-1-process.md, commit (`Process: CR-1 …`), push, and end with the STATUS line.
```
