---
name: "♿ Accessibility Compliance"
description: Implement WCAG 2.2 compliant interfaces with screen reader support, keyboard navigation, focus management, and mobile accessibility patterns. Use when auditing accessibility or fixing a11y issues in UI work.
source: https://skillsmp.com/skills/wshobson-agents-plugins-ui-design-skills-accessibility-compliance-skill-md
author: wshobson
repository: https://github.com/wshobson/agents
stars: 33181
forks: 3609
updated: 2026-03-07
---

# Accessibility Compliance

Use this skill when UI work needs explicit accessibility coverage instead of generic design guidance.

## When To Use

- Audit a page or component for WCAG 2.2 gaps
- Add keyboard support and visible focus states
- Build accessible dialogs, forms, and navigation
- Improve screen reader behavior with semantic HTML and ARIA
- Verify reduced motion, contrast, and touch target requirements

## Core Areas

- `Perceivable`: text alternatives, contrast, heading structure, landmarks
- `Operable`: keyboard navigation, focus order, skip links, target sizing
- `Understandable`: clear labels, validation, predictable interactions
- `Robust`: semantic markup first, ARIA only where needed, assistive tech compatibility

## Quick Checklist

- All interactive elements are keyboard reachable
- Focus indicators are visible and not removed
- Forms have labels, hints, and error messages tied with `aria-describedby`
- Dialogs trap focus and close on `Escape`
- Images and icon-only controls have accessible names
- Dynamic changes are announced with live regions when needed
- Contrast meets at least WCAG AA
- Touch targets are at least `24x24px` minimum, `44x44px` preferred

## Implementation Notes

- Prefer native HTML elements before custom ARIA-heavy widgets
- Use `aria-invalid`, `aria-busy`, `aria-live`, and dialog labeling deliberately
- Add skip links and landmark regions for complex layouts
- Test both desktop and mobile assistive flows

## Testing

- Automated: axe, Lighthouse, WAVE
- Manual: keyboard-only navigation, VoiceOver/NVDA/TalkBack, zoom to 200%

## Resources

- WCAG 2.2 quick reference: `https://www.w3.org/WAI/WCAG22/quickref/`
- WAI-ARIA APG: `https://www.w3.org/WAI/ARIA/apg/`
