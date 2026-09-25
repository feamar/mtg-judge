# Technical spike plan

Status: Proposed. **Planned, not run.** Spike code comes after the product owner approves this plan (handover, out-of-scope list). · Date: 2026-09-25

Each spike is throwaway code in `spikes/<id>/`. It is never merged into the product packages. Each spike ends with a one-page report in `docs/architecture/spikes/<id>-report.md`, containing the measured results, pass or fail against the criteria below, and the ADRs to confirm or supersede.

Running order: **S2 → S3 → S1.** S2 unblocks the MVP's only input path. S3 measures how much the deterministic judge covers on real text, and what the AI edge costs. S1 is optional scope (D22).

---

## S1: Voice in Discord

**Requirements:** FR-VOICE-1, FR-VOICE-2, D22, R4, R5, NFR-PRIV-1, NFR-LAT-1, OQ-9 · **ADRs at stake:** 0015, 0001

**Question:** can the bot, on the owner's host, reliably receive per-speaker audio in a Discord voice channel, transcribe it well enough for a judge call, at an acceptable latency and at no meaningful cost, while meeting the consent rules?

**Method:**

1. A minimal discord.js bot joins a voice channel on a test server when a slash command summons it (a listening window only).
2. Receive per-user Opus streams through `@discordjs/voice`. Confirm that it works with Discord's current voice encryption (DAVE end-to-end encryption), with the current library versions.
3. Decode to PCM, cut utterances at silence, and send them to a local Whisper-class model running as a sidecar on the owner's host, on the GPU. There is no cloud comparison: the owner has no speech-to-text API access, and the MVP is local-only (ADR-0015).
4. **Test set:** 20 scripted judge-call utterances with 3–4 speakers, including card names (for example *Smothering Tithe*, *Orcish Bowmasters*, *Kinnan, Bonder Prodigy*) and rules terms, spoken by at least two people, with some crosstalk.
5. Measure:
    - per-speaker attribution accuracy;
    - word error rate, and **card-name accuracy after the card resolver** (ADR-0005);
    - time from end of utterance to transcript;
    - CPU/GPU load on the host, including while the owner uses the desktop for other things (for example gaming).
6. Check the consent flow: audio from a user without consent is dropped before decoding.

**Pass criteria (all must hold):**

- Audio is received and correctly attributed for ≥ 95% of utterances.
- ≥ 95% of card names are resolved correctly after the resolver. Rules terms are transcribed well enough that matching (with `interpret` where needed) finds the same entry or procedure as for the typed text in ≥ 90% of utterances.
- The median time from end of utterance to transcript is ≤ 3 s on local STT.
- No audio is persisted, and there is a working consent gate.

**Fail:** receiving voice is unsupported or broken under the current encryption, or any criterion misses by a wide margin. Then voice is dropped from the MVP (D22), and ADR-0015 is superseded.

**Time box:** 3 working days.

---

## S2: Ticket bot integration

**Requirements:** FR-INT-1, D37, OQ-21, OQ-22, R13, NFR-AVAIL-1 · **ADRs at stake:** 0010, 0011

**Question:** can the judge detect every ticket the owner's existing ticket bot opens, parse the description and participants, join or post in it, and pick up tickets opened while the judge was offline?

**Known:** the owner's server uses **Tickets** (https://tickets.bot, shown as "Ticket Bot") in **thread mode**: a thread per ticket (OQ-21, OQ-22). Its documentation (docs.tickets.bot, thread-mode page, read on 2026-09-25) says:

- each ticket is a **private thread under the panel channel**, the channel with the "open ticket" button;
- at first only the opener is in the thread. Staff join through a button in a mandatory **notification channel**, or are added automatically when they are on the panel's **Support Teams and "Mention On Open"** lists (or marked on-call);
- an optional **form** collects the player's description before the thread is created;
- closed ticket threads **can be reopened**, and **auto-close** on inactivity is optional.

The spike must confirm this on the owner's actual configuration, and record the bot's Discord user ID.

**Prerequisite from the product owner:** a test server (or a test channel), with "Ticket Bot" installed and configured the same way as on the live server.

**Method:**

1. Install the ticket bot and the spike bot on the test server with the permissions in ADR-0010.
2. Compare two ways for the judge to get into ticket threads, and pick the one that works with no manual step per ticket:
    - **(A) Mention On Open:** give the judge bot a role, and add that role to the panel's Support Teams and Mention On Open lists, so Tickets adds it to every new thread;
    - **(B) Manage Threads:** give the judge bot *Manage Threads* on the panel channel, so it sees private threads being created and can join them.

   Also check whether the notification-channel embed is a useful second detection signal, for example during catch-up.
