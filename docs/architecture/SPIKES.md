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

**Prerequisite from the product owner:** the name of the ticket bot (OQ-21), and a test server (or test category) where the bot can be installed with the same configuration as the live server.

**Method:**

1. Install the ticket bot and the spike bot on the test server with the permissions in ADR-0010.
2. Record the raw gateway events for 10 tickets opened the way players do it today:
    - the container type (channel in category, or thread in channel: OQ-22);
    - the naming pattern;
    - when the first message arrives and what it contains;
    - who is added, and when;
    - what closing looks like (archive, lock, delete, rename).
3. Implement the matching `TicketSource` against the recordings. Replay the recordings as fixtures.
4. Live check: open 10 more tickets and confirm each is detected, parsed, and answered with a test greeting.
5. Outage check: stop the bot, open 3 tickets and close 1, restart. Confirm that the 2 still open are picked up with a "sorry for the wait" greeting and that the closed one is ignored.
6. Private visibility: confirm that the bot can read and post in the ticket without extra manual steps per ticket.

**Pass criteria:**

- 20/20 tickets detected. Description and reporter parsed correctly in 20/20. Median time from ticket creation to greeting ≤ 5 s.
- The outage test passes exactly: 2 picked up, 1 ignored, no duplicate greetings after a second restart.
- No manual step per ticket. Any setup needed per server is documented in a checklist of no more than 10 items.

**Fail:** the ticket bot's containers can't be seen or posted in without manual steps per ticket, or its descriptions can't be parsed reliably. The report then proposes options for the owner (for example a ticket-bot setting, or a different ticket bot). Replacing D37 is the owner's decision.

**Time box:** 2 working days, after the prerequisites are met.

---

## S3: Cost per case

**Requirements:** NFR-COST-1, NFR-COST-2, NFR-LAT-1, NFR-ACC-1, P2, OQ-25 · **ADRs at stake:** 0002, 0005, 0008, 0012 · Tests the cost model in ARCHITECTURE.md §9

**Question:** does one realistic cEDH case, run end to end on the proposed architecture, cost within $0.05–0.10, including everything, and answer within single-digit seconds per reply?

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
3. Run each case 5 times on the **baseline** routing and 5 times on the **lean** routing (ADR-0012 L1). Log tokens by role, cached versus uncached, and latency per reply.
4. Compute the cost per case, and project the monthly cost at 200 and 430 cases using the owner's case mix (OQ-25), or 60/40 if OQ-25 is still open.
5. Check the answers against the scenario's expected ruling and citations. A cheap run that gets the ruling wrong counts as a fail for that routing.

**Pass criteria:**

- The mean cost per case for the mix is ≤ $0.10 on at least one routing that gets all three cases right, and the projection at 430 cases a month is ≤ $20 on that routing (with ladder levels allowed), or the report states the monthly volume at which the cap is reached.
- p90 reply latency ≤ 9 s (NFR-LAT-1), with a typing indicator shown during the `reason` step.
- The prompt-cache hit rate on warm Haiku turns is ≥ 80% of the prefix tokens.

**Fail:** no routing is both correct and within budget. The report then quantifies the gap and lists the options: a cheaper `reason` model with more verification, a bigger share of deterministic answers, a TO's own key, or a budget change. Choosing among them is the owner's decision.

**Time box:** 4 working days. Model spend is capped at $15, from the build/eval budget (OQ-24).
