# Testing and Quality Strategy

## Quality gate

No production deployment unless all pass:

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
bun run build:web
```

## Unit tests

Use Vitest and Testing Library.

Test:

- classification logic,
- state migrations,
- session creation,
- action item validation,
- API response normalization,
- model-output schema parsing,
- report formatting,
- local-storage failure fallback.

## Component tests

- Pinpoint step updates the session.
- Assess step explains classification.
- Investigate step adds/removes map items.
- Respond step validates owner/action fields.
- Report step excludes private fields by default.
- Drawers trap and restore focus.
- Destructive actions require confirmation.

## API integration tests

Mock Gemini. Do not call paid external APIs in routine CI.

Test:

- missing key,
- malformed body,
- payload too large,
- unsupported MIME type,
- provider timeout,
- invalid provider JSON,
- valid structured response,
- redacted public error.

## End-to-end tests

Use Playwright.

### Core path

1. Open app.
2. Create session.
3. Enter challenge.
4. Complete diagnostic.
5. Complete map.
6. Add action.
7. Add follow-through item.
8. Generate report.
9. Reload.
10. Confirm persistence.

### Secondary paths

- User overrides classification.
- AI unavailable.
- Document upload rejected for size.
- Microphone denied.
- Delete session.
- Import/export session.
- Mobile viewport.
- Keyboard-only completion.

## Accessibility tests

Automated:

- axe-core in component and E2E tests.

Manual:

- keyboard navigation,
- screen reader landmarks and labels,
- visible focus,
- zoom to 200%,
- color-independent meaning,
- print output.

## Performance

Targets:

- Core Web Vitals in “good” range on production.
- Keep initial JS bundle controlled.
- Lazy-load large drawers and AI features.
- Avoid storing huge documents in browser state.
- Debounce automatic persistence.

## CI workflow

```yaml
name: Quality

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run typecheck
      - run: bun run lint
      - run: bun run test
      - run: bun run build:web
```

Add Playwright after browser dependencies and tests are committed.
