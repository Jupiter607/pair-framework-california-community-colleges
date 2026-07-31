# Data Model and Persistence

## Existing domain model

The current model already captures the core facilitation process well.

### Session

```ts
interface SessionData {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStep: "pinpoint" | "assess" | "investigate" | "respond" | "report";

  rawChallenge: string;
  neutralChallenge: string;

  classification: "problem" | "polarity" | "problem_in_polarity";
  classificationEvidence: string;
  immediateProblem: string;
  largerPolarity: string;
  diagnosticAnswers: DiagnosticAnswers;

  polarityMap: PolarityMap;
  actions: ActionItem[];
  followThrough: FollowThroughPlan;

  reportSummary?: string;
  plainLanguageSummary?: string;

  uploadedDocs: UploadedDoc[];
  voiceNotes: VoiceNote[];
  chatHistory: ChatMessage[];
}
```

## Required improvements

### Add schema version

```ts
interface PersistedState {
  schemaVersion: 1;
  activeSessionId: string;
  sessions: SessionData[];
  savedAt: string;
}
```

### Add migration

```ts
function migratePersistedState(input: unknown): PersistedState {
  // validate
  // migrate older versions
  // return safe state or fallback
}
```

### Separate transient content

Do not persist raw base64 file or audio data in local storage.

Persist only:

- filename,
- MIME type,
- timestamp,
- summary,
- extracted text only when needed and disclosed.

### Stable identifiers

Use `crypto.randomUUID()` instead of timestamps or weak random strings.

### Timestamps

Use ISO 8601 UTC strings.

### Import/export

Support:

- export one session as JSON,
- import a session after schema validation,
- export all sessions as a backup,
- warn that JSON may contain sensitive content.

## Future cloud model

### Organization

- id
- name
- region
- createdAt

### User

- id
- organizationId
- name
- email
- role

### Session

- id
- organizationId
- createdBy
- title
- status
- schemaVersion
- content JSONB
- createdAt
- updatedAt

### SessionMember

- sessionId
- userId
- role

### AuditEvent

- id
- organizationId
- actorId
- action
- resourceType
- resourceId
- timestamp
- metadata

## Data classification

| Data | Classification |
|---|---|
| Public framework content | Public |
| Session title and challenge | Internal by default |
| Owner names | Internal / personal |
| Uploaded document text | Potentially confidential |
| Voice transcript | Potentially confidential |
| API keys | Secret |
| Aggregated anonymous metrics | Internal or public by policy |

## Deletion

MVP must provide:

- delete one session,
- delete all local sessions,
- reset application,
- revoke microphone access through browser guidance.

Future cloud release must provide account and organization deletion workflows.
