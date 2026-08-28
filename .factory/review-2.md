# Adversarial first-read review 2 — Graphite

**Verdict: FAIL**

Reviewed 2026-08-28 against commit
`c79375037a0293acd28749fe22aae8c055b45d5d` and the live site at
`https://code-graph-explorer.sociobot.in`. A pass in this round requires zero
findings and no untested claim. This review found three blocking findings and
seven major findings.

## First 30 seconds

Fresh Chromium contexts opened the live home page at 390 × 844 and 1440 × 900.
Nothing was scrolled before answering these questions.

| Question | Cold-read answer |
| --- | --- |
| What does it do? | It maps calls, imports, and source so I can trace one function through an unfamiliar local codebase. |
| For whom? | Engineers onboarding to, debugging, or refactoring unfamiliar code. |
| What should I click first? | **Try it with sample data** to see a five-file server codebase already mapped. |

This passes at both sizes. The exact first-screen copy is “Trace calls through
an unfamiliar codebase,” “For engineers onboarding, debugging, or refactoring,
see calls, imports, and source in one local workspace,” and “Try it with sample
data.” The primary action, its outcome note, and all three facts end at 784 CSS
pixels on the 844-pixel phone viewport. No first-read blocking finding is
raised.

## Findings, ordered by severity

### F-2-1 — BLOCKING — The advertised search shortcut fails in the default phone demo

**Exact quote/location:** README: “Press `/` to search.” The live workspace
also displays “`/` search” in its status ribbon. On `/demo` at 390 × 844, the
default active pane is Graph. Pressing `/` leaves `document.activeElement` on
`BODY`; it does not focus the search input. The same key works only after the
visitor first opens the Symbols pane. The registry command for
`@claim:keyboard-navigation` passes because it runs at Playwright's desktop
viewport.

**Why this loses or misleads a first-time visitor:** The product advertises a
keyboard action in the current workspace, but its initial mobile state cannot
perform it. This breaks a listed claim and the keyboard baseline on the review's
required phone viewport.

**Concrete fix:** When `/` is pressed below 760 pixels, activate the Symbols
pane, render it, and focus Search on the next frame. Add a 390 × 844 assertion
to `@claim:keyboard-navigation` that begins on Graph, presses `/`, and verifies
the visible Search input is focused. Keep the desktop graph-node and pane-tab
arrow assertions in that same tagged test.

### F-2-2 — BLOCKING — The claim registry is present, but several green tests do not prove their full claims

This is a half-fix of review 1 **BLOCKING 4**. The registry now has 28 unique
IDs and exactly one matching tag per ID, and all 28 listed commands return
success. The following assertions remain narrower than their exact claims:

