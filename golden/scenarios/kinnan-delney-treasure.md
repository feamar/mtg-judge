# Kinnan, Delney, and Treasure

**Source validation:** VALIDATED BY PROJECT OWNER — 2026-09-28

## Judge Call

A Player controls **Kinnan, Bonder Prodigy** and **Delney, Streetwise Lookout** and sacrifices a Treasure for blue mana.

The Player asks how much mana they get in total.

## Expected Judge answer

The Player gets **three blue mana total**.

The Treasure's mana ability produces one blue mana. Because the Treasure is a nonland permanent that was **tapped for mana**, Kinnan's triggered mana ability triggers.

Kinnan is a creature with power 2, so Delney causes Kinnan's triggered ability to trigger an additional time.

The result is:

- one blue mana from the Treasure;
- one additional blue mana from the first Kinnan trigger;
- one additional blue mana from the additional Kinnan trigger caused by Delney.

Total: **three blue mana**.

## Why this scenario matters

This scenario combines several rules concepts:

- **tap for mana**;
- a **triggered mana ability**;
- an effect that causes a triggered ability to trigger an additional time;
- recognizing that Delney cares about the characteristics of the creature whose ability triggered.

It tests whether the system can compose multiple individually understood rules interactions into one Ruling.

## Normative dependencies

- Current Oracle text for Kinnan, Bonder Prodigy
- Current Oracle text for Delney, Streetwise Lookout
- Current rules text for Treasure tokens
- Comprehensive Rules governing **mana abilities**, **triggered mana abilities**, and additional triggering

Current normative sources control if this scenario summary becomes outdated.

## Source validation
**Status: SOURCE CHECK REQUIRED**

### Candidate normative trace
- **CR 111.10a** → defines a Treasure token and its `{T}, Sacrifice this token: Add one mana of any color` ability → the Treasure can be tapped and sacrificed for one blue mana.
- **CR 605.1a** → the Treasure ability qualifies as an activated mana ability → it is a mana ability.
- **CR 106.12** → activating that mana ability with `{T}` is tapping the Treasure for mana → satisfies Kinnan's trigger condition.
- **Current Oracle text — Kinnan, Bonder Prodigy** → Kinnan's triggered ability produces one additional mana of the type produced → one Kinnan trigger would add one blue mana.
- **Current Oracle text — Delney, Streetwise Lookout** and **CR 603.2d** → a triggered ability of a creature with power 2 or less triggers an additional time → Kinnan's ability triggers twice because Kinnan has power 2.
- **Arithmetic consequence** → 1 blue from Treasure + 1 blue + 1 blue from the two Kinnan triggers = 3 blue mana total.