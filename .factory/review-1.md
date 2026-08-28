# Adversarial first-read review 1 — Graphite

**Verdict: FAIL**

Reviewed 2026-08-28 against commit `33857d1f033e21aafc31e6962b58e25cb2421960` and the live site at `https://code-graph-explorer.sociobot.in`. A pass requires zero blocking findings and at most three minor findings. This review found six blocking findings and two major finding groups.

## First 30 seconds

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 without scrolling.

| Question | Cold-read answer |
|---|---|
| What does it do? | It opens a local JavaScript, TypeScript, Python, or Go project and lets me follow functions, calls, imports, and source. |
| For whom? | **Cannot determine from the first screen.** The screen names file types and features, not the person or situation. |
| What should I click first? | “Open a folder” appears primary. “Explore the sample” competes with it and neither action says what result appears next. |

The exact text that fails the audience test is: “Trace the code. Keep the source.” and “Open a JavaScript, TypeScript, Python, or Go project. Follow functions, callers, callees, and imports in one linked workspace—without an upload, account, or IDE plugin.” Neither identifies engineers onboarding to, debugging, or refactoring an unfamiliar codebase.

## Findings, ordered by severity

### BLOCKING 1 — The selected phone panes do not show their content

**Quote/evidence:** After choosing “Explore the sample” at 390 px, the selected tab says “Graph,” but the viewport shows `src/main.ts` source. The workspace has `data-active-pane="graph"`; its scroll container is moved 410 px, the graph pane is offscreen at x = -410, and `.source-pane` is under the viewport. Selecting “Symbols” still leaves the source pane visible. Selecting “Graph” again does not recover it.

**Why this loses a first-time visitor:** The core job is graph exploration, but the graph and symbol index cannot be reached on the required phone viewport. The selected-tab state contradicts the displayed pane.

**Concrete fix:** Do not call `scrollIntoView()` on a source line while Source is inactive. Reset the workspace container’s horizontal scroll position on every pane change. Add a 390 px browser test that selects Symbols → Graph → Source → Graph and confirms the center of the viewport belongs to the selected pane each time.

### BLOCKING 2 — The sample is not a demo sandbox

**Quote/evidence:** The action is “Explore the sample,” not “Try it with sample data.” It loads a useful five-file server sample in one click on desktop, but the URL stays `/`; `/demo` opens the landing page; and there is no “Demo — sample data, nothing is saved” banner, “Reset demo,” or “Start for real.” The README exposes no demo URL. A normal sample flow made no storage writes and left a `real:sentinel` value unchanged, but the sample reads real license keys: preloading a valid `sb_license_verdict:code-graph-explorer` caused “Review packet” to export `boot-review.html` from the sample.

**Why this misleads:** A visitor cannot tell that the sample is temporary, reset it, share a reproducible demo URL, or separate sample behavior from real browser data. Reading the production license namespace confirms that this is ordinary app state, not an isolated demo state.

**Concrete fix:** Implement `/demo` as a direct, seeded entry point. Keep all demo state under a `demo:` namespace or in isolated memory, and do not read or write production license/data keys while it is active. Keep a persistent banner with **Reset demo** and **Start for real**. Reset must restore the five original files and selected symbol. Add `.factory/demo.md` and browser tests for direct entry, reset, exit, storage isolation, and offline use.

### BLOCKING 3 — The first screen never says who the product is for

**Quote:** “Trace the code. Keep the source.” followed by “Open a JavaScript, TypeScript, Python, or Go project.”

**Why this loses a first-time visitor:** Technology names do not identify the intended person or problem. A new visitor cannot confirm whether this is for onboarding, debugging, refactoring, education, or repository documentation.

**Concrete fix:** Use a job headline such as **“Trace calls through an unfamiliar codebase.”** Follow it with **“For engineers onboarding, debugging, or refactoring, see calls, imports, and source in one local workspace.”** Make **“Try it with sample data”** the primary action and add “See a five-file server project already mapped.” Show three short, tested facts beside it: source location, offline behavior, and exact free/paid terms.

