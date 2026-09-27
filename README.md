# AI MTG Judge

An AI Magic: The Gathering judge for online cEDH tournaments on Discord. It answers rules questions, rules on disputes and fixes the game state, and applies tournament policy. When it can't rule safely, it hands the case to a human judge.

This is a learning project. The goal is to build a good product entirely with AI, with the AI working through a sequence of roles (product manager, architect, planner, engineer, QA).

## Repository layout

| Path | What it is | Authority |
| --- | --- | --- |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements document | **Master copy.** Wins over everything else in this repo. |
| [`AGENTS.md`](AGENTS.md) | Working rules for every AI role that works in this repo | Binding for AI roles |
| [`golden/`](golden/) | Golden test set: judge-call scenarios and concept models | Defines what a "correct" ruling is (PRD §8) |
| [`sources/`](sources/) | Links to the normative documents (CR, MTR, IPG, addenda), plus local copies where there's no machine-readable source | Published originals win over local copies |
| [`docs/reference/chatgpt-2026-09-22/`](docs/reference/chatgpt-2026-09-22/) | Earlier requirements package written with ChatGPT | Reference input only |

## Status

- PRD v0.2 (2026-09-27): draft, with the owner's answers from the architecture phase (D42–D56). Open questions are listed in PRD §12.
- No code yet. The next step is to define the AI-role process, then hand over to the architect.
