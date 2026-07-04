# AGENTS — tests/unit

Scoped to unit tests.

## Focus
`calculateDiscount` and other pure functions in `src/services/`.

## Rules
- Do not modify files under `src/`.
- One behavior per test, named for the behavior it proves.
- Avoid weak assertions (`toBeTruthy`, `toBeDefined`) when a specific value can be checked.

## Validation
Run: `npm run test:unit`
