# Adversarial first-read review 3 — Graphite

**Verdict: PASS**

Reviewed 2026-08-28 against commit
`d7e4f9550127095d5d53ccbfed6b6386677d5d17` and the live site at
`https://code-graph-explorer.sociobot.in`. This round found zero blocking,
major, or minor findings and no untested claim.

## First 30 seconds

Fresh Chromium contexts opened the live home page at 390 × 844 and 1440 ×
900. Nothing was scrolled before these answers were recorded.

| Question | Cold-read answer |
| --- | --- |
| What does it do? | It traces calls, imports, and source through an unfamiliar local codebase. |
| For whom? | Engineers onboarding to, debugging, or refactoring unfamiliar code. |
| What should I click first? | **Try it with sample data** to open an already-mapped five-file server codebase. |

The exact first-screen copy is “Trace calls through an unfamiliar codebase,”
“For engineers onboarding, debugging, or refactoring, see calls, imports, and
source in one local workspace,” and “Try it with sample data.” The action,
outcome note, and privacy/offline/price facts all fit above 797 CSS pixels on
the 844-pixel phone viewport. The same information is visible at desktop size.

## Findings

None. There are no `F-3-k` entries because this review found nothing requiring
a product change.

## Copy audit

Counts are whitespace-delimited; hyphenated terms count as one word. The audit
also includes headings, labels, actions, alt text, and dialog copy so the
button, terminology, and out-of-context-heading checks are explicit. No item
exceeds 22 words, no banned marketing adjective appears, terminology is
consistent, headings make sense in context, and actions name their result.
Technical terms such as “code graph,” “JSON,” “SPA,” and “service worker” are
appropriate for the engineer or deployer reading them.

### Live landing page

| ID | Words | Exact copy | Flag |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | None |
| L02 | 4 | Graphite / code graph | None |
| L03 | 1 | Demo | None; navigation link |
| L04 | 1 | Privacy | None; navigation link |
| L05 | 3 | View Team export | None |
| L06 | 5 | Local code graph / v1.2.0 | None |
| L07 | 6 | Trace calls through an unfamiliar codebase. | None |
| L08 | 15 | For engineers onboarding, debugging, or refactoring, see calls, imports, and source in one local workspace. | None |
| L09 | 5 | Try it with sample data | None |
| L10 | 3 | Open a folder | None |
| L11 | 7 | See a five-file server codebase already mapped. | None |
| L12 | 6 | Your source stays in this browser. | None |
| L13 | 8 | The demo opens offline after your first visit. | None |
| L14 | 4 | Local graphs are free. | None |
| L15 | 6 | Team review export costs $24 once. | None |
| L16 | 15 | Abstract halftone map of paper source files connected by red, blue, and black graph nodes | None; meaningful alt text |
| L17 | 2 | Plate 01 | None; figure label |
| L18 | 8 | A codebase shown as linked functions and imports. | None |
| L19 | 5 | 01 / Open a codebase | None |
| L20 | 3 | Open your codebase | None |
| L21 | 7 | Graphite reads selected files in browser memory. | None |
| L22 | 7 | It skips named dependency and build folders. | None |
| L23 | 4 | Drop a folder here | None |
| L24 | 6 | Press Enter to choose a folder. | None |
| L25 | 2 | Already indexed? | None |
| L26 | 4 | Import a Graphite index | None |
| L27 | 3 | Choose code files | None; input accessible name |
| L28 | 4 | Choose Graphite JSON index | None; input accessible name |
| L29 | 4 | 02 / Working view | None |
| L30 | 6 | Follow one function at a time | None |
| L31 | 13 | Select a function to see callers, callees, imports, and its source location together. | None |
| L32 | 9 | Preview showing boot linked to createServer, loadConfig, and start | None; preview accessible name |
| L33 | 3 | 03 / Method | None |
| L34 | 5 | How Graphite maps a codebase | None |
| L35 | 3 | Open a folder. | None |
| L36 | 7 | Choose supported source files from your device. | None |
| L37 | 3 | Select a function. | None |
| L38 | 7 | Move through linked calls, imports, and source. | None |
| L39 | 3 | Export the index. | None |
| L40 | 9 | Save the code graph as a local JSON file. | None |
| L41 | 3 | 04 / Boundaries | None |
| L42 | 6 | Know what the graph cannot prove | None |
| L43 | 9 | Cross-file matches are estimates and carry a visible label. | None |
| L44 | 8 | Dynamic calls can be absent from the graph. | None |
| L45 | 16 | No analytics, accounts, hosted source index, external fonts, or third-party scripts run in the free workflow. | None |
| L46 | 8 | Read the privacy details or read the terms. | None |
| L47 | 4 | 05 / Team export | None |
| L48 | 8 | Send a review packet, not raw graph data | None |
| L49 | 14 | Export the focused symbol, source location, and visible relationships as one standalone HTML file. | None |
| L50 | 1 | $24 | None |
| L51 | 6 | One-time Team license for one user. | None |
| L52 | 3 | View Team export | None |
| L53 | 10 | Local exploration, accessibility features, and Graphite index export stay free. | None |
| L54 | 6 | Trace calls through a local codebase. | None |
| L55 | 3 | Original generated illustration. | None |
| L56 | 1 | Privacy | None; footer link |
| L57 | 1 | Terms | None; footer link |
| L58 | 4 | Built by Param Factory | None |
| L59 | 1 | v1.2.0 | None |
| L60 | 4 | Close Team export dialog | None; accessible name |
| L61 | 3 | Team review export | None |
| L62 | 5 | Share the path you traced | None |
| L63 | 15 | Team adds a standalone HTML packet for the focused symbol, source location, and visible relationships. | None |
| L64 | 1 | $24 | None |
| L65 | 5 | One-time purchase for one user | None |
| L66 | 4 | Buy Team at checkout | None |
| L67 | 3 | Have a license? | None |
| L68 | 3 | Paste it here | None |
| L69 | 2 | Verify license | None |
| L70 | 3 | Sociobot handles checkout. | None |
| L71 | 9 | Dodo is the merchant of record and handles refunds. | None |
| L72 | 1 | Privacy | None; dialog link |
| L73 | 1 | Terms | None; dialog link |

