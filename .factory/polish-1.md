# Perfection-loop polish 1 — Graphite

Base reviewed: `6620941edf39f1f190a9b17cb58bdb9284188f25`. This document maps every
adversarial-review finding, plus the earlier cache-policy minor, to the shipped
change and its verification evidence.

| Finding | Change made | Evidence |
| --- | --- | --- |
| BLOCKING 1 — phone panes | The phone workspace uses an explicit active-pane layer. Inactive panes are non-interactive and off-canvas; source scrolling runs only when Source is active. | `@claim:mobile-panes`; `tests/accessibility.spec.ts` desktop/phone first-screen check; `.factory/evidence/demo-mobile.png`; live `/?demo=1` recheck recorded below. |
| BLOCKING 2 — demo sandbox | `?demo=1` and `/demo` seed the five-file in-memory demo. The persistent banner has Reset demo and Start for real; exit discards the workspace. | `@claim:five-file-demo`, `@claim:demo-reset`, `@claim:demo-isolation`, `@claim:offline-reload`; `.factory/evidence/demo-mobile.png`; live `/?demo=1`. |
| BLOCKING 3 — first-screen audience/action | The hero now says “Trace calls through an unfamiliar codebase,” names onboarding/debugging/refactoring engineers, and makes “Try it with sample data” primary. The scale keeps that action in the initial 1440×900 and 390×844 viewport. | `first screen keeps the sample action in view on desktop and phone`; `.factory/evidence/landing-desktop.png`, `.factory/evidence/landing-mobile.png`; live `/`. |
| BLOCKING 4 — claims registry | `.factory/claims.json` lists 28 observable claims, each with one tagged test and a clean-demo sandbox. | every command in `.factory/claims.json`; `npm test`; live `/?demo=1`. |
| BLOCKING 5 — routes/404 | Client routing now handles `/demo`, `/privacy`, `/terms`, and unknown paths; each has its own title, one h1, and focused/announced client navigation. | `@claim:route-contract`; `.factory/evidence/not-found.png`; live `/demo`, `/privacy`, `/terms`, `/definitely-missing`. |
| BLOCKING 6 — dead checkout | The unavailable product registration is handled honestly: no Team price, checkout, or gated review-packet control is shown. Free local graph and JSON export remain enabled. | `@claim:free-core`; live `/` and `/?demo=1`. |
| MAJOR 7 — metadata, skeleton, footer | Added canonical, OG/Twitter, apple touch metadata, sitemap routes, header Demo link, route focus announcement, complete footer, preview, three-step method, and plain limitations section. | `browser smoke: no console errors, metadata and legal links are present`, `@claim:route-contract`; landing/404 screenshots; live route checks. |
| MAJOR 8 — wording/terms | Rewrote landing and README around one vocabulary: codebase, folder, code graph, Graphite index, demo, and sample data. The catalog sentence is verb-first and under 120 characters. | `.factory/copy-audit.md`; `@claim:source-stays-local`, `@claim:graph-depths`, `@claim:json-roundtrip`, `@claim:heuristic-resolution`; live `/`. |
| Earlier P1 — stale worker | The generated service worker uses a build-derived release cache, network-first navigations, and update activation. | `@claim:offline-reload`; `npm test`; live `/?demo=1` offline recheck. |
| Earlier P1 — folder limit | All folder intake paths reject more than 5,000 accepted files before indexing; dropped directory reads consume every entry batch. | `@claim:folder-file-limit`, `@claim:ignored-folders`; `npm test`; local and live demo smoke. |
| Earlier P3 — grammar cache | Azure Static Web Apps now serves `/wasm/*` for one week with `must-revalidate`; the versioned worker still precaches grammar assets for offline use. | `@claim:build-contract`; post-deploy `curl -I /wasm/tree-sitter-typescript.wasm`. |

## Screenshots

- `.factory/evidence/landing-desktop.png` — first screen at 1440×900.
- `.factory/evidence/landing-mobile.png` — first screen at 390×844.
- `.factory/evidence/demo-mobile.png` — seeded demo graph at 390×844.
- `.factory/evidence/not-found.png` — Graphite-style not-found route at 390×844.

## Post-deploy recheck

Completed after the deployment for this work order. The exact deployment id,
commit, cold-live checks, header check, and quality-gate results are recorded
in `.factory/handoff.md`.
