# A card accidentally shuffled into the library

**Status:** SOURCE CHECK REQUIRED. The infraction and remedy were set by the product owner on 2026-09-27; two details remain open.

**Origin:** the product owner's scenario `SCN:` of 2026-09-27.

## Judge call

> shuffled a card into my deck on accident

This is a self-report by the player who made the call, and it's almost empty. **Before any ruling the judge needs the story** (ADR-0019): *"Could you tell me what happened, step by step?"*

## Ruling (owner, 2026-09-27)

**Hidden Card Error, Warning** (IPG 2.3). The library is a hidden set, and it now contains an **excess card**: one that shouldn't be there. The remedy returns the excess card to the zone it came from:

- **The card's identity is known**, because it came from a public zone (graveyard, exile, battlefield) or it's the commander: that card is taken out of the library and returned to its original zone.
- **The card's identity is unknown**, because it came from the player's hand: **an opponent chooses any card** from the library, and that card is put into the zone the excess card came from. This follows IPG 2.3's excess-card remedy: reveal the set, the opponent chooses which previously unknown cards are the excess, and those cards go back to their original location.
- **At an MTRA event** (the owner's league framework, MTRA "Hidden Card Error — Warning"):
    - the choosing opponent is the one furthest in turn order from the active player, excluding the infracting player;
    - the set is revealed only to them;
    - they may not discuss their choice with the other players.

> **Correction on record:** the architect first classified this as a Game Rule Violation (IPG 2.5) and ruled out HCE, reading HCE's "set" as only the hand. The owner corrected this: the library is a set with an excess card. HCE cases, and the HCE procedure, must allow **any hidden set, including the library**.

## Deciding facts

| Fact | Why it decides |
| --- | --- |
| **Which card, and which zone it came from** | Known identity: return that card. Unknown: an opponent chooses. |
| **Is its exact identity known?** | The branch above |
| **Framework** (MTRA or plain IPG) | Who chooses, and whether the reveal is limited to one opponent |
| **Is the card the commander?** | Known identity. Also CR 903.9b: a commander may go to the command zone instead of a library. |

## Open points for the owner

1. After the library has been searched or revealed, is it **shuffled**? This is proposed, because the library's order has been seen.
2. The **commander** case: a legal move into the library where the owner forgot the CR 903.9b choice is a different call, and may not be an infraction. Should it be a separate case?

## Normative sources

- **IPG 2.3 Hidden Card Error:** Warning; the excess-card remedy: reveal the set containing the excess cards; the opponent chooses which previously unknown cards are the excess; the excess cards return to their original location. Read from blogs.magicjudges.org on 2026-09-27.
- **MTRA, Gameplay Error, "Hidden Card Error — Warning":** the opponent is the one furthest in turn order from the active player, excluding the infracting player; the set is revealed only to them; they make the choices and may not discuss them (sources/addenda/mtra-2025-06-24.md).
- **CR 903.9b:** a commander that would be put into its owner's hand or library may go to the command zone instead (CR effective 2026-09-25).

## Test significance

- **Intake:** an almost empty opening leads to "tell me what happened, step by step", not a guessed ruling.
- **Classification:** HCE with the **library** as the set. This is a trap the architect fell into.
- **Branching:** known vs unknown identity decides between "return that card" and "an opponent chooses".
- **Multiplayer (MTRA):** the right opponent chooses, the reveal goes only to them, and no discussion is allowed (FR-INT-3 AC).
