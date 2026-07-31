# Product Requirements Document

## Product name

**Leading Through Tension**

## Framework name

**P.A.I.R.**

- **P** — Pinpoint the challenge
- **A** — Assess: problem or polarity
- **I** — Investigate the polarity
- **R** — Respond with actions, indicators, owners, and review cycles

## Problem

College and system leaders often treat recurring tensions as one-time problems. This produces temporary decisions, recurring conflict, and unbalanced implementation.

## Users

### Primary

- Convening facilitators
- College leadership teams
- Faculty leaders
- Classified professionals
- Regional consortium leaders
- AI Fellows and implementation teams

### Secondary

- Students participating in governance or planning
- Community and workforce partners
- Chancellor’s Office synthesis teams

## Jobs to be done

1. Help a team clearly name a challenge.
2. Help a team determine whether it is a problem, polarity, or problem within a polarity.
3. Help a team identify the legitimate value of both poles.
4. Help a team identify the predictable downside of overusing either pole.
5. Help a team define a Shared Best Hope and Shared Greatest Fear.
6. Help a team produce balanced actions with accountable owners.
7. Help a team identify early-warning indicators.
8. Help a team leave with a 30/60/90-day review plan.
9. Help a facilitator produce a plain-language report.

## MVP user journey

1. Start or open a session.
2. Enter the raw challenge.
3. Reframe the challenge in neutral language.
4. Answer diagnostic questions.
5. Review classification and rationale.
6. Name Pole L and Pole R.
7. Map upsides and downsides.
8. Define Shared Best Hope and Shared Greatest Fear.
9. Add both/and actions.
10. Add owners, timing, evidence, and early-warning indicators.
11. Complete the 30/60/90-day plan.
12. Generate, print, or copy a report.

## AI-assisted features

AI may:

- suggest neutral wording,
- explain a classification,
- suggest balanced pole names,
- propose map content,
- analyze an uploaded document,
- transcribe a voice note,
- suggest actions,
- convert outputs to plain language.

AI must not:

- silently overwrite user work,
- claim a classification is objectively final,
- expose secret keys,
- retain uploaded content without disclosure,
- make high-impact institutional decisions,
- fabricate source attribution.

## Functional requirements

### Session management

- Create, duplicate, rename, and delete sessions.
- Save automatically.
- Display last-updated time.
- Export and import a portable JSON session file.
- Warn before destructive reset.
- Version the saved schema.

### Diagnostic

- Explain each question.
- Show how answers influence the classification.
- Allow user override with required rationale.
- Support:
  - problem,
  - polarity,
  - problem within a polarity.

### Polarity map

- Require positive-value names for both poles.
- Support multiple upsides and downsides.
- Prevent accidental empty-item creation.
- Support reordering.
- Provide facilitator tips.

### Action plan

Each action contains:

- action statement,
- pole supported,
- owner,
- timing,
- success evidence,
- early-warning indicator.

### Report

- Produce structured and plain-language views.
- Be print-friendly.
- Include date, title, and optional institution name.
- Exclude private chat and raw uploads by default.
- Clearly label AI-assisted text.

## Nonfunctional requirements

- WCAG 2.2 AA target
- Responsive from 360 px upward
- Keyboard operable
- Fast initial load
- No secret in browser bundles
- API rate limiting and request-size limits
- Graceful AI outage behavior
- Production error monitoring
- Automated quality gate before deployment

## Success metrics

### Product

- 80% of pilot groups complete the workflow.
- 75% generate an action plan.
- 90% of completed actions have an owner.
- 70% schedule a 90-day review.

### Quality

- No critical accessibility defects.
- No critical/high security findings at release.
- Core flow end-to-end tests pass.
- AI errors do not destroy session data.

## Out of scope for MVP

- Multi-user synchronous editing
- Statewide aggregate dashboards
- Identity federation
- Automated institutional recommendations
- Grading or employee evaluation
