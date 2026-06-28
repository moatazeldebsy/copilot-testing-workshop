# Copilot Practice Workbook

Prompt-writing drills for the checkout pipeline. Use during exercises or as extra practice.

## Before You Start

Attach these context files in Copilot Chat for better output:
- `#file:.copilot/context/domain-rules.md` — business rules (discount codes, fraud thresholds, error codes)
- `#file:src/services/calculateDiscount.ts` — the function under test for Exercise A & B
- `#file:src/openapi.ts` — full API schema for Exercise C

---

## Exercise A — Generate Unit Tests for `calculateDiscount`

### Prompt: weak version (try this first)

```text
Write Jest unit tests for calculateDiscount in src/services/calculateDiscount.ts.
```

Run the tests. They should all pass. But do they catch real bugs?

### Prompt: strong version (try after)

```text
#file:src/services/calculateDiscount.ts
#file:.copilot/context/domain-rules.md

Write Jest unit tests for calculateDiscount.
Use the AAA pattern with a blank line between Arrange, Act, and Assert.
For SAVE10 on $100, assert discountAmount is exactly 10 and finalTotal is exactly 90.
For FLAT5 on a $15 order (below $20 minimum), assert discountAmount is exactly 0.
For FLAT5 on a $3 order, assert finalTotal is greater than or equal to 0.
Assert the exact code value is returned in the result.
Avoid toBeTruthy, toBeDefined, and assertions that would pass even when the
implementation returns the wrong number.
```

Run the tests. 6 should now fail — that means the tests are working.

---

## Exercise B — Find the Weak Tests

Open `tests/unit/calculateDiscount.weak.test.ts`. Read each test.

### Prompt: review

```text
#file:tests/unit/calculateDiscount.weak.test.ts
#file:.copilot/context/domain-rules.md

Review these AI-generated tests for calculateDiscount.
For each test, identify: is the assertion strong enough to catch a real bug?
List which tests would still pass even if the implementation were broken.
Suggest a rewrite for each weak assertion.
```

### What to look for

- `expect(result).toBeDefined()` → passes even if result has wrong values
- `expect(result.discountAmount).toBeTruthy()` → 0 is falsy, so valid zero-discounts would fail
- `expect(lower.discountAmount).toBe(upper.discountAmount)` → checks consistency, not correctness
- Missing tests: below-minimum FLAT5, negative finalTotal, $0 subtotal

---

## Exercise C — API Tests for the Checkout Pipeline

### Prompt: cart tests

```text
#file:src/routes/cart.ts
#file:.copilot/context/domain-rules.md

Write Supertest tests for the cart API.
Import { app, resetWorkshopData } from '../../src/app' and call resetWorkshopData() in beforeEach.
Test: GET cart (empty), POST add item (assert subtotal), DELETE item (assert item removed),
DELETE non-existent item (assert 404 ITEM_NOT_FOUND).
All cart routes require Authorization: Bearer <token> — login first.
```

### Prompt: full pipeline

```text
#file:src/openapi.ts
#file:.copilot/context/domain-rules.md

Write one Supertest integration test that exercises the full checkout pipeline in sequence:
1. Login → get token and userId
2. Add two items to the cart
3. Apply SAVE10 discount — assert discountAmount is exactly 10% of the subtotal
4. Run fraud check with a low-risk request — assert approved is true
5. Charge — assert status is 'pending'
6. Capture — assert status is 'captured'
7. Send receipt notification — assert type is 'receipt'
Use resetWorkshopData() in beforeEach.
```

### Prompt: error paths

```text
#file:.copilot/context/domain-rules.md

Write Supertest tests for the discount API error paths:
- EXPIRED code → 400 DISCOUNT_EXPIRED
- Unknown code → 404 INVALID_DISCOUNT_CODE
- FLAT5 on $10 order → 400 ORDER_BELOW_MINIMUM
Assert both the HTTP status code and the error.code field.
```

---

## Exercise D — Component Tests for StorePage

### Prompt: component tests

```text
#file:src/ui/pages/StorePage.tsx

Write React Testing Library tests for StorePage.
Mock global.fetch with jest.fn().
Test: store renders (check for 'Workshop Store' text and 'Products' heading),
empty cart state shows 'your cart is empty',
clicking Add calls fetch with the correct URL and method,
pay button is absent when cart is empty,
pay button is enabled after adding items.
Use waitFor for async state updates after clicking Add.
```

### Prompt: E2E Playwright

```text
#file:tests/e2e/checkout.spec.ts
#file:playwright.config.ts

Write Playwright tests for the checkout flow.
Base URL is http://127.0.0.1:3006.
Test 1: navigate to /login, fill alice@example.com / workshop-password, assert redirect to /store.
Test 2: login, click add-prod_1, assert cart-items data-testid contains the product name.
Test 3: full golden path — login, add item, enter SAVE10, apply, click Pay, assert confirmation screen.
Use page.getByTestId() for stable selectors.
```

---

## Exercise E — Context Engineering

### Prompt: generate with context

```text
#file:.copilot/context/domain-rules.md

Generate Jest unit tests for fraudService.check in src/services/fraudService.ts.
Cover every risk score rule in the domain rules (orderAmount, itemCount, ipCountry).
For each threshold, test at the limit and just outside it.
Assert the exact riskScore value and the correct riskLevel and approved fields.
```

Compare this output to what you get without attaching domain-rules.md.

### Prompt: review for CI

```text
Review tests/unit/calculateDiscount.weak.test.ts.
Identify tests that would still pass against a broken implementation.
Identify missing coverage for the error paths listed in .copilot/context/domain-rules.md.
Suggest a jest coverageThreshold config that would enforce meaningful coverage.
```

---

## Prompt Iteration Drill

Take any weak prompt and improve it three times. Track the quality change:

| Iteration | What you added to the prompt | Result quality | Notes |
|---|---|---|---|
| 1 | Base prompt (no context) | | |
| 2 | Added #file context | | |
| 3 | Added exact assertion requirements | | |

## Exit Criteria

- You produced at least one test that fails against the buggy `calculateDiscount.ts`.
- You rewrote at least one weak test from `calculateDiscount.weak.test.ts`.
- You can explain why `toBeTruthy()` is an anti-pattern in unit tests.
- You generated an API test for a non-happy-path scenario.
- You used context-file attachment in at least one Copilot Chat prompt.
