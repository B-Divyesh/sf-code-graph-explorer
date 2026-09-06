# Review 4 — Trace calls through an unfamiliar codebase

**Verdict: FAIL**

Reviewed on 2026-09-06 at
`https://code-graph-explorer.sociobot.in`.

- Implementation candidate: `7a7013df7940840bff2792fa64f044ece0b97139`
- Documentation baseline: `cb7b576f1ba6a0654e484e883aa3101264f477fb`
- Findings: **4** — 2 major and 2 minor
- Untested or incompletely tested public claims: **6**

The commits after `7a7013d` only changed review and deployment documents.
A clean build from the documentation baseline produces the same product bytes
as the implementation candidate and the live deployment.

## Job, audience, and first action before scrolling

Fresh Chromium contexts opened the home page at 1440 × 900 and 390 × 844.
Nothing was scrolled before recording these answers.

| Question | Answer from the first screen |
| --- | --- |
| What is the job? | Trace calls, imports, and source through an unfamiliar local codebase. |
| Who is it for? | Engineers onboarding to, debugging, or refactoring unfamiliar code. |
| What should they do first? | Select **Try it with sample data** to open an already mapped five-file server codebase. |

The headline, audience sentence, action, outcome note, and three facts are
visible on both screens. On the phone, the sample action ends at 588 CSS
pixels and the facts end inside the 844-pixel viewport.

## Findings

### F-4-1 — Major — “Try another folder” does nothing when the directory picker is unavailable

After malformed JSON, an oversized file, or a folder over the file limit, the
error page offers **Try another folder**. That page has no folder input. Its
handler calls `openFolder` with no fallback element.

In a fresh 390 × 844 browser with `showDirectoryPicker` unavailable, clicking
the button produced no file chooser, changed no route, and left the same error
heading focused. The error page contained zero `[data-folder-input]` elements.
This affects browsers and phone environments that use the documented folder
file-input path. **Open sample** still recovers correctly.

Why it matters: the primary recovery action fails after a normal input error.
The current boundary tests assert the error text but never operate this button.

Fix: include the labelled folder input on every error screen, or return to the
folder intake before opening it. Add a browser test with
`showDirectoryPicker` removed that causes each error, operates **Try another
folder**, selects a valid file, and reaches the workspace.

### F-4-2 — Major — The claim suite leaves six public promises unproved

All 35 declared commands pass, but green commands do not cover every public
promise. The remaining claim gaps are:

| Public promise | Gap |
| --- | --- |
| **Try another folder** | No claim entry or recovery test; the fallback path currently fails as described in F-4-1. |
| “Team costs $24 once for one user” | `team-purchase` asserts `$24`, the checkout product, and the Dodo redirect. It does not assert “once” or “one user.” |
| The Privacy page says the Team license and last verdict persist in localStorage and only the license is sent for verification. | No registered test reloads to prove token persistence or inspects the verification request to prove that only the license is sent. |
| “Dodo … handles refunds” and “Refunds … revoke the license” | No claim entry or recorded revoked-license/refund fixture proves either statement. |
| The Privacy page says searches are not uploaded. | The marked-source privacy test does not perform a search. The same-origin test selects a symbol but does not search. |
| A real workspace says “Available offline after this visit.” | The registered offline claim and test are limited to the demo. No claim defines what remains available for a real workspace. |

The live invalid-license check did observe one GET to the Sociobot verification
URL with no request body, and the free workflow remained available. That is
useful review evidence, but it is not a repeatable claim test in the repository.

Fix: narrow copy where needed and add one tagged test for each retained
promise. The purchase test must assert the exact one-time, one-user terms. The
license privacy test must inspect request URL/body and reload storage. Add a
revoked-license fixture. Search while recording requests. Either limit the
workspace status to the tested demo or add a real-workspace offline test.

### F-4-3 — Minor — Unknown URLs are soft 404s

`/review-4-missing` renders a complete not-found screen with the title
“Page not found — Graphite,” one h1, Home and sample actions, and no console or
axe errors. However, the live HTTP response is **200**, byte-identical to the
home HTML. The static configuration has no `responseOverrides.404`, and there
is no `404.html` artifact.

Why it matters: browsers and people see the right recovery page, but crawlers,
caches, and link checkers are told that an unknown URL is valid. The site
structure contract expects a deliberate HTTP 404 and a designed page.

Fix: ship the designed not-found artifact and configure Azure Static Web Apps
to return status 404 for unknown paths. Retest the response status and the
visible recovery actions.

### F-4-4 — Minor — Four headings or labels use theme copy instead of plain task words

The required plain-words rule disallows metaphor and decorative labels. These
current strings do not name the task directly:

- “Drawing &lt;codebase&gt;” while indexing
- “Share the path you traced” in the Team dialog
- “This page is not in the graph” on the not-found page
- “Plate 01” under the landing illustration

