# Boot mechanism (T-P4)

Checked 2026-09-29 by the toolsmith, in the E3 TOOLING stage.

## Verdict

**Boot roles as subagents** (Agent tool, `subagent_type` = the file name in `.claude/agents/`). Do not build on headless `claude -p` yet.

## What was verified

| Claim | Evidence |
| --- | --- |
| The 14 role files exist with `name`, `description`, `tools`, `model` front matter | `.claude/agents/*.md` (for example `toolsmith.md`: `model: sonnet`) |
| A role can be booted as a subagent, follows its role file, reads repo files, runs Bash, and returns a report | This very session: the toolsmith was booted this way by the project manager, read the brief and ADR-0016, and hands back through `SubagentHandback` |
| The project manager can read the result back | The hand-back message is delivered to the caller; the report's first line can carry the STATUS line (`done`, `blocked`, ...) |
| Runs on the owner's Pro plan with no API spend | The session runs inside the owner's Claude Code account (ADR-0016 decision 1) |

## What could NOT be verified here

- **Headless `claude -p --agent <role>`:** the `claude` executable is not on PATH in this environment (Git Bash and PowerShell both report "not found"), so `claude --version`, `claude -p` and `--help` could not be run. Whether headless use is permitted on a Pro subscription is therefore **unconfirmed**. ADR-0016 decision 4 already names this as something the engineer must check before building the eval-only adapter; the fallback (an interactive session stepping through cases) stays in force.
- **Maximum run time of a subagent:** not measurable from inside one. Observed limit: only the per-task turn budget in the boot prompt (60). Treat long tasks as needing one session per task, as the brief already plans.
- **Behaviour at a usage limit:** not observable without hitting it. Working assumption, to confirm: the session stops with a limit message and resumes after the reset window. Mitigation, which costs nothing: every task ends by committing and updating `STATE.md`, so a cut-off session loses at most one task, and the project manager re-boots that task from its card.
- **Model selection:** the front matter names `sonnet`. The model that answered this session identified itself as Sonnet 5.5. Whether the `model:` field is honoured for every role (for example a stronger model for the architect) is not checked.

## Follow-ups for the owner (need a human, not an agent)

1. Run `claude --version` and `claude -p "say ok"` in a normal terminal; if `claude` is missing from PATH, note the install path.
2. If headless works, run it once and check it is billed to Pro, not API. Record the result here.
3. Note the first real usage-limit message and how the session ended, for the cost baseline.

## Rules until then

- Boot by subagent only. One session per task. Each session logs tokens and wall time in its report.
- No pipeline code calls `claude -p`. This keeps ADR-0016 decision 2 intact.