| Claim quote/location | What the tagged test omits | Concrete fix |
| --- | --- | --- |
| Landing: “Your source stays in this browser.” README: “Selected source and the active index stay in browser memory.” | `@claim:source-stays-local` loads bundled demo text and accepts every same-origin request. A same-origin POST containing source would pass. | Choose a uniquely marked source file through the real input, intercept all requests, assert no request URL/body contains its name or contents, assert no non-GET application request occurs, and inspect localStorage, sessionStorage, IndexedDB, OPFS, and Cache Storage for the marker. |
| README: “Graphite parses TypeScript/TSX, JavaScript/JSX, Python, and Go in the browser.” | `@claim:supported-languages` supplies `.ts`, `.js`, `.py`, and `.go`, but no `.tsx` or `.jsx` fixture. | Add TSX and JSX definitions and assert their extracted symbols. |
| README: “Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`, `coverage`, or `__pycache__` are ignored.” | `@claim:ignored-folders` checks only `node_modules` and `dist`. | Put one supported file in every named folder and assert that only the control file is indexed. |
| README: “Use arrow keys to move between graph nodes and pane tabs.” | `@claim:keyboard-navigation` checks graph-node arrows only. | Assert ArrowLeft/ArrowRight/Home/End on the tablist, focus, selection, and visible pane. |
| Landing/README limitation: dynamic code, reflection, generated files, and complex types can be missed. | `@claim:resolution-limits` covers one `globalThis[name]()` case only. | Add representative reflection/generated/complex-type fixtures or narrow the published list to the tested dynamic-call limitation. |
| Registry: “Opens a codebase into a function and import graph.” | `@claim:open-codebase` counts four nodes and checks source text; it never selects a module or asserts an import relationship. | Assert one visible `import` edge or relationship in a fixture with a resolved relative import. |

**Why this misleads:** A passing command currently looks like evidence for the
whole sentence even where the observable promise was never exercised. The
claims contract requires the test to establish the outcome, not merely a
nearby behavior.

### F-2-3 — BLOCKING — Core phone controls miss the 44 × 44 touch-target baseline

**Exact location/evidence:** In the live 390-pixel workspace, computed visible
target boxes include **Export Graphite index: 194 × 40**, **Depth: 59 × 38**,
and an SVG graph-node button: **70 × 23** CSS pixels. The header Demo link is
39 × 44. Source confirms `.compact { min-height: 40px }`, the Depth select has
`min-height: 38px`, and 180 × 60 graph nodes are scaled from a 1000-unit SVG
viewBox to the phone width.

**Why this loses a first-time visitor:** Export, graph depth, and graph
navigation are core actions. Their phone targets are materially smaller than
the factory's non-negotiable 44-pixel baseline, increasing missed taps even
though axe reports no automated violation.

**Concrete fix:** Give compact controls and selects a minimum 44 × 44 target.
For graph nodes, add an invisible 44-pixel hit area, increase the mobile node
layout scale, or provide the relationship-list buttons as the primary mobile
target. Add a 390-pixel test that measures every visible interactive target and
fails below 44 pixels in either dimension, with only documented WCAG spacing
exceptions if the factory standard is intentionally revised.

### F-2-4 — MAJOR — “Calls within one file use exact names” is an unlisted claim

**Exact quote/location:** README, Accuracy and limits: “Calls within one file
use exact names.” No `.factory/claims.json` entry states this behavior. The
untagged parser test is not a registry entry.

**Why this misleads:** Call accuracy is a result an engineer can rely on when
deciding whether to refactor. It is not covered by the published claim map.

**Concrete fix:** Add `exact-local-resolution` with a same-file fixture that
contains duplicate-looking names in other files and asserts the local call is
resolved to the same-file definition, or remove the sentence.

### F-2-5 — MAJOR — The documented cross-file resolution rule is an unlisted claim

**Exact quote/location:** README: “Cross-file calls use imported or unique
names and are labelled as estimates.” The listed `heuristic-resolution` claim
only says that estimated relationships are labelled, and its test does not
assert the imported-or-unique resolution rule.

**Why this misleads:** The matching rule shapes how much confidence an engineer
should place in the graph. Testing the badge alone does not establish that
rule.

**Concrete fix:** Split this into two sentences and claims: one test for
imported/unique-name resolution, including ambiguous-name rejection, and the
existing visible-label test.

### F-2-6 — MAJOR — The README's test-suite inventory is an unlisted claim

**Exact quote/location:** README, Run Graphite locally: “`npm test` runs unit,
claim, browser, mobile, offline, and accessibility checks.” No claim entry
lists that inventory.

**Why this misleads:** Maintainers may rely on one command for every named
gate. A future script change could silently stop running one category.

**Concrete fix:** Add a `test-contract` claim whose test inspects the npm script
and tagged/spec inventory, or rewrite this as explicit commands without claiming
that one command covers categories it does not verify structurally.

### F-2-7 — MAJOR — “No environment variable is required” is an unlisted claim

**Exact quote/location:** README, Run Graphite locally: “No environment
variable is required.” No registry entry runs the build and primary flow under
a deliberately minimal environment.

**Why this misleads:** This is a setup promise. A new contributor can rely on
it and encounter an undocumented dependency later.

**Concrete fix:** Add `no-required-env` and run build plus demo with application
variables removed, or delete the sentence.

### F-2-8 — MAJOR — The deployment-file inventory is an unlisted compound claim

**Exact quote/location:** README: “The repository includes the SPA fallback,
security headers, cache rules, service worker, sitemap, and robots file.” The
`build-contract` test checks three output files and one WASM cache rule. It does
not assert the sitemap, robots file, fallback, or the named security headers.

**Why this misleads:** A deployer can rely on this inventory, while the green
claim would survive deletion or regression of several listed items.

**Concrete fix:** Expand `build-contract` to assert every named artifact and
configuration value, and change its registry claim to match the README; or
split the sentence into separately tested claims.

### F-2-9 — MAJOR — The README's MIT statement is not in the claim registry

**Exact quote/location:** README, License: “MIT.” The repository does contain
an MIT `LICENSE`, but no claim entry binds the public statement to that file.

**Why this matters:** Licensing is a statement users and adopters rely on.
The claim audit explicitly requires every reliance-worthy statement to be
listed, even when it is easy to verify.

**Concrete fix:** Add `mit-license` with a file-content/SPDX assertion, or make
the LICENSE link the only statement and exclude legal metadata explicitly in
the claim-policy documentation.

### F-2-10 — MAJOR — The brief's shareable Team review packet is still absent

**Exact location:** `.factory/brief.json` specifies “a one-time Team license
unlocks local review-packet export.” The live Terms page instead says “No paid
purchase is offered in this release,” and the workspace offers only raw
Graphite JSON export.

**Why this is missed leverage:** An engineer tracing a refactor commonly needs
to hand the selected function, source location, and visible relationships to a
reviewer. Raw index JSON is not a review artifact. The product is honest about
the omission, but it does not fulfill the brief's monetization and collaboration
loop.

**Concrete fix:** Restore standalone local HTML review-packet export for the
selected symbol and visible relationships after the product is registered with
the Sociobot billing API. Keep all payment handling through
`https://api.sociobot.in/api/v1/...`, test the checkout/product/price contract,
and test the downloaded packet contents. Do not add an AI feature: no model
step is necessary for the core graph task, and no decorative AI or provider-key
path is present now.

