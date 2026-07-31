# Cursor Master Implementation Prompt

Paste this into Cursor Agent after opening the repository.

```text
Act as the senior production engineer and technical product lead for the
Leading Through Tension P.A.I.R. Framework application.

You are working in the existing repository. Do not rebuild the product from
scratch and do not migrate to Next.js. Preserve the working React/Vite UI and
the existing P.A.I.R. workflow.

Read these documents before changing code:

- README_PRODUCTION.md
- docs/REPOSITORY_AUDIT.md
- docs/PRODUCT_REQUIREMENTS.md
- docs/ARCHITECTURE.md
- docs/VERCEL_DEPLOYMENT.md
- docs/SECURITY_PRIVACY.md
- docs/API_CONTRACT.md
- docs/DATA_MODEL.md
- docs/TESTING_QUALITY.md
- docs/ACCESSIBILITY.md
- docs/OBSERVABILITY_OPERATIONS.md
- docs/IMPLEMENTATION_PLAN.md
- docs/RELEASE_CHECKLIST.md

Primary objective:
Turn the existing prototype into a production-ready Vercel web application.

Architecture decision:
Keep React + Vite. Replace the persistent Express production server with
Vercel serverless functions under /api. Extract shared server-only AI logic
from server.ts into reusable modules.

Execution rules:

1. Audit first.
   - Run the existing install, typecheck/lint command, and build.
   - Record current errors in docs/BUILD_BASELINE.md.
   - Do not delete working features.

2. Work in phases.
   - Complete one phase from docs/IMPLEMENTATION_PLAN.md at a time.
   - Create a focused commit after each phase.
   - Stop and report if a change would cause data loss.

3. Preserve product behavior.
   - Pinpoint, Assess, Investigate, Respond, and Report must remain functional.
   - Existing local sessions must continue to load.
   - AI suggestions must not automatically overwrite user content.

4. Production API.
   - Create /api/chat.ts
   - Create /api/analyze-document.ts
   - Create /api/speech-to-text.ts
   - Create /api/enhance-polarity.ts
   - Create /api/plain-language.ts
   - Create /api/health.ts
   - Use consistent success/error envelopes and request IDs.
   - Keep Gemini credentials server-only.
   - Configure the model in one server-only module.

5. Security.
   - Add runtime validation for all request bodies and AI responses.
   - Add payload limits and MIME allowlists.
   - Add server-side rate limiting.
   - Sanitize Markdown.
   - Never expose stack traces or provider errors.
   - Never log full prompts, documents, transcripts, or API keys.

6. Persistence.
   - Add a schemaVersion to local storage.
   - Add migration and validation.
   - Add export/import of session JSON.
   - Do not persist base64 file or audio data.
   - Add “delete all local data.”

7. Quality.
   - Add ESLint, Prettier, Vitest, Testing Library, and Playwright.
   - Add unit tests for classification and persistence.
   - Add API tests with mocked Gemini.
   - Add E2E tests for the complete workflow.
   - Add a GitHub Actions quality workflow.

8. Accessibility.
   - Target WCAG 2.2 AA.
   - Fix labels, focus, keyboard operation, dialogs, reduced motion, and errors.
   - Add axe checks.
   - Ensure the report prints cleanly.

9. Vercel.
   - Add vercel.json.
   - Add documented environment variables.
   - Verify using vercel dev.
   - Ensure Preview and Production builds work.
   - Do not use VITE_ for secrets.

10. Documentation.
   - Update the root README.
   - Add setup, architecture, deployment, privacy, testing, and support guidance.
   - Keep docs aligned with actual behavior.

Required commands before declaring a phase complete:

- bun install --frozen-lockfile
- bun run typecheck
- bun run lint
- bun run test
- bun run build:web

Run E2E tests once Playwright is configured.

At the end of each phase, report:
- files changed,
- functionality preserved,
- tests run and results,
- known risks,
- exact next phase.

Start now with Phase 0 and Phase 1 only. Do not begin the Vercel API refactor
until the baseline and quality tooling are complete.
```
