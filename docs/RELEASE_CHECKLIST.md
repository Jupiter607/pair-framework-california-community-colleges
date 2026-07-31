# Production Release Checklist

## Product

- [ ] P.A.I.R. terminology is consistent.
- [ ] Problem, polarity, and problem-within-a-polarity are explained.
- [ ] Full workflow can be completed without AI.
- [ ] AI changes require user confirmation.
- [ ] Report contains required session outputs.
- [ ] Example cases are clearly labeled as examples.

## Build

- [ ] Frozen dependency install passes.
- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Unit tests pass.
- [ ] E2E tests pass.
- [ ] Production build passes.
- [ ] No duplicate lockfiles.
- [ ] No critical dependency vulnerabilities.

## Security

- [ ] Secrets are only in Vercel.
- [ ] No secret uses `VITE_` prefix.
- [ ] Rate limits enabled.
- [ ] Payload limits enabled.
- [ ] MIME allowlist enabled.
- [ ] Runtime schemas enabled.
- [ ] Markdown sanitized.
- [ ] Security headers verified.
- [ ] Public errors contain no stack trace.
- [ ] Preview deployment protected.

## Privacy

- [ ] Privacy notice published.
- [ ] Upload warning published.
- [ ] Voice consent implemented.
- [ ] Delete-all-local-data works.
- [ ] Raw media is not stored locally.
- [ ] Export warning explains sensitive content.
- [ ] Provider processing disclosure reviewed.

## Accessibility

- [ ] Keyboard-only core path passes.
- [ ] Screen-reader labels verified.
- [ ] Visible focus verified.
- [ ] Color contrast verified.
- [ ] Reduced motion supported.
- [ ] 200% zoom works.
- [ ] Mobile layouts work.
- [ ] Print report is accessible.

## Operations

- [ ] `/api/health` returns healthy.
- [ ] Error monitoring active.
- [ ] Uptime monitoring active.
- [ ] Daily AI budget alert set.
- [ ] Rollback procedure tested.
- [ ] Support contact visible.
- [ ] Application version visible.

## Final smoke test

- [ ] Create session.
- [ ] Refresh and recover session.
- [ ] Complete diagnostic.
- [ ] Complete polarity map.
- [ ] Add action and owner.
- [ ] Use an AI suggestion.
- [ ] Handle an AI error.
- [ ] Generate and print report.
- [ ] Delete session.
