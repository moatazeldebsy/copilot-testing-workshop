# Facilitator Cheat Sheet (One Page)

Use this page as a live delivery aid for the 120-minute workshop.

## Session Timeline (120 min)

| Segment | Minutes | Goal |
|---|---:|---|
| Setup and framing | 0-15 | Ensure all participants can run exercises and use Copilot |
| Copilot fundamentals | 15-35 | Align on modes, trust boundaries, and prompt quality |
| Test generation core | 35-75 | Unit + API + test data workflows with review discipline |
| Responsible adoption | 75-95 | Review checklist, guardrails, CI policy and ownership |
| Advanced testing | 95-115 | E2E, component, and AI feature testing patterns |
| Wrap-up and Q&A | 115-120 | Confirm actions participants can apply immediately |

## Tight Phrasing (Step by Step)

| Step | One-line message |
|---|---|
| 1 Setup | Shared environment first, then speed. |
| 2 Copilot Intro | Copilot is a collaborator, not an authority. |
| 3 Big Picture | Generate -> Review -> Fix is non-negotiable. |
| 4 Unit Testing | Fast drafts are useful only when failures are meaningful. |
| 5 API/Integration | Scaffolds are fast; contracts create trust. |
| 6 Test Data/Mocks | Repetition is great for AI; safety is still human-owned. |
| 7 Review/Guardrails | Quality debt starts where review discipline ends. |
| 8 CI/CD Adoption | Guardrails belong in pipelines, not memory. |
| 9 E2E Playwright | Locator strategy determines long-term stability. |
| 10 Component Testing | Test behavior users see, not internals developers know. |
| 11 AI Testing | Validate structure, safety, and failure paths, not exact wording. |
| 12 Takeaways | Accelerate with AI, govern with standards, measure outcomes. |

## Canonical Live Demo (Fail-First)

1. Ask Copilot to generate tests for one focused method.
2. Run tests and show baseline.
3. Introduce a small implementation bug intentionally.
4. Re-run tests and observe whether the bug is caught.
5. If missed, use Copilot follow-up prompt to strengthen assertions.
6. Re-run until failure is meaningful.
7. Restore implementation and confirm green status.

Prompt to use:

```text
Generate Jest tests for UserService.createUser.
Include: success case, duplicate email error, and missing required field error.
Add precise assertions for returned payload and dependency call arguments.
Avoid toBeTruthy/toBeDefined.
```

## Fallback Paths (If Demo Breaks)

- If local setup fails: switch to pre-recorded terminal output snippets.
- If a dependency install is slow: continue with prompt review and expected output walkthrough.
- If tests fail unexpectedly: narrate triage flow (reproduce -> localize -> hypothesize -> validate -> patch).
- If time runs short: skip bonus exercises and keep the debrief + takeaways.

## Q&A Anchors

- "How do we trust AI-generated tests?" -> same gates as human code + fail-first verification.
- "Where does AI help most?" -> boilerplate, mocks, edge-case expansion, refactors.
- "Where is human judgment essential?" -> strategy, risk, contracts, security, merge decisions.
- "What should we adopt first next week?" -> review checklist + two CI guardrails (secret scan and coverage threshold).

## Exit Criteria for Success

- Participants can generate tests with scoped prompts.
- Participants can identify weak assertions and harden them.
- Participants understand CI guardrails and ownership model.
- Participants leave with one immediate action for their own repository.
