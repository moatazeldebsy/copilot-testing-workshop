# Skill: Generate Unit Tests

Use this prompt template when asking Copilot Chat to generate unit tests.
Attach the relevant source file and domain rules for best results.

---

## Prompt template

```
You are a senior engineer writing Jest unit tests for a TypeScript Node.js project.

Context files:
- #file:<path-to-source>
- #file:.copilot/context/domain-rules.md

Write a complete Jest test suite for `<FunctionOrClass>` that:

1. Tests the golden path (valid inputs → expected outputs with exact values)
2. Tests every boundary condition listed in the domain rules
3. Tests every error path (invalid input, edge cases, constraint violations)
4. Uses the AAA pattern (Arrange / Act / Assert) with a blank line between sections
5. Names each test: "<subject> <condition> <expected outcome>"
6. Uses `.toBe()` for primitives and `.toEqual()` for objects — never `.toBeDefined()` or `.toBeTruthy()`
7. Covers negative cases — what happens when the function receives invalid or extreme input?

Do NOT:
- Mock the function under test
- Write tests that always pass regardless of the implementation
- Use `toBeTruthy()` or `toBeDefined()` as the primary assertion
```

---

## Example: high-quality vs weak test

**Weak (AI default):**
```typescript
it('applies SAVE10 discount', () => {
  const result = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
  expect(result).toBeDefined();
});
```

**Strong (what you want):**
```typescript
it('SAVE10 deducts exactly 10% from the subtotal', () => {
  // Arrange
  const input = { subtotal: 100, code: 'SAVE10' };

  // Act
  const result = calculateDiscount(input);

  // Assert
  expect(result.discountAmount).toBe(10);
  expect(result.finalTotal).toBe(90);
  expect(result.code).toBe('SAVE10');
});
```

---

## Review checklist before accepting AI-generated tests

- [ ] Every `expect()` asserts a **specific value**, not just existence
- [ ] There is at least one test for **each error code** the function can throw
- [ ] Boundary values are tested (at-limit and just-outside-limit)
- [ ] No `Math.random()` or `Date.now()` in test logic
- [ ] Test names read like sentences that describe behaviour
- [ ] Running the tests against a **broken implementation** would still make them fail

---

## Applied example: Exercise A

```
#: 2
Slide page: UnitTesting.tsx
Exercise: Exercise A — generate unit tests for "src/services/calculateDiscount.ts"
Recommended Copilot method: Copilot Chat
Files:
 #file:src/services/calculateDiscount.ts
 #file:.copilot/context/domain-rules.md
Why: Needs the full domain-rules context (discount boundary values) to have a chance
     of catching the 3 seeded bugs — inline completion alone won't pull that context in.
```

Full prompt used:

```
You are a senior engineer writing Jest unit tests for a TypeScript Node.js project.

Context files:
- #file:src/services/calculateDiscount.ts
- #file:.copilot/context/domain-rules.md

Write a complete Jest test suite for `calculateDiscount` that:

1. Tests the golden path (valid inputs → expected outputs with exact values)
2. Tests every boundary condition listed in the domain rules
3. Tests every error path (invalid input, edge cases, constraint violations)
4. Uses the AAA pattern (Arrange / Act / Assert) with a blank line between sections
5. Names each test: "<subject> <condition> <expected outcome>"
6. Uses `.toBe()` for primitives and `.toEqual()` for objects — never `.toBeDefined()` or `.toBeTruthy()`
7. Covers negative cases — what happens when the function receives invalid or extreme input?

Do NOT:
- Mock the function under test
- Write tests that always pass regardless of the implementation
- Use `toBeTruthy()` or `toBeDefined()` as the primary assertion
```

Verify with:

```bash
npx jest tests/unit/calculateDiscount.test.ts
```

---

## Applied example: Exercise B

```
#: 3
Slide page: ReviewingTests.tsx
Exercise: Exercise B — critique "tests/unit/calculateDiscount.weak.test.ts"
Recommended Copilot method: Copilot Chat
Files:
 #file:tests/unit/calculateDiscount.weak.test.ts
 #file:src/services/calculateDiscount.ts
Why: This is a critique task, not generation — Copilot Chat evaluates existing
     weak assertions against the review checklist rather than writing new tests
     from scratch.
```

Full prompt used:

```
You are reviewing a Jest test file for a TypeScript Node.js project.

Context files:
- #file:tests/unit/calculateDiscount.weak.test.ts
- #file:src/services/calculateDiscount.ts

For each test in calculateDiscount.weak.test.ts:
1. State whether the assertion checks a specific value or just existence/truthiness/no-throw.
2. Explain what bug could exist in the implementation and still make this test pass.
3. Rewrite the assertion to assert the exact expected value using .toBe()/.toEqual().

Then write the 4 missing test cases listed in the comment at the bottom of the file:
1. Exact discountAmount for SAVE10 on $100 (should be $10, not $100)
2. FLAT5 below the $20 minimum (should not apply)
3. finalTotal should never go negative
4. Edge cases: $0 subtotal, very large amounts

Do NOT modify src/services/calculateDiscount.ts — only the test file.
```

Verify with:

```bash
npx jest tests/unit/calculateDiscount.weak.test.ts
```

Result: 7 failed / 3 passed, out of 10 total. All 3 seeded bugs caught —
BUG 1 (SAVE10 ÷10 instead of ÷100) surfaced in 5 tests, BUG 2 (FLAT5 missing
the $20 minimum guard) in 1, BUG 3 (no `finalTotal` clamp) in 1. The 3 passes
are legitimately unaffected cases, not false positives.
