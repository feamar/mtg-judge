# Etali — casting spells during resolution

**Source validation:** VALIDATED BY PROJECT OWNER — 2026-09-28

## Status
**Source validation: VALIDATED BY PROJECT OWNER — 2026-09-23**
Requirements-elicitation scenario for rules reasoning around priority, timing permissions, the stack, and casting spells during the resolution of an ability.

## Player question
In a Commander game, a Player casts Etali, Primal Conqueror. Etali's triggered ability reveals/exiles cards that include a creature, a sorcery, and an artifact. The Player asks whether those cards can be cast even though they normally could not be cast at this moment, how they are put onto the stack, and in what order.

## Expected Judge explanation
The cards may be cast because Etali's resolving ability gives the Player permission to cast them during that resolution.

The Player does not receive priority in order to cast those spells. The permission comes from the resolving ability itself.

The Player chooses the order in which to cast the eligible cards. Each spell is cast normally and is put on top of the stack. Etali's triggered ability is still resolving and remains below those spells on the stack until its resolution is complete.

Nothing resolves between those casts merely because another spell has been put onto the stack. Players do not receive priority between the casts. After Etali's ability finishes resolving, the game performs the rules processing required before priority is granted, and the active player receives priority.

Example: if the Player casts the creature first, then the sorcery, then the artifact, the stack after Etali's ability has finished resolving has the artifact spell above the sorcery spell above the creature spell.

## Concept learned
Having priority is not a necessary condition for casting a spell when a resolving spell or ability instructs or permits a Player to cast that spell.

The system must distinguish:
- ordinary casting enabled by having priority and satisfying applicable timing rules; from
- casting enabled by a permission or instruction created by a resolving spell or ability.

## Requirements learned
- Do not infer that a Player must have priority whenever a spell is cast.
- Identify the source of the permission to cast.
- Model spells cast during the resolution of another object as being placed on the stack above that still-resolving object.
- Do not insert priority windows between actions performed as part of one resolution unless the rules explicitly create one.
- Explain the resulting stack order from the actual order in which the Player chooses to cast the spells.
- Use current Oracle text and the Comprehensive Rules as normative sources.

## Related concept
`concepts/priority.md`

## Source validation
**Status: VALIDATED BY PROJECT OWNER — 2026-09-23**

### Candidate normative trace
- **Current Oracle text — Etali, Primal Conqueror** → its triggered ability explicitly permits the exiled nonland cards to be cast without paying their mana costs → creates the exceptional permission used during resolution.
- **CR 117.2e** → spells/abilities may instruct or allow a player to cast a spell or activate an ability while another spell or ability is resolving → the Player does not need priority for the Etali casts.
- **CR 601.2** → casting a spell is a defined process and the spell is placed on the stack as part of casting → each chosen Etali spell is cast, not merely “put” onto the stack.
- **CR 608.2** together with **CR 117.3b** → Etali's ability completes its resolution before priority is granted; after resolution the active player receives priority → no ordinary priority window is inserted between the permitted casts.

## Validated normative mapping

- **CR 608.2g** → an effect may instruct or allow a Player to cast a spell as part of a resolving spell or ability → Etali permits the revealed spells to be cast while its triggered ability is resolving.
- **CR 117.2e** → resolving spells or abilities may instruct Players to make choices or take actions even though they do not have priority → the Player does not need priority to cast the spells Etali permits during resolution.
- **CR 601.2a and CR 601.2** → each selected card is actually cast using the spell-casting process and is put onto the stack → the revealed cards are not merely placed onto the stack.
- **CR 117.3b** → after a spell or ability resolves, the active player receives priority → after Etali's triggered ability has completely finished resolving, the active player receives priority.

### Source → proposition → consequence

**CR 608.2g + CR 117.2e →** Etali gives an explicit permission to cast spells during the resolution of its triggered ability → those spells may be cast at that time without the Player having priority, despite their ordinary type-based timing permissions.

**CR 601.2 →** the permitted cards are cast as spells → each spell is put onto the stack through the normal casting process, in the order chosen by the Player.

**Resolution rules + Etali's instruction →** Etali's triggered ability remains in the process of resolving while those spells are cast → none of the newly cast spells resolves between those casts.

**CR 117.3b →** the active player receives priority only after Etali's triggered ability has finished resolving → only then can Players begin passing priority toward resolving the spells now on the stack.
