# ChatGPT requirements package (2026-09-22)

This is the product owner's earlier requirements work with ChatGPT, kept as it was delivered.

**Status: reference input only.** It was merged into `docs/PRD.md` on 2026-09-25 (see PRD D30–D33). Where the two differ, the PRD wins. The main differences:

- Accuracy target: the PRD keeps "100% of easy cases" and does not adopt "≥90%" (D30).
- Investigation: the PRD uses a hybrid approach, with build-time procedures plus hypothesis-driven questioning (D29).
- Scope: WhatsApp, photo and video input, on-device inference, and very large scale are designed for, but not in the MVP (D31).
- Event setup: the TO configures it, and players join through the Discord server or a link (D32).
- Source precedence: still open (PRD OQ-4).

The scenario files from this package have been moved to `golden/scenarios/`, and `priority.md` to `golden/concepts/`.
