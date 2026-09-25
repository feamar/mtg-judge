# Product-owner answers given during the architecture phase

The architect role may only add open questions to the PRD; it doesn't change requirements or the decision log. These are the answers Frank (product owner) gave in the architecture session on **2026-09-25**. They are recorded here so they can be moved into PRD §10 (decision log) and §12 (open questions) in a PRD commit that references these IDs. The architecture already follows them.

| Topic | Question | Answer | Applied in |
| --- | --- | --- | --- |
| OQ-20 | Zero or one addendum per event, amending the MTR, the IPG, or both? | **Yes, confirmed.** | ADR-0007 §6; TRACEABILITY NG4 |
| OQ-22 | Ticket bot: a channel per ticket, or a thread per ticket? | **A thread per ticket.** The event context's "ticket category" field therefore holds the parent channel the threads are opened under. | ADR-0010 |
| OQ-21 | Name of the ticket bot | **"Ticket Bot"**, whose website is **https://tickets.bot** (the Tickets bot, in thread mode). It is identified by its Discord user ID, which spike S2 records. | ADR-0010; SPIKES S2 |
| OQ-23 | Is sending pseudonymised player text to a non-EU AI provider with its own retention acceptable? | **Yes.** A short privacy notice for players is recommended. | ADR-0002; ARCHITECTURE.md §10 |
| OQ-24 | Size of the separate build/eval budget | First: "This should not be that expensive. We need to make it way cheaper." Then: **"Build and test needs to be done on this account, within Pro token budget."** So there is **no paid API spend** for build or test. The owner also declined a small paid API cross-check per release ("No, Pro only"). | ADR-0016; ADR-0013 §6; ARCHITECTURE.md §9.1; SPIKES S3 ($0) |
| OQ-25 | Share of rules questions vs. disputes | **About 75% rules questions.** | ARCHITECTURE.md §9; SPIKES S3 |
| OQ-26 | Behaviour when the monthly cap is reached | **Questions only:** keep answering rules questions on the cheapest model; hand disputes to human judges. | ADR-0012 L3 |
| OQ-27 | Owner review of AI-drafted procedures, penalty rows, and addendum edits | **Yes, review each one** before the first release; afterwards only the changed ones. | ADR-0007, ADR-0008 |
| OQ-28 | Form of the FR-CTX-4 share link | **A join code** (`/judge join <code>`); no web URL in the MVP. | ADR-0003; TRACEABILITY FR-CTX-4 |
| OQ-29 | How to form the held-out set | "I built all scenarios and ChatGPT wrote it down for me. I will make the rest with you." The architecture reads this as: new cases are written with Claude in a separate **case author** role, and held-out cases are stored outside this repo. | ADR-0013 §5 |
| Build budget | Is build/eval spend inside the $20 cap? | **No, it's separate.** Later made concrete: it runs on the Pro subscription (see OQ-24). The $20 cap covers only the live bot's API credits. | ADR-0012 §6; ADR-0016 |
| Hosting | Where does the bot run? | **The owner's always-on desktop.** | ADR-0003 |
| Host OS | Windows 10 Home loses security updates by 13 October 2026. | **Accept the risk for now.** | ADR-0003 (accepted risk) |
| Runtime | Docker or a plain Node service? | **"If it can be docker, use that."** Docker is the default; if virtualization can't be enabled, the fallback is a Windows service. | ADR-0003 |
| OQ-30 (D29, FR-INV-2) | May the judge choose investigation questions deterministically, with pre-written approved wording (buttons where possible), instead of the AI choosing and wording them? | **Yes, deterministic.** This came from the owner's point that "most of these scenarios shouldn't be using AI at all". PRD text of D29 and FR-INV-2 to be revised. | ADR-0008; ARCHITECTURE.md §0, §5 |
| Library miss | A rules question that the approved rulings library doesn't cover: what does the judge do? | **AI answer, marked** as not from the approved library, verified, and logged so it can become a library entry. | ADR-0008; ARCHITECTURE.md §5.3 |
| Speech-to-text | Use the owner's ChatGPT subscription? | The owner has a ChatGPT subscription only, with **no OpenAI API access**. Voice transcription is **local-only** in the MVP. | ADR-0015; SPIKES S1 |
