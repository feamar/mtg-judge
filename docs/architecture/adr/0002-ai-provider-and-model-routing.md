# ADR-0002: Anthropic Claude behind a provider-neutral `LlmPort`, routed by task role

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-TECH-1, D41, NFR-COST-1, NFR-COST-2, NFR-LAT-1, P2, NFR-PRIV-1

## Context

At run time the AI only understands what players say, picks the matching procedure or rules, and words questions and explanations (P2). The budget is about $0.05–0.10 per case for everything (NFR-COST-1). The provider must be replaceable without changing ruling logic (D41).

## Options considered

- **Anthropic Claude (chosen).** Structured outputs and strict tool schemas, prompt caching, and a range of price points in one family (Haiku 4.5 at $1/$5 per million input/output tokens, Sonnet 5 at $2/$10, Opus 5 at $5/$25). Good at the long, careful reading of rules text that a ruling needs.
- **Another hosted provider.** Viable; the port keeps this open. There's no reason to prefer one now that outweighs the value of one well-understood provider during the pilot.
- **Self-hosted open-weight model on the owner's machine.** $0 marginal cost, but accuracy on multi-step CR reasoning is the main risk to NFR-ACC-1, and the owner's machine may not have the GPU for it. It stays possible later through the port (D31, on-device inference).

## Decision

1. **`LlmPort`** in `core` takes a *task role*, a prompt assembled from locale catalogs (ADR-0014), and a JSON schema for the structured output. It returns validated structured output plus token usage. Ruling logic never sees a provider type, a model name, or a provider-specific parameter.
2. **Task roles** are mapped to models in configuration, not in code:

| Task role | Used for | Default model | Why |
| --- | --- | --- | --- |
| `understand` | Turning player messages into claims, card mentions, candidate case type; wording the greeting | `claude-haiku-4-5` | High volume, short outputs |
| `investigate` | Choosing the next question from the candidates the engine computed, and wording it | `claude-haiku-4-5` | The engine has already narrowed the choice (ADR-0008) |
| `reason` | Building the source → proposition → consequence chain for a rules answer or a ruling | `claude-sonnet-5`, adaptive thinking, effort tuned by spike S3 | The accuracy-critical step |
| `phrase` | Turning a verified ruling into the player-facing reply in the chosen delivery pattern | `claude-haiku-4-5` | Input already fixed and verified |
| *(build and test)* | Pipeline drafting (procedures, concept tags, mnemonics) and golden-case writing and replays | Not through `LlmPort` at run time; Claude Code on the owner's Pro subscription | ADR-0016: no paid API spend for build and test |

3. **Prompt caching:** each role has a stable prefix (instructions, output schema, glossary, framework summary) above one cache breakpoint. Volatile case data goes after it. The Haiku prefixes are kept above Haiku's 4,096-token minimum cacheable prefix, or caching is switched off for that role.
4. **No provider-specific features in the ruling path** beyond what the port abstracts: structured output, caching hints, and an effort level. Adapter conformance tests run the same fixtures against any adapter.
5. **Identity minimisation:** prompts never contain Discord user IDs or usernames. Players are labelled by seat (`P1`…`Pn`) and role. The adapter maps them back (NFR-PRIV-1, NFR-IMP-1).

## Consequences

- The model mix is the biggest cost lever. It is set in config and measured by spike S3 against the budget; the cost model is in ARCHITECTURE.md §9.
- Replacing the provider means writing one adapter, passing the conformance tests, and re-running the golden set (the release gate, FR-BUILD-3).
- Player messages, pseudonymised with seat labels, are sent to a third-party processor whose own retention may exceed D39's 7 days and which may process them outside the EU. **The owner accepted this on 2026-09-25 (answer to OQ-23).** A short privacy notice for players is recommended (ARCHITECTURE.md §10).
- Only the live bot uses the paid API. Build and test run on the owner's Pro subscription (ADR-0016).

## Revisit when

Spike S3 shows that the default mix can't meet NFR-COST-1 or NFR-LAT-1; the golden set shows the `reason` role needs a stronger model.
