# MCP Practice Drills

This guide gives lightweight MCP-style practice scenarios without requiring external services.

## Drill 1: Investigate an API Failure
1. Intentionally break one assertion in `tests/api/auth-and-users.test.ts`.
2. Run:

```bash
npm run test:api
```

3. Use your investigation workflow:
- Reproduce
- Localize
- Hypothesize
- Validate
- Fix

4. Restore passing state.

## Drill 2: Contract Drift Detection
1. Temporarily change one response field in `src/app.ts`.
2. Re-run API tests.
3. Decide whether to:
- fix implementation to preserve contract, or
- update tests because contract intentionally changed.

## Drill 3: Auth Boundary Checks
1. Add one test for missing Bearer token.
2. Add one test for malformed Bearer token.
3. Add one test for valid token path.

## MCP Tooling Mindset
Treat each drill as tool-assisted investigation, not guesswork:
- read exact failure output
- inspect only relevant files first
- prefer small, verifiable changes
