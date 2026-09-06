# Verification 5 handoff — Trace calls through an unfamiliar codebase

## Result

**PASS — zero findings and zero untested public claims.**

- Implementation SHA: `0d2a14c507a4011ebc703e4d94c9ed5685bd84e1`
- Documentation SHA: `c8891ebc80e8c79808e14f23e7f800a94501dee6`
- Product version: `1.2.1`
- Live URL: `https://code-graph-explorer.sociobot.in`
- Report: `.factory/verification-5.md`

## What was verified

A clean checkout ran `npm ci`, every one of the 40 exact declared claim
commands independently, `npm test`, and `npm run build`. All passed. The
aggregate suite has 8 unit and 47 browser tests. A fresh live phone and desktop
browser confirmed the first screen, realistic one-click demo, persistent demo
label, reset, isolated exit, keyboard/mobile behavior, invalid and boundary
errors, recovery, legal routes, privacy, live checkout claim, and designed HTTP
404.

Fresh live service-worker contexts reloaded both the sample demo and a real
workspace offline. The real shell did not retain marked source. The fresh build
and live deployment have matching SHA-256 values for `index.html` and `sw.js`.

Live WCAG 2 A/AA axe scans had zero violations on Home, phone Demo, Privacy,
Terms, and 404. Lighthouse mobile scored 100 Performance, 100 Accessibility,
100 Best Practices, and 100 SEO. Initial entry JS is 43.54 KB raw / 15.64 KB
gzip; CSS is 24.70 KB raw / 6.04 KB gzip.

## How to verify

```sh
npm ci
npm test
npm run build
# Run each exact command listed in .factory/claims.json independently.
```

The direct demo is `https://code-graph-explorer.sociobot.in/?demo=1`.

## Known boundaries

Cross-file matches are labelled estimates; dynamic calls can be absent. Opened
source is held only in browser memory, so offline reload returns the shell, not
a retained real workspace. These are intended product limits, not open defects.
