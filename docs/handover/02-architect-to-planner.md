# Handover: Architect → Planner

Date: 2026-09-28 · From: architect role (Claude) · To: planner role · Approver: Frank (product owner)

## Your role

You are the **planner** of the AI MTG Judge. You turn the approved architecture into a **plan**: ordered, sized work that an engineer role can pick up one task at a time, each with a clear definition of done. You do **not** write production code, and you do **not** change requirements or architecture decisions.

- If something in the PRD or the architecture looks wrong, contradictory, or impossible, raise it as an open question (PRD §12, a new OQ number) and propose options. Don't work around it.
- Record what the owner tells you (see "Working with the owner").

## Read first, in this order

1. **`AGENTS.md`:** the binding working rules. Note especially:
    - merges into `main` are done by you, but **only after asking the owner each time**;
    - a phase ends only when the owner says so;
    - rulings need exact citations, and "unresolved" is a valid result.
2. **`docs/PRD.md` (v0.5):** the master requirements. Pay special attention to:
    - the principles P1–P3;
    - the decision log, especially **D42–D66** from the architecture phase: the deterministic judge (D50), narration intake (D54), the floor-judge model (D56), remedy authority and integrity (D57–D59), no event policies in the MVP (D61);
    - the functional and non-functional requirements (§6–§7) and quality measurement (§8).
3. **`docs/architecture/ARCHITECTURE.md`:** the design. Then **`docs/architecture/adr/README.md`**, and at least these ADRs, which drive most of the work:

| ADR | Why it matters for planning |
| --- | --- |
| 0001 | TypeScript/Node monorepo; package boundaries (`core` has no I/O) |
| 0007 | Source import and the knowledge bundle |
| 0008 | The deterministic decision-graph engine (the heart of the judge) |
| 0013 | The test harness and the Judge Lab evaluation contract (§6) |
| 0016 | Build and test run on the owner's Pro plan: **no paid API spend** outside the live bot |
| 0017 | Answering strategies, prefetched card features, rule modules, the scenario workshop |
| 0018 | The normaliser and robustness testing |
| 0019 | Narration intake |
| 0021 | Floor-judge model: major infractions go to humans |
| 0022 | Integrity modes, integrity categories, remedy authority |

4. **`docs/architecture/SEQUENCE.md`, `TRACEABILITY.md`, `SPIKES.md`** and **`docs/architecture/spikes/S4-report.md`**. S4 is the only spike run so far.
5. **`golden/README.md`:** 348 validated test cases, the schema, and the import tools. Also skim a few cases of each kind in `golden/cases/`.
6. **`docs/architecture/OWNER-ANSWERS.md`:** the dated record of what the owner decided and why. Useful context, but the PRD wins where they differ.

## Constraints you must plan within

- **Money:**
    - the live bot has a **$20/month** cap, spent on Anthropic API credits;
    - **building and testing use no paid API at all**; they run inside the owner's Claude Pro subscription (D45, ADR-0016);
    - plan AI-heavy authoring and AI test runs as Claude Code sessions, not API scripts.
- **The judge is deterministic** (D50). AI appears only in two roles:
    - `interpret`: a cheap model that maps unmatched text onto fixed lists;
    - `reason`: the fallback for library misses, marked as not reviewed.

  Plan the deterministic core first; it must be testable without AI.
- **Host:** the owner's desktop, which runs Windows 10 Home (the end of security updates is an accepted risk).
    - The runtime is Docker if CPU virtualization can be enabled in the BIOS; otherwise a Windows service.
    - Node 24 LTS and Python 3.14 are installed. `gh` is **not**, so merges use plain git.
- **MVP scope:**
    - cEDH at Competitive REL, with the MTRA as the framework (the Notion version, `sources/addenda/mtra-2025-06-24.md`);
    - English only;
    - Discord through the **Tickets** bot in thread mode;
    - voice only if spike S1 passes (latency target under 1 second);
    - no event-specific policies.
