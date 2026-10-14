# MTG Judge App — Architecture

## Purpose

The application is a rules-grounded Magic: The Gathering judge assistant. Its job is not merely to produce plausible rulings, but to retrieve the governing rules and policy, reason from them transparently, verify that reasoning, and explicitly decline to manufacture a ruling when the authoritative material does not resolve the question.

## Core architecture

### 1. Versioned authoritative rules store

Store authoritative sources as versioned data rather than undifferentiated documents. The Comprehensive Rules should be decomposed into atomic numbered rules while preserving hierarchy and cross-references. Tournament policy, multiplayer/Commander addenda, Oracle text, official rulings, and other governing sources should retain source identity, version/effective date, and authority level.

### 2. Three data layers

Keep three conceptually separate layers:

1. **Authoritative source text** — exact source material and provenance.
2. **Deterministic structure and relationships** — rule hierarchy, cross-references, card/rule links, supersession/version relationships, and other mechanically derived structure.
3. **AI-derived metadata** — concepts, summaries, embeddings, likely relationships, scenario annotations, and other useful but reviewable enrichment.

AI-derived metadata must never silently become authoritative rules text.

### 3. Hybrid retrieval

Do not rely on vector similarity alone. Retrieval should combine:

- exact rule-number/reference lookup;
- lexical/BM25-style search;
- semantic/vector search;
- graph/cross-reference traversal;
- Oracle and official-ruling retrieval;
- tournament-policy/addendum retrieval when the question is policy-sensitive.

Reasoning may trigger a second retrieval pass when an intermediate proposition exposes a missing definition, exception, cross-reference, or policy layer.

### 4. Constrained reasoning orchestrator

The LLM is a reasoning orchestrator, not the authority. It receives retrieved evidence and constructs an explicit chain such as:

**Source → Proposition → Consequence**

Important assumptions and definitions should be visible to the verifier. The model must distinguish direct rules text from interpretation and must not fill policy gaps with customary practice unless that practice is itself part of the governing ruleset.

### 5. Verification layer

A verifier runs after candidate reasoning. It checks, at minimum:

- every material rules claim has appropriate support;
- cited text actually supports the proposition attributed to it;
- rules and policy versions are compatible;
- relevant exceptions and cross-references have not been skipped;
- the reasoning has not changed the scope of a defined term without support;
- conflicting sources or policy layers are surfaced;
- known conceptual traps are checked;
- the conclusion follows from the supported propositions.

The verifier may request additional retrieval rather than immediately accepting or rejecting a candidate answer.

### 6. `UNRESOLVED` is a first-class result

The system must not be forced to choose a ruling.

If authoritative material is ambiguous, incomplete, conflicting, or does not establish a necessary proposition with sufficient confidence, the verifier returns an explicit **UNRESOLVED / ESCALATE** state.

That state should produce a useful judge handoff containing:

- the exact question;
- relevant facts;
- the authoritative provisions found;
- the specific unresolved proposition or conflict;
- candidate interpretations only where useful, clearly identified as interpretations;
- a recommendation to escalate to the appropriate judge/head judge rather than an invented ruling.

This is a success state of the architecture, not a system failure.

The draw/reporting investigation on 24 September 2026 is the motivating example: repeated plausible interpretations were possible, but the available rules/policy did not cleanly establish the necessary multiplayer scope. The correct product behavior is therefore to expose the gap and escalate.

## Suggested implementation

A practical backend is **Python + FastAPI**, with **PostgreSQL + pgvector** for the server-side rules/retrieval store. A compact **SQLite** package can support offline/mobile rule lookup. The same backend API can serve a mobile application and integrations such as a Discord bot.

A Flutter or React Native client can present judge calls, evidence, citations, confidence/status, and escalation handoffs.

## Initial implementation sequence

Start with a Comprehensive Rules ingestion prototype:

1. ingest a known CR version;
2. parse numbered rules into atomic records;
3. preserve hierarchy and source/version metadata;
4. build exact and lexical retrieval;
5. add embeddings/vector retrieval;
6. add cross-reference relationships;
7. test retrieval against the existing scenario corpus;
8. add constrained reasoning;
9. add verification;
10. make `UNRESOLVED / ESCALATE` an explicit tested output before expanding the product.

## Design principle

**The system should prefer a sourced “I cannot resolve this from the governing text” over a confident but unsupported ruling.**
