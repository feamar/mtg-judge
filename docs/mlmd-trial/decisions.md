# AI MTG Judge: Frank's decisions from UX test 1 (answer key)

Every product decision Frank made for this app during the first mlmd UX test (2026-10-05 to
2026-10-07), on top of `docs/PRD.md` v0.5. They are not yet merged into the PRD. For a next mlmd
trial: import from the tag `mlmd-trial-source` (the repository before this file), and when mlmd
asks one of these, answer from here, so the trial tests mlmd and not the product.

## Vision (1a, session 1)
1. 1v1 constructed formats: none yet.
2. Regular REL (JAR) and casual play: none yet.
3. Phone app: none yet. It may run on-device or hybrid.
4. Penalty history across an event: none yet.
5. Languages other than English: none yet.
6. Photo, then webcam input: none yet.
7. Limited formats: none yet.
8. "Uncertain" in D3 means an *unresolved* result, never a confidence score. Handoffs happen on concrete triggers (D62) or an *unresolved* result.
9. The judge never invents a ruling, in any context, with or without a human judge available (FR-RUL-9). At home it returns *unresolved* with why. D35 is superseded.
10. Not kept possible: scaling to millions of users (narrows D31).
11. OQ-38 remainder closed: the 4 Regular REL integrity cases (`expansion-pol-042`, `044`, `045`, `046`) don't gate MVP 1.

## Vision design-review (1a, session 2)
12. Event policies (FR-CTX-5), small in-person events, and more channels (WhatsApp, web): all none yet. (V1)
13. *Unresolved* means "not ruled". Escalation is a separate step, taken only where a human judge is available. (V2)
14. One term: "phone app" (not "mobile app"). "Admin" is the product role; "product owner" is the person; "owner" alone isn't used. (V3)
15. Two assumptions recorded: the approved library answers most rules questions, so marked AI answers stay rare; the Notion MTRA can be imported and diffed for each update. (V4)
16. Keep possible for penalty history: a stable per-event player identity, kept apart from the pseudonymised text, with retention set per event rather than fixed at 7 days. (V5)

## MVP 1 (1b, sessions 2–3)
17. MVP 1 keeps the PRD's full scope: "the Minimum Viable Product is a full product." The work is split into build batches and small sessions, not into smaller MVPs.
18. Verdict: MVP 1 is a no if any ruling in the pilot is incorrect.
19. An *unresolved* result or a handoff isn't an incorrect ruling. (mlmd's, confirmed 2026-10-06)
20. On a server with no event context, an answer the bot can't settle isn't escalated: the bot says so, explains why, suggests a human judge, and logs a library miss.
21. *Unresolved* arises only for infractions and for fixing an illegal game state; the rules always settle a pure rules question. Play at home is JAR only; everywhere else a judge is available.
22. Library miss that the verifier can't confirm: not *unresolved*. The bot says it can't give a verified answer yet, hands off to the judge-only channel in a tournament or suggests a human judge elsewhere, and logs a library miss. It doesn't count as an incorrect ruling. Replaces FR-Q-6's "unresolved and escalated".
23. FR-CTX-2's 1v1 fallback is left out of MVP 1. (mlmd's, confirmed 2026-10-06)
24. FR-CTX-5 (event policies) is left out of MVP 1.

## Open when the test stopped
- How a player reaches the judge without a ticket thread (a server with no event context, or a join code from elsewhere). Options offered: `/judge ask` slash command (recommended), mention, both, DM. Not answered.
- OQ-12, OQ-39, OQ-40, OQ-41 (see PRD §12).
