# Behaviors

State what the product does: contract, failure, edges.

One living spec of every behavior built or being built, numbered across the product; an id is never
reused. A later increment that changes a behavior edits it here, marked with who changed it and
when. Drafted 2026-11-03 by mlmd for PI-0 (`docs/prd/pi-0.md`), from the Vision and
`docs/source/PRD.md` v0.5 §6 (its FR ids are given as the source of each contract). Decisions marked
PI0-n are in the PRD.

Throughout: the core emits messages, each addressed to an **audience**; it never knows which front
end shows them (rule R5). Every message the core writes comes from owner-approved locale templates
(rule R4); the only free text is an AI fallback's answer (B4). Nothing a player says is taken as a
fact until it is checked (glossary: claim / fact).

## B1 Paste-in case

Frank starts a case and chooses its policy framework and integrity mode (PI0-8). He then pastes
messages one or more at a time, each tagged with who said it: a seat label or Frank himself
(PI0-9). The judge answers each paste with zero or more messages, each addressed to an audience:
one seat, all players at the table, or the human judges. The front end shows the audience on every
message, so Frank knows what to copy where; human-judge messages are for Frank alone. A case ends
with a ruling, a handoff, or Frank closing it. The case is saved after every paste, so a restart
resumes it.
**Failure:** a message without a tag is not processed; the judge asks Frank who said it. A paste
that still holds a real name can't be detected in PI-0 (names are out by hand, PI0-4). If the case
can't be saved, the judge stops the case and says so (B10).
**Edges:** an empty paste is ignored; one seat only (a rules question) or any number of seats; a
whole ticket thread pasted at once is taken as its messages in order; Frank closing a case midway
records it as abandoned.
*Introduced in PI-0 (F23).*

## B2 Player-text parsing

Every player message goes through the player question text standardizing AI (small), behind a port
(Vision §4), to a standardized form: a question, a statement of what happened, an answer to the
judge's question, a wrap-up, or a request for a human judge. Parsing never answers, never rules and
never rewrites the text into prose (footgun 20). The form is matched to the encoded knowledge; a
match below the match threshold is not used. When a message can't be standardized or matched, the
judge asks that player to rephrase, naming what it did understand. Messy input (typos, slang,
nicknames, card nicknames, transcription errors) gives the same form as clean input, or a request
to rephrase; it is never matched to another question without asking. In PI-0 the small model's
stand-in is Claude Code's smallest model (PI0-3). (Source: NFR-ROB-1, D53, D64)
**Failure:** the model doesn't answer, or answers outside the standardized form: the message is
treated as not understood, and the judge asks to rephrase. Each failure is counted (B10).
**Edges:** two questions in one message are two standardized questions, answered in turn; a message
with no question is a statement; a card name that matches several cards, or none, makes the judge
confirm which card is meant (FR-Q-2).
*Introduced in PI-0 (F9).*

## B3 Rules question

A standardized question is answered from the encoded knowledge (CR, Oracle text, official WotC
card rulings, concept explanations, answering strategies). The answer cites the rules that decide
it and explains why, teach-first; during a game it gives the minimum the players need to carry on,
and full citations on request. When the literal answer is obvious, or the question could mean
something else, the judge first asks what the player wants to know. At Competitive REL it states
what is legal and what happens, never why a player might want to do it (play advice), and never
reveals hidden information. Questions about MTR or addendum procedures are answered, never applied
to event data. (Source: FR-Q-1..5, FR-RUL-8; Frank, 2026-10-14)
**Failure:** the encoded knowledge has no answer: an AI fallback (B4). A citation that doesn't
resolve in the loaded bundle is never sent; the answer becomes unresolved and is handed off (B9).
**Edges:** a question about a card not in the bundle; a question about event management (pairings,
points, timers) is declined as out of scope; the same question in other words gets the same answer.
*Introduced in PI-0 (F1).*

## B4 AI fallback

