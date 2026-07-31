# Production Architecture

## Recommended release architecture

```text
Browser
  |
  | HTTPS
  v
Vercel CDN / Static Vite Application
  |
  | /api/*
  v
Vercel Serverless Functions
  |
  +--> Gemini API
  |
  +--> Error monitoring / structured logs
```

## Why this architecture

The current React/Vite frontend is already functional. The main mismatch is the long-running Express server. Vercel is strongest when static assets and independent serverless functions are deployed together.

## Migration strategy

### Preserve

- `src/App.tsx`
- `src/components/**`
- `src/data/**`
- `src/types.ts`
- most of `src/services/api.ts`
- Tailwind and Vite configuration

### Replace or refactor

- Split `server.ts` into:
  - `api/chat.ts`
  - `api/analyze-document.ts`
  - `api/speech-to-text.ts`
  - `api/enhance-polarity.ts`
  - `api/plain-language.ts`
  - `api/health.ts`
- Move shared server-only logic into:
  - `server/ai/client.ts`
  - `server/ai/prompts.ts`
  - `server/validation/*.ts`
  - `server/security/*.ts`
  - `server/http/*.ts`

## Target structure

```text
.
├── api/
│   ├── analyze-document.ts
│   ├── chat.ts
│   ├── enhance-polarity.ts
│   ├── health.ts
│   ├── plain-language.ts
│   └── speech-to-text.ts
├── server/
│   ├── ai/
│   │   ├── client.ts
│   │   ├── models.ts
│   │   └── prompts.ts
│   ├── http/
│   │   ├── errors.ts
│   │   └── responses.ts
│   ├── security/
│   │   ├── rateLimit.ts
│   │   └── requestLimits.ts
│   └── validation/
│       ├── aiResponses.ts
│       ├── requests.ts
│       └── session.ts
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── public/
├── vercel.json
└── package.json
```

## Client state

### MVP

Use local storage with:

- a versioned envelope,
- schema validation on load,
- migration functions,
- import/export,
- recovery backup,
- storage quota error handling.

```ts
interface PersistedAppStateV1 {
  schemaVersion: 1;
  activeSessionId: string;
  sessions: SessionData[];
  savedAt: string;
}
```

### Future

When accounts are introduced:

- Postgres for sessions and organizations
- object storage for documents
- row-level authorization
- encryption at rest
- explicit retention policy

## AI boundary

All Gemini calls must remain server-side.

The browser sends only required content to `/api/*`. The server:

1. validates the request,
2. checks request size and rate limits,
3. redacts logs,
4. calls Gemini,
5. validates the provider response,
6. returns a normalized response,
7. never returns provider secrets or stack traces.

## Runtime validation

TypeScript types are compile-time only. Add runtime schemas using Zod or another small validator for:

- every API request,
- every AI structured response,
- imported session JSON,
- local-storage state.

## API response envelope

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId: string;
};

type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
  requestId: string;
};
```

## AI model configuration

Do not hard-code a model throughout the routes.

```ts
const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
```

Keep model selection in one server-only module.

## Rendering and report generation

For MVP:

- use a dedicated print stylesheet,
- render a clean HTML report,
- use browser Print → Save as PDF.

Defer server-side PDF generation until a real requirement exists.

## Future architecture triggers

Move beyond local-only persistence when any of these becomes required:

- users need cross-device sessions,
- teams need shared workspaces,
- statewide synthesis needs aggregate data,
- uploaded documents must survive browser closure,
- administrators need role-based access.
