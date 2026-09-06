# Review 4 handoff — Trace calls through an unfamiliar codebase

## Result

Review 4 completed with **FAIL** against implementation candidate
`7a7013df7940840bff2792fa64f044ece0b97139`, documentation baseline
`cb7b576f1ba6a0654e484e883aa3101264f477fb`, and the live site at
`https://code-graph-explorer.sociobot.in`.

No product code was changed. The full evidence and repair guidance are in
`.factory/review-4.md`.

## Findings to repair

1. Add a folder-input fallback to the error screen so **Try another folder**
   works without `showDirectoryPicker`.
2. Complete claim coverage for six public promises: error retry, one-time and
   one-user purchase terms, license storage/request privacy, refunds and
   revocation, search privacy, and real-workspace offline wording.
3. Return a real HTTP 404 for unknown URLs while keeping the designed recovery
   page.
4. Replace the four metaphorical or decorative strings listed in the review
   with direct task words.

## Verification completed

- Fresh live Chromium at 1440 × 900 and 390 × 844.
- One-click demo, populated graph/source output, persistent banner, reset,
  exit, sample export, and production-storage isolation.
- All 35 exact `.factory/claims.json` commands from a clean checkout.
- `npm test`: 8 unit and 41 browser tests passed.
- `npm run build`: passed and produced `dist/`.
- Normal TS/Python/Go intake, malformed JSON, 2 MB boundary, 5,001-file
  boundary, recovery, empty/invalid license, offline reload, and links.
- Live axe WCAG 2 A/AA scans on Home, Demo, Privacy, Terms, and not-found:
  zero violations.
- Factory URL verifier: passed with zero console errors.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.7 s, CLS 0, TBT 70 ms.
- Live/clean SHA-256 parity for HTML, service worker, JS, CSS, and TypeScript
  grammar.

## Evidence files

- Repository report: `.factory/review-4.md`
- Required copy: `/work/.evidence/qa-report.md`
- Machine result: `/work/.evidence/qa-result.json`
- Fresh screenshots: `/work/.evidence/review4-desktop-home.png`,
  `/work/.evidence/review4-phone-home.png`, and phone/desktop demo images.
- URL verifier output: `/work/.evidence/verify-url/`
- Lighthouse JSON: `/work/.evidence/lighthouse-review4.json`

## Next verification

After repair, rerun every declared claim command from a new clone, the full
suite and build, then repeat the live fallback-recovery and HTTP-status checks.
Do not declare PASS until the finding count and untested claim count are both
zero.
