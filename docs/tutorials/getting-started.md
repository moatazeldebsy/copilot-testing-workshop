# Getting Started with Copilot for Testing

This guide walks you through the essentials of using GitHub Copilot to write tests, from installation to your first AI-generated test suite.

## 1. Install and Activate GitHub Copilot

### Install the VS Code Extensions

Open VS Code and sign in to GitHub Copilot. In the current setup flow, VS Code installs the
required Copilot components automatically.

- **GitHub Copilot** (`GitHub.copilot`) — primary VS Code extension for Copilot
- **Copilot Chat** — available automatically in current VS Code Copilot setup

```bash
# Verify Copilot is installed
code --list-extensions | grep copilot
# GitHub.copilot
# GitHub.copilot-chat may also appear on some installs
```

To use Copilot in VS Code, you need either Copilot Free or a paid Copilot plan.

### Activate Copilot

1. Click the **Accounts** icon in the VS Code Activity Bar
2. Select **Sign in with GitHub to use GitHub Copilot**
3. Authorize in the browser
4. Return to VS Code — the Copilot icon in the status bar should show **Ready**

## 2. Pick the Right Model and Chat Mode

Before generating tests, choose the model and mode that best fits the task.

### Model selection quick guide

| Use case | Suggested model behavior |
|---|---|
| Fast first draft of tests | Prefer speed-oriented model choices for quick iteration |
| Deep reasoning on flaky or complex failures | Prefer stronger reasoning-oriented model choices |
| Repo-wide or multi-file planning | Use a higher-capability model, then narrow context with `#file`/`#selection` |
| Budget-sensitive iteration | Start with smaller scoped prompts and focused files |

The exact model names available depend on your Copilot plan and current rollout in VS Code.

### Auto model selection quick guide

If you are unsure which model to pick, start with **Auto**. Current GitHub guidance is that Auto can route work based on task complexity, current model health, and policy constraints, which often gives a better default balance of speed, cost, and reliability than pinning a model manually.

Use a specific model only when you are intentionally reproducing output, comparing results, or escalating a task that is clearly stuck.

- **Prefer Auto** for everyday test drafting, review, CLI, and agent workflows
- **Pin a stronger model** for ambiguous failures, multi-file contract changes, or hard flaky-test triage
- **Expect policy limits** in some organizations: admins can restrict which models Auto is allowed to use

### Mode selection quick guide

| Mode | Best for | Rule of thumb |
|---|---|---|
| Ask | Q&A, explanation, quick snippets | Use for understanding and short edits |
| Plan | Design-first approach | Use before large changes you want to review first |
| Agent | Multi-step implementation and fixing | Use when you want Copilot to iterate end-to-end |

If you use Agent mode, keep tasks narrow and explicit to control token and credit usage.

---

## 3. Your First Copilot Test

### Inline Suggestion

Open any TypeScript file and start typing a test. Copilot suggests the rest — press `Tab` to accept.

```typescript
// Type this and watch Copilot complete it:
describe('Calculator', () => {
  it('should add two numbers', () => {
    // Copilot suggests: expect(add(2, 3)).toBe(5);
  });
});
```

**Key shortcuts:**

| Action | macOS | Windows/Linux |
|---|---|---|
| Accept suggestion | `Tab` | `Tab` |
| Dismiss | `Esc` | `Esc` |
| Next suggestion | `Option+]` | `Alt+]` |
| Open Copilot Chat | `Cmd+I` | `Ctrl+I` |

---

## 4. Using Copilot Chat for Tests

Copilot Chat lets you generate entire test suites from a description. Open Chat with `Cmd+I` (or `Ctrl+I`), then:

### Prompt Pattern

```
Write [framework] tests for [ClassName.methodName].
Test cases: [success], [error 1], [error 2].
Mock: [dependency 1], [dependency 2].
```

### Example

```
Write Jest unit tests for UserService.createUser in TypeScript.
Test cases: success, duplicate email error, empty name error.
Mock UserRepository with jest.fn().
```

Copilot will generate a complete test file. Review every line before accepting — it is a first draft, not a finished product.

---

## 5. The Generate -> Review -> Fix Loop

Every Copilot-assisted test follows three phases:

1. **Generate** — Let Copilot write the first draft via inline suggestion or Chat
2. **Review** — Read every assertion. Ask: would this catch a real bug?
3. **Fix** — Correct vague assertions, add missing cases, remove tautological tests

### Quick Review Checklist

- [ ] Assertions are specific (not `toBeTruthy()` or `toBeDefined()`)
- [ ] Error scenarios are tested, not just success paths
- [ ] No hardcoded credentials or PII in test data
- [ ] No time or random dependencies (potential flakiness)
- [ ] Mocked methods have call-argument assertions

---

## 6. Generating Test Data

Ask Copilot to create factory functions from your TypeScript types:

```
Generate a TypeScript factory for User: { id: string; name: string; email: string; createdAt: Date }
Make all fields overridable via Partial<User>. Use crypto.randomUUID() for id.
```

Expected output:

```typescript
export const createUser = (overrides: Partial<User> = {}): User => ({
  id: crypto.randomUUID(),
  name: 'Test User',
  email: `user-${Date.now()}@example.com`,
  createdAt: new Date(),
  ...overrides,
});
```

**Security rule:** never commit real-looking passwords, API keys, or PII — even in test files. Use `example.com` for email domains and placeholder strings for tokens.

---

## 7. Running Your Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run a specific file
npx jest tests/unit/userService.test.ts --verbose
```

---

## Next Steps

- Proceed to the **[Advanced Scenarios](./advanced-scenarios.md)** tutorial for guardrail prompt templates, CI/CD integration, and team adoption patterns
- Continue with **[MCP, Skills, and copilot.md Practice](./mcp-skills-practice.md)** for hands-on setup and advanced workflow drills
- Review the **[Review Checklist](../../src/pages/workshop/ReviewingTests.tsx)** workshop step
- Explore the full workshop at the navigation sidebar
