# Graphite

Graphite is a browser-based code graph for engineers onboarding to, debugging,
or refactoring an unfamiliar codebase. Open a codebase and move between
functions, calls, imports, and source without uploading files.

Try the isolated five-file demo at
`https://code-graph-explorer.sociobot.in/?demo=1`. Reset restores the bundled
files and selected function. Start for real discards the demo and returns to
the folder intake.

## What Graphite can inspect

- Graphite parses TypeScript/TSX, JavaScript/JSX, Python, and Go in the browser.
- Search functions and files, then open a two-level code graph, relationship
  list, or source reference.
- Import or export a Graphite index as JSON.
- Press `/` to search. Use arrow keys to move between graph nodes and pane tabs.
- The demo opens offline after the first online visit.

## Accuracy and limits

Calls within one file use exact names. Cross-file calls use imported or unique
names and are labelled as estimates. Graphite can miss calls made through
dynamic code, reflection, generated files, or complex types.

Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`,
`coverage`, or `__pycache__` are ignored. Files over 2 MB are ignored. Folders
with more than 5,000 supported files are rejected without keeping a partial
codebase.

## Privacy and access

Selected source and the active index stay in browser memory. The free workflow
uses no account, analytics, hosted source index, external fonts, or third-party
scripts. The app files are cached for offline use, but opened source is not.
Local exploration and Graphite index export are free. No paid purchase is
offered in this release.

See [Privacy](https://code-graph-explorer.sociobot.in/privacy) and
[Terms](https://code-graph-explorer.sociobot.in/terms).

## Run Graphite locally

```sh
npm ci
npm test
npm run build
npm run preview
```

`npm test` runs unit, claim, browser, mobile, offline, and accessibility checks.
`npm run build` type-checks the app and writes the static artifact to `dist/`.
No environment variable is required.

## Deploy the static artifact

Deploy the `dist/` folder to Azure Static Web Apps. The repository includes the
SPA fallback, security headers, cache rules, service worker, sitemap, and robots
file. Do not deploy billing, DNS, or infrastructure from this repository.

## License

MIT. See [LICENSE](LICENSE).
