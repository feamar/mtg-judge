# Spike S4 report: one rule module (targeting and countering)

Date: 2026-09-26 · Run by: architect role, unattended (owner away) · Code: [`spikes/s4/`](../../../spikes/s4/) on branch `spike/s4-targeting` · Paid spend: **$0**

## What was built

| Part | Size | Where |
| --- | --- | --- |
| Card features for 14 cards (11 from the family, 3 generalisation cards), hand-authored from Oracle text read on 2026-09-26 | 1 JSON file | `spikes/s4/features.json` |
| Rule module: `Test-LegalTarget`, `Find-LegalTargets`, `Invoke-Redirect`, `Get-CounterOutcome`. Each result carries its CR citations (113.1c, 113.6g, 113.9, 115.2, 115.5, 115.7a/d, 101.2, 603.7a, 608.2b/c, 609.3, 700.2a, 701.6a) | about 60 lines of logic | `spikes/s4/s4.ps1` |
| Two strategies: "can X target Y, and what happens?" and "counter vs can't be countered" | one dispatcher, about 20 lines | same file |
| A test table of 20 cases: the 2 owner-validated cases, the 10 `tc-*` variants (some split into sub-cases), and 5 generalisation cases | | same file |

**Language:** Windows PowerShell 5.1. The host has no Node or Python, and nothing was installed unattended. This is throwaway code; the product language stays TypeScript (ADR-0001). The logic ports one-to-one.

## Results

- **20/20 pass**, with no AI calls at run time.
- **The tests catch errors (mutation check).**
    - Breaking "can't be countered" makes 4 tests fail.
    - Breaking "an ability is not a spell" makes only **1** test fail (tc-08).
- **Generalisation:** Force of Will, Misdirection, and Fierce Guardianship were answered with features alone and **no new code**, including Misdirection's different targeting rule ("spell with a single target") and Fierce Guardianship's "noncreature" restriction.

## How much the results are worth

1. **The same author wrote the code, the features, and the expected answers,** in one session. That's a real confirmation-bias risk: 20/20 shows the module is *internally consistent*, not that it is *right*. The expected answers are only as good as your validation of the `tc-*` cases, which is still pending.
2. **The generalisation test is weak.** The three "new" cards were written into the feature file before the code. They have no card-specific code, but I knew them while writing it. A proper test uses cards chosen by someone else after the code is frozen, for example from the league export.
3. **One generalisation case passed for the wrong reason.** "Misdirection vs Necropotence's trigger" was meant to test "abilities aren't spells". It also fails Misdirection's "single target" check, so it didn't isolate that rule. The mutation check showed this. Lesson: each rule needs at least two cases that isolate it.
4. **Not measured:** matching raw player text to the right strategy (that's spike S3's job), and your review time.

## Against the pass criteria in SPIKES.md

| Criterion | Result |
| --- | --- |
| 100% of the development cases answered correctly with no AI | ✅ internally, **pending your validation** of the `tc-*` expected answers |
| ≥ 4/5 held-out cases with other cards correct, none confidently wrong | ⚠ Not properly testable yet: no one else chose the cards. The 5/5 generalisation pass is weak evidence (points 2–3 above). |
| Owner review ≤ 2 hours | ⏳ To measure in the review session: 14 feature records, about 80 lines, 20 expected outcomes |

## Findings for the architecture (recorded in ADR-0017 §1)

- **Modal spells** need per-mode target specs and effects; the chosen mode decides (REB vs Swat).
- **Conditional effects are their own kind:** Pyroblast "counter target spell if it's blue" vs REB "counter target blue spell".
- **Restrictions need a closed vocabulary** (`blue`, `noncreature`, `single-target`, …) that code evaluates.
- **Strategies reason about stack objects** (a spell in a chosen mode, or a printed or *created* ability), not about cards.
- **Some answer content sits outside the module:** who gains life after a redirected Swords, "you pay {3}{U}{U} or lose", "before the end step it isn't on the stack yet". Those belong in the approved answer templates, filled from features, not in module logic.

## Effort

About one working session of AI time for features, module, strategies, tests, and this report. That's well inside the 3-day time box. For a sense of scale: one small module plus 14 cards covers the largest question family in the web research (targeting, 14 of 54 questions).

## Recommendation

1. **Continue with the tiered approach** (ADR-0017 §6). One small module covers a whole family, and new cards cost data, not code.
2. **Change the order of work:** the owner validates a family's expected answers *before* its module is written. Then the tests aren't written by the same hand that wrote the code.
3. **Proper generalisation test:** after the league export arrives, pick 10 targeting questions from it that use cards not in `features.json`. Add their features only, then run.
4. **Next modules, by frequency** (docs/research): triggers (optional/mandatory, counting, APNAP ordering), then replacement effects, then turn structure and cleanup. Layers and copy effects last. They're the hardest to codify, and the AI fallback suits them better at first.
