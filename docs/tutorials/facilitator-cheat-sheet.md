# Facilitator Cheat Sheet

Use this as a live delivery aid for the 120-minute workshop.

## Session Timeline

| Time | Segment | Goal | Duration |
|---|---|---|---:|
| 12:15 | **Intro, Setup & Tour** | All participants running the app, Copilot active, pipeline understood | 15 min |
| 12:30 | **Exercise A — Unit Tests** | Generate tests for `calculateDiscount()`; discover that weak prompts produce weak tests | 25 min |
| 12:55 | **Exercise B — Review AI Tests** | Read `calculateDiscount.weak.test.ts`; identify what passes but shouldn't; rewrite | 10 min |
| 13:05 | **Exercise C — API Tests** | Supertest for the full pipeline; use domain-rules.md as context | 25 min |
| 13:30 | **Exercise D — Component Tests** | StorePage RTL tests hands-on; Playwright shown as live demo / optional extra | 20 min |
| 13:50 | **Exercise E — CI Guardrails** | Coverage gates, flaky test demo, `.github/copilot-instructions.md`, context engineering | 10 min |
| 14:00 | **Wrap-up & Q&A** | Trust Playbook walkthrough, one action to take back, open discussion | 15 min |

## One-line Message per Segment

| Segment | Key message |
|---|---|
| Intro & Setup | Copilot is a first-draft machine — your job is to decide what "correct" means. |
| Exercise A | Fast drafts are useful only when failures are meaningful. |
| Exercise B | AI optimizes for coverage metrics, not for catching failures. |
| Exercise C | Domain context turns generic Copilot output into domain-aware test suites. |
| Exercise D | Test behavior users see; prefer `data-testid` and `getByRole` over implementation internals. |
| Exercise E | Guardrails belong in pipelines, not in memory. |
| Wrap-up | Accelerate with AI, govern with standards, measure outcomes. |

## Live Demo Script — The Fail-First Loop (Exercise A)

**Setup (before running):** `calculateDiscount.ts` has 3 bugs pre-seeded. Do not tell participants yet.

1. Open `src/services/calculateDiscount.ts` — read the function aloud (2 min).
2. Open Copilot Chat, attach `#file:src/services/calculateDiscount.ts`.
3. Prompt (weak version first):
   ```
   Write Jest unit tests for calculateDiscount.
   ```
4. Accept the output, run tests → **all pass** (weak assertions miss all 3 bugs).
5. Ask the room: "Would you ship with this coverage?"
6. Prompt again (strong version):
   ```
   Write Jest unit tests for calculateDiscount.
   For SAVE10 on $100, assert discountAmount is exactly 10.
   For FLAT5 on $15 (below $20 min), assert discountAmount is exactly 0.
   Assert finalTotal is never negative.
   Avoid toBeTruthy and toBeDefined.
   ```
7. Run new tests → **6 fail** (all 3 bugs exposed).
8. "That's the difference between tests that check and tests that verify."

**Timing:** This demo should land in 6–8 minutes inside Exercise A.

## The Flaky Test Moment (Exercise E)

Point to `tests/unit/notificationService.test.ts`. The test marked `🚨 FLAKY` uses `Date.now()` timing.

Ask: "If this passes 99% of the time on your machine but fails 1 in 10 CI runs, is it a good test?"

Follow-up prompt for participants:
```
This test uses Date.now() timing assertions. Rewrite it to be deterministic
using jest.useFakeTimers() or by asserting a structural property instead of timing.
```

## Context Engineering Demo (Exercise E)

Show the difference between prompting with and without domain context:

**Without context:**
```
Write tests for the discount API endpoint.
```

**With context (attach file):**
```
#file:.copilot/context/domain-rules.md
Write tests for POST /api/discount/apply.
Cover every error code in the domain rules table.
```

Ask participants to compare assertion specificity in the two outputs.

## Recovery Plan

| Problem | Action |
|---|---|
| Copilot unavailable | Use `tests/fixtures/calculateDiscount-examples.md` — paste the strong tests directly |
| Participant stuck on Exercise A | `git checkout 02-unit-testing` to see the solution |
| Participant stuck on Exercise C | `git checkout 03-api-testing` |
| Tests fail unexpectedly | Narrate the triage flow: reproduce → localize → hypothesize → verify → patch |
| Time short | Skip Exercise D; keep Exercise E and wrap-up |

## Q&A Anchors

- **"How do we trust AI-generated tests?"** — same gates as human code: fail-first + CI coverage threshold.
- **"Where does AI help most?"** — boilerplate, scaffolding, edge-case enumeration, test data factories.
- **"Where is human judgment essential?"** — domain rules, risk assessment, boundary decisions, security review.
- **"What should we adopt first next week?"** — `.copilot-instructions.md` + 80% coverage gate + fix one weak assertion pattern.

## Exit Criteria

- Participants can generate tests with scoped, context-rich prompts.
- Participants can identify weak assertions and rewrite them.
- Participants understand what the flaky test moment illustrates.
- Participants leave with one immediate action for their own repo.
- Participants have the Trust Playbook (`docs/ai-testing-trust-playbook.md`) as a reference.
