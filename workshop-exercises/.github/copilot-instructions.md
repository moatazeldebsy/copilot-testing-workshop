# Copilot Instructions

These instructions apply to Copilot requests in this repository.

## Project Context
- Stack: TypeScript + React + Express
- Test tools: Jest, Supertest, Playwright (workshop scenarios)
- Goal: teach high-signal test automation with safe AI-assisted workflows

## Coding Standards
- Prefer small, explicit changes.
- Preserve existing public contracts unless explicitly requested.
- Keep naming descriptive and consistent with current files.
- Avoid broad refactors during focused exercises.

## Testing Standards
- Write deterministic tests with clear setup.
- Assert exact expected values and error codes when available.
- For API responses, validate both HTTP status and envelope shape.
- Do not mix implementation changes with test expectation updates unless required.

## Prompt and Review Standards
- Ask for a plan first for multi-file tasks.
- For review requests, output findings by severity before summaries.
- State assumptions when context is incomplete.
- Keep explanations short and practical for workshop learners.

## Security and Privacy
- Never include secrets, tokens, or personal data in code or fixtures.
- Use placeholder domains (for example `example.com`) in sample data.
- Flag insecure defaults rather than silently accepting them.

## Validation
When edits are made, prefer targeted validation first:
1. Run the closest test scope.
2. Expand to broader checks only if needed.
3. Report command outcomes clearly.
