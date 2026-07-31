# Repository Audit

## Executive assessment

The current repository is a strong prototype with meaningful product functionality. It should be evolved, not replaced.

## Existing stack

| Layer | Current implementation |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 |
| Motion / icons | Motion, Lucide React |
| Server | Express + TypeScript |
| AI | Google GenAI SDK |
| Persistence | Browser `localStorage` |
| Build | Vite frontend + esbuild server bundle |
| Package manager signal | Bun lockfile |
| Deployment target | Not yet production-hardened for Vercel |

## Existing product capabilities

1. Guided step workflow
   - Pinpoint
   - Assess
   - Investigate
   - Respond
   - Report

2. Session management
   - Multiple sessions
   - Active session switching
   - New, delete, and preset loading
   - Browser persistence

3. Structured domain model
   - Challenge classification
   - Diagnostic answers
   - Pole L and Pole R
   - Upsides and downsides
   - Shared Best Hope
   - Shared Greatest Fear
   - Action items
   - 30/60/90-day follow-through
   - Uploaded documents
   - Voice notes
   - Chat history

4. AI-assisted capabilities
   - Facilitation chat
   - Document analysis
   - Audio transcription
   - Polarity-map enhancement
   - Plain-language conversion

5. Supporting resources
   - Guidebook drawer
   - Example cases
   - Report step
   - Document uploader
   - Voice input

## Major production gaps

### Critical

- The Express process model is not a clean fit for Vercel serverless deployment.
- API request bodies appear capable of carrying base64 files and audio without documented size limits.
- No authentication, quotas, rate limits, abuse protection, or cost controls are documented.
- AI outputs are parsed into application state without a clearly documented runtime schema-validation layer.
- Uploaded content and voice data require explicit privacy, retention, and consent controls.
- Error responses may expose internal provider messages.
- No test suite or CI workflow is visible.
- No production monitoring, structured logging, or health endpoint is documented.
- The repository has no visible complete README at the root.

### High priority

- Local storage is convenient but not sufficient for cross-device recovery.
- No clear data migration/versioning strategy for persisted sessions.
- No documented content-security policy or security headers.
- No documented accessibility acceptance criteria.
- No documented browser support or responsive testing matrix.
- No documented AI failure/fallback experience.
- No documented model-version configuration.
- No documented license, contribution guidelines, code of conduct, or support policy.

## Architectural recommendation

Keep React/Vite for the frontend in the first production release. Do not rewrite to Next.js merely for fashion.

Refactor the five Express AI routes into Vercel-compatible serverless functions under `/api`. Preserve the frontend and domain components. This is the lowest-risk route to production.

A later migration to Next.js is reasonable only if the product needs:

- server-rendered public content,
- integrated authentication,
- multi-tenant dashboards,
- server actions,
- or a broader content platform.

## Production readiness rating

| Area | Current estimate |
|---|---|
| Product concept | Strong |
| Core workflow | Strong prototype |
| UI architecture | Good |
| Domain model | Good |
| Deployment fit | Needs work |
| Security | Prototype-level |
| Privacy | Needs policy and controls |
| Testing | Not production-ready |
| Observability | Not production-ready |
| Documentation | Incomplete |
| Accessibility | Must be verified |

## Decision

Proceed with a hardening sprint against the existing codebase. Do not restart.