### BLOCKING 4 — The required claim registry and claim tests do not exist

**Quote/evidence:** `.factory/claims.json` is absent and `rg '@claim:'` returns no tests. Claim-like copy includes “Keep the source,” “0 source uploads,” “Offline app shell,” “It supports TypeScript/TSX, JavaScript/JSX, Python, and Go,” and “The only external request is an explicit Team checkout or license verification.” There were therefore zero listed claim commands to run.

**Why this misleads:** Visitors are asked to rely on privacy, offline, parsing, limit, export, accessibility, and pricing statements without a clean-demo test tied to each statement. General unit tests do not establish those promises.

**Concrete fix:** Add `.factory/claims.json`. Split compound claims into one assertion per entry and add exactly one `@claim:<id>` browser or unit test for each. The unlisted-claim inventory below identifies every landing/README claim and a proposed tag.

### BLOCKING 5 — Unknown routes silently render the home page

**Quote/evidence:** `/definitely-missing` returns HTTP 200 with title “Graphite — local code graph explorer” and h1 “Trace the code. Keep the source.” There is no designed 404. `/demo` is swallowed by the same fallback.

**Why this loses a first-time visitor:** A mistyped or stale link looks valid, so the visitor cannot distinguish a missing destination from the product home page. This is broken routing under the site-structure contract.

**Concrete fix:** Route unknown paths to a Graphite-styled not-found screen with a route-specific title, one h1, and links to Home and Demo. Keep SPA fallback at the host, but let the client router identify unsupported routes. Add deep-link and reload tests for `/demo`, `/privacy`, `/terms`, and a missing route.

### BLOCKING 6 — The paid action is a dead link

**Quote/evidence:** The “Buy Team” link points to `https://api.sociobot.in/api/v1/products/code-graph-explorer/checkout`; following it returns HTTP 404.

**Why this misleads:** The dialog offers “$24 one-time purchase for one user,” but the named purchase action cannot complete.

**Concrete fix:** Register the product in the Sociobot billing API or hide the purchase claim and action until registration is complete. Add a claim test that follows the checkout link and confirms a successful checkout page with the same product and price.

### MAJOR 7 — Route metadata, focus, footer, and landing structure are incomplete

Verified: the landing, Privacy, and Terms titles follow the required pattern; each rendered route has one h1; `lang`, description, SVG favicon, security headers, skip link, internal Privacy/Terms links, and back navigation work. Axe reported zero WCAG 2 A/AA violations on the cold landing page. The halftone field-manual identity is specific and recognisable, not a generic SaaS template.

Failures:

- Canonical, Open Graph, Twitter card, and apple-touch icon metadata are absent.
- Route changes leave focus on `body`; the new h1 is neither focused nor announced.
- The sitemap has no Demo or 404 URL.
- The header has no Demo link. The footer lacks the product one-liner, “Built by Param Factory,” and a build/version id.
- The landing page jumps from the hero to a second folder intake and fact strip. It has no live preview, three-step “How it works,” plain limitations/privacy section, or visible paid-tier section.
- The hidden Team dialog uses the noun button “Team,” and the workspace uses the noun button “Review packet.” Use “View Team export” and “Export review packet.”

**Concrete fix:** Add route-aware metadata and focus management, then implement the standard landing sequence. Preserve the existing graphite-paper art direction.

### MAJOR 8 — Copy has two over-limit sentences, unexplained jargon, metaphors, and inconsistent names

The full sentence audit follows. Every flagged item includes its proposed rewrite. No banned marketing word from the supplied list appears. The main terminology conflict is `project` / `repository` / `folder` / `codebase` for the input and `sample` for an experience that must be called a demo.

**Terminology fixes:** Use **codebase** for the thing being explored, **folder** only for the browser selection action, **code graph** for the visualization, **Graphite index** for the JSON file, and **demo / sample data** for demo state and its seed data.

## Copy audit

