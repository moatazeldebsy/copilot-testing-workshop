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
