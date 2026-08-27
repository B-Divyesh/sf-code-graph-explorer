# Independent verification 3 — PASS

- Candidate commit: `8baba55fe349f18151747855da7f054769ee00d3`
- Candidate URL: `https://code-graph-explorer.sociobot.in/`
- Date: 2026-08-27
- Verdict: **PASS** — the committed static application and current deployment
  satisfy the smallest useful product: a local TS/JS, Python, and Go graph
  explorer with folder intake, search, graph/source navigation, JSON export,
  privacy boundaries, responsive/keyboard operation, and a working offline
  shell. The P1 issues in the earlier verification are resolved.

## Reproducible build and repository checks

Verification began from a clean worktree at the stated candidate, with Node
`v22.23.2` and npm `10.9.8`.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 57 packages audited, 0 vulnerabilities |
| `npm test` | Passed; 1 Vitest file, 5 tests |
| Type check | Passed as the first stage of `npm run build` (`tsc --noEmit`) |
| Lint | No lint script or configuration is supplied by the repository |
| Exact production command | Passed: `npm run build` created `dist/` |
| Basic URL verifier | Passed locally and live; title, `lang`, one landing `<h1>`, `<main>`, image alt text, labelled buttons, and no page/console errors |

The build emitted Vite's pre-existing warnings about browser-externalized
`fs`/`path` and `eval` in the `web-tree-sitter` dependency, but completed
successfully. There is no library/CLI package to pack, install, or exercise.

Build sizes: entry JS **35,629 B raw / 13,620 B gzip**, lazy tree-sitter JS
**67,147 B raw / 16,530 B gzip**, CSS **18,966 B raw / 4,970 B gzip**, and
the landing illustration **110,574 B**. The static-app JS, CSS, and image
budgets pass.

## End-to-end browser evidence

Playwright tested the production `dist/` at 1440×900 and 390×844, then smoke
tested the live URL. The tested normal, boundary, malformed, and recovery
paths were:

- The five-file built-in sample indexed as **12 symbols / 10 edges**. The
  graph, relationship-list text alternative, search, source view, clickable
  source reference (`boot` to `createServer`), arrow-key graph traversal, and
  JSON export (`graphite-sample-graph.json`) worked.
- A representative folder-input selection containing TypeScript, Python, Go,
  and Markdown reported **3 accepted files / 9 symbols / 2 edges**; Markdown
  was correctly excluded. This exercises the documented supported languages
  and local heuristic relationship resolution.
- A 2,000,001-byte TypeScript file yielded the clear “No supported files
  found” recovery screen. A malformed JSON file yielded “Index could not be
  opened”; selecting the sample immediately recovered.
- A synthetic directory-input selection of exactly 5,001 supported JavaScript
  files yielded “Folder is too large” before indexing. This confirms the
  all-or-nothing 5,000-file memory boundary repaired in this candidate.
- At 390px all labelled Symbols, Graph, and Source tabs were operable and
  exposed the active `aria-selected` state. `/` focused search. Tab reached
  the skip link, whose visible focus was a 3px solid cobalt outline; graph
  nodes accept Enter/Space and arrow navigation.
- With `prefers-reduced-motion: reduce`, computed `scroll-behavior` was `auto`
  and transitions were reduced to `0.01ms`.
- Local axe-core WCAG 2 A/AA scans of the loaded workspace reported **0
  violations** (therefore 0 serious/critical findings). The live CSP correctly
  prevents inline axe injection, so the axe scan was run against the exact
  byte-identical local build.
- No browser console errors, `pageerror` events, or outbound requests occurred
  during the free workflow. No source upload path was observed; static review
  confirms source/index data is in browser memory only. The only external
  code path is the explicit Sociobot Team checkout/license-verification API.

## PWA, security, privacy, caching, and deployment parity

After service-worker control, an offline reload rendered the landing shell.
An update simulation served a changed worker release to an already controlled
browser profile. It changed the cache from
`graphite-shell-f89051b4334a` to `graphite-shell-verify-update-0001` and
displayed **“A newer Graphite shell is ready. Reload”**. This verifies the
versioned release cache, `skipWaiting`/`clientsClaim`, and update handoff.

The live deployment exactly matches the fresh production build. SHA-256 was
identical for `index.html`, entry JS/CSS, lazy parser JS, hero WebP, `sw.js`,
and `wasm/tree-sitter-typescript.wasm`; the corresponding hashes were:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `8ff31468a9af63913bbc85e76c51bc3e8ccd0ef3a9d93a2c52fcd7b2adabad7b` |
| `assets/index-Brhc4-z6.js` | `0d5432d36770fde2c1c2fba329c1d0fd74b97196a41a71f004172f98425d97ca` |
| `assets/index-BgOku51E.css` | `3d2cb19c99e43316d3a652f075d414fde86f430a0ebdb7f4c57b2d5c6005a2b6` |
| `sw.js` | `1c82da910af01b7ae048992a1825bdaa21f2111ca694db0fd42f611b76e4a52d` |

Live HTTPS responses supplied HSTS, CSP, `X-Content-Type-Options: nosniff`,
strict referrer policy, and a restrictive camera/microphone/geolocation
Permissions Policy. CSP is self-only other than the documented billing API,
and also sets `object-src 'none'`, `base-uri 'self'`, and
`frame-ancestors 'none'`. Hashed `/assets/*` are immutable for one year and
`sw.js` is no-cache. The in-app Privacy page accurately describes local source
handling, service-worker storage, license localStorage, and the absence of
analytics/tracking.

## Defects by severity

No P0, P1, or P2 defects found.

### P3 — grammar WASM HTTP cache is short-lived

`/wasm/tree-sitter-typescript.wasm` and the other un-hashed grammar files are
served with `public, must-revalidate, max-age=30`, while hashed `/assets/*`
receive immutable one-year caching. The release service worker precaches the
grammars, so offline use and normal controlled repeat visits work; this is a
minor first/repeat-load performance improvement opportunity, not a release
blocker. A future build can content-hash grammar filenames or add an explicit
long-lived cache route while retaining release invalidation.

## Known product limits (intentional and labelled)

Cross-file resolution remains name/import heuristic, so aliases, overloads,
dynamic dispatch, reflection, and generated code can yield false or missing
edges. The UI, export data, README, and Terms label this limitation. Large
projects still retain accepted source in memory; the verified guard prevents
partial indexing over 5,000 supported files, but a worker/chunked store would
be the next scalability improvement toward the brief's 200k-LOC target.