A rules question the encoded knowledge can't answer goes to the AI judge backup model (frontier),
behind a port; in PI-0 Claude Code stands in for it (PI0-2). Its input is the standardized question
and the rules and card text retrieved for it: no player text and no investigation notes (footgun
19). The answer may cite only that retrieved text; every citation is checked to resolve in the
loaded bundle. It is sent marked as not reviewed. The AI fallback answers rules questions only,
including those inside a dispute; it never chooses an infraction, a penalty or a remedy (PI0-7).
Every AI fallback is recorded with its tokens, so it can become a golden case and then encoded
knowledge. (Source: FR-Q-6)
**Failure:** the model doesn't answer, can't be reached, or an answer cites anything outside the
retrieved text: the question is unresolved and handed off (B9), as at a cost cap (Vision §4).
**Edges:** an answer with no citation is unresolved; an answer that says it can't tell is
unresolved, which is a valid result; a slow answer is waited for and its time recorded (PI0-11).
*Introduced in PI-0 (F1, F23).*

## B5 Narration intake

Unless the opening message already holds a clear question, the judge asks the caller to tell what
happened, step by step. If another player offers to explain and the table agrees, that player is the
narrator. The judge follows along without sending any player message, keeping each player's
statements as that player's claims; the front end shows Frank it is still listening. The narration
ends when a question is formulated, when one arises (an account is contradicted, an infraction
becomes apparent, a claim needs checking), or when the story is wrapped up. After a wrap-up without
a question it asks the caller what the question is, or how it can help if the tone suggests
confusion or frustration. (Source: FR-INT-4, D54)
**Failure:** a wrap-up it doesn't recognise: the judge keeps listening until Frank marks the story as
done, which counts as a wrap-up (PI0-10).
**Edges:** the whole story in one paste; a story that contradicts itself; a narrator who is not the
caller; a story with no dispute in it, which becomes a rules question (B3).
*Introduced in PI-0 (F2).*

## B6 Fact-finding and ruling

From the narration the judge opens every procedure that may apply. It asks only a decisive fact, the
one whose answer would change the ruling, the fix, the penalty or whether to hand off, chosen by the
procedures' priority, and never collects the board state up front. Each question is an open question
in owner-approved wording, addressed to the player who can answer it, never buttons or choices
(Frank, 2026-10-14). Every fact is tagged reported, observed or derived. It keeps several readings
open and revises them as answers come in; whether an infraction happened is decided from the game
actions, apart from what anyone intended. Before a ruling that rests on reconstructed events it
tells the players how it understood the question, the history and the facts it relies on, so they
can correct it. The ruling gives the decision, the game fix step by step, the citations and a short
explanation. (Source: FR-RUL-1..7, FR-INV-1..3)
**Failure:** an answer that can't be mapped to the fact asked is asked once more in other words, then
handed off. Conflicting accounts that the surrounding facts don't settle, and that change the
ruling, are handed off; if they don't change it, the judge rules on the agreed facts and says so. No
procedure applies: handoff.
**Edges:** the same facts in another order, wording or from another seat give the same ruling; a
fact that changes nothing is never asked; a player who won't answer; a correction after the
confirmation reopens the readings.
*Introduced in PI-0 (F2).*

## B7 Infraction and penalty

The infraction is identified under the case's policy framework, and its penalty is a deterministic
lookup in that framework's penalty table, the addendum over the MTR and IPG. The judge issues a
penalty only up to a Warning, labelled as the base penalty assuming no earlier infractions; a more
severe one (a major infraction, at MTRA events a Turn Skip) is not announced and goes to the human
judges as a recommendation (B9). It applies a simple backup the policy permits or a prescribed
partial fix itself; a full backup is always handed off. It delivers a ruling with a penalty in one of
the five delivery patterns. An event-management consequence (a drop, re-entry, a changed result) is a
referral, never announced. (Source: FR-POL-1..4, FR-CTX-6, D56, D57)
**Failure:** no penalty-table row for the infraction under the framework: handoff.
**Edges:** no infraction, a ruling without a penalty; two infractions in one case; an MTRA Deck
Problem whose IPG path leads to a Game Loss gives a Turn Skip, handed off.
*Introduced in PI-0 (F3).*

## B8 Integrity

