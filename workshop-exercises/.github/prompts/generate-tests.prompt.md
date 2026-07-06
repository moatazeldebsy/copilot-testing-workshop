---
agent: agent
description: Generate Jest tests for a source file
applyTo: workshop-exercises/src/**
---

Write Jest tests for ${file}.

## Structure
- Use AAA pattern (Arrange / Act / Assert) with a blank line between each section.
- One logical assertion group per `it()` block.

## Coverage
- Cover happy path, edge cases, and error/rejection cases.
- Reuse factories from `tests/factories/` where applicable.
- Do not test private functions.

## Assertions
- Assert exact values — never use `toBeDefined()` or `toBeTruthy()` as a substitute for a real check.
  (0, '', and false are valid domain results for discounts and risk scores.)

## Mocking
- Do not mock the module under test — only its dependencies.
- Prefer real service instances over mocks where practical.
- Do not use `Math.random()`, `Date.now()`, or wall-clock time in tests.

## Domain
- For discount, fraud, or payment logic, consult `workshop-exercises/.copilot/context/domain-rules.md`
  before writing assertions — rules are not fully inferable from the code alone.

## Unclear behavior
- Stop and ask if behavior or expected output is ambiguous.
