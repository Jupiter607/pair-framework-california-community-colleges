# Security and Privacy Requirements

## Threat model

The application accepts:

- free-text institutional challenges,
- potentially sensitive uploaded documents,
- voice recordings,
- AI chat prompts,
- names of owners and institutional participants.

Even without accounts, this can contain confidential or personally identifiable information.

## Mandatory controls before public release

### Secrets

- Store `GEMINI_API_KEY` only in Vercel environment variables.
- Never place secrets in `VITE_*` variables.
- Never log environment values.
- Rotate any key that may have been exposed.

### Request validation

Validate:

- HTTP method,
- content type,
- JSON body shape,
- maximum string length,
- array length,
- MIME type,
- base64 size,
- audio duration where possible.

### Suggested limits

| Input | Initial limit |
|---|---:|
| Chat message | 8,000 characters |
| Session context | 100 KB serialized |
| Text document | 100,000 characters |
| PDF/image upload | 8 MB |
| Voice upload | 10 MB |
| Actions | 50 |
| Map items per quadrant | 25 |

Tune these after usage data.

### Rate limiting

At minimum:

- per IP,
- per endpoint,
- stricter limits for document and voice analysis,
- daily cost ceiling,
- graceful 429 response.

Do not rely only on client-side throttling.

### AI response validation

Treat model output as untrusted.

- Validate JSON.
- Reject unknown or oversized fields.
- Normalize enums.
- Strip markdown or HTML where not expected.
- Never execute generated code.
- Never directly inject model output as raw HTML.
- Preserve user confirmation before applying suggested changes.

### Error handling

Public response:

```json
{
  "ok": false,
  "error": {
    "code": "AI_PROVIDER_ERROR",
    "message": "The assistant is temporarily unavailable.",
    "retryable": true
  },
  "requestId": "..."
}
```

Do not expose stack traces, API response payloads, or provider error internals.

## Privacy model for MVP

### Default

- Sessions are stored locally in the user’s browser.
- Uploaded files are sent to the AI endpoint for analysis but are not intentionally persisted by this application.
- Raw files are not included in exported reports.
- Chat and audio are excluded from reports unless explicitly selected.

### Required user notice

Before first upload or recording:

> Do not upload student records, protected personnel information, credentials, or other restricted data. Uploaded content is transmitted to an external AI service for analysis. Use approved institutional procedures and obtain required consent.

### Consent

Voice recording must require:

- explicit user action,
- visible recording state,
- ability to cancel before upload,
- clear explanation that audio is transmitted for transcription.

### Data minimization

Only send fields needed for the requested AI operation. Do not automatically send all documents and chat history on every request.

### Retention

For MVP, document:

- application server does not intentionally store submitted content,
- provider processing is governed by the configured provider account and terms,
- browser sessions remain until the user deletes them or browser storage is cleared.

## Security headers

Deploy:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Strict-Transport-Security`
- frame protection using CSP `frame-ancestors`

CSP must be tested with Vite assets and any monitoring service.

## Dependency security

CI must run:

```bash
bun audit
```

Also enable:

- Dependabot or Renovate
- GitHub secret scanning
- branch protection
- required pull-request review for production

## Content handling

- Escape user content in reports.
- Sanitize rendered Markdown.
- Disable embedded raw HTML unless rigorously sanitized.
- Do not trust uploaded filenames.
- Do not use filename extensions as the only MIME check.

## Institutional use warning

The product supports facilitation. It must not be represented as legal, HR, cybersecurity, or compliance approval.
