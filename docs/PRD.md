# AI MTG Judge — PRD v0.1

Product owner: Frank · Status: Draft for review · Last updated: 2026-09-25

> **This file is the master copy of the PRD.** It was migrated from the Claude Docs draft on 2026-09-25. Change requirements here, through commits, and never in a copy.

## 0. How to read this document

This PRD is the build spec for AI roles further down the line (architect, planner, engineer, QA). Anything it does not say is **undecided, not implied**. Raise it as an open question; do not guess.

- **Requirement language:** MUST = required for the release it's tagged with. SHOULD = strong default; deviating needs a recorded reason. MAY = optional.
- **IDs are stable and never reused:** P = principle, D = decision, FR = functional requirement, NFR = non-functional requirement, NG = non-goal, R = risk, OQ = open question.
- **Phase tags:** `[MVP]`, `[Post-MVP]`, `[Future]`. Anything untagged is `[MVP]`.
- **Decisions carry their reasoning.** Do not "improve" a deliberate constraint away without the product owner's sign-off.
- **Terms in bold are defined in the Glossary (§9).**

**Inputs.** This PRD incorporates an earlier requirements package that the product owner worked out with ChatGPT (REQUIREMENTS, RULES, DEFINITIONS, ARCHITECTURE, and REFERENCES, consolidated on 2026-09-22), plus 18 scenarios. Where the two differ, **this PRD wins**. The package is kept in [`docs/reference/chatgpt-2026-09-22/`](reference/chatgpt-2026-09-22/). Its RULES.md (working rules for AI roles) and ARCHITECTURE.md (candidate design: Python/FastAPI, PostgreSQL with pgvector, a verifier layer) remain inputs for the architect, not decisions.

## 1. Vision and problem

An AI Magic: The Gathering judge, available right away in Discord, that gives correct rulings and fixes the game, with a human judge brought in only when it can't rule safely.

**Problem.** Online tournaments on Discord often wait 1–2 hours for a human judge. Small in-person events have judges who are overloaded. Players at home have no judge at all. Games stall, or players settle disputes by guessing.

**Product.** The judge does three jobs:

1. **Answers rules questions** using the Comprehensive Rules and the official (Oracle) card text.
2. **Rules on disputes.** It hears the players out, establishes the facts, gives a ruling, and fixes the game state where needed.
3. **Enforces policy.** It identifies infractions and applies penalties according to the **MTR**, the **IPG**, and the event's **policy framework**.

**Primary context:** online **cEDH** tournaments at **Competitive REL**, run on Discord.

## 2. Guiding principles

When requirements conflict or say nothing, these principles decide.

