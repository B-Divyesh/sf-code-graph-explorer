# Review 6 — Trace calls through an unfamiliar codebase

## Verdict

**PASS — zero findings and zero untested public claims.**

- Findings: **0** (blocking 0, major 0, minor 0)
- Untested public claims: **0**
- Implementation candidate: `0d2a14c507a4011ebc703e4d94c9ed5685bd84e1`
- Documentation baseline: `76caccdf26272cb75f940bfdfb508e98954c00d4`
- Prior handoff documentation: `c8891ebc80e8c79808e14f23e7f800a94501dee6`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Reviewed: 2026-09-06

`76caccd` adds the prior QA report only. A fresh build from the implementation
candidate has the same SHA-256 as the live `index.html` and `sw.js`, so the
live product reviewed is the implementation candidate.

## Job, audience, and first action before scrolling

Fresh desktop (1440 × 900) and phone (390 × 844) browser contexts opened the
live home page without scrolling. In both contexts:

- Job: trace calls through an unfamiliar codebase.
- Audience: engineers onboarding to, debugging, or refactoring a codebase.
- First action: **Try it with sample data**; it says a five-file server
  codebase is already mapped.

The primary action was visible in both viewports. The first screen also stated
the local-source, offline-demo, free-core, and $24 Team facts. Home had the
plain-language title, `lang="en"`, one h1, and one main landmark; no console
errors occurred.

## Live product review

- Clicking the sample action loaded the isolated five-file server codebase:
  12 symbols, 10 relationships, source, graph nodes, and estimated
  cross-file labels. The persistent **Demo — sample data, nothing is saved**
  label remained visible.
- Selecting `healthCheck`, then **Reset demo**, restored `boot`; **Start for
  real** discarded the workspace. A seeded real-storage sentinel remained
  unchanged, and the free demo issued no external request.
- On phone, Symbols → Graph → Source → Graph each selected and displayed its
  intended pane. `/` focused Search. All observed navigation had zero console
  errors.
- Fresh live offline contexts reloaded the demo to `boot` with its banner. A
  real workspace reloaded to the intake shell with no project bar and without
  its uniquely marked source text.
- Live malformed JSON, an over-2-MB source file, and 5,001 supported files
  each produced the expected error. **Try another folder** recovered every
  case to a populated real workspace; the 5,001-file case retained no partial
  workspace.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route
  returned the designed page with HTTP 404, its own title, one h1, and a main
  landmark. Its expected resource-404 console message is not a product
  console defect.

## Claims and clean verification

A detached clean checkout at `c8891eb` ran `npm ci` successfully (zero
reported vulnerabilities). The registry has 40 unique IDs, every ID has one
and only one `@claim:` tag, and it has no extra tags.

| Check | Result |
| --- | --- |
| Every exact command declared by `.factory/claims.json` | **40/40 passed independently** |
| `npm test` | **Passed:** 8 Vitest tests and 47 Playwright tests |
| `npm run build` | **Passed;** created `dist/index.html` |
| Initial entry assets | JS 43.54 KB raw / 15.64 KB gzip; CSS 24.70 KB raw / 6.04 KB gzip |
| Live axe WCAG 2 A/AA | 0 violations on Home, phone Demo, Privacy, Terms, and 404 |
| Live Lighthouse mobile | Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.58 s, TBT 48 ms, CLS 0 |

The declared commands exercise normal, invalid, boundary, recovery, keyboard,
mobile, privacy, license, route, accessibility, and offline paths. The live
page and README were cross-checked against the registry and its copy audit;
there is no unlisted public claim.

## Privacy, routes, and deployment identity

The free sample flow made same-origin requests only. Live headers supplied
HSTS, CSP, `nosniff`, strict referrer policy, and a restrictive permissions
policy. The deployment deliberately returns 404 for its deployment-only
`staticwebapp.config.json`, while live SPA routes, robots, sitemap, and the
designed 404 behave as required.

| Artifact | SHA-256 |
| --- | --- |
| Fresh `dist/index.html` and live `index.html` | `5bc796faa8adb60720c91357822532d9b96cb738db890f69015103c123da5089` |
| Fresh `dist/sw.js` and live `sw.js` | `f98ff80300b16f5df519aca9dff14f66231a421aa236fb98360ea2414ab25d06` |

## Earlier finding disposition

All earlier review, verification, and polish reports were inspected. Polish
reports introduced no separate finding IDs.

| Earlier finding | Current proof | Disposition |
| --- | --- | --- |
| Review 1 B1 phone panes; B2 demo sandbox; B3 first screen; B4 claim registry; B5 routes; B6 checkout; M7 structure; M8 copy | Live phone pane sequence, isolated reset/exit, cold first screens, 40/40 claims, route checks, Team claim, skeleton/metadata checks, and copy audit pass. | Fixed |
| Original verification P1 stale service worker | Fresh live demo and real-workspace offline reloads passed; live `sw.js` matches the fresh build. | Fixed |
| Original verification P1 5,000-file boundary | Live 5,001-file input showed the boundary error, no partial workspace, and recovered through the folder input. | Fixed |
| Verification 3 P3 grammar cache | The build contract passes and the configured WASM cache route uses one-week `must-revalidate`; it is no longer a finding. | Fixed |
| Review 2 F-2-1 through F-2-10 | Phone `/` and targets, full claim coverage, local/cross-file rules, test/build/license assertions, removed environment promise, and Team review packet all pass. | Fixed |
| Review 3 | Report contained no findings. | No open item |
| Review 4 F-4-1 recovery; F-4-2 claim gaps; F-4-3 soft 404; F-4-4 indirect headings | Live recovery worked for all three errors; 40 claims pass; unknown route is HTTP 404; current headings are task words. | Fixed |
| Review 5 F-5-1 live offline | Fresh live sample and real-workspace offline reloads pass without retaining opened source. | Fixed |
| Verification 4 and verification 5 | Both reported no open findings; their stated behavior was reproduced above. | No open item |

## Product boundaries

Cross-file matches remain visibly labelled estimates. Dynamic calls can be
absent. Opened real source stays only in browser memory, so an offline real
workspace reload restores the shell rather than retaining source. These are
documented product limits, not defects.
