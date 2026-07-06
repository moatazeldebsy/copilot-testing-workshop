<!--
Reviewing AI-generated tests checklist (see the workshop site's Advanced Scenarios
tutorial — Trust Framework and Anti-Patterns sections — at /tutorials/advanced-scenarios).
Treat every generated test like a pull request from a junior teammate.
-->

## What changed

<!-- One or two sentences: what behavior does this PR add or change? -->

## Test review checklist

- [ ] Does each new test assert the actual behavior, not an implementation detail?
- [ ] Would it fail if the code were broken on purpose? (fail-first check)
- [ ] Are inputs realistic and are edge cases covered?
- [ ] Is the test isolated, deterministic, and free of hidden state or timing dependence?
- [ ] Is the test name a clear statement of the behavior under test?
- [ ] Does it avoid leaking secrets, tokens, or real user data?

## Quality gates (enforced in CI)

- [ ] All tests green
- [ ] Coverage threshold met (80% lines/functions/statements, 70% branches)
- [ ] No flaky reruns needed to pass
- [ ] Security scan clean (`npm audit --omit=dev --audit-level=high`)

A human reviewer owns this checklist — AI-assisted generation speeds up
authoring, but does not replace review.
