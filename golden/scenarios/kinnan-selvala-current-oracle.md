# Kinnan and Selvala — current Oracle text

**Source validation:** SOURCE CHECK REQUIRED

## Judge Call

A Player controls **Kinnan, Bonder Prodigy** and **Selvala, Explorer Returned**.

The Player asks whether tapping Selvala produces one mana or two when one nonland card is revealed from the top of the libraries.

After being told that Kinnan does not add an additional mana, the Player asks for a clearer explanation of why.

## Expected Judge answer

With current Oracle text, Selvala's activated ability is not a **mana ability**.

The important distinction is between an ability that *produces mana* and a **mana ability** as defined by the Comprehensive Rules. Selvala's ability can produce mana when it resolves, but because it is not a mana ability, tapping Selvala to activate it is not **tap for mana** for Kinnan's triggered ability.

Therefore Kinnan does not trigger.

If exactly one nonland card is revealed, Selvala produces one mana and Kinnan produces no additional mana: **one mana total**.

## Explanation pattern

A useful Player-facing explanation should explicitly distinguish:

- “this ability produces mana”; from
- “this is a mana ability.”

The system should explain that Selvala is tapped to activate an ability that uses the stack. When that ability later resolves it may produce mana, but that does not retroactively make the activation a **tap for mana** event for Kinnan.

## Why this scenario matters

This scenario tests whether the system:

- uses **current Oracle text** rather than relying on historical card behavior;
- understands the formal CR meaning of **mana ability** and **tap for mana**;
- does not infer that every ability producing mana is a mana ability;
- can expand a correct short Ruling into a clearer explanation when the Player asks “why?”;
- preserves CR-derived terminology in English in otherwise Dutch conversation.

## Normative dependencies

- Current Oracle text for Kinnan, Bonder Prodigy
- Current Oracle text for Selvala, Explorer Returned
- Comprehensive Rules definitions governing **mana ability**, activated abilities, and **tap for mana**

Current normative sources control if this scenario summary becomes outdated.

## Source validation
**Status: SOURCE CHECK REQUIRED**

### Candidate normative trace
- **Current Oracle text — Selvala, Explorer Returned** → the activated ability includes revealing cards from libraries and can produce mana on resolution → establishes the actual current ability being evaluated.
- **CR 605.1a (current post–August 2026 wording)** → the current mana-ability definition excludes this Selvala ability → Selvala's activated ability is not a mana ability and uses the stack.
- **CR 106.12** → “tap [a permanent] for mana” requires activation of a mana ability with the tap symbol in its cost → tapping Selvala to activate this non-mana ability is not tapping Selvala for mana.
- **Current Oracle text — Kinnan, Bonder Prodigy** → Kinnan requires a nonland permanent to be tapped for mana → Kinnan does not trigger.
- **August 10, 2026 Magic: The Gathering | The Hobbit Update Bulletin** → documents the change to CR 605.1a and affected Oracle/rules behavior → supports the version-sensitivity of this scenario, while the current CR remains authoritative.