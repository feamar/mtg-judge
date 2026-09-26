# Pact of Negation — targeting a spell that can't be countered

**Status:** VALIDATED BY PROJECT OWNER — 2026-09-26

**Family:** targeting and countering (see `docs/architecture/adr/0017-answer-strategies-and-card-features.md` §6)

## Scenario

An opponent casts a spell that can't be countered. A player casts **Pact of Negation** targeting it, and asks:

> If a spell is uncounterable and I attempt to counter it with Pact of Negation, do I get the delayed trigger in my next upkeep? Or does Pact of Negation fizzle?

## Central question

Is an uncounterable spell a legal target for "counter target spell"? If Pact of Negation fails to counter it, is its upkeep trigger still created?

## Resolution

Pact of Negation does not fizzle, and yes, the delayed trigger is created. At the beginning of its controller's next upkeep they must pay {3}{U}{U} or lose the game.

"Can't be countered" does not stop a spell from being targeted. The target is legal, so Pact of Negation resolves. Its instruction to counter the spell does nothing, and the rest of its text still happens, creating the delayed triggered ability.

**Contrast variant:** if Pact of Negation is itself countered, or doesn't resolve because its target has become illegal (for example, the spell has already left the stack), the delayed triggered ability is never created, and nothing has to be paid.

## Normative sources

- **Pact of Negation — current Oracle text:** counters target spell; at the beginning of its controller's next upkeep they pay {3}{U}{U} or lose the game.
- **Pact of Negation — official ruling (2021-03-19):** if Pact resolves with a legal target but fails to counter that spell, most likely because it can't be countered, the delayed trigger still triggers.
- **Pact of Negation — official ruling (2021-03-19):** if Pact is countered or otherwise doesn't resolve, for instance because its target became illegal, the delayed trigger won't trigger.
- **Abrupt Decay — official ruling (2021-03-19):** a counterspell can still target an uncounterable spell; the spell isn't countered, but the counterspell's other effects still happen.
- **CR 113.6g** — an ability stating that an object can't be countered functions on the stack.
- **CR 608.2b** — a spell doesn't resolve only if all its targets are illegal.
- **CR 608.2c** — instructions are followed in the order written.
- **CR 101.2** — when an effect directs something to happen and another says it can't, the "can't" takes precedence.
- **CR 609.3** — an effect that attempts something impossible does only as much as possible.
- **CR 603.7, 603.7a** — delayed triggered abilities are created during resolution.

All CR references are to the Comprehensive Rules effective 2026-09-25.

## Source → proposition → consequence

1. **Pact of Negation Oracle text** → it targets a spell → a spell that can't be countered is still a spell, and "can't be countered" is not a targeting restriction → the target is legal.
2. **CR 608.2b** → Pact has a legal target → Pact resolves; it does not fizzle.
3. **CR 608.2c + CR 101.2 + CR 113.6g + CR 609.3** → "counter target spell" is overridden by "can't be countered" and does nothing → Pact continues with the rest of its text.
4. **CR 603.7a + Pact Oracle text** → resolving Pact creates the upkeep delayed triggered ability → at its controller's next upkeep they must pay {3}{U}{U} or lose the game.
5. **Official Pact of Negation ruling** → states the same outcome directly → it is the deterministic answer source for this question (ADR-0017 §5).

## Deciding facts

- The target is still a legal target when Pact resolves. If not → the contrast variant: Pact doesn't resolve, and there is no trigger.
- Pact itself is not countered. If it is → no trigger.

## Safety / Judge-answer requirement

At Competitive REL the answer states what happens (Pact resolves, the counter fails, the upkeep payment is required). It does not comment on whether casting Pact this way is a good idea, because that is play advice. At Regular REL the judge may point out that Pact won't counter the spell but will still require the payment (owner decision, 2026-09-26; PRD OQ-32).

## Test significance

Tests the difference between "can't be countered" and targeting restrictions, resolution with a legal target, partial effects ("does as much as possible"), delayed triggers created during resolution, and official card rulings as an answer source.

## Variants to add

- The player wants to counter a *triggered or activated ability* with Pact → not a legal target, because Pact only targets spells (CR 113.9).
- The uncounterable spell leaves the stack before Pact resolves → Pact's target is illegal, Pact doesn't resolve, and there is no trigger.
- Mana Drain against an uncounterable spell → you still get the mana, per Mana Drain's own official ruling (2020-11-10). This is case `tc-09`.
