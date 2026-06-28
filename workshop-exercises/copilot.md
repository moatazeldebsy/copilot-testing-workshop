# Copilot Practice Workbook

Use this file during Step 2 and revisit it in later steps.

## Goal
Practice writing precise prompts for implementation, testing, and review tasks in this exercises repository.

## Exercise 0: Model and Mode Selection
Before writing code, decide which Copilot mode and model profile is appropriate.

Prompt:

```text
Given this task: improve auth API tests for negative paths, recommend the best chat mode (Ask, Plan, Agent) and why.
Then suggest a low-cost prompt and a deep-reasoning prompt.
```

Record your choice and rationale.

## Exercise 1: API Test Generation Prompt
Prompt Copilot Chat with:

```text
Write Supertest tests for /api/auth/register and /api/auth/login in this repository.
Validate status codes and response envelope shape ({ data } on success, { error } on failure).
Include one duplicate email test and one invalid credentials test.
```

Then compare output against:
- `tests/api/auth-and-users.test.ts`
- `src/app.ts`

## Exercise 2: Refactor Prompt
Prompt Copilot Chat with:

```text
Refactor UserService validation logic to reduce duplication.
Keep behavior unchanged and preserve current API error codes.
Add or update unit tests for the refactor.
```

Then verify:
- No contract change in `src/services/userService.ts`
- Existing API tests still pass

## Exercise 3: Review Prompt
Prompt Copilot Chat with:

```text
Review this file for testability risks and security concerns: src/services/tokenService.ts.
List findings by severity with concrete code-level fixes.
```

Apply only high-confidence fixes after manual review.

## Exercise 4: Prompt Iteration
Take one weak prompt and improve it three times.
Track changes and outcome quality in this table:

| Iteration | Prompt quality change | Result quality | Notes |
|---|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |

## Exercise 5: Plan -> Agent Workflow
Run a two-stage workflow:

1. In Plan mode:

```text
Plan minimal updates to strengthen tests/api/auth-and-users.test.ts for invalid credentials and duplicate email paths.
No edits yet.
```

2. In Agent mode:

```text
Apply the approved plan with minimal changes, run API tests only, and summarize findings first.
```

Write down what the plan caught that an immediate implementation prompt missed.

## Exit Criteria
- You completed one model/mode selection drill.
- You produced at least one useful generated test.
- You rejected at least one incorrect Copilot suggestion.
- You can explain why a revised prompt produced better output.
- You completed one Plan -> Agent execution cycle.
