# Glossary

Give every term one meaning, and name the words not to use for it.

Drafted 2026-10-13 by mlmd's foundation pass from mtg-judge (`cycle/E3`, `5210244`): PRD §9, the
architecture and ADRs, the golden set and the code. A term marked *(mlmd, 2026-10-13)* is mlmd's
choice of word, for Frank to confirm; unmarked meanings are the source's. Terms defined in the CR,
MTR, IPG or JAR keep those documents' meaning, in English, in every language.

## The product and its people

- **judge:** the product, the AI judge. Not: app, assistant, bot. *(mlmd, 2026-10-13: the sources
  use all four)*
- **human judge:** a person judging the event, who receives handoffs. The judge acts as a floor
  judge; the event's human judges act as head judge. Not: judge (alone), staff.
- **player:** anyone in a case who is neither a human judge, a TO nor the Admin.
- **TO:** tournament organizer: sets up the event context. Every member of the server role the
  Admin maps to TO.
- **Admin:** the one global user (Frank) who chooses, per server, which Discord role is the TO role.
- **owner:** Frank, as the product's owner: approves library entries, procedures, golden cases and
  releases. Not: product owner (same thing; use "owner").
- **Tickets bot:** the third-party bot (tickets.bot) that opens a ticket per judge call on Frank's
  server. "Bot" is used only for third-party bots. *(mlmd, 2026-10-13)*

## Cases

- **judge call:** a player's request for a judge, made the way players do today, through the ticket
  bot.
- **ticket:** the Discord thread a judge call opens: the description, the reporting players, the
  event's human judges and TOs.
- **case:** one judge call's handling by the judge, from being summoned until a ruling or a
  handoff, and its record. Not: golden case (a test), ticket (the thread).
- **rules question:** a case that asks how the rules work. About 75% of cases.
- **dispute:** a case where something happened in the game and the players need a ruling and a fix.
  Not: for two players' conflicting versions of one fact; call that **conflicting accounts**.
  *(mlmd, 2026-10-13: the architecture uses "Dispute" for both)*
- **narration intake:** the judge asks the caller (or an agreed **volunteer**) to tell what happened
  step by step, and follows along until a question is formulated or arises, or the story is
  **wrapped up**. A pause never ends a narration. Not: silence (the source uses "silence" for a
  wrap-up).
- **claim / fact:** a claim is what a player asserts about the rules, an infraction, a count or a
  remedy; it is checked, never taken as a fact. A **fact** has an origin: **reported** (a player
  said it), **observed** (from evidence), **derived** (worked out from rules, card text or
  arithmetic).
- **decisive fact:** an unknown fact whose answer would change the ruling, the fix, the penalty or
  whether to escalate. Not: deciding fact.
- **procedure:** the build-time script for one infraction under one policy framework: facts needed,
  the question for each, who it goes to, when to stop, the remedy.
- **ruling:** the decision, the game fix step by step, the citations, and a short explanation.
- **unresolved:** a valid result: the governing text doesn't settle a needed point, so the case is
  handed off rather than decided.
- **handoff:** the judge passes a case to the human judges in the judge-only channel, with a case
  summary, facts, disputed facts, citations, its provisional reading and why. Not: escalation (same
  thing; use "handoff"). *(mlmd, 2026-10-13)*
- **investigation notes:** what the judge saw that suggests cheating; only human judges and the TO
  see them.

## Rules and policy

- **CR, MTR, IPG, JAR, REL, Oracle text:** as the published documents define them. **Oracle** means
  card text; the card Thassa's Oracle is always named in full.
- **policy framework:** the MTR and IPG plus zero or one multiplayer addendum, chosen per event.
  Not: framework (alone) in player-facing text.
- **MTRA:** the Multiplayer Tournament Addendum. The TopDeck.gg and the Notion versions are
  different documents; an event names the one it uses.
- **event context:** the per-event settings the TO makes: format, REL, policy framework, roles,
  channels, ticket source, handoff threshold, integrity mode, language.
- **join code:** how a player outside the event's server joins its context.
- **base penalty:** the penalty from the table after the framework, assuming no earlier
  infractions.
- **major infraction:** an infraction whose base penalty is more severe than a Warning, or any
  suspected cheating. The owner's definition, not published policy.
- **Turn Skip:** the MTRA's penalty in place of Game Loss.
- **remedy:** how the game is fixed: a **simple backup**, a **partial fix**, or a **full backup**
  (always handed off).
- **delivery pattern:** one of the five ways a ruling with a penalty is delivered (FR-POL-2).
- **integrity category:** permitted or not relevant; ordinary error; strong indicators (always a
  protected handoff).
- **integrity mode:** the TO's setting: presume good faith (default), or request table
  confirmation.
- **event policy:** a TO's written local ruling amending tournament policy, never game rules. Not in
  the first increment.
- **referral:** an event-management consequence (drop, re-entry, changed result) passed to the TO
  and never announced by the judge.
- **play advice:** guidance that could influence a player's decisions; the MTR and IPG definitions
  take precedence.

## Knowledge and build

- **build pipeline:** the offline process that turns the source documents and card data into the
  knowledge bundle. Not: pipeline (alone), which in the source also names a code workspace.
- **knowledge bundle:** the versioned, read-only release of everything the judge rules from.
- **approved rulings library:** owner-approved answers: concept explanations, answering strategies,
  official card rulings. Rules questions are answered from it first. A **library miss** gets a
  cited AI answer marked as not reviewed.
- **answering strategy:** a build-time graph over card features that answers one kind of question.
- **card features:** structured facts about a card that strategies reason over.
- **stale:** an artifact or golden case that cites a source section that has changed.

## Quality

- **golden set:** the owner-approved cases that define a correct ruling. A **golden case** is one
  of them. Not: case (a judge call), scenario (the golden case's readable Markdown view), test
  record.
- **easy / hard:** the owner's tag on a golden case; hard means a complex rules interaction, a long
  investigation or rebuilding a complex board state.
- **VALIDATED / SOURCE CHECK REQUIRED:** a golden case's status: the owner has / hasn't checked its
  citations.
- **held-out set:** golden cases no AI session has seen, stored outside the repository.
- **confidently wrong:** a wrong understood question or answer given without asking. The target is
  zero.
- **release criteria:** what a release of the judge must meet: 100% of easy golden cases pass, hard
  cases hand off as expected, zero confidently wrong, the owner approves. Not: release gate.
  *(mlmd, 2026-10-13: "gate" is mlmd's word for a check that runs before main moves)*
- **match threshold:** the confidence level the input matcher needs before it accepts a match. Not:
  confidence threshold, since there is none for handoffs. *(mlmd, 2026-10-13)*

## Increments

- **PI-1:** the first increment, the one the source calls "the MVP". *(mlmd, 2026-10-13: to settle
  in the Vision's features topic)*

## Retired

- **MVP**, **Post-MVP**, **Future** as the PRD's scope tags: replaced by the increment a feature
  belongs to, or "none yet". "MVP" means only what mlmd means by it: increments aimed at a viability
  hypothesis.
- **spike S1–S4** as the source names them: in this project they are PoCs or spikes in mlmd's sense,
  named for what they ask (voice, Tickets, messy input, targeting).

Not imported: the source's process vocabulary (iterations E2–E4 and C1–C6, knowledge families E0–E11,
hardening H1–H6, the RUP milestones LCA/IOC/PR, its agent roles). It belongs to how mtg-judge was
built, and mlmd's own process replaces it.
