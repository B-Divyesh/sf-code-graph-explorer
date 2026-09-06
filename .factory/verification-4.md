# Verification 4 — trace calls through an unfamiliar codebase

## Verdict

**PASS**

The reviewed product has **zero findings** and **zero untested public claims**.

- Implementation candidate: `5e33f7b8bb8d0f7bc790644bbfe2c8f774a4db7b`
- Documentation baseline: `a52b9809638eef5003c308cf4c17c31a651bb352`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Date: 2026-09-06

The implementation and documentation SHAs differ because `a52b980` is a
documentation-only verification record after the implementation commit.

## First screen

Fresh Chromium contexts opened the live landing page at 1440 × 900 and 390 ×
844 without scrolling.

| Check | Desktop | Phone |
| --- | --- | --- |
| Job | “Trace calls through an unfamiliar codebase.” | Same |
| Audience | Engineers onboarding, debugging, or refactoring unfamiliar code | Same |
| First action | “Try it with sample data” | Same |
| Action bottom | 631 px of a 900 px viewport | 588 px of an 844 px viewport |

The title is `Graphite — trace calls in local codebases`. The first screen has
one h1, direct wording, the action outcome, and the three privacy/offline/price
facts. No home-page console or page errors occurred in either fresh context.

## Demo and product paths

The one-click sample was entered from both first screens. It opened a realistic
five-file local server with 12 symbols, 10 relationships, four visible focus
graph nodes, and source containing `createServer`. The selected symbol was
`boot`. The persistent “Demo — sample data, nothing is saved” label, Reset demo,
and Start for real controls were present. Reset restored `boot`; a seeded real
localStorage sentinel stayed unchanged. Free-demo traffic was same-origin only.

The repaired recovery route was also exercised live in a phone context without
`showDirectoryPicker`: malformed Graphite JSON → Try another folder → browser
file input → `recovered.ts` workspace. The final workspace reported one file,
two symbols, and no relationships. An invalid license produced the clear inactive
notice while the free Team entry point remained available.

Normal, invalid, boundary, privacy, keyboard, offline, and reduced-motion paths
are covered by the clean browser suite and the 40 isolated claim runs. This is a
static web app: backend tenant isolation, restart persistence, health endpoints,
and product-owned 429/Retry-After behavior do not apply. It has no CLI, library,
or desktop artifact.

## Clean checkout and claims

A fresh clone was detached at the implementation candidate in
`/tmp/code-graph-explorer-verify-4.F6wtV3` using Node `v22.23.2` and npm
`10.9.8`. `npm ci` installed 62 packages and reported zero vulnerabilities.

Every exact command declared in `.factory/claims.json` was run separately. All
**40/40 passed**. Registry integrity also passed: 40 unique IDs, exactly one
`@claim:<id>` tag for every ID, and no unregistered claim tag.

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
| `folder-error-recovery` | PASS | `no-third-party-runtime` | PASS |
| `build-contract` | PASS | `mit-license` | PASS |
| `test-contract` | PASS | `team-purchase` | PASS |
| `team-license-privacy` | PASS | `revoked-license` | PASS |
| `review-packet-export` | PASS | `route-contract` | PASS |
| `mobile-panes` | PASS | `mobile-targets` | PASS |
| `search-stays-local` | PASS | `real-workspace-offline` | PASS |

The public landing, workspace, legal, and README copy was cross-checked against
the registry and current copy audit. No retained public claim is missing an
outcome test.

## Quality, accessibility, routes, and privacy

- `npm test` passed: 8 Vitest tests and 47 Playwright browser tests.
- `npm run build` passed and produced `dist/`. Entry JavaScript is 43.54 KB raw
  / 15.64 KB gzip; lazy parser JavaScript is 67.15 KB raw / 16.53 KB gzip; CSS
  is 24.70 KB raw / 6.04 KB gzip; the landing image is 110,574 B.
- Live axe WCAG 2 A/AA scans had zero serious or critical violations on Home,
  Demo, Privacy, Terms, and the not-found page.
