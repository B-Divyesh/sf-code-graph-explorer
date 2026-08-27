# Handoff — code-graph-explorer

## Independent verification 3 — PASS

Candidate `8baba55fe349f18151747855da7f054769ee00d3` and
`https://code-graph-explorer.sociobot.in/` were independently verified on
2026-08-27. The live deployment is byte-identical to a clean production build
for the sampled HTML, JS, CSS, service-worker, image, and grammar artifacts.

`npm ci`, `npm test` (5/5), `tsc --noEmit` through `npm run build`, and the
exact `npm run build` production command passed. Desktop and 390px browser
tests passed the five-file sample, TS/Python/Go input, unsupported/oversized
file recovery, malformed JSON recovery, 5,001-file rejection, JSON export,
source and graph navigation, keyboard/focus behavior, reduced motion, and
offline reload. Local axe WCAG 2 A/AA reported zero violations; local and live
pages had no console/page errors. A controlled-client worker update simulation
showed the new release cache and visible Reload notice.

There are no release-blocking defects. See
`.factory/verification-3.md` for exact commands, hashes, headers, privacy and
outbound-request evidence, and the one P3 follow-up: un-hashed grammar WASM
responses have a 30-second HTTP cache even though the service worker precaches
them.

## Repair status — ready to deploy

This repair resolves both P1 findings in independent verifier commit
`d9222eb8872116a6000f3356c8356aff55238413` while retaining the previously
passing parsing, graph, privacy, export, and accessibility behavior.

- Every folder path now applies one shared **5,000 eligible supported-file**
  boundary: File System Access picker, `webkitdirectory` fallback, and dropped
  directories. Exactly 5,000 files index. At 5,001, Graphite does not retain a
  partial index and displays a fixed explanation. Directory traversal is sorted
  for deterministic handling; drag/drop also consumes every `readEntries()`
  batch instead of silently omitting batches.
- `npm run build` now generates `dist/sw.js` from the complete emitted release.
  Its `graphite-shell-<content-hash>` cache is release-versioned, its navigation
  strategy is network-first with a cached `index.html` fallback offline, and it
  precaches the app shell/assets. The worker script is served `no-cache`.
  `skipWaiting` and `clientsClaim` move existing controlled clients to the new
  worker; a visible in-app “newer shell ready” Reload action refreshes the
  document onto the new shell.

## What shipped

- Graphite, a complete static browser workspace for opening local folders and
  navigating TypeScript/TSX, JavaScript/JSX, Python, and Go code.
- Lazy-loaded Tree-sitter WASM parsers extract definitions, methods, lexical
  calls, and imports. A labelled resolver links same-file names exactly and
  cross-file names/import paths heuristically. Regex parsing remains a graceful
  fallback if a grammar cannot load.
- Folder picker, directory drag/drop, unsupported/empty/error states,
  incremental yielding during indexing, a five-file sample, and portable JSON
  index import/export.
- Searchable function/class/type/module list, one- or two-hop SVG focus graph,
  accessible text relationship list, synchronized source view with clickable
  references, `/` search shortcut, arrow navigation, and mobile pane tabs.
- Offline, release-versioned service-worker shell. No source persistence or
  upload; sources live in memory. Dependency/build folders and files over 2 MB
  are filtered, and a 5,001-file selection is rejected before indexing.
- Sociobot paid-unlock contract: checkout, query-token capture, daily cached
  verification, restore field, revoked/invalid notice, and a genuinely gated
  standalone HTML review-packet export. Core exploration and JSON export remain
  free.
- Original generated halftone code-cartography hero (108 KB WebP), visual system,
  responsive 390 px layout, privacy/terms routes, favicon, robots/sitemap, CSP,
  and Azure Static Web Apps configuration.

## How to run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

The deploy command is exactly `npm run build`; output is `dist/`, with
`dist/index.html` at its root. `prebuild` copies only the required Tree-sitter
runtime and four grammar WASMs into the public asset tree.

Repair verification on 2026-08-27:

- Clean `npm ci`, `npm test` and `npm run build` passed. Tests include exact
  5,000 and 5,001 limit regressions. The built initial JS is 35.60 KB raw
  (13.60 KB gzip) and CSS 18.97 KB raw (4.97 KB gzip), below the static budget.
- `/opt/fleet/lib/verify-url.sh` passed locally and against the current live
  URL: HTTP 200, no browser errors, title/lang/main/alt/button checks valid.
- Playwright local smoke: the five-file sample stayed at 12 symbols/10 edges;
  representative TypeScript, Python, and Go input yielded 4 accepted files,
  8 symbols, and 2 relationships (Markdown excluded); malformed JSON retained
  its recovery screen; 5,000 files indexed and 5,001 produced the fixed error.
- At 390×844 all three labelled mobile panes worked; `/` focused search and
  ArrowRight moved graph focus. axe-core WCAG 2 A/AA found 0 violations on the
  loaded workspace.
- Offline test: after worker control, `context.setOffline(true)` followed by a
  reload rendered the landing shell from the generated release cache.
  Update simulation changed the worker release, observed the new cache and
  visible “A newer Graphite shell is ready / Reload” control in an already
  controlled persistent browser profile.
- Live parity check: the deployed URL correctly remains the prior verifier
  candidate until the factory deploys this commit, so its `sw.js` hash differs
  from this build by design. Local and live basic page checks both passed; run
  the hash/parity check again after deployment.

## Known gaps and next steps

- Cross-file resolution is intentionally heuristic: aliases, overloads,
  interfaces, reflection, dynamic dispatch, and generated code can create false
  or missing edges. Every uncertain edge is marked in UI and export.
- Large-project parsing yields between files but still retains selected source
  in memory; a worker + IndexedDB chunk store is the next step toward the
  200k-LOC target on lower-memory phones.
- File System Access is Chromium-only; Firefox/Safari use the directory input.
  Dragged directory traversal relies on the widely supported WebKit entry API.
- The live deployment has not yet been updated with this repair; deployment is
  owned by the factory. Its old fixed-cache worker will be replaced on the next
  deploy by the generated release worker.
- Team review packets are local files. Hosted team permalinks remain a future
  server-backed tier and were not implied in this v1.
- The production billing product must be registered by the factory. Staging can
  set `VITE_BILLING_API_URL=https://pilot-api.sociobot.in/api/v1`.
