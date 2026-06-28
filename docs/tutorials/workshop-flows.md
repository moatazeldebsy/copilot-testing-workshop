# Workshop Diagrams and Flows

This document provides practical flow diagrams for live workshop delivery.

## Diagram Placement Map (Exact Workshop Pages)

Use this matrix to place each flow in the matching workshop page.

| Workshop page | Recommended diagram | Placement inside page |
|---|---|---|
| `/workshop/setup` | `1. End-to-End Workshop Flow` | After page lead, before first setup command |
| `/workshop/copilot-intro` | `3. Copilot Test Workflow` | After model/mode explanation, before slash commands |
| `/workshop/copilot-overview` | `2. Delivery Rhythm per Step` | After trust model section |
| `/workshop/unit-testing` | `4. Unit Testing Flow (Step 4)` | Before prompt-first or generation section |
| `/workshop/api-integration` | `5. API and Integration Testing Flow (Step 5)` | Before scaffold generation prompt |
| `/workshop/test-data-mocks` | `6. Test Data and Mocks Flow (Step 6)` | Before fixture factory section |
| `/workshop/reviewing-tests` | `7. Review and Guardrails Flow (Step 7)` | Before review checklist table |
| `/workshop/cicd-adoption` | `8. CI/CD Adoption Flow (Step 8)` | Before GitHub Actions workflow section |
| `/workshop/e2e-playwright` | `9. E2E Playwright Flow (Step 9)` | Before page object model section |
| `/workshop/component-testing` | `10. Component Testing Flow (Step 10)` | Before RTL philosophy section |
| `/workshop/ai-testing-patterns` | `11. AI Testing Patterns Flow (Step 11)` | Before non-deterministic output section |
| `/workshop/takeaways` | `12. Facilitator Flow for 120 Minutes` + `13. Audience Branching Flow` | Before resources/what-next section |

## Delivery Notes

- Keep one primary diagram visible per step page to avoid cognitive overload.
- For conference delivery, use the facilitator timer and jump links to align with `2. Delivery Rhythm per Step`.
- Use `1. End-to-End Workshop Flow` on opening and transition moments, not on every page.

## 1. End-to-End Workshop Flow

```mermaid
flowchart LR
  A[Setup 20 min] --> B[Exercise A Unit Tests 20 min]
  B --> C[Exercise B Review AI Tests 20 min]
  C --> D[Exercise C API Tests 25 min]
  D --> E[Exercise D Component and E2E 20 min]
  E --> F[Exercise E CI Guardrails 10 min]
  F --> G[Wrap-up 5 min]
```

## 2. Delivery Rhythm per Step

```mermaid
flowchart LR
  A[Concept Brief 3-5 min] --> B[Demo 3-6 min]
  B --> C[Guided Hands-on 6-10 min]
  C --> D[Verification Checkpoint 2-4 min]
  D --> E[Debrief and Q/A 2-4 min]
```

## 3. Copilot Test Workflow

```mermaid
flowchart LR
  A[Prompt Task] --> B[Generate Draft with Copilot]
  B --> C[Review Assertions and Risks]
  C --> D[Fix Weak Tests]
  D --> E[Run Tests]
  E --> F{Pass and Meaningful?}
  F -- No --> C
  F -- Yes --> G[Commit and PR]
```

## 4. Unit Testing Flow (Step 4)

```mermaid
flowchart TD
  A[Read Service Contract] --> B[Prompt for Unit Test Draft]
  B --> C[Check happy path + error paths]
  C --> D[Add call-argument assertions]
  D --> E[Remove flaky randomness/time]
  E --> F[Run targeted unit test command]
```

## 5. API and Integration Testing Flow (Step 5)

```mermaid
flowchart TD
  A[Define route contract] --> B[Generate Supertest scaffold]
  B --> C[Assert status + envelope shape]
  C --> D[Add auth cases missing/invalid/valid]
  D --> E[Add duplicate/error scenarios]
  E --> F[Run API suite]
  F --> G[Add focused real persistence integration test]
```

## 6. Test Data and Mocks Flow (Step 6)

```mermaid
flowchart TD
  A[Type definitions] --> B[Generate factory with overrides]
  B --> C[Generate mock service stubs]
  C --> D[Scan for secrets/PII]
  D --> E[Use in unit and API tests]
  E --> F[Refactor to shared factory utilities]
```

## 7. Review and Guardrails Flow (Step 7)

```mermaid
flowchart TD
  A[Generated test file] --> B[Checklist review]
  B --> C[Vague assertions replaced]
  C --> D[Error paths completed]
  D --> E[Flaky patterns removed]
  E --> F[Security scan and lint]
  F --> G[Ready for PR review]
```

## 8. CI/CD Adoption Flow (Step 8)

```mermaid
flowchart LR
  A[PR Opened] --> B[Lint]
  B --> C[Secret Scan]
  C --> D[Tests + Coverage]
  D --> E[Policy Checks CODEOWNERS]
  E --> F{All Gates Green?}
  F -- No --> G[Fix and Re-run]
  F -- Yes --> H[Merge]
```

## 9. E2E Playwright Flow (Step 9)

```mermaid
flowchart TD
  A[Identify critical user journey] --> B[Generate Page Object]
  B --> C[Use resilient role/label locators]
  C --> D[Write scenario tests]
  D --> E[Fixture setup for auth/test data]
  E --> F[Run Playwright locally and in CI]
```

## 10. Component Testing Flow (Step 10)

```mermaid
flowchart TD
  A[Component props and behavior] --> B[Generate RTL tests]
  B --> C[Prefer getByRole/getByLabel]
  C --> D[Use user-event interactions]
  D --> E[Mock hooks/providers if needed]
  E --> F[Verify behavior not implementation details]
```

## 11. AI Testing Patterns Flow (Step 11)

```mermaid
flowchart TD
  A[Define AI feature contract] --> B[Mock LLM/tools]
  B --> C[Assert structure and constraints]
  C --> D[Test malformed output paths]
  D --> E[Test prompt injection handling]
  E --> F[Validate agent tool-call order]
```

## 12. Facilitator Flow for 120 Minutes

```mermaid
flowchart LR
  A[Setup 20 min] --> B[Generate Exercise A 20 min]
  B --> C[Review Exercise B 20 min]
  C --> D[API Exercise C 25 min]
  D --> E[Integration and E2E Exercise D 20 min]
  E --> F[CI Guardrails Exercise E 10 min]
  F --> G[Wrap-up 5 min]
```

## 13. Audience Branching Flow (Conference Mixed Audience)

```mermaid
flowchart TD
  A[Shared core path all attendees] --> B{Audience comfort level}
  B -- Beginner --> C[Stay on core prompts and verification]
  B -- Intermediate --> D[Add advanced assertion hardening]
  B -- Advanced/Platform --> E[Add governance and CI policy depth]
  C --> F[Common debrief]
  D --> F
  E --> F
```
