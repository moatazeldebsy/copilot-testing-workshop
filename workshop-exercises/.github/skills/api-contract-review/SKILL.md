---
name: api-contract-review
summary: Review and harden API tests against route contracts, auth rules, and response envelopes in workshop-exercises.
---

# API Contract Review Skill

Use this skill when working on API tests in this repository.

## Inputs
- Target route (for example `/api/auth/register`)
- Existing test file path
- Desired failure paths to cover

## Checklist
1. Confirm status code assertions are explicit.
2. Confirm response envelope assertions are explicit:
- Success: `response.body.data`
- Failure: `response.body.error.code` and `response.body.error.message`
3. Confirm auth behavior is covered for protected routes:
- Missing token
- Invalid token
- Valid token
4. Confirm sensitive fields are not exposed (for example `passwordHash`).
5. Confirm test isolation with deterministic reset setup.

## Recommended Prompt
```text
Review this API test file against the current Express route contract in src/app.ts.
Identify missing assertions for status, envelope shape, auth behavior, and sensitive field exposure.
Return findings ordered by severity, then propose exact test updates.
```

## Expected Output
- Severity-ordered findings
- Concrete patch suggestions
- Any contract mismatch between tests and route implementation
