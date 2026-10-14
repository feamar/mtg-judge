# Vision: mtg-judge

Requirements · Decide the whole product: what it is, and which increment each feature belongs to.

Imported 2026-10-13 from mtg-judge (`cycle/E3`, `5210244`): `docs/PRD.md` v0.5, `docs/architecture/`,
`docs/plan/`, `golden/` and the code. From this import on, this document is the master copy; the
sources are inputs and are not kept in sync. "Frank (PRD D13)" marks a decision Frank made as product
owner and recorded in the source; "Frank, 2026-10-13" one made in this interview; "mlmd, 2026-10-13"
one mlmd made so work could continue, for Frank to confirm.

## 1. Problem, users and core

**Problem.** Online Magic: The Gathering tournaments on Discord often wait 1–2 hours for a human
judge. Small in-person events have overloaded judges, and players at home have none. Games stall, or
players settle disputes by guessing. (Frank, PRD §1, D4)

**Core.** An AI judge, available right away in Discord, that gives correct rulings and fixes the
game, and brings in a human judge only when it can't rule safely. It does three jobs: answers rules
questions from the Comprehensive Rules and Oracle card text; rules on disputes (hears the players,
establishes the facts, rules, fixes the game state); and enforces tournament policy (identifies
infractions and applies penalties under the MTR, the IPG and the event's policy framework). It never
manages events. (Frank, PRD §1, D1, NG1)

**Principles** that decide when requirements conflict or are silent (Frank, PRD §2):
- **Teach first:** every ruling explains why, citing the rule; when a penalty applies, the penalty
  comes first, then the teaching.
- **Deterministic first, AI last; spend at build time, not at run time:** lookups, citations, card
  data, penalty tables and investigation procedures are deterministic, built once and approved by
  the owner. At run time AI only understands what players say, picks the matching procedure or
  rules, and phrases questions and explanations. (Frank, PRD P2, D50)
- **The face of the game, impartial:** precise, very friendly, customer-centric; never takes a side;
  a penalty is a learning moment.

**Users.**

| Role | Uses the judge to | Sees |
| --- | --- | --- |
| Player | ask questions, start disputes, answer the judge's questions and follow its instructions | only the conversation they are in |
| Judge (human) | receive handoffs, review rulings | all rulings in the event, and investigation notes |
| Tournament organizer (TO) | set up the event context | as a judge |
| Admin (one, global: the product owner) | choose which Discord role is the TO role, per server | as a TO, across all events |

(Frank, PRD §3, D40)

**Pilot user:** Frank, who judges online on Discord and in person, plays in friend groups, and
reviews the judge's rulings as domain expert. (Frank, PRD §3)

**Primary context:** online cEDH tournaments at Competitive REL, on Discord. (Frank, PRD §1, D4, D20)

## 2. Features, increments and MVPs

*Draft from PRD §4, §6 and the plan; the increments and the hypothesis are settled in this topic.*

**Features.** The source's MVP is drafted as PI-1.

| # | Feature | Increment |
| --- | --- | --- |
| F1 | Rules questions: answered from the approved rulings library with cited rules and a teach-first explanation, minimal during a game; a library miss gets a cited AI answer marked as not reviewed | PI-1 |
| F2 | Disputes: narration intake, then fact-finding by build-time procedures (only the facts that decide), asked as open questions that players answer in their own words, never as buttons or choices, so that subtle hints stay visible (Frank, 2026-10-14; changes PRD FR-INV-2 and D50, which asked with buttons where possible); then a ruling with the game fix | PI-1 |
| F3 | Infractions and penalties: identified under the event's policy framework; issued up to a Warning, recommended above; simple backups and partial fixes only | PI-1 |
| F4 | Integrity: investigation notes, integrity categories and modes, a protected handoff on strong indicators, nothing revealed to players | PI-1 |
| F5 | Handoff to human judges, with the facts gathered first and a neutral message to players | PI-1 |
| F6 | Event context: set up by the TO; shared by join code; the Admin maps the TO role per server | PI-1 |
| F7 | Tickets: the judge joins the tickets the server's existing ticket bot opens (Tickets bot, thread mode); detection is pluggable | PI-1 |
| F8 | Case record: kept 7 days, readable by human judges and the TO, exportable as a golden case candidate | PI-1 |
| F9 | Messy input: typos, slang, nicknames and transcription errors lead to the same answer as clean input, or the judge asks to rephrase | PI-1 |
| F10 | Cost cap: at the monthly cap the judge answers rules questions only, on the cheapest model, and hands disputes off | PI-1 |
| F11 | Build pipeline: imports the CR, MTR, IPG, the policy frameworks and card data into a versioned knowledge bundle; shows a diff per new source version; releases only after the golden set passes and the owner approves | PI-1 |
| F12 | Voice in Discord: summoned only, through the same pipeline as text | PI-1 if the voice PoC succeeds; waits on it |
| F13 | Operations: a daily owner summary, a health check, backups that expire, spend alerts (from the plan; not in the PRD) | PI-1 *(gap)* |
| F14 | 1v1 constructed formats (Standard, Pioneer, Modern, Legacy, Vintage, Pauper) | *(gap)* |
| F15 | Regular REL (JAR) and casual play; with no human judge available, the judge's best ruling marked as uncertain (PRD D35) | *(gap)* |
| F16 | Phone app: text and voice, several players at one device | *(gap)* |
| F17 | Penalty history across an event: upgrades, Turn Skips carried between rounds | *(gap)* |
| F18 | Languages other than English | *(gap)* |
| F19 | Photo input, then webcam input, of the board | *(gap)* |
| F20 | Limited formats | *(gap)* |
| F21 | Event policies set by the TO | none yet (PRD D61) |
| F22 | The Portuguese Multiplayer Addendum as a policy framework | none yet (Frank, 2026-09-28, PRD OQ-37) |

**Increments.** *(gap)*

**Viability hypothesis.** *(gap)* The sources state none. The PRD says "No business model. This is
a learning project" (Frank, PRD D13), and the plan's pilot ends when "the owner accepts the product".

## 3. Constraints and quality levels

*Draft from PRD §2, §4, §5, §7 and §8.*

- **Platform:** Discord, text input; voice only if its PoC succeeds. cEDH (multiplayer, usually 4
  seats) at Competitive REL. One policy framework per event: plain MTR and IPG, or the MTRA (Notion
  version) (Frank, 2026-09-28, PRD OQ-37). Never Professional REL; never event management
  (pairings, standings, points, rounds, registration, timers). (Frank, PRD NG1, NG3, NG4)
- **Sources of truth:** every ruling traces to the sections of the CR, Oracle text and official
  rulings, MTR, IPG and the event's addendum that support it, never to general knowledge. Two
  precedence layers that never override each other: Oracle over the CR; the addendum over the MTR
  and IPG. (Frank, PRD §5, D18, D61)
- **Updates:** every new version of a rules document (CR, MTR, IPG, an addendum) and every new
  card set triggers a rebuild: diff, rebuild, golden set, owner approval. Starting it is one easy
  step, and the updated judge goes live without players on Discord noticing: no downtime, no lost
  case. (Frank, 2026-10-14; changes PRD D25, which had a manual rebuild for document versions only)
- **Accuracy:** 100% of easy golden cases pass; up to about 2% of real cases handed off, with their
  facts gathered; every citation resolves in the loaded source version; zero confidently wrong
  results on messy input; "unresolved" is a valid result. (Frank, PRD NFR-ACC-1..3, NFR-ROB-1, D12,
  D30)
- **Consistency:** the same facts give the same ruling, whoever reports them, in whatever order or
  wording. (Frank, PRD NFR-IMP-1)
- **Cost:** under $20 a month for the live judge at pilot volume (200–430 cases a month), about
  $0.05–0.10 a case all in. Building and testing cost no paid API spend (rule R1). (Frank, PRD
  NFR-COST-1, D14, D45)
- **Speed:** text replies within single-digit seconds; voice under 1 second if voice ships. (Frank,
  PRD NFR-LAT-1, D63)
- **Availability:** around the clock; short restarts are fine; a ticket opened during an outage is
  picked up afterwards. (Frank, PRD NFR-AVAIL-1)
- **Privacy:** the owner is in the EU (GDPR). Case records deleted after 7 days; deletion on
  request; consent before any voice capture. Pseudonymised player text (seat labels, no Discord
  names) may go to a third-party AI provider, also outside the EU. (Frank, PRD NFR-PRIV-1, D39, D44)
- **Languages:** English only in PI-1, with nothing hard-coded in English (rule R4). Terms the CR,
  MTR or IPG define are never translated. (Frank, PRD D16, NFR-I18N-1)
- **Tone:** precise, very friendly, customer-centric; never sarcastic or blaming; set by the owner's
  examples. (Frank, PRD P3, NFR-TONE-1, D65)
- **Owner approval:** every AI-drafted procedure, penalty row, addendum edit, library entry and
  answering strategy is approved by the owner before its first release (rule R6). (Frank, PRD D47)

## 4. What the architecture must keep possible

*Draft from PRD §4 ("design for it, don't build it", D31) and the architecture constraints.*

| Later feature | What it needs from the architecture |
| --- | --- |
| Other front ends: the phone app, the web, WhatsApp | Discord not hard-coded; the core emits neutral questions and messages addressed to an audience. The web and phone need inbound connections, which a host with outbound connections only rules out |
| Several players at one device (voice, phone app) | No assumption that one account is one player; no fixed player count or two-player assumption |
| Photo, video and live-stream evidence; the judge asking for another kind of input | No text-only input pipeline; facts can come from evidence (observed facts) |
| On-device or hybrid use: rules data and inference on the phone | The knowledge bundle portable; the core free of I/O (rule R5) |
| Other languages | Nothing hard-coded in English (rule R4) |
| Other formats, RELs, policy frameworks | Format, REL and framework are data, not code |
| Penalty history across an event | Penalty upgrade paths kept as data |
| Millions of users, more than 10,000 golden cases | Storage and case handling that can move off a single machine |
| Other ticket bots | Ticket detection behind a pluggable adapter |
