# Card <task ID>: <title>

<!-- card-lint: at most 80 lines; read list at most 8 ranges; every test maps to a requirement ID or golden case; estimated change at most 400 non-test lines -->

Cycle: <id> · Role: implementer | knowledge-author | case-author | deployment-manager · Spike: none | <id> · Deps: <task IDs> · Size: S/M/L · Est. non-test lines: <n>

## Goal

<2 lines.>

## Requirements

<Requirement IDs, each with its exact text as sliced. Quote it; don't paraphrase.>

## Golden cases

<Case IDs only, with the integrity setting where it matters.>

## Interfaces

```ts
// The signatures the tests are written against. Stubs throw NotImplemented.
```

## Tests to write

| Test name | When …, the bot / module must … | Covers |
| --- | --- | --- |
| | | FR-…, golden:… |

## Characterise first

<None, or the existing functions whose current behaviour must be pinned before the change (PDD PIN).>

## Allowed paths

<Globs for tests and globs for implementation, listed separately.>

## Read list

<At most 8 `file:line-line` ranges or slice refs.>

## Out of scope

<What not to do.>

## Hints

<Project manager only, after an escalation. At most 20 lines.>

## Attempts

<Appended by the project manager: n · gate · one-line reason.>
