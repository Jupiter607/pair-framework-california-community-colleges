# Leading Through Tension — P.A.I.R. Framework

A guided facilitation web application for helping California Community College teams distinguish solvable problems from ongoing polarities, map interdependent priorities, and create both/and action plans with owners, indicators, and 30/60/90-day follow-through.

## Current state

The repository already contains a substantial functional prototype:

- React 19 + TypeScript + Vite frontend
- Express server
- Tailwind CSS
- Guided P.A.I.R. workflow:
  - Pinpoint
  - Assess
  - Investigate
  - Respond
  - Report
- Multiple local sessions stored in `localStorage`
- Problem / polarity / problem-within-a-polarity classification
- Polarity mapping
- Action planning and 30/60/90-day follow-through
- Gemini-powered:
  - facilitation chat
  - document analysis
  - speech-to-text
  - polarity enhancement
  - plain-language summaries
- Guidebook and example cases

This is not a blank project. The production task is to harden, test, secure, document, and deploy the existing prototype.

## Production objective

Release a secure, accessible, observable, and maintainable MVP on Vercel without losing the existing workflow.

## Recommended MVP scope

### Included

- Public framework overview
- Guided P.A.I.R. session workflow
- Browser-based draft persistence
- AI-assisted facilitation
- Document and voice input with explicit consent
- Print-friendly final report
- Example cases and guidebook
- Privacy notice and acceptable-use guidance
- Error handling, usage limits, monitoring, and automated tests

### Deferred

- User accounts
- Cloud-saved sessions
- Real-time team collaboration
- Regional dashboards
- Statewide aggregate reporting
- Payments
- Institution-level administration

## Local setup

```bash
git clone https://github.com/Jupiter607/pair-framework-california-community-colleges.git
cd pair-framework-california-community-colleges

cp .env.example .env.local
# Add GEMINI_API_KEY to .env.local

bun install
bun run dev
```

The repository currently uses Bun (`bun.lock`), but npm may also work if the lockfile strategy is intentionally changed. Do not maintain multiple lockfiles.

## Required production commands

Add or confirm:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "bun run typecheck && bun run lint && bun run test && bun run build"
  }
}
```

## Documentation map

- `docs/REPOSITORY_AUDIT.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/VERCEL_DEPLOYMENT.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/API_CONTRACT.md`
- `docs/DATA_MODEL.md`
- `docs/TESTING_QUALITY.md`
- `docs/ACCESSIBILITY.md`
- `docs/OBSERVABILITY_OPERATIONS.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/CURSOR_MASTER_PROMPT.md`

## Product principle

> Problems require solutions. Polarities require ongoing management.
