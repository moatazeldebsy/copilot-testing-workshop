# Tests — solutions branch

This branch has every exercise fully solved. Use it to catch up or compare your own
work — not as a starting point (that's `master`).

## Folder Map

| Folder | Exercise | What's here |
|---|---|---|
| `unit/` | A & B | Solved tests for `calculateDiscount` (core); solved bonus tests for other services |
| `api/` | C | Solved Supertest API tests for the full checkout pipeline |
| `components/` | D | Solved React Testing Library tests for `StorePage` |
| `e2e/` | D | Solved Playwright end-to-end checkout scenarios |
| `integration/` | Demo | Solved service-layer pipeline wiring (Cart → Discount → Fraud → Payment → Notification), no HTTP |
| `fixtures/` | Backup | Pre-generated examples if Copilot or Wi-Fi is unavailable |

## Solved Files

### Exercise A & B — Unit tests (core)
- `unit/calculateDiscount.weak.test.ts` — pre-seeded weak AI tests; read this first to see
  what a weak suite looks like (Exercise B)
- `unit/calculateDiscount.test.ts` — solved with strong assertions; **the 3 intentional
  bugs in `calculateDiscount.ts` are deliberately left in place**, so 6 assertions here
  correctly fail — that failure is the point of the exercise, not a bug in the test
- `unit/notificationService.test.ts` — solved, plus a deliberately flaky test demo
  (Exercise E; that one test is intentionally left broken for the workshop discussion)

### Bonus — Unit tests for pipeline services
Not part of the timed exercises — the full pipeline is covered in Exercise C at the API
level. Solved here for reference if you want to compare unit-level vs. API-level testing
of the same behavior.

- `unit/cartService.test.ts` — CartService: add, remove, merge, subtotal
- `unit/discountService.test.ts` — DiscountService: validate, apply, expired, minimum order
- `unit/fraudService.test.ts` — FraudService: risk scoring rules, country blocks
- `unit/paymentService.test.ts` — PaymentService: charge, capture, refund, state machine

### Exercise C — API tests
- `api/auth-and-users.test.ts` — reference example
- `api/checkout.test.ts` — solved

### Exercise D — Component & E2E
- `components/StorePage.test.tsx` — solved
- `e2e/checkout.spec.ts` — solved; run `npm run dev` in this directory first so both dev
  servers (API on 4000, web on 3006) are up before `npm run test:e2e`

### Integration demo (not a timed exercise)
- `integration/checkout.pipeline.test.ts` — solved; calls `cartService`, `discountService`,
  `fraudService`, `paymentService`, and `notificationService` directly (exported from
  `src/app.ts`), bypassing HTTP entirely. Contrast with Exercise C, which drives the
  same pipeline through Supertest.

## Key Testing Notes

**API tests:**
- Always call `await resetWorkshopData()` in `beforeEach` to reset state between tests
- Success responses: `{ data: ... }` — Error responses: `{ error: { code, message } }`
- Protected routes need `Authorization: Bearer <token>` header

**Component tests:**
- Mock `fetch` with `jest.fn()` before each test
- Use `waitFor(...)` when asserting on async state updates
- Prefer `getByRole` and `getByTestId` over `getByText` when text appears in multiple elements

**E2E tests:**
- Base URL is `http://127.0.0.1:3006` (configured in `playwright.config.ts`)
- Login before each test or use `test.use({ storageState: '...' })`

## Running Tests

```bash
npm test                          # All Jest tests
npm test -- --coverage            # With coverage report
npm run test:api                  # API tests only
npm run test:integration          # Service-layer integration demo only
npm run test:component            # Component tests only
npm run test:e2e                  # Playwright
```

## Comparing Against Your Own Work

Diff your in-progress file on `master` against the matching file here, e.g.:

```bash
git diff master solutions -- tests/api/checkout.test.ts
```