Counts use whitespace-delimited words; hyphenated compounds and URLs count as one word. Headings, labels, and button text are included as copy units even when they are fragments.

### Live landing page

| ID | Words | Exact copy | Flag and proposed rewrite |
|---|---:|---|---|
| L01 | 5 | Local code cartography / v1.0 | Jargon/metaphor. Use “Local code graph / v1.0.” |
| L02 | 3 | Trace the code. | First-screen audience missing with L03–L05. Use the headline in Blocking 3. |
| L03 | 3 | Keep the source. | Ambiguous privacy claim. Use “Your source stays in this browser.” after adding its claim test. |
| L04 | 8 | Open a JavaScript, TypeScript, Python, or Go project. | `project` conflicts with `repository`, `folder`, and `codebase`. Use “Open a JavaScript, TypeScript, Python, or Go codebase.” |
| L05 | 16 | Follow functions, callers, callees, and imports in one linked workspace—without an upload, account, or IDE plugin. | Compound claim and no audience. Use “For engineers tracing unfamiliar code, see calls, imports, and source in one local workspace.” |
| L06 | 3 | Open a folder | Pass. |
| L07 | 3 | Explore the sample | Vague result and wrong demo term. Use “Try it with sample data.” |
| L08 | 6 | Works best in Chrome or Edge. | Unmeasurable browser claim. Use “Chrome and Edge can open a folder directly.” |
| L09 | 10 | Other browsers can choose a folder through the file picker. | Claim needs a browser matrix. Use “Firefox and Safari use the folder file picker.” only if tested. |
| L10 | 2 | Plate 01 | Decorative label; pass. |
| L11 | 8 | A codebase, viewed as routes instead of folders. | Metaphor. Use “A codebase shown as linked functions and imports.” |
| L12 | 3 | 01 / Input | Out-of-context heading. Use “01 / Open a codebase.” |
| L13 | 6 | Put your repository on the table | Metaphor and inconsistent term. Use “Open your codebase.” |
| L14 | 8 | Folders are read locally and held in memory. | Pass only after a privacy claim test. |
| L15 | 7 | Generated files and dependencies are skipped automatically. | Overbroad: only named directories are skipped. Use “Graphite skips supported dependency and build folders.” |
| L16 | 4 | Drop a folder here | Pass. |
| L17 | 6 | or press Enter to choose one | Fragment/lowercase. Use “Press Enter to choose a folder.” |
| L18 | 2 | Already indexed? | Pass in context. |
| L19 | 3 | Import JSON index | Inconsistent output term. Use “Import a Graphite index.” |
| L20 | 2 | 4 languages | Claim; name them or link it to tested support. |
| L21 | 3 | 0 source uploads | Claim; use “Source is not uploaded” with a network-interception test. |
| L22 | 3 | 2 graph depths | Jargon. Use “View 1 or 2 relationship levels.” |
| L23 | 3 | JSON portable index | Awkward/inconsistent. Use “Import or export a Graphite index.” |
| L24 | 5 | Source stays on your machine. | Conflicts with browser-memory wording. Use “Your source stays in this browser.” |
| L25 | 5 | Original illustration generated for Graphite. | Provenance claim; pass only with a recorded asset check. |
| L26 | 2 | Team license | Pass as a dialog label. |
| L27 | 4 | Carry a shared trail. | Heading is metaphorical out of context. Use “Export a code review packet.” |
| L28 | 17 | Team adds a standalone HTML review packet for the focused symbol, its source location, and visible relationships. | `focused symbol` is jargon. Use “Team exports one HTML file with the selected function, source location, and visible relationships.” |
| L29 | 8 | Local exploration and JSON export always stay free. | Pass only after a pricing/entitlement test. |
| L30 | 6 | $24 one-time purchase for one user | Pass only after checkout is live and tested. |
| L31 | 2 | Buy Team | Pass as a result-naming action, but it currently returns 404. |
| L32 | 3 | Have a license? | Pass. |
| L33 | 3 | Paste it here | Placeholder-like instruction. Use “Paste your Team license.” |
| L34 | 2 | Verify license | Pass. |
| L35 | 8 | Sociobot / Dodo is the merchant of record. | Use one plain name: “Dodo processes the purchase for Sociobot.” |
| L36 | 4 | Refunds are handled there. | Vague referent. Use “Request refunds through the Sociobot checkout receipt.” |

