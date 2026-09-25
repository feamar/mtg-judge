# Technical spike plan

Status: Proposed. **Planned, not run.** Spike code comes after the product owner approves this plan (handover, out-of-scope list). · Date: 2026-09-25

Each spike is throwaway code in `spikes/<id>/`. It is never merged into the product packages. Each spike ends with a one-page report in `docs/architecture/spikes/<id>-report.md`, containing the measured results, pass or fail against the criteria below, and the ADRs to confirm or supersede.

Running order: **S2 → S3 → S1.** S2 unblocks the MVP's only input path. S3 decides whether the cost model holds. S1 is optional scope (D22).

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
- ≥ 95% of card names are resolved correctly after the resolver. Rules terms are transcribed well enough that `understand` extracts the same claims as from the typed text in ≥ 90% of utterances.
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

## S3: Cost per case

**Requirements:** NFR-COST-1, NFR-COST-2, NFR-LAT-1, NFR-ACC-1, P2, OQ-25 · **ADRs at stake:** 0002, 0005, 0008, 0012 · Tests the cost model in ARCHITECTURE.md §9

**Question:** does one realistic cEDH case, run end to end on the proposed architecture, cost within $0.05–0.10, including everything, and answer within single-digit seconds per reply?

**Constraint (owner, 2026-09-25):** no paid API spend for building or testing (ADR-0016). The spike therefore runs the model calls through the owner's Pro subscription, and **computes** the API cost from token counts instead of paying it.

**Method:**

1. **Minimal vertical slice** (throwaway):
    - a bundle containing only what the cases need: CR sections for priority, the stack, and triggered abilities; IPG 2.1; the MTRA Missed Trigger section; Oracle text for the cards involved;
    - one hand-written Missed Trigger procedure;
    - the four task roles on the proposed models;
    - the verifier checks that need no semantics;
    - a CLI front end instead of Discord.
2. **Cases:**
    - (a) a rules question: *Judge, what is priority?*;
    - (b) a rules interaction: *Faerie Mastermind / Smothering Tithe / Orcish Bowmasters APNAP*, a validated scenario;
    - (c) a dispute: *The One Ring / Carpet of Flowers*, a validated scenario, played by the owner or scripted replies, through to a ruling or a handoff.
3. Run each case 5 times on the **baseline** routing and 5 times on the **lean** routing (ADR-0012 L1), through the subscription route (ADR-0016). Record every call's exact input and output, per role.
4. **Compute the cost:**
    - count each recorded input and output with Anthropic's token-counting endpoint. That needs the API account the live bot will need anyway. It is documented as free of charge; the spike confirms that before using it. If it isn't free, estimate at about 4 characters per token, with a ±20% margin;
    - add a margin for the `reason` role's thinking tokens, which the subscription route doesn't expose. Use +100% of visible output for baseline and +50% for lean;
    - determine the cached versus uncached split from the prompt structure: the stable prefix must be byte-identical across turns, which is checked deterministically;
    - apply the API prices, and project the monthly cost at 200 and 430 cases using the owner's case mix: 75% rules questions, 25% disputes (owner's estimate, 2026-09-25).
5. **Latency** measured on the subscription route is indicative only. Real API latency is confirmed from the ledger in the first live cases (ADR-0016 §7).
6. Check the answers against the scenario's expected ruling and citations. A cheap run that gets the ruling wrong counts as a fail for that routing.

**Pass criteria:**

- The computed mean cost per case for the mix, margins included, is ≤ $0.10 on at least one routing that gets all three cases right, and the projection at 430 cases a month is ≤ $20 on that routing (with ladder levels allowed). Otherwise the report states the monthly volume at which the cap is reached.
- Indicative p90 reply latency ≤ 9 s (NFR-LAT-1), with a typing indicator shown during the `reason` step. This is confirmed on the live bot.
- The stable prompt prefix on warm Haiku turns is byte-identical and above Haiku's minimum cacheable length, so that ≥ 80% of prefix tokens would be cache reads.

**Fail:** no routing is both correct and within budget. The report then quantifies the gap and lists the options: a cheaper `reason` model with more verification, a bigger share of deterministic answers, a TO's own key, or a budget change. Choosing among them is the owner's decision.

**Time box:** 4 working days. **Paid spend: $0.** About 30 case runs on the owner's Pro plan, within its usage limits.
