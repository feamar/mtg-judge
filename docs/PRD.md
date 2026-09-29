# AI MTG Judge — PRD v0.5

Product owner: Frank · Status: Draft for review · Last updated: 2026-09-28 (v0.2: owner answers from the architecture phase, D42–D56; v0.3: integrity and remedy rules, D57–D59; v0.4: further owner answers, D60–D65; v0.5: D66, easy/hard tags accepted)

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
    - **Tone:** precise, very friendly, and customer-centric in its wording and its approach. Its stance, in the product owner's words: *"I am here to help"* and *"I am here to help you follow the rules."* When it arrives at a case, the judge opens with a greeting in the product owner's style, such as *"Players! What is going on?"* or *"Players! What can I do to help?"* It uses this greeting for **disputes only**. A single player's rules question gets a direct answer. Unlike a floor judge, the bot usually knows the reported issue before it speaks, so its greeting SHOULD acknowledge the ticket's description (for example, *"Players! I see there's a question about a missed trigger. What happened?"*). After the greeting it asks the player who made the call to tell what happened, step by step (FR-INT-4). It SHOULD fall back on the stance phrases whenever a player seems defensive or upset.
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

**Precedence** (D61). There are two separate layers, which never override each other:

- **Game rules:** Oracle card text over the CR where they directly contradict (CR 101.1).
- **Tournament policy:** the event's addendum over the MTR and IPG.

Policy documents never change game rules. In the MVP there are no event-specific policies (FR-CTX-5 is Post-MVP).

**MTRA sources:** the MTRA on TopDeck.gg and the MTRA on Notion are treated as **different documents**. An event names the one it uses (D60).

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

