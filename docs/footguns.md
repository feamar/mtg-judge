# Footguns

Record traps: what looks like one thing and does another.

Drafted 2026-10-13 by mlmd's foundation pass from mtg-judge (`cycle/E3`, `5210244`; since 2026-10-14 in `docs/source/`). Anchors are
paths in this repository; the source documents are in `docs/source/`. "Source" in Verified means the trap is as the source recorded it on that
date; mlmd has not re-checked it.

| # | Looks like | Actually | Anchor | Verified |
| --- | --- | --- | --- | --- |
| 1 | Searching the CR for "can't be countered" finds the rule | The CR uses a typographic apostrophe ("can’t"), and its TXT has CRLF line endings | `docs/source/architecture/adr/0007` §1 | Source, 2026-09-26 |
| 2 | Scryfall bulk files can be fetched plainly | Requests without User-Agent and Accept headers are refused | `docs/source/architecture/adr/0006` | Source, 2026-09-26 |
| 3 | Scryfall rulings are official | They mix WotC and other sources; only WotC rulings count | `docs/source/architecture/adr/0006` | Source |
| 4 | Scryfall Oracle text is the authority | Gatherer is; the bundle can lag by one rebuild | `docs/source/architecture/adr/0006` | Source |
| 5 | The MTRA is one document | The TopDeck.gg and Notion versions are different documents; Notion only loads with JavaScript, so it is a hand transcript | `docs/source/architecture/adr/0007` §1; PRD D60 | Source |
| 6 | The MTR and IPG web pages are the normative text | They mix annotations into it | `docs/source/architecture/adr/0007` | Source |
| 7 | Tickets' "ticket category" field holds a Discord category | In thread mode it holds the panel channel | `docs/source/architecture/adr/0010` | Source |
| 8 | The ticket bot can be found by its name | "Ticket Bot" is a generic name; use its user ID | `docs/source/architecture/adr/0010` | Source |
| 9 | The ticket's description is there when its thread opens | It arrives later, possibly after a form | `docs/source/architecture/adr/0010` | Source |
| 10 | A handed-off ticket waits for the human judge | Tickets' auto-close can close it while it waits | `docs/source/architecture/adr/0010` | Source |
| 11 | The judge sees private ticket threads | Only if Tickets adds it on open, or it has Manage Threads | `docs/source/architecture/adr/0010` | Source |
| 12 | The judge can read message text | Only with the privileged Message Content intent, free of verification under 100 servers | `docs/source/architecture/adr/0010` | Source |
| 13 | Discord voice receive works with the standard library | End-to-end encryption (DAVE) may break it; unverified | `docs/source/architecture/SPIKES.md` S1 | Source, not run |
| 14 | A Claude Pro or ChatGPT subscription could power the live judge or its speech-to-text | A personal subscription can't serve other players, and gives no API access | `docs/source/architecture/adr/0015`, `docs/source/architecture/adr/0016` | Source |
| 15 | Hidden Card Error's "set" is the hand | It can be any hidden set, including the library | `docs/source/architecture/OWNER-ANSWERS.md` SCN-001 | Source |
| 16 | "Major penalties belong to the head judge" is published policy | Neither the MTR nor the IPG says so; it is the owner's choice | `docs/source/architecture/adr/0021` | Source |
| 17 | Not reminding an opponent of their trigger is suspicious | It is permitted and not an integrity issue | `docs/source/architecture/adr/0022` §3 | Source |
| 18 | Table confirmation is a vote, or proof | It is neither, and declining implies nothing | `docs/source/architecture/adr/0022` §2 | Source |
| 19 | A prompt telling the model not to mention cheating protects the players | It guarantees nothing; only keeping the data out of its input, plus an output check, does | `docs/source/architecture/adr/0009` | Source |
| 20 | Letting AI rewrite messy input into clean prose helps | It silently changes meaning ("not tapped" vs "not untapped") | `docs/source/architecture/adr/0018` | Source |
| 21 | A strategy passing the scenarios it was derived from shows it works | Those always pass; only held-out cases with other cards show reach | `docs/source/architecture/adr/0013`; `docs/source/architecture/spikes/S4-report.md` | Source |
| 22 | A golden case whose own note says "DRAFT" or "SOURCE CHECK REQUIRED" hasn't been checked | Frank checked all 348 by hand; `validation.status: VALIDATED` is what counts, and the notes are left over from the import | `golden/cases/expansion-*.yaml`; `golden/README.md` | Frank, 2026-10-14 |
| 23 | Re-running a golden importer is safe | It regenerates whole files, drops hand edits, and resets VALIDATED unless flagged | `golden/tools/import-judge-lab*.mjs` | Read 2026-10-13 |
| 24 | Imported golden cases record their policy framework | All 307 imported cases have `framework: null`, including MTRA-citing ones | `golden/tools/import-judge-lab-bundle.mjs`; `expansion-pol-003.yaml` | Read 2026-10-13 |
| 25 | Golden case citations are ids that can be matched exactly | Some carry prose, lack a section number, or use kinds the schema doesn't list | `golden/cases/expansion-pol-022.yaml`, `scn-002d` | Read 2026-10-13 |
| 26 | Every golden case input is something a player would say | 37 imported policy cases ask about "the app" in the third person | PRD OQ-39 | Source |
| 27 | The host for the live judge is ready | On the owner's Windows 10 desktop, virtualization is off and Docker isn't installed; Windows 10's extended updates end 2026-10-13 | `docs/source/architecture/adr/0003` | Source |