Every dispute gets an integrity category: permitted or not relevant (no integrity step), ordinary
error (good faith, with the factual checks it needs), or strong indicators (a protected handoff,
whatever the integrity mode or the table says). On suspicion the judge writes investigation notes
for the human judges only, stops asking once more questions could compromise an investigation, and
tells the players neutrally to wait for a human judge. A neutral integrity question is asked only
when something else already looks off. In "request table confirmation" mode it asks the table to
confirm the sequence and records the reports; they are not a vote, and declining implies nothing.
Before any message to a player audience is shown, an output check makes sure it holds nothing from
the investigation notes. (Source: FR-ESC-4, D56, D58, D59; footguns 17–19)
**Failure:** the output check finds a leak: that message is not shown, and the case is handed off
with the neutral message.
**Edges:** strong indicators with unanimous table support still hand off, in both modes; not
reminding an opponent of their trigger has no integrity step; a repeated ordinary error alone is not
a strong indicator.
*Introduced in PI-0 (F4).*

## B9 Handoff

The judge hands off when: a case falls in an always-handoff category; a player contests a ruling or
asks for a human judge; it suspects cheating; it can't settle conflicting accounts; the base penalty
is more severe than a Warning; the remedy is a full backup; the result is unresolved; an AI fallback
fails. Before handing off it gathers every fact that is useful and cheap to get, except when a player
asked for a human judge, when it hands off at once. The handoff, addressed to the human judges,
holds a case summary, the facts, the disputed facts, the citations, its provisional reading and why
it hands off, and any investigation notes. The players get the owner's neutral handoff message, which
never gives the reason. In PI-0 the human judges' audience is Frank. (Source: FR-ESC-1..5, D59, D62)
**Failure:** a handoff that can't be put together in full is sent with what it has and the
transcript, never dropped.
**Edges:** a handoff on the first message; several triggers at once give one handoff listing them
all; an unresolved result counts as a success, not a failure.
*Introduced in PI-0 (F5).*

## B10 Case record and measurement

Every case is recorded: the event context, the seats, the transcript, the procedures, the facts and
their origins, the ruling, penalty and citations, whether and why it was handed off, investigation
notes, and the judge's and the bundle's versions. For every player question it records how it was
answered: encoded knowledge, AI fallback, handed off, or asked to rephrase; and for every model call
its model and tokens in and out. Records stay on Frank's computer outside the repository and are
deleted after 7 days, or on request; a record can be exported as a golden case candidate, which
stays SOURCE CHECK REQUIRED until Frank checks it (rule R7). A separate measurement log holds the
counts and tokens with no player text, and is kept (PI0-12). A report over the log gives the AI
share per question, the tokens per case per model, and the cost inferred from each model's price,
kept as data. (Source: FR-LOG-1..3, NFR-VER-1; Vision F8)
**Failure:** a record or log entry can't be written: the judge stops the case and says so, so no
case goes unmeasured.
**Edges:** a case with no question (a handoff after the narration) adds no question to the AI share;
an abandoned case is counted as abandoned; a report over zero cases says so instead of a share.
*Introduced in PI-0 (F8, F23).*

## B11 Build pipeline

The build pipeline imports the CR, the MTR, the IPG, the MTRA (Notion version, from its hand
transcript in `sources/addenda/`, A8) and the card data (Scryfall bulk files, with only WotC rulings
as official, footguns 2–4) into a versioned, read-only knowledge bundle: a rules index, penalty
tables and procedures per policy framework, card data and features, concept explanations and
answering strategies. Every artifact links to the source section it came from. A new source version
gives a readable diff and flags the artifacts and golden cases that cite a changed section as stale.
Every build runs the golden set and reports it; in PI-0 the report doesn't gate (PI0-5). The bundle
refuses any draft (rule R6, PI0-6). (Source: FR-BUILD-1..4)
**Failure:** a source can't be fetched or parsed: the build fails and the previous bundle stays in
use. A citation that doesn't resolve fails the build.
**Edges:** an unchanged source makes no new version; the CR's typographic apostrophes and CRLF line
endings (footgun 1); a card printed after the bundle was built is not in it (B3's edge).
*Introduced in PI-0 (F11).*
