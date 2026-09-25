# Flash / Gaea's Cradle — mana ability during resolution

**Status:** VALIDATED

## Scenario

A player controls four creatures and has **Gaea's Cradle** as their only untapped land. **Flash** is resolving and the player has a creature card in hand.

The player asks whether they can put that creature onto the battlefield with Flash and then tap Gaea's Cradle for five green mana to make the payment requested by Flash.

## Central question

Can a player activate Gaea's Cradle's mana ability during Flash's resolution, after the creature has entered the battlefield but before paying the mana requested by Flash?

## Resolution

Yes.

1. Flash begins resolving.
2. Flash puts the creature card from the player's hand onto the battlefield. It is not cast.
3. Flash then gives the player the option to pay the creature's mana cost reduced by up to {2}.
4. At the point the resolving effect asks for a mana payment, **CR 605.3a** permits the player to activate mana abilities.
5. Gaea's Cradle's activated ability qualifies as a mana ability under **CR 605.1a**.
6. The creature put onto the battlefield by Flash is already on the battlefield at this point. The player therefore controls five creatures.
7. Gaea's Cradle produces five green mana.

## Normative sources

- **CR 605.3a** — permits activation of mana abilities when a rule or resolving spell or ability asks for a mana payment.
- **CR 605.1a** — defines the relevant class of activated mana abilities.
- **Flash — current Oracle text**.
- **Gaea's Cradle — current Oracle text**.

## Reasoning requirement

The engine must model the internal sequence of a resolving effect. It must not treat resolution as an indivisible state in which no player action can ever occur.

It must distinguish this case from effects that explicitly instruct a player to cast a spell during resolution. Flash does not instruct the player to activate Gaea's Cradle; the permission to activate the mana ability comes from **CR 605.3a** because the resolving effect requests a mana payment.

The creature must be counted because it has already entered the battlefield before the payment is requested.

## Test significance

Tests:
- mana abilities during resolution;
- sequencing inside resolution;
- the difference between putting a creature onto the battlefield and casting it;
- dynamic evaluation of Gaea's Cradle's mana production at the moment its ability resolves;
- rule-granted permission versus permission explicitly granted by card text.
