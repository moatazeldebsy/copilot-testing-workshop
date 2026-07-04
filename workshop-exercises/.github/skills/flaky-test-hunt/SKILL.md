---
name: flaky-test-hunt
summary: Find and fix tests that depend on timing, execution order, or shared state instead of asserting deterministic behavior.
---

# Flaky Test Hunt Skill

Use this skill when a test passes inconsistently, or when reviewing a test for hidden non-determinism before it reaches CI.

## Scenario
A test fails intermittently — for example on a loaded CI runner, or only when
run alongside other tests. See `tests/unit/notificationService.test.ts` for a
seeded example (`Date.now()` timing assertion).

## Checklist
1. Look for `Date.now()`, `setTimeout`, or wall-clock comparisons in assertions.
2. Look for shared mutable state (module-level variables, a shared repository)
   that isn't reset between tests.
3. Look for order dependence — does the test assume a prior test already ran?
4. Look for real network or filesystem calls that aren't mocked.

## Fix Patterns
- Timing: use `jest.useFakeTimers().setSystemTime(...)` or assert structure
  (`sentAt` is a `Date`) instead of an exact value.
- Shared state: reset repositories/singletons in `beforeEach`.
- Order dependence: make each test independently seed what it needs.

## Recommended Prompt
```text
This test uses Date.now() timing assertions. Rewrite it to be deterministic
using jest.useFakeTimers() or by asserting a structural property instead of
exact timing.
```

## Exit Criteria
- Test passes consistently across repeated local runs (`--runInBand` and in parallel).
- No wall-clock or execution-order dependency remains.
- The original behavior under test is still covered.