- Phone keyboard checks are covered by the browser suite: `/` opens and focuses
  Search, pane tabs and graph nodes support arrows, and visible controls meet
  the 44 × 44 px target baseline. The suite also verifies focus return from the
  Team dialog, route focus, skip-link behavior, and reduced-motion styles.
- Home, Demo, Privacy, Terms, and the 404 have distinct route titles, one h1,
  a main landmark, shared header/footer, legal links, canonical metadata, and
  working address-bar routes. `robots.txt` and `sitemap.xml` are live.
- `/verify-4-missing` returned **HTTP 404**, title `Page not found — Graphite`,
  one h1, one main landmark, and Home/sample recovery links. Its HTTP 404
  console resource entry is expected, not an application error.
- Live responses expose the intended CSP, `nosniff`, referrer policy, and
  restrictive permissions policy. Free-demo requests remained same-origin.
  The recorded-fixture claim tests prove source/index/search isolation and the
  explicitly requested Team verification behavior without exposing a credential.

The direct-demo and real-workspace offline claims passed from separate browser
contexts after service-worker control. The generated worker has versioned cache
cleanup and the existing update notice path; no stale-worker regression was
observed.

## Deployment parity

The clean candidate build and live deployment matched exactly for these key
artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `d7ae465bd2fe2591d591304f1df635ed936a483b399becb0ec5e28bf20629184` |
| `404.html` | `bc837c595eecddec1f27f50e31a952dbde05ae1eacf7ca2d2cf88ef4977e7fbb` |
| `sw.js` | `7dbc7d8d08d4b79ad2ced936390a53f4c95487629ad5ba5810f50c448f45eca4` |
| entry JavaScript | `cc28fe239dda3e35fecbfff226f95c710123636ae6425acde40e222b61c47acd` |
| entry CSS | `5a03c4a119a541a108569eaeb897129b99ebc4f290953ee46993403b5c92e4ae` |
| landing image | `de43edabb34c2f5211e34c648beb99ee095081b36977cfd9abb24e0e55ab1367` |

## Earlier findings

All earlier reports were inspected, including their minor findings.

| Earlier finding group | Current disposition |
| --- | --- |
| Review 1 B1–B6 and M7–M8 | Fixed: phone panes, direct isolated demo, first-screen audience/action, complete claims, true recovery page, live checkout, routing/metadata/focus/footer, and plain copy all pass current checks. |
| Review 2 F-2-1 through F-2-10 | Fixed: phone shortcut/targets, complete claim outcomes, exact and cross-file resolution coverage, test/build/license claims, and Team review-packet flow all pass. |
| Earlier verification P1 service worker and P1 folder limit | Fixed: separate offline contexts pass, release worker is live, and the 5,001-file all-or-nothing path is covered. |
| Earlier verification P3 grammar cache | Fixed: the build contract verifies one-week revalidation for shipped grammar WASM. |
| Review 4 F-4-1 | Fixed: live fallback recovery reaches a populated workspace. |
| Review 4 F-4-2 | Fixed: all six gaps now have registered outcome tests; 40/40 isolated commands pass. |
| Review 4 F-4-3 | Fixed: live unknown URL returns deliberate HTTP 404 with the designed recovery page. |
| Review 4 F-4-4 | Fixed: current headings say Indexing, Export a review packet, Page not found, and Code graph example. |
| Review 3 and polish reports | No open finding remained; their stated fixes are retained by the above checks. |

## Evidence

- `/work/.evidence/verify-4/live-desktop-home.png`
- `/work/.evidence/verify-4/live-desktop-demo.png`
- `/work/.evidence/verify-4/live-phone-home.png`
- `/work/.evidence/verify-4/live-phone-demo.png`
- `/work/.evidence/verify-4/live-404.png`

## Known product limits

Heuristic cross-file matching can miss dynamic calls or ambiguous names. The
product labels estimated relationships. Accepted source and its active index
remain in browser memory; the offline shell does not retain opened source.
These are documented product boundaries, not verification findings.
