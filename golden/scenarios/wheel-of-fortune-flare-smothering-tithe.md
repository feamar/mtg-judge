# Wheel of Fortune / Flare of Duplication / Smothering Tithe

**Source validation:** SOURCE CHECK REQUIRED

## Status
**Source validation: SOURCE CHECK REQUIRED**
Requirements-elicitation scenario based on a real Judge Call described by the project owner.

## Player account
A Player reports that they cast `Wheel of Fortune` and then cast `Flare of Duplication`, creating a copy of Wheel of Fortune while controlling `Smothering Tithe` and `Horn of Gondor`/a card referred to in the call as “Horn of Hornfell”.

The reported sequence was approximately:

1. The copied Wheel of Fortune resolved.
2. Players drew cards.
3. The active Player exiled the seven cards they had drawn to the referenced Horn effect.
4. The original Wheel of Fortune then resolved.
5. The Player exiled five cards from their hand.
6. The Player subsequently cast some cards.
7. The Player then realized that Smothering Tithe triggers had not been handled and asked whether they could still be put onto the stack.

The Player characterized these as “28 missed triggers”. That characterization is a claim to validate, not an established rules conclusion.

## Observed / externally established facts
During the actual Judge Call, the Judge asked the Players to stream the table.

From the visible board/game state, the Judge established that one Player from the original four-player pod had already been knocked out. The Smothering Tithe controller therefore had two remaining opponents.

This visual evidence allowed the Judge to establish the relevant number of opponent card draws from the two resolved Wheel effects without asking the Players to recount them.

## Decision-critical investigation
After reconstructing the reported sequence, the Judge asked whether the description covered everything that had happened and, critically:

- Were the subsequently cast cards cast with flash / while the stack was still occupied?
- Had the stack become empty at any point after the triggers should have triggered?

The purpose of these questions was not generic fact gathering. The suspected primary infraction was Missed Trigger, and the applicable IPG branch made whether the stack had become empty decision-critical.

## Judge-reasoning pattern captured by this scenario
The Judge first forms a hypothesis about the primary infraction, then investigates specifically to establish whether that hypothesis is correct and which policy branch applies.

The investigation should therefore be policy-directed rather than questionnaire-driven.

Where multiple infractions may have occurred, the Judge identifies the first relevant infraction in the sequence and handles the situation according to the applicable policy.

## Requirements learned from the scenario
This scenario supports the following system behavior:

- Accept a free-form Player account that may mix facts, terminology, arithmetic, and rules conclusions.
- Request visual evidence when it can resolve uncertainty more efficiently than further verbal questioning.
- Distinguish Reported Facts, Observed Facts, and Derived Facts.
- Derive facts from visible game state when the derivation is rules-valid and sufficiently supported.
- Do not accept a Player's statement such as “I have 28 missed triggers” as either the trigger count or the infraction classification without validation.
- Identify the likely applicable rule/policy or primary infraction before choosing follow-up questions.
- Ask follow-up questions that discriminate between materially different rules/policy outcomes.
- Reconstruct whether the stack became empty when that fact controls the applicable Missed Trigger remedy.
- Base the final Ruling on current normative rules/policy, not on common Player heuristics or misconceptions.
- Treat historical/real Judge Calls as illustrative material for interaction and reasoning patterns, not as normative authority.

## Normative references
The current CR, MTR, IPG, Oracle card data, and applicable event policy control. This scenario does not itself define the Missed Trigger policy.

## Source validation
**Status: SOURCE CHECK REQUIRED**

### Candidate normative trace
- **Current Oracle text — Smothering Tithe** → each opponent drawing a card creates the relevant triggered ability → establishes which draw events generate triggers.
- **CR 603.2** → triggered abilities trigger whenever their trigger event occurs → supports deriving the trigger count from opponent draws rather than accepting the Player's stated count.
- **IPG 2.1 — Missed Trigger** → defines when a triggered ability is considered missed and supplies the tournament-policy remedy → controls classification and whether/how a missed trigger may later be placed on the stack.
- **IPG 2.1 remedy provisions concerning the point at which the trigger was missed and subsequent game progression** → whether the stack remained occupied / became empty is decision-critical to the remedy described in this Judge Call → supports asking specifically about flash casts and whether the stack ever became empty.
- **CR 117.4** → distinguishes all players passing with a nonempty stack (top object resolves) from all players passing with an empty stack (phase/step ends) → supports reconstructing what “the stack became empty” does and does not imply about priority progression.

**Source-check note:** the exact current IPG 2.1 subparagraph implementing the stack-empty branch described by the project owner should be verified verbatim before this scenario is promoted from SOURCE CHECK REQUIRED.