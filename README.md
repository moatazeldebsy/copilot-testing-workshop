# GenAI in Testing: Using GitHub Copilot to Accelerate Quality Without Losing Trust

Workshop materials for **WeAreDevelopers Berlin 2026**.

**Session:** [GenAI in Testing — WeAreDevelopers World Congress](https://www.wearedevelopers.com/world-congress/agenda/workshops/genai-in-testing-using-github-copilot-to-accelerate-quality-without-losing-trust-1107886)
**Date:** Friday, 10 Jul 2026 · 12:15 pm – 2:15 pm (W. Europe Daylight Time, UTC+02:00)
**Room:** R2 · 30 Seats

## Overview

A hands-on workshop exploring how to use GitHub Copilot to speed up testing workflows — unit tests, API integration tests, component tests, E2E with Playwright — without sacrificing trust or quality.

The **system under test** is a realistic checkout pipeline: **User → Cart → Discount → Fraud → Payment → Notification**. Every exercise uses this same domain so all test types (unit, API, component, E2E) feel connected rather than contrived.

## 120-Minute Schedule

_Friday, 10 Jul 2026 · Room R2 · 12:15 pm – 2:15 pm WEDT (UTC+02:00)_

| Time | Segment | Activity | Duration |
|------|---------|----------|----------|
| 12:15 | **Intro, Setup & Tour** | Welcome, prerequisites, Copilot activation, clone repo, tour the store UI and `/docs` | 15 min |
| 12:30 | **Exercise A — Unit Tests** | Use Copilot to generate tests for `calculateDiscount()` (3 hidden bugs); weak vs strong prompt comparison | 25 min |
| 12:55 | **Exercise B — Review AI Tests** | Read `calculateDiscount.weak.test.ts`; identify what passes but shouldn't; rewrite the weak assertions | 10 min |
| 13:05 | **Exercise C — API Tests** | Generate Supertest tests for the full checkout pipeline: cart → discount → fraud → payment → notification | 25 min |
| 13:30 | **Exercise D — Component Tests** | React Testing Library tests for `StorePage`; Playwright E2E shown as live demo / optional for early finishers | 20 min |
| 13:50 | **Exercise E — CI Guardrails** | Coverage gates, flaky test demo, `.github/copilot-instructions.md`, context engineering | 10 min |
| 14:00 | **Wrap-up & Q&A** | Trust Playbook walkthrough, one action to take back, open discussion | 15 min |

## Getting Started

**Prerequisites:** Node.js 20.19+ or 22+, GitHub Copilot subscription

This repo is a GitHub template. Click **Use this template → Create a new repository**
on [github.com/moatazeldebsy/copilot-testing-workshop](https://github.com/moatazeldebsy/copilot-testing-workshop)
to get your own writable copy — needed if an exercise has you push a branch or open a PR.
A plain `git clone` works too if you're only following along locally.

**No local setup? Use Codespaces.** If Node, npm, or VS Code aren't cooperating on your
machine, skip local setup entirely:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/moatazeldebsy/copilot-testing-workshop?quickstart=1)

Click the badge (or **Code → Codespaces → Create codespace on master** on your own
copy of the repo) and wait ~1–2 minutes for the container to build. Dependencies and
the Playwright browser install automatically; VS Code opens with `workshop-exercises/`
as the working folder and the GitHub Copilot extension pre-installed. Then just run
`npm run dev:api` and `npm run dev` in the integrated terminal as below — Codespaces
forwards ports 3006 and 4000 automatically.

```bash
git clone https://github.com/YOUR_USERNAME/copilot-testing-workshop.git
cd copilot-testing-workshop/workshop-exercises
npm install

# Run the backend API (port 4000)
npm run dev:api

# In a second terminal — run the frontend (port 3006)
npm run dev

# Run all tests
npm test

# Run E2E tests
npm run test:e2e
```

Open `http://localhost:3006` for the store UI and `http://localhost:4000/docs` for the Swagger API explorer.

Login with: `alice@example.com` / `workshop-password`

## Repository Layout

```
workshop-exercises/
  src/
    services/
      calculateDiscount.ts     ← Exercise A & B: function with intentional bugs
      calculateDiscount.fixed.ts ← Solution reference (don't peek!)
      cartService.ts           ← Cart pipeline step
      discountService.ts       ← Discount pipeline step
      fraudService.ts          ← Fraud pipeline step
      paymentService.ts        ← Payment pipeline step
      notificationService.ts   ← Notification pipeline step
    ui/pages/
      StorePage.tsx            ← Single-page store (Exercise D)
      LoginPage.tsx
  tests/
    unit/                      ← Exercise A stubs (fill these in)
    api/                       ← Exercise C stubs (fill these in)
    components/                ← Exercise D stubs (fill these in)
    e2e/                       ← Exercise D Playwright stubs (fill these in)
    fixtures/                  ← Pre-generated backup examples

.copilot/
  context/domain-rules.md      ← Business rules — attach to Copilot Chat prompts
  skills/unit-testing.md       ← Prompt template + review checklist

.github/copilot-instructions.md ← Repo-level Copilot behavior standards

docs/
  ai-testing-trust-playbook.md ← Session takeaway
```

## Recovery Checkpoints (Progressive Branches)

If you fall behind on any exercise, checkout the corresponding branch to see the completed solution:

| Branch | Contains |
|---|---|
| `01-baseline` | Starting point — all TODO stubs, buggy `calculateDiscount.ts` |
| `02-unit-testing` | Strong unit tests for `calculateDiscount` (expose all 3 bugs) |
| `03-api-testing` | Complete API tests for the checkout pipeline (18 tests) |
| `04-integration-testing` | Component tests for `StorePage` |
| `05-ci-guardrails` | CI workflow with coverage gates |
| `06-review-patterns` | Trust Playbook + Copilot instructions |

```bash
# Example: catch up after Exercise B
git checkout 03-api-testing
```

## Tech Stack

- **Backend:** Node.js + Express 5 (port 4000), TypeScript, Jest + Supertest
- **Frontend:** React 18 + Vite (port 3006), React Testing Library, Playwright
- **Auth:** JWT bearer tokens
- **API docs:** OpenAPI 3.0 served at `/docs` (Swagger UI)

## License

MIT
