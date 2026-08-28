# Perfection-loop polish 2 — Graphite

Reviewed base: `24ba81f559a164717dc8431194667555d8208de6`.
Repair implementation: `7a7013d`. Production URL:
`https://code-graph-explorer.sociobot.in`.

Every review-2 finding and every earlier finding was rechecked against the
deployed build. No finding is deferred.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 — phone `/` shortcut | On phones, `/` switches from Graph to Symbols, renders the pane, then focuses Search on the next frame. Pane-tab Home, End, Left, and Right behavior is also asserted. | `@claim:keyboard-navigation`; `.factory/evidence/round2-live-demo-cold-mobile.png`; cold live `/?demo=1` at 390×844. |
| F-2-2 — partial claim tests | The privacy test now inputs uniquely marked real source and inspects request URLs/bodies, methods, localStorage, sessionStorage, IndexedDB, OPFS, and Cache Storage. TSX/JSX, all eight ignored folders, tab arrows, named import relationships, and the narrowed dynamic-call limitation are exercised. | `@claim:source-stays-local`, `supported-languages`, `ignored-folders`, `keyboard-navigation`, `open-codebase`, and `resolution-limits`; 35/35 registry commands passed independently from `/tmp/code-graph-polish2.L2DV5s`. |
| F-2-3 — phone targets | Compact controls and Depth are at least 44 px. The mobile graph is a horizontally scrollable drafting strip whose SVG nodes render above 44 px high. Short visible labels replace icon-only export controls. | `@claim:mobile-targets`; `.factory/evidence/round2-demo-mobile.png`; live 390×844 measurement found zero undersized visible targets. |
| F-2-4 — local resolution claim | Added a registered unit claim with duplicate names in two files; the same-file definition must win with exact confidence. | `@claim:exact-local-resolution`. |
| F-2-5 — cross-file rule | Resolution now prefers a named import, then a unique definition, and leaves ambiguous duplicate names unresolved. Copy and the claim registry state that exact rule. | `@claim:cross-file-resolution` and `@claim:heuristic-resolution`. |
| F-2-6 — test inventory | Registered the npm test contract and assert the unit/Playwright scripts plus claim, offline, mobile, and axe spec inventory. | `@claim:test-contract`; clean-clone `npm test`: 8 unit + 41 Playwright tests passed. |
| F-2-7 — environment claim | Removed the unneeded “No environment variable is required” promise instead of carrying an unproved setup claim. | README claim cross-check; `.factory/copy-audit.md`. |
| F-2-8 — deployment inventory | The build claim now checks the SPA fallback, CSP and security headers, cache routes, generated worker, sitemap, robots file, and Demo sitemap URL. | `@claim:build-contract`; live headers and byte-parity check. |
| F-2-9 — MIT statement | Added the standard title to `LICENSE` and bound README/Terms wording to an exact file-content claim. | `@claim:mit-license`. |
| F-2-10 — Team review packet | Registered the live Sociobot product at $24 once. Added license return capture, daily verification, restore/remove controls, invalid-license locking, a local standalone HTML packet, source excerpt, relationships, landing tier, and legal copy. Demo offers a sample-only preview and never reads license keys. | `@claim:team-purchase`, `@claim:review-packet-export`, `@claim:demo-isolation`; `.factory/evidence/round2-team-mobile.png`; live checkout opened Dodo with “Graphite Team review packet” and `$24.00`. |

## Earlier findings re-audited

| Finding | Change/status | Evidence |
| --- | --- | --- |
| Review 1 BLOCKING 1 — phone panes | Preserved the explicit phone-pane layer and prevented inactive source scrolling. | `@claim:mobile-panes`; `.factory/evidence/round2-live-demo-cold-mobile.png`; live Symbols → Graph → Source → Graph bounds passed. |
| Review 1 BLOCKING 2 — isolated demo | Preserved direct `?demo=1` and `/demo`, persistent banner, Reset, Start for real, in-memory seed, offline reload, and production-storage isolation. Team preview remains sample-only. | `@claim:five-file-demo`, `demo-reset`, `demo-isolation`, `offline-reload`; live storage sentinels in local/session/IndexedDB/OPFS/Cache Storage were unchanged. |
| Review 1 BLOCKING 3 — first-screen audience/action | Preserved the job headline, engineer situation, primary sample action, outcome note, and three tested privacy/offline/price facts in the 390×844 first screen. | `first screen keeps the sample action in view on desktop and phone`; `.factory/evidence/round2-live-home-mobile.png`; live `/`. |
| Review 1 BLOCKING 4 — claim registry | Expanded the registry to 35 unique claims and 35 unique tags, with one tag per claim. | Registry-integrity script and all 35 commands from a clean clone. |
| Review 1 BLOCKING 5 — missing routes | Preserved distinct Demo, Privacy, Terms, and designed 404 routes with titles, one h1, canonical metadata, route focus, and Back behavior. | `@claim:route-contract`; `.factory/evidence/round2-live-404-mobile.png`; live `/definitely-missing`. |
| Review 1 BLOCKING 6 — dead checkout | Replaced the former 404 with the registered Sociobot checkout and exact live Dodo product/price. | `@claim:team-purchase`; live checkout HTTP 200 after redirect. |
| Review 1 MAJOR 7 — structure/metadata/focus/footer | Preserved route-aware title/canonical/OG/Twitter metadata, header Demo link, route announcements, full landing sequence, legal links, Param Factory credit, and build id. Added the required paid tier. | `browser smoke: no console errors, metadata and legal links are present`; `@claim:route-contract`; live route crawl. |
| Review 1 MAJOR 8 — copy/terms | Retained one vocabulary and short first-screen wording; narrowed the untested limitation list and added plain paid terms. | `.factory/copy-audit.md`; no sentence over 22 words and no banned term. |
| Verification P1 — stale worker | Preserved the build-derived cache, network-first navigation, update activation, and old-cache cleanup. | `@claim:offline-reload`; live cold install then offline `/demo` reload. |
| Verification P1 — 5,000-file bypass | Preserved the all-or-nothing limit across picker, file input, and dropped directory batches. | `@claim:folder-file-limit`; clean-clone test rejected 5,001 files without a workspace. |
| Verification/Polish P3 — grammar caching | Preserved the one-week revalidating WASM route. | `@claim:build-contract`; live `/wasm/tree-sitter-typescript.wasm` configuration. |

## Production evidence

- Deployment ID: `672a6923-4df3-4bae-8595-52f3cc33cc9b`.
- `verify-url.sh`: HTTPS 200, correct title/lang/main/h1/alt labels, zero
  console errors.
- Local-to-live SHA-256 parity: `index.html`
  `26bd385d56605e8e959672466c3c2e5fef9e3abed2e5ec7e1cb2e0729d25cefd`;
  `sw.js` `dc2c20b7bedf0ae921255837892aabc747af44069eeef2fe012697b97e9d626f`.
- Live axe scans with CSP bypass on Home, Demo, Privacy, Terms, and 404:
  zero serious or critical findings.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.7 s, TBT 130 ms, CLS 0.
- Build budgets: entry JS 43.42 KB raw / 15.65 KB gzip; lazy parser JS
  67.15 KB raw / 16.53 KB gzip; CSS 24.70 KB raw / 6.04 KB gzip; hero
  110.6 KB.

## Screenshots

- `.factory/evidence/round2-live-home-mobile.png`
- `.factory/evidence/round2-live-demo-cold-mobile.png`
- `.factory/evidence/round2-live-404-mobile.png`
- `.factory/evidence/round2-team-mobile.png`
- `.factory/evidence/round2-landing-desktop.png`
