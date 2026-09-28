# ADR-0021: Floor-judge model: major infractions go to a human judge

Status: Proposed · Date: 2026-09-27 · Requirements: P1, P3, D3, D6, FR-POL-1..3, FR-ESC-1..5, OQ-7, OQ-14, OQ-36 · Extends: ADR-0008, ADR-0009, ADR-0020

## Context

At tournaments, floor judges hand every major infraction to the head judge. The owner decided on 2026-09-27 that the bot follows that practice:

> "We are mostly here to help, not dish out punishment, but we do want to detect punishable situations and in Competitive REL we want to then inform a human judge."

**Policy basis, checked on 2026-09-27:**

- **MTR 1.7:** the head judge ensures all violations are dealt with, gives the final ruling on appeals, and treats investigations that may lead to disqualification as among their most important tasks.
- **IPG 1:** only the head judge may deviate from the penalty guidelines.

Neither document reserves Game Loss or higher penalties for the head judge. So "hand off all major infractions" is **the owner's decision, modelled on common judge practice**, and not a policy requirement.

## Decision

**1. Roles.** The bot acts as a **floor judge**. The event's human judges (the judge role, FR-CTX-1) act as the **head judge**.

**2. What the bot handles itself:**

- rules questions;
- game fixes;
- infractions whose **base penalty after the event's framework is a Warning or less** (No Penalty, Warning). For these it explains and teaches (P1, FR-POL-2), labels the penalty as the base penalty, and copies it to the judge-only channel (FR-POL-3).

**3. Major infractions go to a human judge.** "Major" means any infraction whose base penalty after the framework is **more severe than a Warning**:

- Turn Skip (the MTRA's replacement for Game Loss, and MTRA penalties such as Slow Play or Unsporting Conduct — Minor);
- Game Loss, Match Loss, Disqualification;
- **any suspected Unsporting Conduct — Cheating**, Bribery and Wagering, Improperly Determining a Winner, Aggressive Behavior or Theft, whatever its later outcome.

**For a major infraction, the bot:**

- **detects** it: severity is data on the `PenaltyRow` of the event's framework, and integrity signals come from procedures (ADR-0008);
- **investigates** until the facts that are useful and cheap to collect are gathered (FR-ESC-2), except that integrity cases stop as soon as more questions could compromise a human investigation (FR-ESC-4, ADR-0009);
- **doesn't announce a penalty to players.** Players get the owner's neutral handoff message, not a verdict: *"Please pause the game and call a human Judge. Keep the current game state unchanged until they arrive."* (ADR-0022 §5) (FR-ESC-5, P3);
- **hands off** to the judge-only channel (FR-ESC-3): a summary, established and disputed facts, citations, the **candidate infraction and its base penalty from the framework's table** as a *recommendation*, the proposed fix, and why it was handed off. Integrity cases add staff-only investigation notes.

The human judge decides, issues the penalty, and closes the case. The bot records it.

**4. REL.** This applies at Competitive REL, which is the only REL in the MVP. At Regular REL (JAR, post-MVP) the handling will differ, because JAR is about education rather than penalties (to be designed with the JAR framework).

**5. Configuration.** `EventContext.escalation.humanThreshold`, default `above-warning`, confirmed by the owner on 2026-09-27, including MTRA Turn Skips. It's part of OQ-7's "categories that always escalate", and the owner has now set it. It's a threshold on penalty severity, not a list of infractions, so new frameworks work automatically.

**6. The neutral integrity question** (for example *"Was anything discussed or agreed before the concessions?"*) is asked **only when something else already looks off**: an integrity signal in the facts (OQ-14), never routinely (owner, 2026-09-27).

## Consequences

- The bot never hands out a harsh penalty by itself. What players experience from the bot stays help-first (P3), while every punishable situation still reaches a human, with the facts gathered.
- FR-POL-1's table lookup stays deterministic. Its result is either *issued* (Warning or less) or *recommended* to the human (more severe).
- **PRD impact:** FR-ESC-1 gains a trigger, "(f) the infraction's base penalty is more severe than a Warning", and FR-POL-1/3 limit the penalties the bot issues itself to Warning or less. OQ-36 asks the PM to add this.
