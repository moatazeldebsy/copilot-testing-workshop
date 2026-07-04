# Workshop Exercises

The hands-on codebase for the **GenAI in Testing** workshop at WeAreDevelopers 2026.

## Quick Start

```bash
npm install

# Terminal 1 — backend API on port 4000
npm run dev:api

# Terminal 2 — frontend on port 3006
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

- Store UI: `http://localhost:3006`
- Swagger API docs: `http://localhost:4000/docs`
- Default login: `alice@example.com` / `workshop-password`

## System Under Test — Checkout Pipeline

The exercises use a realistic e-commerce pipeline as their target:

```
User → Cart → Discount → Fraud → Payment → Notification
```

Every exercise type (unit, API, component, E2E) tests a different layer of the same domain.

## API Contract

### Public routes
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected routes (Bearer token required)
- `GET  /api/cart/:userId`
- `POST /api/cart/:userId/items`
- `DELETE /api/cart/:userId/items/:itemId`
- `POST /api/discount/validate`
- `POST /api/discount/apply`
- `POST /api/fraud/check`
- `POST /api/payment/charge`
- `POST /api/payment/:id/capture`
- `POST /api/payment/:id/refund`
- `POST /api/notifications/receipt`
- `GET  /api/notifications/:userId`

**Response envelope:** success → `{ "data": ... }`, error → `{ "error": { "code": "...", "message": "..." } }`

See the full schema at `http://localhost:4000/docs` or in `src/openapi.ts`.

## Exercise Files

### Exercise A & B — `calculateDiscount`

`src/services/calculateDiscount.ts` is a standalone discount calculator with **3 intentional bugs**:

1. **BUG 1:** `value / 10` instead of `/ 100` — SAVE10 gives 100% off instead of 10%
2. **BUG 2:** FLAT5 minimum-order guard is missing — applies even on orders below $20
3. **BUG 3:** `finalTotal` can go negative — no clamping to 0

**Exercise A:** Use Copilot to generate unit tests for `calculateDiscount`. Good tests will fail (revealing bugs). Weak tests will pass and hide the bugs.

**Exercise B:** Read `tests/unit/calculateDiscount.weak.test.ts` — pre-seeded AI-generated tests that all pass but miss the bugs. Identify what's wrong and write better ones.

The solution is in `calculateDiscount.fixed.ts` — but try not to peek!

### Exercise C — API Tests

Fill in `tests/api/checkout.test.ts` using Copilot. Cover the full pipeline:

```
POST /api/auth/login  →  POST /api/cart/:id/items  →  POST /api/discount/apply
  →  POST /api/fraud/check  →  POST /api/payment/charge
  →  POST /api/payment/:id/capture  →  POST /api/notifications/receipt
```

Tip: use `#file:src/openapi.ts` and `#file:.copilot/context/domain-rules.md` in your Copilot Chat prompt.
(`domain-rules.md` lives at the repo root — `../.copilot/context/domain-rules.md`
relative to this folder — since Copilot Chat resolves `#file:` against the
VS Code workspace root, not your terminal's working directory.)

### Exercise D — Component & E2E Tests

- `tests/components/StorePage.test.tsx` — React Testing Library tests for `StorePage`
- `tests/e2e/checkout.spec.ts` — Playwright end-to-end scenarios

### Integration Tests — service-layer demo (not timed)

`tests/integration/checkout.pipeline.test.ts` calls the exported service
singletons (`cartService`, `discountService`, `fraudService`, `paymentService`,
`notificationService` from `src/app.ts`) directly — no HTTP, no mocks. This
exercises real cross-module wiring, distinct from Exercise C's HTTP-level
contract tests.

### Exercise E — CI Guardrails

Explore `.github/copilot-instructions.md` (in this folder) and `.copilot/context/domain-rules.md`
(at the repo root). Try context engineering: attach domain-rules.md to a
Copilot Chat session and compare the test quality vs without it.

## Seeded Test Data

| Discount code | Type | Value | Min order | Status |
|---|---|---|---|---|
| `SAVE10` | percent | 10% | none | active |
| `FLAT5` | flat | $5 | $20 | active |
| `EXPIRED` | percent | 15% | none | expired |

Fraud rules: order > $1000 → +40 risk; items > 20 → +30; country `XX` or `ZZ` → +50. Score ≥ 50 = `high` (blocked).

## Test Commands

```bash
npm test                          # All Jest tests (unit + API + component)
npm run test:api                  # API tests only
npm run test:component            # Component tests only
npm run test:e2e                  # Playwright E2E tests
npm test -- --coverage            # With coverage report
```

API tests call `resetWorkshopData()` from `src/app.ts` in `beforeEach` to reset state.

## Recovery Branches

If you fall behind, checkout the solution branch for the exercise you need:

```bash
git checkout 02-unit-testing      # Exercise A solution
git checkout 03-api-testing       # Exercise C solution
git checkout 04-integration-testing  # Exercise D solution
git checkout 05-ci-guardrails     # CI workflow
git checkout 06-review-patterns   # Trust Playbook + instructions
git checkout 07-service-integration  # Integration pipeline demo solution
git checkout master               # Back to the workshop starting point
```

## Extra Practice

- `copilot.md` — prompt-writing drills for generation, refactoring, and review
- `../.copilot/skills/unit-testing.md` (repo root) — reusable prompt template and review checklist
- `../.copilot/context/domain-rules.md` (repo root) — business rules reference for context engineering
- `.github/skills/pact-contracts/SKILL.md` — contract-focused API test review
- `.github/skills/flaky-test-hunt/SKILL.md` — flaky test investigation workflow
- `.github/skills/test-generation/SKILL.md` — scaffold new tests from a target file
- `tests/integration/checkout.pipeline.test.ts` — service-layer integration demo (Cart → Discount → Fraud → Payment → Notification, no HTTP)
- `docs/ai-testing-trust-playbook.md` — session takeaway playbook
- `tests/fixtures/calculateDiscount-examples.md` — backup examples if Copilot is unavailable
