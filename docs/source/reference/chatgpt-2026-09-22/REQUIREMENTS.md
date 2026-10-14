# MTG Judge App — REQUIREMENTS.md

## Status

Working requirements-elicitation document.

This file is intentionally **not yet a full RUP requirements specification**. It captures the current agreed direction, primary interaction flows, requirements candidates, constraints, and open questions. Detailed use-case specifications and supplementary specifications will be produced later.

Last consolidated: 2026-09-22 (Europe/Amsterdam)

---

## 1. Product Goal

The system is intended to assist Magic: The Gathering players with Judge Calls when a human Judge is not immediately available.

The target is that the system can correctly resolve at least 90% of Judge Calls that are suitable for automated handling, while escalating situations that require human investigation or authority.

The system must make Players feel that they can safely continue their game after receiving a Ruling.

---

## 2. Normative Rules Basis

The system must base its rulings on the applicable versions of:

- Magic: The Gathering Comprehensive Rules (CR)
- Magic: The Gathering Tournament Rules (MTR)
- Magic Infraction Procedure Guide (IPG)
- Current Oracle/card data
- Event-, league-, or tournament-specific addenda where applicable

Source precedence and reference URLs are maintained in `REFERENCES.md`.

Historical Judge Calls and answers from experienced Judges may be used as **illustrative elicitation material** to discover patterns, decision strategies, edge cases, and desired interaction behavior. They are not normative when they conflict with CR, MTR, IPG, Oracle data, or an applicable event addendum.

---

## 3. Product Channels

The same rules and policy engine should ultimately be usable through multiple interaction channels, including:

- mobile phone application
- Discord
- WhatsApp

The channel must not change the normative ruling logic.

---

## 4. Input and Interaction Modalities

The system must support conversational interaction rather than single-shot question answering.

Relevant modalities include:

- text
- speech
- photos
- visual representation of a board state
- video or streamed visual evidence where supported by the channel

The system must be able to ask follow-up questions.

The system may request a different input modality when that modality is materially better suited to resolving uncertainty in the Judge Call.

---

## 5. Primary Interaction Flow 1 — Investigate and Resolve a Judge Call

### 5.1 Intent

A Player presents a problem, rules question, or potentially incorrect game situation. The system investigates the situation sufficiently to determine the applicable rules/policy and provide a Ruling, or escalates the call when appropriate.

### 5.2 Current high-level flow

1. **Receive the Player's account**
   - The Player may describe the situation freely in natural language.
   - The account may contain irrelevant details, incorrect terminology, incorrect quantities, assumptions, or conclusions.

2. **Acquire additional evidence where useful**
   - The system may request photos, video, a stream, or other visual evidence of the current board state.
   - The system should choose the information source that most efficiently resolves relevant uncertainty.

3. **Reconstruct the relevant game history and current state**
   - The system identifies the relevant sequence of actions, spells, abilities, triggers, game objects, players, and state changes.
   - The system must distinguish what was explicitly reported from what was directly observed and what was inferred.

4. **Validate the system's understanding**
   - The system must present its relevant interpretation of the situation back to the Players when confirmation is needed.
   - A Player's own legal or rules conclusion must not automatically be treated as fact.
   - Example: “I have 28 missed triggers” contains at least a quantity claim and an infraction-classification claim, both of which must be independently validated.

5. **Identify plausible applicable rules/policy branches**
   - The system forms one or more working hypotheses about the applicable rules and/or infraction.
   - In tournament-policy cases, the system should reason from the likely primary infraction toward the facts required to confirm or reject that hypothesis.

6. **Ask ruling-discriminating questions**
   - Follow-up questions must be selected because their answers can change the applicable rule/policy branch, infraction classification, fix, penalty, or Ruling.
   - The system should not merely execute a fixed checklist.
   - The system should iteratively update its hypothesis as new facts become available.

7. **Determine the relevant infraction sequence**
   - Where more than one infraction may have occurred, the system must establish the relevant order in which infractions occurred.
   - The first applicable infraction is especially important to determining the correct handling.

8. **Apply CR/MTR/IPG and issue a Ruling**
   - The system explains and applies the applicable rules and tournament policy.
   - The system provides the appropriate remedy/fix and penalty where applicable.
   - The system must not provide Play Advice.
   - The system must not reveal information that the recipient is not entitled to receive.

