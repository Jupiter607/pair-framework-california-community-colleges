# API Contract

## Conventions

Base path: `/api`

All responses use:

```ts
type ApiResponse<T> =
  | { ok: true; data: T; requestId: string }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        retryable: boolean;
      };
      requestId: string;
    };
```

## `GET /api/health`

### Response

```json
{
  "ok": true,
  "data": {
    "service": "pair-framework",
    "status": "healthy",
    "timestamp": "2026-07-31T00:00:00.000Z"
  },
  "requestId": "..."
}
```

Do not test the external AI provider on every health request.

## `POST /api/chat`

### Request

```ts
interface ChatRequest {
  message: string;
  session: SessionData;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}
```

### Response

```ts
interface ChatResponse {
  text: string;
  suggestedUpdate?: Partial<SessionData>;
}
```

### Rules

- Limit history.
- Strip system-role input from users.
- Validate suggested updates.
- Do not apply updates automatically.

## `POST /api/analyze-document`

### Request

```ts
interface AnalyzeDocumentRequest {
  fileName: string;
  mimeType: string;
  base64Data?: string;
  textData?: string;
}
```

Exactly one of `base64Data` or `textData` is required.

### Response

```ts
interface AnalyzeDocumentResponse {
  summary: string;
  neutralChallenge?: string;
  classification?: ChallengeClassificationType;
  immediateProblem?: string;
  largerPolarity?: string;
  polarityMap?: PolarityMap;
  suggestedActions?: ActionItem[];
}
```

### Rules

- Enforce file type allowlist.
- Enforce decoded size before sending to provider.
- Reject password-protected or unsupported files cleanly.
- Never return raw document content by default.

## `POST /api/speech-to-text`

### Request

```ts
interface SpeechToTextRequest {
  base64Audio: string;
  mimeType: string;
}
```

### Response

```ts
interface SpeechToTextResponse {
  transcript: string;
  summary: string;
}
```

## `POST /api/enhance-polarity`

### Request

```ts
interface EnhancePolarityRequest {
  sessionData: SessionData;
  targetField?:
    | "neutralChallenge"
    | "classification"
    | "poleL"
    | "poleR"
    | "map"
    | "hopeFear"
    | "actions"
    | "entire_map";
}
```

### Response

A validated partial session update.

## `POST /api/plain-language`

### Request

```ts
interface PlainLanguageRequest {
  sessionData?: SessionData;
  customText?: string;
}
```

Exactly one input source should be used.

### Response

```ts
interface PlainLanguageResponse {
  plainText: string;
}
```

## Error codes

- `INVALID_REQUEST`
- `PAYLOAD_TOO_LARGE`
- `UNSUPPORTED_MEDIA_TYPE`
- `RATE_LIMITED`
- `AI_PROVIDER_UNAVAILABLE`
- `AI_RESPONSE_INVALID`
- `CONFIGURATION_ERROR`
- `INTERNAL_ERROR`

## Request IDs

Generate a request ID per call. Return it to the browser and include it in logs. This allows support without exposing sensitive content.
