# GitHub Copilot — Testing Standards

This repository is the system under test for the **GenAI in Testing** workshop
at WeAreDevelopers 2026. These instructions set the baseline expectations for
any AI-generated test code in this project.

## Test structure

- Use the **AAA pattern** (Arrange / Act / Assert) with a blank line between sections.
- One logical assertion group per `it()` block — do not pack multiple concerns.
- Name tests in the form: `<function> <condition> <expected outcome>`.

## Assertions

- Always assert the **exact value**, not just existence:
  - `expect(result.discountAmount).toBe(10)` ✅
  - `expect(result.discountAmount).toBeDefined()` ❌
  - `expect(result.discountAmount).toBeTruthy()` ❌ (0 is falsy — this hides bugs)
- Prefer `.toBe()` for primitives, `.toEqual()` for objects/arrays.
- For floating-point results use `.toBeCloseTo(value, 2)`.

## Coverage expectations

Every public function needs tests for:
1. The **golden path** (valid inputs, expected output)
2. **Boundary conditions** (minimum values, maximum values, exactly at limits)
3. **Error paths** (invalid input, missing required fields, expired codes)
4. **Edge cases** (empty input, negative numbers, very large numbers)

## Mocking rules

- **Do not mock the module under test** — only mock its dependencies.
- **Do not mock what you can instantiate** — prefer real service instances for unit tests.
- When mocking `fetch` or external APIs, assert the mock was called with the right arguments.

## Determinism

- Tests must **never** rely on `Math.random()`, `Date.now()`, or wall-clock time.
- Seed random data or use fixed timestamps when time-sensitivity is needed.
- A test that passes 99% of the time is a liability, not an asset.

## Anti-patterns to flag in code review

| Anti-pattern | Why it's a problem |
|---|---|
| `expect(x).toBeDefined()` | Passes even when x is `undefined` if the type allows it, or misses wrong values |
| `expect(x).toBeTruthy()` | Falsy values (0, '') are often valid — this hides bugs |
| `expect(fn).not.toThrow()` | Doesn't check the return value |
| Mocking the thing you're testing | Tests the mock, not the code |
| No negative-path tests | Leaves error handling completely untested |
| Time-dependent assertions | Creates flaky CI failures under load |
