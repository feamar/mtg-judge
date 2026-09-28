# ADR-0018: Input normalisation into a canonical question, and robustness testing

Status: Proposed · Date: 2026-09-26 · Requirements: P2, FR-Q-2, FR-RUL-4, FR-RUL-5, FR-VOICE-2, NFR-IMP-1, NFR-ACC-1, OQ-33

## Context

Players write, and speech-to-text transcribes, "blurred" questions: typos, slang, nicknames ("Tithe", "Thoracle"), speech errors ("canon" for Kinnan), missing punctuation, filler, and vague references ("the guy to my left").

The owner's requirement (2026-09-26): **pretty bad text should lead to as good and clean an answer as possible**, and this stage must be tested seriously, now and later.

Rewriting messy input into tidy prose (for example with AI) is the wrong target. It can silently change meaning: "not tapped" vs "not untapped" in the forgotten-untap scenario.

## Decision

**1. A normaliser stage before the matcher, producing a structured `CanonicalQuestion`, not prose:**

```
CanonicalQuestion {
  raw, modality: "text"|"voice",                   // kept verbatim (FR-RUL-4 record)
  cards:   [{ oracleId, from, via: "exact"|"fuzzy"|"phonetic"|"nickname"|"stt-confusion"|"interpret", conf }],
  seats:   { asker, mentioned: [{ from: "my opponent", seat? }] },
  intent:  { id, conf },                            // question type, e.g. how-much-mana, can-X-target-Y
  stated:  Fact[] (reported), claims: Claim[] (assertions, never facts),
  unresolved: SlotRef[],                            // below threshold, so it becomes a choice question
  confirmed: bool }                                 // set by the read-back (FR-RUL-5)
```

**2. Five steps; AI only in step 4:**

1. **Normalise the text:** Unicode, punctuation, casing, number words, filler removal, and shorthand from the lexicon ("ETB", "sac", "MV"). For voice, also a table of known speech-to-text confusions.
2. **Extract slots:**
    - cards: the card resolver with exact, fuzzy **and phonetic** matching (phonetic matching catches speech errors that spelling-based matching misses);
    - seats: "I", "my opponent", "P2", relative positions;
    - claims vs stated facts;
    - intent: lexicon patterns.
3. **Score:** every slot has a confidence. Below the threshold it is never guessed; it becomes a **choice question** ("Did you mean [Smothering Tithe] [Tithe Taker]?").
4. **Fill gaps:** `interpret`, a simple and fast model, maps the leftovers onto the **closed lists** (ADR-0002). It fills slots and never writes prose. **If it can't decipher the input quickly and confidently, the judge asks the player to rephrase** (template: *"Sorry, I didn't quite get that. Could you rephrase it?"*). There is no accuracy threshold (owner, 2026-09-28, OQ-33).
5. **Read back:** the canonical question is shown as an approved template with [Yes] / [No, I meant…] buttons before anything that depends on it (FR-RUL-5). Voice has no buttons, so the read-back is answered by a typed or spoken yes/no.

**3. Speech input** (if S1 passes, ADR-0015):

- the transcriber gets a vocabulary prompt with the table's commanders and the staples list;
- per-word confidence is kept where the engine provides it, and low-confidence words go straight to step 3;
- S1's recordings produce the first speech-confusion table.

**4. The lexicon, nicknames, and confusion tables are data.** They are authored at build time, grow from the league export (ADR-0017 §4) and the live miss log, and are reviewed like other knowledge (OQ-27).

**5. Robustness testing: a test layer of its own.**

**The invariant.** For each golden case, every variant of the input must:

- produce the **same canonical question** as the clean input, or ask a clarifying choice question; and
- after the scripted confirmation, produce **byte-identical answer text**.

Library answers are approved templates, so this is a strict equality test, with no AI and no fuzzy grading. This is NFR-IMP-1 ("however they are worded") made testable.

**Three variant sources:**

| Source | How | Stored |
| --- | --- | --- |
| **Generated** | `golden/tools/noisify.mjs`: deterministic, seeded transforms at severity levels 1–3: lowercase, punctuation loss, card-name typos (drop, swap, double letter), nickname substitution, speech confusions, filler, abbreviations, run-on joining | Not stored; regenerated from the seed at test time |
| **Human** | Real phrasings: league export (pseudonymised), live miss logs, the owner | `input.variants[]` in the case, `kind: human` |
| **Speech** | Transcripts of spoken versions of golden cases (spike S1, later the phone app) | `input.variants[]`, `kind: stt` |

**Metrics**, reported per severity and per source:

- **canonical accuracy:** the canonical question matches the clean one;
- **answer identity:** byte-identical answer text;
- **clarification rate:** the judge asked instead of guessing;
- **confidently wrong:** a different canonical question accepted without clarification. **The target is 0.** Asking is acceptable; guessing wrong is not.

**Release gate:** confidently wrong = 0 on the whole robustness suite (owner, OQ-33 point 1). No accuracy threshold: if a simple model can decipher the input fast, that's fine; otherwise the judge asks the player to rephrase (owner, OQ-33, 2026-09-28). Clarification rate is **not** a gate: the owner chose a guided narration procedure instead (ADR-0019).

## Consequences

- Messy input costs a question, not a wrong answer. The read-back turns remaining uncertainty into one tap.
- Robustness is measured on every commit for free (steps 1–3 and 5 involve no AI), and improves as the lexicon grows.
- Generated noise only covers errors we can imagine. Real human and speech variants are what really measure the stage, so they get priority when the league export arrives.
