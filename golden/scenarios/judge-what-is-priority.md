# Judge, what is priority?

**Source validation:** VALIDATED BY PROJECT OWNER — 2026-09-28

## Status
**Source validation: VALIDATED BY PROJECT OWNER — 2026-09-23**
Canonical explanatory Judge Call scenario.

## Player question
During a game, a Player asks: “Judge, what is priority?”

## Canonical English answer
During a game, priority is just who gets to act right now. You can cast a spell or activate an ability, or you can pass. If you pass, priority moves to the next player. If all players pass in a row, then the top item on the stack resolves. After that, the active player gets priority again. If all players pass in a row while the stack is empty, the game moves on to the next step or phase.

## Interaction principle
During an active game, the system should provide the minimum rules explanation needed for the Players to understand the current situation and continue correctly. Outside a game, a deeper educational explanation may be appropriate.

The internal rules model may therefore be substantially more detailed than the player-facing answer.

## Related concept
`concepts/priority.md`

## Source validation
**Status: VALIDATED BY PROJECT OWNER — 2026-09-23**

### Candidate normative trace
- **CR 117.1–117.3** → establishes priority and when players may take actions → supports the explanation that one player has priority and may act or pass.
- **CR 117.3b** → after a spell or ability resolves, the active player receives priority → supports “after that, the active player gets priority again.”
- **CR 117.4** → if all players pass in succession with the stack nonempty, the top object resolves; if the stack is empty, the phase or step ends → supports the two outcomes in the canonical answer.

## Validated normative mapping

- **CR 117.1** → establishes the priority system and the actions available to a Player with priority → supports the explanation that priority determines who may act, including casting spells and activating abilities.
- **CR 117.3d** → when a Player passes, the next Player in turn order receives priority → supports the explanation that passing moves priority to the next Player.
- **CR 117.4** → if all Players pass in succession while the stack is not empty, the top object resolves; if the stack is empty, the current step or phase ends → supports both branches of the canonical explanation.
- **CR 117.3b** → after a spell or ability resolves, the active player receives priority → supports: “After that, the active player gets priority again.”
- **CR 117.5** → before a Player receives priority, applicable game processing including state-based actions and putting waiting triggered abilities on the stack occurs → supporting internal-model detail intentionally omitted from the minimal Player-facing answer.

### Source → proposition → consequence

**CR 117.3b →** after a spell or ability resolves, the active player receives priority → the canonical answer explicitly states that the active player gets priority again after the top object resolves.

**CR 117.4 →** consecutive passes by all Players cause the top object to resolve when the stack is nonempty, or the current step or phase to end when it is empty → the canonical answer presents exactly those two outcomes.
