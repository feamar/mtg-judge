# Unhandled issues

Issues found outside the current task. The commit that fixes one deletes its entry.

## Code that no behavior asks for yet
The scaffold (`core`, `adapters`, `app`, `eval`, `pipeline`, `package.json`) predates mlmd's documents.
No behavior in `docs/behaviors.md` asks for it yet. Phase 2 (`architecture.md`, `stack.md`) decides
what of it stays; until then sessions don't build on it. Found 2026-10-14, on the move into mtg-judge.

## Old links inside docs/source
The documents moved to `docs/source/` on 2026-10-14 keep their relative links (to `golden/`,
`sources/`, each other), which now point one level off. They are inputs; fix a link when one is
needed.

## docs/source holds main's versions
The import read `cycle/E3` at `5210244`. `docs/source/` was moved from `main` (`e978605`), whose
documents differ from `cycle/E3`'s in 19 files: ADR-0023's revision, ADR-0024 (proposed), the E3
iteration notes. Those stay on the `cycle/E3` branch.

## README.md describes the pre-mlmd layout

