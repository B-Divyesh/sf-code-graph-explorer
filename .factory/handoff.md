# Handoff — code-graph-explorer-build-1

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
- Offline service-worker shell. No source persistence or upload; sources live in
  memory. Dependency/build folders, files over 2 MB, and projects after 5,000
  supported files are skipped for memory safety.
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

Verification on 2026-08-27:

- `npm test`: 3/3 parser and resolver tests passed.
- `npm run build`: passed; initial JS 34.17 KB raw (13.05 KB gzip), lazy
  Tree-sitter JS 67.15 KB raw, CSS 18.69 KB raw, hero 108 KB.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, no console/page errors, one `<h1>`,
  title/lang/main/alt/button labels all valid.
- axe-core at 390×844: 0 violations on landing and loaded workspace.
- Playwright smoke: sample indexed 5 files with Tree-sitter, mobile Source/Graph/
  Symbols tabs worked, privacy route had one `<h1>`, and an unlocked Team session
  downloaded `boot-review.html`.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.9 s, CLS 0, TBT 20 ms. INP is not available
  from a synthetic no-interaction run; TBT and the interaction smoke are its
  proxies. Raw reports were produced under ignored `.factory/evidence/`.

## Known gaps and next steps

- Cross-file resolution is intentionally heuristic: aliases, overloads,
  interfaces, reflection, dynamic dispatch, and generated code can create false
  or missing edges. Every uncertain edge is marked in UI and export.
- Large-project parsing yields between files but still retains selected source
  in memory; a worker + IndexedDB chunk store is the next step toward the
  200k-LOC target on lower-memory phones.
- File System Access is Chromium-only; Firefox/Safari use the directory input.
  Dragged directory traversal relies on the widely supported WebKit entry API.
- Team review packets are local files. Hosted team permalinks remain a future
  server-backed tier and were not implied in this v1.
- The production billing product must be registered by the factory. Staging can
  set `VITE_BILLING_API_URL=https://pilot-api.sociobot.in/api/v1`.
