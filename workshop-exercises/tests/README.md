# Tests

The workshop starts with incomplete stubs — that's intentional. You fill them in using Copilot.

## Folder Map

| Folder | Exercise | What to build |
|---|---|---|
| `unit/` | A & B | Unit tests for `calculateDiscount` (core); bonus stubs for other services |
| `api/` | C | Supertest API tests for the full checkout pipeline |
| `components/` | D | React Testing Library tests for `StorePage` |
| `e2e/` | D | Playwright end-to-end checkout scenarios (live demo) |
| `fixtures/` | Backup | Pre-generated examples if Copilot or Wi-Fi is unavailable |

## Starting Files

### Exercise A & B — Unit tests (core)
- `unit/calculateDiscount.weak.test.ts` — pre-seeded weak AI tests; **read before writing your own** (Exercise B)
- `unit/calculateDiscount.test.ts` — does not exist yet; create it (Exercise A)
- `unit/notificationService.test.ts` — stubs + a deliberately flaky test demo (Exercise E; do not fix the marked test)

### Bonus — Unit tests for pipeline services (if you finish early)
These stubs cover the full pipeline at the unit level. They are **not** part of the timed exercises — the full pipeline is covered in Exercise C at the API level. Use these if you finish Exercise A/B early or want more Copilot practice after the session.

- `unit/cartService.test.ts` — CartService: add, remove, merge, subtotal
- `unit/discountService.test.ts` — DiscountService: validate, apply, expired, minimum order
- `unit/fraudService.test.ts` — FraudService: risk scoring rules, country blocks
- `unit/paymentService.test.ts` — PaymentService: charge, capture, refund, state machine

### Exercise C — API tests
- `api/auth-and-users.test.ts` — already complete; use as reference
- `api/checkout.test.ts` — stubs, fill in

### Exercise D — Component & E2E
- `components/CartPage.test.tsx` — stubs, fill in
- `e2e/checkout.spec.ts` — stubs, fill in

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
npm run test:component            # Component tests only
npm run test:e2e                  # Playwright
```

## Solution Files

Solution files end in `.solution.test.ts` / `.solution.test.tsx` and are always present on the matching recovery branch. Do not modify them during the workshop — they exist so you can compare your work.