Fix: use “Indexing &lt;codebase&gt;,” “Export a review packet,” and “Page not
found.” Remove “Plate 01” or replace it with a useful label such as “Code graph
example.”

## Demo and data isolation

The one-click sample otherwise passes its contract.

- Home and `/demo` open five TypeScript files with 12 symbols and 10
  relationships. `boot` is selected with three visible heuristic calls.
- The banner “Demo — sample data, nothing is saved” remains visible after
  search, selection, pane changes, and export.
- Selecting `healthCheck` exposes its symbol and source. **Reset demo** restores
  `boot` and all five files.
- The sample review packet downloads as `boot-review.html`.
- **Start for real** discards the workspace and returns to the folder intake.
- Seeded localStorage, sessionStorage, IndexedDB, and OPFS sentinels were
  unchanged. The demo made same-origin GET requests only.
- No real codebase or user data was used or changed during review.

## Normal, invalid, boundary, and recovery checks

| Check | Result |
| --- | --- |
| Synthetic TypeScript, Python, and Go files | Passed: 3 files, 7 symbols, and 1 relationship opened in the real intake. |
| Malformed Graphite JSON | Passed error detection with a specific parse message. **Open sample** recovered; **Try another folder** failed in the fallback environment. |
| 2,000,001-byte TypeScript file | Passed: “No supported files found.” The same retry defect remains. |
| 5,001 supported files | Passed: all-or-nothing “Folder is too large,” no partial workspace. The same retry defect remains. |
| Empty license form | Passed: “Paste a license token first.” |
| Invalid license | Passed: clear inactive notice; free tools stayed available. |
| Sample reset and exit | Passed with storage sentinels unchanged. |
| Offline demo reload | Passed after service-worker control; the full demo reopened with the offline status. |

This is a static web product. Backend tenant isolation, server restart
persistence, health endpoints, and product-owned 429 behavior do not apply.
There is no CLI, library, or desktop artifact to install in a consumer project.

## Declared claim commands

The clean checkout was created at documentation SHA `cb7b576`. It used Node
`v22.23.2`, npm `10.9.8`, and the documented `npm ci` prerequisite. Every exact
command in `.factory/claims.json` was run separately.

| Claim | Result | Claim | Result |
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
| `keyboard-navigation` | PASS | `offline-reload` | PASS |
| `file-size-limit` | PASS | `folder-file-limit` | PASS |
| `no-third-party-runtime` | PASS | `build-contract` | PASS |
| `mit-license` | PASS | `test-contract` | PASS |
| `team-purchase` | PASS, incomplete | `review-packet-export` | PASS |
| `route-contract` | PASS | `mobile-panes` | PASS |
| `mobile-targets` | PASS |  |  |

Registry integrity also passes: 35 unique IDs and one matching tag per ID.
F-4-2 explains why passing commands still leave six untested promises.

## Full build and test results

- `npm ci`: passed; 62 packages installed, zero reported vulnerabilities.
- `npm test`: passed; 8 unit tests and 41 browser tests.
- `npm run build`: passed and produced `dist/`.
- Entry JavaScript: 43.42 KB raw / 15.55 KB gzip.
- Lazy parser JavaScript: 67.15 KB raw / 16.45 KB gzip.
- CSS: 24.70 KB raw / 6.06 KB gzip.
- Landing image: 110.57 KB.

The build emitted the existing `web-tree-sitter` notices about browser
externalized `fs`/`path` modules and dependency `eval`; it completed normally.

## Live accessibility, keyboard, mobile, and performance

- The factory URL verifier passed: HTTPS 200, title, `lang="en"`, one h1,
  main landmark, image alt text, labelled buttons, and zero console errors.
- Live axe WCAG 2 A/AA scans on Home, Demo, Privacy, Terms, and the not-found
  page found zero violations.
- The skip link receives a 3-pixel cobalt focus outline. Client navigation and
  Back move focus to the route h1.
- On the 390-pixel demo, `/` opens Symbols and focuses Search. Pane-tab and
  graph-node arrow behavior passed in the full browser suite.
- Every visible phone workspace target measured at least 44 × 44 CSS pixels.
- Reduced motion sets document scrolling to `auto` and graph transitions to
  0.01 ms. No flashing or autoplay content exists.
- The single light theme has no horizontal overflow at 390 pixels. Axe found
  no contrast failures.
- At 200% zoom, the headline, both first actions, demo banner, reset/exit
  actions, and all three workspace tabs remained present and reachable.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.7 s, CLS 0, TBT 70 ms.

## Privacy, security, links, and routes

- The free demo emitted same-origin GETs only and no console or page errors.
- The invalid-license action sent one explicit GET to the documented Sociobot
  verification endpoint with no body. No credential value was recorded.
- Home, Demo, Privacy, Terms, and the visible not-found state have distinct
  titles, one h1, main content, canonical metadata, and shared navigation.