### README

| ID | Words | Exact copy | Flag |
| --- | ---: | --- | --- |
| R01 | 1 | Graphite | None; document title |
| R02 | 16 | Graphite is a browser-based code graph for engineers onboarding to, debugging, or refactoring an unfamiliar codebase. | None |
| R03 | 14 | Open a codebase and move between functions, calls, imports, and source without uploading files. | None |
| R04 | 7 | Try the isolated five-file demo at `https://code-graph-explorer.sociobot.in/?demo=1`. | None |
| R05 | 8 | Reset restores the bundled files and selected function. | None |
| R06 | 12 | Start for real discards the demo and returns to the folder intake. | None |
| R07 | 4 | What Graphite can inspect | None |
| R08 | 10 | Graphite parses TypeScript/TSX, JavaScript/JSX, Python, and Go in the browser. | None |
| R09 | 15 | Search functions and files, then open a two-level code graph, relationship list, or source reference. | None |
| R10 | 8 | Import or export a Graphite index as JSON. | None |
| R11 | 19 | A $24 one-time Team license exports a standalone HTML review packet for one focused symbol and its visible relationships. | None |
| R12 | 4 | Press `/` to search. | None |
| R13 | 11 | Use arrow keys to move between graph nodes and pane tabs. | None |
| R14 | 9 | The demo opens offline after the first online visit. | None |
| R15 | 3 | Accuracy and limits | None |
| R16 | 8 | A same-file call resolves to the same-file definition. | None |
| R17 | 10 | Cross-file calls resolve through named imports or a unique definition. | None |
| R18 | 11 | Ambiguous names stay unresolved, and cross-file matches are labelled as estimates. | None |
| R19 | 8 | Dynamic calls can be absent from the graph. | None |
| R20 | 13 | Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`, `coverage`, or `__pycache__` are ignored. | None |
| R21 | 6 | Files over 2 MB are ignored. | None |
| R22 | 14 | Folders with more than 5,000 supported files are rejected without keeping a partial codebase. | None |
| R23 | 3 | Privacy and access | None |
| R24 | 10 | Selected source and the active index stay in browser memory. | None |
| R25 | 15 | The free workflow uses no account, analytics, hosted source index, external fonts, or third-party scripts. | None |
| R26 | 13 | The app files are cached for offline use, but opened source is not. | None |
| R27 | 8 | Local exploration and Graphite index export are free. | None |
| R28 | 8 | No paid purchase is required for these tools. | None |
| R29 | 7 | Team costs $24 once for one user. | None |
| R30 | 7 | It adds standalone local HTML review-packet export. | None |
| R31 | 10 | Sociobot handles checkout, with Dodo as the merchant of record. | None |
| R32 | 4 | See Privacy and Terms. | None |
| R33 | 3 | Run Graphite locally | None |
| R34 | 16 | `npm test` runs the unit and Playwright browser suites, including claim, mobile, offline, and accessibility checks. | None |
| R35 | 13 | `npm run build` type-checks the app and writes the static artifact to `dist/`. | None |
| R36 | 4 | Deploy the static artifact | None |
| R37 | 9 | Deploy the `dist/` folder to Azure Static Web Apps. | None; instruction |
| R38 | 16 | The repository includes the SPA fallback, security headers, cache rules, service worker, sitemap, and robots file. | None |
| R39 | 10 | Do not deploy billing, DNS, or infrastructure from this repository. | None; instruction |
| R40 | 1 | License | None |
| R41 | 1 | MIT. | None |
| R42 | 2 | See LICENSE. | None |

Terminology is stable: **codebase** is the input, **folder** is the selection
action, **code graph** is the visualization, **Graphite index** is JSON,
**review packet** is HTML, **demo** is the isolated mode, and **sample data**
is its bundled content.

## Demo and sandbox verification

- `/demo` and `/?demo=1` enter the five-file server workspace directly with
  12 symbols, 10 relationships, source, graph nodes, and an estimated-match
  label already visible.
- The persistent banner reads “Demo — sample data, nothing is saved” and
  exposes **Reset demo** and **Start for real**.
- After selecting `createServer`, Reset restored five files and selected
  `boot`. Start for real removed the workspace and returned to folder intake.
- Seeded production license keys, local/session storage, IndexedDB, OPFS, and
  Cache Storage sentinels remained unchanged. Demo displayed only the sample
  preview, not paid real-data export.
- The entire live demo flow made same-origin GET requests only. After the
  first visit, a fully offline reload rebuilt the five-file `boot` workspace.

## Claims

The clean clone was `/tmp/code-graph-review3.IbarxT/repo` at
`d7e4f9550127095d5d53ccbfed6b6386677d5d17`. The registry has 35 unique IDs;
each tag occurs exactly once. Every exact `test` command was run separately.

| Claim ID | Result | Claim ID | Result |
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
| `team-purchase` | PASS | `review-packet-export` | PASS |
| `route-contract` | PASS | `mobile-panes` | PASS |
| `mobile-targets` | PASS |  |  |

Cross-checking the live landing page and README found no unlisted claim. The
privacy assertion uses uniquely marked real source and inspects request URLs,
bodies and methods plus localStorage, sessionStorage, IndexedDB, OPFS, and
Cache Storage. The checkout test follows the live endpoint to the matching
Dodo product and price.

## Earlier finding audit

Every prior review, polish report, verification report, and handoff was read.
Polish reports introduced no new finding IDs; their repair statements are
covered by the checks below.

| Earlier finding | Live and code confirmation | Status |
| --- | --- | --- |
| Review 1 B1 — phone panes | Live Symbols → Graph → Source → Graph bounds and `@claim:mobile-panes` pass at 390 px. | Fixed |
| Review 1 B2 — demo sandbox | Direct route, banner, reset, exit, offline seed, and production-storage isolation pass live and in tagged tests. | Fixed |
| Review 1 B3 — audience/action | Audience, job, primary sample action, result note, and facts are visible without scrolling at both sizes. | Fixed |
| Review 1 B4 — missing claims registry | 35 unique registry entries map one-to-one to 35 tags; all commands pass. | Fixed |
| Review 1 B5 — unknown routes | A styled 404 has its own title, h1, canonical, return action, and shared shell. | Fixed |
| Review 1 B6 — dead checkout | The live Sociobot URL resolves to Dodo with “Graphite Team review packet” at $24.00. | Fixed |
| Review 1 M7 — structure/metadata/focus/footer | Route metadata, shell, skeleton, footer, history focus, and legal links pass live. | Fixed |
| Review 1 M8 — copy/terms | The full audit above has no length, banned-word, jargon, terminology, heading, or action failure. | Fixed |
| Review 2 F-2-1 — phone `/` shortcut | From the default Graph pane, `/` opens Symbols and focuses Search; the 390-pixel claim passes. | Fixed |
| Review 2 F-2-2 — partial claim assertions | Marked-source privacy, TSX/JSX, all ignored folders, tab arrows, import graph, and narrowed dynamic-call tests pass. | Fixed |
| Review 2 F-2-3 — phone target size | Every visible phone workspace target passes the 44 × 44 CSS-pixel test. | Fixed |
| Review 2 F-2-4 — local resolution claim | `exact-local-resolution` is registered and passes its duplicate-name fixture. | Fixed |
| Review 2 F-2-5 — cross-file rule | `cross-file-resolution` verifies named import, unique definition, and unresolved ambiguity. | Fixed |
| Review 2 F-2-6 — test inventory | `test-contract` is registered; full `npm test` ran 8 unit and 41 browser tests. | Fixed |
| Review 2 F-2-7 — environment claim | The unproved environment sentence remains removed. | Fixed |
| Review 2 F-2-8 — deployment inventory | `build-contract` checks fallback, headers, cache route, worker, sitemap, and robots. | Fixed |
| Review 2 F-2-9 — MIT claim | `mit-license` matches README and Terms to the checked-in license. | Fixed |
| Review 2 F-2-10 — Team packet | Live checkout and the tested local HTML packet now fulfill the brief. | Fixed |
| Verification P1 — stale service worker | The generated release worker, offline reload test, and live/local `sw.js` hash parity pass. | Fixed |
| Verification P1 — 5,000-file bypass | The 5,001-file all-or-nothing test passes. | Fixed |
| Verification P3 — short WASM cache | The build contract sets one-week `must-revalidate` caching for `/wasm/*`. | Fixed |

## Structure, accessibility, and visual identity

- Home, Demo, Privacy, Terms, and 404 have distinct compliant titles, one h1,
  descriptions, route canonicals, OG/Twitter data, favicons, landmarks, and a
  consistent header/footer. Browser Back and Forward focus the new h1.
- Every crawled internal link returned 200; the external checkout returned 200
  after redirect. Hash and `mailto:` links are intentional.
- Live axe WCAG 2 A/AA scans on all five routes returned zero violations. The
  live URL verifier found no console errors, missing alt text, or unlabelled
  buttons. Reduced motion and mobile target assertions pass.
- The graphite-paper broadside, halftone code map, hard rules, registration
  shadows, narrow type, and drafting-table workspace form a distinct identity,
  not a generic SaaS layout. Provenance is recorded in `.factory/design.md`.
- The landing follows the required order: shell, first screen, working preview,
  three-step method, limitations/privacy, paid tier, and footer.

## Build and runtime evidence

- `npm ci`: passed with zero vulnerabilities.
- Every registry command: 35/35 passed independently.
- `npm test`: passed — 8 Vitest tests and 41 Playwright tests.
- `npm run build`: passed and produced `dist/`; entry JavaScript is 43.42 KB
  raw / 15.65 KB gzip and the lazy parser is 67.15 KB raw / 16.53 KB gzip.
- Live and clean-build SHA-256 match for `index.html`
  (`26bd385d...d25cefd`) and `sw.js` (`dc2c20b7...d626f`).
- `verify-url.sh`: HTTPS 200, one h1, `lang`, main, alt text, labelled buttons,
  and zero console errors.

## Missed leverage

No finding. The brief-implied import/export and collaboration loop are present:
Graphite imports and exports its JSON index, and Team exports a standalone HTML
review packet. Sync would conflict with the local-first promise. An AI step is
not an obvious requirement for deterministic code navigation, and no decorative
AI or embedded provider key is present.

## What would make this perfect

Nothing remains within the brief, product contract, or review checklist. No
copy, demo, claim, route, accessibility, privacy, visual-system, or missed-
leverage change is required from this round.
