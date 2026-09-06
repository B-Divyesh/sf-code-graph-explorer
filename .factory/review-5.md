# Review 5 — Trace calls through an unfamiliar codebase

## Verdict

**FAIL**

- Finding count: **1 major**
- Untested or incompletely tested public claims: **2**
- Implementation candidate: `5e33f7b8bb8d0f7bc790644bbfe2c8f774a4db7b`
- Documentation baseline: `000f543fbc7edb87004eaa96c259079f7aa859f1`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Review date: 2026-09-06

Commits after `5e33f7b` only change reports. The candidate build and live
deployment match byte for byte for the HTML, 404 page, worker, entry scripts,
stylesheet, and landing image.

## Job, audience, and first action

Fresh Chromium contexts opened the live home page at 1440 × 900 and 390 × 844.
Nothing was scrolled before these answers were recorded.

| Question | Answer from the first screen |
| --- | --- |
| What is the job? | Trace calls through an unfamiliar codebase. |
| Who is it for? | Engineers onboarding to, debugging, or refactoring unfamiliar code. |
| What should they do first? | Select **Try it with sample data** to open an already mapped five-file server codebase. |

The first action ends at 631 CSS pixels on desktop and 588 pixels on the phone.
The title, h1, audience sentence, result note, and privacy/offline/price facts
are visible before scrolling at both sizes.

## Finding

### F-5-1 — Major — The live offline promises fail in a fresh browser

The home page says **“The demo opens offline after your first visit.”** A real
workspace says **“App shell is available offline after this visit.”** These are
registered as `offline-reload` and `real-workspace-offline`.

Both declared commands pass against the local Vite preview, but the live Azure
deployment cannot install this release's service worker:

1. `scripts/build-sw.mjs` adds every file in `dist/` to `PRECACHE`, including
   `/staticwebapp.config.json`.
2. Azure consumes that deployment file and correctly returns HTTP 404 for its
   public URL.
3. The worker rejects installation when any precache response is not `ok`.
4. The application silently catches the failed registration.

In a new live browser context, the worker URL appeared during installation,
but after five seconds there was no controller and
`navigator.serviceWorker.getRegistrations()` returned zero registrations. A
partial `graphite-shell-5e4d1ece0027` cache remained. Reloading `/demo` after
switching that context offline failed with `net::ERR_INTERNET_DISCONNECTED`.

This is not a transient network result. The live worker contains
`"/staticwebapp.config.json"`; that URL repeatedly returned HTTP 404 while the
other precache files returned 200. The live worker is byte-identical to the
candidate build.

Impact: the advertised offline demo and real-workspace app shell do not work
for a first-time visitor. Online code exploration still works, so this is
major rather than blocking.

Required repair: exclude deployment-only files such as
`staticwebapp.config.json` from the precache, or use an explicit public-asset
manifest. Add a production-like claim fixture where the Azure configuration
file is not publicly served, then prove both a direct-demo offline reload and
a real-workspace shell reload in fresh contexts.

## Demo and data isolation

The online one-click demo otherwise passes.

- The desktop and phone actions opened five files, 12 symbols, 10
  relationships, four focus nodes, and source containing `createServer`.
- Selecting `healthCheck` updated the graph and source while the persistent
  **Demo — sample data, nothing is saved** label remained visible.
- **Reset demo** restored `boot` and the original counts.
- A seeded production localStorage sentinel remained unchanged.
- Demo traffic contained zero cross-origin requests.
- **Start for real** discarded the sample workspace and returned to the folder
  intake.
- The separate offline part fails as described in F-5-1.

No real user code or production data was opened or changed.

## Normal, invalid, boundary, and recovery paths

| Check | Result |
| --- | --- |
| Synthetic TypeScript, Python, and Go input | Passed; a populated real workspace opened. |
| Malformed Graphite JSON | Passed; the specific error appeared, then **Try another folder** opened `recovered.ts`. |
| 2,000,001-byte source file | Passed; the no-supported-files error appeared. |
| 5,001 supported files | Passed; the all-or-nothing folder error appeared with no workspace. |
| Empty license form | Passed; the form asked for a license token. |
| Demo reset and exit | Passed online with the production sentinel unchanged. |
| Offline demo and shell | **Failed; see F-5-1.** |

