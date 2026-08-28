# Graphite perfection-loop round 2 handoff

## Outcome

All findings in `.factory/review-2.md`, `.factory/review-1.md`, and the earlier
verification/polish reports are resolved. The repair implementation is commit
`7a7013d`, pushed to `main` and deployed at
`https://code-graph-explorer.sociobot.in`.

The product remains a Vite + TypeScript static site. Its graphite-paper,
halftone field-manual identity is unchanged. The live billing catalog now has a
registered **Graphite Team review packet** at **$24 once for one user**. The
Sociobot checkout redirects to the matching Dodo checkout page.

## What changed

- Fixed `/` from the default 390-pixel Graph pane: it opens Symbols and focuses
  Search. Added full pane-tab arrow behavior coverage.
- Made every visible phone workspace target at least 44×44 px. Mobile graph
  nodes retain their visual scale inside a scrollable drafting strip.
- Strengthened every partial claim test and added claims for same-file
  resolution, cross-file resolution, test scripts, MIT licensing, live Team
  checkout, review-packet export, and mobile targets.
- Corrected cross-file call resolution: named imports win, unique definitions
  resolve heuristically, and ambiguous names stay unresolved.
- Restored the brief's Team workflow: landing tier, checkout, license return,
  daily verify, restore/remove, invalid-license lock, and local standalone HTML
  export with the focused symbol, source location/excerpt, and relationships.
- Kept demo state isolated. Demo mode never reads license keys and exposes only
  a clearly labelled sample review-packet preview.
- Updated Privacy, Terms, README, catalog copy, copy audit, demo docs, design
  notes, CSP, claims registry, and MIT license title.

## Verification

Clean clone: `/tmp/code-graph-polish2.L2DV5s` at `7a7013d`.

- `npm ci`: passed; 0 vulnerabilities.
- Every command in `.factory/claims.json`: **35/35 passed independently**.
- Claim integrity: 35 entries, 35 unique tags, exactly one tag per entry.
- `npm test`: passed — 8 Vitest unit tests and 41 Playwright tests.
- `npm run build`: passed; `dist/` contains the static app, generated service
  worker, legal routing configuration, sitemap, robots file, and WASM assets.
- Browser coverage: cold desktop/mobile first screen, real file input, six
  language extensions, every ignored folder, error limits, demo reset/exit,
  storage isolation, offline reload, keyboard, all phone targets, history,
  titles, metadata, 404, legal pages, checkout, license return, and HTML export.
- Privacy interception: a uniquely marked real source file appeared in no URL,
  request body, localStorage, sessionStorage, IndexedDB, OPFS, or Cache Storage;
  no non-GET application request occurred.
- Accessibility: axe WCAG 2 A/AA scans on Home, Demo, Privacy, Terms, 404, and
  the Team dialog found zero serious/critical issues. Dialog focus returns to
  its opener; reduced motion uses instant transitions; visible phone controls
  meet 44×44 px.
- `verify-url.sh` on production: HTTPS 200; title, `lang`, one h1, main,
  image alt, button labels, and console checks passed.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.7 s, TBT 130 ms, CLS 0.
- Build budgets: entry JS 43.42 KB raw / 15.65 KB gzip; lazy parser JS
  67.15 KB raw / 16.53 KB gzip; CSS 24.70 KB raw / 6.04 KB gzip; hero
  110.6 KB.
- Deployment ID: `672a6923-4df3-4bae-8595-52f3cc33cc9b`.
- Live `index.html` and `sw.js` exactly match local `dist/` by SHA-256.

Run locally:

```sh
npm ci
npm test
npm run build
npm run preview
```

## Known gaps and next steps

No reviewed finding or required acceptance item remains. The intentionally
labelled product limit remains: cross-file resolution is heuristic and dynamic
calls can be absent. No follow-up is required for this work order.
