# E2 · Process design: approval package (revision 2)

Role: process engineer (planner) · Branch: `plan/v1` · Replaces: [revision 1](approval-package-rejected-1.md), rejected on 2026-09-29: "Construction and Transition should be replaced with more PDD type processes. Where is my test hardening?"

**Decision:** APPROVED WITH NOTES (2026-09-29): "My worry here is that it would be too expensive, need to tune auto-reviewing & testing vs speed and tokens."
<!-- Write one of: APPROVED · APPROVED WITH NOTES: … · REJECTED: … -->

---

## Part A: for the owner

### 1. What changed since revision 1

- **E4 and every Construction iteration are now a PDD cycle:**

  **MAP** (cartographer) → **TRIAGE** (you) → **CARVE** (carver + spikes) → **PIN** (pinner) → **SHIP** (implementer) → **PROVE/HARDEN** (test hardener) → **RE-MAP** (cartographer)
- **Test hardening is its own stage and its own agent.** The test hardener writes tests only, and runs gates H1–H6 at your thresholds:
    - H1: 100% of named boundaries killed (`pdd prove`);
    - H2: module mutation grade ≥ 90% for `core`, ≥ 75% elsewhere (`pdd grade`);
    - H3: zero confidently wrong answers under noise;
    - H4: property tests;
    - H5: integrity, near-miss and leak tests, with zero leaks;
    - H6: `gatechain --push`.

  A hardened test that catches a real bug sends the unit back to SHIP.
- **Pin before change:** existing behaviour is characterised before any unit touches it. At release, **all** released behaviour is pinned as the v1.0 baseline.
- **Transition** is PROVE ALL (system-wide hardening + held-out aggregates) → RELEASE PIN → DEPLOY → PILOT MAP (real calls mapped back into new golden cases).
- **Spikes** now run inside CARVE, as the riskiest-assumption check.
- **Roles:**
    - new: cartographer, test hardener;
    - renamed: designer → carver, test implementer → pinner;
    - removed: integrator-tester (now covered by HARDEN and RE-MAP) and reviewer (replaced by PDD's cohesion gate and the trap register).

  Still 14 agents, plus you.
- **Unchanged:** Elaboration E3 (it builds the tooling, so it can't use it yet), stage reports with Part A and Part B, the project manager booting agents after your approval, change requests, and the token rules.

### 2. How to inspect it

| What | Where | Time |
| --- | --- | --- |
| **The PDD cycle and hardening** (start here) | [DEVELOPMENT-CASE.md](../../process/DEVELOPMENT-CASE.md) §4 (the cycle), §8.2 (hardening gates), §5.3 (Transition) | 15 min |
| The rest of the process | DEVELOPMENT-CASE §1–3, §7 | 10 min |
| What each iteration delivers | [PLAN.md](../../plan/PLAN.md) §2 | 10 min |
| The new agents | [cartographer](../../../.claude/agents/cartographer.md), [pinner](../../../.claude/agents/pinner.md), [test-hardener](../../../.claude/agents/test-hardener.md), [carver](../../../.claude/agents/carver.md) | 15 min |
| The orchestrator | [project-manager](../../../.claude/agents/project-manager.md) | 5 min |
| The decision record | [ADR-0023](../../architecture/adr/0023-delivery-pipeline-and-gates.md) | 5 min |
| The handover to the project manager | [handover 03](../../handover/03-planner-to-project-manager.md) | 3 min |

### 3. Gate results

| Check | Result |
| --- | --- |
| Every role in DEVELOPMENT-CASE §3 has an agent file, and no file lacks a role | ✓ 14/14 |
| No agent file references a removed role, stage or gate | ✓ (grep check) |
| Every backlog task has an iteration, or a stated trigger | ✓ 76 placed; T-J4 and T-J5 wait on triggers |
| The PRD is unchanged | ✓ |
| Nothing merged into `main` | ✓ |

### 4. Decisions you need to take

1. **Approve ADR-0023, revision 2.** *Recommended: approve.*
2. **Approve the PDD cycle and the hardening gates as written** (DEVELOPMENT-CASE §4, §8.2).
3. **Approve the merge of `plan/v1` into `main`.**
4. **Close the planning phase** (AGENTS.md: only you end a phase).

### 5. What happens next

You start `claude --agent project-manager` and say "continue". It opens E3 and writes the E3 brief, which is your next approval package.

---

## Part B: handoff to the project manager

- **Next role:** project-manager
- **Job:** open E3, per `docs/handover/03-planner-to-project-manager.md`.
- **Read:** handover 03; PLAN.md §2 (E3); the `backlog.json` entries with `iteration: E3`.
- **Allowed paths:** `docs/iterations/E3/`
- **Constraints:** boot only after `plan/v1` is merged into `main`.
- **Owner note (cost):** the owner worries the pipeline is too expensive. The E3 dry run must produce a **cost baseline** (tokens and wall time per stage and per gate) and a **tuning proposal** for the owner, trading review and testing depth against speed and tokens. Candidate knobs: which hardening gates run every cycle vs only at PROVE ALL; mutation scope (changed lines only vs whole module); noise seeds and property-run counts; turn budgets; model per role; whether TRIAGE/CARVE/PIN approvals can be batched into one; skipping PIN characterisation for code with no dependants. No knob changes without the owner's decision.
- **Open issues:** OQ-37..41, none blocking E3.
- **Done when:** `docs/iterations/E3/01-brief.md` awaits the owner.
