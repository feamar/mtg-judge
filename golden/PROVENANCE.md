# Where this golden set comes from

The golden set as it stood in mtg-judge (`cycle/E3`, `5210244`) when mtg-judge became an mlmd project,
2026-10-13/14. It is the master copy and the product's definition of a correct ruling (Frank,
2026-10-14).

`golden/tools/` holds the importers. Re-running one regenerates whole case files and resets their
status (footgun 23).

Rule R7 applies: only the owner changes what a golden case expects. Rule R2: no held-out case is ever
stored here.
