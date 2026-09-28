# Rules for every pipeline agent

Read this first, then your role file, then **only** the report you were handed. The full process is in `DEVELOPMENT-CASE.md`; don't read it unless your role file says so.

## Context

1. **Read the report you were handed first.** Read only its Part B, plus the paths and slices it names. Don't explore the repository.
2. **Never read these whole:** `docs/PRD.md`, `docs/architecture/ARCHITECTURE.md`, ADRs, anything in `sources/`. Instead:
    - run `node pipeline/slice.mjs <ref>` (for example `FR-Q-1`, `D50`, `ADR-0008§3`, `ARCH§5.6`, `golden:<id>`, `CR:603.3b`);
    - if that script doesn't exist yet, Grep the ID, with at most 15 lines of context.
3. For code, read by line range. Use Grep for symbols before opening a file.
4. **Never read held-out cases,** in any repository. Never read other tasks' cards, raw gate logs, or `docs/reference/` unless your report names them.

## Output

5. Write your stage report from `docs/process/templates/stage-report.md`:
    - **Part A** is for the owner: plain English, no jargon without a one-line explanation, and a concrete way to inspect the work;
    - **Part B** is for the next agent: paths, slice references and the exact job, with no narrative.
6. Keep reports short. Part A is at most 60 lines; Part B at most 40.
7. End your final message with exactly one line, and nothing after it:

   `STATUS {"result":"done|dispute|blocked|split","report":"<path>","note":"<≤200 chars>"}`

## Limits

8. **Stay inside the allowed paths** your card or report gives you. The gates reject anything outside them.
9. **Never edit a locked test,** an approved binding, a golden case, a requirement in the PRD, or an ADR's decision. If one looks wrong, write a change request from `templates/change-request.md` and stop with `blocked`.
10. **Never start another agent.** Only the project manager does that.
11. Never merge into or push to `main`. Commit on the branch you were given; commit messages name your task or stage ID and the reason.
12. **Rules content:**
    - cite exact sources (CR rule, MTR/IPG section, Oracle text, addendum section), checked against the files in `sources/`, never from memory;
    - `UNRESOLVED` is a valid answer;
    - every rules claim follows **source → proposition → consequence** (AGENTS.md).
13. **Don't gold-plate.** Do exactly the job in your report: no extra features, refactors or documents.

## Engineering-discipline skills

If the plugin is loaded, use the skills your role file lists, when their trigger applies. Don't load others.
