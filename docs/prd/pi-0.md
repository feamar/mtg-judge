# PI-0: the paste-in judge

Requirements · Decide one increment: what it's for, and the related features it releases.

Drafted 2026-11-03 by mlmd from `docs/vision.md` (W1, `ad01c66`) and `docs/source/PRD.md` v0.5 §6–§8.
Kept short on purpose (D-39): only what PI-0's first code needs; details come from the cycles.

## What it is for

The full judge, without Discord, on Frank's computer. Frank pastes in about 50 real CriticalEDH
cases, answers the judge's questions or relays them to the players, and copies its replies back
himself. PI-0 measures two things (Frank, 2026-10-29):

- the **AI share**, per question, from the case records (A10);
- the **tokens** each model uses per case, from which the running cost is inferred (Q10, A22).

**Hypothesis:** none. PI-0 measures; it doesn't test a viability hypothesis (Vision §2: none yet,
and Frank says when that changes, Frank, 2026-10-29; not asked again, mlmd, 2026-11-03).

## Features

From the Vision: F1 rules questions, F2 disputes, F3 infractions and penalties, F4 integrity, F5
handoff, F8 case record, F9 messy input, F11 build pipeline, behind F23, the paste-in front end.
(Frank, 2026-10-29)

Not in PI-0: Discord, tickets and the TO's event context setup (F6, F7: PI-1), the cost cap (F10),
voice (F12), operations (F13), penalty history (F17: PI-5).

## Behaviors

| Id | Behavior | Feature |
| --- | --- | --- |
| B1 | Paste-in case: Frank starts a case, pastes tagged messages, copies replies addressed to an audience | F23 |
| B2 | Player-text parsing: each message to a standardized form, or a request to rephrase | F9 |
| B3 | Rules question answered from the encoded knowledge, cited, teach-first | F1 |
| B4 | AI fallback: the stand-in frontier model answers, cited, marked as not reviewed | F1, F23 |
| B5 | Narration intake: follow the story until a question is formulated, arises, or it is wrapped up | F2 |
| B6 | Fact-finding by procedures, then a ruling with the game fix | F2 |
| B7 | Infraction and penalty under the event's policy framework; Warning at most issued | F3 |
| B8 | Integrity: categories, investigation notes, protected handoff, nothing revealed | F4 |
| B9 | Handoff to the human judges, with facts gathered and a neutral message to players | F5 |
| B10 | Case record and measurement: AI share per question, tokens per model call | F8, F23 |
| B11 | Build pipeline: sources to a versioned knowledge bundle, diff, golden set report | F11 |

## Decisions

| # | Decision | Who |
| --- | --- | --- |
| PI0-1 | No Discord: the paste-in front end is the only front end, an adapter of the same core PI-1's Discord adapter uses (Vision §4) | Frank, 2026-10-29; mlmd, 2026-11-01 |
| PI0-2 | Claude Code, on Frank's own subscription, stands in for the AI judge backup model (frontier); its tokens are counted | Frank, 2026-10-29 |
| PI0-3 | The player question text standardizing AI (small) also has a stand-in in PI-0: Claude Code's smallest model, on the same subscription, tokens counted. The paid online model starts with PI-1, when the CriticalEDH owners pay for it. Rule R1: PI-0 calls no paid API | mlmd, 2026-11-03; Frank agreed, 2026-11-03 |
| PI0-4 | Names are taken out by Frank, by hand, before he pastes; seat labels replace them | Frank, 2026-10-29 |
| PI0-5 | The release criteria don't apply to PI-0 (they apply from PI-1 on); the golden set runs and is reported | Frank, 2026-10-29 |
| PI0-6 | The knowledge bundle holds no draft (rule R6). The AI share PI-0 measures is that of what Frank has approved when the cases are run | mlmd, 2026-11-03; Frank agreed, 2026-11-03 |
| PI0-7 | The AI fallback answers rules questions only, including those inside a dispute. It never chooses an infraction, a penalty or a remedy: those come from procedures, or the case is handed off | mlmd, 2026-11-03; Frank agreed, 2026-11-03 |
| PI0-8 | Event context for PI-0: cEDH, Competitive REL, English, handoff threshold "more severe than a Warning" are fixed; Frank chooses the policy framework (MTR and IPG, with or without the MTRA, Notion version) and the integrity mode per case | mlmd, 2026-11-03 |
| PI0-9 | Every pasted message is tagged with who said it: a seat label (Seat 1–Seat N) or Frank himself. Any number of seats | mlmd, 2026-11-03 |
| PI0-10 | No clocks: a pause can't be seen in pasted text, so the 3-minute narration safety net is replaced by Frank marking the story as done | mlmd, 2026-11-03 |
| PI0-11 | Reply time is measured, not held: the stand-ins are slower than the paid models will be (Vision: single-digit seconds holds from PI-1 on) | mlmd, 2026-11-03 |
| PI0-12 | Case records with player text stay on Frank's computer outside the repository and are deleted after 7 days (rule R3, Vision Privacy). The measurement log holds no player text and is kept | mlmd, 2026-11-03 |
| PI0-13 | Frank reads the Claude subscription's terms before the first real case (A25); if they don't allow relaying to players, PI-0 runs on cases already ruled | mlmd, 2026-11-01 |

## Done when

About 50 real cases have been run, and a report gives the AI share per question, the tokens per
case for each model, and the inferred cost per case and per month at the source's reference volume
(200–430 cases a month), with each model's price as data. That report answers PI-0's part of Q10.

## Open

- A25: the subscription's terms, read by Frank before the first real case.
- Q10: answered in part by PI-0's report; the figure is set in phase 2 and PI-2.
- Q7: PI-0's pasted cases are real player text; exported as golden case candidates they can feed
  the messy-input PoC and the wrap-up phrases (A2, A12), but not the held-out set (rule R2).
- The design review of this PRD and `docs/behaviors.md` is folded into W4: the architecture
  session runs its checks first and fixes what it finds (Frank, 2026-11-03, under D-39).
