# Forgotten untap discovered later in the same turn

**Source validation:** VALIDATED BY PROJECT OWNER — 2026-09-28

## Judge Call

A Player reports that their opponent drew a card and began casting spells, then realized that a land that should have untapped during the untap step was never untapped.

The initial spoken description may ambiguously sound like the Player says the land was “not tapped.” The intended fact is that the land was **not untapped**.

## Expected Judge answer

If the permanent should have untapped during the untap step and the error is discovered during the same turn, apply the applicable IPG partial fix: **untap it now**.

The intervening draw and subsequent spells do not by themselves prevent this specific partial fix.

## Interaction lesson

This scenario also records an important failure mode: a materially ambiguous fact must not be silently interpreted when different interpretations lead to different rules or policy branches.

If the input could plausibly mean either “the land was not tapped” or “the land was not untapped,” the system should clarify the intended fact before constructing a Ruling.

## Why this scenario matters

It tests whether the system:
- recognizes a specific IPG partial fix;
- does not assume that intervening game actions automatically prevent that fix;
- detects ambiguity in a rules-critical fact;
- asks for clarification rather than confidently reasoning from a potentially incorrect interpretation.

## Normative dependencies

- Current IPG section governing Game Rule Violation and applicable partial fixes.

The current IPG controls if this scenario summary becomes outdated.

## Source validation
**Status: SOURCE CHECK REQUIRED**

### Candidate normative trace
- **IPG 2.5 — Game Rule Violation, Additional Remedy / partial fixes** → when a Player forgot to untap one or more permanents at the start of their turn and it is still that same turn, those permanents are untapped → the land is untapped now rather than requiring a general backup.
- **IPG 2.5** → this is an enumerated partial fix → intervening game actions such as the draw and later spells do not by themselves eliminate this specific fix while its stated conditions remain satisfied.