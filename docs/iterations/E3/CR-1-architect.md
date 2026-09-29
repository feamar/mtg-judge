# E3 · CR-1: Architect — owner boots every session

Role: architect · Branch: `cycle/E3` · Inputs: `docs/iterations/E3/CR-1-owner-boots-sessions.md`

**Decision:** PENDING
<!-- Owner writes one of: APPROVED · APPROVED WITH NOTES: … · REJECTED: … -->

---

## Part A: for the owner (approval package)

### 1. What was done

- Drafted ADR-0024 (Proposed). It replaces only ADR-0023 decision 3: no agent starts another; the project manager writes a boot instruction to `docs/iterations/<cycle>/boot/` and stops; you start each role as a new Claude Code session.
- Every boot prompt repeats the "write the report, end with STATUS" rules, so sessions don't depend on the brief to remind them. A session ending without them counts as `blocked`.
- ADR-0016 is not touched: it is about paying via the Pro plan and the eval adapter, not about booting.
- Filled in the CR's Recommendation and Proposed text.

### 2. How to inspect it

| What | How |
| --- | --- |
| The proposed ADR | open `docs/architecture/adr/0024-owner-boots-every-session.md` |
| The CR with recommendation | open `docs/iterations/E3/CR-1-owner-boots-sessions.md` |

### 3. Gate results

| Gate or check | Result | Numbers |
| --- | --- | --- |
| None (documents only) | n/a | n/a |

### 4. Decisions you need to take

1. Accept ADR-0024 as written? Recommendation: yes — it matches your decision and changes nothing else in ADR-0023.

### 5. What the next stage will do

After acceptance: architect marks ADR-0024 Accepted and updates `adr/README.md` and ADR-0023's status line; process engineer applies it to the process files.

---

## Part B: handoff to the next agent

- **Next role:** process-engineer
- **Job:** Apply ADR-0024 to the process files: remove PM subagent booting, add the boot-instruction step and template, make report + STATUS obligations part of every boot prompt.
- **Read:** `docs/architecture/adr/0024-owner-boots-every-session.md`; `docs/iterations/E3/CR-1-owner-boots-sessions.md`
- **Allowed paths:** `docs/process/**`, `.claude/agents/project-manager.md`, `.claude/agents/toolsmith.md`, `pipeline/BOOT.md`
- **Constraints:** only after the owner accepts ADR-0024; don't change other ADR-0023 decisions.
- **Open issues:** none
- **Done when:** no agent file or process doc says the PM boots agents; a boot template exists; AGENT-RULES rules 5, 7, 10 reflect ADR-0024.
