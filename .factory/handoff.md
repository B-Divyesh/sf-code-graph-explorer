# Verification 4 handoff — Trace calls through an unfamiliar codebase

## Independent verification result

**PASS — zero findings and zero untested public claims.**

Independent verification reviewed implementation `5e33f7b8bb8d0f7bc790644bbfe2c8f774a4db7b` and documentation baseline `a52b9809638eef5003c308cf4c17c31a651bb352` at `https://code-graph-explorer.sociobot.in`.

- A clean detached clone ran all 40 declared claim commands separately: 40/40 passed.
- `npm test` passed: 8 unit and 47 browser tests. `npm run build` passed and created `dist/`.
- Fresh live desktop and phone contexts showed the job, audience, and Try it with sample data action before scrolling. The sample populated five files, 12 symbols, and 10 relationships; its banner/reset worked without altering a real-storage sentinel.
- Live axe scans on Home, Demo, Privacy, Terms, and 404 found zero serious/critical issues. An unknown route returns a designed, deliberate HTTP 404.
- Candidate and live hashes match for the HTML, 404 page, service worker, entry JS/CSS, and landing image.

See `.factory/verification-4.md` for the full evidence, prior-finding audit, checks, and known limits.

## How to verify

```sh
npm ci
npm test
npm run build
```

For the isolated product demonstration, open `https://code-graph-explorer.sociobot.in/?demo=1` or use **Try it with sample data** from the landing page. Use **Reset demo** to restore the bundled sample, or **Start for real** to discard it.

## Repair handoff

## Result

**PASS.** The four review-4 findings and all six incomplete public-claim
findings are resolved in the deployed static product.

- Implementation SHA: `5e33f7b8bb8d0f7bc790644bbfe2c8f774a4db7b`
- Prior documentation/review baseline: `b1ae1e7d01916f38cc1ce6a732abf307bfc818b7`
- Final deployment: `ce4c483b-c193-4519-aca4-482306dfbe6f`
- Live URL: `https://code-graph-explorer.sociobot.in`

The implementation and prior documentation baseline differ because review-4
was report-only. This handoff is a later documentation-only record of the
verified implementation.

## What changed

1. **Folder-error recovery works in picker-fallback browsers.** Every error
   screen now includes the labelled folder-file input used by **Try another
   folder**. The outcome test disables `showDirectoryPicker`, triggers malformed
   index, oversized-file, and 5,001-file errors, then selects a valid file and
   reaches a workspace after each recovery.
2. **Claim coverage is complete.** The registry now has 40 one-to-one claims
   and tagged outcome tests. New coverage proves recovery, exact one-time and
   one-user Team terms, license localStorage/request privacy, revoked-license
   locking, local-only search, and offline app-shell behavior after a real
   workspace. The revocation test uses a recorded `revoked` verification
   response; it does not make a paid purchase or use a real license.
3. **Unknown URLs return HTTP 404.** Known SPA paths have explicit rewrites;
   the generic catch-all fallback was removed so Azure can apply the static
   `404.html` response override. The live `/final-missing` response is HTTP 404
   and renders the Graphite-styled recovery page with header, nav, main, footer,
   title, one h1, and recovery links.
4. **Headings and labels use direct task words.** Replaced “Drawing”, “Share
   the path you traced”, “This page is not in the graph”, and “Plate 01” with
   “Indexing”, “Export a review packet”, “Page not found”, and “Code graph
   example”. The copy audit is updated.

## Verification

From a clean remote clone at the implementation SHA:

```sh
npm ci
# Each of the 40 exact commands in .factory/claims.json, separately
npm test
npm run build
```

- All **40/40** declared claim commands passed separately from
  `/tmp/codegraph-release-claims.RNlUjn`.
- `npm test` passed: **8 Vitest unit tests** and **47 Playwright browser
  tests**, including mobile, demo, offline, claim, route, and axe coverage.
- `npm run build` passed and produced `dist/`.
- The final build is within the static budget: entry JS 43.54 KB raw / 15.64 KB
  gzip; lazy parser 67.15 KB raw / 16.53 KB gzip; CSS 24.70 KB raw / 6.04 KB
  gzip; landing image 110.57 KB.
- `verify-url.sh` passed against live HTTPS: title, `lang`, one h1, main,
  alt text, labelled buttons, and no home-page console errors.
- Live axe WCAG 2 A/AA scans on Home, Demo, Privacy, Terms, and the HTTP 404
  returned zero serious or critical violations.
- Live Lighthouse mobile: **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**; LCP 1.65 s, TBT 43 ms, CLS 0.
- Local and live SHA-256 values match for `index.html`, `404.html`, `sw.js`,
  entry JS/CSS, and the Tree-sitter parser.

## Cold live-browser check

Fresh desktop (1440 × 900) and phone (390 × 844) contexts were opened without
scrolling. Both show the job, audience, and **Try it with sample data** action.
The action ends at 631 px on desktop and 588 px on the 844 px phone viewport.

The one-click demo loaded the five-file server sample with 12 symbols and 10
relationships. Its persistent “Demo — sample data, nothing is saved” label,
source, graph, Reset demo, and Start for real controls worked. Reset restored
`boot`; a seeded production localStorage sentinel was unchanged. No real
codebase was opened during this live demo check.

The deliberate HTTP 404 naturally appears as a failed-resource console entry
in Chromium because the document status is 404. It is not an application
exception: the complete recovery page rendered and passed axe. All 200-page
live checks had zero console errors.

## Evidence

- `/work/.evidence/verify-release/` — live URL verifier output and screenshots.
- `/work/.evidence/repair-live-desktop-home.png`
- `/work/.evidence/repair-live-desktop-demo.png`
- `/work/.evidence/repair-live-phone-home.png`
- `/work/.evidence/repair-live-phone-demo.png`
- `/work/.evidence/lighthouse-release.json`
- `/work/.evidence/catalog-description.txt`

## Known limits

- Definitions and cross-file relationships are intentionally heuristic. Dynamic
  calls and ambiguous names can be absent; estimated matches are labelled.
- The v1 browser intake accepts TypeScript/TSX, JavaScript/JSX, Python, and Go.
  Files over 2 MB and folders above 5,000 supported files are rejected before a
  partial index is kept.
- Source and active indexes remain in browser memory. The offline app shell
  does not retain an opened real codebase.

## Next step

For larger repositories, add a worker-backed incremental index while preserving
the local-only source boundary and the existing all-or-nothing intake guard.