The clean claim suite also covers import/export round trips, recorded valid and
revoked license responses, search privacy, exact and estimated resolution,
and review-packet output.

## Declared claims

A clean detached checkout at the implementation candidate used Node
`v22.23.2`, npm `10.9.8`, and the documented `npm ci` prerequisite. All 40
declared commands were run separately and returned zero. Registry integrity
also passed: 40 unique IDs, exactly one matching `@claim:<id>` tag per ID, and
no unregistered tags.

| Claim | Command result | Claim | Command result |
| --- | --- | --- | --- |
| `open-codebase` | PASS | `navigate-code` | PASS |
| `source-stays-local` | PASS | `supported-languages` | PASS |
| `no-account` | PASS | `memory-only` | PASS |
| `ignored-folders` | PASS | `graph-depths` | PASS |
| `json-roundtrip` | PASS | `free-core` | PASS |
| `asset-provenance` | PASS | `tree-sitter-browser` | PASS |
| `heuristic-resolution` | PASS | `resolution-limits` | PASS |
| `exact-local-resolution` | PASS | `cross-file-resolution` | PASS |
| `five-file-demo` | PASS | `input-methods` | PASS |
| `demo-reset` | PASS | `demo-isolation` | PASS |
| `workspace-tools` | PASS | `relationship-list-a11y` | PASS |
| `keyboard-navigation` | PASS | `offline-reload` | PASS locally, false live |
| `file-size-limit` | PASS | `folder-file-limit` | PASS |
| `folder-error-recovery` | PASS | `no-third-party-runtime` | PASS |
| `build-contract` | PASS | `mit-license` | PASS |
| `test-contract` | PASS | `team-purchase` | PASS |
| `team-license-privacy` | PASS | `revoked-license` | PASS |
| `review-packet-export` | PASS | `route-contract` | PASS |
| `mobile-panes` | PASS | `mobile-targets` | PASS |
| `search-stays-local` | PASS | `real-workspace-offline` | PASS locally, false live |

The two offline tests are incomplete because the local preview serves the
deployment configuration as an ordinary static file. Their green results do
not establish the public behavior on Azure. No other unlisted or incomplete
public claim was found.

## Quality and performance

- `npm ci`: passed; 62 packages installed and zero vulnerabilities reported.
- `npm test`: passed; 8 unit tests and 47 browser tests.
- `npm run build`: passed and produced `dist/`.
- Entry JavaScript: 43.54 KB raw / 15.54 KB gzip.
- Lazy parser JavaScript: 67.15 KB raw / 16.45 KB gzip.
- CSS: 24.70 KB raw / 6.06 KB gzip.
- Landing image: 110,574 bytes.
- Fresh live Lighthouse mobile artifact: Performance 99, Accessibility 100,
  Best Practices 100, SEO 100; LCP 1.6 s, TBT 80 ms, CLS 0.

The build's existing `web-tree-sitter` browser-external and dependency `eval`
warnings remain non-fatal. No first-load size budget failed.

## Accessibility, keyboard, mobile, and routes

- The factory URL verifier passed HTTPS, title, `lang="en"`, one h1, main,
  image alt text, labelled buttons, and home-page console checks.
- Live Playwright axe scans reported zero WCAG 2 A/AA violations on desktop
  Home and Demo, phone Home and Demo, Privacy, Terms, direct Demo, and 404.
- The skip link moved focus to the page h1. Client navigation and browser Back
  moved focus to the new route h1.
- The Team dialog moved focus to Close and returned it to its opener.
- Removing a saved test license cleared both product license keys.
- Phone Symbols, Graph, Source, then Graph panes all appeared correctly. `/`
  focused Search. No visible phone target was below 44 × 44 CSS pixels.
- Reduced motion set document scrolling to `auto` and graph transitions to
  0.01 ms. There is no flashing or autoplay.
- At 200% browser page scale, the home h1 and both first actions remained
  visible; the demo banner, reset/exit actions, and all three tabs remained
  available.
