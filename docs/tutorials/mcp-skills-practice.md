# MCP Server, Skills, and copilot.md Practice

This tutorial gives a practical path to three advanced Copilot concepts used in the workshop exercises repository:

- MCP server configuration in VS Code
- Reusable skill playbooks (`SKILL.md`)
- Prompt drills in `copilot.md`

## 1. Prerequisites

- VS Code with GitHub Copilot enabled
- Workshop exercises repository available locally
- Node.js installed

```bash
cd /Users/mnabil/copilot-testing-workshop/workshop-exercises
npm install
npm run dev
```

## 2. MCP Server Setup (Local VS Code)

Create or update `.vscode/mcp.json` in your workspace.

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

If your organization uses additional MCP servers, add them in the same file using the server settings provided by your platform team.

### Verify MCP access

In Copilot Chat, run a simple MCP-oriented prompt:

```text
@github what skills are available in this workspace?
```

You should see GitHub-related capabilities and tool access reflected in the response.

## 3. Skill Practice in the Exercises Repo

The exercises repository includes two practice skills:

- `.github/skills/api-contract-review/SKILL.md`
- `.github/skills/mcp-test-investigation/SKILL.md`

Current GitHub Copilot guidance treats skills as reusable folders of instructions,
scripts, and resources. In practice, you will most often see them in project-level
 locations such as `.github/skills`, `.claude/skills`, or `.agents/skills`, and
 in personal locations such as `~/.copilot/skills` or `~/.agents/skills`.

If you use GitHub CLI in environments where skill discovery is enabled, you can
 also explore installable skills with commands such as `gh skill`.

### API contract review drill

Use this prompt:

```text
Use the API contract review skill to inspect tests/api/auth-and-users.test.ts against src/app.ts.
Report missing assertions by severity and propose minimal test updates.
```

### MCP-style investigation drill

Use this prompt:

```text
Use the MCP test investigation workflow to diagnose the first failing API test.
Return findings first, then a minimal patch.
```

## 4. copilot.md Prompt Workbook

Open:

- `copilot.md`

Complete at least these sections:

1. API test generation prompt
2. Refactor prompt
3. Review prompt
4. Prompt iteration table

Goal: compare weak vs. specific prompts and record output quality differences.

## 5. Hands-on MCP Practice Drills

Open:

- `practice/mcp-practice.md`

Suggested sequence:

1. Break one API assertion intentionally
2. Reproduce failure with `npm run test:api`
3. Investigate with the workflow (reproduce -> localize -> hypothesize -> validate -> patch)
4. Restore green test state

## 6. Validation Checklist

- MCP config file exists and is valid JSON
- You successfully used at least one `@github` query in Chat
- You completed at least one skill-guided review
- You completed at least one `copilot.md` prompt drill
- API tests still pass

```bash
npm run test:api
```

## 7. Agent Mode and Workspace-Style Practice

Use this section to practice modern Copilot workflows where planning and implementation are separated.

### A) Plan-first drill

In Copilot Chat, switch to **Plan** mode and prompt:

```text
Plan updates to tests/api/auth-and-users.test.ts to increase negative-path coverage for register/login.
Include status assertions, envelope assertions, and one sensitive-field check.
Do not edit files yet.
```

Review the plan before moving to edits.

### B) Agent execution drill

Switch to **Agent** mode and prompt:

```text
Implement the approved test updates in tests/api/auth-and-users.test.ts.
Run only the API test command, report findings first, and keep changes minimal.
```

### C) Cost-aware prompting drill

Repeat the same task twice and compare quality/cost:

- Broad prompt with no file context
- Focused prompt with `#file` and explicit exit criteria

Capture what changed in output quality, speed, and number of follow-up edits.

## 8. Team Governance Notes (Conference Edition)

For team and enterprise environments, align this workflow with your organization policy:

- Approved model list and usage policy
- Agent mode guardrails (who can run autonomous edits)
- Review requirements before merge
- Data handling policy for prompts and logs

Treat Copilot output as a draft until human-reviewed and validated in CI.

## 9. Common Pitfalls

- Adding overly broad prompts without file context
- Treating generated output as final without review
- Changing implementation and tests simultaneously without isolating root cause
- Running full test suites when a focused suite is enough for diagnosis

## Next Steps

- Return to the workshop Step 2 page for Copilot fundamentals
- Continue to Step 5 and apply the same skill/MCP workflow on API test evolution
- Revisit `practice/mcp-practice.md` whenever introducing a new contract or auth change