9. **Escalate where the matter is outside automated scope**
   - Situations requiring a serious human investigation, including suspected Cheating, must be escalated to a human Judge.
   - Additional escalation categories remain to be elicited.

---

## 6. Fact Provenance

The system must preserve the origin of facts used in its reasoning.

At minimum, the model currently distinguishes:

- **Reported Fact** — stated by a Player or other participant.
- **Observed Fact** — established directly from visual or other evidence available to the system.
- **Derived Fact** — inferred from reported/observed facts using Magic rules, card text, arithmetic, or other valid reasoning.

A Player's assertion about the rules, infraction type, trigger count, or remedy is a claim to validate, not automatically a Derived Fact.

---

## 7. Judge-like Investigation Principle

The system should investigate a Judge Call in the same broad way an experienced Judge does:

- form a plausible hypothesis about the relevant rule or infraction;
- inspect the normative rule/policy governing that hypothesis;
- identify the unresolved facts that differentiate possible outcomes;
- ask targeted questions or request evidence for those facts;
- update the hypothesis;
- continue until the Ruling is sufficiently determined or the call requires escalation.

This principle is currently considered fundamental to the product.

---

## 8. Interpretation Confirmation

The system must be capable of explicitly communicating how it has understood:

- the Player's question;
- the relevant game history;
- the relevant current board state;
- the facts it is relying on.

This allows Players to correct misunderstandings before a definitive Ruling is issued.

---

## 9. Event Configuration

The system must support event-, tournament-, or league-specific rules/addenda.

A Player should be able to configure the application for the relevant event through a simple link or equivalent mechanism.

Event-specific policy must be included in the applicable policy context for Judge Calls made under that configuration.

This capability is considered blocking for the first launch.

---

## 10. Performance

Ordinary Judge Call interactions should return useful conversational responses within a few seconds.

Some calls may require multiple rounds of investigation, evidence gathering, or rule analysis.

Exact measurable performance targets remain to be specified later.

---

## 11. Escalation

The system must explicitly recognize situations that it should not resolve autonomously.

Known example:

- suspected Cheating or another matter requiring a serious investigation

The system must direct the Players to a human Judge when escalation is required.

The exact escalation taxonomy remains open.

---

## 12. RUP Direction

The current elicitation approach is **flow-first**.

Actors and project definitions are derived from actual interaction flows rather than exhaustively defined in advance.

Planned later artifacts include:

- Vision / high-level product scope
- Use-Case Model
- detailed Use-Case Specifications
- Supplementary Specifications
- Glossary / Definitions
- acceptance criteria
- testable specification derived from the approved requirements

The point at which the elicitation material is mature enough to become the first formal RUP requirements package is intentionally not fixed yet.

---

## 13. Requirements-Elicitation Method

Future elicitation should use:

- concrete historical Judge Calls;
- how experienced Judges investigated those calls;
- which questions were asked and why;
- which evidence was requested;
- which facts changed the outcome;
- which common Player assumptions were incorrect;
- the final applicable CR/MTR/IPG reasoning.

Historical cases are examples used to derive requirements; they do not override normative sources.

---

## 14. Open Questions

Current known open areas include:

- full escalation taxonomy;
- exact meaning and handling of app-generated “Rulings” versus human Judge rulings;
- whether and how app outcomes can be appealed or handed to a human Judge;
- remaining primary interaction flows;
- exact actor set that emerges from those flows;
- authentication and identity needs;
- privacy and retention rules for photos/video/streams;
- event/addendum publishing workflow;
- source-version management;
- Oracle/card-data provider and update mechanism;
- exact latency and availability targets;
- supported tournament Rules Enforcement Levels and how Regular REL will be handled;
- audit/logging requirements for completed Judge Calls.

---

## Scenario Corpus Governance

Concrete Judge Call scenarios used during requirements elicitation are maintained as first-class project artifacts under `scenarios/`.

AI maintenance rules:

