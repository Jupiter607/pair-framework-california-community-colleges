# Build Baseline

Generated: 2026-07-31  
Phase: production-hardening baseline audit

---

## Repository

| Item | Value |
|---|---|
| Absolute path | `/Users/donnelllayne/Downloads/pair-framework-california-community-colleges` |
| Current branch | `production-hardening` |
| Current commit | `56fdad6 feat: initialize Polarity-to-Action project structure` |
| Git remote | `origin → https://github.com/Jupiter607/pair-framework-california-community-colleges.git` |
| Prior commit | `06fdc33 Initial commit` |

---

## Current Stack

| Layer | Implementation |
|---|---|
| Frontend | React 19.2.8 + TypeScript 5.8.3 + Vite 6.4.3 |
| Styling | Tailwind CSS 4.3.3 via `@tailwindcss/vite` plugin |
| Animation / icons | Motion 12.43.0, Lucide React 0.546.0 |
| Markdown rendering | react-markdown 10.1.0 |
| Backend | Express 4.22.2 + TypeScript, served via `tsx server.ts` |
| AI provider | Google GenAI SDK (`@google/genai` 2.13.0) — model: `gemini-3.6-flash` |
| AI capabilities | Facilitation chat, document analysis, speech-to-text, polarity-map enhancement, plain-language conversion |
| Persistence | Browser `localStorage` only (no server-side database) |
| Package manager | Bun 1.3.14 (`bun.lock` present) |
| Build — frontend | `vite build` → `dist/` (SPA) |
| Build — server | `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs` |
| Runtime — dev | `tsx server.ts` (port 3000, Express + Vite middleware) |
| Runtime — prod | `node dist/server.cjs` |
| Deployment status | Not yet Vercel-compatible (Express long-lived process model) |

---

## Existing Features Confirmed

The following P.A.I.R. functionality is verified present in source code:

### Guided Workflow — 5 Steps
1. **Pinpoint** (`src/components/steps/PinpointStep.tsx`) — raw challenge entry, neutral reframing
2. **Assess** (`src/components/steps/AssessStep.tsx`) — 5-question diagnostic, problem/polarity/problem-in-polarity classification
3. **Investigate** (`src/components/steps/InvestigateStep.tsx`) — Pole L and Pole R mapping, upsides, downsides, Shared Best Hope, Shared Greatest Fear
4. **Respond** (`src/components/steps/RespondStep.tsx`) — action items with owner, timing, success evidence, early warning indicators, 30/60/90-day follow-through plan
5. **Report** (`src/components/steps/ReportStep.tsx`) — session summary, plain-language conversion

### Session Management
- Multiple sessions in `localStorage`
- Active session switching
- New / delete / preset loading
- `SidebarSessions` component

### Domain Model (fully typed in `src/types.ts`)
- `SessionData` — full session state
- `DiagnosticAnswers` — 5-question assess diagnostic
- `PoleData` / `PolarityMap` — polarity map quadrants
- `ActionItem` — action with owner, timing, evidence, indicator
- `FollowThroughPlan` — 30/60/90-day milestones
- `UploadedDoc` / `VoiceNote` / `ChatMessage` — enrichment types
- `ExampleCase` — example polarity cases

### AI-Assisted Features (5 Express routes in `server.ts`)
1. `POST /api/chat` — facilitation chat with structured `json_update` response parsing
2. `POST /api/analyze-document` — PDF/image/text document analysis (returns full polarity map)
3. `POST /api/speech-to-text` — audio transcription + summary
4. `POST /api/enhance-polarity` — full polarity map AI enhancement
5. `POST /api/plain-language` — plain-language session summary

### Supporting Resources
- Guidebook drawer (`GuidebookDrawer.tsx`)
- Example cases (`src/data/guidebookExamples.ts`)
- Document uploader (`DocumentUploader.tsx`)
- Voice input (`VoiceInputButton.tsx`)
- Facilitation agent chat (`AgentChat.tsx`)
- Step progress indicator (`PairStepper.tsx`)
- Header with session controls (`Header.tsx`)

