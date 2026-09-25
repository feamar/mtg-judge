# Scenario — Blatant Thievery, Seize the Spotlight, and a Player Leaving

**Source validation:** VALIDATED

## Judge Call

Player A owns and controls an Elf.

Player B gains control of the Elf with **Blatant Thievery**.

Later, Player C gains control of the Elf with **Seize the Spotlight** until end of turn. During that turn, Player B loses the game and leaves.

Does the Elf immediately return to Player A because Player B's control-changing effect ended?

## Expected Ruling

No.

When Player B leaves the game, the control-changing effect from Blatant Thievery that gave B control of the Elf ends. However, Player C's later control-changing effect from Seize the Spotlight is still active.

Removing B's effect does not instruct the game to return the Elf to its owner. Control is determined using the effects that remain applicable. Therefore Player C continues to control the Elf.

When Seize the Spotlight's until-end-of-turn control effect expires, neither control-changing effect remains. Control then returns to Player A.

## Validated normative source chain

- Current Oracle text — **Blatant Thievery**
- Current Oracle text — **Seize the Spotlight**
- **CR 613.1b** — control-changing effects are applied in layer 2.
- **CR 613.3** — effects within layer 2 are applied according to the applicable ordering rules.
- **CR 613.7** — timestamp order determines the order of otherwise independent continuous effects; the later control-changing effect is applied later.
- **CR 800.4a** — when a Player leaves the game, effects that give that Player control of objects or Players end.

## Source → proposition → consequence

1. Blatant Thievery creates a control-changing effect giving Player B control of the Elf.
2. Seize the Spotlight later creates a control-changing effect giving Player C control of the Elf until end of turn.
3. **CR 613.1b, 613.3, and 613.7** → while both effects exist, the later Seize the Spotlight effect is applied after the earlier Blatant Thievery effect, so Player C controls the Elf.
4. Player B leaves the game.
5. **CR 800.4a** → the effect giving Player B control of the Elf ends.
6. CR 800.4a does not instruct the game to return the Elf to its owner. The game determines control using the remaining applicable effects.
7. Seize the Spotlight's effect is still active → Player C continues to control the Elf.
8. At end of turn, Seize the Spotlight's control-changing effect expires → no control-changing effect remains → Player A controls the Elf again.

## State sequence

**A controls → B controls via Blatant Thievery → C controls via Seize the Spotlight → B leaves: C still controls → Seize expires: A controls**

## Test-design value

This scenario tests whether the Judge engine can:

- reason about multiple simultaneous control-changing effects;
- apply layer and timestamp rules;
- remove only the effect that actually ends when a Player leaves;
- recalculate the resulting game state from remaining effects;
- avoid the incorrect heuristic that “a control effect ended” means “return the permanent to its owner”;
- distinguish ownership from control;
- reason correctly about a temporary later effect after an earlier indefinite effect disappears.
