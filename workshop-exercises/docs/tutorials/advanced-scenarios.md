# Advanced Scenarios: Guardrails, CI/CD, and Team Adoption

This guide covers the patterns needed to use GitHub Copilot for testing responsibly at team scale: a trust framework for judging AI-generated tests, guardrail prompt templates, CI/CD integration, and phased adoption.

## 1. The Trust Framework

AI assistants are optimistic writers. They generate tests that make code *look* tested — high counts, readable names, green CI — while missing the edge cases that matter in production. This section gives you the vocabulary and tools to catch that gap before it ships.

### The Trust Ladder

```
Level 0 — No tests
Level 1 — Tests exist (coverage metric passes)
Level 2 — Tests are deterministic (no flakiness)
Level 3 — Tests catch real bugs (mutation score > 0)
Level 4 — Tests encode domain rules (not just happy paths)
Level 5 — Tests serve as living documentation
```

AI gets you quickly to Level 1–2. The workshop focuses on reaching Level 3–4.

### Prompting patterns that work

**Pattern 1 — Specify exact assertions**

```
Write tests for calculateDiscount().
For SAVE10 on $100, assert discountAmount is exactly 10, not "truthy".
For FLAT5 on $15 (below $20 minimum), assert discountAmount is exactly 0.
```

**Pattern 2 — Attach domain rules as context**

```
#file:.copilot/context/domain-rules.md
Generate tests that cover every invariant in the discount rules table.
```

**Pattern 3 — Ask for the adversarial case**

```
What inputs would break calculateDiscount() if there's a bug in the
percent calculation? Write tests that would catch that bug.
```

**Pattern 4 — Review, don't just accept**

```
Review these AI-generated tests:
[paste tests]
Identify: weak assertions, missing edge cases, missing negative paths.
Rewrite the weak ones.
```

### The five questions for every AI-generated test file

1. **Would this test fail if the function returned the wrong number?**
   Run a quick mental mutation: change `/ 100` to `/ 10`. Does the test catch it?
2. **Is every error code reachable from the tests?**
   Count the `ApiError` codes in the source. Count the tests that trigger them. They should match.
3. **Is there a test that passes on an empty or zero-value input?**
   AI rarely tests `{ subtotal: 0 }` or `{ items: [] }`.
4. **Are any assertions trivially true?**
   `expect(a - b).toBeLessThan(a)` is always true when `b > 0`. That's not a test.
5. **Would this test suite serve as documentation for a new engineer?**
   If the source file were deleted, could someone reconstruct the behaviour from the tests alone?

**Key takeaways:**

- **Copilot writes fast; you write correctly.** Use it for speed, apply your judgement for quality.
- **Coverage ≠ confidence.** 100% coverage with weak assertions is worse than 60% with strong ones — it creates false safety.
- **Context is leverage.** The more domain rules you give Copilot, the better its tests. Invest in `.copilot/context/`.
- **Make the first test fail.** Before trusting any AI-generated test, temporarily break the function and confirm the test catches it.

---

## 2. Anti-Patterns and Guardrail Prompts

When Copilot's output fails your review checklist, use these follow-up prompts in Chat to self-correct.

| Anti-pattern | Why it's dangerous | Fix |
|---|---|---|
| `expect(x).toBeDefined()` / `toBeTruthy()` | Passes even when x has the wrong value; 0 and '' are falsy but valid return values | Assert the exact value, e.g. `.toBe(0)` |
| Only happy-path tests | All error paths untested | One test per error code |
| Mock the function under test | Tests the mock, not the code | Only mock dependencies |
| `Date.now()` / `Math.random()` in assertions | Non-deterministic, fails under CI load | Mock time with `jest.useFakeTimers()`; use fixed seeds |
| `expect(fn).not.toThrow()` alone | Ignores the return value entirely | Also assert the return value |
| Mocked dependency called with any args | Doesn't verify correct usage | Assert exact call arguments |

### Fix Vague Assertions

```
Review this test. Replace any toBeTruthy, toBeFalsy, toBeDefined, or toBeUndefined 
assertions with specific matchers that check the actual expected value.
```

### Add Missing Error Cases

```
This test suite only covers the success path. Add test cases for all error conditions: 
validation errors, not-found cases, and dependency failures.
```

### Fix Tautological Tests

