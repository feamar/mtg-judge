# ADR-0019: Guided narration intake: "Tell me what happened, step by step"

Status: Accepted 2026-09-28 · Date: 2026-09-27 · Requirements: P3, FR-INT-1, FR-INT-2, FR-RUL-1, FR-RUL-2, FR-RUL-4, FR-RUL-5, FR-INV-3, OQ-33, OQ-34 · Related: ADR-0008, ADR-0018

## Context

Messy input is best handled by *helping players explain*, not by interrogating them. The owner decided on 2026-09-27 (answer to OQ-33 point 3) to replace a "maximum clarification rate" with a **procedure**:

- the judge asks the players to tell what happened, **step by step**;
- by default it addresses **the player who made the call**. If everyone agrees, **the player who matters most** may explain instead, **on their own initiative** (for example "I'll explain the situation");
- it **follows along** until a question is formulated, a question arises, or the players go "silent";
- **"silent" means the story is wrapped up** (owner, 2026-09-27): the narrator signals they've reached the present, for example "…and that's when we called you over" or "…and that's where we are now". It is *not* a pause of a certain length;
- in that case it asks "So, what is your question?", or, **if the tone suggests it**, "So, how can I help you?"

## Decision

**1. A `Narrating` state** comes between ticket detection and matching (ARCHITECTURE.md §5.1).

- **Skip rule:** if the ticket's opening text already contains a question, the case skips narration and goes straight to normalising and matching (ADR-0018). A question counts as present when intent is detected at or above the confidence threshold, and no dispute markers are present (several players named, or past game actions described).
- **Opening:** the P3 greeting template, plus the narration prompt, addressed to the narrator: *"Players! I see there's a question about a missed trigger. P1, could you tell me what happened, step by step?"*

**2. Choosing the narrator:**

- The default is the caller: the ticket reporter.
- **Volunteer:** another player's message that matches the lexicon's volunteer phrases ("I'll explain", "let me explain") triggers an agreement check. The judge asks, in a template: *"P3 offers to explain. Is that okay with everyone? [Yes] [No]"*. With no objection, P3 becomes the narrator; with one, the caller stays narrator.
- The narrator is recorded on the case. Other players' messages during narration are recorded as their own claims, and never merged into the narrator's account (FR-INT-2).

**3. Following along.** Each narrator message goes through the normaliser (ADR-0018) incrementally, producing:

- a **timeline** of reported events (`Claim{kind: event, bySeat, order}`);
- cards, seats, and stated state;
- candidate procedures and entries (ADR-0008), kept live **silently**.

The judge does **not interrupt**. Clarifying questions, including low-confidence slots, are **deferred** until narration ends. The one exception: a card name that can't be resolved at all *and* blocks understanding of the rest gets one short, template-worded check right away.

**4. When narration ends.** Evaluated after every message, deterministic:

| Trigger | Detected by | What the judge does |
| --- | --- | --- |
| **A question is formulated** | Normaliser: a question intent, or a question sentence with a matched intent | Ends narration, reads back the canonical question and timeline (FR-RUL-5), proceeds |
| **A question arises** | Another seat contradicts a timeline event (a `Dispute`), or a procedure's trigger matches (e.g. "forgot the trigger"), or a claim is an assertion that needs checking (e.g. "that's 28 missed triggers") | Ends narration, summarises, and asks the deciding question or confirms the dispute |
| **Story wrapped up** ("silence") | The narrator signals the story has reached the present. Deterministic first: lexicon wrap-up phrases ("that's when we called you (over)", "that's where we are now", "and then we called a judge", "so yeah", "that's it"), or the timeline catching up to the present (a shift to "now" and present tense). Only if markers are absent does `interpret` pick a closed-list label (`still-telling` / `wrapped-up`) | Asks **"So, what is your question?"**, or **"So, how can I help you?"** when the tone calls for it |
| *Safety net* | A long pause (default 3 minutes, configurable) with no wrap-up signal, so the ticket doesn't stall. A pause is **not** a wrap-up: people pause to think mid-story | A gentle template, not the question prompt: *"Take your time. Is there more to the story, or shall we look at your question?"* (accepted by the owner, 2026-09-27, OQ-34) |

**5. Tone** picks between the two silence prompts, and also between stance phrases (P3):

- **deterministic markers first:** a lexicon of frustration, confusion, and upset (for example "no idea", "idk", "this is ridiculous", repeated question marks, all-caps);
- **then `interpret`**, choosing a closed-list label (`neutral | confused | upset`) only when markers are absent but the text is long or emotional;
- `confused` or `upset` gives *"So, how can I help you?"*; `neutral` gives *"So, what is your question?"*. The label is logged, never shown.

**6. Output of the intake:** a `Narration { narrator, timeline[], claimsBySeat, endedBy: "question"|"arises"|"silence"|"skip", tone }`. It feeds the confirmation read-back (FR-RUL-5), the investigation (only facts still missing are asked, FR-INV-3), and the case record.

**7. Voice:** the same procedure applies. Wrap-up phrases are the same, and the volunteer check is answered by voice or in the thread.

**8. Testing:** golden cases can script a narration and the expected intake behaviour (schema: `input.raw[].pauseAfter`, `input.raw[].volunteer`, `expect.intake`):

- the expected narrator;
- how narration ended;
- the expected prompt (`what-is-your-question` | `how-can-i-help` | none);
- that the judge didn't interrupt;
- the resulting timeline events.

The same robustness rule applies (ADR-0018): messy narrations must yield the same timeline and answer.

## Consequences

- Players explain in their own order and words. The judge asks fewer, better-timed questions, and its first substantive message already reflects the whole story.
- The clarification rate stops being a gate metric (owner, OQ-33). The gate keeps **"confidently wrong" = 0** (OQ-33 point 1). Thresholds for canonical accuracy are to be explored together (OQ-33 point 2).
- New configuration: the safety-net pause, default 3 minutes (accepted by the owner, OQ-34). New lexicon entries: volunteer phrases, **wrap-up phrases**, and tone markers. Wrap-up phrases are collected from the league export like other lexicon terms. New templates: the narration prompt, the volunteer check, the two silence prompts.
- **The PRD doesn't describe this intake yet.** OQ-34 asks the PM to add it as a requirement.
