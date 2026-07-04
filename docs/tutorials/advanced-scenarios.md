# Advanced Scenarios: Guardrails, CI/CD, and Team Adoption

This guide covers the patterns needed to use GitHub Copilot for testing responsibly at team scale: guardrail prompt templates, CI/CD integration, and phased adoption.

## 1. Guardrail Prompt Templates

When Copilot's output fails your review checklist, use these follow-up prompts in Chat to self-correct:

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

## 2. ESLint Rules for AI-Generated Test Quality

Add these rules to your `.eslintrc.json` to catch common Copilot output problems automatically:

```json
{
  "plugins": ["jest"],
  "rules": {
    "jest/no-truthy-falsy": "error",
    "jest/prefer-expect-assertions": "warn",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/expect-expect": "error"
  }
}
```

---

## 3. CI/CD Pipeline with AI Guardrails

Policy baseline: AI-generated code must pass the exact same gates as human-written code.

### Static and Security Analysis Stack

| Gate Type | Suggested Tools | Purpose |
|---|---|---|
| Lint and conventions | ESLint, Checkstyle | Detect weak assertions, anti-patterns, style drift |
| Static analysis | CodeQL, SonarQube | Find logic flaws, taint flows, maintainability risks |
| Dependency and SAST | Snyk, Dependabot, Trivy | Catch vulnerable packages and insecure dependencies |
| Secret scanning | gitleaks, truffleHog | Block leaked tokens, credentials, and accidental secrets |

### CI Outcome Semantics (for clear ownership)

| Exit code | Meaning | Required action |
|---|---|---|
| `0` | Pass | Continue merge checks |
| `1` | Failure | Block merge until fixed |
| `2` | Unclear / ambiguous | Route to human triage with explicit reviewer sign-off |

### Minimal GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test & Quality Gates

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci

      # Guardrail 1: Lint (catches vague assertions via ESLint jest rules)
      - run: npm run lint

      # Guardrail 2: Secret scan (catches AI-generated credentials)
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # Guardrail 3: Tests with coverage
      - run: npm test -- --coverage

      # Guardrail 4: Coverage threshold (fail if below 80%)
      - name: Coverage gate
        run: |
          node -e "
            const s = require('./coverage/coverage-summary.json');
            const pct = s.total.lines.pct;
            console.log('Line coverage:', pct + '%');
            if (pct < 80) { console.error('FAIL: Coverage below 80%'); process.exit(1); }
          "
```

### Jest Coverage Threshold

```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};

export default config;
```

---

## 4. CODEOWNERS for AI-Generated Tests

```bash
# .github/CODEOWNERS
# Test files require review from a QA lead
tests/            @your-org/qa-leads
src/**/*.test.ts  @your-org/qa-leads
src/**/*.spec.ts  @your-org/qa-leads
```

---

## 5. PR Template

```markdown
<!-- .github/pull_request_template.md -->
## Changes
<!-- What changed and why -->

## AI-Generated Code
- [ ] This PR contains AI-generated tests
- [ ] I applied the AI test review checklist
- [ ] Assertions are specific (no toBeTruthy/toBeFalsy)
- [ ] No hardcoded credentials or PII in test data
- [ ] All tests pass locally (`npm test`)
- [ ] Coverage thresholds met (`npm test -- --coverage`)
```

### Optional: Auto-label AI-Assisted PRs

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

## 6. Sandboxes and Safe Agent Execution

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

## 7. Team Adoption: Phased Rollout

| Phase | Timeline | Actions | Success Criteria |
|---|---|---|---|
| Pilot | Week 1–2 | 1–2 volunteer engineers use Copilot for tests; document prompt patterns that work | 3+ reusable prompt templates documented |
| Standards | Week 3–4 | Share prompt templates + review checklist; ESLint rules added to CI | Team-wide agreement on review process |
| Automation | Month 2 | gitleaks + coverage gates in CI; CODEOWNERS added | Zero secrets committed; coverage maintained |
| Measure | Month 3+ | Track flaky test rate, mean time to detect, PR review time | Flaky rate down; review time stable or improved |

---

## 8. What to Measure

Coverage % is not enough. Track these metrics before and after Copilot adoption:

| Metric | How to Measure | Target |
|---|---|---|
| Flaky test rate | `% of CI runs with a test failure not reproducible locally` | Decrease |
| Mean time to detect (MTTD) | `Time from bug introduced to test failure in CI` | Decrease |
| PR review cycle time | `Time from PR opened to merge` | Stable or decrease |
| Secret scan alerts | `Alerts from gitleaks per sprint` | Zero |
| Coverage threshold failures | `CI jobs failing on coverage gate` | Zero (after threshold is set) |

---

## 9. Conference-Safe Live Demo Runbook (Fail-First)

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

- Return to the **[CI/CD & Team Adoption](../../src/pages/workshop/CicdAdoption.tsx)** workshop step for the hands-on exercise
- Review the **[Key Takeaways](../../src/pages/workshop/Takeaways.tsx)** page
- Share the prompt templates and review checklist with your team
