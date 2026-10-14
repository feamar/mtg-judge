# Kinnan and Deathrite Shaman

**Source validation:** VALIDATED BY PROJECT OWNER — 2026-09-28

## Judge Call

A Player controls **Kinnan, Bonder Prodigy** and taps **Deathrite Shaman** to activate its first ability, exiling a land card from a graveyard.

The Player asks whether this produces one mana or two.

## Expected Judge answer

It produces **one mana**.

Deathrite Shaman's first activated ability targets a land card in a graveyard. It is therefore not a **mana ability**. Although Deathrite Shaman is tapped and the resolving ability produces mana, this is not **tap for mana** in the sense required by Kinnan.

Kinnan therefore does not trigger.

## Why this scenario matters

This scenario tests whether the system distinguishes ordinary-language reasoning — “I tapped this permanent and got mana” — from the formal CR meaning of **mana ability** and **tap for mana**.

The system should reason from the defined rules terms rather than pattern-matching only on the physical action of tapping and the eventual production of mana.

## Normative dependencies

- Current Oracle text for Kinnan, Bonder Prodigy
- Current Oracle text for Deathrite Shaman
- Comprehensive Rules definitions governing **mana ability** and **tap for mana**

Current normative sources control if this scenario summary becomes outdated.

## Source validation
**Status: SOURCE CHECK REQUIRED**

### Candidate normative trace
- **Current Oracle text — Deathrite Shaman** → its first ability targets a land card in a graveyard → the ability has a target.
- **CR 605.1a** → an activated ability can be a mana ability only if it meets the rule's mana-ability conditions, including not requiring a target → Deathrite Shaman's first ability is not a mana ability.
- **CR 106.12** → “tap [a permanent] for mana” means activating a mana ability of that permanent that includes the tap symbol in its activation cost → activating Deathrite Shaman's first ability is not tapping it for mana.
- **Current Oracle text — Kinnan, Bonder Prodigy** → Kinnan triggers only when a nonland permanent is tapped for mana → Kinnan does not trigger; only Deathrite Shaman's resolving effect produces mana.