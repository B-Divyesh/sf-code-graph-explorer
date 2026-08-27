# Graphite — local code graph explorer

Graphite is a browser-based call and dependency graph for engineers onboarding
to, debugging, or refactoring an unfamiliar codebase. Open a folder and move
between functions, callers, callees, imports, and source without uploading the
repository or installing an IDE extension.

It supports TypeScript/TSX, JavaScript/JSX, Python, and Go. Tree-sitter WASM
extracts syntax in the browser; cross-file call resolution uses deliberately
labelled name-and-import heuristics. Dynamic dispatch, reflection, generated
code, and complex type resolution can produce missing or false edges.

## Features

- Folder picker, drag-and-drop, and a built-in five-file sample
- Incremental, main-thread-friendly local indexing with ignored dependency and
  build directories
- Searchable symbols and modules, depth-limited SVG focus graph, accessible
  relationship list, and clickable source references
- Portable Graphite JSON import/export
- Offline app shell; active source is held only in browser memory
- Keyboard navigation (`/` focuses search, arrows move through graph nodes)
- Optional one-time Team license for standalone HTML review-packet export;
  local exploration and JSON export remain free

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

The exact production build command is `npm run build`. It copies the four
Tree-sitter grammars and runtime into the static asset tree, type-checks the
app, and writes deployable output to `dist/` with `dist/index.html` at its root.

No environment variable is required for the free app. The billing API defaults
to `https://api.sociobot.in/api/v1`; staging can set:

```sh
VITE_BILLING_API_URL=https://pilot-api.sociobot.in/api/v1 npm run build
```

## How indexing works

Source files are parsed locally with language-specific Tree-sitter WASM
grammars. Definitions, lexical calls, and imports become a versioned in-memory
index. Calls resolve exactly within a file and heuristically across files by
unique/exported name; imports resolve against normalized relative paths. Every
uncertain edge is marked `heuristic` in the UI and JSON.

Folders named `.git`, `node_modules`, `vendor`, `dist`, `build`, `.next`,
`coverage`, or `__pycache__` are ignored. Individual files over 2 MB and projects
beyond 5,000 supported files are skipped to protect browser memory.

## Privacy and deployment

The application has no analytics, hosted source index, external fonts, or
runtime CDN. The only external request is an explicit Team checkout or license
verification. See `/privacy` and `/terms` in the app.

The `dist/` directory is ready for Azure Static Web Apps. Do not deploy billing,
DNS, or infrastructure from this repository.

## License

MIT. See [LICENSE](LICENSE).