---

## Commands Run

### 1. `bun install`

| | |
|---|---|
| Command | `bun install` |
| Purpose | Install all declared dependencies from `bun.lock` |
| Result | SUCCESS |
| Exit status | 0 |
| Packages installed | 288 |
| Elapsed | ~4.2 s |

**Warning (non-fatal):**
```
warn: Duplicate dependency: "vite" specified in package.json
  at dependencies: "^6.2.3" AND devDependencies: "^6.2.3"
```
`vite` appears in both `dependencies` and `devDependencies`. The duplicate should be removed from `dependencies` — it is a build tool and belongs only in `devDependencies`.

---

### 2. `bun run dev`

| | |
|---|---|
| Command | `bun run dev` (runs `tsx server.ts`) |
| Purpose | Verify development server starts |
| Result | SUCCESS |
| Exit status | 0 (SIGTERM from 10-second test stop — expected) |

**Output:**
```
$ tsx server.ts
◇ injected env (0) from .env
Server running on http://localhost:3000
```

The server starts, binds to port 3000, and injects Vite middleware. Dev server is functional.

---

### 3. `bun run typecheck`

| | |
|---|---|
| Command | N/A |
| Purpose | TypeScript type checking |
| Result | MISSING — no `typecheck` script in `package.json` |

The `lint` script (below) performs this function via `tsc --noEmit`. A dedicated `typecheck` script should be added per `README_PRODUCTION.md`.

---

### 4. `bun run lint`

| | |
|---|---|
| Command | `bun run lint` (runs `tsc --noEmit`) |
| Purpose | Type checking (note: this is *not* eslint — there is no eslint configured) |
| Result | SUCCESS — zero errors, zero warnings |
| Exit status | 0 |

**Note:** The `lint` script is misnamed — it runs TypeScript's type checker, not a linter. A real linter (ESLint with React/TypeScript rules) is not configured.

---

### 5. `bun run test`

| | |
|---|---|
| Command | N/A |
| Purpose | Unit tests |
| Result | MISSING — no `test` script in `package.json`. Vitest is not installed. No test files found. |

---

### 6. `bun run build`

| | |
|---|---|
| Command | `bun run build` |
| Purpose | Production build (Vite frontend + esbuild server bundle) |
| Result | SUCCESS |
| Exit status | 0 |
| Elapsed | ~3.9 s |

**Output:**
```
vite v6.4.3 building for production...
✓ 1848 modules transformed.
dist/index.html                   0.41 kB │ gzip:   0.28 kB
dist/assets/index-BGsfjVOa.css   49.71 kB │ gzip:   9.00 kB
dist/assets/index-B_DEy9qM.js   432.74 kB │ gzip: 126.40 kB
✓ built in 2.50s

  dist/server.cjs      14.1kb
  dist/server.cjs.map  19.8kb
```

Frontend bundle: 432 KB JS (126 KB gzip), 49 KB CSS (9 KB gzip). Production build is clean.

---

## Current Quality Tooling

| Tool | Status | Notes |
|---|---|---|
| TypeScript typecheck | Configured (as `lint`) | `tsc --noEmit` — passes cleanly |
| ESLint | Not configured | No eslint config, no eslint dependency |
| Unit tests | Not configured | No vitest, no test files |
| E2E tests | Not configured | No Playwright |
| CI | Added this commit | `.github/workflows/quality.yml` copied from production docs |
| Code formatting | Not configured | No Prettier |
| Pre-commit hooks | Not configured | No husky or lint-staged |

---

## Current Build Status

| Check | Result |
|---|---|
| Dependencies install (`bun install`) | **PASS** — 288 packages, 1 duplicate warning |
| Dev server starts (`bun run dev`) | **PASS** — port 3000, no startup errors |
| TypeScript typecheck (`bun run lint`) | **PASS** — zero errors |
| Production build (`bun run build`) | **PASS** — clean, 1848 modules |

