# AGENTS.md — Workshop Root

This workspace contains **two independent npm projects**. Always confirm which project context applies before running commands or editing files.

## Project Map

| Project | Root | Purpose | Dev Port |
|---------|------|---------|----------|
| Workshop tutorial site | `/` (this folder) | React + Vite agenda/slide deck for the workshop | 3005 |
| System under test | `workshop-exercises/` | Express API + React store; participants write tests here | API: 4000, UI: 3006 |

See [CLAUDE.md](CLAUDE.md) for full context on both projects.

## Commands — Tutorial Site (repo root)

```bash
npm install
npm run dev      # http://localhost:3005
npm run build
```

## Commands — System Under Test (workshop-exercises/)

```bash
cd workshop-exercises
npm install
npm run dev:api          # Express API on :4000 — Swagger at /docs
npm run dev:web          # Vite store on :3006
npm run dev              # both concurrently

npm test                 # all Jest tests
npm run test:unit        # tests/unit/
npm run test:api         # tests/api/ (Supertest)
npm run test:integration # tests/integration/
npm run test:component   # tests/components/ (RTL)
npm run test:e2e         # Playwright — requires servers running on :3006
```

> **Node requirement:** Node.js 22.12+ is required. Run `nvm use` if an `.nvmrc` is present, otherwise `nvm install 22.12.0 && nvm use 22.12.0`.

## Key Constraint

All substantive test-writing and engineering work happens inside `workshop-exercises/`. The repo root only contains the tutorial website source.
