# Scenario — Faerie Mastermind, Smothering Tithe, Orcish Bowmasters, and APNAP

**Source validation:** VALIDATED

## Judge Call

Four-player game. Player 1 controls **Faerie Mastermind**, **Training Grounds**, and **Smothering Tithe**. Player 2 controls **Orcish Bowmasters**.

During Player 2's upkeep, Player 1 activates Faerie Mastermind. Training Grounds reduces the activation cost to {2}. The ability resolves and each Player draws a card.

Player 1 claims that Player 2's Orcish Bowmasters triggers are placed on the stack before Player 1's Smothering Tithe triggers, allowing the Tithe triggers to resolve first. If nobody pays for Smothering Tithe and nobody interrupts, Player 1 proposes repeatedly spending two Treasures to activate Faerie Mastermind, netting one Treasure each iteration while accumulating unresolved Orcish Bowmasters triggers lower on the stack.

Is that correct?

## Expected Ruling

Yes, assuming Player 2 is the active Player and Player 1 is next in turn order.

When Faerie Mastermind's ability resolves, each Player draws a card. Player 1's three opponents each draw, so Smothering Tithe triggers three times. Player 2's three opponents each draw, so Orcish Bowmasters triggers three times.

The triggered abilities wait until a Player would receive priority before being put onto the stack.

Because Player 2 is the active Player, Player 2 puts their Bowmasters triggers onto the stack first. Then Players proceed in APNAP order. Player 1 therefore puts their Smothering Tithe triggers onto the stack after Player 2's triggers, placing the Tithe triggers above the Bowmasters triggers.

The Tithe triggers consequently resolve before the Bowmasters triggers.

If none of Player 1's opponents pays {2}, the three Tithe triggers create three Treasures. Training Grounds reduces Faerie Mastermind's activation cost to {2}, so Player 1 can spend two of those Treasures to activate Faerie Mastermind again before any Bowmasters trigger resolves.

After that Mastermind ability resolves, the same trigger-generation and APNAP ordering occurs again. With the stated assumptions, each iteration costs two Treasures and can produce three, netting Player 1 one Treasure while adding another three unresolved Bowmasters triggers below the newly created Tithe triggers.

## Important precision

This is not a sequence in which other Players lose the opportunity to act.

Player 1 must activate Faerie Mastermind again between iterations, and Players receive priority normally. The repeated sequence may be proposed as a tournament shortcut for a specified number of iterations, subject to the rules governing shortcuts and interruptions.

## Validated normative source chain

- Current Oracle text — **Faerie Mastermind**
- Current Oracle text — **Training Grounds**
- Current Oracle text — **Smothering Tithe**
- Current Oracle text — **Orcish Bowmasters**
- **CR 603.3** — triggered abilities are put onto the stack when a Player would receive priority.
- **CR 603.3b** — simultaneous triggered abilities controlled by different Players are put onto the stack in APNAP order; the active Player puts theirs on first, followed by each other Player in turn order.
- **CR 117** — priority governs when Players may take actions between resolutions and iterations.
- **MTR 4.2 — Tournament Shortcuts** — governs proposing a finite repeated sequence and how another Player may interrupt or shorten the shortcut.

## Source → proposition → consequence

1. **Faerie Mastermind Oracle text** → its activated ability causes every Player to draw a card.
2. **Smothering Tithe Oracle text** → each opponent's draw causes a separate Tithe trigger; three opponents drawing creates three triggers.
3. **Orcish Bowmasters Oracle text** → each opponent of Player 2 drawing outside their draw step causes a separate Bowmasters trigger; Player 2 has three opponents, so three triggers are created.
4. **CR 603.3 / 603.3b** → these triggers do not go onto the stack in arbitrary order. Player 2 is active, so Player 2's Bowmasters triggers are put onto the stack first; Player 1 then puts their Tithe triggers above them.
5. The stack resolves last-in, first-out → the Tithe triggers can resolve before any of the buried Bowmasters triggers.
6. **Training Grounds + Faerie Mastermind Oracle text** → Mastermind's activation costs Player 1 {2}.
7. If all three opponents decline to pay for Tithe → Player 1 creates three Treasures, can spend two to activate Mastermind again, and nets one Treasure for that iteration.
8. **CR 117** → Players still receive priority normally; the repeated activations do not deny opponents opportunities to respond.
9. **MTR 4.2** → Player 1 may propose a finite shortcut describing repeated iterations, and opponents may interrupt according to the shortcut rules.

## Decision-critical facts

- It is **Player 2's turn**.
- Player 1 is positioned after Player 2 in turn order for the relevant APNAP ordering.
- Player 2 controls Orcish Bowmasters.
- Player 1 controls Smothering Tithe, Faerie Mastermind, and Training Grounds.
- No opponent pays {2} for the relevant Tithe triggers.
- No Player interrupts the proposed sequence.

Changing the active Player or multiplayer turn order can change the relative placement of the trigger groups and therefore change whether the engine works as described.

## Test-design value

This scenario tests whether the Judge engine can:

- count triggers separately for different opponents;
- delay placement of triggers until the appropriate rules point;
- apply APNAP ordering correctly in multiplayer;
- distinguish trigger creation from stack placement;
- reason across repeated stack states rather than only one resolution;
- identify which facts are decision-critical;
- distinguish a repeatable game sequence from a claim that opponents receive no priority;
- apply tournament-shortcut policy to a proposed repeated sequence;
- recognize counterfactual variants where changing active Player or seating order changes the answer.
