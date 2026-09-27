# A card accidentally shuffled into the library

**Status:** SOURCE CHECK REQUIRED (branches proposed by the architect, 2026-09-27)

**Origin:** the product owner's scenario `SCN:` of 2026-09-27.

## Judge call

> shuffled a card into my deck on accident

This is a self-report by the player who made the call, and it's almost empty. **Before any ruling the judge needs the story** (ADR-0019): *"Could you tell me what happened, step by step?"* The ruling depends entirely on facts the opening doesn't give.

## Deciding facts

| Fact | Why it decides |
| --- | --- |
| **Which card, and which zone it came from** (hand, graveyard, exile, battlefield, command zone) | Decides whether its identity is known to all players |
| **Is its exact identity known to all players?** | IPG 2.5's partial fix only applies to an object whose identity is known to all players |
| **Is it the player's commander?** | CR 903.9b lets a commander go to the command zone instead of the library |
| **Was the shuffle itself legal?** For example, resolving a tutor, where only the extra card was wrong | Separates "a card ended up in the wrong zone" from other errors |
| **What happened since:** draws, searches, further shuffles | Decides whether moving the card is still only a minor disruption |

## Branches (proposed)

**A. The card came from a public zone** (graveyard, exile, battlefield), so its identity is known to all players:

- Game Rule Violation, **Warning** (IPG 2.5).
- Apply the partial fix: the object isn't in the correct zone, its identity is known to all, and it can be moved with only minor disruption. The player finds that card in the library in view of an opponent, returns it to its correct zone, and shuffles the library. The library had only just been randomised, so the shuffle adds little disruption.
- *Open point:* whether searching and reshuffling the library counts as "minor disruption" in cEDH practice.

**B. The card came from the player's hand**, so only that player knew its identity:

- Game Rule Violation, **Warning** (IPG 2.5).
- The partial fix doesn't apply, because the identity isn't known to all players.
- A backup would have to undo a shuffle. That's a random element, which is outside a simple backup, and IPG 1.4 urges extreme caution.
- So leave the game state as is. The card stays in the library, and the player is down a card in hand.
- *Open point:* confirm "leave as is". Also: should a pattern of this (for example a card that would otherwise have to be discarded) raise an integrity signal (OQ-14)?

**C. The card is the player's commander** (for example, it was knocked from the command zone into the library during a shuffle):

- Its identity is known to all players, so the partial fix applies. Return it to the command zone and shuffle the library.
- CR 903.9b supports the command zone as a legitimate destination whenever a commander would be put into a library.
- *Open point:* whether this is an infraction at all, when the commander's move into the library was legal but the owner simply didn't use the 903.9b replacement. That would be a different call.

## Normative sources (checked 2026-09-27)

- **IPG 2.5 Game Rule Violation:** the Warning penalty; the "object not in the correct zone" partial fix (identity known to all players, minor disruption, the wrong zone is the GRV itself); otherwise a full backup may be considered, or the game state left as is.
- **IPG 1.4 Backing Up:** a simple backup doesn't involve random elements; extreme caution with backups that involve shuffles or unknown cards.
- **IPG 2.3 Hidden Card Error:** checked, and **not** this case. It covers excess or unrevealed cards in a hidden set, not a card leaving the player's hidden set for the library.
- **CR 903.9b:** a commander that would be put into its owner's hand or library may go to the command zone instead.

IPG text was read from blogs.magicjudges.org on 2026-09-27; CR citations are to the CR effective 2026-09-25.

## Test significance

- **Intake:** an almost empty opening must lead to "tell me what happened, step by step", not to a guessed ruling.
- **Investigation:** the judge must ask for exactly the deciding facts above (FR-INV-3), and nothing about the rest of the board.
- **Branching on one fact:** where the card came from, and whether its identity is known, decides between fix and no fix.
