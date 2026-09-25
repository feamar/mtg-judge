# ADR-0015: Voice through an `SttPort`, local transcription first

Status: Proposed, depends on spike S1 · Date: 2026-09-25 · Requirements: FR-VOICE-1, FR-VOICE-2, D22, R4, R5, NFR-PRIV-1, NFR-COST-1, OQ-9

## Context

Voice is in the MVP only if spike S1 succeeds (D22). If it ships, it uses the same pipeline as text (FR-VOICE-2), listens only after an explicit summons, and needs consent before capture (NFR-PRIV-1). The whole budget is about $0.05–0.10 per case, so paid transcription competes directly with model calls.

## Decision (provisional)

- **`SttPort`**: `transcribe(audio: PcmStream, speaker: seat, locale) → Utterance{text, confidence, startedAt}`. The utterance becomes an ordinary `MessageReceived{modality: voice}`, and from there the engine can't tell voice from text.
- **Speaker attribution** comes from Discord's per-user audio streams, not from diarisation (FR-INT-2).
- **Summons and consent:**
    - a slash command starts a *listening window* for one case;
    - each player who speaks must have consented once per event, recorded as a case event;
    - audio from users without consent is dropped without being decoded.
- **Audio is never stored.** Only the transcript is kept, under the normal 7-day rule.
- **Local first:** a Whisper-class model in an `stt` sidecar on the host, at $0 marginal cost. The host has an NVIDIA RTX 2070 SUPER (ADR-0003), so GPU transcription is realistic. With the Windows-service fallback, the sidecar runs as a second local process. **Local only in the MVP (owner, 2026-09-25):**

- The owner has a ChatGPT subscription but no OpenAI API access. A ChatGPT subscription can't be used by a bot for transcription; the API is a separate, pay-per-use product.
- No cloud STT adapter is built.
- `SttPort` keeps a cloud adapter possible later (for example the OpenAI transcription API). It would need:
    - API access set up by the owner;
    - its cost counted in the ledger (ADR-0012);
    - OQ-23 extended to cover that provider.

## Consequences

- If S1 fails, this ADR is marked *Superseded*, and nothing else in the architecture changes: voice is purely an extra adapter.
