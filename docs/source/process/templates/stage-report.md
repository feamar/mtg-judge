# <Iteration> · Stage <N>: <stage name>

Role: <role> · Branch: `<branch>` · Inputs: `<path of the report this stage started from>`

**Decision:** PENDING
<!-- Owner writes one of: APPROVED · APPROVED WITH NOTES: … · REJECTED: … -->

---

## Part A: for the owner (approval package)

### 1. What was done

<3–8 plain-English lines. What exists now that didn't before.>

### 2. How to inspect it

| What | How |
| --- | --- |
| <e.g. the tests in plain words> | <open `path`, or run `command`, or follow `demo.md`> |

### 3. Gate results

| Gate or check | Result | Numbers |
| --- | --- | --- |
| <e.g. RED check> | green / red | <e.g. 14/14 new tests fail as expected> |

### 4. Decisions you need to take

<None, or a numbered list. Each item: the question, the options, and a recommendation with its reason.>

### 5. What the next stage will do

<1–3 lines: the next role and its job.>

---

## Part B: handoff to the next agent

- **Next role:** <role>
- **Job:** <one or two sentences, imperative>
- **Read:** <paths and slice refs, at most 8 entries>
- **Allowed paths:** <globs the next agent may change>
- **Constraints:** <for example locked tests, owner notes copied from the decision line>
- **Open issues:** <none, or a list with IDs>
- **Done when:** <the checkable condition>
