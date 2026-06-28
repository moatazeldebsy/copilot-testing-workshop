# Workshop Roadmap

## Current: WeAreDevelopers Berlin 2026 (v1.0)

**Format**: 120-minute hands-on workshop  
**Target**: Intermediate — Software Engineers, QA/SDETs, DevOps Engineers  
**Focus**: GitHub Copilot for testing — generation, review, guardrails, CI/CD

### Workshop Delivery Model
- The presentation site remains the facilitator guide and participant reference.
- Hands-on work lives in a separate repository: `copilot-testing-workshop-exercises`.
- Participants work on `main` during the session.
- Recovery and facilitator answer states are published as step-scoped solution checkpoints such as `solution/step-4-unit`, `solution/step-5-api`, and `solution/step-11-ai`.
- Workshop pages should link to the exercise repository and the relevant checkpoint for each hands-on step.

---

## Planned Expansions

### v1.1 — Copilot for Non-TypeScript Projects
- Python + pytest: prompt patterns and review checklist
- Java + JUnit 5: factory patterns and Mockito generation
- Go + testing package: table-driven test generation

### v1.2 — Agentic Testing Workflows
- Using GitHub Copilot Workspace to generate full test suites from issue descriptions
- Copilot-assisted test gap analysis: find untested branches automatically
- Multi-file context: generating tests that span multiple services

### v1.3 — LLM-Specific Test Patterns
- Testing applications that call LLMs (non-deterministic output)
- Prompt injection testing with AI-generated adversarial inputs
- Evaluating LLM output quality in automated test suites
- Recording and replaying LLM responses for deterministic CI

### v1.4 — AI Mutation Testing
- Using mutation testing (Stryker) to validate AI-generated test quality
- Combining Copilot suggestion + mutation score as a quality gate
- Identifying test gaps that coverage metrics hide

### v1.5 — Security-Focused Testing with AI
- Generating OWASP Top 10 test cases with Copilot
- AI-assisted SAST review: using Copilot Chat to explain vulnerability findings
- Generating security regression tests from CVE descriptions

---

## Feedback & Contributions

Improvements to the workshop content, new prompt templates, and real-world case studies are welcome. Open an issue or PR in the workshop repository.