---

## Current Errors and Warnings

### Warning — Duplicate `vite` dependency
`vite` is declared in both `dependencies` and `devDependencies` in `package.json`. Remove it from `dependencies`.

### Warning — `bun install` env notice
`◇ injected env (0) from .env // tip: ⌁ auth for agents [www.vestauth.com]` — informational only; no `.env` file loaded (GEMINI_API_KEY not set in this baseline environment; expected).

### Notice — Missing scripts
The following scripts from `README_PRODUCTION.md` are not yet in `package.json`:
- `typecheck` (currently aliased through `lint`)
- `test` (vitest not installed)
- `test:watch`
- `test:e2e` (Playwright not installed)
- `check` (composite script)

### Notice — `index.html` title
`<title>My Google AI Studio App</title>` — placeholder from AI Studio scaffolding. Should be updated to "Leading Through Tension — P.A.I.R. Framework".

### Notice — `package.json` name
`"name": "react-example"` — scaffolding placeholder. Should be updated to reflect the actual project.

### Notice — `metadata.json`
References "Polarity-to-Action Practitioner AI" (internal name). The public product name is "Leading Through Tension".

### Notice — Model name
`server.ts` uses `gemini-3.6-flash` throughout. Verify this is the correct current Gemini model identifier.

---

## Vercel Compatibility

### Frontend
The React + Vite SPA builds to `dist/` as static files. Vercel deploys Vite SPAs natively. **Compatible.**

### Backend (current state)
The backend is an Express server (`server.ts`) that runs as a long-lived process on port 3000 with Vite middleware in development. **Incompatible with Vercel's serverless model as-is.**

Vercel does not run persistent processes. Each request executes an isolated serverless function with a maximum duration (60 seconds, as noted in `vercel.example.json`).

### Required refactor (Phase 1)
Move the 5 Express routes into Vercel-compatible serverless functions under `/api/`:

| Current Express route | Target Vercel function |
|---|---|
| `POST /api/chat` | `api/chat.ts` |
| `POST /api/analyze-document` | `api/analyze-document.ts` |
| `POST /api/speech-to-text` | `api/speech-to-text.ts` |
| `POST /api/enhance-polarity` | `api/enhance-polarity.ts` |
| `POST /api/plain-language` | `api/plain-language.ts` |

### Body-size conflict
`server.ts` sets `limit: '50mb'` on the Express JSON parser. Vercel's default request body limit is **4.5 MB**. Document and audio uploads will fail on Vercel unless the upload strategy is changed (e.g., streaming or chunked uploads, or direct-to-Gemini approach that bypasses the proxy).

### Build command
`vercel.example.json` references `bun run build:web` (frontend-only build). A separate `build:web` script must be added to `package.json` that runs only `vite build` (not the esbuild server bundle, which is not needed on Vercel).

---

## Security and Privacy Risks

### Critical

| Risk | Detail |
|---|---|
| No request rate limiting | All 5 API routes are open. Any client can make unlimited Gemini API calls, consuming API quota and incurring cost without bound. |
| No request authentication | No API key, session token, or header validation on any route. |
| 50 MB body limit with no abuse controls | Documents and audio submitted as base64 JSON are accepted up to 50 MB per request. On Vercel this exceeds platform limits (4.5 MB); on any host it is an abuse vector. |
| Raw Gemini error messages exposed | `res.status(500).json({ error: error.message })` — internal provider error strings (which may include model details, request content, or stack traces) are forwarded directly to the client. |
| No input validation | `req.body` fields are destructured and passed directly to the Gemini API without type checking, length limits, or sanitization at the server layer. |

### High

