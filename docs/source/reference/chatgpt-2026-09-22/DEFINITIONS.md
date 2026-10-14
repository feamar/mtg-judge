# MTG Judge App — DEFINITIONS.md

## Status

Working canonical project glossary.

Formal Magic rules and policy terms should, where possible, be taken from the Comprehensive Rules (CR), Magic Tournament Rules (MTR), or Infraction Procedure Guide (IPG). This file should not silently redefine a formal Magic term.

For source-defined terms, the normative source controls if this file's summary is incomplete.

Last consolidated: 2026-09-22 (Europe/Amsterdam)

---

## Project Actors and Project-Specific Terms

### Player

A person participating in a Magic: The Gathering game for which the system may provide Judge assistance.

A Player is currently participating in the relevant game.

### Eliminated Player

A person who participated as a Player in the current multiplayer game, has since left that game as a result of losing or otherwise leaving the game, but remains present and may still interact with the system.

An Eliminated Player is distinct from a Spectator because the Eliminated Player previously participated in the same game.

### Spectator

A person observing the relevant game who is not currently a Player and did not participate in that game as an Eliminated Player.

Where the MTR provides a formal definition or responsibilities for Spectators, the MTR controls.

### Judge

A human person authorized within the relevant event or tournament context to investigate situations, interpret applicable rules and policy, and issue Rulings.

The term “Judge” in project documentation refers to a human actor unless explicitly stated otherwise.

### Appeals Judge

A Judge authorized to evaluate a game situation after a Player appeals a Ruling given by another Judge and to issue a final Ruling on that situation.

### Head Judge

The Judge who is the final authority for the handling and resolution of Judge Calls at an Event, regardless of the size of that Event.

Where the MTR gives a more specific formal definition, the MTR controls.

### Judge Call

A situation arising during a game in which one or more Players request assistance because, for example:

- a Player may have acted incorrectly, intentionally or unintentionally;
- a rule or tournament policy may have been interpreted or applied incorrectly; or
- a Player requests information about what the applicable rules or tournament policy state regarding a current or possible future situation.

During a Judge Call, a Judge may investigate the situation, explain and apply rules and tournament policy, and issue a Ruling.

A Judge must not provide Play Advice or improperly reveal information to a Player.

### Ruling

A clarification of the applicable rules or tournament policy in response to a Player's question, or the application of the Infraction Procedure Guide to an incorrect game or tournament situation.

### Appeal

A request by a Player who has received a Ruling from a Judge for another authorized Judge to evaluate the same situation.

The purpose is re-evaluation of the situation, not an assumption that the original Ruling was wrong.

### Reported Fact

A factual claim supplied by a Player or other participant during a Judge Call.

Reported Facts may be inaccurate and require validation.

### Observed Fact

A fact established directly from evidence available to the system, such as a photo, video stream, visible board state, or other reliable observation.

### Derived Fact

A fact inferred from Reported Facts and/or Observed Facts by applying valid Magic rules, card text, policy, arithmetic, or other sound reasoning.

---

## Formal Magic Terms — Normative Source Required

The following terms already exist in Magic rules/policy and should be sourced from the indicated normative document rather than independently redefined by the project.

### Hidden Information

Source: MTR.

Use the current MTR definition.

### Private Information

Source: MTR.

Use the current MTR definition.

### Free Information

Source: MTR.

Use the current MTR definition.

### Derived Information

Source: MTR.

Use the current MTR definition.

### Play Advice

Project meaning must remain consistent with applicable MTR/IPG restrictions and Judge policy.

For this project, Play Advice includes tactical or strategic guidance that could influence a Player's game decisions, whether provided intentionally or unintentionally.

If a formal source gives a controlling definition or boundary, that source controls.

### Infraction

Source: IPG.

Use the current IPG classification and terminology.

### Missed Trigger

Source: IPG section 2.1 and relevant CR trigger rules.

Do not substitute Player terminology such as “I missed X triggers” for the formal determination required by the IPG.

### Cheating

Source: IPG.

Cheating is currently an explicit example of a category that requires escalation to a human Judge for serious investigation.

### Rules Enforcement Level (REL)

Source: MTR / applicable policy documents.

The system must distinguish event policy by applicable REL.

### Oracle Text / Oracle Card Data

The authoritative current rules text and card characteristics used by Magic for cards.

The exact machine-readable provider/API remains to be selected.

---

## Definition Governance

1. A formal CR/MTR/IPG term must not be redefined merely for implementation convenience.
2. When a new project term appears in a flow, add it here if the distinction is materially important.
3. If a project definition conflicts with a normative Magic source, the normative source wins.
4. If a project term becomes unnecessary after the flows are refined, it may be removed.
5. Actor definitions are expected to evolve as the primary interaction flows are elicited.

