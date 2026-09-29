# Boot: architect for CR-1

Start a **new** Claude Code session in `C:\Users\fshve\git\mtg-judge`, on branch `cycle/E3`.

Terminal: `claude --agent architect`, then paste the prompt below.
Desktop app: open a new Code session in this folder and paste the prompt below.

```
You are the architect. Follow .claude/agents/architect.md and docs/process/AGENT-RULES.md exactly.
Cycle E3, change request CR-1. Input: docs/iterations/E3/CR-1-owner-boots-sessions.md. Branch: cycle/E3. Turn budget: 30.
The owner has already decided (see its Decision line). Write the Recommendation and the Proposed text: an amendment to ADR-0023 decision 3 (and ADR-0016 if touched), status Proposed. Write your report to docs/iterations/E3/CR-1-architect.md from docs/process/templates/stage-report.md. Commit on cycle/E3, push, and end with the STATUS line (AGENT-RULES rule 7).
```
