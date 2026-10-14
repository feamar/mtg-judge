# What players ask: rules questions from public judge Q&A

Status: **A set reviewed by the owner (2026-09-28); B set archived unreviewed** · Collected 2026-09-26 by the architect role, while the owner was away.

**Purpose:** get an early picture of the *kinds* of questions players ask, before the league's ~2K Discord questions arrive. The pattern tells us which answering strategies and rule modules (ADR-0017) to build first. These questions are public, so they are **development material**. They are never held-out.

**How to read this:**

- Questions and answers are summarised in my own words from the linked source. Nothing is copied.
- **The answers are the source's, not validated.** Cranial Insertion (CI) columns are from mid-2025. The TopDeck article is from April 2023. Oracle text and the CR may have changed since.
- ⚠ marks an answer I think is simplified, possibly outdated, or worth a close look.
- **Family** is the answering-strategy family the question belongs to (legend at the end).

**What I need from you:** for each question, ✅ (right), ❌ (wrong, with the correct answer), or ⏭ (skip or irrelevant for cEDH). Validated ones can become scenarios.

## A. cEDH-specific: TopDeck, "cEDH Important Rules Interactions" (Shaun "Spielrahoo", 2023-04-04)

**Reviewed by the owner on 2026-09-28:** A10 and A22 corrected (see rows); all other A answers confirmed. Public material, so development only (PRD §8).

Source: https://topdeck.gg/articles/cedh-important-rules-interactions

