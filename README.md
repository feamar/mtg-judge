# AI MTG Judge

An AI Magic: The Gathering judge for online cEDH tournaments on Discord. It answers rules questions, rules on disputes and fixes the game state, and applies tournament policy. When it can't rule safely, it hands the case to a human judge.

This is a learning project. The goal is to build a good product entirely with AI, with the AI working through a sequence of roles (product manager, architect, planner, engineer, QA).

## Repository layout

| Path | What it is | Authority |
| --- | --- | --- |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements document | **Master copy.** Wins over everything else in this repo. |
| [`AGENTS.md`](AGENTS.md) | Working rules for every AI role that works in this repo | Binding for AI roles |
| [`docs/architecture/`](docs/architecture/) | Architecture: design, ADRs, end-to-end sequence, spike plan, traceability | Must satisfy the PRD; decisions are in the ADRs |
| [`golden/`](golden/) | Golden test set: structured cases (`cases/`, YAML), their narratives (`scenarios/`), and concept models | Defines what a "correct" ruling is (PRD §8) |
| [`spikes/`](spikes/) | Throwaway spike code (never product code) | None; see the spike reports in `docs/architecture/spikes/` |
| [`docs/research/`](docs/research/) | Research notes, such as public rules questions awaiting the owner's verification | Input only |
| [`sources/`](sources/) | Links to the normative documents (CR, MTR, IPG, addenda), plus local copies where there's no machine-readable source | Published originals win over local copies |
| [`docs/reference/chatgpt-2026-09-22/`](docs/reference/chatgpt-2026-09-22/) | Earlier requirements package written with ChatGPT | Reference input only |

## Status

- PRD v0.2 (2026-09-27): draft, with the owner's answers from the architecture phase (D42–D56). Open questions are listed in PRD §12.
- Architecture v1: in progress on branch `arch/v1` ([`docs/architecture/`](docs/architecture/ARCHITECTURE.md)). The phase stays open until the exit criterion in `docs/architecture/OWNER-ANSWERS.md` is met. Its open questions OQ-22 to OQ-36 are answered in PRD v0.2, except the parts still open.
- No product code yet. Next: the owner approves the architecture and the spike plan; then the spikes run and the planner starts.
