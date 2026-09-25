# AI MTG Judge

An AI Magic: The Gathering judge for online cEDH tournaments on Discord. It answers rules questions, rules on disputes and fixes the game state, and applies tournament policy. When it can't rule safely, it hands the case to a human judge.

This is a learning project. The goal is to build a good product entirely with AI, with the AI working through a sequence of roles (product manager, architect, planner, engineer, QA).

## Repository layout

| Path | What it is | Authority |
| --- | --- | --- |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements document | **Master copy.** Wins over everything else in this repo. |
| [`AGENTS.md`](AGENTS.md) | Working rules for every AI role that works in this repo | Binding for AI roles |
| [`docs/architecture/`](docs/architecture/) | Architecture: design, ADRs, end-to-end sequence, spike plan, traceability | Must satisfy the PRD; decisions are in the ADRs |
| [`golden/`](golden/) | Golden test set: judge-call scenarios and concept models | Defines what a "correct" ruling is (PRD §8) |
| [`sources/`](sources/) | Links to the normative documents (CR, MTR, IPG, addenda), plus local copies where there's no machine-readable source | Published originals win over local copies |
| [`docs/reference/chatgpt-2026-09-22/`](docs/reference/chatgpt-2026-09-22/) | Earlier requirements package written with ChatGPT | Reference input only |

## Status

- PRD v0.1: draft. Open questions are listed in PRD §12.
- Architecture v1: proposed in [`docs/architecture/`](docs/architecture/ARCHITECTURE.md) (branch `arch/v1`), awaiting the product owner's review. It adds OQ-22 to OQ-29.
- No product code yet. Next: the owner approves the architecture and the spike plan; then the spikes run and the planner starts.
