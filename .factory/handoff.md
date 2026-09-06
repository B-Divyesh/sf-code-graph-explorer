# Review 5 handoff — Trace calls through an unfamiliar codebase

## Result

**FAIL — one major finding and two incompletely tested public claims remain.**

- Implementation candidate: `5e33f7b8bb8d0f7bc790644bbfe2c8f774a4db7b`
- Documentation baseline: `000f543fbc7edb87004eaa96c259079f7aa859f1`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Full report: `.factory/review-5.md`

No product code was changed during this review.

## Finding to repair

The release worker precaches `staticwebapp.config.json`. Azure consumes that
file and returns 404 for its public URL, so the worker's all-or-nothing install
rejects. A fresh browser has no active registration or controller, and offline
reload fails. This contradicts both `offline-reload` and
`real-workspace-offline` even though their local Vite-preview tests pass.

Exclude deployment-only files from the precache or use an explicit public
asset manifest. Run the offline claims against a production-like server that
does not publish the Azure configuration file, then deploy and repeat the
fresh live offline checks.

## Verification completed

```sh
npm ci
# Every exact command in .factory/claims.json, separately
npm test
npm run build
```

- 40/40 declared commands returned zero; two offline tests are incomplete for
  the deployed environment.
- `npm test` passed: 8 unit and 47 browser tests.
- The build passed and produced `dist/` within JavaScript, CSS, and image
  budgets.
- Fresh desktop and phone online flows, demo reset/isolation, normal input,
  malformed-index recovery, size boundaries, keyboard, focus, reduced motion,
  200% page scale, legal pages, links, privacy removal, and the designed HTTP
  404 passed.
- Live axe scans found zero WCAG 2 A/AA violations on eight checked states.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices,
  and 100 SEO; LCP 1.6 s, TBT 80 ms, CLS 0.
- Candidate and live hashes match for the key release artifacts.

## Evidence

Review evidence is in `/work/.evidence/review-5/`. The root evidence report and
result JSON mirror `.factory/review-5.md` and its FAIL verdict.