- Home, Demo, Privacy, and Terms returned 200 with distinct titles. The unknown
  `/review-5-missing` URL deliberately returned HTTP 404 and rendered the
  complete Graphite recovery page. That expected 404 is not a defect.
- All rendered internal links returned their intended status. The privacy
  `mailto:` link is intentional; the Team checkout passed its declared claim.

## Privacy, security, and deployment parity

The free demo made same-origin requests only and did not alter the seeded
production sentinel. The clean claim tests inspect marked source, indexes,
searches, browser storage, and license-verification requests. Live headers
include HSTS, CSP, `nosniff`, strict referrer policy, and restrictive camera,
microphone, and geolocation policy. Hashed assets are immutable for one year,
grammar WASM revalidates after one week, and `sw.js` is not cached.

| Artifact | Candidate and live SHA-256 |
| --- | --- |
| `index.html` | `d7ae465bd2fe2591d591304f1df635ed936a483b399becb0ec5e28bf20629184` |
| `404.html` | `bc837c595eecddec1f27f50e31a952dbde05ae1eacf7ca2d2cf88ef4977e7fbb` |
| `sw.js` | `7dbc7d8d08d4b79ad2ced936390a53f4c95487629ad5ba5810f50c448f45eca4` |
| Entry JavaScript | `cc28fe239dda3e35fecbfff226f95c710123636ae6425acde40e222b61c47acd` |
| Entry CSS | `5a03c4a119a541a108569eaeb897129b99ebc4f290953ee46993403b5c92e4ae` |
| Landing image | `de43edabb34c2f5211e34c648beb99ee095081b36977cfd9abb24e0e55ab1367` |

## Earlier finding disposition

All earlier review, polish, verification, and handoff reports were inspected,
including minor findings.

| Earlier finding group | Current disposition |
| --- | --- |
| Review 1 B1 phone panes | Fixed; live phone pane sequence passes. |
| Review 1 B2 demo sandbox | Storage isolation, direct entry, label, reset, and exit remain fixed. Its offline part is reopened by F-5-1. |
| Review 1 B3 audience/action | Fixed on fresh desktop and phone first screens. |
| Review 1 B4 claim registry | Registry/tag integrity is fixed. The two offline outcomes remain incomplete for production under F-5-1. |
| Review 1 B5 unknown route | Fixed; the live designed page returns deliberate HTTP 404. |
| Review 1 B6 checkout | Fixed; the declared live Dodo checkout claim passes. |
| Review 1 M7 metadata/focus/footer/structure | Fixed and retained live. |
| Review 1 M8 copy/terminology | Fixed and retained. |
| Review 2 F-2-1 through F-2-10 | Fixed for phone input, targets, claim outcomes, resolution, build/license inventory, and Team packet. |
| Verification P1 stale service worker | **Reopened by F-5-1:** the current worker cannot install on Azure, so its update policy cannot operate in a fresh browser. |
| Verification P1 5,000-file boundary | Fixed; live and clean tests reject 5,001 files without a partial workspace. |
| Verification P3 grammar cache | Fixed; live WASM uses one-week revalidation. |
| Review 4 F-4-1 recovery | Fixed; live malformed-index recovery reaches a real populated workspace. |
| Review 4 F-4-2 six claim gaps | Recovery, payment terms, license privacy/revocation, and search coverage are fixed. Offline coverage is reopened by F-5-1. |
| Review 4 F-4-3 soft 404 | Fixed; the live response is HTTP 404. |
| Review 4 F-4-4 indirect headings | Fixed; current task headings use plain words. |
| Verification 4 PASS | Superseded only for the fresh-live offline result; its other checked dispositions were reproduced. |

## Scope and evidence

This is a static web product. Backend tenant isolation, restart persistence,
health endpoints, and product-owned 429/Retry-After behavior do not apply. It
has no CLI, library, desktop artifact, or runtime AI feature. No additional AI
or sync step is implied by the local-first brief; JSON import/export and the
review packet cover the useful sharing paths.

Evidence is under `/work/.evidence/review-5/`, including claim logs, clean test
and build logs, live screenshots, axe/route summaries, header and parity
records, Lighthouse JSON, and `live-offline-failure.json`.

## Final result

**FAIL — one major finding and two incompletely tested public claims remain.**

