# Vision: mtg-judge

Requirements · Decide the whole product: what it is, and which increment each feature belongs to.

Imported 2026-10-13 from mtg-judge (`cycle/E3`, `5210244`; since 2026-10-14 in `docs/source/`): `docs/source/PRD.md` v0.5, `docs/source/architecture/`,
`docs/source/plan/`, `golden/` and the code. From this import on, this document is the master copy; the
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
  the owner. At run time the player question text standardizing AI (small) only turns what
  players say into a standardized question. The encoded knowledge finds the answer, or finds that
  the question needs the player to say more, and deterministic code writes the reply from
  owner-approved templates. The AI judge backup model (frontier) is called only for an AI
  fallback. (Frank, 2026-10-14; changes PRD P2 and D50, where the AI picked the procedure and
  phrased every question and explanation)
- **The face of the game, impartial:** precise, very friendly, customer-centric; never takes a side;
  a penalty is a learning moment.

**Users.**

| Role | Uses the judge to | Sees |
| --- | --- | --- |
| Player | ask questions, start disputes, answer the judge's questions and follow its instructions | only the conversation they are in |
| Human judge | receive handoffs, review rulings | all rulings in the event, and investigation notes |
| Tournament organizer (TO) | set up the event context | as a judge |
| Admin (one, global: the product owner) | choose which Discord role is the TO role, per server | as a TO, across all events |

(Frank, PRD §3, D40)

**Pilot user:** Frank, who judges online on Discord and in person, plays in friend groups, and
reviews the judge's rulings as domain expert. (Frank, PRD §3)

**Primary context:** online cEDH tournaments at Competitive REL, on Discord. (Frank, PRD §1, D4, D20)
The judge is first hosted on the CriticalEDH server. Its owners are its TOs, and pay the upkeep of the player
question text standardizing AI (small). (Frank, 2026-10-29)

## 2. Features, increments and MVPs

*Draft from PRD §4, §6 and the plan; the increments and the hypothesis are settled in this topic.*

**Features.** The source's MVP is drafted as PI-1.

| # | Feature | Increment |
| --- | --- | --- |
| F1 | Rules questions: answered from the encoded knowledge (all cards, all rules, most policy handling) with cited rules and a teach-first explanation, minimal during a game; when the literal answer is obvious or the question could mean something else, the judge first asks what the player wants to know (Frank, 2026-10-14); the rare question it can't answer gets an AI fallback answer, cited and marked as not reviewed | PI-0 |
| F2 | Disputes: narration intake, then fact-finding by build-time procedures (only the facts that decide), asked as open questions that players answer in their own words, never as buttons or choices, so that subtle hints stay visible (Frank, 2026-10-14; changes PRD FR-INV-2 and D50, which asked with buttons where possible); then a ruling with the game fix | PI-0 |
| F3 | Infractions and penalties: identified under the event's policy framework; issued up to a Warning, recommended above; simple backups and partial fixes only | PI-0 |
| F4 | Integrity: investigation notes, integrity categories and modes, a protected handoff on strong indicators, nothing revealed to players | PI-0 |
| F5 | Handoff to human judges, with the facts gathered first and a neutral message to players | PI-0 |
| F6 | Event context: set up by the TO; shared by join code; the Admin maps the TO role per server | PI-1 |
| F7 | Tickets: the judge joins the tickets the server's existing ticket bot opens (on CriticalEDH: the Tickets bot, thread mode; PRD D43, Frank, 2026-10-29); detection is pluggable | PI-1 |
| F8 | Case record: kept 7 days, readable by human judges and the TO, exportable as a golden case candidate; notes whether the AI judge backup model (frontier) answered, so the AI share can be counted from PI-1 on (Frank, 2026-10-29) | PI-0 |
| F9 | Messy input: typos, slang, nicknames and transcription errors lead to the same answer as clean input, or the judge asks to rephrase | PI-0 |
| F10 | Cost cap: at the monthly cap the judge answers rules questions only, on the cheapest model, and hands disputes off | none yet: not needed while the CriticalEDH owners pay for both models (A21; Frank, 2026-10-29) |
| F11 | Build pipeline: imports the CR, MTR, IPG, the policy frameworks and card data into a versioned knowledge bundle; shows a diff per new source version; releases only after the golden set passes and the owner approves | PI-0 |
| F12 | Voice in Discord: summoned only, through the same pipeline as text | PI-3, likely (Frank, 2026-10-29); waits on the voice PoC |
| F13 | Operations: a daily owner summary, a health check, backups that expire, spend alerts (from the plan; not in the PRD) | PI-2 (Frank, 2026-10-29) |
| F14 | 1v1 constructed formats (Standard, Pioneer, Modern, Legacy, Vintage, Pauper) | none yet; for version 2.0 (Frank, 2026-10-29; Q9) |
| F15 | Regular REL (JAR) and casual play; with no human judge available, the judge's best ruling marked as uncertain (PRD D35) | none yet; for version 2.0 (Frank, 2026-10-29; Q9) |
| F16 | Phone app: text and voice, several players at one device | none yet; for version 2.0 (Frank, 2026-10-29; Q9) |
| F17 | Penalty history across an event: upgrades, Turn Skips carried between rounds | PI-5 (Frank, 2026-10-29) |
| F18 | Languages other than English | none yet; for version 2.0 (Frank, 2026-10-29; Q9) |
| F19 | Photo input, then webcam input, of the board | none yet; for version 2.0 (Frank, 2026-10-29; Q9) |
| F20 | Limited formats | none yet; for version 2.0 (Frank, 2026-10-29; Q9) |
| F21 | Event policies set by the TO | none yet (PRD D61) |
| F22 | The Portuguese Multiplayer Addendum as a policy framework | none yet (Frank, 2026-09-28, PRD OQ-37) |
| F23 | Paste-in judge: Frank pastes a real case from CriticalEDH into the judge on his computer, answers its questions, and copies its replies back himself; no Discord. Claude Code, on Frank's own subscription, stands in for the AI judge backup model (frontier), and its tokens are counted to infer the cost (Q10) | PI-0 (Frank, 2026-10-29) |

