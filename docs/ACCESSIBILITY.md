# Accessibility Standard

## Target

WCAG 2.2 Level AA.

## Core requirements

- Every field has a programmatic label.
- Errors identify the field and explain correction.
- All actions work with keyboard only.
- Focus order follows visual order.
- Drawers and dialogs:
  - move focus inside,
  - trap focus,
  - close with Escape,
  - restore focus.
- Color is not the only way to distinguish poles or status.
- Text contrast meets AA.
- Interactive targets are large enough.
- Animations respect `prefers-reduced-motion`.
- Voice input is optional and has a text alternative.
- Uploaded-file controls announce status and errors.
- Stepper exposes current step.
- Report uses semantic headings and lists.
- Print view remains legible in grayscale.

## Polarity map semantics

Do not rely only on left/right or blue/purple.

Use labels:

- Pole L
- Pole R
- Benefits
- Risks of overuse
- Shared Best Hope
- Shared Greatest Fear

## Testing matrix

- Chrome + VoiceOver on macOS
- Safari + VoiceOver
- Edge or Chrome + NVDA on Windows
- Mobile Safari
- Android Chrome
- Keyboard-only
- 200% browser zoom

## Accessible AI behavior

- Announce when AI processing begins.
- Show a visible loading state.
- Do not move focus unexpectedly when results arrive.
- Label suggestions as AI-generated.
- Require user confirmation before replacing content.
- Provide a retry and a non-AI path.
