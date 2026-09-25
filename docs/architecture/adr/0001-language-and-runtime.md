# ADR-0001: TypeScript on Node.js LTS, in one monorepo

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-TECH-1, D41, D31, NFR-EXT-1, FR-VOICE-1

## Context

NFR-TECH-1 asks for a modern, mainstream language with good Discord library support. D31 asks us not to rule out a phone app, web front ends, or on-device use of the rules data. The build pipeline, the runtime, and the evaluation harness all share the same data model (sources, procedures, penalty tables, golden cases), so one language for all three avoids keeping two copies of every schema in step.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| **TypeScript / Node.js** | discord.js is the most widely used Discord library and its voice package (`@discordjs/voice`) exposes a voice *receive* API, which is what spike S1 needs. Official Anthropic TypeScript SDK. Schemas (for example zod) can be shared by pipeline, runtime, and eval. The same core package can later run in React Native or a browser, which keeps on-device use (D31) open. | Weaker than Python for local ML (speech-to-text, embeddings). That work can run as a sidecar process if it's ever needed. |
| Python | The strongest ML and NLP ecosystem; the ChatGPT package proposed Python/FastAPI. Official Anthropic SDK. | In discord.py, voice receive comes from third-party extensions. The core can't be reused in a phone app without a rewrite. |
| Go / C# / Java | Strong typing, good performance | Smaller Discord bot ecosystems; less reuse for mobile or web. |

## Decision

- **TypeScript** in strict mode, on the **current Node.js LTS** line.
- **One monorepo** with workspaces. The package boundaries enforce the architecture (see ARCHITECTURE.md §2):
    - `core` has no I/O. It holds the domain, the engine, and the knowledge-query logic, and depends only on ports (interfaces).
    - `adapters/*` hold Discord, Anthropic, SQLite, and speech-to-text.
    - `pipeline` holds the build pipeline CLI.
    - `eval` holds the golden harness.
    - `app` is the composition root.
- `core` MUST NOT import Node-only modules. That keeps it portable to a phone or browser runtime.

## Consequences

- Engineers work in one language. The shared schemas are the single source for the knowledge bundle and the golden-case format.
- If voice needs a local speech-to-text model, it runs as a sidecar (for example a whisper.cpp binary or a small Python service) behind `SttPort` (ADR-0015).
- The specific libraries (ORM or plain SQL, test runner, schema library) are left to the planner and engineer, within this ADR.

## Revisit when

Spike S1 shows that voice receive only works reliably in another language's library, and the product owner wants voice in the MVP.
