# Production Implementation Plan

## Guiding decision

Harden the existing React/Vite application. Refactor the Express API into Vercel Functions. Do not rewrite the frontend.

## Phase 0 — Protect the baseline

### Tasks

- Create branch `production-hardening`.
- Tag current prototype.
- Add root README.
- Add license decision.
- Add all documentation.
- Record screenshots of current major screens.
- Confirm current build locally.

### Exit criteria

- Baseline is recoverable.
- Current functionality is documented.

## Phase 1 — Build and code quality

### Tasks

- Choose Bun as the single package manager.
- Remove duplicate Vite dependency declaration.
- Add ESLint.
- Add Prettier.
- Add Vitest.
- Add Testing Library.
- Add Playwright.
- Add `typecheck`, `lint`, `test`, `test:e2e`, `check`.
- Add CI workflow.

### Exit criteria

- Clean install succeeds.
- Typecheck, lint, unit tests, and build pass in CI.

## Phase 2 — Vercel architecture

### Tasks

- Extract AI client and prompts from `server.ts`.
- Create one `/api` function per endpoint.
- Add `/api/health`.
- Normalize API response envelopes.
- Update frontend API service.
- Add `vercel.json`.
- Test with `vercel dev`.
- Remove Express runtime after parity is confirmed.

### Exit criteria

- All existing AI features work in Vercel Preview.
- No long-running server is required.

## Phase 3 — Validation and security

### Tasks

- Add runtime request schemas.
- Add runtime AI-response schemas.
- Add payload limits.
- Add MIME allowlists.
- Add rate limiting.
- Add safe errors and request IDs.
- Add security headers.
- Sanitize Markdown.
- Add preview deployment protection.
- Add dependency scanning.

### Exit criteria

- Malformed and oversized requests are rejected safely.
- No provider error internals reach the client.
- Secrets are server-only.

## Phase 4 — Local persistence reliability

### Tasks

- Version stored state.
- Add migration function.
- Validate loaded state.
- Add import/export.
- Add recovery backup.
- Exclude raw media from persistence.
- Add delete-all-data control.

### Exit criteria

- Existing sessions survive normal upgrades.
- Corrupt storage does not crash the app.
- Users can export and delete their data.

## Phase 5 — UX and accessibility

### Tasks

- Complete keyboard audit.
- Fix drawer/dialog focus behavior.
- Add semantic stepper.
- Add form errors and descriptions.
- Add reduced-motion behavior.
- Add responsive tests.
- Add print stylesheet.
- Label AI-generated content.
- Add clear non-AI fallback.

### Exit criteria

- No critical axe findings.
- Core workflow works by keyboard.
- Printed report is readable and complete.

## Phase 6 — Privacy and public-facing content

### Tasks

- Add privacy notice.
- Add acceptable-use notice.
- Add upload warning and consent.
- Add voice consent.
- Add terms/disclaimer.
- Add official-status language.
- Add support contact.
- Decide and document license.

### Exit criteria

- Users understand where data goes and what not to submit.
- The tool is not misrepresented as an official policy decision system.

## Phase 7 — Testing and pilot

### Tasks

- Unit tests for domain logic.
- API tests with provider mock.
- E2E core workflow.
- MacBook Air local test.
- Vercel Preview pilot.
- Test with 3–5 facilitators.
- Capture defects and usability issues.
- Run security and accessibility review.

### Exit criteria

- Pilot users complete the workflow without developer support.
- No unresolved critical defects.

## Phase 8 — Production release

### Tasks

- Configure production variables.
- Configure custom domain.
- Enable monitoring.
- Set cost alerts.
- Run release checklist.
- Deploy.
- Run smoke test.
- Announce controlled beta.
- Schedule 30-day review.

### Exit criteria

- Production is observable, rollback-ready, and documented.

## Priority backlog

### P0

- Vercel API refactor
- runtime validation
- rate limits
- request-size limits
- safe error handling
- automated build/check
- privacy disclosure

### P1

- import/export
- print report
- accessibility remediation
- monitoring
- model configuration
- AI fallback

### P2

- accounts
- cloud persistence
- multi-user collaboration
- dashboards
