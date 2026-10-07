# mlmd trial: saved state

What the first mlmd UX test (2026-10-05 to 2026-10-07) produced for this project, so a next test
can resume instead of redoing it. Import source: tag `mlmd-trial-source`.

- `vision.md`, `glossary.md`, `rules.md`, `footguns.md`, `assumptions.md`, `open-questions.md`:
  the documents mlmd wrote in 1a, as they were.
- `review-vision.md`: the 1a design-review, 5 findings, all settled.
- `prd/mvp-1.md`: 1b for MVP 1, gap interview done (4 of 4), mlmd's 2 decisions confirmed.
- `decisions.md`: all 24 of Frank's decisions in one list.

## Where the test stopped
- **1b, MVP 1, writing behaviors:** gap question 1 of 1 was asked and not answered: how a player
  reaches the judge without a ticket thread (`/judge ask` recommended; mention; both; DM).
- **Known defects to fix before 1b goes on:** the standing documents never had their topic.
  glossary.md holds 4 changed terms, not the 26 PRD terms it claims; rules.md lacks Says/From/Tier,
  and its R1 ("the PRD is the master copy") contradicts "mlmd's documents are the only master";
  footguns.md lacks Anchor and Verified; there is no CLAUDE.md.
- **Next:** the 1a standing-documents topic, then 1b's behaviors, feature files and design-review.

## Resuming
Copy this folder's files back into the test's `docs/` (and `docs/prd/`), tell mlmd the project was
imported, and start at "Next" above.
