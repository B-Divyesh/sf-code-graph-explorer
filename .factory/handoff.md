# Repair 3 handoff — Trace calls through an unfamiliar codebase

## Result

**PASS — the review 5 offline defect is repaired and no known product finding remains.**

- Implementation SHA: `0d2a14c507a4011ebc703e4d94c9ed5685bd84e1`
- Product version: `1.2.1`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Azure deployment ID: `76b1383c-76ab-4160-a308-7e2285d5cb18`
- Worker release: `graphite-shell-0796ad6462bc`
- Repair date: 2026-09-06

## What changed

The generated service worker now excludes `staticwebapp.config.json` from its
precache. Azure consumes this deployment file and correctly returns HTTP 404
for its public URL, so including it previously rejected the worker's complete
install transaction.

Browser tests now use a production-like static server instead of Vite Preview.
The server returns HTTP 404 for the deployment configuration, serves the real
SPA routes, and returns the designed 404 page for unknown URLs. Both offline
claim tests create fresh browser contexts and prove successful reloads in that
environment. This regression would fail if a deployment-only file entered the
precache again.

The release version is now 1.2.1. The design and demo records describe the
deployment boundary, and the claim sandboxes name the production-like setup.

## Clean verification

A fresh detached clone at the implementation SHA used Node 22.23.2 and npm
10.9.8.

```sh
npm ci
# Run every exact command in .factory/claims.json separately
npm test
npm run build
```

- `npm ci`: passed; 62 packages installed and zero vulnerabilities reported.
- Declared claims: 40/40 exact commands passed independently.
- `npm test`: passed; 8 unit tests and 47 Playwright browser tests.
- `npm run build`: passed and produced `dist/index.html`.
- Entry JavaScript: 43.54 KB raw / 15.54 KB gzip.
- Lazy parser JavaScript: 67.15 KB raw / 16.45 KB gzip.
- CSS: 24.70 KB raw / 6.06 KB gzip.
- Landing image: 110,574 bytes.
- The existing `web-tree-sitter` browser-external and dependency `eval`
  warnings remain non-fatal.

## Live verification

Fresh phone (390 × 844) and desktop (1440 × 900) browser contexts were used.

- Before scrolling, both showed the job, engineer audience, sample action,
  result note, and three facts. The action ended at 588 px on phone and 631 px
  on desktop.
- The sample opened five files, 12 symbols, and 10 relationships. Its label
  stayed visible after navigation. Reset restored `boot`; Start for real
  discarded the workspace; a production-storage sentinel was unchanged.
- Demo traffic stayed on the product origin.
- Fresh demo and real-workspace contexts each installed one worker with cache
  `graphite-shell-0796ad6462bc`, then reloaded offline. The real reload retained
  no opened source.
- `staticwebapp.config.json` returns the expected HTTP 404 and is absent from
  the live worker. An unknown route also returns HTTP 404 with the designed
  recovery page.
- `verify-url.sh` passed with HTTPS 200, title, `lang`, one h1, main landmark,
  alt text, labelled buttons, and zero console errors.
- Live Playwright axe scans found zero serious or critical WCAG 2 A/AA issues
  on Home, Demo, Privacy, Terms, and the HTTP 404 page.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.6 s, TBT 70 ms, CLS 0. INP had no interaction sample.
- Live and local SHA-256 match for `index.html`, `404.html`, `sw.js`, entry JS,
  entry CSS, parser JS, and the landing image. The worker SHA-256 is
  `f98ff80300b16f5df519aca9dff14f66231a421aa236fb98360ea2414ab25d06`.
- Live security headers, one-week WASM revalidation, and no-cache worker
  delivery remain in place.

Evidence is under `/work/.evidence/repair-3/`. The catalog description was
copied to `/work/.evidence/catalog-description.txt`. The registered $24
one-time Team offer metadata is in `/work/.evidence/billing-offer.json`.

## Earlier findings

Review 1 phone panes, demo isolation, first-screen clarity, claims, 404,
checkout, metadata, and copy fixes remain covered. Review 2 keyboard, touch
targets, full claim outcomes, resolution rules, build/license inventory, and
Team export fixes remain covered. The earlier stale-worker, 5,001-file, and
WASM-cache findings remain covered. Review 4 recovery, license/search/offline
claims, HTTP 404, and heading fixes remain covered. Review 5's live install
failure is closed by the production-like regression and fresh live checks.

## Known limits and next steps

Cross-file matching remains deliberately heuristic, and dynamic calls can be
absent. The app labels estimated relationships. Opened source remains in
memory, so offline reload opens the shell without retaining a real codebase.
These are documented product boundaries, not open repair findings.

The separately referenced `factory-evidence/code-graph-explorer-review-5/`
path was not present in this worker. The complete committed
`.factory/review-5.md` report and its matching injected verdict were used.