Button-only flag not represented by a sentence: **“Team”** is a noun action; use **“View Team export.”**

### README

| ID | Words | Exact copy | Flag and proposed rewrite |
|---|---:|---|---|
| R01 | 18 | Graphite is a browser-based call and dependency graph for engineers onboarding to, debugging, or refactoring an unfamiliar codebase. | Pass. |
| R02 | 21 | Open a folder and move between functions, callers, callees, imports, and source without uploading the repository or installing an IDE extension. | `repository` conflicts with `codebase`. Use “Open a codebase and move between functions, calls, imports, and source without uploading files or installing an IDE extension.” |
| R03 | 7 | It supports TypeScript/TSX, JavaScript/JSX, Python, and Go. | Pass only with language claim tests. |
| R04 | 15 | Tree-sitter WASM extracts syntax in the browser; cross-file call resolution uses deliberately labelled name-and-import heuristics. | Dense jargon. Use “Tree-sitter parses syntax in your browser. Cross-file calls matched by imported or unique names are labelled as estimates.” |
| R05 | 15 | Dynamic dispatch, reflection, generated code, and complex type resolution can produce missing or false edges. | Jargon. Use “Graphite can miss or misidentify calls made through dynamic code, reflection, generated files, or complex types.” |
| R06 | 8 | Folder picker, drag-and-drop, and a built-in five-file sample | Fragment and `sample`/demo mismatch. Use “Open a folder, drop one onto the page, or start the five-file demo.” |
| R07 | 10 | Incremental, main-thread-friendly local indexing with ignored dependency and build directories | Jargon and fragment. Use “Graphite indexes local files in batches and skips dependency and build folders.” |
| R08 | 15 | Searchable symbols and modules, depth-limited SVG focus graph, accessible relationship list, and clickable source references | Jargon and fragment. Use “Search symbols and files, then open a two-level code graph, relationship list, or source reference.” |
| R09 | 4 | Portable Graphite JSON import/export | Fragment. Use “Import or export a Graphite index as JSON.” |
| R10 | 11 | Offline app shell; active source is held only in browser memory | `app shell` jargon and fragment. Use “The app opens offline after the first visit. Open source stays in memory until the tab closes or reloads.” |
| R11 | 10 | Keyboard navigation (`/` focuses search, arrows move through graph nodes) | Fragment. Use “Press `/` to search and use arrow keys to move between graph nodes.” |
| R12 | 16 | Optional one-time Team license for standalone HTML review-packet export; local exploration and JSON export remain free | Fragment and inconsistent hyphenation. Use “A one-time Team license adds HTML review-packet export. Local exploration and JSON export stay free.” |
| R13 | 5 | Requires Node.js 20 or newer. | Pass. |
| R14 | 9 | The exact production build command is `npm run build`. | Pass. |
| R15 | 27 | It copies the four Tree-sitter grammars and runtime into the static asset tree, type-checks the app, and writes deployable output to `dist/` with `dist/index.html` at its root. | **Over 22 words.** Use “The build copies four Tree-sitter grammars and their runtime into `dist/`. It type-checks the app and writes `dist/index.html`.” |
| R16 | 9 | No environment variable is required for the free app. | Pass. |
| R17 | 9 | The billing API defaults to `https://api.sociobot.in/api/v1`; staging can set: | Sentence trails into code. Use “Production uses the Sociobot billing API. Set this variable for staging:” |
| R18 | 10 | Source files are parsed locally with language-specific Tree-sitter WASM grammars. | Jargon. Use “Graphite parses supported source files in the browser with Tree-sitter.” |
| R19 | 10 | Definitions, lexical calls, and imports become a versioned in-memory index. | Jargon. Use “It stores definitions, calls, and imports in a versioned browser-memory index.” |
| R20 | 19 | Calls resolve exactly within a file and heuristically across files by unique/exported name; imports resolve against normalized relative paths. | Dense jargon. Use “Calls within one file use exact names. Cross-file calls use unique or exported names. Imports use relative file paths.” |
| R21 | 11 | Every uncertain edge is marked `heuristic` in the UI and JSON. | `edge`/`heuristic` jargon. Use “Graphite labels every estimated relationship in the app and exported JSON.” |
| R22 | 13 | Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`, `coverage`, or `__pycache__` are ignored. | Pass. |
| R23 | 7 | Individual files over 2 MB are ignored. | Pass. |
| R24 | 32 | A folder with more than 5,000 eligible supported files is not indexed at all, with a clear local error, so Graphite never silently retains a partial project or exceeds its browser-memory guard. | **Over 22 words; jargon and inconsistent `project`.** Use “Folders with more than 5,000 supported files are not indexed. Graphite shows an error instead of keeping a partial codebase or exceeding the memory limit.” |
| R25 | 13 | The application has no analytics, hosted source index, external fonts, or runtime CDN. | `runtime CDN` jargon. Use “The app uses no analytics, server-side source index, external fonts, or third-party scripts.” |
| R26 | 12 | The only external request is an explicit Team checkout or license verification. | Pass only with full-flow network interception. |
| R27 | 7 | See `/privacy` and `/terms` in the app. | Pass; both links return 200. |
| R28 | 10 | The `dist/` directory is ready for Azure Static Web Apps. | “Ready” is an untested deployment claim. Use “Deploy the `dist/` folder to Azure Static Web Apps.” |
| R29 | 10 | Do not deploy billing, DNS, or infrastructure from this repository. | Pass. |
| R30 | 1 | MIT. | Pass; `LICENSE` exists. |
| R31 | 2 | See `LICENSE`. | Pass. |

README heading flags: **“Features”** does not make sense independently; use **“What Graphite can inspect.”** **“Develop and verify”** should be **“Run Graphite locally.”** The other README headings are understandable out of context.

## Unlisted claim inventory

Because `.factory/claims.json` is missing, every claim below is unlisted. Copy IDs refer to the exact quotes and word counts above. Compound sentences must be split so each claim has one observable assertion.

| Copy IDs | Visitor-relevant claim | Required test tag(s) |
|---|---|---|
| L02, L04, L05, R01, R02 | Opens a supported local codebase and navigates functions, calls, imports, and source. | `@claim:open-codebase`, `@claim:navigate-code` |
| L03, L05, L21, L24, R02, R18 | Source is parsed locally and is not uploaded. | `@claim:source-stays-local` with request interception during import and navigation |
| L04, L20, R03 | TypeScript/TSX, JavaScript/JSX, Python, and Go are supported. | One fixture test per language, or `@claim:supported-languages` asserting all four |
| L05 | No account or IDE plugin is required. | `@claim:no-account`, plus remove the plugin claim or verify a clean browser flow |
| L08, L09 | Direct folder access works in Chrome/Edge and the fallback works elsewhere. | Replace “works best”; add a tested browser matrix under `@claim:folder-browser-support` |
| L14, R10, R19 | Active source/index data stays in browser memory. | `@claim:memory-only` checking storage before and after a real flow |
| L15, R07, R22 | Dependency/build folders are skipped. | `@claim:ignored-folders` with every named folder |
| L22, R08 | One- and two-level graph views work. | `@claim:graph-depths` asserting visible relationships at both depths |
| L23, R09, R12 | A Graphite JSON index can be imported and exported for free. | `@claim:json-roundtrip`, `@claim:json-free` |
| L25 | The illustration is original and generated for Graphite. | `@claim:asset-provenance` checking the recorded prompt/source metadata |
| L28, R12 | Team exports an HTML packet containing the selected symbol, source location, and visible relationships. | `@claim:review-packet-export` asserting downloaded HTML content |
| L29, L30, R12 | Local exploration/JSON export are free and Team costs $24 once for one user. | `@claim:free-core`, `@claim:team-price` against the checkout contract |
| L35, L36 | Dodo is merchant of record and refunds are handled through that flow. | `@claim:merchant-and-refunds` against a working checkout page |
| R04, R18 | Tree-sitter parses supported syntax in the browser. | `@claim:tree-sitter-browser` using the shipped WASM in the demo |
| R04, R20, R21 | Cross-file resolution follows the described heuristic and labels uncertain relationships. | `@claim:heuristic-resolution` |
| R05 | Dynamic/reflected/generated/complex calls may be missing or false. | Treat as a limitation, and test representative false-negative/uncertain cases under `@claim:resolution-limits` |
| R06 | Folder picker, drag/drop, and a five-file demo work. | `@claim:input-methods`, `@claim:five-file-demo` |
| R07 | Indexing yields incrementally. | `@claim:incremental-indexing` with a measurable responsiveness assertion |
| R08 | Symbol/module search, relationship list, and source links work and the list is accessible. | `@claim:workspace-tools`, `@claim:relationship-list-a11y` |
| R10 | The app shell reloads offline after the first visit. | `@claim:offline-reload` using `/demo` from a fresh context |
| R11 | `/` focuses search and arrow keys move through graph nodes. | `@claim:keyboard-navigation` |
| R13–R17 | Node requirement, build command/output, no required variable, and billing default. | `@claim:build-contract`, `@claim:billing-default` |
| R23 | Files over 2 MB are ignored. | `@claim:file-size-limit` |
| R24 | More than 5,000 eligible files produces an error and no partial index. | `@claim:folder-file-limit` |
| R25, R26 | There are no analytics, hosted index, external fonts, or runtime CDN; only explicit billing can call off-origin. | `@claim:no-third-party-runtime`, `@claim:only-billing-external` |
| R28 | `dist/` is deployable to Azure Static Web Apps. | `@claim:azure-static-output`, or replace “ready” with an instruction |

## Demo, privacy, and offline evidence

- One-click sample: **partial pass on desktop**. The five realistic files produce 12 symbols and 10 edges and show the used workspace immediately.
- One-click sample on 390 px: **fail**. The selected Graph pane displays Source, and Symbols/Graph cannot be recovered.
- Demo banner/reset/start/direct URL: **fail**. All are absent; `/demo` renders Home.
- Storage write check: the ordinary sample path wrote no localStorage or sessionStorage and preserved a seeded sentinel.
- Storage isolation check: **fail**. The sample read production license keys and changed entitlement behavior.
- Network interception: sample loading, parsing, and navigation requested only same-origin HTML, JS, CSS, image, and WASM assets. No source request or third-party runtime request was observed.
- Offline check: after the service worker gained control, an offline reload rendered the landing shell. The in-memory sample disappeared on reload. This confirms the README’s narrow app-shell claim, but there is no direct offline demo to exercise.

## Test and structure evidence

- `.factory/claims.json`: **missing**; listed claim tests run: **0**.
- `npm ci`: pass, 0 vulnerabilities reported.
- `npm test`: pass, 5/5 Vitest tests. These are parser/limit tests, not tagged claim tests.
- `npm run build`: pass; `dist/` produced. Initial JS is 35.63 KB raw / 13.62 KB gzip.
- Cold live console: no errors. Axe browser integration: 0 violations on 390 px and desktop landing pages.
- Internal crawl: Home, Privacy, and Terms return 200. Checkout returns 404. Unknown routes incorrectly return the Home page with 200.
- Titles: Home, Privacy, and Terms pass. Demo and 404 titles cannot pass because those routes do not exist.
- Visual identity: pass. Cream paper, hard rules, offset shadows, vermilion/cobalt ink, halftone illustration, and drafting-table graph UI match `.factory/design.md` and are recognisable from a thumbnail.

The passing checks do not offset the blocking findings above.
