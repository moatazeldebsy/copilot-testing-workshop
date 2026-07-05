# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

Workshop materials for **"GenAI in Testing"** (WeAreDevelopers Berlin 2026) — teaching Copilot-assisted
test automation (unit, API, component, E2E) on a realistic checkout pipeline: **User → Cart → Discount →
Fraud → Payment → Notification**.

## Two Independent Apps — Know Which One You're In

This repo root contains **two separate npm projects that must not be confused**:

1. **Repo root** (`package.json` here) — a React + Vite site that *is* the workshop tutorial/agenda
   itself (prerequisites, exercise walkthroughs). Runs on port **3005**.
   ```bash
   npm install
   npm run dev      # http://localhost:3005
   npm run build
   ```
2. **`workshop-exercises/`** — the actual **system under test**: an Express 5 API + React store UI that
   participants write tests against. This is where almost all substantive engineering work happens.
   ```bash
   cd workshop-exercises
   npm install
   npm run dev:api          # Express API, port 4000, Swagger UI at /docs
   npm run dev:web          # Vite store UI, port 3006 (proxies /api -> :4000)
   npm run dev              # both concurrently
   ```

Always check which `package.json` / working directory a task applies to before running commands.

## Commands (`workshop-exercises/`)

```bash
npm test                     # all Jest tests
npm test -- --coverage       # with coverage (thresholds: 80% lines/functions/statements, 70% branches)
npm run test:unit            # tests/unit
npm run test:api             # tests/api (Supertest)
npm run test:integration     # tests/integration (service-layer, no HTTP)
npm run test:component       # tests/components (React Testing Library)
npm run test:e2e             # Playwright, base URL http://127.0.0.1:3006
npx jest tests/unit/calculateDiscount.test.ts   # single file
npx jest -t "test name substring"               # single test by name
npm run build                # tsc + vite build
```

Node.js **22.12+** is required (vite 8 / rolldown enforce this; below it, npm's optional-dependency
resolution for platform-specific native bindings can silently break — use `nvm use` if `.nvmrc` is present,
otherwise `nvm install 22.12.0 && nvm use 22.12.0`).

## Architecture (`workshop-exercises/`)

- `src/app.ts` is the composition root: repositories are instantiated first, then services are constructed
  by injecting repositories, then routers are mounted by injecting services. Services/repositories are
  exported from here so integration tests can call the pipeline directly without HTTP.
- Layering: `routes/` (Express routers, one per pipeline step) → `services/` (business logic) →
  `repositories/` (in-memory data access). Auth uses JWT bearer tokens verified in middleware in `app.ts`
  before hitting most routes (`PUBLIC_POST_PATHS` lists the exceptions: health, login, register, user creation).
- Response envelope convention: success is `{ data: ... }`, errors are `{ error: { code, message } }` thrown
  as `ApiError` (`src/errors/apiError.ts`) and caught by the global error handler at the bottom of `app.ts`.
- `resetWorkshopData()` (exported from `app.ts`) resets all repositories/services and reseeds the workshop
  admin user — call it in `beforeEach` for any test touching shared state.
- `calculateDiscount.ts` intentionally contains 3 bugs for Exercise A/B; `calculateDiscount.fixed.ts` is the
  solution reference — don't consult it while working the exercise.
- Domain invariants (discount rules, fraud scoring thresholds, payment state machine, error codes) are
  documented in `workshop-exercises/.copilot/context/domain-rules.md` — read it before writing tests or
  code touching discount/fraud/payment logic, since these rules aren't fully inferable from the code alone.

## Test Conventions (`workshop-exercises/`)

Full detail in `workshop-exercises/tests/README.md` and `workshop-exercises/.github/copilot-instructions.md`;
key points:
- AAA pattern (Arrange/Act/Assert) with a blank line between sections; one assertion group per `it()`.
- Assert exact values, never `toBeDefined()`/`toBeTruthy()` as a stand-in for a real check (0 and '' are
  valid falsy results in this domain — discount amounts, risk scores).
- Don't mock the module under test — only its dependencies; prefer real service instances over mocks where
  practical.
- No `Math.random()`/`Date.now()`/wall-clock dependence in tests — seed or fix timestamps.
- Solution files end in `.solution.test.ts(x)` and exist on the matching recovery branch — don't edit them.
- Recovery branches (`01-baseline` through `07-service-integration`) hold progressively completed states;
  check one out to catch up on a specific exercise instead of debugging from scratch.
