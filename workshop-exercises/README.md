# Copilot Testing Workshop Exercises

This repository is the hands-on codebase for the workshop site.

## Workflow

1. Stay on `main` during the live workshop.
2. Use the workshop pages to decide which files and commands to work on.
3. If you fall behind, compare your work against the step checkpoints such as `solution/step-4-unit` and `solution/step-9-e2e`.

## App Overview

The exercises app is a simple but realistic full-stack target for testing practice:

- Frontend: React + Vite in `src/WorkshopApp.tsx`
- Backend: Express API in `src/app.ts`
- Persistence: file-backed user store in `data/users.json`
- Auth: token-based login/register flow with protected routes

## API Contract

### Public routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/users` (kept public for workshop API generation exercises)

### Protected routes (Bearer token required)

- `GET /api/users/:id`
- `DELETE /api/users/:id`

### Response format

- Success responses return `{ "data": ... }`
- Error responses return `{ "error": { "code": "...", "message": "..." } }`

## Default workshop account

The app seeds a default admin user on startup for testing login flows:

- Email: `alice@example.com`
- Password: `workshop-password`

This is workshop-only seed data and not intended for production usage.

## Starter Surfaces

- `src/services/userService.ts` supports the unit-testing step.
- `src/app.ts` supports the API and integration-testing step.
- `src/components/RegistrationForm.tsx` supports the React Testing Library step.
- `src/ui/pages/LoginPage.tsx` supports the Playwright step.
- `tests/` contains starter scaffolding and intentionally leaves most workshop tests for participants to create.

## Commands

```bash
npm install
npm run dev
npm test
npm run test:api
npm run test:component
npm run test:e2e
```

## Notes for test authors

- API tests can import `resetWorkshopData` from `src/app.ts` to reset local state before each test.
- `tests/setupTests.ts` includes `TextEncoder` and `TextDecoder` setup for API tests running in Jest's jsdom environment.

## Additional Practice Concepts

To practice beyond core test implementation, use these optional concept exercises:

- `copilot.md` — prompt-writing drills for generation, refactoring, and review.
- `.github/skills/api-contract-review/SKILL.md` — contract-focused API test review workflow.
- `.github/skills/mcp-test-investigation/SKILL.md` — MCP-style investigation workflow for failing tests.
- `practice/mcp-practice.md` — guided hands-on drills for MCP investigation habits.
- `practice/README.md` — quick index for all optional concept practice files.