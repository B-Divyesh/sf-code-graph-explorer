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
- A $24 one-time Team license exports a standalone HTML review packet for one
  focused symbol and its visible relationships.
- Press `/` to search. Use arrow keys to move between graph nodes and pane tabs.
- The demo opens offline after the first online visit.

## Accuracy and limits

A same-file call resolves to the same-file definition. Cross-file calls resolve
through named imports or a unique definition. Ambiguous names stay unresolved,
and cross-file matches are labelled as estimates. Dynamic calls can be absent
from the graph.

Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`,
`coverage`, or `__pycache__` are ignored. Files over 2 MB are ignored. Folders
with more than 5,000 supported files are rejected without keeping a partial
codebase.

## Privacy and access

Selected source and the active index stay in browser memory. The free workflow
uses no account, analytics, hosted source index, external fonts, or third-party
scripts. The app files are cached for offline use, but opened source is not.
Local exploration and Graphite index export are free. No paid purchase is
required for these tools. Team costs $24 once for one user. It adds standalone
local HTML review-packet export. Sociobot handles checkout, with Dodo as the
merchant of record.

See [Privacy](https://code-graph-explorer.sociobot.in/privacy) and
[Terms](https://code-graph-explorer.sociobot.in/terms).

## Run Graphite locally

```sh
npm ci
npm test
npm run build
npm run preview
```

`npm test` runs the unit and Playwright browser suites, including claim, mobile,
offline, and accessibility checks. `npm run build` type-checks the app and
writes the static artifact to `dist/`.

## Deploy the static artifact

Deploy the `dist/` folder to Azure Static Web Apps. The repository includes the
SPA fallback, security headers, cache rules, service worker, sitemap, and robots
file. Do not deploy billing, DNS, or infrastructure from this repository.

## License

MIT. See [LICENSE](LICENSE).