- **P1 — Teach first.** Every ruling explains *why*, citing the rule, so players get better at the game. **Exception:** when a penalty applies, the order becomes (1) apply the correct penalty, then (2) potentially teach.
- **P2 — Deterministic first, AI last. Spend at build time, not at run time.** Anything that can be deterministic MUST be: document lookups, rule citations, card data, penalty tables, upgrade paths, investigation procedures. At run time the AI only (a) understands what players say, (b) picks the matching procedure or rules, and (c) phrases the questions and explanations. Heavy AI analysis happens once, in the **build pipeline**, and produces structured artifacts that are cheap to query.
    - *Why:* cheaper to run (NFR-COST), more accurate (deterministic parts don't hallucinate), and easier to test.
- **P3 — The face of the game, impartial.** For players, the judge speaks for Magic: The Gathering, the competitive community, the cEDH community, and the TO.
    - **Tone:** precise, very friendly, and customer-centric in its wording and its approach. Its stance, in the product owner's words: *"I am here to help"* and *"I am here to help you follow the rules."* When it arrives at a case, the judge opens with a greeting in the product owner's style, such as *"Players! What is going on?"* or *"Players! What can I do to help?"* It uses this greeting for **disputes only**. A single player's rules question gets a direct answer. Unlike a floor judge, the bot usually knows the reported issue before it speaks, so its greeting SHOULD acknowledge the ticket's description (for example, *"Players! I see there's a question about a missed trigger. What happened?"*). It SHOULD fall back on the stance phrases whenever a player seems defensive or upset.
    - **Impartiality:** it NEVER takes a player's side. It rules the same way every time.
    - **Penalties:** a penalty is a learning moment. The judge explains what happened, not who is to blame.

## 3. Users, roles and contexts

There are four roles. The **Admin** grants the TO role. Judges and TOs have their own separate **server roles**. Anyone else counts as a player.

| Role | What they do with the judge | What they can see |
| --- | --- | --- |
| Player | Asks questions, starts disputes, answers the judge's questions and follows its instructions, in the player channel, or in a private message while the judge is investigating | Only the conversation they're in right now. Nothing in the MVP lets players look up earlier interactions. |
| Judge (human) | Receives handoffs in the **judge-only channel**, or in private messages when they claim the ticket; reviews rulings | All rulings in the current event, plus **investigation notes** |
| Tournament organizer (TO) | Sets up the **event context** | Same as a judge |
| Admin | On each server, chooses which Discord server role counts as the TO role. There is one global Admin across all servers: the product owner. | Same as a TO, across every event on every server (assumed) |

| Context | Phase | REL | Interface |
| --- | --- | --- | --- |
| Online cEDH tournament on Discord | MVP (primary) | Competitive | Discord bot |
| Online 1v1 constructed tournament | Post-MVP | Competitive | Phone app |
| Casual play at home or in playgroups | Post-MVP | Regular (JAR) | Phone app |
| Small in-person events | Future | Regular / Competitive | Phone app |

**Pilot user:** the product owner, who judges online on Discord and in person and plays in friend groups. He is also the domain reviewer for rulings (§8).

## 4. Scope

**The MVP is a Discord bot that judges cEDH at Competitive REL, under one policy framework per event.**

**MVP**

- Discord bot with text input.
- Voice input, but only if the feasibility spike (FR-VOICE-1) succeeds. If it fails, voice is dropped from the MVP.
- Format: cEDH (Commander, multiplayer, usually 4-player pods).
- REL: Competitive.
- Rules questions, dispute rulings with game fixes, infractions and penalties.
- Event context, with one policy framework selected per event.
- Handoff to the human judge.
- A record of every ruling.

**Post-MVP (in rough order)**

1. 1v1 constructed formats (Standard, Pioneer, Modern, Legacy, Vintage, Pauper).
2. Regular REL (JAR), and casual play.
3. Phone app (text and voice, with several players talking into one device).
4. Penalty history across an event (upgrade paths, Turn Skips that carry over between rounds).
5. Languages other than English.
6. Photo input, then webcam input, of the board.
7. Limited formats.

**Long-term vision: design for it, don't build it (D31)**

- More channels: WhatsApp and the web.
- Evidence beyond text and voice: photos, video, and live streams. The judge can ask for a different kind of input when it would settle an uncertainty faster.
- A mobile app that runs locally or in a hybrid mode: the rules data on the device, and inference on the device where that's feasible.
- Scale to millions of users, with a scenario corpus of more than 10,000 cases.

None of this is in the MVP. The architecture MUST NOT rule any of it out.

**Permanent non-goals**

- **NG1 — No event management, ever.** No pairings, standings, points, tiebreakers, rounds, registration, or timers. The judge MAY answer *questions* about those rules (for example, "How many points is a draw worth?") but MUST NOT compute or manage them.
- **NG3 — No Professional REL, ever.**
- **NG4 — No mixing policy frameworks within an event.**

**Architecture constraints from later phases.** The MVP MUST NOT hard-code:

- the player count, or a two-player assumption;
- English, anywhere;
- Discord as the only possible front end;
- a text-only input pipeline (photo and vision input come later).

## 5. Sources of truth and policy frameworks

Every ruling MUST trace back to the specific sections of these documents that support it. The judge MUST NOT rule from general knowledge alone. Source links and local copies are listed in [`sources/`](../sources/).

| Layer | Document | Role | Source |
| --- | --- | --- | --- |
| Game rules | Comprehensive Rules (CR) | How the game works | Wizards of the Coast |
| Card text | Oracle text and official rulings | What each card does | [gatherer.wizards.com](https://gatherer.wizards.com/) |
| Tournament rules | Magic Tournament Rules (MTR) | Rules for how the tournament is run | [magicjudges.org](https://blogs.magicjudges.org/rules/mtr/) |
| Infractions | Infraction Procedure Guide (IPG) | Infractions, penalties, fixes, and investigation procedure | [magicjudges.org](https://blogs.magicjudges.org/rules/ipg/) |
| Policy framework (choose one) | [Multiplayer Addendum (Portuguese judges)](https://juizes-mtg-portugal.github.io/multiplayer-addendum-mtr) | Multiplayer additions to the MTR and IPG. Follows the MTR's section numbering. | GitHub Pages |
| Policy framework (choose one) | [Multiplayer Tournament Addendum, MTRA](https://topdeck.gg/mtr-ipg-addendum) (also on [Notion](https://mtgmta.notion.site/mtgmta)) | Multiplayer additions to the MTR and IPG, with its own numbering. Replaces Game Loss with Turn Skip. | TopDeck.gg / Notion |

**The policy framework shapes two things (D21):**

- **(a) Penalties:** which penalties exist, what they are replaced with, how they upgrade, and end-of-round limits.
- **(b) Procedures:** which questions the judge asks, in what order, which player each one is addressed to, and which remedy steps follow.

**Precedence, highest first:** the policy framework's explicit edits, then the IPG and MTR, then the CR (the CR decides game rules; policy documents do not change them). *See OQ-4.*

**Updates (D25).** A new version of any of these documents triggers a manual rebuild:

1. Import the new version.
2. Show a diff against the previous version.
3. Rebuild the structured artifacts.
4. Run the golden test set.
5. The product owner approves the release.

The system does not pick up new versions automatically.

## 6. Functional requirements

Each requirement has acceptance criteria (AC) written as Given / When / Then. A requirement is done only when its AC are covered by automated tests or by golden cases (§8).

### 6.1 Event context

- **FR-CTX-1.** A user with the TO role can create an event context with these fields: name, format (MVP: cEDH only), REL (MVP: Competitive only), policy framework (no more than one of IPG and/or MTR), the judge role, the TO role, the judge-only channel, the player channels, the ticket category (where the ticket bot opens threads), and the language (MVP: English only).
    - AC: Given a user who does not have the TO role, when they try to create or edit a context, then the bot refuses.
- **FR-CTX-2.** Every ruling made in a Discord server follows that server's event context. If a server has no context (during the MVP), the judge only answers rules questions and says that it can't rule on penalties. After the MVP it will assume a 1v1 game context.
- **FR-CTX-3.** The bot MUST NOT store or compute pairings, standings, points, or timers (NG1).
- **FR-CTX-4.** An event context can be shared through a link. Players in the event's Discord server get the context automatically. Anywhere else, they join it with the link. Only the TO can change a context; a link gives read access only (D32).
- **FR-ADM-1.** There is one global Admin (the product owner). On each server, the Admin chooses which existing Discord server role counts as the TO role. Every member of that role is a TO for that server. Only a TO can create or edit an event context (D40).
    - AC: Given a user who is not an Admin, when they try to grant or revoke the TO role, then the bot refuses.

### 6.2 Interaction

- **FR-INT-1.** A judge call opens a **ticket**: a separate thread for that case. The thread contains the player's description of the issue, the players who reported it, and every judge and TO of the event. The judge takes part in that thread. Tickets are created by the server's **existing ticket bot**, which opens a thread in the server's ticket section (D37). Players call a judge the way they do today, from the judge channel. The judge never creates tickets: it detects new ticket threads in the category set in the event context and joins them. How it detects tickets MUST be pluggable, because other servers may use a different ticket bot (OQ-21).
- **FR-INT-2.** More than one player can take part in a case. The judge knows who each message comes from.
- **FR-INT-3.** The judge MAY message a player privately to **investigate**, for example to question players separately. It never uses a private message to **resolve** an issue. Remedies and other private steps, such as showing hidden cards to one opponent, are carried out by instructing the players at the table.
    - AC: Given a Hidden Card Error under the MTRA, when the remedy runs, then the judge tells the infracting player to show the set only to the opponent furthest from the active player in turn order, tells that opponent to make the choice, and tells everyone the choice may not be discussed. No private message is used for the remedy.

### 6.3 Rules questions

- **FR-Q-1.** The judge answers rules questions using the CR and Oracle card text. Every answer cites the relevant CR rule numbers and explains the reasoning (P1).
- **FR-Q-2.** When a card name is ambiguous or misspelled, the judge confirms which card is meant before answering.
- **FR-Q-3.** The judge MAY answer questions about MTR and addendum procedures (for example, "How many points is a draw worth?"), but never applies them to real event data (NG1).
- **FR-Q-4.** For complicated concepts (for example layers, priority, copy effects), the judge explains with a useful mnemonic or simple model where one exists, instead of listing every rule. The full citations stay available if a player asks for them.
    - AC: Given a question about layers, when the judge explains, then the answer uses a short mental model and cites only the rules that decide this particular case.
    - The build pipeline curates the set of mnemonics, and the product owner approves it (P2).
- **FR-Q-5.** During a game, the judge gives the **minimum explanation** the players need to understand the situation and carry on. Outside a game, it can go deeper. Its internal reasoning can be far more detailed than what it tells the players. (The *priority* scenario is the reference example.)

### 6.4 Disputes and game fixes

- **FR-RUL-1.** When there is a dispute, the judge establishes the facts before ruling. It gathers only the facts the chosen procedure needs.
- **FR-RUL-2.** When the players' accounts conflict, the judge asks follow-up questions. If the surrounding facts show that one account is wrong, or that the disagreement makes no difference to the ruling, the judge makes a judgement call and rules. Otherwise it rules on the facts everyone agrees on, or escalates (FR-ESC). Every judgement call states the facts it rests on.
- **FR-RUL-3.** The ruling gives: the decision, the game fix step by step, the citations, and a short explanation of the rule (P1).
- **FR-RUL-4. Where each fact came from.** Every fact in a case is tagged with its origin:
    - **Reported:** a player said it.
    - **Observed:** it comes from evidence.
    - **Derived:** the judge worked it out from the rules, card text, or arithmetic.

    A player's claim about the rules, the infraction, a count, or the remedy (for example, "I have 28 missed triggers") is something to check, never a fact.
- **FR-RUL-5. Confirming its understanding.** Before a ruling that depends on reconstructing events, the judge tells the players how it has understood the question, the relevant history, and the facts it is relying on, so they can correct it.
- **FR-RUL-6. Revising its hypothesis.** The judge keeps several explanations open and changes its view as new answers come in. It must not stick with its first guess.
    - AC: In the One Ring / Carpet of Flowers scenario, the player's new explanation lowers the suspicion of cheating, but the ruling that a Missed Trigger occurred stays the same.
- **FR-RUL-7. Deciding the infraction separately from intent.** Whether an infraction happened is decided from the game actions. What the player knew or intended is a separate question, and it never changes that decision after the fact.
- **FR-RUL-8. No play advice and no revealing hidden information.** The judge MUST NOT give play advice, and MUST NOT reveal information to a player who isn't entitled to it.
- **FR-RUL-9. "Unresolved" is a valid result.** If the governing rules and policy text don't settle a necessary point, the judge returns an explicit *unresolved* result and escalates (FR-ESC). It MUST NOT make up a ruling. This counts as a success, not a failure.

### 6.5 Infractions and penalties

- **FR-POL-1.** The judge identifies the infraction and applies the penalty and fix defined by the IPG, as modified by the event's policy framework. Choosing the penalty is deterministic: a lookup from the infraction to its penalty, with no AI judgment involved.
    - AC: Given an MTRA event and a Deck Problem where the IPG path would lead to a Game Loss, when the judge applies the penalty, then it issues a Turn Skip.
- **FR-POL-2.** How a penalty is delivered depends on context (D36). The judge picks one of these patterns:
    - **Explain, then penalty.** When the explanation helps the player learn and shows *why* the penalty is given. The product owner expects this in a high share of cases.
    - **Penalty, then explain.** The P1 exception: state the penalty, then teach.
    - **Ruling, explain, ruling again.** State the ruling, explain it, then restate it so there's no doubt.
    - **Summary, explain, exact ruling.** Describe the ruling in plain words, explain it, then give the exact ruling and penalty.
    - **Penalty only, no explanation.** When the penalty is harsh and explaining it is likely to escalate the player's reaction. This is rare at Competitive REL.
    - AC: Each golden case that involves a penalty records the expected pattern, and the judge's choice is tested against it.
- **FR-POL-3.** In the MVP, the judge has no penalty history across the event. Every penalty it issues is labelled as the **base penalty, assuming no earlier infractions**, and a copy goes to the judge-only channel so human judges can apply any upgrades.

### 6.6 Investigation procedures

- **FR-INV-1.** For each infraction, the build pipeline produces a **procedure** from the IPG and all policy frameworks. A procedure lists: the facts needed, the question that establishes each fact, which player each question or instruction is addressed to, when to stop, and the remedy.
- **FR-INV-2.** At run time the judge works in a **hybrid** way (D29). The build-time procedures define, for each possible ruling branch, which facts decide it. The AI forms hypotheses and chooses the next question that would change the ruling, the fix, the penalty, or whether to escalate. It then words that question naturally. It MUST NOT skip a fact that decides the ruling, but it also doesn't work through a fixed checklist. Every question is recorded with the hypothesis behind it and why the answer matters.
    - AC: A golden case can check that the judge asked for each required fact before ruling.
- **FR-INV-3.** The judge asks about the state of the game **only when the procedure needs it**: seat and turn order, the active player, who has been eliminated, the contents of zones. It never collects the full board state up front.

### 6.7 Escalation and handoff

- **FR-ESC-1.** The judge escalates when any of these happens:
    - (a) its confidence is below a threshold (OQ-7);
    - (b) the case falls in a category marked as always escalate (OQ-7);
    - (c) a player contests the ruling;
    - (d) it suspects cheating (Competitive REL only);
    - (e) it can't resolve contradictory accounts.
- **FR-ESC-2.** Before it escalates, the judge MUST gather every fact that is useful and cheap to collect (D12).
- **FR-ESC-3.** The handoff goes to the judge-only channel and contains: a case summary, the facts established, the facts in dispute, the relevant citations, the judge's provisional reading, and why it escalated.
- **FR-ESC-4.** When the judge suspects cheating, it writes **investigation notes** that are visible only to judges and the TO: the signals it saw, the inconsistencies, and suggested lines of questioning. Players MUST NOT see these notes, and the judge MUST NOT say anything to players that reveals the suspicion. The judge stops asking questions once more questions could compromise a human judge's investigation. It then tells the players neutrally to wait for a human judge and not to continue the relevant game actions.
    - AC: Given a suspected Cheating case, when the handoff is sent, then no message in any player channel or DM contains the suspicion or the reasoning behind it.
- **FR-ESC-5.** While a case is escalated, the judge tells the players that a human judge has been called and asks them to leave the game state as it is.

### 6.8 Ruling record

- **FR-LOG-1.** Every case is recorded and kept for **7 days**, then deleted (D39). The record holds: the event context, the participants, the transcript, the procedure used, the facts established, the ruling, the penalty, the citations, whether it was escalated, any investigation notes, the system version, and the versions of the source documents.
- **FR-LOG-2.** Judges and the TO of the event can read the records. Players can't in the MVP.
- **FR-LOG-3.** Within those 7 days, a judge or the product owner can export a record as a golden-case candidate (§8). Exported cases become part of the golden set and are kept. Comparing system versions is done by replaying the golden set, not old records.

### 6.9 Voice

- **FR-VOICE-1.** Before the MVP is built, the architect runs a feasibility spike on a bot receiving and transcribing voice in a Discord voice channel. If the spike fails or voice is too costly, voice is dropped from the MVP (D22).
- **FR-VOICE-2.** If voice ships, it goes through the same pipeline as text. The bot listens only after it has been explicitly summoned, never continuously (OQ-6).

### 6.10 Build pipeline

- **FR-BUILD-1.** The pipeline imports the CR, MTR, IPG, multiple policy frameworks, and the card data, and produces versioned, structured artifacts: an index of the rules, penalty tables for each framework, and investigation procedures for each framework.
- **FR-BUILD-2.** Every artifact links back to the source section it came from.
- **FR-BUILD-3.** The pipeline produces a readable diff between document versions and blocks a release until the golden set passes and the product owner approves.

## 7. Non-functional requirements

| ID | Requirement | Target / rule |
| --- | --- | --- |
| NFR-ACC-1 | Accuracy on easy cases | 100% of golden cases tagged *easy* pass |
| NFR-ACC-2 | Behaviour on hard cases | Up to about 2% of real cases may be escalated. An escalated case must still arrive with its facts gathered (FR-ESC-2). |
| NFR-ACC-3 | No invented citations | Every citation resolves to a real section in the source version currently loaded |
| NFR-COST-1 | Running cost | Under $20 a month at pilot volume: one TO with 50–100 cases a week, or about 200–430 a month. That leaves roughly $0.05–0.10 per case for everything: hosting, AI model calls, and speech-to-text. |
| NFR-COST-2 | Degrading under cost pressure | There must be a way to keep costs under the cap: rate limits, routing simple questions to a cheaper model, or TOs supplying their own API key (the architect proposes) |
| NFR-AVAIL-1 | Availability | The bot runs around the clock. Events usually run for a month, so judge calls can come at any time. Brief restarts are acceptable, but a ticket opened during an outage MUST be picked up when the bot comes back. |
| NFR-LAT-1 | Response time | Text: every reply within seconds (single digits). Voice: target to be set if voice ships (OQ-9). |
| NFR-I18N-1 | Ready for other languages | No user-facing text or prompt is hard-coded in English. Language is a setting in the event context. Terms defined in the CR, MTR, or IPG are never translated. |
| NFR-PRIV-1 | GDPR | The product owner is in the EU. Consent before any voice capture, case records deleted after 7 days (D39), and deletion on request. |
| NFR-VER-1 | Traceability | Every ruling records the system version and the version of each source document |
| NFR-TECH-1 | Technology choice | The architect chooses the programming language and the AI model provider. The language must be modern, mainstream, and well supported by Discord libraries. The provider must be easy to use and cheap enough for NFR-COST-1. The provider MUST be replaceable without changing ruling logic (D41). |
| NFR-EXT-1 | Room to grow | Format, REL, policy framework, front end, and input type are all pluggable. None of them is hard-coded. |
| NFR-TONE-1 | Tone (P3) | Every reply is precise, friendly, and customer-centric. No sarcasm, no blaming wording, no judgement of a player's character. Checked in every golden case by a written tone rubric (OQ-18). The rubric starts from the stance phrases in P3. |
| NFR-IMP-1 | Impartiality and consistency (P3) | The same facts give the same ruling, whoever reports them, in whatever order, and however they are worded. Golden-set variants test this by swapping who reports, the order of events, and the wording. |

## 8. Quality measurement

The **golden test set** is the definition of correct. It is the benchmark for every AI role and every release. It lives in [`golden/`](../golden/).

- **What goes in (D23):**
    - real cases the product owner has judged;
    - hard scenarios an AI generates from the CR, MTR, IPG, and addenda.
    - A generated case counts only after the product owner signs it off.
- **What each case records:** the input conversation, the event context, the *easy* or *hard* tag, the expected ruling, penalty, and fix, the required citations, the facts the judge must ask for, and whether it should escalate.
- **Easy vs. hard:** the product owner tags each case. A case is *hard* if it involves a complex rules interaction (for example layers or replacement effects), a long investigation, or rebuilding a complex board state. Everything else is *easy*.
- **Release gate:** 100% of easy cases pass, the escalation behaviour on hard cases matches what's expected, and the product owner approves.
- **Feedback loop:** real case records (FR-LOG-3) are reviewed and turned into new golden cases.
- **Launch target size:** about 1,000 cases (D38). Most will have to be AI-generated and then validated by the product owner (see R12). The split between easy and hard cases is still open (OQ-11).

**Case format and management** (adopted from the ChatGPT package)

- **Citation chain.** Every material step of a ruling is written down as **source → proposition → consequence**: the exact rule, policy section, or Oracle text; what it establishes in this game state; and how that changes the ruling, the fix, the penalty, or the next question. Tests check these intermediate steps as well as the final answer.
- **Validation status.** A case is marked **SOURCE CHECK REQUIRED** until the product owner has checked its citations. Only validated cases can block a release.
- **Variants.** Case families change one fact that matters, to prove the judge takes a different ruling branch (for example, the variants of the One Ring scenario).
- **Separate sets.** Development, regression, and held-out evaluation sets are kept apart. Held-out cases are never shown to the AI roles while they build.
- **Structured data.** Cases are stored as machine-readable data (concepts, REL and policy framework, source versions, required questions, expected intermediate steps, expected outcome, validation status, where the case came from). A readable Markdown view is also produced.
- **Staleness.** When a source document changes, every case that cites a changed section is flagged for revalidation.
- **Starting set:** the 18 scenarios from the ChatGPT package. 11 are validated. 7 are SOURCE CHECK REQUIRED: Wheel of Fortune/Flare, Judge what is priority, Etali, the three Kinnan cases, and the forgotten untap. (The priority case is marked validated in its own file but not in the index. That needs to be reconciled.) They need to be converted to the multiplayer cEDH context where that applies, and tagged easy or hard.

## 9. Glossary

| Term | Definition |
| --- | --- |
| cEDH | Competitive Commander. A multiplayer format, usually played in 4-player pods. |
| CR | Comprehensive Rules: the official game rules. |
| MTR | Magic Tournament Rules: the rules for how tournaments are run. |
| IPG | Infraction Procedure Guide: infractions, penalties, and fixes at Competitive REL. |
| JAR | Judging at Regular REL: the guidance for casual-level events. |
| REL | Rules Enforcement Level: Regular, Competitive, or Professional. |
| Policy framework | One multiplayer addendum (to the MTR and IPG) chosen for an event. MVP options: the Portuguese Multiplayer Addendum or the MTRA. |
| Event context | The settings a TO configures for an event: format, REL, policy framework, roles, channels, and language. |
| Case | One conversation with the judge, from the moment it's summoned until a ruling or a handoff. |
| Ticket | The Discord thread opened by a judge call, containing the description, the reporting players, and the event's judges and TOs. |
| Procedure | A structured script for one infraction, produced at build time: the facts needed, the questions, who each question goes to, and the remedy. |
| Handoff | Escalating a case to human judges in the judge-only channel. |
| Investigation notes | Information about suspected cheating that only judges and the TO can see. |
| Build pipeline | The offline process that turns the source documents into structured artifacts. |
| Golden test set | Cases the product owner has approved, which define what a correct ruling is. |
| Turn Skip | An MTRA penalty: the player skips their next turn. It can carry over into the next round. |
| Reported / Observed / Derived fact | Where a fact came from: a participant said it; it was taken from evidence; or the judge worked it out using the rules, card text, or arithmetic (FR-RUL-4). |
| Source → proposition → consequence | The traceable form of each step in a ruling: which text is cited, what it establishes in this game state, and what that changes. |
| Unresolved | A valid result: the governing text doesn't settle a point that's needed, so the case is escalated rather than decided (FR-RUL-9). |
| Play advice | Tactical or strategic guidance that could influence a player's decisions in the game, whether given on purpose or not. The MTR and IPG definitions take precedence. |
| SOURCE CHECK REQUIRED | The status of a golden case whose citations the product owner hasn't validated yet. |

## 10. Decision log

| ID | Decision | Why |
| --- | --- | --- |
| D1 | The judge does jobs 1–3: rules questions, dispute rulings, and policy enforcement | Core value of the product. Event management is excluded (NG1). |
| D2 | Text and voice input. Photo and vision input come later. | Matches how people call a judge |
| D3 | Rulings are final by default. The judge hands off when it's uncertain, when it suspects cheating, or when a human judge is required. | Speed. A human judge is the fallback. |
| D4 | The primary use case is online Discord tournaments | Human judges there are 1–2 hours away |
| D6 | Suspected cheating means investigation notes visible only to judges | Players can't adjust their stories |
| D8 | The event context is set by the TO | Rulings need the REL, the framework, and the roles |
| D9 | The judge may message players privately to investigate, never to resolve. Private remedy steps are done by instructing the players at the table. | Questioning players separately stops them aligning their stories. Remedies stay visible to everyone at the table. |
| D11 | Competitive REL in the MVP. Regular (JAR) comes later. Never Professional. | Tournament use comes first |
| D12 | 100% correct on easy cases. Up to about 2% of cases escalated, but with the facts gathered. | Trust |
| D13 | No business model. This is a learning project. | The owner's goal |
| D14 | Running cost under $20 a month | Budget |
| D16 | English only in the MVP, but built to support other languages | Growth later |
| D18 | Rulings are grounded in the CR, MTR, and IPG | Traceability |
| D20 | cEDH is the MVP format. 1v1 comes later. | The owner's priority. 1v1 is a simpler special case. |
| D21 | One policy framework per event. It sets penalties *and* procedures. | The frameworks differ in substance |
| D22 | Voice is wanted but can be dropped | Discord voice support is uncertain |
| D24 | Every ruling is recorded. Judges and the TO can see the records. Records are kept for 7 days (D39). | Audits, and turning real cases into golden cases |
| D25 | New document versions trigger a manual rebuild | Updates stay deterministic and tested |
| D27 | The judge asks about the game state only when a procedure needs it | Avoids friction |
| D28 | No penalty history across the event in the MVP. Penalties are handed off to human judges for recording. | Keeps the MVP small |
| D29 | Hybrid investigation. Build-time procedures define which facts decide each ruling branch. The AI chooses the next question from its hypotheses and words it naturally. | P2. Repeatable and testable. *Confirmed on 2026-09-25.* |
| D30 | The accuracy target stays: 100% of easy cases correct, and about 2% of cases escalated. ChatGPT's "at least 90%" target is not adopted. | A stricter target that can be tested |
| D31 | More channels, photo and video input, on-device inference, and very large scale are designed for, but not built in the MVP | Keeps the MVP small and within budget without closing off the long-term vision |
| D32 | The TO configures the event context. Players pick it up automatically through the Discord server, or with a link. | Combines the TO's authority with ChatGPT's link-based setup |
| D33 | Adopt ChatGPT's reasoning requirements: fact origin, confirming understanding, revising hypotheses, separating the infraction from intent, no play advice, the unresolved result, citation chains, and the rules for managing golden cases | They are consistent with P2 and with the accuracy target |
| D34 | The PRD lives in this Git repository as `docs/PRD.md`, which is the master copy | Every AI role reads and changes the same version, with history |
| D35 | Post-MVP, with no human judge available (for example at home): the judge gives its best ruling and marks it as uncertain | A useful answer is better than none, as long as the uncertainty is honest |
| D36 | Penalty delivery follows one of five patterns chosen by context (FR-POL-2) | Replaces the fixed "penalty first" order. Learning comes first, except where explaining would escalate. |
| D37 | Integrate with the server's existing ticket bot rather than building ticketing | Matches how the product owner's events already work. Keeps event tooling out of scope (NG1). |
| D38 | About 1,000 golden cases at launch | A larger benchmark, needed to back the 100% target on easy cases |
| D39 | Case records are kept for 7 days, then deleted. Cases worth keeping are exported to the golden set. | Minimal data retention (GDPR). The golden set, not the records, is the lasting source for testing. |
| D40 | One global Admin maps an existing Discord server role to the TO role on each server | Uses roles the server already manages. No separate user administration. |
| D41 | The architect picks the language and the AI model provider. The owner has no preference beyond easy, cheap, and modern. | The owner's stated preference. The architecture has to keep the provider replaceable. |

## 11. Risks

| ID | Risk | Mitigation |
| --- | --- | --- |
| R1 | The easy/hard boundary is hard to pin down, and the 100% target depends on it | The product owner tags every golden case |
| R2 | Budget vs. accuracy: voice plus a strong model may cost more than $20 a month | P2 moves the work to build time; NFR-COST-2 covers what to do under cost pressure |
| R3 | cEDH is multiplayer, and the IPG was written for two players | Policy frameworks are modelled explicitly (D21) |
| R4 | Discord's support for bots receiving voice is limited or unofficial | A feasibility spike comes first (FR-VOICE-1); voice can be dropped |
| R5 | GDPR and voice recording | NFR-PRIV-1 |
| R6 | Community addenda change often (the MTRA had 4 revisions in about 13 months) | Rebuilds are cheap (FR-BUILD-3) |
| R7 | The addenda come in different formats; the Notion page only loads with JavaScript | A documented manual import step is acceptable |
| R9 | Without a penalty history, penalties may not be upgraded | Labelled as the base penalty and copied to human judges (FR-POL-3) |
| R10 | Using Wizards of the Coast's rules text and card data in a published app raises IP questions | To be checked against WotC's Fan Content Policy before any public release (OQ-12) |
| R11 | Two sets of requirements (this PRD and the ChatGPT package) drift apart, and AI roles follow the wrong one | This PRD is the master copy (§0). The ChatGPT files become reference inputs only. |
| R12 | Validating about 1,000 golden cases is a large review load for one person | The product owner expects to be able to produce many cases himself. Also generate cases in families of variants so one review covers several cases, and review hard cases first. |
| R13 | Depending on a third-party ticket bot whose thread format can change, and which may differ between servers | Detecting tickets is behind a pluggable adapter (FR-INT-1); cover it with integration tests on the real bot's threads |

## 12. Open questions

- [x] **OQ-1.** Resolved: the judge gives its best ruling and marks it as uncertain (D35).
- [ ] **OQ-3.** Is the MTRA on TopDeck.gg the same document as the one on Notion? The product owner isn't sure. The build pipeline should compare the two published versions.
- [ ] **OQ-4.** Is the precedence order in §5 correct? The ChatGPT package orders it: event addendum, then MTR, then CR, then IPG, then Oracle. That differs from §5.
- [ ] **OQ-5.** Card data: Scryfall or Gatherer. The architect chooses between the two.
- [x] **OQ-6.** Resolved: players call a judge in the judge channel through the existing ticket bot (FR-INT-1).
- [ ] **OQ-7.** What confidence threshold triggers escalation, and which rule categories always escalate?
- [x] **OQ-8.** Resolved: 50–100 cases a week per TO (NFR-COST-1).
- [ ] **OQ-9.** Partly resolved: text replies within seconds (NFR-LAT-1). Voice target still open.
- [x] **OQ-10.** Resolved: case records are kept for 7 days (D39).
- [ ] **OQ-11.** Partly resolved: about 1,000 golden cases at launch (D38). Easy/hard split still open.
- [ ] **OQ-12.** Does WotC's Fan Content Policy allow using the rules text and card text this way?
- [x] **OQ-13.** Resolved: hybrid investigation (D29).
- [ ] **OQ-14.** Within the MVP, which signals count as "suspected cheating"? The product owner to list them.
- [x] **OQ-15.** Resolved: delivery patterns in FR-POL-2 (D36).
- [x] **OQ-16.** Resolved: one global Admin, who maps an existing Discord server role to the TO role on each server (D40).
- [x] **OQ-17.** Resolved: private messages are allowed for investigations only (D9, FR-INT-3).
- [ ] **OQ-18.** What goes in the tone rubric? For example sample phrasings to use and to avoid, and how to deliver a penalty.
- [x] **OQ-19.** Resolved: use the server's existing ticket bot (D37).
- [ ] **OQ-20.** FR-CTX-1 says the policy framework field allows "no more than one of IPG and/or MTR". Does this mean an event may pick zero or one addendum, and that the addendum can cover the MTR, the IPG, or both?
- [ ] **OQ-21.** What is the existing ticket bot called, and what do its threads look like (title, first message, who gets added)? The product owner to check on his server.
- [ ] **OQ-22.** *(Raised by the architect, 2026-09-25.)* FR-INT-1 and FR-CTX-1 say the ticket bot opens **threads** in a **category**. In Discord, threads belong to a parent channel, and categories contain channels. Does the owner's ticket bot create (a) a new channel per ticket under a category, or (b) a new thread per ticket under a channel? The architecture supports both (ADR-0010). The answer decides which event-context field the TO fills in, and it's needed before spike S2.
- [ ] **OQ-23.** *(Raised by the architect, 2026-09-25.)* Player messages (pseudonymised: seat labels, no Discord names or IDs) are sent to a third-party AI provider (Anthropic, ADR-0002), which may keep API inputs longer than the 7 days in D39 and may process them outside the EU. Is that acceptable? Options: (a) accept, and document it in a privacy notice for players; (b) accept only with the provider's shortest available retention setting; (c) require EU-only processing, which may rule out some providers or models.
- [ ] **OQ-24.** *(Raised by the architect, 2026-09-25.)* The owner has confirmed that build and evaluation AI spend is a budget separate from NFR-COST-1. How large is it? For scale: one full replay of about 1,000 golden cases is estimated at about $45 (ARCHITECTURE.md §9), and spike S3 is planned with a $15 cap.
- [ ] **OQ-25.** *(Raised by the architect, 2026-09-25.)* What share of judge calls are pure rules questions versus disputes, and how many back-and-forth messages does a typical dispute take? The cost model assumes 60% questions and 40% disputes, with about 5 player replies per dispute. At 430 cases a month those assumptions put the baseline at about $29, over the cap (ARCHITECTURE.md §9). The owner's estimate from past events would replace the guess.
- [ ] **OQ-26.** *(Raised by the architect, 2026-09-25.)* NFR-COST-2 asks the architect to propose a way to stay under the cap (see ADR-0012). What should the judge do once the monthly cap is actually reached? Options: (a) hand every new case to human judges, with the intake facts gathered (proposed default); (b) answer rules questions only, on the cheapest model, and hand disputes to humans; (c) allow a set overrun (for example up to 25%) and alert the owner; (d) stop responding until the next month.
- [ ] **OQ-27.** *(Raised by the architect, 2026-09-25.)* FR-Q-4 says the owner approves mnemonics. Must the owner also review each AI-drafted **procedure**, **penalty table row**, and **addendum edit** (about 20 infractions × each framework) before a release? Or are the golden-set gate and release approval (FR-BUILD-3) enough for those? The first is safer and is a large one-off review (R12). The second relies on the golden set covering every procedure branch.
- [ ] **OQ-28.** *(Raised by the architect, 2026-09-25.)* FR-CTX-4 says an event context can be shared "through a link". Hosting on the owner's machine is outbound-only (ADR-0003), so a public web URL would need extra hosting. For the MVP, is a **share code** that a player or server uses with a bot command (for example `/judge join <code>`) acceptable as the "link"? Or must it be a clickable web URL?
- [ ] **OQ-29.** *(Raised by the architect, 2026-09-25.)* AGENTS.md says held-out cases must never be seen by AI roles while building. The architect (and the PM before) have read all 18 current scenarios, so none of them can serve as held-out cases for those roles. Should the held-out set be drawn only from cases created from now on, and kept outside this repository (proposed in ADR-0013)? Who, other than the owner, may create them?
- [ ] **OQ-30.** *(Raised by the architect, 2026-09-25.)* D29 and FR-INV-2 say the AI chooses the next investigation question and words it naturally. On 2026-09-25 the owner chose instead:
    - the next question is chosen **deterministically** from the procedure;
    - it is asked with **pre-written wording approved at build time**, as buttons or choices where possible;
    - AI is used only to interpret free text that can't be matched;
    - rules questions are answered from an **approved rulings library**, and only questions the library doesn't cover get an AI answer, marked as not reviewed (see `docs/architecture/OWNER-ANSWERS.md`, ADR-0008).

  The PM should revise the text of D29 and FR-INV-2 to match, with a decision-log entry. Until then the architecture follows the owner's answer.
- [ ] **OQ-31.** *(Raised by the architect, 2026-09-25.)* The owner is exporting about 2,000 historical questions and answers from the cEDH league's ticket bot, to build scenarios and a held-out set. These are league players' messages, reused for a new purpose (GDPR, NFR-PRIV-1). What does the owner want to do?
    - (a) pseudonymise by script, and store privately outside this public repository (ADR-0017 §4). This is the minimum in all cases;
    - (b) also tell league players, for example with a note in the league server, that past tickets are used anonymously to build the AI judge;
    - (c) also offer an opt-out.

  How long is the private copy kept? Given D39's 7-day rule for live records, should the raw export be deleted once pseudonymised scenarios have been made from it?
- [ ] **OQ-32.** *(Raised by the architect, 2026-09-26.)* Where is the line between explaining a rule and play advice (FR-RUL-8)? The owner decided on 2026-09-26:
    - at **Competitive REL**, answers state what is legal and what happens, never why a player might want to do it;
    - at **Regular REL (JAR)**, the judge may explain to a player that an action won't achieve what they seem to be trying to do.

  The PM should reflect this in FR-RUL-8 and in the tone rubric (OQ-18). The architecture already supports it with per-REL answer templates (ADR-0014).
- [ ] **OQ-33.** *(Raised by the architect, 2026-09-26.)* The owner wants poorly written and transcribed questions to lead to answers as good and clean as for well-written ones, and wants this tested seriously (ADR-0018). What should the release gate require of the robustness suite? The architect proposes:
    - **zero "confidently wrong"** results, where messy input is resolved to a different question without asking;
    - thresholds, to be set by the owner, for **canonical accuracy** (messy input gives the same canonical question) and for the **clarification rate** (how often the judge has to ask), per noise severity level and for real human and speech variants.
- [ ] **OQ-34.** *(Raised by the architect, 2026-09-27.)* The owner decided on an intake procedure that the PRD doesn't describe yet (ADR-0019):
    - the judge asks "Tell me what happened, step by step", addressed first to the player who made the call, or, if everyone agrees, to the player who matters most on their own initiative;
    - it follows along until a question is formulated or arises, or the players go silent;
    - then it asks "So, what is your question?" or, if the tone suggests it, "So, how can I help you?"

  The PM should add this as a functional requirement (near FR-INT and FR-RUL-1/5) and extend P3's greeting. Clarified by the owner on 2026-09-27: "silence" means the story is wrapped up (e.g. "and that's when we called you over", "and that's where we are now"), not a timed pause. Open detail for the owner: a safety net for a stalled narration (proposed: after 3 minutes without a wrap-up, a gentle "Take your time. Is there more to the story, or shall we look at your question?").