**Increments.** (Frank, 2026-10-29)

| Increment | For | Used by |
| --- | --- | --- |
| PI-0 | The full judge without Discord, on about 50 real cases pasted in by hand: what it uses, and what it would cost | Frank |
| PI-1 | A test release: the judge running in Discord, to try it out | Frank and the CriticalEDH owners |
| PI-2 | Operations and stats: seeing how the judge does | Frank and the CriticalEDH owners |
| PI-3 | Voice in Discord | Frank and the CriticalEDH owners |
| PI-4 | The alpha release for players | CriticalEDH players |
| PI-5 | Penalty history across an event | CriticalEDH players |

PI-0 holds the full judge (F1–F5, F8, F9, F11) behind a paste-in interface (F23), used by Frank
alone on about 50 real cases, to measure the AI share and the tokens. PI-1 puts it into Discord
(F6, F7) for Frank and the CriticalEDH owners to try out. PI-2 adds operations and all the stats (F13). PI-3 adds voice (F12), likely (Frank's
word), and waits on the voice PoC. PI-4 opens the judge to players, and adds what the tests showed was missing. PI-5 adds penalty
history (F17). F14–F16 and F18–F20 are out of scope for now, for version 2.0 (Q9). (Frank,
2026-10-29)

**Viability hypothesis.** None yet: the work is a set of features to build (Frank, 2026-10-29).
Frank says when that changes. PRD D13 ("no business model, a learning project") stands, although the
CriticalEDH owners have said they would gladly pay for the player question text standardizing AI
(small).

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
- **Accuracy:** from PI-1 on, every release meets the release criteria (Frank, 2026-10-29): 100% of
  easy golden cases pass; up to about 2% of real cases handed off, with their
  facts gathered; every citation resolves in the loaded source version; zero confidently wrong
  results on messy input; "unresolved" is a valid result. (Frank, PRD NFR-ACC-1..3, NFR-ROB-1, D12,
  D30)
- **AI share:** all cards and all rules are encoded, and most policy handling. At most 1–2% of
  questions go to the AI judge backup model (frontier); more means the architecture isn't good enough yet. The
  share is measured first, from PI-0 on, and the encoding is improved until it holds; PI-1, the
  test release, doesn't have to meet it yet (Frank, 2026-10-29). Encoding
  must not slow the judge down. Player-text parsing by the player question text standardizing AI (small) doesn't count: it never
  answers or rules. For Discord it runs online, and the CriticalEDH owners pay for its upkeep (Frank, 2026-10-29). (Frank, 2026-10-14; goes beyond PRD
  P2 and D50, whose cost model assumed a library hit rate as low as 20%)
- **Consistency:** the same facts give the same ruling, whoever reports them, in whatever order or
  wording. (Frank, PRD NFR-IMP-1)
- **Cost:** cheap, and a good sell to the CriticalEDH owners, who pay for the models (A21). The
  figure is worked out in the build stages from what is measured (Q10; Frank, 2026-10-29). The
  source's figure, under $20 a month at pilot volume (200–430 cases a month), about $0.05–0.10 a
  case all in, is a reference until then. Building and testing cost no paid API spend (rule R1). (Frank, PRD
  NFR-COST-1, D14, D45)
