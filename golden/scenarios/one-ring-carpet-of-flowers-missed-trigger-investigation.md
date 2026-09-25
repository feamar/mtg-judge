# Scenario — The One Ring, Carpet of Flowers, and Missed Trigger Investigation

**Source validation:** VALIDATED

## Initial Judge Call

A Player calls a Judge and reports:

> Player 2 cast The One Ring, then cast another spell and passed the turn. I later cast a spell targeting Player 2 and they said “okay.” It is now Player 4's turn. Player 4 is trying to cast a spell targeting Player 2, and Player 2 has now remembered that The One Ring trigger gave them protection from everything. What should we do?

## Relevant established facts

- Player 2 cast The One Ring.
- The One Ring's enters-the-battlefield triggered ability should therefore have triggered.
- Player 2 later allowed a spell or ability from Player 3 to target them.
- The game progressed to Player 4's turn.
- Player 2 then asserted that they had protection from everything from The One Ring trigger.

## Initial reasoning path

The primary rules/policy hypothesis is Missed Trigger.

The One Ring trigger changes the rules of the game by giving its controller protection from everything until their next turn. Under Missed Trigger policy, the controller must demonstrate awareness at the appropriate point, including preventing an opponent from taking an action that would be illegal if the trigger had resolved.

Allowing Player 3 to target Player 2 is therefore material evidence for determining whether awareness was demonstrated.

The objective Missed Trigger determination must be kept separate from any question of Player knowledge or intent.

## Investigation branch

The initial facts can look suspicious because Player 2 allowed one Player to target them and later invoked protection when another Player attempted to target them.

The app must not accuse the Player of Cheating or disclose an internal integrity hypothesis.

If the circumstances create a meaningful possibility of intentional wrongdoing, the app should investigate only while doing so will not compromise a human investigation. If that boundary is reached, it must neutrally instruct the Players to call a human Judge.

### Additional fact revealed during investigation

The earlier targeting effect was **Carpet of Flowers**.

Player 2 explains that they did not realize Carpet of Flowers targets an opponent.

## Required hypothesis revision

This explanation is relevant to intent but does not change the objective Missed Trigger determination.

Player 2's failure to realize that Carpet of Flowers targeted them can explain why they failed to stop the illegal targeting action. It therefore weakens the inference that Player 2 knowingly allowed one opponent to target them while later attempting to apply protection selectively.

The system must update its integrity hypothesis rather than remain anchored to the initial suspicious-looking pattern.

## Expected Judge-engine behavior

1. Reconstruct the sequence of events.
2. Identify The One Ring trigger as the likely primary rules/policy issue.
3. Determine the Missed Trigger question from objective game actions.
4. Keep infraction classification separate from Player intent.
5. Notice that the apparently selective application of protection may justify investigation.
6. Ask neutral, decision-relevant questions without revealing a Cheating hypothesis.
7. Incorporate the Carpet of Flowers explanation.
8. Revise the integrity hypothesis based on the new evidence.
9. Continue with the appropriate Missed Trigger policy analysis if no human-only investigation remains necessary.
10. If intentional wrongdoing still reasonably requires investigation, stop automated handling and request a human Judge.
11. Preserve the full investigation trail for authorized Judge handoff while keeping protected hypotheses hidden from Players.

## Architectural / product requirements exercised

- Structured timeline reconstruction.
- Reported versus derived facts.
- Policy-directed questioning.
- Objective infraction analysis separated from knowledge/intent.
- Multiple concurrent hypotheses.
- Hypothesis revision after new evidence.
- Protected integrity-escalation state.
- Player-facing versus Judge-facing information separation.
- Human Judge handoff.
- Reproducible investigation audit trail.

## Validated normative source chain

- Current Oracle text — **The One Ring**: establishes the triggered ability that grants protection from everything until its controller's next turn.
- **CR 702.16 — Protection**: establishes the relevant consequences of protection, including the targeting restriction.
- **IPG 2.1 — Missed Trigger**: establishes the awareness requirement for a triggered ability that changes the rules of the game and governs the Missed Trigger determination.

### Source → proposition → consequence

1. **The One Ring Oracle text** → the relevant triggered ability would give Player 2 protection from everything until their next turn.
2. **CR 702.16** → while that protection applies, an opponent cannot legally target Player 2 in the prohibited way.
3. **IPG 2.1** → because the trigger changes the rules of the game, Player 2 must demonstrate awareness at the point required by policy, including preventing an opponent from taking an action that would be illegal if the trigger had resolved.
4. Player 2 allowed Player 3's targeting action to proceed → Player 2 failed to demonstrate the required awareness → the objective policy analysis is **Missed Trigger**.
5. Whether Player 2 knew that **Carpet of Flowers** targets an opponent may change the assessment of knowledge or intent, but does **not** retroactively change the Missed Trigger determination.

**Carpet of Flowers Oracle text** is relevant factual support for reconstructing and investigating the call, but is not part of the core normative source chain.

No specific Cheating infraction is pre-classified in this scenario. If later evidence supports an intentional-violation hypothesis, the appropriate IPG provision must be evaluated at that point.

## Test-design notes

This scenario should eventually exist as a family of controlled variants.

Examples:

- Player 2 knew Carpet of Flowers targeted them.
- Player 2 did not know it targeted them.
- Player 2 explicitly acknowledged The One Ring trigger earlier.
- No earlier targeting action occurred.
- The later action is not actually prohibited by protection.
- Additional evidence strengthens an intentional-violation hypothesis.
- Additional evidence resolves the integrity concern completely.

The test suite should verify not only the final Ruling but also whether the system asks the correct questions, revises hypotheses correctly, avoids disclosing protected suspicions, and escalates at the appropriate boundary.
