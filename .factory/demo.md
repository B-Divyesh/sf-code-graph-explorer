# Graphite demo sandbox

- Direct URL: `https://code-graph-explorer.sociobot.in/?demo=1`.
- Alias: `/demo` opens the same isolated state.
- Seed: five TypeScript files for a small local server. They contain 12 symbols
  and 10 relationships across boot, configuration, routing, and health checks.
- Storage: the demo is rebuilt from bundled constants and held only in memory.
  It does not read or write localStorage, sessionStorage, IndexedDB, or OPFS.
- Reset: **Reset demo** rebuilds the five original files and selects `boot`.
- Exit: **Start for real** discards the in-memory demo and opens the real folder
  intake.
- Review packet: **Preview** exports a sample-only HTML packet. It never reads
  a saved Team license and does not unlock paid export for real codebases.
- Offline: after one online visit installs the service worker, the direct demo
  URL reloads offline and rebuilds the same bundled seed.
