# League export intake: script plan

Status: Proposed · Date: 2026-09-26 · Implements ADR-0017 §4 and OQ-31 · For: the owner's ~2,000 answered questions from the cEDH league's ticket history (Tickets bot, thread mode)

**Rules this plan enforces:**

- the raw data never enters this public repository;
- the held-out part is split off **before any AI session reads anything**;
- names are removed by script, not by AI;
- the raw export is deleted once pseudonymised scenarios exist (OQ-31).

## Where things live

| What | Location | Who may read it |
| --- | --- | --- |
| Raw export, as received | `%USERPROFILE%\mtg-judge-data\raw\` (outside the repo) | Scripts only |
| Held-out, pseudonymised | `%USERPROFILE%\mtg-judge-data\heldout\`, or a private `mtg-judge-heldout` repository | Release test runs only; never an AI authoring session |
| Development set, pseudonymised | `%USERPROFILE%\mtg-judge-data\dev\` | Scripts, and case- and knowledge-author sessions |
| Split record: IDs and counts only, no content | this repository, `golden/intake/split-<date>.json` | Anyone |

`.gitignore` also blocks `league-export/`, `heldout/`, `*.raw.json`, `*.raw.html`, and `*.transcript.html` as a safety net.

## Pipeline: four scripts, run by the owner, in order

1. **`normalise`**: format adapter to one JSON shape. The adapter depends on what the export turns out to be:
    - Tickets bot HTML transcripts;
    - a dashboard JSON export;
    - a DiscordChatExporter JSON/HTML file.

   The output per ticket: `{ ticketId, openedAt, messages: [{ authorId, authorName, isStaff, isBot, ts, text }] }`. Nothing is pseudonymised yet, so the output stays in `raw\`. The script only restructures; it never prints message text to the console.
2. **`split`**:
    - a seeded random draw of **20%** of tickets, stratified by month, so the held-out set spans the whole league period;
    - held-out tickets go to `heldout\` (pseudonymised in the same run, by step 3's code), the rest to `dev\`;
    - it writes `split-<date>.json` with ticket IDs, the seed, and counts only. This is the only output that enters the repo.
3. **`pseudonymise`** (run inside `split`, for both sets):
    - per ticket, author IDs become `P1…Pn` in order of first appearance, and staff (judges, TO) become `J1…Jn`;
    - the bot is dropped or labelled `BOT`;
    - `<@id>` mentions and known display names in the text are replaced with the same labels;
    - message links and attachment URLs are removed;
    - card names are left as they are.

   A final check fails the run if any known author ID or name still appears in the output.
4. **`triage`** (development set only, deterministic, no AI):
    - the card resolver runs over Scryfall `oracle_cards` names, plus common nicknames;
    - the family lexicon (the codes from `docs/research/web-questions-2026-09-26.md`) tags each ticket;
    - question vs dispute: disputes mention several players, or past game actions;
    - the output is `triage.csv` (ticketId, cards, families, kind) and a summary: counts per family, the top card combinations, and the question/dispute share, which answers OQ-25 with data.

   The summary (counts only) may enter the repository.

**Afterwards:**

- case-author sessions read `dev\` tickets family by family, write scenarios (SOURCE CHECK REQUIRED), and the owner validates them;
- once the scenarios are made, `raw\` is deleted (OQ-31);
- spike S3 takes its 30 texts from `dev\`.

## Language

The product language is TypeScript (ADR-0001), but this machine has no Node yet. The scripts are small and deterministic, so either:

- install Node LTS (your decision) and write them in TypeScript, reusing the card resolver later;
- or write them in PowerShell 5.1, which is already here, as spike S4 was.

**Recommendation:** install Node LTS before the export arrives. The card resolver and lexicon are product code that the bot needs anyway.

## What the owner provides

- The export, in whatever format Tickets or the TO can produce. Tell the architect the format; step 1 is written for it.
- The list of staff Discord IDs (judges, TO), so they can be labelled `J`, not `P`.