## Copy audit

Counts are whitespace-delimited; hyphenated terms and URLs count as one word.
The audit includes headings, labels, actions, facts, captions, alt text, and
footer copy so the result is stricter than sentence-only prose. No unit exceeds
22 words. No banned marketing word appears. No landing/README button lacks a
result-naming verb. The technical terms `code graph`, `JSON`, `SPA`, and
`service worker` are appropriate to the engineer/deployer context. The claim
flags are findings F-2-2 and F-2-4 through F-2-9, not copy-length defects.

### Live landing page

| ID | Words | Exact copy | Copy flag |
| --- | ---: | --- | --- |
| L00 | 4 | Skip to main content | None; keyboard bypass link. |
| L01 | 4 | Graphite / code graph | None; wordmark. |
| L02 | 1 | Demo | None; route link. |
| L03 | 1 | Privacy | None; route link. |
| L04 | 5 | Local code graph / v1.1.1 | None; version label. |
| L05 | 6 | Trace calls through an unfamiliar codebase. | None; job headline. |
| L06 | 15 | For engineers onboarding, debugging, or refactoring, see calls, imports, and source in one local workspace. | None. |
| L07 | 5 | Try it with sample data | None; result-naming primary action. |
| L08 | 3 | Open a folder | None; real first step. |
| L09 | 8 | See a five-file server codebase already mapped. | None. |
| L10 | 6 | Your source stays in this browser. | Claim coverage flag: F-2-2. |
| L11 | 8 | The demo opens offline after your first visit. | None; listed and exercised. |
| L12 | 7 | Local graphs and JSON export are free. | None; listed and exercised. |
| L13 | 15 | Abstract halftone map of paper source files connected by red, blue, and black graph nodes | None; useful image alt. |
| L14 | 2 | Plate 01 | None; caption label. |
| L15 | 8 | A codebase shown as linked functions and imports. | None. |
| L16 | 5 | 01 / Open a codebase | None; understandable section label. |
| L17 | 3 | Open your codebase | None. |
| L18 | 7 | Graphite reads selected files in browser memory. | Claim coverage flag: F-2-2. |
| L19 | 7 | It skips named dependency and build folders. | Claim coverage flag: F-2-2. |
| L20 | 4 | Drop a folder here | None. |
| L21 | 6 | Press Enter to choose a folder. | None. |
| L22 | 2 | Already indexed? | None. |
| L23 | 4 | Import a Graphite index | None; result-naming action. |
| L24 | 4 | 02 / Working view | None. |
| L25 | 6 | Follow one function at a time | None. |
| L26 | 13 | Select a function to see callers, callees, imports, and its source location together. | None; listed navigation behavior. |
| L27 | 9 | Preview showing boot linked to createServer, loadConfig, and start | None; preview accessible name. |
| L28 | 3 | 03 / Method | None; sequence label. |
| L29 | 6 | How Graphite maps a codebase | None. |
| L30 | 3 | Open a folder. | None. |
| L31 | 7 | Choose supported source files from your device. | Claim coverage flag: F-2-2. |
| L32 | 3 | Select a function. | None. |
| L33 | 7 | Move through linked calls, imports, and source. | None. |
| L34 | 3 | Export the index. | None. |
| L35 | 9 | Save the code graph as a local JSON file. | None. |
| L36 | 3 | 04 / Boundaries | None; sequence label. |
| L37 | 6 | Know what the graph cannot prove | None. |
| L38 | 9 | Cross-file matches are estimates and carry a visible label. | None; listed and exercised. |
| L39 | 11 | Dynamic calls, reflection, generated code, and complex types can be missed. | Claim coverage flag: F-2-2. |
| L40 | 16 | No analytics, accounts, hosted source index, external fonts, or third-party scripts run in the free workflow. | Claim coverage flag: F-2-2. |
| L41 | 8 | Read the privacy details or read the terms. | None. |
| L42 | 6 | Trace calls through a local codebase. | None. |
| L43 | 3 | Original generated illustration. | None; listed provenance claim. |
| L44 | 1 | Privacy | None; footer link. |
| L45 | 1 | Terms | None; footer link. |
| L46 | 4 | Built by Param Factory | None. |
| L47 | 1 | v1.1.1 | None; build/version label. |
| L48 | 1 | Primary | None; navigation landmark name. |
| L49 | 3 | Choose code files | None; hidden input's accessible name. |
| L50 | 4 | Choose Graphite JSON index | None; hidden input's accessible name. |

