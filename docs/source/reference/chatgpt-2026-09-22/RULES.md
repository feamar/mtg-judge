# MTG Judge App — RULES.md

## Purpose

This file contains binding operating rules for any AI/LLM that maintains, extends, implements, tests, or generates artifacts for the MTG Judge App project.

`REQUIREMENTS.md` describes what the product must do.
`RULES.md` describes how an AI working on the project must work.

## 1. Normative authority

The current Magic: The Gathering Comprehensive Rules (CR), Magic Tournament Rules (MTR), Infraction Procedure Guide (IPG), current Oracle card text, and applicable event-specific policy are normative where relevant.

Project scenarios, historical Judge Calls, concept files, summaries, generated explanations, and prior AI answers are not normative authority.

If project material conflicts with a current normative source, the normative source wins.

## 2. Rules and policy terminology

Terms that originate from or have a defined meaning in the CR, MTR, or IPG must not be translated. They remain in English even when the surrounding conversation, UI, documentation, or explanation is in another language.

Do not silently replace formal rules terminology with a translated approximation when that could change or obscure its rules meaning.

## 3. Mandatory source traceability for Rulings

Every scenario that contains a Ruling, resolution, fix, penalty, rules conclusion, or material intermediate rules conclusion must cite the exact normative basis used to reach it.

Citations must be as specific as reasonably possible:
- CR rule number(s);
- MTR section(s);
- IPG section/subsection(s);
- current Oracle text for relevant cards;
- applicable event-specific policy/addendum where relevant.

A generic reference such as “the CR” or “IPG 2.5” is insufficient when a more specific provision is materially responsible for the conclusion.

## 4. Source → proposition → consequence

For each material reasoning step, preserve a traceable relationship:

**Source → Proposition → Consequence**

- **Source:** the exact normative rule, policy section, or Oracle text.
- **Proposition:** what that source establishes for this game state.
- **Consequence:** how that proposition changes the Ruling, classification, fix, penalty, question to ask, or next reasoning step.

This structure should be usable later to generate automated tests of both final answers and intermediate reasoning.

## 5. Source-validation status

A scenario is not considered source-validated merely because its Ruling appears correct or was previously given by a Judge or AI.

Until its exact normative references have been reviewed and confirmed, it must be marked:

**SOURCE CHECK REQUIRED**

AI-generated candidate references may be added before human review, but the status remains SOURCE CHECK REQUIRED until explicitly validated.

If the exact normative basis cannot be established, do not fabricate a citation. Record the uncertainty.

## 6. Current-source requirement

Use current CR, MTR, IPG, Oracle text, and applicable event policy when generating or validating rules material.

When a normative source changes, derived project material that depends on the changed provision must be treated as potentially stale until revalidated.

Card interactions must use current Oracle text rather than remembered or printed historical wording unless the historical wording is explicitly the subject of the scenario.

## 7. Scenario maintenance

Each concrete Judge Call used to derive system behavior should be stored as its own scenario file.

When a scenario is created or materially changed:
- update the scenario index;
- preserve the Player question/account and relevant established facts;
- preserve the expected Judge response or investigation path;
- record the concepts or requirements learned;
- record exact candidate normative references;
- preserve source-validation status.

Scenario files are test and learning artifacts, not normative authority.

## 8. Facts versus conclusions

Do not silently treat a Player's rules conclusion, infraction classification, trigger count, proposed remedy, or interpretation as an established fact.

Preserve the distinction between Reported Facts, Observed Facts, and Derived Facts.

If a rules-critical statement is ambiguous and plausible interpretations lead to materially different rules branches, clarify it rather than silently choosing an interpretation.

## 9. Judge-like investigation

For nontrivial Judge Calls:
- form a plausible rules/policy hypothesis;
- inspect the relevant normative material;
- identify facts that discriminate between possible outcomes;
- ask targeted questions or request evidence;
- update the hypothesis;
- issue a Ruling only when sufficiently supported, or escalate when appropriate.

Do not substitute a fixed questionnaire for policy-directed investigation.

## 10. Generated code and tests

Code-generation LLMs must preserve these rules in implementations and tests.

Where practical, tests should verify:
- the expected final Ruling;
- decision-critical intermediate propositions;
- the normative rule/policy references that justify those propositions;
- behavior when a relevant fact changes and therefore selects a different rules branch.

A passing historical scenario must not override changed normative rules.

## 11. Human validation

Human review may promote candidate source mappings from SOURCE CHECK REQUIRED to validated.

Until that occurs, candidate mappings are working hypotheses even when confidence is high.


## 12. Protected investigation and human handoff

When the system identifies facts that may require investigation of intentional wrongdoing:

- do not tell Players that Cheating, intent, dishonesty, or another intentional violation is suspected;
- do not expose the internal suspicion score, hypothesis, escalation rationale, or protected investigation notes to Players;
- stop automated questioning when further questions could compromise a human investigation;
- direct the Players neutrally to call a human Judge and preserve the game state as appropriate;
- preserve the complete investigative record for authorized Judge handoff;
- keep objective infraction analysis separate from questions of Player knowledge or intent.

A later innocent explanation may remove an integrity hypothesis. The AI must update rather than remain anchored to an earlier suspicion.

## 13. Investigation traceability

For every material investigative question, preserve:

- the known facts before the question;
- the hypothesis or uncertainty being tested;
- why the answer could change the rules/policy branch or escalation decision;
- the answer/evidence received;
- the resulting update to the reasoning state.

The Player-facing answer need not expose this internal record. Authorized Judge-facing reports may.

## 14. Architecture-neutral implementation

Code-generation LLMs must not hard-code normative Judge logic into a single UI/channel or make correctness depend on one model provider.

Implementations should preserve separable interfaces for:

- channel/UI;
- call state and investigation state;
- normative-source retrieval;
- reasoning/inference;
- audit logging;
- escalation and Judge handoff;
- scenario evaluation.

Technology-specific choices may be made behind these boundaries, but must remain replaceable where practical.

