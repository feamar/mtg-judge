# Where this golden set comes from

Copied 2026-10-14 from mtg-judge (`cycle/E3`, `5210244`), `golden/`: the cases, schema, scenarios,
concepts and the two Judge Lab import files, unchanged. From this copy on, this is the master; mtg-judge
is not kept in sync. (Frank, 2026-10-14)

Not copied: `golden/tools/` (the importers and `noisify.mjs`). They are code, and re-running an
importer regenerates whole case files and resets their status (footgun 23).

Rule R7 applies: only the owner changes what a golden case expects. Rule R2: no held-out case is ever
stored here.