3. Record the raw gateway events for 10 tickets opened the way players do it today:
    - the parent channel, and the thread naming pattern;
    - when the first message arrives and what it contains: the welcome embed, and the form answers if a form is used;
    - who is added, and when;
    - what closing and **reopening** look like (archive, lock);
    - what auto-close does, if the server uses it.
4. Implement the `discord-private-thread` `TicketSource` against the recordings. Replay the recordings as fixtures. A reopened ticket within 7 days resumes its existing case; after that it starts a new case.
5. Live check: open 10 more tickets and confirm each is detected, parsed, and answered with a test greeting.
6. Outage check: stop the bot, open 3 tickets and close 1, restart. Confirm that the 2 still open are picked up with a "sorry for the wait" greeting and that the closed one is ignored.
7. Private visibility: confirm that the bot can read and post in every ticket without extra manual steps per ticket.

**Pass criteria:**

- 20/20 tickets detected. Description and reporter parsed correctly in 20/20. Median time from ticket creation to greeting ≤ 5 s.
- The outage test passes exactly: 2 picked up, 1 ignored, no duplicate greetings after a second restart.
- No manual step per ticket. Any setup needed per server is documented in a checklist of no more than 10 items.

**Fail:** neither (A) nor (B) lets the judge see and post in ticket threads without a manual step per ticket, or the descriptions can't be parsed reliably. The report then proposes options for the owner (for example another Tickets setting, or switching Tickets to channel mode). Replacing D37 is the owner's decision.

**Time box:** 2 working days, after the prerequisites are met.

---

## S3: Coverage and cost per case

**Requirements:** NFR-COST-1, NFR-ACC-1, NFR-LAT-1, P2, FR-Q-1, FR-Q-2, FR-INV-2 · **ADRs at stake:** 0002, 0005, 0008, 0012 · Tests ARCHITECTURE.md §9

**Question:** on realistic player text, how much can the deterministic judge handle on its own (matching, library answers, button-driven investigation)? And what does the rest (`interpret`, the `reason` fallback) cost per case?

**Constraint (owner, 2026-09-25):** no paid API spend for build or test (ADR-0016). AI calls in the spike run through the owner's Pro plan, and their API cost is **computed** from token counts, not paid.

**Prerequisite from the product owner:** about 30 real judge-call texts from past events, as players actually wrote them, drawn from the **non-held-out**, pseudonymised part of the league history export (ADR-0017 §4). About three quarters should be rules questions and a quarter disputes, matching OQ-25. None of these may be golden cases already.

**Method:**

1. **Minimal vertical slice** (throwaway):
    - card resolver over Scryfall `oracle_cards`;
    - a starter lexicon;
    - library entries authored from the validated golden scenarios;
    - one Missed Trigger procedure (MTRA) with approved question wording;
    - the decision-graph engine and guard;
    - the verifier;
    - a CLI front end whose buttons are numbered choices.
2. **Deterministic run:** push the 30 texts through matching. Record for each: matched without AI / needed a choice question / needed `interpret` / library miss.
3. **AI edge run:** for the texts that need it, run `interpret` and the `reason` fallback through the Pro plan. Record the exact inputs and outputs.
4. **Cost:**
    - count the tokens of the recorded calls, with Anthropic's token-counting endpoint if it's free, or at about 4 characters per token (±20%) otherwise;
    - add +100% on `reason` output for thinking;
    - apply API prices, and project to 200 and 430 cases a month.
5. **Correctness:** the owner marks each outcome right or wrong, whether library answer, fallback answer, or ruling.
6. **Investigation feel:** the owner plays the One Ring dispute through the buttons and notes any question that felt unnatural or unnecessary.

**Pass criteria:**

- Every match the deterministic matcher makes without AI is correct: no confidently wrong matches.
- 100% of library answers and procedure rulings are judged correct by the owner. Fallback answers are either correct, or verified-then-escalated (none wrong and shown as correct).
- The projected AI cost at 430 cases a month is ≤ $20, including margins.
- Indicative reply latency: deterministic replies ≤ 2 s; fallback replies ≤ 9 s (NFR-LAT-1), confirmed later on the live bot.

**The report states:** the deterministic hit rate on real text, the top missing lexicon terms and library entries (the first authoring backlog), and whether the button-driven investigation is acceptable to the owner.

**Fail:** confidently wrong matches, or fallback answers wrong but shown as correct. The report then proposes stricter matching thresholds, or escalating instead of falling back. Choosing is the owner's decision.

**Time box:** 4 working days. **Paid spend: $0.**
