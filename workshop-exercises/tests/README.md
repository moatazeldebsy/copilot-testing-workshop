# Tests

The workshop starts with incomplete stubs — that's intentional. You fill them in using Copilot.

## Folder Map

| Folder | Exercise | What to build |
|---|---|---|
| `unit/` | A & B | Unit tests for `calculateDiscount` and the pipeline services |
| `api/` | C | Supertest API tests for the checkout pipeline |
| `components/` | D | React Testing Library tests for `StorePage` |
| `e2e/` | D | Playwright end-to-end checkout scenarios |
| `fixtures/` | Backup | Pre-generated examples if Copilot or Wi-Fi is unavailable |

## Starting Files

### Exercise A & B — Unit tests
- `unit/calculateDiscount.weak.test.ts` — pre-seeded weak AI tests; **read before writing your own** (Exercise B)
- `unit/calculateDiscount.test.ts` — does not exist yet; create it (Exercise A)
- `unit/cartService.test.ts` — stubs, fill in
- `unit/discountService.test.ts` — stubs, fill in
- `unit/fraudService.test.ts` — stubs, fill in
- `unit/paymentService.test.ts` — stubs, fill in
- `unit/notificationService.test.ts` — stubs + a flaky test demo (do not fix the marked test)

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