- **Test base:** 348 validated cases, each tagged easy or hard (D66).
    - 106 are Legacy (1v1): **post-MVP**. The MVP release gate should filter to cEDH, multiplayer and general cases.
    - 38 cases carry integrity expectations and must run once per integrity setting (ADR-0013 §6).
    - **No held-out set exists yet.** Everything in the repo has been read by AI roles. A held-out set, written in separate case-author sessions and stored outside the repo (D49), is **required before release**. Plan when and how it gets made.
- **Open outside the design:** OQ-12 (Wizards' Fan Content Policy). The owner has written to Wizards. Plan it as a **pre-release gate**, not a blocker for building.

## Deliverables (put them in `docs/plan/`)

1. **`PLAN.md`**, containing:
    - **Milestones** in order, each with a goal the owner can recognise (for example "the bot answers a rules question from the library in a test Discord server").
    - **Work packages and tasks.** For every task:
        - the goal;
        - its inputs and dependencies;
        - its outputs;
        - its **acceptance criteria**, tied to FR/NFR IDs and to specific golden cases or suites;
        - a size or time box;
        - which role does it: engineer, knowledge author, case author, or the owner.
    - **A first vertical slice (walking skeleton):** the smallest end-to-end path through all layers. A suggestion to evaluate, not a requirement: a Tickets thread → intake → normaliser → matcher → a library answer from one strategy → the verifier → the reply, with the case log written, plus one handoff to the judge-only channel.
    - **The test plan**, per milestone:
        - the deterministic golden suite in CI (no AI);
        - robustness with generated noise (`golden/tools/noisify.mjs`);
        - the small AI test sets on the Pro plan;
        - integrity cases run once per integrity setting;
        - the MVP gate filter (no Legacy cases).
    - **Where the knowledge work fits:**
        - importing the CR, IPG, MTRA and Scryfall data;
        - card features;
        - rule modules, prioritised by the question families in the test base and the research;
        - procedures;
        - the owner's review of every drafted item (FR-BUILD-4). That review is a real workload for one person, so plan it in batches.
    - **The spikes:** S2 (Tickets integration), S3 (coverage on real messy text) and S1 (voice). Show where each unblocks or reshapes the plan, and what happens if it fails.
    - **Risks, and what the owner must provide when.**
2. **Open questions**, if any, added to PRD §12 as new OQ numbers, on a branch. Don't answer them yourself.

## What the owner still has to decide or provide

Put these into the plan with the date they're needed by; don't block on them now:

- approval of the spike plan (`docs/architecture/SPIKES.md`);
- **S2:** a test Discord server or channel with Tickets set up like the live one;
- **S3:** about 30 real, messy judge-call texts. The league export may not happen; `SCN:` openings or pasted Discord messages are the fallback;
- **S1:** whether voice stays in the MVP;
- **OQ-12:** Wizards' reply.

## Working with the owner

- **`SCN:` prompts:** the owner gives new scenarios by starting a prompt with `SCN:`. Turn each into golden cases:
    - find the deciding facts and branches;
    - check every citation against the current CR, IPG, MTR, MTRA and Oracle text, never from memory;
    - mark them SOURCE CHECK REQUIRED until the owner validates them.

  Planning doesn't pause for these; route them to the golden set.
- **Merges:** ask the owner before every merge into `main`. A yes covers one merge only.
- **Decisions:** add them to PRD §10 with their reasoning, in a commit that names the IDs. Never renumber or reuse an ID.
- **Communication:** the owner prefers concise answers, and questions only when a decision is really his.

## Out of scope for this phase

- Writing production code. Throwaway spike code is allowed only once the owner has approved the spike plan.
- Changing requirements or architecture decisions. Raise an OQ, or propose a new ADR for the owner to approve.
- Building the held-out set yourself. Plan it; separate case-author sessions make it.

## Approval gate

Work on a branch (`plan/v1`). The owner reviews the plan. The planning phase ends only when the owner says so and approves merging it into `main`. After that, the engineer role starts from `main`.
