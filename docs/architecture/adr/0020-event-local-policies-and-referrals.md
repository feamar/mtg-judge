# ADR-0020: TO-configured event policies, and referring event-management actions to the TO

Status: Proposed · Date: 2026-09-27 · Requirements: §5, D8, D21, NG1, FR-CTX-1, FR-CTX-3, FR-RUL-9, FR-POL-1, FR-POL-3, OQ-35

## Context

In the owner's online league:

- two players conceded "at instant speed" while an opponent was presenting a typical win line (Underworld Breach, Lion's Eye Diamond, Brain Freeze), without waiting for the actual win. That's common online: people want to get back to their lives;
- the win line didn't work, and its player lost to Final Fortune's delayed trigger;
- under MTRA 2.5 the two conceders would be dropped from the event. The TO and judges **softened** this to "you win, and nobody is dropped", **by discretion, without policy backing**.

The AI judge must not make up rulings (FR-RUL-9), so it can't exercise that kind of discretion by itself. The owner decided (2026-09-27) on **local rules plus referring drops**.

## Decision

**1. Event policies are data in the event context**, set by the TO (FR-CTX-1 extension; OQ-35):

```
EventPolicy { policyId, text: I18nKey /* player-facing wording */, amends: SectionId /* e.g. "MTRA:2.5" */,
              when: Predicate /* over case facts, e.g. concededAtInstantSpeed && facingPresentedWinLine */,
              effect: "replace-consequence" | "waive-consequence" | "add-guidance",
              setBy: toUserId, setOn: date }
```

- **They can only amend tournament policy** (the MTR, the IPG, or the event's addendum), never game rules (CR, Oracle). This follows §5's precedence: policy frameworks don't change the CR. The context editor rejects a policy whose `amends` points into the CR.
- **They are applied deterministically** when their `when` predicate holds on the established facts, and they are **cited** like any source: *"Event policy (set by the TO): online-concession-leniency"*.
- They are versioned with the event context and recorded on every case that used them (NFR-VER-1).
- Deciding facts that a policy's `when` needs, such as "was a win line being presented?", are added to the relevant procedure as `FactSpec`s. So the judge asks for them only when an active policy could change the outcome (FR-INV-3).

**2. Event-management actions are referred to the TO, never announced by the judge** (NG1, FR-CTX-3). These are:

- dropping a player from the event;
- re-entry;
- changes to reported results beyond the game outcome.

When policy points to such an action and **no** event policy covers the case:

- **Players get** the game result, plus a neutral template: *"I've passed a note to the tournament organizer about the concessions."*
- **The judge-only channel gets:** the facts, the policy text (for example MTRA 2.5), and *"Your decision: MTRA 2.5 drop for P2 and P3?"*. The TO decides and acts.
- The case is not escalated for that alone. The game question is fully answered.

**3. Discretion stays human.** Anything not written down as an event policy isn't softened by the judge. The TO can turn a recurring discretionary ruling into an event policy, so the judge applies it next time.

## Consequences

- The judge matches the league's real practice where the TO has written it down, and stays strict-but-referred everywhere else.
- Referral keeps the bot out of event management (NG1), while the TO gets everything needed to decide.
- **New PRD content:** the event context gains `eventPolicies` (FR-CTX-1), and a referral rule for event-management consequences. OQ-35 asks the PM to add both.
