# Silence / Commander discard — cleanup priority from a state-based action

**Status:** VALIDATED

## Scenario

A player has cast **Silence** during an opponent's turn. The opponent can win at instant speed if they are able to cast spells later that turn. They enter cleanup with eight cards in hand, one of which is their commander.

The opponent asks whether they can discard their commander while discarding down to maximum hand size and thereby obtain a priority window after Silence has stopped applying.

## Central question

Can discarding a commander during cleanup cause a state-based action that creates a cleanup priority window after Silence expires?

## Resolution

Yes.

1. Under **CR 514.1**, the active player discards down to their maximum hand size and may discard their commander.
2. The commander goes to the graveyard. Moving a commander from the graveyard to the command zone is handled by a state-based action under **CR 903.9a**, rather than replacing the discard.
3. Under **CR 514.2**, effects that last "this turn" end. Silence therefore stops applying.
4. Under **CR 514.3a**, because a state-based action would be performed, state-based actions are checked. The commander may be moved from the graveyard to the command zone. The active player then receives priority.
5. Silence is no longer applying during that priority window, so the opponent may cast spells they are otherwise legally able to cast.
6. Once the stack is empty and all players pass, another cleanup step occurs.

## Normative sources

- **CR 514.1** — discard down to maximum hand size.
- **CR 514.2** — effects that last "until end of turn" and "this turn" end.
- **CR 514.3a** — state-based actions and waiting triggered abilities can create a priority window during cleanup, followed by another cleanup step.
- **CR 903.9a** — a commander in a graveyard or in exile may be moved to the command zone as a state-based action.
- **Silence — current Oracle text**.

## Reasoning requirement

The engine must not assume that only triggered abilities can create an exceptional cleanup priority window. It must recognize the independent state-based-action branch of CR 514.3a.

The engine must also distinguish the commander's move from graveyard to command zone from a replacement effect: the commander is actually discarded into the graveyard before the relevant state-based action is performed.

## Test significance

This is a companion test to the Silence / The Gitrog Monster scenario. Both produce a cleanup priority window after Silence expires, but through different mechanisms:

- Gitrog: a triggered ability is waiting to be put onto the stack.
- Commander discard: a state-based action would be performed.

A system that merely pattern-matches the Gitrog case instead of understanding CR 514.3a should fail this variant.
