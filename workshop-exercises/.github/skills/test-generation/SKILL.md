---
name: test-generation
summary: Scaffold new Jest/Supertest/RTL tests from a target file, reusing shared factories and following repo testing standards.
description: Automatically generate test files for functions, routes, or components using Jest, Supertest, or React Testing Library, following repository testing standards and reusing shared test factories.
---

# Test Generation Skill

Use this skill to draft a first-pass test file for a function, route, or component that doesn't have tests yet.

## Inputs
- Target file (for example `#file:src/services/discountService.ts`)
- Test tier: unit, API, component, or integration
- Any domain rules to attach (`#file:.copilot/context/domain-rules.md`)

## Workflow
1. Read the target file and its existing tests, if any.
2. Reuse shared factories from `tests/factories.ts` instead of inlining fixture data.
3. Draft happy-path, edge-case, and error-path tests — cover null/empty inputs
   and boundary conditions explicitly.
4. Use descriptive test names that state the behavior under test.
5. Run the narrowest test command first (see the relevant `AGENTS.md` in
   `tests/unit/` or `tests/api/`), then widen only if needed.

## Recommended Prompt
```text
Generate tests for ${file}.

Cover: valid input, null/empty values, boundary conditions, invalid states.
Reuse factories from tests/factories where applicable.
Use descriptive test names. Avoid mocking unless necessary.
```

## Exit Criteria
- New tests fail against intentionally broken code (fail-first check).
- No duplicate coverage of an existing test.
- Assertions check specific values/error codes, not just truthiness.