| Risk | Detail |
|---|---|
| Uploaded document content in server memory | `base64Data` (up to 50 MB) is held in Node.js request memory. No streaming. No virus scanning. No content-type verification beyond the client-supplied `mimeType`. |
| Audio data in server memory | `base64Audio` follows the same pattern as document uploads. |
| No GEMINI_API_KEY validation on startup | The server starts and responds to requests before the key is checked; the error only surfaces per-request when `getGeminiClient()` is called. |
| `localStorage` is permanent until cleared | Session data including voice notes, uploaded document summaries, and chat history persists in the browser indefinitely with no TTL, explicit expiry, or user-facing deletion UI confirmation. |
| No Content-Security-Policy header | No CSP is set (headers in `vercel.example.json` cover X-Content-Type-Options and Referrer-Policy, but not CSP). |
| No documented data retention policy | Users are not informed how long uploaded documents or voice data are retained by the Gemini API. |

### Medium

| Risk | Detail |
|---|---|
| No structured logging | `console.error` and `console.warn` are used throughout. Errors are not structured, not correlated with request IDs, and not shipped to any monitoring system. |
| No health endpoint | No `/health` or `/api/health` endpoint for load balancer or uptime monitoring. |
| Model version is hardcoded | `gemini-3.6-flash` is hardcoded in 5 places. No environment variable or configuration to change the model without a code deploy. |
| AI output parsed without schema validation | `JSON.parse(response.text || '{}')` — malformed AI output produces an empty object silently rather than a structured error. |

### Later

| Risk | Detail |
|---|---|
| No CORS configuration | Express does not configure CORS. Cross-origin requests from non-Vite origins are unrestricted. |
| No documented acceptable-use policy | Users are not told what they may and may not submit (e.g., PII of students). |
| No WCAG 2.1 AA accessibility audit | Accessibility is unverified. |

---

## Production Gaps

### Critical

1. **Express → Vercel serverless refactor** — The 5 API routes must be moved to `/api/*.ts` Vercel functions before any production deploy is possible.
2. **Rate limiting and cost controls** — Every Gemini-backed route must have per-IP or per-session rate limiting and hard request quotas.
3. **Request body size enforcement** — The 50 MB limit must be replaced with per-route maximums compatible with Vercel's 4.5 MB limit (requires upload strategy change for documents and audio).
4. **Error response sanitization** — Raw provider error messages must never reach the client. Return generic error codes and log the detail server-side.
5. **No test suite** — Zero unit tests, zero integration tests, no CI test runner configured.
6. **No structured logging or monitoring** — No observability into production errors, latency, or AI costs.

### High

7. **Input validation layer** — All API request bodies need schema validation (e.g., Zod) before touching the Gemini client.
8. **GEMINI_API_KEY startup guard** — Validate the key at server boot; fail fast with a clear message rather than per-request.
9. **`build:web` script missing** — `vercel.example.json` references `bun run build:web` which does not exist. Vercel deploy will fail without it.
10. **ESLint not configured** — The `lint` script runs TypeScript typecheck, not a linter. React-specific and accessibility lint rules are absent.
11. **No Vitest or test infrastructure** — Vitest, testing-library, and test files must be added.
12. **CSP headers missing** — Content-Security-Policy must be configured for the Vercel deployment.
13. **Privacy notice and document consent UI** — Users must be told what happens to uploaded documents and voice data before submission.

### Medium

14. **Model version externalized** — `GEMINI_MODEL` should be an environment variable.
15. **AI output schema validation** — Parse and validate AI JSON responses with Zod before applying to app state.
16. **Health endpoint** — Add `GET /api/health` returning `{ status: "ok", timestamp }`.
17. **`package.json` metadata cleanup** — Update `name`, `index.html` title, and `metadata.json` product name.
18. **localStorage versioning** — Add a schema version key so future data model changes can trigger a migration or graceful reset.
19. **`vite` duplicate in `package.json`** — Remove from `dependencies`, keep only in `devDependencies`.
20. **AI failure/fallback UX** — No user-facing fallback when an AI call fails (currently surfaces raw error string).

### Later

21. WCAG 2.1 AA accessibility audit and remediation.
22. Cross-device session recovery (optional persistence layer).
23. CORS policy documentation.
24. Contribution guide and code of conduct.
25. License file.
26. Documented browser support matrix.