- **FR-CTX-1.** A user with the TO role can create an event context with these fields: name, format (MVP: cEDH only), REL (MVP: Competitive only), policy framework (zero or one addendum, which may amend the MTR, the IPG, or both; D42), the judge role, the TO role, the judge-only channel, the player channels, the ticket source (for the Tickets bot in thread mode: the panel channel its ticket threads are opened under, and the bot's user ID; D43), the escalation threshold (default: more severe than a Warning; D56), the integrity mode (default: presume good faith; D58), the event policies (FR-CTX-5, Post-MVP), and the language (MVP: English only).
    - AC: Given a user who does not have the TO role, when they try to create or edit a context, then the bot refuses.
- **FR-CTX-2.** Every ruling made in a Discord server follows that server's event context. If a server has no context (during the MVP), the judge only answers rules questions and says that it can't rule on penalties. After the MVP it will assume a 1v1 game context.
- **FR-CTX-3.** The bot MUST NOT store or compute pairings, standings, points, or timers (NG1).
- **FR-CTX-4.** An event context can be shared. Players in the event's Discord server get the context automatically. Anywhere else, they join it with a **join code** used with a bot command (for example `/judge join <code>`); no web URL is needed in the MVP (D48). Only the TO can change a context; a join code gives read access only (D32).
- **FR-CTX-5. Event policies.** `[Post-MVP]` (D61: no event-specific policies in the MVP). The TO can add **event policies** to the event context: written local rulings that amend **tournament policy only** (MTR, IPG, or the event's addendum), never game rules (CR, Oracle). The judge applies an event policy when its conditions hold, and cites it as *"Event policy (set by the TO)"*. The judge never softens a ruling by its own discretion; discretion the TO wants applied must be written down as an event policy (D55).
    - AC: Given the policy "online league: players who concede at instant speed while an opponent presents a win line are not dropped" and such a concession, when the judge answers, then it says nobody is dropped and cites the event policy.
    - AC: Given an event policy that points at a CR rule, when the TO saves it, then the bot refuses.
- **FR-CTX-6. Event-management consequences go to the TO.** When policy points to an event-management action (dropping a player, re-entry, a changed result) and no event policy covers it, the judge MUST NOT carry it out or announce it. It gives players the game result and a neutral note that the TO has been informed, and sends the facts, the policy text, and the question to the TO in the judge-only channel (D55, NG1).
- **FR-ADM-1.** There is one global Admin (the product owner). On each server, the Admin chooses which existing Discord server role counts as the TO role. Every member of that role is a TO for that server. Only a TO can create or edit an event context (D40).
    - AC: Given a user who is not an Admin, when they try to grant or revoke the TO role, then the bot refuses.

### 6.2 Interaction

- **FR-INT-1.** A judge call opens a **ticket**: a separate thread for that case. The thread contains the player's description of the issue, the players who reported it, and every judge and TO of the event. The judge takes part in that thread. Tickets are created by the server's **existing ticket bot**, which opens a thread in the server's ticket section (D37). Players call a judge the way they do today, from the judge channel. The judge never creates tickets: it detects new ticket threads under the channel set in the event context and joins them. The owner's server uses the **Tickets** bot (tickets.bot) in thread mode: each ticket is a private thread under the panel channel (D43). How it detects tickets MUST be pluggable, because other servers may use a different ticket bot.
- **FR-INT-2.** More than one player can take part in a case. The judge knows who each message comes from.
- **FR-INT-3.** The judge MAY message a player privately to **investigate**, for example to question players separately. It never uses a private message to **resolve** an issue. Remedies and other private steps, such as showing hidden cards to one opponent, are carried out by instructing the players at the table.
    - AC: Given a Hidden Card Error under the MTRA, when the remedy runs, then the judge tells the infracting player to show the set only to the opponent furthest from the active player in turn order, tells that opponent to make the choice, and tells everyone the choice may not be discussed. No private message is used for the remedy.
- **FR-INT-4. Narration intake.** Unless the opening message already contains a clear question, the judge asks the players to tell what happened, **step by step** (D54):
    - it addresses **the player who made the call** first. If another player takes the initiative ("I'll explain the situation") and everyone agrees, that player explains instead;
    - it **follows along without interrupting**, keeping each player's statements as that player's own claims, and saves clarifying questions until the narration ends;
    - narration ends when a **question is formulated**, when **one arises** (for example another player contradicts the account, an infraction becomes apparent, or a claim needs checking), or when the story is **wrapped up** (for example "and that's when we called you over", "and that's where we are now"). A pause alone never ends it;
    - after a wrap-up without a question, the judge asks *"So, what is your question?"*, or *"So, how can I help you?"* if the tone suggests confusion or frustration;
    - if a narration stalls for 3 minutes without a wrap-up, the judge asks gently: *"Take your time. Is there more to the story, or shall we look at your question?"*
    - AC: Given a narration with a 40-second pause mid-story that ends with "and thats when we called you over", when the judge follows along, then it says nothing during the pause and asks its prompt only after the wrap-up.
    - AC: Given another player offers "I'll explain" and everyone agrees, when narration starts, then that player is the narrator and the caller's later messages are kept as the caller's own claims.

### 6.3 Rules questions

- **FR-Q-1.** The judge answers rules questions using the CR and Oracle card text. Every answer cites the relevant CR rule numbers and explains the reasoning (P1). Answers come first from the **approved rulings library**, built at build time and approved by the owner: concept explanations, answering strategies based on card features, and official Wizards card rulings (D50).
- **FR-Q-2.** When a card name is ambiguous or misspelled, the judge confirms which card is meant before answering.
- **FR-Q-3.** The judge MAY answer questions about MTR and addendum procedures (for example, "How many points is a draw worth?"), but never applies them to real event data (NG1).
- **FR-Q-4.** For complicated concepts (for example layers, priority, copy effects), the judge explains with a useful mnemonic or simple model where one exists, instead of listing every rule. The full citations stay available if a player asks for them.
    - AC: Given a question about layers, when the judge explains, then the answer uses a short mental model and cites only the rules that decide this particular case.
    - The build pipeline curates the set of mnemonics, and the product owner approves it (P2).
- **FR-Q-5.** During a game, the judge gives the **minimum explanation** the players need to understand the situation and carry on. Outside a game, it can go deeper. Its internal reasoning can be far more detailed than what it tells the players. (The *priority* scenario is the reference example.)
- **FR-Q-6. Library miss.** A rules question the approved library doesn't cover gets an AI answer that cites only retrieved rules and card text, passes the verifier, and is visibly **marked as not reviewed**. If it can't be verified, the result is *unresolved* and the case is escalated (FR-RUL-9). Every miss is logged so it can become a scenario and then a library entry (D50).

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
- **FR-RUL-8. No play advice and no revealing hidden information.** The judge MUST NOT give play advice, and MUST NOT reveal information to a player who isn't entitled to it. At **Competitive REL** an answer states what is legal and what happens, never why a player might want to do it. At **Regular REL (JAR)** the judge MAY tell a player that an action won't achieve what they seem to be trying to do (D52).
- **FR-RUL-9. "Unresolved" is a valid result.** If the governing rules and policy text don't settle a necessary point, the judge returns an explicit *unresolved* result and escalates (FR-ESC). It MUST NOT make up a ruling. This counts as a success, not a failure.

### 6.5 Infractions and penalties

- **FR-POL-1.** The judge identifies the infraction and applies the penalty and fix defined by the IPG, as modified by the event's policy framework. Choosing the penalty is deterministic: a lookup from the infraction to its penalty, with no AI judgment involved. The judge **issues** a penalty itself only up to a **Warning**. A more severe base penalty (after the framework) is only **recommended** to a human judge (FR-ESC-1 f, D56).
    - AC: Given an MTRA event and a Deck Problem where the IPG path would lead to a Game Loss, when the judge applies the penalty, then it issues a Turn Skip.
- **FR-POL-2.** How a penalty is delivered depends on context (D36). The judge picks one of these patterns:
    - **Explain, then penalty.** When the explanation helps the player learn and shows *why* the penalty is given. The product owner expects this in a high share of cases.
    - **Penalty, then explain.** The P1 exception: state the penalty, then teach.
    - **Ruling, explain, ruling again.** State the ruling, explain it, then restate it so there's no doubt.
    - **Summary, explain, exact ruling.** Describe the ruling in plain words, explain it, then give the exact ruling and penalty.
    - **Penalty only, no explanation.** When the penalty is harsh and explaining it is likely to escalate the player's reaction. This is rare at Competitive REL.
    - AC: Each golden case that involves a penalty records the expected pattern, and the judge's choice is tested against it.
- **FR-POL-3.** In the MVP, the judge has no penalty history across the event. Every penalty it issues (Warning or less) is labelled as the **base penalty, assuming no earlier infractions**, and a copy goes to the judge-only channel so human judges can apply any upgrades.
- **FR-POL-4. Remedy authority.** The judge may itself apply only **simple backups that the policy permits** and **prescribed partial fixes**, without asking for authorisation each time. It MUST NOT execute a **full backup**: every full backup is handed off to a human judge (FR-ESC-1 g, D57).
    - AC: Given a situation whose remedy is a full backup, when the judge rules, then it hands off without performing any part of the backup.

### 6.6 Investigation procedures

- **FR-INV-1.** For each infraction, the build pipeline produces a **procedure** from the IPG and all policy frameworks. A procedure lists: the facts needed, the question that establishes each fact, which player each question or instruction is addressed to, when to stop, and the remedy.
    - AC: No procedure, penalty-table row, or addendum edit drafted by AI is released before the owner has reviewed and approved it (FR-BUILD-4).
- **FR-INV-2.** At run time the judge investigates **deterministically** (D50, which supersedes D29). The build-time procedures define, for each possible ruling branch, which facts decide it. The judge keeps every matching procedure open and asks only a fact whose answer would change the ruling, the fix, the penalty, or whether to escalate, chosen by the procedure's priority. It asks with **pre-written wording approved at build time**, as buttons or choices where possible. AI is used only to interpret a free-text answer that can't be matched. It MUST NOT skip a fact that decides the ruling, and it doesn't work through a fixed checklist. Every question is recorded with the procedures it serves and why the answer matters.
    - AC: A golden case can check that the judge asked for each required fact before ruling.
- **FR-INV-3.** The judge asks about the state of the game **only when the procedure needs it**: seat and turn order, the active player, who has been eliminated, the contents of zones. It never collects the full board state up front.

### 6.7 Escalation and handoff

- **FR-ESC-1.** The judge escalates when any of these happens:
    - (a) *withdrawn (D62): there is no confidence threshold. The judge escalates on the concrete triggers below.*
    - (b) the case falls in a category marked as **always escalate**. The owner adds categories to that list as they are encountered (D62);
    - (c) a player contests the ruling, or asks for a human judge. That handoff happens regardless of any integrity assessment or setting (D59);
    - (d) it suspects cheating (Competitive REL only);
    - (e) it can't resolve contradictory accounts;
    - (f) the infraction's base penalty, after the event's framework, is **more severe than a Warning** (a major infraction). The bot works like a floor judge handing off to the head judge. It detects and investigates, announces no penalty to players, and hands off the candidate infraction and base penalty as a **recommendation**. At MTRA events this includes Turn Skips (D56);
    - (g) the remedy would be a **full backup** (FR-POL-4, D57).
- **FR-ESC-2.** Before it escalates, the judge MUST gather every fact that is useful and cheap to collect (D12).
- **FR-ESC-3.** The handoff goes to the judge-only channel and contains: a case summary, the facts established, the facts in dispute, the relevant citations, the judge's provisional reading, and why it escalated.
- **FR-ESC-4.** When the judge suspects cheating, it writes **investigation notes** that are visible only to judges and the TO: the signals it saw, the inconsistencies, and suggested lines of questioning. Players MUST NOT see these notes, and the judge MUST NOT say anything to players that reveals the suspicion. The judge stops asking questions once more questions could compromise a human judge's investigation. It then tells the players neutrally to wait for a human judge and not to continue the relevant game actions. A neutral integrity question (for example *"Was anything discussed or agreed before the concessions?"*) is asked **only when something else already looks off**, never routinely (D56).
    - **Integrity categories** (D59):
        - *permitted or not relevant*, for example not reminding an opponent of their trigger: no integrity step at all;
        - *ordinary error*: good-faith handling, with the necessary factual checks. Missing facts are asked for, because a good-faith presumption can't supply them;
        - *strong indicators*: a **mandatory protected handoff** to a human judge, whatever the integrity mode or table support.
      Not strong on its own: an ordinary error, a detrimental missed trigger, a repeated error count, another player's refusal or disagreement, not reminding an opponent of their trigger. A handoff is **never a finding of guilt**.
    - **Integrity mode** (D58), set by the TO:
        - *presume good faith* (the default);
        - *request table confirmation*: the judge asks *"Can the other players confirm the described sequence, or add any specific facts we have missed?"* and records the reports.
      Peer reports may support good faith, but can't prove intent or override strong indicators. They aren't a vote, and declining never implies guilt.
    - AC: Given the same strong-indicator case under both integrity modes, with unanimous table support, when the judge responds, then it hands off in both modes.
    - AC: Given an ordinary error and a player who declines to confirm in table-confirmation mode, when the judge rules, then it applies the ordinary ruling and doesn't treat the refusal as guilt.
    - AC: Given a suspected Cheating case, when the handoff is sent, then no message in any player channel or DM contains the suspicion or the reasoning behind it.
- **FR-ESC-5.** While a case is escalated, the judge tells the players, with the owner's neutral handoff message: *"Please pause the game and call a human Judge. Keep the current game state unchanged until they arrive."* The message never contains the reason for the handoff (D59).

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
- **FR-BUILD-4.** Every AI-drafted procedure, penalty-table row, addendum edit, library entry, and answering strategy is reviewed and approved by the product owner before its first release. After that, only the ones that changed are reviewed (D47).

## 7. Non-functional requirements

| ID | Requirement | Target / rule |
| --- | --- | --- |
| NFR-ACC-1 | Accuracy on easy cases | 100% of golden cases tagged *easy* pass |
| NFR-ACC-2 | Behaviour on hard cases | Up to about 2% of real cases may be escalated. An escalated case must still arrive with its facts gathered (FR-ESC-2). |
| NFR-ACC-3 | No invented citations | Every citation resolves to a real section in the source version currently loaded |
| NFR-COST-1 | Running cost | Under $20 a month at pilot volume: one TO with 50–100 cases a week, or about 200–430 a month. That leaves roughly $0.05–0.10 per case for everything: hosting, AI model calls, and speech-to-text. The cap covers the **live bot** only. Building and testing run within the owner's Claude Pro subscription, with no paid API spend (D45). The owner estimates about 75% of calls are rules questions (OQ-25). |
| NFR-COST-2 | Degrading under cost pressure | There must be a way to keep costs under the cap (the architect proposes it). When the monthly cap is reached, the judge answers **rules questions only**, on the cheapest model, and hands disputes to human judges (D46). |
| NFR-AVAIL-1 | Availability | The bot runs around the clock. Events usually run for a month, so judge calls can come at any time. Brief restarts are acceptable, but a ticket opened during an outage MUST be picked up when the bot comes back. |
| NFR-LAT-1 | Response time | Text: every reply within seconds (single digits). Voice: **under 1 second** if voice ships (D63); spike S1 measures how close local transcription gets. |
| NFR-I18N-1 | Ready for other languages | No user-facing text or prompt is hard-coded in English. Language is a setting in the event context. Terms defined in the CR, MTR, or IPG are never translated. |
| NFR-PRIV-1 | GDPR | The product owner is in the EU. Consent before any voice capture, case records deleted after 7 days (D39), and deletion on request. Pseudonymised player text (seat labels, no Discord names) may be processed by a third-party AI provider, which may keep it longer and outside the EU; a short privacy notice for players is recommended (D44). Historical league tickets used for scenarios are pseudonymised by script, stored outside the public repository, and the raw export is deleted once the scenarios exist (D51). |
| NFR-VER-1 | Traceability | Every ruling records the system version and the version of each source document |
| NFR-TECH-1 | Technology choice | The architect chooses the programming language and the AI model provider. The language must be modern, mainstream, and well supported by Discord libraries. The provider must be easy to use and cheap enough for NFR-COST-1. The provider MUST be replaceable without changing ruling logic (D41). |
| NFR-EXT-1 | Room to grow | Format, REL, policy framework, front end, and input type are all pluggable. None of them is hard-coded. |
| NFR-TONE-1 | Tone (P3) | Every reply is precise, friendly, and customer-centric. No sarcasm, no blaming wording, no judgement of a player's character. The tone standard is set by **examples**: the P3 stance phrases, the owner's own wording (for example the neutral handoff message, D59), and the approved answer templates, each reviewed by the owner when approved (FR-BUILD-4, D65). |
| NFR-ROB-1 | Robustness to messy input | Poorly written and transcribed questions (typos, slang, nicknames, speech errors) lead to answers as good and clean as for tidy input: the same understood question, and the same answer. The judge may ask a clarifying question, but must never resolve messy input into a different question without asking. **Release gate: zero "confidently wrong" results.** There is no accuracy threshold. If a simple, fast language model can decipher the input, that's fine; otherwise the judge **asks the player to rephrase** (D53, D64). |
| NFR-IMP-1 | Impartiality and consistency (P3) | The same facts give the same ruling, whoever reports them, in whatever order, and however they are worded. Golden-set variants test this by swapping who reports, the order of events, and the wording. |

## 8. Quality measurement

The **golden test set** is the definition of correct. It is the benchmark for every AI role and every release. It lives in [`golden/`](../golden/).

- **What goes in (D23):**
    - real cases the product owner has judged;
    - hard scenarios an AI generates from the CR, MTR, IPG, and addenda.
    - A generated case counts only after the product owner signs it off.
    - scenarios the product owner gives directly (prefixed `SCN:`), and imported sets the owner has verified (for example the 100 Judge Lab CR regression cases);
    - public rules Q&A may be used as development material only, never held out.
- **What each case records:** the input conversation, the event context, the *easy* or *hard* tag, the expected ruling, penalty, and fix, the required citations, the facts the judge must ask for, and whether it should escalate.
- **Easy vs. hard:** the product owner tags each case. As of 2026-09-28, all 348 cases are tagged: 240 easy, 108 hard (D66). A case is *hard* if it involves a complex rules interaction (for example layers or replacement effects), a long investigation, or rebuilding a complex board state. Everything else is *easy*.
- **Release gate:** 100% of easy cases pass, the escalation behaviour on hard cases matches what's expected, the robustness suite has zero confidently wrong results (NFR-ROB-1), and the product owner approves.
- **Feedback loop:** real case records (FR-LOG-3) are reviewed and turned into new golden cases.
- **Launch target size:** about 1,000 cases (D38). Most will have to be AI-generated and then validated by the product owner (see R12). The split between easy and hard cases is still open (OQ-11).

**Case format and management** (adopted from the ChatGPT package)

- **Citation chain.** Every material step of a ruling is written down as **source → proposition → consequence**: the exact rule, policy section, or Oracle text; what it establishes in this game state; and how that changes the ruling, the fix, the penalty, or the next question. Tests check these intermediate steps as well as the final answer.
- **Validation status.** A case is marked **SOURCE CHECK REQUIRED** until the product owner has checked its citations. Only validated cases can block a release.
- **Variants.** Case families change one fact that matters, to prove the judge takes a different ruling branch (for example, the variants of the One Ring scenario).
- **Separate sets.** Development, regression, and held-out evaluation sets are kept apart. Held-out cases are never shown to the AI roles while they build. Cases the AI roles have already read can't be held out; the held-out set comes from **new** cases, written in separate case-author sessions and stored **outside this repository** (D49).
- **Structured data.** Cases are stored as machine-readable data (concepts, REL and policy framework, source versions, required questions, expected intermediate steps, expected outcome, validation status, where the case came from). A readable Markdown view is also produced.
- **Staleness.** When a source document changes, every case that cites a changed section is flagged for revalidation.
- **Current state (2026-09-28):** 348 structured cases in `golden/cases/`, all validated by the owner (see `golden/README.md`): the 18 original scenarios converted, 100 Judge Lab regression cases, 207 Judge Lab expansion cases (106 of them Legacy, which is post-MVP), owner `SCN:` scenarios, and variants. All have been read by AI roles, so a held-out set (D49) is still needed before release.
- **Starting set (historical):** the 18 scenarios from the ChatGPT package. 11 are validated. 7 are SOURCE CHECK REQUIRED: Wheel of Fortune/Flare, Judge what is priority, Etali, the three Kinnan cases, and the forgotten untap. (The priority case is marked validated in its own file but not in the index. That needs to be reconciled.) They need to be converted to the multiplayer cEDH context where that applies, and tagged easy or hard.

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
| Approved rulings library | Build-time answers approved by the owner: concept explanations, answering strategies based on card features, and official card rulings. Rules questions are answered from it first (FR-Q-1). |
| Event policy | `[Post-MVP]` A written local ruling set by the TO in the event context. It amends tournament policy only, never game rules (FR-CTX-5). |
| Major infraction | An infraction whose base penalty, after the event's framework, is more severe than a Warning. It is handed to a human judge (FR-ESC-1 f). |
| Integrity mode | The TO's setting for how ordinary errors are handled: presume good faith (default), or request table confirmation. It never changes the handoff of strong indicators (FR-ESC-4). |
| Narration intake | The judge asks the players to tell what happened, step by step, and follows along until a question emerges or the story is wrapped up (FR-INT-4). |

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
| D29 | *Superseded by D50 (2026-09-27).* Hybrid investigation. Build-time procedures define which facts decide each ruling branch. The AI chooses the next question from its hypotheses and words it naturally. | P2. Repeatable and testable. *Confirmed on 2026-09-25.* |
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
| D42 | An event selects zero or one addendum, which may amend the MTR, the IPG, or both (OQ-20) | Confirms the assumed default; one policy framework per event (D21, NG4) |
| D43 | The owner's server uses the Tickets bot (tickets.bot) in thread mode: a private thread per ticket under the panel channel (OQ-21, OQ-22) | The facts of the owner's server. Detection stays pluggable for other bots. |
| D44 | Pseudonymised player text may be processed by a third-party AI provider, including longer retention and processing outside the EU (OQ-23) | Needed for the AI fallback; privacy is limited by seat labels, and a player notice is recommended |
| D45 | Building and testing run within the owner's Claude Pro subscription, with no paid API spend, including no paid cross-check against the live API. The $20 cap covers the live bot only (OQ-24). | The owner's budget. Accepted trade-off: tests reach the same models by a different route than production. |
| D46 | When the monthly cost cap is reached, the judge answers rules questions only, on the cheapest model, and hands disputes to human judges (OQ-26) | Keeps the most common help available without breaking the budget |
| D47 | The owner reviews and approves every AI-drafted procedure, penalty-table row, addendum edit, library entry, and answering strategy before first release; afterwards only changed ones (OQ-27) | These artifacts decide rulings deterministically, so an error would repeat in every case |
| D48 | Event contexts are shared with a join code, not a web URL, in the MVP (OQ-28) | No inbound hosting needed on the owner's machine |
| D49 | The held-out set comes from new cases, written in separate case-author sessions and stored outside this repository (OQ-29) | The AI roles have read all existing cases; held-out must stay unseen |
| D50 | The judge is deterministic, with AI only at the edges. Rulings come from build-time, owner-approved data: an approved rulings library (concepts, answering strategies over prefetched card features, official card rulings) and procedures. Investigation questions are chosen by the procedure and worded in advance (buttons where possible). AI only interprets unmatched free text and answers library misses, marked as not reviewed. Supersedes D29 (OQ-30). | P2 taken further, at the owner's direction: "most of these scenarios shouldn't be using AI at all". Cheaper, consistent, and testable without AI. |
| D51 | About 2,000 historical league tickets may be used for scenarios. The TO agreed; no player notice and no opt-out; pseudonymised by script; the raw export is deleted once scenarios exist (OQ-31). | Real questions are the best test material; minimal retention |
| D52 | The play-advice line depends on the REL: at Competitive REL, only what is legal and what happens; at Regular REL, the judge may say an action won't achieve what the player wants (OQ-32) | Competitive play must stay unassisted; casual play benefits from teaching |
| D53 | Messy input must lead to answers as good and clean as tidy input. The release gate requires zero confidently wrong results; accuracy thresholds are to be explored together (OQ-33). | The owner's requirement: "pretty bad text should lead to as good and clean an answer as possible" |
| D54 | Narration intake: "tell me what happened, step by step" to the caller (or an agreed volunteer); the judge follows along until a question is formulated or arises, or the story is wrapped up, then asks "So, what is your question?" or "So, how can I help you?"; a 3-minute safety net for stalled narrations (OQ-33, OQ-34) | Helping players explain beats interrogating them, and replaces a limit on clarifying questions |
| D55 | *Event-policy part moved to Post-MVP by D61.* TO-set event policies amend tournament policy only and are applied and cited; event-management consequences (drops, re-entry) not covered by one are referred to the TO, never announced by the judge (OQ-35) | The owner's league softens some rulings by discretion; the AI must not invent discretion (FR-RUL-9) and must not manage events (NG1) |
| D56 | The bot works like a floor judge: it issues penalties only up to a Warning; major infractions (more severe than a Warning after the framework, including MTRA Turn Skips, and any suspected cheating) are detected, investigated, and handed to a human judge as a recommendation. The neutral integrity question is asked only when something looks off (OQ-36; OQ-7 and OQ-14 in part). | "We are mostly here to help, not dish out punishment", while still detecting punishable situations. Modelled on floor-judge practice; MTR 1.7 and IPG 1 support the head judge's role but don't reserve these penalties. |
| D57 | Remedy authority: the bot applies only simple backups the policy permits and prescribed partial fixes; every full backup is handed off to a human judge (FR-POL-4). | Adopted by the owner on 2026-09-28 from the Judge Lab bundle's rules. A full backup is the most disruptive remedy and needs a human. |
| D58 | Each event has an integrity mode set by the TO: presume good faith (default) or request table confirmation. Peer reports can support good faith, but can't prove intent, override strong indicators, or act as a vote; declining never implies guilt. | Adopted by the owner on 2026-09-28. Lets TOs choose how much the table is involved, without letting the table decide integrity. |
| D59 | Integrity categories: permitted/not relevant, ordinary error (good-faith handling), strong indicators (mandatory protected handoff). Strong indicators, full backups and player requests for a human judge are always handed off, whatever the settings. A handoff is never a finding of guilt. The neutral player message is the owner's: "Please pause the game and call a human Judge. Keep the current game state unchanged until they arrive." | Adopted by the owner on 2026-09-28 from the Judge Lab bundle; answers the core of OQ-14. "We are mostly here to help": ordinary mistakes stay ordinary. |
| D60 | The MTRA on TopDeck.gg and the MTRA on Notion are treated as different documents; an event names the one it uses (OQ-3). | The owner's instruction: assume they are not the same. |
| D61 | Precedence has two separate layers: Oracle over the CR (CR 101.1) for game rules, and the addendum over the MTR/IPG for tournament policy. There are no event-specific policies in the MVP, so FR-CTX-5 becomes Post-MVP; referring drops to the TO (FR-CTX-6) stays (OQ-4). | The owner: "There should not be specific event policies in the MVP, the addenda overwrite the standard documents." |
| D62 | No confidence threshold for escalation. "Always escalate" categories are added to a list as they are encountered (OQ-7, OQ-14). | A deterministic judge has no meaningful confidence score; concrete categories are testable. |
| D63 | Voice latency target: under 1 second (OQ-9). | The owner's target. It's ambitious for local transcription; spike S1 measures it and the owner decides with the numbers. |
| D64 | Messy input: if a simple, fast language model can decipher it, that's fine; otherwise the judge asks the player to rephrase. There's no accuracy threshold; zero "confidently wrong" stays the release gate (OQ-33). | Cheap, and honest with the player. |
| D65 | The tone rubric is covered by examples: the P3 stance phrases, the owner's own wording, and the approved templates (OQ-18). | The owner considers the tone covered by the examples already given. |
| D66 | The proposed easy/hard tags are accepted: 240 easy, 108 hard among the 348 golden cases, following the §8 definition (OQ-11). | The owner accepted the proposal; the 100% release target applies to the easy cases. |

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
- [x] **OQ-3.** Resolved: treated as different documents (D60).
- [x] **OQ-4.** Resolved: two separate precedence layers; no event-specific policies in the MVP (D61).
- [x] **OQ-5.** Resolved by the architect: Scryfall bulk data, with Gatherer authoritative (ADR-0006).
- [x] **OQ-6.** Resolved: players call a judge in the judge channel through the existing ticket bot (FR-INT-1).
- [x] **OQ-7.** Resolved: no confidence threshold; always-escalate categories are added as they are encountered (D62). Major infractions already always escalate (D56).
- [x] **OQ-8.** Resolved: 50–100 cases a week per TO (NFR-COST-1).
- [x] **OQ-9.** Resolved: text within seconds (NFR-LAT-1); voice under 1 second (D63).
- [x] **OQ-10.** Resolved: case records are kept for 7 days (D39).
- [x] **OQ-11.** Resolved: about 1,000 golden cases at launch (D38); tags accepted, 240 easy and 108 hard of the current 348 (D66).
- [ ] **OQ-12.** Does WotC's Fan Content Policy allow using the rules text and card text this way? Research (2026-09-28) of the policy (last updated 2017-11-15): it's written for fan art, videos, websites, and similar. Its conditions are: free access (no payments, subscriptions, or required registration); no Wizards logos or trademarks; the required notice *"[Title] is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC."*; and no implied endorsement. It **excludes verbatim copying**, and says **game mechanics** may not be incorporated without written permission. It doesn't address rules-reference tools specifically. **To settle before any public use**, not for the design: whether quoting CR and Oracle text counts as "verbatim copying", and whether to ask Wizards. Until then, the MVP keeps quotations short, cites rule numbers, links to the official sources, uses no logos or card images, stays free, and shows the notice. This is not legal advice. **Status 2026-09-28:** the owner has sent a message to WotC; open until they reply.
- [x] **OQ-13.** Resolved: hybrid investigation (D29).
- [x] **OQ-14.** Resolved: integrity categories, including what is *not* strong on its own; strong indicators force a protected handoff (D59, FR-ESC-4). Concrete strong indicators are defined case by case in the integrity test cases.
- [x] **OQ-15.** Resolved: delivery patterns in FR-POL-2 (D36).
- [x] **OQ-16.** Resolved: one global Admin, who maps an existing Discord server role to the TO role on each server (D40).
- [x] **OQ-17.** Resolved: private messages are allowed for investigations only (D9, FR-INT-3).
- [x] **OQ-18.** Resolved: covered by examples (D65, NFR-TONE-1).
- [x] **OQ-19.** Resolved: use the server's existing ticket bot (D37).
- [x] **OQ-20.** Resolved: zero or one addendum, which may amend the MTR, the IPG, or both (D42).
- [x] **OQ-21.** Resolved: the Tickets bot (tickets.bot) in thread mode (D43).
- [x] **OQ-22.** Resolved: a thread per ticket, under the panel channel (D43).
- [x] **OQ-23.** Resolved: accepted (D44).
- [x] **OQ-24.** Resolved: building and testing run within the owner's Claude Pro subscription, with no paid API spend (D45).
- [x] **OQ-25.** Resolved: the owner estimates about 75% rules questions (NFR-COST-1). The league data will measure it.
- [x] **OQ-26.** Resolved: rules questions only, on the cheapest model; disputes go to human judges (D46).
- [x] **OQ-27.** Resolved: the owner reviews every drafted procedure, penalty row, addendum edit, library entry, and strategy (D47, FR-BUILD-4).
- [x] **OQ-28.** Resolved: a join code (D48, FR-CTX-4).
- [x] **OQ-29.** Resolved: new cases, written in separate case-author sessions and stored outside this repository (D49).
- [x] **OQ-30.** Resolved: a deterministic judge with an approved rulings library; D29 is superseded (D50, FR-INV-2, FR-Q-1, FR-Q-6).
- [x] **OQ-31.** Resolved: the TO agreed; no player notice and no opt-out; the raw export is deleted once scenarios exist (D51).
- [x] **OQ-32.** Resolved: the play-advice line by REL (D52, FR-RUL-8).
- [x] **OQ-33.** Resolved: a simple, fast model where it can; otherwise ask the player to rephrase; zero confidently wrong stays the gate (D64, NFR-ROB-1).
- [x] **OQ-34.** Resolved: narration intake with wrap-up detection and a 3-minute safety net (D54, FR-INT-4).
- [x] **OQ-35.** Resolved: event policies and referral of event-management consequences to the TO (D55, FR-CTX-5, FR-CTX-6).
- [x] **OQ-36.** Resolved: floor-judge model, handoff threshold more severe than a Warning (D56, FR-ESC-1 f, FR-POL-1).
- [ ] **OQ-37.** *(Planner, 2026-09-28.)* Which policy frameworks does the MVP support? §9 lists the Portuguese addendum and the MTRA as MVP options, while the planner's handover says MTRA only. Of the 68 policy golden cases, 59 use plain MTR + IPG (no addendum, allowed by D42) and 9 use the MTRA. **Owner's answer (2026-09-28): the MTRA (Notion version, D60) and plain MTR + IPG; the Portuguese addendum moves to post-MVP.** For the PM to fold into §3, §4, §5 and §9, with a decision-log entry.
- [ ] **OQ-38.** *(Planner, 2026-09-28.)* Do the Legacy (1v1) golden cases with integrity-mode expectations gate the MVP release? 29 of the 38 integrity cases are Legacy; 5 are in MVP scope; 4 are Regular REL. **Owner's answer (2026-09-28): yes, the 29 Legacy integrity cases gate the release,** so the gate covers 2-player contexts in testing, while the product's event contexts stay cEDH only (FR-CTX-1). Still open: whether the 4 Regular REL integrity cases gate (the planner proposes no, since JAR is post-MVP). For the PM to fold into §8.
- [ ] **OQ-39.** *(Planner, 2026-09-28.)* 37 imported Judge Lab policy cases (33 in the release gate) are written to "the app" in the third person (for example "What must the app establish before selecting the Missed Trigger remedy?"). They aren't player text, so the deterministic suite can't run them from raw text through the matcher (ADR-0013 §2). How do they count toward the gate? Options: **(a)** they run from a bound canonical question (engine, composer and verifier are tested; matching and robustness are not); **(b)** the case author writes a player-style version of each, which the owner signs off, and only that version gates; **(c)** (a) now, and (b) added over time as extra variants. The planner recommends (c).
- [ ] **OQ-40.** *(Planner, 2026-09-28.)* Is the launch target of about 1,000 golden cases (D38, §8) a release gate, or a target that doesn't block release? It drives about 650 new cases and 25–35 hours of owner review. The planner recommends a target: the §8 release gate as written, plus a report of the count at release.
- [ ] **OQ-41.** *(Planner, 2026-09-28.)* What counts as a pass for a *hard* rules question whose case expects no escalation, when the approved library has no entry for it? At run time it would get a marked AI answer (FR-Q-6), which the deterministic suite can't grade. Options: **(a)** it passes on escalation behaviour alone, as §8 says for hard cases, and its fallback answer goes into AI set (b) for the owner to read; **(b)** every hard case must be covered by the library, or its expectation changed to escalate, before release; **(c)** (a) for the MVP, and (b) as coverage grows. The planner recommends (c).