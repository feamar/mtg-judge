# Silence / The Gitrog Monster — casting spells during cleanup

**Status:** VALIDATED

## Scenario

A four-player Commander game is in progress. A player has cast **Silence** during an opponent's turn. The opponent controls **The Gitrog Monster**, has eight cards in hand, and claims they can still win during the cleanup step even though Silence prevents them from casting spells this turn. If they cannot win this turn, the game will be a draw.

## Central question

Can the opponent obtain priority and cast spells during the cleanup step after Silence has stopped applying?

## Resolution

Yes, provided the cleanup-step sequence causes a triggered ability to be put onto the stack — for example, the player discards a land while discarding down to maximum hand size, causing The Gitrog Monster to trigger.

The relevant ordering is:

1. During cleanup, the active player discards down to their maximum hand size.
2. If a land is discarded, The Gitrog Monster triggers, but that trigger is not put onto the stack yet.
3. Effects that last "until end of turn" and "this turn" end. Silence therefore stops applying.
4. Because a triggered ability is waiting to be put onto the stack, that ability is put onto the stack and players receive priority.
5. The opponent can now cast spells during this cleanup-step priority window because Silence is no longer applying.
6. After the stack becomes empty and all players pass, another cleanup step occurs.

## Normative sources

- **CR 514.1** — the active player discards down to their maximum hand size during cleanup.
- **CR 514.2** — effects that last "until end of turn" and "this turn" end.
- **CR 514.3a** — if state-based actions occur or triggered abilities are waiting to be put onto the stack during cleanup, they are handled and the active player receives priority; another cleanup step follows afterward.
- **The Gitrog Monster — current Oracle text**.
- **Silence — current Oracle text**.

## Reasoning requirement

The engine must reason from the ordered turn structure rather than treating "this turn" as lasting until after every possible action in the cleanup step. It must recognize that cleanup can exceptionally contain a priority window, and that this window occurs after "this turn" effects have ended.

## Test significance

This scenario tests cleanup-step sequencing, delayed placement of triggers, expiration of "this turn" effects, exceptional priority during cleanup, spell casting in an unusual priority window, and creation of an additional cleanup step.
