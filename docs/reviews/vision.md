# Review: docs/vision.md

Record the design review of the Vision and how each finding was settled.

Fresh-session design review, 2026-11-01, of `docs/vision.md` on main at `200c830`, with the
standing documents. It looks only for what process.md lists: a feature with no increment and not
marked "none yet"; a term with two meanings, or two terms for one thing; a belief the product
depends on that nobody chose; a large question about a later feature that is neither answered nor
in §4. Sources were read only where a check needed them (PRD OQ-12, D46, FR-Q-1, FR-BUILD-4;
ADR-0021).

Status: **settled** (fixed, by whom), or **open** (a question to Frank). Under D-38, Frank decides
only a finding that would overturn one of his decisions; mlmd fixes the rest and lists them for
Frank to confirm.

## Features without an increment

Every feature F1–F23 has an increment or "none yet".

| # | Finding | Status | How settled |
| --- | --- | --- | --- |
| V1 | The web and WhatsApp front ends (PRD §4) appear only in §4, marked "none yet" there, not in the feature list | settled (mlmd) | Added as F24, none yet; §4 points to it |

## Terms

| # | Finding | Status | How settled |
| --- | --- | --- | --- |
| V2 | F10 says that at the cap the judge answers rules questions "on the cheapest model", which names neither model, and hands disputes off (PRD D46). §4 and A21's fallback, confirmed 2026-11-01, say only the frontier model stops and AI fallbacks are handed off | open | Question to Frank: either way one of his decisions changes |
| V3 | "AI share" counted per question (§3, Frank) and per case (A10); F8 still counted it "from PI-1 on", although §3 measures it from PI-0 | settled (mlmd) | Per question, in the case records, from PI-0 on; glossary entry added |
| V4 | "library entry" and "library hit rate" (§3 Owner approval and AI share, R6, A4, Q5, the glossary's owner): a word Frank retired on 2026-10-14 | settled (mlmd) | "concept explanation", the glossary's own part of the encoded knowledge; entry added |
| V5 | "policy framework" also used for an addendum (F11 "the policy frameworks", F22, §3 Platform) | settled (mlmd) | F11 "the multiplayer addenda"; F22 "the addendum in a policy framework"; §3 "MTR and IPG with the MTRA" |
| V6 | "product owner" (introduction, Users table), which the glossary says not to use | settled (mlmd) | "owner" |
| V7 | "judge" alone for a human judge (Users table: the TO sees "as a judge") | settled (mlmd) | "as a human judge" |
| V8 | "MVP" in the source's sense in §2 ("The source's MVP is drafted as PI-1"), next to the heading's mlmd sense | settled (mlmd) | Sentence removed; the glossary's PI-1 entry keeps the mapping |
| V9 | "the plan" for the source's plan (§2, F13), while `.pdd/plan.json` is mlmd's plan | settled (mlmd) | "the source's plan" |
| V10 | "paste-in interface" and "paste-in front end" for one thing | settled (mlmd) | "paste-in front end" |
| V11 | "pilot" for the source's first deployment (§3 Cost, A5) and for Frank ("Pilot user") | settled (mlmd) | "First user"; "the source's expected volume"; "the handoff rate in PI-1 and PI-4"; "pilot" retired in the glossary |
| V12 | "penalty row" (§3) and "penalty-table row" (R6) | settled (mlmd) | "penalty-table row" |
| V13 | "the tests" in PI-4 ("adds what the tests showed was missing") reads as the golden tests; it means trying the judge out | settled (mlmd) | "what trying it out in PI-1 to PI-3 showed was missing" |

## Beliefs nobody chose

| # | Finding | Status | How settled |
| --- | --- | --- | --- |
| V14 | PI-0 depends on Claude Code, on Frank's own subscription, drafting replies Frank relays to players; footgun 14 says a personal subscription can't serve other players | settled (mlmd) | A25, checked before PI-0's first real case |
| V15 | The speed constraint depends on the frontier model answering an AI fallback within single-digit seconds | settled (mlmd) | A26 |
| V16 | Frank's choice to send pseudonymised text outside the EU depends on that transfer being lawful | settled (mlmd) | A27, in the privacy check before PI-1 |
| V17 | Voice (PI-3) depends on someone paying for speech-to-text; A21 covers only the two models | settled (mlmd) | A28 |
| V18 | The problem the judge solves depends on players accepting its rulings rather than appealing to the human judges | settled (mlmd) | A29 |
| V19 | A17 (the desktop as host) doesn't count the host's Windows 10 losing security updates (footgun 27) | settled (mlmd) | A17's "Falsified if" extended |

## Large questions about later features

| # | Finding | Status | How settled |
| --- | --- | --- | --- |
| V20 | Q1 (WotC's Fan Content Policy) is large and deferred, and not in §4; its "needed by" names "Frank's own server", which doesn't exist | settled (mlmd) | Medium: the source settles it "before any public use, not for the design" (PRD OQ-12), and wording lives in templates (R4). Needed by PI-4, the first public use |

## Outside the review's list

| # | Finding | Status | How settled |
| --- | --- | --- | --- |
| V21 | §2–§4 still began "Draft from …", and several rows carried no marker (Ready when: every decision is marked with who made it) | settled (mlmd) | Each section's note names its source, and that unmarked rows are the PRD's (Frank) |