| # | Question | Cards | Source's answer | Family | ✅/❌ |
| --- | --- | --- | --- | --- | --- |
| A1 | Which draw-punisher triggers are optional ("may") and which are mandatory? | Rhystic Study, Mystic Remora, Consecrated Sphinx, Tymna; Esper Sentinel, Archivist of Oghma, Kraum, Notion Thief … | Optional ones can be declined; mandatory ones must happen | TR | |
| A2 | Can you dredge when Narset or Spirit of the Labyrinth limits draws? | Narset, Parter of Veils; Spirit of the Labyrinth | Dredging replaces a draw, so you can dredge instead of your first draw; once a real draw has happened, the limit bites | R | |
| A3 | Can Notion Thief plus Consecrated Sphinx lock or kill an opponent? | Notion Thief, Consecrated Sphinx, Thrasios | Yes, it loops if the opponent has unbounded draws | TR | |
| A4 | Can one spell use two alternative costs (Underworld Breach escape + Force of Will's pitch)? | Underworld Breach, Force of Will, Fierce Guardianship … | No, only one alternative cost per spell; Phyrexian mana is not an alternative cost | C | |
| A5 | Can a copy or redirect effect change a modal spell's mode? | REB/BEB, Pyroblast/Hydroblast, Deflecting Swat | No, only targets can change; the mode stays | T | |
| A6 | REB vs Pyroblast: what can each target? | Red/Blue Elemental Blast, Pyroblast, Hydroblast | REB/BEB need a correctly coloured target; Pyroblast/Hydroblast can target anything and check colour on resolution | T | |
| A7 | Can Deflecting Swat redirect an REB (countering mode) onto a non-blue spell? | REB, Deflecting Swat | No, the new target must be legal for that mode | T | |
| A8 | What colour is Phantasmal Image on the stack and on the battlefield? | Phantasmal Image | Blue on the stack; on the battlefield, whatever it copies | CP | |
| A9 | What does a clone copy from a clone, or from a "becomes a copy" permanent? | Vesuva, Song of the Dryads, Jace, the Mind Sculptor | ⚠ Simplified: clones copy copiable values, including copy effects on the original but not other effects | CP | |
| A10 | Dress Down / Humility vs clones already on the battlefield vs clones entering now | Dress Down, Humility, Phyrexian Metamorph, Dockside Extortionist | **Corrected (owner review, 2026-09-28):** clones already on the battlefield stay copies but lose their abilities. A creature clone that **enters** under Dress Down (Clone, Phyrexian Metamorph) **copies nothing**: CR 614.12 checks it as it would exist on the battlefield, where it has lost its "enter as a copy" ability, so Clone enters as a 0/0 and dies. Non-creature copiers (Sculpting Steel) and Imposter Mech still copy. Source: [SEA region, "Delving deeper: Dress Down" (2024-04-15)](https://blogs.magicjudges.org/searegion/2024/04/15/delving-deeper-dress-down/). *The architect's first summary here ("new ones enter as copies but lose ETB abilities") misrepresented the TopDeck source, which said new clones can't copy.* | CP / L | ✅ corrected |
| A11 | Why is Imposter Mech different under Dress Down? | Imposter Mech, Dockside Extortionist | It's not a creature when it enters, so it keeps the copied ETB | CP / L | |
| A12 | Aven Mindcensor vs Opposition Agent: what does each affect? | Aven Mindcensor, Opposition Agent | Mindcensor: any search of a library; Agent: opponents' searches only, and Agent's controller gets control of the searcher | R | |
| A13 | Can you dodge Opposition Agent by choosing which zone to search at resolution? | Finale of Devastation, Opposition Agent | ⚠ Yes, where the spell lets you choose (graveyard only); check current Oracle | R | |
| A14 | How can Academy Rector / Arena triggers be stopped? | Academy Rector, Rest in Peace, Noxious Revival | Remove the card, or prevent it reaching the graveyard | TR / Z | |
| A15 | How long does Dress Down cast in an end step last? | Dress Down | Until the next end step's sacrifice trigger resolves; abilities come back before cleanup | TM | |
| A16 | When do "this turn" effects end, and what about Grand Abolisher? | Silence, Grand Abolisher, Gitrog Monster | "This turn" ends in cleanup; Abolisher is static and keeps working (matches golden scenario *silence-gitrog*) | TM | |
| A17 | Can you win in the cleanup step? | Gitrog Monster, Brallin, Curiosity | Yes, if a trigger happens in cleanup, players get priority (CR 514.3a) | TM | |
| A18 | Blood Moon vs shocklands and MDFC lands entering | Blood Moon, Magus of the Moon, shocklands, Shatterskull | They enter as basic-type Mountains, untapped, with no life payment | L / R | |
| A19 | Can Cavern of Souls name a creature type under Blood Moon? | Cavern of Souls, Blood Moon | No, it has lost its abilities | L | |
| A20 | Does Dress Down turn off Magus of the Moon? | Dress Down, Magus of the Moon | ⚠ Source says no, citing layers; this looks like a dependency question and needs a close check against CR 613.8 | L | |
| A21 | Can tap/untap restrictions stop Lion's Eye Diamond or Auriok Salvagers loops? | LED, Manglehorn, Root Maze, Blind Obedience, Auriok Salvagers | LED's cost doesn't tap, so entering tapped doesn't stop it | M | |
| A22 | What does Grand Abolisher stop? | Grand Abolisher, Faerie Macabre | **Corrected (owner review, 2026-09-28):** Oracle: *"During your turn, your opponents can't cast spells or activate abilities of artifacts, creatures, or enchantments."* So it does **not** stop channel or other abilities of cards in hand, and it does **not** stop abilities of **lands**, but it **does** stop Treasures (artifacts). | TM / C | ✅ corrected |
| A23 | Gemstone Caverns and "any colour an opponent's land could produce" | Gemstone Caverns, Fellwar Stone, Exotic Orchard | ⚠ Without a luck counter, Caverns only produces colourless, so these find no colour; check the exact current Oracle | M | |
| A24 | Can Frantic Search / Snap untap lands you don't control? | Frantic Search, Snap | ⚠ Source says yes; check against current Oracle ("lands" vs "lands you control") | T | |

## B. General rules Q&A: archived

The 30 Cranial Insertion questions were **archived unreviewed** on 2026-09-28, at the owner's request. They are in [`archive/cranial-insertion-b-set-2026-09-26.md`](archive/cranial-insertion-b-set-2026-09-26.md), are not test material, and don't count as validated.

## C. What the pattern says (54 questions, collected 2026-09-26; the B set has since been archived unreviewed)

| Family | Code | Count | Examples | Likely rule module (ADR-0017 §6) |
| --- | --- | --- | --- | --- |
| **Targeting, legality, redirect, fizzle** | T | 14 | A5–A7, B8, B9, B16, B18, B20, B23, B24, B29 | **targeting & countering**: the S4 module; also covers the owner's Swat/Pact questions |
| **Triggers: optional/mandatory, count, order, once-per-turn** | TR | 10 | A1, A3, B13, B17, B19, B25, B30 | **triggers**: count per event, APNAP ordering (603.3b), "may" |
| **Layers, type/ability changes, copy effects** | L / CP | 10 | A8–A11, A18–A20, B12, B15 | **layers & copy**: 613 incl. dependency, 707 copiable values. The hardest; it's *hard* by the PRD's definition |
| **Replacement effects** | R | 7 | A2, A12, A13, B7, B10, B21, B28 | **replacement**: 614/616; "did the event happen?" |
| **Timing: cleanup, "this turn", steps, SBAs** | TM | 8 | A15–A17, B1, B4, B22, B26 | **turn structure & SBA**: 514, 704; 3 golden scenarios already live here |
| **Costs: alternative/additional, copies** | C | 3 | A4, B5, A22 | **casting & costs**: 601.2, 118, 707.10 |
| **Mana abilities & mana production** | M | 2 | A21, A23 | **mana abilities**: 605 (Kinnan family) |
| **Card faces & zones (MDFC, Adventure, commander zone)** | Z / CMD | 6 | B2, B3, B6, B14, B27, A14 | **faces & commander**: 712, 715, 903 |

**Takeaways:**

1. **Targeting is the single biggest family.** It's also exactly what spike S4 builds, so S4 targets the right module.
2. **Triggers and layers/copy come next.** Layers are the costliest to codify and the most error-prone. They're good candidates to keep as *strategies for common cEDH cases* (Blood Moon, Dress Down, clones copying Dockside), with AI fallback for the rest.
3. **Many questions are about optional vs mandatory, and counting triggers.** These are cheap to answer from card features (`may`, `triggerEvent`, "first … each turn"), which supports the prefetch approach.
4. **cEDH questions cluster on a small card pool:** Rhystic Study, Remora, Thassa's Oracle, Consultation, Breach, LED, Dress Down, Blood Moon, Opposition Agent, clones and Dockside, Swat, and the blasts. Prefetching features for a staples list first is the right priority (ADR-0017 §1).
5. **Hardly any are disputes.** Public Q&A is almost all rules questions. The league export will show the real dispute share (OQ-25).

## Legend

T targeting · TR triggers · L layers/type-changing · CP copy effects · R replacement effects · TM timing, steps, SBAs · C costs · M mana · Z faces/zones · CMD commander rules · LKI last known information
