# Observability and Operations

## Objectives

- Know whether the application is available.
- Diagnose failures without logging sensitive content.
- Track AI latency and error rates.
- Control provider cost.
- Support rollback.

## Logging

Log structured metadata:

- request ID,
- route,
- status,
- duration,
- environment,
- provider model,
- token or usage metadata when available,
- payload size category,
- error code.

Do not log:

- API keys,
- full prompts,
- uploaded document content,
- audio,
- complete session data,
- personally identifying names unless explicitly required.

## Monitoring

Recommended:

- Vercel Analytics for web performance
- Vercel runtime logs
- Sentry or equivalent for frontend/server errors
- uptime check against `/api/health`

## Alerts

Alert on:

- elevated 5xx rate,
- AI provider failure rate,
- rate-limit surge,
- unusual upload volume,
- daily AI spend threshold,
- production deployment failure.

## Cost controls

- model configured by environment,
- input length limits,
- history truncation,
- document-size limits,
- endpoint rate limits,
- daily budget alert,
- cache only non-sensitive deterministic content,
- disable expensive features in public previews.

## Support model

Add a user-visible support path containing:

- application version,
- timestamp,
- request ID,
- browser version,
- non-sensitive error code.

## Release versioning

Expose:

- app version from package,
- Git commit SHA from Vercel,
- build timestamp.

Do not expose environment secrets.
