# AGENTS.md — workshop-exercises

Default behavior for coding agents working in the **checkout-pipeline system under test**.
See [.github/copilot-instructions.md](.github/copilot-instructions.md) for full test coding standards.

## Mission
Help workshop participants produce reliable tests quickly while preserving application behavior.

## Architecture

Layering: `routes/` → `services/` → `repositories/` (in-memory).

- **Composition root:** `src/app.ts` — instantiates repositories, injects them into services, mounts routers. Services/repositories are exported here for direct use in integration tests.
- **Auth:** JWT bearer tokens checked in middleware in `app.ts`. Exceptions listed in `PUBLIC_POST_PATHS`.
- **Response envelope:** success `{ data: ... }`, errors `{ error: { code, message } }` via `ApiError` in `src/errors/apiError.ts`.
- **Test reset:** `resetWorkshopData()` (exported from `app.ts`) — call in `beforeEach` for any test touching shared state.
- **Domain rules:** business logic (discount codes, fraud thresholds, payment state machine, error codes) → [`./copilot/context/domain-rules.md`](.copilot/context/domain-rules.md). Read before writing tests for discount/fraud/payment.
- **Intentional bugs:** `src/services/calculateDiscount.ts` has 3 bugs for exercises. Do not fix them — strong tests exposing bugs is the point. `calculateDiscount.fixed.ts` is the reference solution.

## Commands

```bash
npm test                     # all Jest tests
npm run test:unit            # tests/unit/
npm run test:api             # tests/api/ (Supertest)
npm run test:integration     # tests/integration/
npm run test:component       # tests/components/ (RTL)
npm run test:e2e             # Playwright — requires servers on :3006/:4000
npm test -- --coverage       # coverage (thresholds: 80% lines/functions/statements, 70% branches)
npx jest tests/unit/calculateDiscount.test.ts   # single file
npx jest -t "test name substring"               # single test by name
npm run dev:api              # Express on :4000 — Swagger at /docs
npm run dev:web              # Vite store on :3006
```

## Priorities
1. Keep behavior and API contracts unchanged unless explicitly requested.
2. Prefer minimal, reviewable patches over large rewrites.
3. Verify with targeted test commands before proposing broader test runs.
4. Report findings first for any review task.

## Working Rules
- Read relevant files before editing.
- For API test tasks, assert status code, response shape, and `error.code` in error envelopes.
- For unit test tasks, avoid weak assertions (`toBeTruthy`, `toBeDefined`) when a specific value can be checked.
- Never introduce real secrets, credentials, or production endpoints in test data.
- If a command fails, explain root cause and propose the smallest safe fix.
- Reuse shared factories from `tests/factories.ts` instead of inlining fixture data.

## Available Skills & Agents
- `/test-generation` — scaffold new Jest/Supertest/RTL tests from a target file
- `/flaky-test-hunt` — find and fix timing or shared-state flakiness
- `/pact-contracts` — review API tests against route contracts

## Prompt Pattern
Use this structure for higher-quality outcomes:

```text
Task: [specific objective]
Scope: [exact files or folders]
Constraints: [what must not change]
Validation: [command to run]
Output: findings first, then patch summary
```

## Done Criteria
- Requested change is implemented.
- Relevant tests pass locally via the narrowest applicable command.
- Output includes assumptions and any residual risk.
