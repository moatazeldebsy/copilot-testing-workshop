# Test Scaffold

The workshop starts with incomplete or missing tests on purpose.

Create tests in these folders as you progress through the workshop:

- `tests/unit`
- `tests/api`
- `tests/integration`
- `tests/components`
- `tests/e2e`
- `tests/services`

Recommended first files:

- `tests/unit/userService.test.ts`
- `tests/api/auth-and-users.test.ts`
- `tests/components/RegistrationForm.test.tsx`
- `tests/e2e/login.spec.ts`

## Current implemented baseline

- `tests/api/auth-and-users.test.ts` validates:
	- register success contract
	- bearer-token requirement on protected routes
	- login success for seeded admin user
	- duplicate-email structured error payload

## API testing notes

- Use `resetWorkshopData()` from `src/app.ts` in `beforeEach` to isolate test state.
- API success payloads are wrapped in `data`; error payloads are wrapped in `error`.
- Protected endpoints require `Authorization: Bearer <token>`.