```
Does this test actually verify service behaviour, or does it only verify what the 
mock returns? If the test would pass even if the service method did nothing, 
rewrite it to test a real behaviour.
```

### Fix Flaky Time Dependencies

```
This test uses new Date(), Date.now(), or Math.random() in assertions. 
Rewrite it to be deterministic using jest.useFakeTimers() or by testing 
relative/structural properties instead of exact values.
```

### Add Call-Argument Assertions

```
Add assertions to verify that all mocked dependencies were called with the exact 
expected arguments, not just that they were called.
```

### Full Quality Review

```
Review this test file for: vague assertions, missing error scenarios, hardcoded 
credentials or PII, flaky patterns (time/random), and missing mock resets. 
List all issues found with line numbers.
```

---

## 3. ESLint Rules for AI-Generated Test Quality

This exercises repo does not ship an ESLint config today — the block below is a
suggested starting point if you want to add one to catch common Copilot output
problems automatically (flat config, for ESLint 9+):

```js
// eslint.config.js
import jest from 'eslint-plugin-jest';

export default [
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    plugins: { jest },
    rules: {
      'jest/no-truthy-falsy': 'error',
      'jest/prefer-expect-assertions': 'warn',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/expect-expect': 'error',
    },
  },
];
```

---

## 4. CI/CD Pipeline with AI Guardrails

Policy baseline: AI-generated code must pass the exact same gates as human-written code.

### Static and Security Analysis Stack

| Gate Type | Suggested Tools | Purpose |
|---|---|---|
| Lint and conventions | ESLint, Checkstyle | Detect weak assertions, anti-patterns, style drift |
| Static analysis | CodeQL, SonarQube | Find logic flaws, taint flows, maintainability risks |
| Dependency and SAST | Snyk, Dependabot, Trivy | Catch vulnerable packages and insecure dependencies |
| Secret scanning | gitleaks, truffleHog | Block leaked tokens, credentials, and accidental secrets |

None of these are wired into this repo's actual CI yet (see below for what's really
enforced today) — treat this table as a menu to add from, not a description of the
current pipeline.

### CI Outcome Semantics (for clear ownership)

| Exit code | Meaning | Required action |
|---|---|---|
| `0` | Pass | Continue merge checks |
| `1` | Failure | Block merge until fixed |
| `2` | Unclear / ambiguous | Route to human triage with explicit reviewer sign-off |

### The Actual Workshop Workflow

This is the real `workshop-exercises/.github/workflows/test.yml` running in this repo today:

```yaml
name: Test And Quality Gates

on:
  pull_request:
    branches: [master]
  push:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build UI
        run: npm run build

      - name: Run tests with coverage
        run: npm test -- --coverage --coverageReporters=json-summary

      - name: Check coverage threshold
        run: |
          COVERAGE=$(node -e "const s=require('./coverage/coverage-summary.json'); console.log(s.total.lines.pct)")
          echo "Line coverage: $COVERAGE%"
          node -e "if (Number(process.argv[1]) < 80) { process.exit(1) }" "$COVERAGE"
```

It runs build + coverage-gated tests, nothing more. Lint and secret-scanning are **not**
part of it — if you want those guardrails, add steps like these yourself:

```yaml
      # Add after "Install dependencies" once you have an eslint.config.js (see section 3)
      - name: Lint
        run: npx eslint .

      # Add anywhere before the test step
      - name: Secret scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Jest Coverage Threshold

The real `workshop-exercises/jest.config.ts`:

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx'],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },
  },
};

export default config;
```

### Additional guardrails worth adding

Beyond the coverage gate this repo already enforces, consider:

- **No `.only` or `.skip`** in merged tests (Copilot sometimes leaves these behind).
- **Deterministic seed** for any random data in fixtures.
- **Mutation testing** on critical business logic (`calculateDiscount`, `fraudService`) —
  a coverage percentage says a line ran, not that a wrong result would be caught.
- **Snapshot drift policy**: snapshots reviewed in every PR, not auto-approved.
- **Per-file coverage overrides** for the highest-risk modules:

```json
"coverageThreshold": {
  "global": {
    "lines": 80,
    "branches": 80,
    "functions": 80
  },
  "./src/services/calculateDiscount.ts": {
    "lines": 100,
    "branches": 100
  }
}
```

---

## 5. CODEOWNERS for AI-Generated Tests