- **Speed:** text replies within single-digit seconds; voice under 1 second if voice ships. (Frank,
  PRD NFR-LAT-1, D63)
- **Availability:** around the clock; short restarts are fine; a ticket opened during an outage is
  picked up afterwards. (Frank, PRD NFR-AVAIL-1)
- **Privacy:** the owner is in the EU (GDPR). Case records deleted after 7 days; deletion on
  request; consent before any voice capture. Pseudonymised player text (seat labels, no Discord
  names) may go to a third-party AI provider, also outside the EU. (Frank, PRD NFR-PRIV-1, D39, D44)
  Names are taken out before text reaches either model: by Frank, by hand, when he pastes a case
  into PI-0; by deterministic code from PI-1 on. (Frank, 2026-10-29) From PI-5, an event's
  penalty record is kept until the event ends, keyed by Discord name and never sent to a model
  (Frank, 2026-11-01; how long: mlmd, 2026-11-01).
- **Languages:** English only up to PI-5 (other languages, F18, wait for version 2.0), with nothing hard-coded in English (rule R4). Terms the CR,
  MTR or IPG define are never translated. (Frank, PRD D16, NFR-I18N-1)
- **Tone:** precise, very friendly, customer-centric; never sarcastic or blaming; set by the owner's
  examples. (Frank, PRD P3, NFR-TONE-1, D65)
- **Owner approval:** every AI-drafted procedure, penalty row, addendum edit, library entry and
  answering strategy is approved by the owner before its first release (rule R6). (Frank, PRD D47)

## 4. What the architecture must keep possible

*Draft from PRD §4 ("design for it, don't build it", D31) and the architecture constraints.*

A later feature is one outside the increment being built, planned or not. It is listed here only
when keeping it possible costs little now and would cost a lot later. (mlmd, 2026-11-01)

| Later feature | Increment | What it needs from the architecture |
| --- | --- | --- |
| Front ends after the paste-in judge: Discord, then the phone app (F16), the web, WhatsApp | PI-1; F16 version 2.0 (Q9); web and WhatsApp none yet | The core emits neutral questions and messages addressed to an audience, so PI-0's paste-in front end and PI-1's Discord are two adapters of one core (rule R5). The web and phone need inbound connections, which a host with outbound connections only rules out. (mlmd, 2026-11-01: PI-0 has no Discord) |
| A paid frontier model, and the cost cap (F10) | PI-1; F10 none yet | The AI judge backup model (frontier) behind a port: Claude Code stands in for it in PI-0 (F23), a paid API from PI-1 on. It can be switched off at run time, and AI fallbacks are then handed off (A21's fallback). (mlmd, 2026-11-01) |
| Voice in Discord (F12) | PI-3, likely | One pipeline for text and voice: speech-to-text in front of player-text parsing, and nothing after it knows the difference. Replies under 1 second leave little room for an online round trip (A15, A20). (mlmd, 2026-11-01) |
| Several players at one device (voice, the phone app) | PI-3; F16 version 2.0 | No assumption that one account is one player; no fixed player count or two-player assumption. Already true in PI-0, where Frank relays every player's words. (mlmd, 2026-11-01) |
| Photo, video and live-stream evidence (F19); the judge asking for another kind of input | Version 2.0 (Q9) | No text-only input pipeline; facts can come from evidence (observed facts) |
| Parsing and rules on the phone (F16) | Version 2.0 (Q9) | The player question text standardizing AI (small) behind a port, since it runs online for Discord (Frank, 2026-10-29) and on the phone in the app; the knowledge bundle portable; the core free of I/O (rule R5) |
| Other languages (F18) | Version 2.0 (Q9) | Nothing hard-coded in English (rule R4) |
| Other formats, RELs, policy frameworks (F14, F15, F20, F22) | Version 2.0 (Q9); F22 none yet | Format, REL and framework are data, not code |
| Event policies (F21) | None yet | The precedence layers kept as data, so a TO's layer can sit above the addendum and never over game rules (PRD D61). (mlmd, 2026-11-01) |
| Penalty history across an event (F17) | PI-5 | Penalty upgrade paths kept as data. A player's infractions are linked across the event's rounds by their Discord name, kept in the judge's records and never sent to a model (Frank, 2026-11-01). An event typically runs a week (Frank, 2026-11-01), so the penalty record is kept until the event ends, not 7 days from each case (mlmd, 2026-11-01) |
| Millions of users, more than 10,000 golden cases | None yet | Storage and case handling that can move off a single machine |
| Other ticket bots | None yet | Ticket detection behind a pluggable adapter (F7 builds it pluggable in PI-1) |

The features for version 2.0 (F14–F16, F18–F20) stay listed until Q9 decides which of them go in.
(Frank, 2026-10-29)
