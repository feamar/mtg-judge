# Assumptions

Record what the design stands on that nobody proved, and how it would be found wrong.

Drafted 2026-10-13 by mlmd's foundation pass from mtg-judge (`cycle/E3`, `5210244`; since 2026-10-14 in `docs/source/`). A high-fragility
assumption gets a PoC, or a decision that makes it not matter, before anything is built on it.

| # | Assumption | Falsified if | Detector / verify by | Fragility | Fallback |
| --- | --- | --- | --- | --- | --- |
| A1 | Frank's check of every golden case by hand (all 348, Frank, 2026-10-14) leaves no wrong expectation | A golden case turns out wrong against its sources | A contested ruling or a stale flag sends the case back to Frank | medium (one case's ruling is wrong, the design holds) | Frank corrects the case (rule R7) |
| A2 | Players' text, parsed by a local LLM into a standardized form (Frank, 2026-10-14) and then matched deterministically, is understood with zero confidently wrong results | A real input is matched to another question without asking | Messy-input PoC (source spike S3, not run) on real player text; its source is open since the league export fell away (Q7) | high | Ask the player to rephrase more often |
| A3 | Card features can be derived correctly (parser, AI tagging, owner review) | A card with a wrong feature gets a wrong answer to every question about it | Frank reviews derived features, with as much of his attention as it takes (Frank, 2026-10-14: very important); a PoC before the architecture rests on it | high | Narrow strategies to hand-checked cards |
| A4 | Answering strategies generalise to cards they weren't written from | Held-out cases with other cards fail | Held-out cases chosen by someone else after the code is frozen (source spike S4: 5/5, weak) | high | Library entries per card, more owner review |
| A5 | Disputes reduce to procedures whose decisive facts the judge can establish from players' answers in their own words, asked as open questions, never as buttons or choices (Frank, 2026-10-14) | Free-text answers can't be mapped to the decisive facts reliably, or handoffs exceed about 2% | An investigation PoC on players' own answers; the pilot's handoff rate | high | More handoffs to human judges |
| A6 | ~~A held-out set can be made from the league export~~ Falsified: the export seems not possible (Frank, 2026-10-14). The held-out set comes from new cases written in separate sessions and stored outside the repository (PRD D49) | — | — | — | — |
| A7 | An LLM's answers that differ in wording can be scored deterministically against a golden case | No scorer can tell an equivalent answer from a wrong one | Build the scorer early and test it on known pairs | high | Score only deterministic answers; owner reads AI answers |
| A8 | The MTRA hand transcript (2025-06-24) matches the Notion version | A difference is found on rebuild | Re-check on every rebuild | high | Treat the MTRA as unsupported until re-checked |
| A9 | Every golden case was checked against the CR of 2026-09-25 and Scryfall card text of 2026-09-26/27 | An answer depends on a newer CR or errata | Every rules change and every new card set triggers a rebuild, which flags the stale cases (Frank, 2026-10-14) | high | Revalidate the flagged cases |
| A10 | All cards and all rules, and most policy handling, can be encoded so that at most 1–2% of questions go to the AI model, while the judge stays highly responsive (Frank, 2026-10-14) | More than 2% of questions go to the AI model, or encoding slows replies | The AI share counted per case (daily owner summary); an encoding PoC before the architecture rests on it | high | None in the product: more than 2% means the architecture isn't good enough yet and is reworked (Frank, 2026-10-14) |
| A11 | The Tickets bot in thread mode lets the judge join every ticket with no manual step, and its descriptions can be parsed | A ticket is missed or misread | Tickets PoC (source spike S2, not run): 20 of 20 detected | medium | Channel mode, the owner's call |
| A12 | Players narrate step by step, and wrap-ups can be detected | Narrations stall or wrap-ups are missed | Live intake; wrap-up phrases from real player text (Q7) | medium | The 3-minute safety net |
| A13 | Keeping integrity data out of the AI's input, plus an output check, catches every leak | A leak test fails | Leak tests on every handoff path | medium | Hand off without player messages |
| A14 | The owner's review fits: about 2 hours per module, at about 40 hours a week | Review lags behind the build | Measure review time | medium | Fewer, larger review batches |
| A15 | Discord voice receive works and local transcription gets near 1 second | The voice PoC fails or misses the target | Voice PoC (source spike S1, not run) | low (voice is isolated and can be dropped) | No voice in PI-1 |
| A16 | Scryfall- and WotC-derived text may be used this way | WotC's reply restricts it | WotC's reply (PRD OQ-12) | medium | Short quotes, rule numbers and links only |
| A17 | The owner's always-on desktop is an acceptable host | Outages, or Docker can't be enabled | Uptime; a firmware check | low | A Windows service, or a VPS |
| A19 | Players' own wording carries the subtle hints that show cheating or facts shaded in their favour, and the judge can pick them up | Integrity cases answered in free text go undetected | Integrity golden cases with free-text answers | high | Hand off to human judges whenever the account is thin |
| A20 | A local LLM on the host parses players' text fast enough for replies within single-digit seconds | Parsing alone takes seconds per message on the host | A parsing PoC on the host's hardware | medium | A small hosted model for parsing: it costs money against the cap, but still doesn't count toward the AI share |

Dropped: A18 "one Discord account is one player" (Frank, 2026-10-14: not relevant). A1 to medium, A19,
A20, Q7 and the A9 reading confirmed by Frank, 2026-10-14.