This repo doesn't have a CODEOWNERS file today. If your team wants mandatory
reviewer routing for test changes, add one like this:

```bash
# .github/CODEOWNERS
# Test files require review from a QA lead
tests/            @your-org/qa-leads
src/**/*.test.ts  @your-org/qa-leads
src/**/*.spec.ts  @your-org/qa-leads
```

---

## 6. PR Template

The real `workshop-exercises/.github/pull_request_template.md`:

```markdown
<!--
Reviewing AI-generated tests checklist (see this tutorial's Trust Framework
and Anti-Patterns sections above).
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
```

### Optional: Auto-label AI-Assisted PRs

Not present in this repo — a pattern to adopt if useful:

```yaml
# .github/workflows/label-ai-pr.yml
name: Label AI-assisted PRs

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Add AI label from PR template marker
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.pull_request.body || '';
            if (body.includes('- [x] This PR contains AI-generated tests')) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                labels: ['ai-generated-tests']
              });
            }
```

---

## 7. Sandboxes and Safe Agent Execution

As Copilot becomes more agentic, test workflows increasingly involve command execution, file edits, and tool usage. Sandboxes are the safest way to let Copilot act without giving unrestricted access to your machine.

### Local sandboxing

Use local sandboxing when you want Copilot CLI to run commands on your machine with restricted filesystem, network, and system access:

```text
/sandbox enable
```

### Cloud sandboxing

Use cloud sandboxing when you want isolated execution, easier cross-device continuation, or to offload heavier work from your laptop:

```bash
copilot --cloud
```

### Workshop guidance

- Prefer **local sandboxing** for safe experimentation against a local exercises repo
- Prefer **cloud sandboxing** for compute-heavy or longer-running agent tasks
- Do not place secrets directly in prompts; use repository or environment secrets instead
- Treat sandbox sessions as billable and govern them with the same care as other agentic workflows

---

## 8. Team Adoption: Phased Rollout

| Phase | Timeline | Actions | Success Criteria |
|---|---|---|---|
| Pilot | Week 1–2 | 1–2 volunteer engineers use Copilot for tests; document prompt patterns that work | 3+ reusable prompt templates documented |
| Standards | Week 3–4 | Share prompt templates + review checklist; ESLint rules added to CI | Team-wide agreement on review process |
| Automation | Month 2 | gitleaks + coverage gates in CI; CODEOWNERS added | Zero secrets committed; coverage maintained |
| Measure | Month 3+ | Track flaky test rate, mean time to detect, PR review time | Flaky rate down; review time stable or improved |

---

## 9. What to Measure

Coverage % is not enough. Track these metrics before and after Copilot adoption:

| Metric | How to Measure | Target |
|---|---|---|
| Flaky test rate | `% of CI runs with a test failure not reproducible locally` | Decrease |
| Mean time to detect (MTTD) | `Time from bug introduced to test failure in CI` | Decrease |
| PR review cycle time | `Time from PR opened to merge` | Stable or decrease |
| Secret scan alerts | `Alerts from gitleaks per sprint` | Zero |
| Coverage threshold failures | `CI jobs failing on coverage gate` | Zero (after threshold is set) |

---

## 10. Conference-Safe Live Demo Runbook (Fail-First)

Use this exact sequence to demonstrate responsible AI usage with minimal risk:

1. Generate a test draft with Copilot for one method with clear success + failure scenarios.
2. Run tests and show initial pass/fail result.
3. Intentionally break the implementation (single-line logic change).
4. Re-run tests and show whether they catch the defect.
5. If the defect is not caught, ask Copilot to strengthen assertions and add missing edge cases.
6. Re-run tests again until failure is meaningful.
7. Restore implementation and show green pipeline.

Demo prompt template:

```text
Generate Jest tests for UserService.createUser.
Include: success case, duplicate email error, and missing required field error.
Add precise assertions for returned payload and dependency call arguments.
Avoid toBeTruthy/toBeDefined.
```

Debrief line for audience:

"Speed comes from generation. Trust comes from fail-first verification and guardrails."

---

## Next Steps

- Return to the **[CI/CD & Team Adoption](/workshop/cicd-adoption)** workshop step for the hands-on exercise
- Review the **[Key Takeaways](/workshop/takeaways)** page
- Share the prompt templates and review checklist with your team
