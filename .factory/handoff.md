# Perfection loop round 1 handoff

## Shipped repair

Commit `a34e46a5341b0435507fdf62ac392d37e42a1db6` (`fix: close final Graphite
polish findings`) is pushed to `origin/main` and deployed as the static Azure
artifact. It closes every finding in `.factory/review-1.md` and the remaining
earlier grammar-cache minor.

- The first screen names engineers onboarding, debugging, or refactoring an
  unfamiliar codebase. Its primary **Try it with sample data** action is
  visible without scrolling at both 1440×900 and 390×844.
- `?demo=1` and `/demo` enter the five-file, in-memory sandbox with a
  persistent banner, Reset demo, Start for real, storage isolation, and
  offline reload support.
- All real routes have titles and metadata. Client navigation focuses and
  announces the destination h1. Unknown paths have a Graphite-style 404.
- The claim registry has 28 entries with one tagged test each. The unavailable
  Team checkout is honestly absent; free graph exploration and JSON export
  remain available.
- `/wasm/*` now uses `public, max-age=604800, must-revalidate`; the
  release-versioned worker still precaches the grammars for offline use.

## Exact verification evidence

Fresh-clone verification used `/tmp/code-graph-polish-clean.hpqwjC`, cloned
after the push at `a34e46a5341b0435507fdf62ac392d37e42a1db6`.

- `npm ci`: passed, 62 packages installed, 0 vulnerabilities.
- Every command listed in `.factory/claims.json` was run independently from
  that clone: 28/28 passed. The registry integrity check confirmed 28 claims
  and exactly one matching `@claim:` tag per id.
- Full clean-clone `npm test`: passed — 6 Vitest tests and 33 Playwright
  tests, including browser, claim, mobile, offline, and axe integration.
- Production build: passed. `dist/index.html`, generated `dist/sw.js`, and
  `dist/staticwebapp.config.json` exist. Initial JS is 35.30 KB raw / 13.09 KB
  gzip; CSS is 21.50 KB raw / 5.52 KB gzip; the 110.57 KB hero remains within
  budget.
- Local screenshots: `.factory/evidence/landing-desktop.png`,
  `.factory/evidence/landing-mobile.png`, `.factory/evidence/demo-mobile.png`,
  and `.factory/evidence/not-found.png`.
- `verify-url.sh https://code-graph-explorer.sociobot.in/ .factory/evidence/live`:
  HTTP 200; title, `lang`, one h1, main landmark, image alt, and button labels
  present; zero console errors. Its cold-load time was 722 ms.
- Live axe integration (Playwright Chromium) found 0 serious/critical WCAG
  2 A/AA issues on Home, Demo, Privacy, Terms, and 404. The standalone Axe CLI
  was attempted but cannot locate a system Chrome in this container; the
  repository's pinned Playwright Chromium was used instead.
- Live cold-browser recheck passed: first-screen CTA in the desktop viewport;
  direct demo/banner; Symbols → Graph → Source → Graph at 390 px; production
  storage untouched; demo requests same-origin only; Demo/Privacy/Terms/404
  titles and one h1; client navigation focuses the destination h1; offline
  demo reload works after service-worker control.
- Live grammar response:
  `cache-control: public, max-age=604800, must-revalidate` at
  `/wasm/tree-sitter-typescript.wasm`.
- Mobile Lighthouse against the deployed site: Performance 99, Accessibility
  100, Best Practices 100, SEO 100; LCP 1.6 s, CLS 0, TBT 80 ms.

## Deployment

Deployment ran through `/opt/fleet/lib/deploy-static.sh code-graph-explorer
dist`. The live custom domain returned the new `v1.1.1` hero and the updated
grammar-cache header immediately afterward:
`https://code-graph-explorer.sociobot.in/`.

## Known limits

No review finding remains open. Cross-file relationships are intentionally
labelled estimates; dynamic calls, reflection, generated code, aliases, and
complex types can still be missing or incorrect. This is a documented product
limit, not a deferred defect.
