# Adversarial first-read review 2 handoff

## Outcome

Review 2 is complete with verdict **FAIL**. No product code was changed.
`.factory/review-2.md` contains the cold mobile/desktop read, full landing and
README copy audit, demo/privacy/offline evidence, all claim-command results,
the earlier-finding audit, structure/accessibility checks, and exact fixes.

Current findings: three blocking and seven major. The blocking items are the
broken `/` search shortcut in the default 390-pixel demo, incomplete assertions
behind several green claims, and core phone targets below 44 × 44 pixels. Major
items cover six unlisted/partially listed README claims and the brief's missing
Team review-packet export.

## Verification performed

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900.
- Direct and one-click demo entry, realistic seed, reset, exit, mobile panes,
  browser storage sentinels, network/source interception, and offline reload.
- Live route/title/h1/metadata/focus/back/404/link crawl and console monitoring.
- Live axe-core WCAG 2 A/AA scans on Home, Demo, Privacy, Terms, and 404: zero
  automated violations.
- Reduced-motion computation and manual 390-pixel target measurements.
- Clean no-local clone at `/tmp/code-graph-review2.lAbRz9`:
  - `npm ci`: passed, 0 vulnerabilities.
  - All 28 commands from `.factory/claims.json`: passed independently.
  - Registry integrity: 28 entries, 28 unique tags, one tag per entry.
  - `npm test`: passed, 6 unit and 33 Playwright tests.
  - `npm run build`: passed and produced `dist/`.

## Left for the owner

No deployment was requested or performed. Resolve every finding in
`.factory/review-2.md`, add the missing viewport and claim assertions, then run
the entire adversarial checklist again from a fresh clone and browser context.
