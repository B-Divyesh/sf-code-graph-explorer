# Independent verification 5 — Trace calls through an unfamiliar codebase

## Verdict

**PASS**

- Findings: **0** (blocking 0, major 0, minor 0)
- Untested public claims: **0**
- Candidate implementation: `0d2a14c507a4011ebc703e4d94c9ed5685bd84e1`
- Candidate documentation: `c8891ebc80e8c79808e14f23e7f800a94501dee6`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Verified: 2026-09-06

The documentation commit is later than the implementation commit and contains
reporting only. The live `index.html` and `sw.js` match a fresh build of the
implementation candidate byte-for-byte, so the runtime reviewed is the
candidate product image.

## Job, audience, and first action

Fresh desktop (1440 × 900) and phone (390 × 844) contexts loaded the live
home page without console errors. Before scrolling, both stated:

- Job: “Trace calls through an unfamiliar codebase.”
- Audience: engineers onboarding, debugging, or refactoring.
- First action: **Try it with sample data**, with “See a five-file server
  codebase already mapped” immediately alongside it.

The first screen also showed the local-source, offline-demo, free-core, and
$24 Team facts. The primary action was visible and reachable at both sizes.

## Live product paths

- The direct sample loaded a populated five-file server codebase with 12
  symbols, 10 relationships, source, graph nodes, and estimated-edge labels.
- The persistent “Demo — sample data, nothing is saved” label remained visible.
  Selecting `healthCheck`, then resetting, restored `boot` and five files.
  **Start for real** removed the workspace and preserved a seeded real-storage
  sentinel.
- Phone `/` opened and focused search. Symbols, Graph, and Source tabs each
  showed their selected pane. No visible phone interactive target was smaller
  than 44 × 44 CSS pixels.
- Live malformed-index, over-2-MB file, and 5,001-file errors each offered a
  working **Try another folder** recovery path. The 5,001-file case left no
  partial workspace. A fake license produced the inactive-license notice.
- Fresh service-worker contexts reloaded both the demo and a real workspace
  offline. The demo rebuilt its sample; the real reload returned to intake and
  contained no marked source text. The worker controlled the context and used
  cache `graphite-shell-0796ad6462bc`.
- `/privacy`, `/terms`, and `/demo` returned 200 with distinct titles and one
  h1. An unknown URL returned the designed not-found page with HTTP 404. Its
  expected browser “resource 404” message is not a product console defect.
- The live page exposed `lang="en"`, title, main landmark, shared header/footer,
  legal links, CSP, HSTS, nosniff, referrer policy, and permissions policy.
  No free-workflow third-party request, analytics, hosted font, or source
  upload was observed by the privacy claim tests.

## Clean verification and claims

The checkout was clean at `c8891eb`. `npm ci` installed 62 packages with zero
reported vulnerabilities. The repository has 40 unique claim IDs, 40 unique
`@claim:` tags, no duplicates, and no missing or extra tags.

| Check | Result |
| --- | --- |
| Every exact command declared by `.factory/claims.json` | 40/40 passed independently |
| `npm test` | Passed: 8 Vitest tests and 47 Playwright tests |
| `npm run build` | Passed; produced `dist/index.html` |
| Initial JS / CSS | 43.54 KB / 24.70 KB raw; 15.64 KB / 6.04 KB gzip |
| Live axe WCAG 2 A/AA | 0 violations on Home, phone Demo, Privacy, Terms, and 404 |
| Live Lighthouse mobile | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |

The initial `npm exec lighthouse` attempt lacked a Chromium path; rerunning it
with the installed Playwright Chromium and `--disable-full-page-screenshot`
completed with no runtime error and the scores above. This is an environment
setup detail, not a product test failure.

`verify-url.sh` is not present in this checkout. Its required equivalents were
checked with fresh Playwright pages and axe: title, language, one h1, main,
alt text, labelled controls, keyboard/focus behavior, route titles, and console
errors.

## Candidate and deployment identity

| Artifact | SHA-256 |
| --- | --- |
| Fresh `dist/index.html` and live `index.html` | `5bc796faa8adb60720c91357822532d9b96cb738db890f69015103c123da5089` |
| Fresh `dist/sw.js` and live `sw.js` | `f98ff80300b16f5df519aca9dff14f66231a421aa236fb98360ea2414ab25d06` |

## Earlier finding disposition

All prior review and verification reports, including minor items, were read.

| Earlier group | Current disposition |
| --- | --- |
| Review 1 B1–B6 and M7–M8 | Fixed: phone panes, isolated direct demo, first-screen clarity, claim registry, real 404, live checkout, route structure, metadata, and plain copy all pass. |
| Review 2 F-2-1–F-2-10 | Fixed: phone shortcut/targets, full claim outcomes, local and cross-file resolution coverage, build/license assertions, and Team review packet pass. |
| Original verification P1 items | Fixed: fresh worker install/offline reload and the all-or-nothing 5,001-file limit pass. The documented grammar-cache improvement remains an intentional non-finding. |
| Review 4 F-4-1–F-4-4 | Fixed: folder-input recovery, six former claim gaps, true HTTP 404, and plain task headings pass. |
| Review 5 F-5-1 | Fixed: fresh live demo and real-workspace offline reloads pass; the worker no longer precaches Azure’s deployment-only configuration file. |
| Verification 3/4 and polish reports | No open issue remained; their stated behavior was reproduced above. |

## Product boundaries

Cross-file matches are deliberately labelled estimates. Dynamic calls can be
absent. Opened source remains only in browser memory, so an offline real-workspace
reload restores the app shell rather than retaining source. These are documented
boundaries, not findings.
