# AGENTS — tests/api

Scoped to API tests.

## Focus
Checkout pipeline routes in `src/routes/`.

## Rules
- Attach `#file:.copilot/context/domain-rules.md` for discount/fraud edge cases.
- Assert status code and response envelope (`data` or `error.code`/`error.message`), not just one.
- Call `resetWorkshopData()` in `beforeEach` to keep tests isolated.

## Validation
Run: `npm run test:api`