- Each materially distinct Judge Call scenario must be stored in its own Markdown file.
- Scenario filenames use a short descriptive lowercase hyphenated name, chosen by the AI; the user does not need to supply an identifier or filename.
- `scenarios/INDEX.md` is maintained by the AI and records the current total number of scenarios plus, for every scenario, its filename, title, and a short deliberately non-exhaustive description of what it is about.
- When a conversation introduces a concrete Judge Call that is used to derive, test, clarify, or challenge system behavior or requirements, the AI must create or update the corresponding scenario file and update `scenarios/INDEX.md` in the same maintenance pass.
- Scenario files preserve the facts presented, relevant observations, decision-critical questions, applicable rules/policy branches, expected Judge reasoning, and requirements learned from the scenario when those are known.
- Player conclusions are not silently converted into established facts.
- Historical Judge Calls and scenario outcomes are illustrative evidence. Current normative Magic rules and policy remain controlling.
- Scenario files and the index are project-maintenance artifacts intended to be maintained by AI rather than manually curated by the user.

---

## 15. Architectural Requirements

These requirements constrain the architecture without prematurely selecting a specific LLM, retrieval technology, database, mobile framework, or hosting provider.

### 15.1 Shared Judge Engine

The core Judge reasoning capability must be separated from presentation channels.

- Mobile, Discord, web, voice, and future channels should use the same normative reasoning behavior.
- Channel-specific code may control input/output presentation but must not independently implement Magic Ruling logic.
- The Judge engine must expose a stable interface that allows inference and retrieval components to be replaced without rewriting channel integrations.

### 15.2 Deployment Portability

The architecture must support at least two deployment modes:

1. **Central/server deployment** suitable for Discord and potentially millions of users.
2. **Local or hybrid mobile deployment** where the rules corpus and, where technically feasible, inference can run on-device.

The architecture must not require a single specific LLM provider or inference location. Local and cloud inference should be interchangeable behind a defined reasoning interface where practical.

### 15.3 Versioned Normative Knowledge

CR, MTR, IPG, Oracle data, and event-specific policy must be stored as versioned authoritative data rather than being treated as knowledge permanently embedded in model weights.

The system must be able to determine which source versions were used for a Ruling and preserve that information in the call record.

A normative source update must allow dependent concepts, scenarios, tests, and cached reasoning artifacts to be identified as potentially stale.

### 15.4 Hybrid Rules Retrieval

The architecture must support multiple complementary retrieval mechanisms rather than assuming semantic vector search alone is sufficient.

At minimum, the design must permit:

- exact rule-number and exact-text lookup;
- lexical/full-text search;
- semantic retrieval;
- retrieval by defined Magic concept;
- explicit relationships/dependencies between rules, concepts, exceptions, and policy branches;
- current Oracle lookup for referenced cards.

Retrieval identifies candidate normative material. Retrieved similarity is not itself normative authority.

### 15.5 Structured Investigation State

A Judge Call must be represented as evolving structured state, not only as an unstructured chat transcript.

The state model must be capable of preserving:

- Players and relevant game objects;
- reported, observed, and derived facts;
- relevant game-history/timeline events;
- unresolved or disputed facts;
- candidate rules/policy hypotheses;
- decision-critical facts;
- questions asked and answers received;
- evidence requested or received;
- candidate and confirmed infractions;
- source → proposition → consequence reasoning;
- current confidence/uncertainty;
- escalation state;
- final Ruling, fix, and penalty where applicable.

### 15.6 Hypothesis Revision

The engine must support multiple candidate explanations and revise them as new evidence arrives.

It must not become irreversibly anchored to its first hypothesis. New Player answers or evidence may:

- confirm a hypothesis;
- reject it;
- select another rules/policy branch;
- remove a suspected integrity concern;
- introduce a new investigation or escalation requirement.

### 15.7 Investigation Audit Trail

Every material investigative step must be reproducible after the call.

The system must preserve enough structured information to reconstruct:

- what the system knew at that point;
- what hypothesis or uncertainty motivated the next question;
- what question was asked and why it was decision-relevant;
- what answer/evidence was received;
- how that changed the system's hypotheses or Ruling path;
- which normative sources were consulted;
- why the system resolved or escalated the call.

The audit trail must distinguish internal investigative reasoning from information safe to disclose to Players.

### 15.8 Integrity / Cheating Escalation Boundary

The architecture must support a protected escalation state for situations where intentional wrongdoing may require investigation.

