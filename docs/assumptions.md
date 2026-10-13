# Assumptions

Record what the design stands on that nobody proved, and how it would be found wrong.

Drafted 2026-10-13 by mlmd's foundation pass from mtg-judge (`cycle/E3`, `5210244`). A high-fragility
assumption gets a PoC, or a decision that makes it not matter, before anything is built on it.

| # | Assumption | Falsified if | Detector / verify by | Fragility | Fallback |
| --- | --- | --- | --- | --- | --- |
| A1 | The golden set is correct: the owner's bulk validation of 307 imported and 19 drafted cases holds | A golden case turns out wrong when checked against its sources | Source-check each case before it gates a release; count cases found wrong | high | Gate only on cases checked one by one |
| A2 | A deterministic matcher understands real player text with zero confidently wrong results | A real or held-out input is matched to a different question without asking | Messy-input PoC (source spike S3, not run) on real league texts | high | Ask the player to rephrase more often |
| A3 | Card features can be derived correctly (parser, AI tagging, owner review) | A card with a wrong feature gets a wrong answer to every question about it | Owner review; feature-level tests | high | Narrow strategies to hand-checked cards |
| A4 | Answering strategies generalise to cards they weren't written from | Held-out cases with other cards fail | Held-out cases chosen by someone else after the code is frozen (source spike S4: 5/5, weak) | high | Library entries per card, more owner review |
| A5 | Disputes reduce to procedures whose decisive facts can be asked with buttons, and players answer consistently | Players can't or won't answer that way; handoffs exceed about 2% | Investigation PoC (source spike S3, not run); handoff rate in the pilot | high | More handoffs to human judges |
| A6 | A held-out set can be made, from the league export | The export doesn't arrive (the source says it "may not happen") | Ask the TO; track it as an open question | high | Owner-written held-out cases in separate sessions |
| A7 | An LLM's answers that differ in wording can be scored deterministically against a golden case | No scorer can tell an equivalent answer from a wrong one | Build the scorer early and test it on known pairs | high | Score only deterministic answers; owner reads AI answers |
| A8 | The MTRA hand transcript (2025-06-24) matches the Notion version | A difference is found on rebuild | Re-check on every rebuild | high | Treat the MTRA as unsupported until re-checked |
| A9 | The CR of 2026-09-25 and the Scryfall card text of 2026-09-26/27 are what every golden case was checked against | A case's answer depends on a newer CR or errata | Staleness flags on source change | high | Revalidate the flagged cases |
| A10 | The library hit rate rises quickly, keeping cost per case low | The hit rate stays low | Daily owner summary; spend ledger | medium (cost stays under the cap even at a 20% hit rate) | Questions-only mode at the cap |
| A11 | The Tickets bot in thread mode lets the judge join every ticket with no manual step, and its descriptions can be parsed | A ticket is missed or misread | Tickets PoC (source spike S2, not run): 20 of 20 detected | medium | Channel mode, the owner's call |
| A12 | Players narrate step by step, and wrap-ups can be detected | Narrations stall or wrap-ups are missed | Live intake; wrap-up phrases from the league export | medium | The 3-minute safety net |
| A13 | Keeping integrity data out of the AI's input, plus an output check, catches every leak | A leak test fails | Leak tests on every handoff path | medium | Hand off without player messages |
| A14 | The owner's review fits: about 2 hours per module, at about 40 hours a week | Review lags behind the build | Measure review time | medium | Fewer, larger review batches |
| A15 | Discord voice receive works and local transcription gets near 1 second | The voice PoC fails or misses the target | Voice PoC (source spike S1, not run) | low (voice is isolated and can be dropped) | No voice in PI-1 |
| A16 | Scryfall- and WotC-derived text may be used this way | WotC's reply restricts it | WotC's reply (PRD OQ-12) | medium | Short quotes, rule numbers and links only |
| A17 | The owner's always-on desktop is an acceptable host | Outages, or Docker can't be enabled | Uptime; a firmware check | low | A Windows service, or a VPS |
| A18 | One Discord account is one player | Several players share a device (voice, phone app) | Seat mapping per voice | medium, for voice and the phone app | Seat by voice, later |
