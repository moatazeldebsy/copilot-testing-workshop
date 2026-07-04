# Copilot Instructions

These instructions apply to Copilot requests in this repository — the
checkout-pipeline app used as the system under test for the **GenAI in
Testing** workshop.

## Project Context
- Stack: TypeScript + React + Express
- Test tools: Jest, Supertest, Playwright (workshop scenarios)
- Goal: teach high-signal test automation with safe AI-assisted workflows

## Coding Standards
- Prefer small, explicit changes.
- Preserve existing public contracts unless explicitly requested.
- Keep naming descriptive and consistent with current files.
- Avoid broad refactors during focused exercises.

## Test Structure
- Use the AAA pattern (Arrange / Act / Assert) with a blank line between sections.
- One logical assertion group per `it()` block — do not pack multiple concerns.
- Name tests in the form: `<function> <condition> <expected outcome>`.

## Assertions
- Always assert the exact value, not just existence:
  - `expect(result.discountAmount).toBe(10)` — good
  - `expect(result.discountAmount).toBeDefined()` — bad
  - `expect(result.discountAmount).toBeTruthy()` — bad (0 is falsy — this hides bugs)
- Prefer `.toBe()` for primitives, `.toEqual()` for objects/arrays.
- For floating-point results use `.toBeCloseTo(value, 2)`.
- For API responses, validate both HTTP status and envelope shape (`data` or `error.code`/`error.message`).

## Coverage Expectations
Every public function needs tests for:
1. The golden path (valid inputs, expected output)
2. Boundary conditions (minimum values, maximum values, exactly at limits)
3. Error paths (invalid input, missing required fields, expired codes)
4. Edge cases (empty input, negative numbers, very large numbers)

## Mocking Rules
- Do not mock the module under test — only mock its dependencies.
- Do not mock what you can instantiate — prefer real service instances for unit tests.
- When mocking `fetch` or external APIs, assert the mock was called with the right arguments.

## Determinism
- Tests must never rely on `Math.random()`, `Date.now()`, or wall-clock time.
- Seed random data or use fixed timestamps when time-sensitivity is needed.
- A test that passes 99% of the time is a liability, not an asset.
- Do not mix implementation changes with test expectation updates unless required.

## Anti-patterns to Flag in Review
| Anti-pattern | Why it's a problem |
|---|---|
| `expect(x).toBeDefined()` | Passes even when `x` is the wrong value, as long as it's not `undefined` |
| `expect(x).toBeTruthy()` | Falsy values (0, '') are often valid — this hides bugs |
| `expect(fn).not.toThrow()` | Doesn't check the return value |
| Mocking the thing you're testing | Tests the mock, not the code |
| No negative-path tests | Leaves error handling completely untested |
| Time-dependent assertions | Creates flaky CI failures under load |

## Prompt and Review Standards
- Ask for a plan first for multi-file tasks.
- For review requests, output findings by severity before summaries.
- State assumptions when context is incomplete.
- Keep explanations short and practical for workshop learners.

## Security and Privacy
- Never include secrets, tokens, or personal data in code or fixtures.
- Use placeholder domains (for example `example.com`) in sample data.
- Flag insecure defaults rather than silently accepting them.

## Validation
When edits are made, prefer targeted validation first:
1. Run the closest test scope.
2. Expand to broader checks only if needed.
3. Report command outcomes clearly.