---

## Vercel Compatibility Summary

| Component | Compatible now? | Notes |
|---|---|---|
| React + Vite SPA frontend | Yes | `vite build` → `dist/` deploys natively |
| Express server | No | Must be refactored to Vercel serverless functions |
| API routes (5) | No | Must move to `api/*.ts` |
| 50 MB body limit | No | Vercel cap is 4.5 MB; upload strategy must change |
| `build:web` script | No | Referenced in `vercel.example.json` but missing from `package.json` |
| Environment variables | Ready | `.env.example` documents `GEMINI_API_KEY` and `APP_URL` |
| Security headers | Partial | `vercel.example.json` covers 3 headers; CSP still missing |

---

## Recommended Next Phase — Phase 1 Scope

**Goal:** Make the application deployable on Vercel with minimum viable security, without breaking any existing P.A.I.R. workflow.

**Included in Phase 1:**

1. Add `build:web` script to `package.json` (`vite build` only).
2. Rename `lint` to `typecheck` and add a real `eslint` lint script with `@typescript-eslint` and `eslint-plugin-react-hooks`.
3. Add Vitest + `@testing-library/react` and write smoke tests for the 5 step components and the 5 API route handlers.
4. Refactor the 5 Express routes into `/api/*.ts` Vercel serverless functions (keep identical business logic; only change the transport layer).
5. Enforce request body size limits per route (chat: 16 KB; document: 3 MB; audio: 3 MB; enhance/plain: 16 KB).
6. Add Zod schema validation to all 5 API route inputs.
7. Sanitize error responses — log full errors server-side, return only `{ error: "code" }` to clients.
8. Add `GET /api/health` endpoint.
9. Add `GEMINI_MODEL` environment variable; remove hardcoded model strings.
10. Add CSP header to `vercel.example.json` / `vercel.json`.
11. Fix `package.json` metadata (`name`, `index.html` title, `metadata.json` name).
12. Remove duplicate `vite` from `dependencies`.
13. Add `.github/workflows/quality.yml` CI (already added this commit — verify it passes).

**Deferred to Phase 2:**
- Rate limiting and quota enforcement
- Privacy notice and document-upload consent UI
- localStorage versioning / migration
- WCAG 2.1 AA accessibility audit
- Structured logging and monitoring (Vercel Analytics / external provider)
- AI output schema validation with Zod
- Cross-device session recovery

---

## Documentation Integration Log

All files copied from `/Users/donnelllayne/Downloads/PAIR_Production_Readiness_Documentation` on 2026-07-31.

| File | Action | Conflict? |
|---|---|---|
| `.cursor/rules/project.mdc` | Copied — directory created | None |
| `.github/workflows/quality.yml` | Copied — directory created | None |
| `README_PRODUCTION.md` | Copied | None |
| `vercel.example.json` | Copied | None |
| `MANIFEST.json` | Copied | None |
| `docs/ACCESSIBILITY.md` | Copied — directory created | None |
| `docs/API_CONTRACT.md` | Copied | None |
| `docs/ARCHITECTURE.md` | Copied | None |
| `docs/CURSOR_MASTER_PROMPT.md` | Copied | None |
| `docs/DATA_MODEL.md` | Copied | None |
| `docs/IMPLEMENTATION_PLAN.md` | Copied | None |
| `docs/OBSERVABILITY_OPERATIONS.md` | Copied | None |
| `docs/PRODUCT_REQUIREMENTS.md` | Copied | None |
| `docs/RELEASE_CHECKLIST.md` | Copied | None |
| `docs/REPOSITORY_AUDIT.md` | Copied | None |
| `docs/SECURITY_PRIVACY.md` | Copied | None |
| `docs/TESTING_QUALITY.md` | Copied | None |
| `docs/VERCEL_DEPLOYMENT.md` | Copied | None |

No conflicts. All 17 files were absent from the repository prior to this commit.
