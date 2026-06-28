# AGENTS

This file defines the default behavior for coding agents in this repository.

## Mission
Help workshop participants produce reliable tests quickly while preserving application behavior.

## Priorities
1. Keep behavior and API contracts unchanged unless explicitly requested.
2. Prefer minimal, reviewable patches over large rewrites.
3. Verify with targeted test commands before proposing broader test runs.
4. Report findings first for any review task.

## Working Rules
- Read relevant files before editing.
- For API test tasks, assert status code, response shape, and error payloads.
- For unit test tasks, avoid weak assertions like `toBeTruthy()` when a specific value can be checked.
- Never introduce real secrets, credentials, or production endpoints in test data.
- If a command fails, explain root cause and propose the smallest safe fix.

## Prompt Pattern
Use this structure for higher-quality outcomes:

```text
Task: [specific objective]
Scope: [exact files or folders]
Constraints: [what must not change]
Validation: [command to run]
Output: findings first, then patch summary
```

## Validation Commands
- API tests: `npm run test:api`
- All tests: `npm test`
- Build: `npm run build`

## Done Criteria
- Requested change is implemented.
- Relevant tests pass.
- Output includes assumptions and any residual risk.
