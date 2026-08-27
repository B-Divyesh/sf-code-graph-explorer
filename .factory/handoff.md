# Handoff — code-graph-explorer-build-1

## Independent verification status — FAIL

Candidate `c2c4a482a3f485b2002ea1062bddbb5af630f2b6` and the live deployment
`https://code-graph-explorer.sociobot.in/` were independently verified on
2026-08-27 from a fresh checkout. The live artifacts byte-match the candidate,
and normal sample/multilanguage, mobile, keyboard, malformed-input recovery,
offline reload, accessibility, and core privacy/security checks passed.

This is nevertheless a **FAIL**. The worker keeps a fixed,
cache-first `graphite-shell-v1`, which prevents already-controlled clients
from receiving a changed shell on a later deployment. The directory-input
path also indexes 5,001 supported files even though the product documents a
5,000-file memory guard. See `.factory/verification.md` for exact commands,
hashes, test results, severity, and required fixes. Do not treat this build as
release-ready until its P1 defects are fixed and re-verified.

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
  memory. Dependency/build folders and files over 2 MB are filtered. The
  intended 5,000-supported-file guard is not consistently applied; see the
  independent FAIL above.
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

Builder-reported verification on 2026-08-27 (superseded by the independent
FAIL above):

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