### README

| ID | Words | Exact copy | Copy flag |
| --- | ---: | --- | --- |
| R01 | 1 | Graphite | None; document title. |
| R02 | 16 | Graphite is a browser-based code graph for engineers onboarding to, debugging, or refactoring an unfamiliar codebase. | None. |
| R03 | 14 | Open a codebase and move between functions, calls, imports, and source without uploading files. | Claim coverage flag: F-2-2. |
| R04 | 7 | Try the isolated five-file demo at `https://code-graph-explorer.sociobot.in/?demo=1`. | None. |
| R05 | 8 | Reset restores the bundled files and selected function. | None; listed and exercised. |
| R06 | 12 | Start for real discards the demo and returns to the folder intake. | None; listed and exercised. |
| R07 | 4 | What Graphite can inspect | None; heading makes sense alone. |
| R08 | 10 | Graphite parses TypeScript/TSX, JavaScript/JSX, Python, and Go in the browser. | Claim coverage flag: F-2-2. |
| R09 | 15 | Search functions and files, then open a two-level code graph, relationship list, or source reference. | None; listed behavior. |
| R10 | 8 | Import or export a Graphite index as JSON. | None; listed behavior. |
| R11 | 4 | Press `/` to search. | Functional claim failure: F-2-1. |
| R12 | 11 | Use arrow keys to move between graph nodes and pane tabs. | Claim coverage flag: F-2-2. |
| R13 | 9 | The demo opens offline after the first online visit. | None; listed and exercised. |
| R14 | 3 | Accuracy and limits | None; heading makes sense alone. |
| R15 | 7 | Calls within one file use exact names. | Unlisted claim: F-2-4. |
| R16 | 12 | Cross-file calls use imported or unique names and are labelled as estimates. | Unlisted/partially listed claim: F-2-5. |
| R17 | 14 | Graphite can miss calls made through dynamic code, reflection, generated files, or complex types. | Claim coverage flag: F-2-2. |
| R18 | 13 | Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`, `coverage`, or `__pycache__` are ignored. | Claim coverage flag: F-2-2. |
| R19 | 6 | Files over 2 MB are ignored. | None; listed and exercised. |
| R20 | 14 | Folders with more than 5,000 supported files are rejected without keeping a partial codebase. | None; listed and exercised. |
| R21 | 3 | Privacy and access | None; heading makes sense alone. |
| R22 | 10 | Selected source and the active index stay in browser memory. | Claim coverage flag: F-2-2. |
| R23 | 15 | The free workflow uses no account, analytics, hosted source index, external fonts, or third-party scripts. | Claim coverage flag: F-2-2. |
| R24 | 13 | The app files are cached for offline use, but opened source is not. | None; covered by offline and memory claims, though privacy assertions need F-2-2's strengthening. |
| R25 | 8 | Local exploration and Graphite index export are free. | None; listed and exercised. |
| R26 | 8 | No paid purchase is offered in this release. | None; listed free-core behavior; missed leverage is F-2-10. |
| R27 | 4 | See Privacy and Terms. | None; both links are live. |
| R28 | 3 | Run Graphite locally | None; heading makes sense alone. |
| R29 | 11 | `npm test` runs unit, claim, browser, mobile, offline, and accessibility checks. | Unlisted claim: F-2-6. |
| R30 | 13 | `npm run build` type-checks the app and writes the static artifact to `dist/`. | None; covered by the build command/claim. |
| R31 | 5 | No environment variable is required. | Unlisted claim: F-2-7. |
| R32 | 4 | Deploy the static artifact | None; heading makes sense alone. |
| R33 | 9 | Deploy the `dist/` folder to Azure Static Web Apps. | None; instruction, not a success claim. |
| R34 | 16 | The repository includes the SPA fallback, security headers, cache rules, service worker, sitemap, and robots file. | Unlisted compound claim: F-2-8. |
| R35 | 10 | Do not deploy billing, DNS, or infrastructure from this repository. | None; instruction. |
| R36 | 1 | License | None; heading makes sense alone. |
| R37 | 1 | MIT. | Unlisted reliance-worthy statement: F-2-9. |
| R38 | 2 | See LICENSE. | None; link resolves in the repository. |

### Terminology check

| Concept | Consistent term |
| --- | --- |
| Source being inspected | codebase |
| Browser selection action | folder |
| Relationship visualization | code graph |
| Portable JSON file | Graphite index |
| Isolated try-out | demo |
| Bundled demo content | sample data |

`Function` names one common symbol kind; `symbol` correctly remains the broader
workspace term. `Calls`, `imports`, and `relationships` are distinct data, not
conflicting names. No terminology rewrite is required.

## Demo and sandbox evidence

- One click from the home page enters `/?demo=1`; `/demo` is also a direct
  entry. The first rendered workspace contains the realistic five-file server
  demo, a selected `boot` function, four visible focus-graph nodes, source, and
  relationships. This passes the immediate-value check.
- The persistent banner says “Demo — sample data, nothing is saved” and exposes
  **Reset demo** and **Start for real**.
- Selecting `healthCheck` and resetting restores `boot`, five files, and the
  original seed.
- Before demo entry, sentinels were created in localStorage, sessionStorage,
  IndexedDB (`real-db`), and Cache Storage (`real:cache`). Values and namespace
  lists were byte-for-byte unchanged after entry, selection, reset, and exit.
  The only app cache, `graphite-shell-6a0c22eeea31`, already existed after the
  landing visit and contains static app files, not demo state.
- **Start for real** removes the banner and workspace and returns to the folder
  intake. The sentinels remain unchanged.
- All observed runtime requests were same-origin. After leaving the demo, a
  real input containing the unique marker `PRIVATE_SOURCE_TOKEN_83fd` produced
  no network request at all while indexing. No request URL or body contained
  the marker.
- After service-worker control, offline reload of `/demo` restored `boot` and
  the demo banner. This passes the live offline behavior check.
- The one sandbox failure is the default mobile `/` shortcut in F-2-1.

## Claims execution

A no-local clone at `/tmp/code-graph-review2.lAbRz9`, pinned to the reviewed
commit, received a clean `npm ci`. Every `test` command in
`.factory/claims.json` was then executed independently.

| Result | Claim IDs |
| --- | --- |
| PASS (28/28 commands) | `open-codebase`, `navigate-code`, `source-stays-local`, `supported-languages`, `no-account`, `memory-only`, `ignored-folders`, `graph-depths`, `json-roundtrip`, `free-core`, `asset-provenance`, `tree-sitter-browser`, `heuristic-resolution`, `resolution-limits`, `five-file-demo`, `input-methods`, `demo-reset`, `demo-isolation`, `workspace-tools`, `relationship-list-a11y`, `keyboard-navigation`, `offline-reload`, `file-size-limit`, `folder-file-limit`, `no-third-party-runtime`, `build-contract`, `route-contract`, `mobile-panes` |
| FAIL | None at command level. F-2-1 and F-2-2 document a real viewport failure and assertions that do not cover their full sentences. |

The registry contains 28 entries, 28 tags, and 28 unique tags; each ID appears
once. Full clean-clone `npm test` also passes: 6 Vitest tests and 33 Playwright
tests. `npm run build` passes and emits `dist/`; entry JS is 35.30 KB raw /
13.09 KB gzip and the lazy Tree-sitter chunk is 67.15 KB raw / 16.53 KB gzip.

## Earlier-finding audit

Every earlier review/polish/handoff file was read. Each item was checked on the
live site and in current source rather than accepted from its status label.

| Earlier item | Current verification |
| --- | --- |
| Review 1 BLOCKING 1 — phone panes | **Fixed.** Symbols → Graph → Source → Graph each occupies x = 0, width = 390, with the selected pane visible. |
| Review 1 BLOCKING 2 — demo sandbox | **Fixed.** Direct entry, banner, reset, exit, storage isolation, same-origin runtime, and offline reload all work. |
| Review 1 BLOCKING 3 — audience/action | **Fixed.** Audience, job, primary action, outcome note, and facts are visible in both cold first screens. |
| Review 1 BLOCKING 4 — claim registry | **Half-fixed; reopened as F-2-2.** Registry/tag/command integrity exists, but several assertions do not establish their full claims, and F-2-4 through F-2-9 remain unlisted. |
| Review 1 BLOCKING 5 — unknown routes | **Fixed.** Unknown routes render the styled Graphite 404 with its own title, h1, canonical, return action, and consistent shell. |
| Review 1 BLOCKING 6 — dead checkout | **Fixed as the earlier review allowed.** The dead purchase and price are removed. The brief-level missing Team export is separately recorded as F-2-10. |
| Review 1 MAJOR 7 — metadata/route focus/skeleton/footer | **Fixed.** Required metadata, route focus, sitemap, header/footer, landing preview/method/limits, and actions are present. |
| Review 1 MAJOR 8 — copy | **Fixed.** No over-22-word unit, banned word, unexplained landing jargon, inconsistent product term, or noun-only landing button remains. |
| Verification P1 — stale service worker | **Fixed.** The generated worker has a build-derived cache, network-first navigation, old-cache cleanup, and update activation. |
| Verification P1 — 5,000-file bypass | **Fixed.** All intake paths use the limit and the clean claim test rejects 5,001 files without a workspace. |
| Verification/Polish P3 — grammar cache | **Fixed.** Live WASM returns `public, max-age=604800, must-revalidate`. |

## Structure, routing, accessibility, and visual identity

| Check | Result |
| --- | --- |
| Titles | Pass: Home is “Graphite — trace calls in local codebases”; Demo, Privacy, Terms, and 404 use distinct route titles. All are under 60 characters. |
| One h1, landmarks, outline | Pass on Home, Demo, Privacy, Terms, and 404. |
| Description/canonical/OG/Twitter/favicon | Pass. The OG asset is a real 1200 × 630 image; Apple touch is 180 × 180. |
| Deep links/history/focus | Pass. Direct routes render correctly. Privacy client navigation and browser Back focus the new h1 and update the live region. |
| Dead links | Pass. Every live landing HTTP link returned 200; Privacy and Terms are present in the footer. |
| 404 | Pass as the intended static-SPA pattern: host fallback returns the shell and the client renders the designed not-found state. |
| Security/privacy headers | Pass. Live CSP, HSTS, nosniff, Referrer-Policy, and Permissions-Policy are present and match runtime requests. |
| Console/runtime | Pass. No console error or page error occurred in cold, demo, route, reset, offline, or real-input flows. |
| Automated accessibility | Pass with an important manual exception: axe found zero WCAG 2 A/AA violations on all five routes; reduced motion computes to instant transitions. F-2-1 and F-2-3 remain. |
| Visual identity | Pass. The paper field-manual layout, two-ink halftone art, hard rules, offset registration shadows, narrow display type, and drafting-table workspace are recognisable and not a generic SaaS template. Provenance is recorded. |
| Standard landing skeleton | Pass. Header, first screen, preview, three-step method, boundaries/privacy, and footer appear in the required order. No paid section is shown because no paid product is currently offered; F-2-10 records the brief deviation. |

## What would make this perfect

There is concrete work left, so this section is not aspirational. A perfect
next round has all of the following and no substitute findings:

1. Make `/` open and focus Search from the default 390-pixel Graph pane, then
   test that exact state.
2. Bring every visible phone target to at least 44 × 44 pixels and enforce it
   in a browser test.
3. Strengthen the six partial claim assertions in F-2-2 and register or remove
   every unlisted README claim in F-2-4 through F-2-9.
4. Deliver and test the brief's local Team review-packet export through the
   Sociobot billing API, or revise the source-of-truth brief so the omitted
   paid collaboration loop is no longer promised.
5. Re-run the cold first screen, one-click demo, live network/storage/offline
   interception, every registry command from a new clone, full copy audit,
   earlier-finding audit, route crawl, and manual phone checks. PASS only if
   that run produces zero findings.