When that state is reached:

- the Player-facing interface must not reveal or imply that the system suspects Cheating or another intentional violation;
- the automated system must stop any questioning that could compromise a human investigation;
- Players must receive a neutral instruction to call a human Judge and not continue the relevant game actions until instructed;
- the internal reason for escalation must remain available for authorized Judge handoff.

The system must distinguish:
- determining an objective infraction from game actions; and
- investigating Player knowledge or intent.

A possible integrity concern must not retroactively replace objective infraction analysis.

### 15.9 Human Judge Handoff

The architecture must support transfer of an active call to a human Judge.

The Judge-facing handoff must be able to provide, subject to authorization:

- original Player account;
- reconstructed timeline/game state;
- established, disputed, and unresolved facts;
- evidence available to the system;
- questions asked and answers received;
- candidate and confirmed rules/policy branches;
- exact normative references;
- source → proposition → consequence chain;
- the reason automated handling stopped;
- integrity concerns or other escalation rationale that were deliberately hidden from Players.

The Judge must be able to distinguish system observations from Player statements and AI-derived conclusions.

### 15.10 Player-Facing / Judge-Facing Information Separation

The product must support different disclosure views over the same call state.

Player-facing output should contain only information appropriate to Players for resolving or escalating the call.

Judge-facing output may include protected investigation metadata, hypotheses, uncertainty, and escalation rationale.

Access control must prevent protected Judge-facing information from being exposed merely because a Player asks for the system's internal report.

The exact Judge authentication/authorization mechanism remains open.

### 15.11 Scenario Corpus at Scale

The architecture and repository conventions must assume a corpus of at least 10,000 diverse, structured Judge scenarios and should not depend on manually maintaining a single flat index.

Scenario data must support machine-readable metadata sufficient for filtering and evaluation, including at least:

- concepts/rules exercised;
- applicable REL/policy context;
- source versions;
- interaction type (rules question, investigation, policy remedy, escalation, etc.);
- required questions/evidence;
- expected intermediate propositions;
- expected outcome or escalation;
- validation status;
- provenance;
- scenario family / controlled variants where applicable.

Human-readable Markdown may remain a project artifact, but the architecture must permit a structured representation to be the testable source for automated evaluation.

### 15.12 Evaluation and Regression Architecture

The project must support automated evaluation against a large scenario corpus.

Evaluation must be capable of testing more than final-answer text. Depending on the scenario it should test:

- correct facts extracted;
- correct decision-critical questions;
- correct rule/policy retrieval;
- correct intermediate propositions;
- correct final Ruling/fix/penalty;
- correct decision to escalate;
- correct non-disclosure of protected investigation hypotheses;
- correct revision when a fact changes;
- exact normative citations.

Scenario families should support controlled counterfactual tests where changing one material fact changes the expected branch.

Training/development scenarios, regression tests, and a held-out evaluation set must be separable.

### 15.13 Observability and Reproducibility

For debugging, evaluation, and Judge handoff, each call must carry a unique call identifier and record relevant software/model/rules-data versions.

The system must permit a failed or disputed call to be reproduced as closely as practical without depending on undocumented transient state.

### 15.14 Privacy and Data Minimization

Because investigations may contain Player statements, images/video, and sensitive allegations, the architecture must support configurable retention and deletion policies.

Evidence and protected investigation records must not be retained merely because the reasoning engine technically can retain them.

The exact retention periods, consent model, and jurisdictional privacy requirements remain open.

### 15.15 Scale and Cost Isolation

A high-volume channel such as Discord must be able to scale independently from the normative corpus and channel clients.

The architecture should allow:

- stateless or horizontally scalable request processing where practical;
- caching of versioned normative data and safe deterministic derived data;
- separation of inexpensive retrieval/state operations from expensive model inference;
- rate limiting and abuse controls;
- replacement or routing between inference backends based on capability, latency, and cost without changing Ruling semantics.

### 15.16 Technology Selection Principle

Technology choices must be evaluated against these requirements and the scenario benchmark.

The project must not assume in advance that RAG, fine-tuning, a knowledge graph, a particular database, or a particular model is sufficient. Technologies are implementation candidates; Judge behavior and testable correctness are the constraints.

