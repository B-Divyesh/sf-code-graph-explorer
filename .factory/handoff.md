# Perfection loop round 1 handoff

## Repair scope

Candidate `1d440f83d78dbed791a25770a0f1cfb753fe2862` repairs every blocking
finding in `.factory/review-1.md` while retaining the static Vite artifact and
Graphite’s cream-paper, halftone field-manual identity.

- The first screen now names the engineer and task. The primary action is
  **Try it with sample data**, followed by the exact result and three tested
  facts.
- `/?demo=1` and `/demo` open the five-file codebase directly. The persistent
  demo banner includes **Reset demo** and **Start for real**. Demo data is
  rebuilt from bundled constants, stays in memory, and never reads or writes
  production storage.
- Phone pane switching now keeps inactive panes hidden and avoids source-line
  scrolling unless Source is active. The 390 px regression follows Symbols →
  Graph → Source → Graph and checks the selected pane’s viewport bounds.
- `.factory/claims.json` lists 28 visitor claims. Each id occurs in exactly one
  tagged test. The suite covers parsing, navigation, storage and network
  privacy, limits, JSON round-trip, demo reset/isolation, offline reload,
  keyboard use, mobile panes, routing, and build output.
- `/privacy`, `/terms`, `/demo`, and unknown URLs render distinct pages with
  route titles. Internal navigation moves focus to the new h1 and announces
  it. The Graphite-styled 404 includes Home and Demo paths.
- Canonical, Open Graph, Twitter, Apple touch icon, route metadata, sitemap,
  footer attribution/version, header Demo link, and legal links are present.
  The landing sequence now includes the live graph preview, three-step method,
  and honest limitations/privacy section.
- The broken Sociobot checkout returned HTTP 404 during repair. Following the
  review’s required fallback, all purchase, price, Team, and checkout controls
  are hidden until the product is registered. The free product remains fully
  usable; terms state that no paid purchase is offered in this release.
- The generated service worker now bypasses conditional HTTP-cache bodies
  while precaching and ignores `Vary: Origin` during cache matches. Five
  concurrent offline demo reloads passed after this fix.

## Verification evidence

Clean clone: `/tmp/graphite-clean-EWh1OX`, checked out at
`1d440f83d78dbed791a25770a0f1cfb753fe2862` on 2026-08-28.

- `npm ci`: passed; 62 packages installed; 0 vulnerabilities.
- `npm test`: passed. Vitest: 6/6. Playwright Chromium 1.58.2: 32/32.
- Claims: all 28 manifest ids ran from the clean clone. Twenty-seven are in
  `tests/claims.spec.ts`; `resolution-limits` is a tagged Vitest test.
- Accessibility: axe WCAG 2 A/AA found zero serious or critical violations on
  desktop landing, 390 px demo, 390 px privacy, and 390 px 404 routes.
- Privacy: demo request interception observed only the app origin. Seeded real
  local/session storage values were unchanged; no demo keys were created.
- Offline: direct demo reload passed after service-worker control and
  `context.setOffline(true)`. A two-worker, five-repeat stress run passed 5/5.
- Routing and focus: direct reloads passed for Demo, Privacy, Terms, and 404.
  Client navigation focused the new h1.
- Local `/opt/fleet/lib/verify-url.sh`: HTTP 200, zero console errors, title,
  `lang`, one h1, main landmark, image alt, and button labels passed.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.9 s, CLS 0, TBT 0 ms.
- Final production build: `dist/index.html` exists. Initial JS is 35.30 KB raw
  / 13.09 KB gzip; CSS is 21.50 KB raw / 5.52 KB gzip; hero is 110.57 KB.

Run the same gates with:

```sh
npm ci
npm test
npm run build
```

## Deployment

Deployed the verified `dist/` artifact to Azure Static Web Apps with
`/opt/fleet/lib/deploy-static.sh code-graph-explorer dist`. Deployment id:
`328a5d50-1a8c-4ab8-b36c-95107e9bb0b2`. Azure reported `Succeeded`; the custom
domain was `Ready` and returned HTTPS 200.

Post-deploy verification at `https://code-graph-explorer.sociobot.in` passed:
zero browser console/page errors, zero axe violations, the 390 px pane sequence,
direct demo, offline demo reload, and Privacy/Terms/404 titles. No off-origin
request occurred. The live entry JavaScript SHA-256 exactly matched `dist/`:
`7f6ef53f79ca890e807fc268ba02b2981aba6c1486b378d74f9aec49259b876d`.

## Known gaps

No blocking review finding remains. Cross-file resolution is intentionally
estimated, so dynamic dispatch, aliases, reflection, generated code, and
complex types can still create missing or incorrect relationships. Every
estimated relationship is labelled. Paid Team export remains unavailable
until the factory registers a working Sociobot billing product.
