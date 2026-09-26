# What players ask: rules questions from public judge Q&A

Status: **for product-owner verification** · Collected 2026-09-26 by the architect role, while the owner was away.

**Purpose:** get an early picture of the *kinds* of questions players ask, before the league's ~2K Discord questions arrive. The pattern tells us which answering strategies and rule modules (ADR-0017) to build first. These questions are public, so they are **development material**. They are never held-out.

**How to read this:**

- Questions and answers are summarised in my own words from the linked source. Nothing is copied.
- **The answers are the source's, not validated.** Cranial Insertion (CI) columns are from mid-2025. The TopDeck article is from April 2023. Oracle text and the CR may have changed since.
- ⚠ marks an answer I think is simplified, possibly outdated, or worth a close look.
- **Family** is the answering-strategy family the question belongs to (legend at the end).

**What I need from you:** for each question, ✅ (right), ❌ (wrong, with the correct answer), or ⏭ (skip or irrelevant for cEDH). Validated ones can become scenarios.

## A. cEDH-specific: TopDeck, "cEDH Important Rules Interactions" (Shaun "Spielrahoo", 2023-04-04)

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
| A10 | Dress Down / Humility vs clones already on the battlefield vs clones entering now | Dress Down, Humility, Phyrexian Metamorph, Dockside Extortionist | Existing clones keep copying; new ones enter as copies but lose ETB abilities | CP / L | |
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
| A22 | What does Grand Abolisher stop? | Grand Abolisher, Faerie Macabre | Only activated abilities of permanents (on your turn), not abilities from hand | TM / C | |
| A23 | Gemstone Caverns and "any colour an opponent's land could produce" | Gemstone Caverns, Fellwar Stone, Exotic Orchard | ⚠ Without a luck counter, Caverns only produces colourless, so these find no colour; check the exact current Oracle | M | |
| A24 | Can Frantic Search / Snap untap lands you don't control? | Frantic Search, Snap | ⚠ Source says yes; check against current Oracle ("lands" vs "lands you control") | T | |

## B. General rules Q&A: Cranial Insertion (a selection with Commander relevance)

Sources: https://www.cranial-insertion.com/article/4413 (2025-06-23) · /article/4416 (2025-06-30) · /article/4419 (2025-07-07). The column ended with /article/4422 on 2025-07-14.

| # | Question | Cards | Source's answer | Family | ✅/❌ |
| --- | --- | --- | --- | --- | --- |
| B1 | Several damage instances in one resolution vs a creature that must be dealt lethal damage: do they add up? | Fiery Confluence, Ghyrson Starn, Ancient Brontodon | Yes, SBAs are checked after the whole resolution | TM | |
| B2 | Can a companion condition check only an MDFC's front face? | Umori, Blex | Yes, only front-face characteristics count outside the stack | Z | |
| B3 | Jodah's free cast: may you cast the other face or the Adventure? | Jodah the Unifier, MDFC deans, Beluna Grandsquall | Yes to both | Z | |
| B4 | When do Saga chapter counters get added? | Sagas | After the draw step, as your precombat main phase begins | TM | |
| B5 | Do copies of a spell require paying its additional costs (discard)? | Laughing Mad, Alania | No, copies aren't cast, so no costs | C | |
| B6 | Chaos Warp on a commander that goes to the command zone: does the reveal still happen? | Chaos Warp | Yes, the rest of the effect still happens | Z / CMD | |
| B7 | Doorkeeper Thrull vs "enters tapped" replacement effects | Doorkeeper Thrull, Horned Loch-Whale | Replacement effects still apply; Thrull only stops triggers | R | |
| B8 | Can Remove Soul counter a creature put onto the battlefield (not cast)? | Remove Soul, Kona | No, it was never a spell | T | |
| B9 | Magma Opus / divided damage: can a target get 0? | Magma Opus | No, each target gets at least 1 (CR 601.2d) | T | |
| B10 | Crack Open vs Banishing Light / Oblivion Ring with Parallel Lives: how many Treasures? | Parallel Lives, Banishing Light, Oblivion Ring, Crack Open | Banishing Light: 2 (returns during resolution); O-Ring: 1 (return is a trigger) | R / TR | |
| B11 | A creature sacrificed in response: does its trigger use last known power and lifelink? | Wurmcoil Engine, Mage Slayer | Yes, last known information | LKI | |
| B12 | Copy effect vs type-changing effect: which wins? | Cackling Counterpart, Polymorphist's Jest | The copy applies in layer 1, then the later effect in its own layer | CP / L | |
| B13 | "Whenever you draw your first card each turn" with simultaneous draws: how many triggers? | Tataru Taru, Howling Golem | Once per turn | TR | |
| B14 | Do commander-only buffs apply to non-commander copies? | Cid, Bastion Protector | No, only the commander | CMD | |
| B15 | Ability removal vs copying abilities: which layer wins? | Sudden Spoiling, Marvin | Removal (layer 6) applies after copying (layer 1), so nothing is copied | CP / L | |
| B16 | Can Negate counter a sorcery that makes tokens? | Negate, Circle of Power | Yes, it's a noncreature spell | T | |
| B17 | One lifelink damage event to several players: how many "whenever you gain life" triggers? | Nazar, Black Waltz No. 3 | One, a single life-gain event | TR | |
| B18 | A search effect when its related creature is removed in response | Prishe's Wanderings | The search still happens; it doesn't target | T | |
| B19 | Double strike vs "whenever equipped creature deals combat damage" | Buster Sword | Triggers once per combat damage step, so twice | TR | |
| B20 | Is a creature ability's damage from a planeswalker's trigger "a spell"? | Terror of the Peaks, Ugin | No, abilities aren't spells | T | |
| B21 | Sacrifice-a-creature requirement when your only creature can't be sacrificed | Flare of Malice, Jon Irenicus | Nothing is sacrificed | R | |
| B22 | +1/+1 and -1/-1 counters put on during one resolution | Cori-Steel Cutter, Illness in the Ranks | They cancel as an SBA | TM | |
| B23 | Reanimation target becomes illegal (control or zone change) | Goryo's Vengeance, Commandeer | The spell does nothing (CR 608.2b) | T | |
| B24 | "Up to" targets: can you choose zero and still count as casting? | Dual Shot, Guttersnipe | Yes | T | |
| B25 | Ordering two of your own triggers to save a creature | Gift of Immortality | You choose the order; the return can resolve first | TR | |
| B26 | Saga's final chapter countered by Trickbind: what happens? | Fable of the Mirror-Breaker, Trickbind | It's sacrificed (SBA); it doesn't transform | TM | |
| B27 | Partner commanders: does each get its own trigger? | Haldan, Pako | Yes, separately | CMD | |
| B28 | "If you would scry" replaced: do "whenever you scry" triggers fire? | Eligeth, Opt | No, the scry didn't happen | R | |
| B29 | Single-target trigger whose target leaves: does anything happen? | General Leo Cristophe, Scavenging Ooze | No, the ability doesn't resolve | T | |
| B30 | Attack trigger vs combat damage: both? | The Lord Master of Hell | Yes, the ability's damage is separate from combat damage | TR | |

## C. What the pattern says (54 questions)

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
