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
- **Local first:** a Whisper-class model in an `stt` sidecar on the host, at $0 marginal cost. The host has an NVIDIA RTX 2070 SUPER (ADR-0003), so GPU transcription is realistic. With the Windows-service fallback, the sidecar runs as a second local process. A cloud STT adapter exists as the fallback if S1 shows local transcription is too slow or inaccurate on the owner's hardware. Its cost then goes through the ledger (ADR-0012).

## Consequences

- If S1 fails, this ADR is marked *Superseded*, and nothing else in the architecture changes: voice is purely an extra adapter.
