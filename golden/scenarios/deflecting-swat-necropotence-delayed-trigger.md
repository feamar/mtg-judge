# Deflecting Swat / Necropotence — targeting an untargeted delayed trigger

**Status:** VALIDATED BY PROJECT OWNER — 2026-09-26

**Family:** targeting and countering (see `docs/architecture/adr/0017-answer-strategies-and-card-features.md` §6)

## Scenario

A player controls **Necropotence** and paid 1 life several times this turn, exiling cards face down. At the beginning of their end step, Necropotence's delayed triggered abilities trigger and are put on the stack. A player asks:

> Can Deflecting Swat target a Necropotence delayed trigger?

## Central question

Is a delayed triggered ability on the stack a legal target for "target spell or ability", and what does Deflecting Swat do to an ability that has no targets?

## Resolution

Yes, Deflecting Swat can target it, and it has no effect on it.

Once Necropotence's delayed triggered ability has triggered, it is an ability on the stack, and so a legal target for "target spell or ability". That ability has no targets: "that card" is not a target. So there are no targets to choose again. Deflecting Swat resolves without changing anything, and the delayed trigger later resolves normally.

Before the end step, the delayed triggered ability has been created but is not on the stack, so it can't be targeted then.

## Normative sources

- **Necropotence — current Oracle text:** the "Pay 1 life" ability exiles the top card face down and puts it into its controller's hand at the beginning of their next end step.
- **Deflecting Swat — current Oracle text:** it may be cast without paying its mana cost if its controller controls a commander, and lets its controller choose new targets for target spell or ability.
- **CR 603.7, 603.7a** — delayed triggered abilities are created during the resolution of spells or abilities, and don't trigger until created.
- **CR 113.1c** — an activated or triggered ability on the stack is an object.
- **CR 115.2** — spells and abilities can be legal targets for spells that target objects which can't exist on the battlefield.
- **CR 115.1d, 115.10a** — a triggered ability is targeted only if it uses the word "target"; being affected is not being targeted.
- **CR 115.7d** — "choose new targets" lets the player leave any targets unchanged.

All CR references are to the Comprehensive Rules effective 2026-09-25.

## Source → proposition → consequence

1. **Necropotence Oracle text + CR 603.7a** → resolving the "Pay 1 life" ability creates a delayed triggered ability that triggers at the beginning of the next end step → there is nothing to target until it triggers and is put on the stack.
2. **CR 113.1c + CR 115.2** → the triggered ability on the stack is an object that is a spell-or-ability target → it is a legal target for Deflecting Swat.
3. **CR 115.1d + CR 115.10a** → "put that card into your hand" does not use the word "target" → the delayed trigger has no targets.
4. **Deflecting Swat Oracle text + CR 115.7d** → Swat only lets its controller choose new targets, and there are none → Swat resolves with no effect on the trigger; the exiled card still goes to its owner's hand.

## Deciding facts

- The delayed trigger is **on the stack** (it has triggered). If it hasn't, it can't be targeted.
- The targeted ability has **no targets**. Variant: redirecting an ability that *does* have targets gives a different branch.

## Safety / Judge-answer requirement

At Competitive REL the answer states what is legal and what happens. It does not suggest why a player might want to do it (for example, casting Swat to have a legal target for "whenever you cast" effects), because that is play advice. At Regular REL the judge may tell the player that the action won't achieve what they seem to be trying to do (owner decision, 2026-09-26; PRD OQ-32).

## Test significance

Tests abilities created by effects (a card-feature requirement), targeting abilities on the stack, targeted vs untargeted abilities, "choose new targets" with zero targets, and timing (delayed ability created vs triggered).

## Variants to add

- A delayed trigger that *does* have a target → Swat can choose a new legal target.
- Targeting Necropotence's activated ability while it's on the stack → also a legal target with no targets.
- Deflecting Swat cast when no spell or ability is on the stack → it can't be cast, because it needs a legal target (CR 601.2c).