- Every rendered internal link returned 200. The checkout resolved to the Dodo
  checkout origin with the Graphite product and $24.00 price. The privacy
  `mailto:` link is intentional.
- Live headers include HSTS, CSP, `nosniff`, strict referrer policy, and
  restrictive camera, microphone, and geolocation policy.
- Hashed assets are immutable for one year, grammar WASM revalidates after one
  week, and `sw.js` is no-cache.

## Live deployment parity

The live deployment matches the clean build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `26bd385d56605e8e959672466c3c2e5fef9e3abed2e5ec7e1cb2e0729d25cefd` |
| `sw.js` | `dc2c20b7bedf0ae921255837892aabc747af44069eeef2fe012697b97e9d626f` |
| Entry JavaScript | `52446126db7e1d96c5aef1076514eaf7c15b0565124c524a22ca7750153e7989` |
| Parser JavaScript | `77fd578ddda07567707b422194057e69322860a9bb60ca7579a8de949410b188` |
| CSS | `5a03c4a119a541a108569eaeb897129b99ebc4f290953ee46993403b5c92e4ae` |
| TypeScript grammar | `8515404dceed38e1ed86aa34b09fcf3379fff1b4ff9dd3967bcd6d1eb5ac3d8f` |

The service worker contains the release-derived cache name, old-cache cleanup,
network-first navigation, skip-waiting message handling, and client claiming.
Its live parity and the offline reload prove that the earlier stale-worker fix
remains deployed.

## Earlier finding disposition

Every earlier review, polish, verification, and handoff report was inspected.

| Earlier finding | Current evidence | Disposition |
| --- | --- | --- |
| Review 1 B1 — phone panes | Live phone demo and `mobile-panes` show Symbols, Graph, Source, then Graph correctly. | Fixed |
| Review 1 B2 — demo sandbox | Direct demo, persistent banner, reset, exit, preview, offline reload, and production-storage sentinels pass. | Fixed |
| Review 1 B3 — audience/action | Job, audience, first action, outcome note, and facts fit both first screens. | Fixed |
| Review 1 B4 — claim registry missing | Registry has 35 one-to-one tags and all commands pass. New coverage gaps are F-4-2. | Fixed, with new finding |
| Review 1 B5 — unknown route showed Home | Unknown URLs now show the designed not-found UI. The newly identified HTTP status gap is F-4-3. | Fixed visibly, with new finding |
| Review 1 B6 — dead checkout | Live Sociobot link resolves to the matching Dodo product at $24.00. | Fixed |
| Review 1 M7 — metadata, focus, footer, structure | Required metadata, route focus, landing sequence, shared shell, and footer pass. | Fixed |
| Review 1 M8 — copy and terminology | Length, banned terms, and terminology pass. Newly enforced metaphor failures are F-4-4. | Fixed in part, with new finding |
| Review 2 F-2-1 — phone `/` shortcut | Live default Graph pane switches to Symbols and focuses Search. | Fixed |
| Review 2 F-2-2 — partial claim tests | Marked source, TSX/JSX, ignored folders, tab arrows, import graph, and dynamic-call tests pass. New omissions are F-4-2. | Fixed for the listed cases |
| Review 2 F-2-3 — phone target size | No visible phone workspace target is below 44 × 44 pixels. | Fixed |
| Review 2 F-2-4 — local resolution claim | Registered duplicate-name unit claim passes. | Fixed |
| Review 2 F-2-5 — cross-file rule | Named import, unique definition, and ambiguity claim passes. | Fixed |
| Review 2 F-2-6 — test inventory | `npm test` ran unit, browser, claim, mobile, offline, and axe coverage. | Fixed |
| Review 2 F-2-7 — environment claim | The unproved sentence remains absent. | Fixed |
| Review 2 F-2-8 — deployment inventory | Build artifacts, headers, worker, sitemap, robots, and cache configuration are present. | Fixed |
| Review 2 F-2-9 — MIT statement | Registered MIT file-content claim passes. | Fixed |
| Review 2 F-2-10 — Team packet | Checkout and recorded-license HTML packet flow pass. Purchase/legal claim details remain incomplete under F-4-2. | Fixed in product, claim gap remains |
| Verification P1 — stale service worker | Live worker matches the clean release, cleans old caches, and reopens the demo offline. | Fixed |
| Verification P1 — 5,000-file bypass | Live and declared tests reject 5,001 files with no partial workspace. | Fixed |
| Verification P3 — 30-second grammar cache | Live configuration uses one-week revalidation. | Fixed |

## Missed feature check

No additional AI, sync, or import feature is required. The product already has
the brief’s JSON import/export and shareable HTML review packet. A hosted sync
feature would change the local-first scope. The remaining work is to repair
recovery, make the site return a real 404, use direct headings, and complete
the claim tests.

## Acceptance result

**FAIL.** Four findings and six untested or incompletely tested public claims
remain. A PASS requires all four findings closed and every retained public
promise represented by a complete tagged test.
