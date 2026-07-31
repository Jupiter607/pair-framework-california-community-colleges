# Vercel Deployment Guide

## Current deployment issue

The repository currently starts a persistent Express server and serves the Vite app from that process. Vercel does not treat a traditional always-running Express server as the default deployment model.

## Recommended deployment approach

- Deploy the Vite frontend as static assets.
- Convert each API route into a Vercel Function.
- Keep `GEMINI_API_KEY` server-side.

## Required changes

### 1. Add Vercel functions

Create files under `/api`.

Example:

```ts
// api/health.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  return res.status(200).json({
    ok: true,
    service: "pair-framework",
    timestamp: new Date().toISOString()
  });
}
```

### 2. Add dependency

```bash
bun add -d @vercel/node
```

### 3. Add `vercel.json`

```json
{
  "framework": "vite",
  "buildCommand": "bun run build:web",
  "outputDirectory": "dist",
  "functions": {
    "api/*.ts": {
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), geolocation=(), microphone=(self)" }
      ]
    }
  ]
}
```

Adjust microphone policy if voice capture is removed or implemented differently.

### 4. Split build scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build:web": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

Use `vercel dev` when testing frontend and serverless routes together.

### 5. Configure environment variables

Vercel Project Settings → Environment Variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `APP_ENV`
- optional monitoring variables

Set separately for:

- Development
- Preview
- Production

Never use a `VITE_` prefix for a secret. Values with `VITE_` can be exposed to the browser bundle.

## Deployment flow

1. Create branch: `production-hardening`
2. Commit refactor.
3. Push to GitHub.
4. Open pull request.
5. Test Vercel Preview Deployment.
6. Run smoke tests.
7. Merge to `main`.
8. Confirm Production Deployment.
9. Confirm `/api/health`.
10. Confirm AI endpoints with non-sensitive test content.

## Domain setup

After the first stable production deployment:

1. Add custom domain.
2. Configure DNS in Vercel.
3. Enforce HTTPS.
4. Choose one canonical host.
5. Add redirect from alternate host.
6. Add privacy and terms links before public promotion.

## Preview safety

Preview deployments can still incur Gemini usage.

Use one or more:

- separate preview key,
- lower preview quotas,
- shared secret for preview access,
- Vercel Deployment Protection,
- disabled upload/audio features in public previews.

## Rollback

Vercel preserves prior deployments. A release must be considered rollback-ready only when:

- session schema changes are backward compatible,
- environment variables are documented,
- no destructive database migration exists,
- prior frontend can read stored browser sessions.

## Smoke test

- Home loads.
- New session works.
- Session persists after refresh.
- Diagnostic works.
- Polarity map edits work.
- AI suggestion works.
- Provider outage shows a usable error.
- Report prints.
- No key appears in browser source or Network responses.
