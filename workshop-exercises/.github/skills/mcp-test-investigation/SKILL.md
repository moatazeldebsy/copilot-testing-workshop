---
name: mcp-test-investigation
summary: Use MCP-style tool workflows to investigate failing tests, triage root cause, and propose safe fixes.
---

# MCP Test Investigation Skill

Use this skill for investigation drills during workshop practice.

## Scenario
A test fails unexpectedly after a refactor. You need a repeatable investigation workflow.

## Workflow
1. Reproduce failure with a focused command.
2. Gather failure output and identify first failing assertion.
3. Inspect route/service/repository path involved.
4. Confirm whether failure is due to:
- behavior regression
- stale test expectation
- data setup leakage
5. Propose minimal fix and re-run targeted tests.

## Investigation Prompt
```text
Act as a test investigation assistant.
Use a strict workflow: reproduce, localize, hypothesize, validate, and patch.
Prioritize behavior regressions over cosmetic test changes.
Provide findings first, then minimal fix.
```

## Commands (examples)
```bash
npm run test:api
npm test -- tests/api/auth-and-users.test.ts --runInBand
```

## Exit Criteria
- Root cause identified
- Minimal patch applied
- Targeted tests pass
- No unrelated behavior changed
