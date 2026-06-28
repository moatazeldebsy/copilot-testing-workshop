# AI Testing Trust Playbook

**GenAI in Testing — WeAreDevelopers 2026**

A field guide for evaluating, improving, and trusting AI-generated tests in production codebases.

---

## The core problem

AI assistants are optimistic writers. They generate tests that make code *look* tested — high counts, readable names, green CI — while missing the edge cases that matter in production. This playbook gives you the vocabulary and tools to catch that gap before it ships.

---

## The Trust Ladder

```
Level 0 — No tests
Level 1 — Tests exist (coverage metric passes)
Level 2 — Tests are deterministic (no flakiness)
Level 3 — Tests catch real bugs (mutation score > 0)
Level 4 — Tests encode domain rules (not just happy paths)
Level 5 — Tests serve as living documentation
```

AI gets you quickly to Level 1–2. The workshop focuses on reaching Level 3–4.

---

## Prompting patterns that work

### Pattern 1 — Specify exact assertions

```
Write tests for calculateDiscount().
For SAVE10 on $100, assert discountAmount is exactly 10, not "truthy".
For FLAT5 on $15 (below $20 minimum), assert discountAmount is exactly 0.
```

### Pattern 2 — Attach domain rules as context

```
#file:.copilot/context/domain-rules.md
Generate tests that cover every invariant in the discount rules table.
```

### Pattern 3 — Ask for the adversarial case

```
What inputs would break calculateDiscount() if there's a bug in the
percent calculation? Write tests that would catch that bug.
```

### Pattern 4 — Review, don't just accept

```
Review these AI-generated tests:
[paste tests]
Identify: weak assertions, missing edge cases, missing negative paths.
Rewrite the weak ones.
```

---

## Anti-patterns to reject in code review

| Pattern | Why it's dangerous | Fix |
|---|---|---|
| `expect(x).toBeDefined()` | Passes even when x has the wrong value | Assert the exact value |
| `expect(x).toBeTruthy()` | 0 and '' are falsy — valid return values | Use `.toBe(0)` or `.toBe('')` |
| `expect(fn).not.toThrow()` | Ignores the return value entirely | Also assert the return |
| Mock the function under test | Tests the mock, not the code | Only mock dependencies |
| `Math.random()` in assertions | Creates non-deterministic tests | Use fixed seeds or counters |
| `Date.now()` timing assertions | Fails under CI load | Mock time with jest.useFakeTimers() |
| Only happy-path tests | All error paths untested | One test per error code |

---

## CI guardrails checklist

- [ ] **Coverage threshold**: ≥ 80% lines, branches, functions (jest `coverageThreshold`)
- [ ] **No `.only` or `.skip`** in merged tests (Copilot sometimes leaves these)
- [ ] **Deterministic seed** for any random data in fixtures
- [ ] **Mutation testing** on critical business logic (`calculateDiscount`, `fraudService`)
- [ ] **Snapshot drift policy**: snapshots reviewed in every PR, not auto-approved

### Sample `jest.config` coverage gate

```json
"coverageThreshold": {
  "global": {
    "lines": 80,
    "branches": 80,
    "functions": 80
  },
  "./src/services/calculateDiscount.ts": {
    "lines": 100,
    "branches": 100
  }
}
```

---

## The five questions for every AI-generated test file

1. **Would this test fail if the function returned the wrong number?**
   Run a quick mental mutation: change `/ 100` to `/ 10`. Does the test catch it?

2. **Is every error code reachable from the tests?**
   Count the `ApiError` codes in the source. Count the tests that trigger them. They should match.

3. **Is there a test that passes on an empty or zero-value input?**
   AI rarely tests `{ subtotal: 0 }` or `{ items: [] }`.

4. **Are any assertions trivially true?**
   `expect(a - b).toBeLessThan(a)` is always true when `b > 0`. That's not a test.

5. **Would this test suite serve as documentation for a new engineer?**
   If the source file were deleted, could someone reconstruct the behaviour from the tests alone?

---

## Key takeaways

- **Copilot writes fast; you write correctly.** Use it for speed, apply your judgement for quality.
- **Coverage ≠ confidence.** 100% coverage with weak assertions is worse than 60% with strong ones — it creates false safety.
- **Context is leverage.** The more domain rules you give Copilot, the better its tests. Invest in `.copilot/context/`.
- **Make the first test fail.** Before trusting any AI-generated test, temporarily break the function and confirm the test catches it.
