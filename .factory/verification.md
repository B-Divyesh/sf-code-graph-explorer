# Independent verification — FAIL

- Verified commit: `c2c4a482a3f485b2002ea1062bddbb5af630f2b6`
- Verified URL: `https://code-graph-explorer.sociobot.in/`
- Date: 2026-08-27
- Verdict: **FAIL** — the normal local graph workflow works, but PWA update
  behavior and the large-repository guard do not meet the brief/contract.

## Clean checkout and quality gates

Verification used a fresh detached clone of the published repository at the
commit above (`/tmp/codegraph-verify-TLtei9`), Node `v22.23.2`, npm `10.9.8`.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 57 packages audited, 0 vulnerabilities |
| `npm test` | Passed; Vitest 3/3 tests |
| Type check | Passed as part of `npm run build` (`tsc --noEmit`) |
| Lint | No lint script/configuration is provided |
| Exact production build | Passed: `npm run build` produced `dist/` |
| Build asset budget | Passed: entry JS 34,124 B raw / 13,053 B gzip; lazy parser JS 67,147 B raw; CSS 18,687 B raw; hero 110,574 B. Initial JS is below 200 KB, CSS below 50 KB, and hero below 300 KB. |

Vite emitted its existing warnings about browser-externalized `fs`/`path` in
`web-tree-sitter` and `eval` in that dependency; the build still completed.
There is no library/CLI package API to pack and test.

## End-to-end evidence

Playwright exercised the production build at desktop (1440x900) and mobile
(390x844), then repeated the primary flow against the live URL.

- Normal flow: the built-in sample indexed as **5 files, 12 symbols, 10
  edges**. Its focus graph, relationship text alternative, source view,
  search (`/` shortcut), graph-arrow navigation, JSON export, and privacy
  route all worked.
- Multi-language input: TypeScript, Python, and Go definitions/calls were
  parsed from a four-file input; an `.md` input was excluded. The workspace
  reported 4 files, 10 symbols, 3 resolved edges.
- Boundary/recovery: a 2,000,001-byte `.ts` file was rejected with the
  supported-files error; selecting the sample immediately recovered. Malformed
  JSON and a JSON object with an invalid top-level schema both displayed an
  actionable import error, and the sample recovered afterward.
- Mobile: all three labelled Symbols/Graph/Source tabs worked at 390px.
- Keyboard/focus: Tab exposed the skip link; it became visibly on-screen.
  `/` focused search and ArrowRight moved graph-node focus. CSS supplies a
  3px visible focus outline.
- Motion/accessibility: reduced-motion changed smooth scroll to `auto` and
  transition duration to `0.01ms`. Local axe-core WCAG 2 A/AA scans had zero
  violations (and therefore zero serious/critical findings) on landing and
  loaded mobile workspace. The live CSP correctly blocked an inline axe
  injection, so the axe result is from the byte-identical local build.
- Runtime: no browser console errors, page errors, or outbound requests were
  observed during the free core workflow on either local or live app. Static
  inspection finds no analytics, remote fonts, or runtime CDN; the only
  permitted external endpoint is the explicit Sociobot billing API.
- Offline: after service-worker control, an offline reload showed the landing
  page successfully.

## Deployment parity, security, and caching

The live index and sampled artifacts have exact SHA-256 equality with the
fresh local build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `eacc3ad00e93d84834d90b1e7fff505de49555b212aba63706052d37134f9a1c` |
| `assets/index-BLYzXTr0.js` | `60ddb84fd3970683c681cb281bfa6e16a7db46afbb1d4dbcd370c017b051c4f1` |
| `assets/index-DVvYkwuE.css` | `28af1cc36685a8f821f8143a3100440a745f63485bf421315d714c3aeb179a06` |
| `assets/tree-sitter-C5btAlQU.js` | `77fd578ddda07567707b422194057e69322860a9bb60ca7579a8de949410b188` |
| `assets/code-cartography.webp` | `de43edabb34c2f5211e34c648beb99ee095081b36977cfd9abb24e0e55ab1367` |
| `sw.js` | `c4bafd7f8053fa48496f0f9b5d12aac2f603d561f5636dcf29e260585d1287b6` |
| `wasm/tree-sitter-typescript.wasm` | `8515404dceed38e1ed86aa34b09fcf3379fff1b4ff9dd3967bcd6d1eb5ac3d8f` |

Live HTTP responses were HTTPS 200 and delivered HSTS, CSP, `nosniff`,
Referrer-Policy, and Permissions-Policy. CSP is appropriately self-only
except for the documented billing API; `frame-ancestors 'none'`,
`object-src 'none'`, and `base-uri 'self'` are present. Hashed JS/CSS/hero
assets are `public, max-age=31536000, immutable`. The un-hashed wasm grammar
is only `max-age=30`, which is a performance/caching gap noted below.

## Defects

### P1 — service-worker updates are stale indefinitely

`public/sw.js` uses the fixed cache name `graphite-shell-v1` and a cache-first
handler for every same-origin GET, including `/` and `/index.html`. It caches
the shell but has no build-derived cache version or network-first navigation
strategy.

An update simulation first installed the candidate, then intercepted a
supposedly updated `/` response. Reload made **0** network requests for that
updated document, retained cache `graphite-shell-v1`, retained the existing
`sw.js` as active worker, and rendered the old title, `Graphite — local code
graph explorer`. Thus users with an existing worker do get offline reload,
but will not receive a new shell when a deployment changes app assets without
also manually changing `sw.js`. This fails the required service-worker update
test and makes future fixes/deployments unreliable.

### P1 — 5,000-file safety boundary is bypassed by the directory input

The brief explicitly calls out browser memory pressure; README claims that
projects beyond 5,000 supported files are skipped. `walkDirectory()` applies
that limit only to the File System Access path. `readFileList()` has no cap.

An actual change event on the directory input with 5,001 tiny supported `.js`
files completed and rendered **5,001 files / 10,002 symbols / 0 edges**.
This is not merely a display issue: all 5,001 contents proceed to indexing and
are retained. Directory drag/drop also has no equivalent cap; additionally it
calls `DirectoryReader.readEntries()` only once, so browsers that return
directory entries in batches can silently omit later entries.

### P3 — grammar cache policy misses the stated static-app cache strategy

`/wasm/tree-sitter-typescript.wasm` (2,342,690 B) is neither hashed nor under
the `/assets/*` immutable-cache rule. The live response is `max-age=30`.
Other grammars are affected by the same route policy. This is not the cause of
the FAIL, but it weakens repeat-load performance for the product's core parser.

## Required resolution before release

1. Version/precache the service worker from the build (or use network-first
   navigation) and verify an already-controlled client updates to a changed
   shell without clearing storage.
2. Enforce the 5,000-file boundary consistently for File System Access,
   directory input, and drag/drop; report skipped files to the user. Iterate
   `readEntries()` until empty when walking dropped directories.
3. Give grammar WASM files build hashes or an explicit appropriate long-lived
   cache policy, then re-run the budget/cache check.
