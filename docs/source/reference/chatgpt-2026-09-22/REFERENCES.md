# MTG Judge App — REFERENCES.md

## Status

Reference manifest for requirements elicitation and future specification work.

Last consolidated: 2026-09-22 (Europe/Amsterdam)

---

## 1. Normative Source Hierarchy

The application must reason from the applicable authoritative rules and policy documents.

Current working hierarchy:

1. Applicable event/tournament official fact sheet or addendum where it explicitly overrides or supplements general policy.
2. Magic Tournament Rules (MTR) for tournament policy where applicable.
3. Magic: The Gathering Comprehensive Rules (CR) for game rules.
4. Magic Infraction Procedure Guide (IPG) for infractions, penalties, fixes, and associated philosophy at the RELs governed by the IPG.
5. Current Oracle/card data for card text and card characteristics.

This hierarchy must be revisited where the governing documents themselves specify precedence.

---

## 2. Comprehensive Rules

### Official Wizards rules landing page

https://magic.wizards.com/en/rules

The page provides the current Comprehensive Rules in multiple formats.

### Project handling decision

For this project, the Comprehensive Rules version currently exposed by Wizards is treated as **current** for requirements and development work. No separate “future-effective” status is maintained in the project documents unless that decision is changed later.

---

## 3. Magic Tournament Rules (MTR)

### Readable working reference

https://blogs.magicjudges.org/rules/mtr/

The Rules Resources page includes the MTR text plus annotated educational commentary.

Project rule:

- the underlying MTR text is normative for this working reference;
- annotated commentary is educational/illustrative and must not silently replace the normative text.

### Official version authority

Use the official Wizards/WPN rules-document source when validating which version is currently authoritative.

The working Rules Resources page observed on 2026-09-22 reports:
- Effective: 2026-02-27
- Last updated: 2026-07-30

---

## 4. Magic Infraction Procedure Guide (IPG)

### Readable working reference

https://blogs.magicjudges.org/rules/ipg/

The Rules Resources page includes the IPG text plus annotated educational commentary.

Project rule:

- the underlying IPG text is normative for this working reference;
- annotated commentary is educational/illustrative and must not silently replace the normative text.

### Official version authority

Use the official Wizards/WPN rules-document source when validating which version is currently authoritative.

---

## 5. Oracle / Card Data

Required for launch:

- complete card inventory;
- current Oracle text;
- current characteristics required for rules reasoning.

Provider/API has not yet been selected.

This remains an open technical/product decision.

---

## 6. Event and League Addenda

The system must support event-, league-, or tournament-specific addenda.

A Player should be able to load the applicable event context through a simple link or equivalent mechanism.

Where an applicable official event document overrides or adds policy, that context must be included in the ruling process.

---

## 7. Historical Judge Calls

Historical Judge Calls, Judge forum discussions, training scenarios, conference material, annotated policy discussions, and prior rulings may be collected as an **illustrative case corpus**.

Purpose:

- discover real interaction patterns;
- identify common ambiguity;
- learn which follow-up questions experienced Judges ask;
- identify decision-critical facts;
- expose common Player misconceptions;
- derive test scenarios and requirements.

These sources are **not normative**. If they conflict with current CR, MTR, IPG, Oracle data, or applicable event policy, the normative source controls.

---

## 8. Source-Version Requirement Candidate

The eventual system should preserve, for each Judge Call where practical:

- rules/policy version used;
- event/addendum context;
- Oracle/card-data version or timestamp;
- source sections relied upon for the Ruling.

This is currently a requirements candidate rather than a finalized requirement.

