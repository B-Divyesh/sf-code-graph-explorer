import './styles.css';
import { buildIndex, languageFor, validateIndex } from './parser';
import { applyDirectoryFileLimit, directoryLimitMessage, exceedsDirectoryFileLimit } from './intake';
import type { CodeIndex, CodeSymbol, FileInput, GraphEdge } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const BILLING_BASE = import.meta.env.VITE_BILLING_API_URL || 'https://api.sociobot.in/api/v1';
const PRODUCT = 'code-graph-explorer';
const supported = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go'];
const ignoredParts = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'vendor', '__pycache__', 'coverage']);
let index: CodeIndex | null = null;
let selectedId = '';
let search = '';
let depth = 1;
let activePane: 'symbols' | 'graph' | 'source' = 'graph';
let busy = false;
let statusMessage = '';
let updateNotice = false;

function licenseVerdict(): { valid: boolean; reason?: string; checkedAt?: number } | null {
  try { return JSON.parse(localStorage.getItem(`sb_license_verdict:${PRODUCT}`) || 'null'); } catch { return null; }
}

function teamUnlocked(): boolean { return Boolean(licenseVerdict()?.valid); }

const demoFiles: FileInput[] = [
  { path: 'src/main.ts', content: `import { createServer } from './server'\nimport { loadConfig } from './config'\n\nexport async function boot() {\n  const config = loadConfig()\n  const server = createServer(config)\n  return server.start()\n}\n\nboot()` },
  { path: 'src/server.ts', content: `import { createRouter } from './router'\n\nexport function createServer(config: Config) {\n  const router = createRouter(config)\n  return { start() { return router.listen() } }\n}` },
  { path: 'src/router.ts', content: `import { healthCheck } from './health'\n\nexport function createRouter(config: Config) {\n  healthCheck()\n  return { listen() { return config.port } }\n}` },
  { path: 'src/config.ts', content: `export function loadConfig() {\n  return { port: 4173, mode: 'local' }\n}` },
  { path: 'src/health.ts', content: `export function healthCheck() {\n  return { ok: true }\n}` },
];

const esc = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const shortPath = (path: string) => path.length > 35 ? `…${path.slice(-34)}` : path;
const icon = (name: 'folder' | 'sample' | 'import' | 'export' | 'search' | 'lock' | 'close') => {
  const paths = {
    folder: '<path d="M3 6h7l2 2h9v11H3z"/><path d="M3 6V4h7l2 2"/>',
    sample: '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="6" r="3"/><circle cx="17" cy="18" r="3"/><path d="m10 11 4-3m-4 5 4 3"/>',
    import: '<path d="M12 3v12m-4-4 4 4 4-4M4 19h16"/>',
    export: '<path d="M12 15V3m-4 4 4-4 4 4M4 19h16"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
    lock: '<rect x="5" y="10" width="14" height="11"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    close: '<path d="m5 5 14 14M19 5 5 19"/>',
  };
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};

function chrome(content: string, legal = false): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-route><span class="registration-mark" aria-hidden="true"></span>Graphite <span>/ code atlas</span></a>
    <nav aria-label="Primary"><a href="/privacy" data-route>Privacy</a><button class="text-button" data-team>${icon('lock')} Team</button>${index && !legal ? '<button class="ink-button compact" data-new>Open another</button>' : ''}</nav>
  </header>${content}<footer class="site-footer"><span>Source stays on your machine.</span><span>Original illustration generated for Graphite.</span><span><a href="/terms" data-route>Terms</a> · <a href="/privacy" data-route>Privacy</a></span></footer>${updateNotice ? '<div class="update-toast" role="status"><span>A newer Graphite shell is ready.</span><button class="paper-button compact" data-reload>Reload</button></div>' : ''}${teamDialog()}`;
}

function renderLanding(): void {
  document.title = 'Graphite — local code graph explorer';
  app.innerHTML = chrome(`<main id="main" class="landing">
    <section class="hero-grid" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Local code cartography / v1.0</p>
        <h1 id="hero-title">Trace the code.<br><span>Keep the source.</span></h1>
        <p class="lede">Open a JavaScript, TypeScript, Python, or Go project. Follow functions, callers, callees, and imports in one linked workspace—without an upload, account, or IDE plugin.</p>
        <div class="hero-actions">
          <button class="ink-button" data-open>${icon('folder')} Open a folder</button>
          <button class="paper-button" data-demo>${icon('sample')} Explore the sample</button>
        </div>
        <p class="support-note">Works best in Chrome or Edge. Other browsers can choose a folder through the file picker.</p>
      </div>
      <figure class="hero-figure">
        <img src="/assets/code-cartography.webp" alt="Abstract halftone map of paper source files connected by red, blue, and black graph nodes" width="1200" height="800" fetchpriority="high" decoding="async">
        <figcaption><span>Plate 01</span> A codebase, viewed as routes instead of folders.</figcaption>
      </figure>
    </section>
    <section class="intake" aria-labelledby="intake-title">
      <div><p class="section-no">01 / Input</p><h2 id="intake-title">Put your repository on the table</h2><p>Folders are read locally and held in memory. Generated files and dependencies are skipped automatically.</p></div>
      <div class="drop-zone" data-drop tabindex="0" role="button">
        <span class="drop-icon" aria-hidden="true">↳</span><strong>Drop a folder here</strong><span>or press Enter to choose one</span>
      </div>
      <div class="alternate-input"><span>Already indexed?</span><button class="paper-button" data-import>${icon('import')} Import JSON index</button></div>
      <input data-folder-input type="file" hidden multiple aria-label="Choose code files">
      <input data-json-input type="file" hidden accept="application/json,.json" aria-label="Choose Graphite JSON index">
    </section>
    <section class="proof-strip" aria-label="Product facts"><div><strong>4</strong><span>languages</span></div><div><strong>0</strong><span>source uploads</span></div><div><strong>2</strong><span>graph depths</span></div><div><strong>JSON</strong><span>portable index</span></div></section>
    <div class="sr-only" aria-live="polite">${esc(statusMessage)}</div>
  </main>`);
  bindCommon();
  bindLanding();
}

function renderLoading(project: string, done = 0, total = 1): void {
  const percent = total ? Math.round((done / total) * 100) : 0;
  app.innerHTML = chrome(`<main id="main" class="loading-page"><div class="print-loader" aria-live="polite"><p class="eyebrow">Indexing locally</p><h1>Drawing ${esc(project)}</h1><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div><p>${done} of ${total} supported files · ${percent}%</p><small>You can close this tab to stop. No source has left the browser.</small></div></main>`);
  bindCommon();
}

function relationData(): { nodes: CodeSymbol[]; edges: GraphEdge[] } {
  if (!index) return { nodes: [], edges: [] };
  const ids = new Set([selectedId]);
  for (let level = 0; level < depth; level++) {
    const frontier = new Set(ids);
    for (const edge of index.edges) if (frontier.has(edge.from) || frontier.has(edge.to)) { ids.add(edge.from); ids.add(edge.to); }
  }
  return { nodes: index.symbols.filter(symbol => ids.has(symbol.id)), edges: index.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to)) };
}

function graphMarkup(): string {
  if (!index) return '';
  const selected = index.symbols.find(symbol => symbol.id === selectedId)!;
  const { nodes, edges } = relationData();
  const inbound = nodes.filter(node => edges.some(edge => edge.from === node.id && edge.to === selectedId));
  const outbound = nodes.filter(node => edges.some(edge => edge.from === selectedId && edge.to === node.id));
  const remaining = nodes.filter(node => node.id !== selectedId && !inbound.includes(node) && !outbound.includes(node));
  const positions = new Map<string, { x: number; y: number }>();
  const distribute = (items: CodeSymbol[], x: number) => items.forEach((item, i) => positions.set(item.id, { x, y: 90 + ((i + 1) * 360) / (items.length + 1) }));
  positions.set(selectedId, { x: 500, y: 270 }); distribute(inbound, 180); distribute(outbound, 820); distribute(remaining, 500);
  const edgeSvg = edges.map(edge => {
    const from = positions.get(edge.from); const to = positions.get(edge.to);
    if (!from || !to) return '';
    const cls = edge.kind === 'import' ? 'import-edge' : edge.to === selectedId ? 'caller-edge' : 'callee-edge';
    return `<path class="graph-edge ${cls}" d="M${from.x} ${from.y} C${(from.x + to.x) / 2} ${from.y},${(from.x + to.x) / 2} ${to.y},${to.x} ${to.y}" marker-end="url(#arrow)"/>`;
  }).join('');
  const nodeSvg = nodes.map(node => {
    const pos = positions.get(node.id)!; const active = node.id === selectedId;
    return `<g class="graph-node ${active ? 'selected' : ''}" transform="translate(${pos.x - 90} ${pos.y - 30})" role="button" tabindex="0" data-symbol="${esc(node.id)}" aria-label="${esc(node.kind)} ${esc(node.name)}, ${esc(node.file)} line ${node.line}"><rect width="180" height="60"/><text class="node-kind" x="12" y="18">${esc(node.kind.toUpperCase())}</text><text class="node-name" x="12" y="42">${esc(node.name.slice(0, 22))}</text>${active ? '<circle cx="169" cy="10" r="5"/>' : ''}</g>`;
  }).join('');
  const relationships = edges.length ? edges.map(edge => {
    const from = index!.symbols.find(symbol => symbol.id === edge.from)!; const to = index!.symbols.find(symbol => symbol.id === edge.to)!;
    const other = edge.from === selectedId ? to : from;
    const direction = edge.kind === 'import' ? 'imports' : edge.to === selectedId ? 'called by' : 'calls';
    return `<li><button data-symbol="${esc(other.id)}"><span>${direction}</span><strong>${esc(other.name)}</strong><small>${esc(shortPath(other.file))}:${other.line} · ${edge.confidence}</small></button></li>`;
  }).join('') : '<li class="no-relations">No resolved relationships at this depth.</li>';
  return `<div class="graph-canvas"><svg viewBox="0 0 1000 540" role="group" aria-labelledby="graph-title graph-desc"><title id="graph-title">Focus graph for ${esc(selected.name)}</title><desc id="graph-desc">${nodes.length} symbols and ${edges.length} relationships. Use the relationship list below for a text alternative.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z"/></marker></defs>${edgeSvg}${nodeSvg}</svg></div><details class="relationship-list" open><summary>Relationships <span>${edges.length}</span></summary><ul>${relationships}</ul></details>`;
}

function sourceMarkup(symbol: CodeSymbol): string {
  const file = index!.files.find(item => item.path === symbol.file);
  if (!file) return '<p>Source was not included in this imported index.</p>';
  const allByName = new Map(index!.symbols.map(item => [item.name, item]));
  const lines = file.content.split('\n');
  return lines.map((line, i) => {
    let html = ''; let cursor = 0;
    for (const token of line.matchAll(/\b[A-Za-z_$][\w$]*\b/g)) {
      html += esc(line.slice(cursor, token.index));
      const target = allByName.get(token[0]);
      html += target ? `<button class="code-ref" data-symbol="${esc(target.id)}" title="Open ${esc(target.name)}">${esc(token[0])}</button>` : esc(token[0]);
      cursor = (token.index || 0) + token[0].length;
    }
    html += esc(line.slice(cursor));
    const active = i + 1 >= symbol.line && i + 1 <= symbol.endLine;
    return `<div class="code-line ${active ? 'active' : ''}" id="L${i + 1}"><span class="line-no">${i + 1}</span><code>${html || ' '}</code></div>`;
  }).join('');
}

function renderWorkspace(): void {
  if (!index) return renderLanding();
  document.title = `${index.project} — Graphite`;
  let selected = index.symbols.find(symbol => symbol.id === selectedId);
  if (!selected) { selected = index.symbols.find(symbol => symbol.kind !== 'module') || index.symbols[0]; selectedId = selected?.id || ''; }
  if (!selected) return renderError('No symbols found', 'Graphite read the files, but could not find supported definitions. Try a project containing TypeScript, JavaScript, Python, or Go.');
  const visibleSymbols = index.symbols.filter(symbol => (`${symbol.name} ${symbol.file}`).toLowerCase().includes(search.toLowerCase())).slice(0, 500);
  const list = visibleSymbols.map(symbol => `<li><button class="symbol-row ${symbol.id === selectedId ? 'active' : ''}" data-symbol="${esc(symbol.id)}"><span class="kind-stamp">${symbol.kind.slice(0, 2).toUpperCase()}</span><span><strong>${esc(symbol.name)}</strong><small>${esc(shortPath(symbol.file))}:${symbol.line}</small></span></button></li>`).join('') || '<li class="empty-list">No symbols match. Try a file name.</li>';
  app.innerHTML = chrome(`<main id="main" class="workspace">
    <div class="project-bar"><div><span class="indexed-dot" aria-hidden="true"></span><strong>${esc(index.project)}</strong><span>${index.stats.files} files · ${index.stats.symbols} symbols · ${index.stats.edges} edges</span></div><div><span class="heuristic-badge" title="Cross-file name matching may include false edges">≈ Heuristic resolution</span><button class="paper-button compact" data-review>${teamUnlocked() ? icon('export') : icon('lock')} Review packet</button><button class="paper-button compact" data-export>${icon('export')} Export JSON</button></div></div>
    <div class="mobile-tabs" role="tablist" aria-label="Workspace panes"><button role="tab" aria-selected="${activePane === 'symbols'}" data-pane="symbols">Symbols</button><button role="tab" aria-selected="${activePane === 'graph'}" data-pane="graph">Graph</button><button role="tab" aria-selected="${activePane === 'source'}" data-pane="source">Source</button></div>
    <div class="work-grid" data-active-pane="${activePane}">
      <aside class="symbol-pane" aria-label="Symbol index"><div class="pane-head"><p class="section-no">Symbols / ${visibleSymbols.length}</p><label class="search-box">${icon('search')}<span class="sr-only">Search symbols</span><input data-search type="search" value="${esc(search)}" placeholder="Function, class, or file" autocomplete="off"><kbd>/</kbd></label></div><ul class="symbol-list">${list}</ul></aside>
      <section class="graph-pane" aria-labelledby="focus-title"><div class="pane-head focus-head"><div><p class="section-no">Focus graph</p><h1 id="focus-title">${esc(selected.name)}</h1><p>${esc(selected.kind)} · ${esc(selected.file)}:${selected.line}</p></div><label>Depth <select data-depth aria-label="Graph depth"><option value="1" ${depth === 1 ? 'selected' : ''}>1 hop</option><option value="2" ${depth === 2 ? 'selected' : ''}>2 hops</option></select></label></div>${graphMarkup()}</section>
      <section class="source-pane" aria-labelledby="source-title"><div class="pane-head"><div><p class="section-no">Source</p><h2 id="source-title">${esc(shortPath(selected.file))}</h2></div><a class="line-link" href="#L${selected.line}">Line ${selected.line}</a></div><div class="source-code" role="region" aria-label="Source for ${esc(selected.file)}">${sourceMarkup(selected)}</div></section>
    </div>
    <div class="status-ribbon" role="status"><span>Indexed in ${index.stats.elapsedMs} ms</span><span>${navigator.onLine ? 'Offline-ready' : 'You are offline — local tools still work'}</span><span><kbd>/</kbd> search · <kbd>↑↓</kbd> navigate</span></div>
  </main>`);
  bindCommon(); bindWorkspace();
  requestAnimationFrame(() => document.getElementById(`L${selected!.line}`)?.scrollIntoView({ block: 'center' }));
}

function legalPage(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  document.title = `${privacy ? 'Privacy' : 'Terms'} — Graphite`;
  app.innerHTML = chrome(`<main id="main" class="legal-page"><a href="/" data-route class="back-link">← Back to Graphite</a><p class="eyebrow">Policy / effective 27 August 2026</p><h1>${privacy ? 'Privacy, by construction.' : 'Plain terms for a local tool.'}</h1>${privacy ? `
    <h2>Your source code</h2><p>Graphite reads selected files in your browser memory. Source code, file names, indexes, and searches are not uploaded to Graphite or Sociobot. Closing the tab clears the active index unless you export it.</p>
    <h2>Local data</h2><p>If you purchase or restore Team, the license token and a daily verification timestamp are stored in localStorage. The service worker stores the app shell for offline use. You can clear both through your browser settings.</p>
    <h2>Billing</h2><p>Checkout and license verification are handled by Sociobot, with Dodo as merchant of record. Graphite sends the license token only when verifying it. We run no third-party analytics, advertising pixels, or tracking scripts.</p>
    <h2>Your choices</h2><p>Use all free local exploration features without an account. Do not select repositories you are not authorized to inspect. Questions: <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>` : `
    <h2>Use</h2><p>Graphite is provided under the MIT License. You may use it to inspect code you own or are authorized to access. Do not use it to violate law or another party’s rights.</p>
    <h2>Accuracy</h2><p>Relationship resolution is heuristic. Dynamic calls, aliases, reflection, generated code, and complex type dispatch can be missed or misidentified. Verify graph findings against source code before making consequential changes.</p>
    <h2>Team purchase</h2><p>Team is a one-time license unlock sold through Sociobot, with Dodo as merchant of record. The checkout page states the current price and refund terms. Refunds revoke the license automatically. Accessibility, local exploration, and JSON export remain free.</p>
    <h2>Warranty</h2><p>The software is provided “as is,” without warranty. To the extent permitted by law, the authors are not liable for losses arising from its use.</p>`}</main>`, true);
  bindCommon();
}

function renderError(title: string, message: string): void {
  app.innerHTML = chrome(`<main id="main" class="error-page"><p class="eyebrow">Index interrupted</p><h1>${esc(title)}</h1><p>${esc(message)}</p><div><button class="ink-button" data-open>${icon('folder')} Try another folder</button><button class="paper-button" data-demo>${icon('sample')} Open sample</button></div></main>`);
  bindCommon(); bindLanding();
}

function teamDialog(): string {
  const token = localStorage.getItem(`sb_license:${PRODUCT}`);
  const verdict = licenseVerdict();
  const unlocked = Boolean(verdict?.valid);
  return `<dialog class="team-dialog" aria-labelledby="team-title"><button class="dialog-close" data-dialog-close aria-label="Close Team dialog">${icon('close')}</button><p class="eyebrow">Team license</p><h2 id="team-title">${unlocked ? 'Team is unlocked.' : 'Carry a shared trail.'}</h2><p>${unlocked ? 'This browser has an active Team license. Review-packet export is ready in the workspace.' : 'Team adds a standalone HTML review packet for the focused symbol, its source location, and visible relationships. Local exploration and JSON export always stay free.'}</p>${verdict && !verdict.valid ? '<p class="license-notice">License no longer active. Restore it below or purchase a new license.</p>' : ''}<div class="price"><strong>$24</strong><span>one-time purchase<br>for one user</span></div><a class="ink-button link-button" href="${BILLING_BASE}/products/${PRODUCT}/checkout">Buy Team</a><form data-license-form><label for="license">Have a license? Paste it here</label><div><input id="license" name="license" value="${token ? esc(token) : ''}" autocomplete="off" spellcheck="false"><button class="paper-button" type="submit">Verify license</button></div><p data-license-status aria-live="polite"></p></form><small>Sociobot / Dodo is the merchant of record. Refunds are handled there. <a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a></small></dialog>`;
}

function bindCommon(): void {
  app.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); history.pushState({}, '', link.pathname); route(); }));
  app.querySelectorAll<HTMLButtonElement>('[data-team]').forEach(button => button.addEventListener('click', () => openTeam(button)));
  app.querySelector<HTMLButtonElement>('[data-new]')?.addEventListener('click', () => { index = null; selectedId = ''; renderLanding(); });
  app.querySelector<HTMLButtonElement>('[data-reload]')?.addEventListener('click', () => location.reload());
  const dialog = app.querySelector<HTMLDialogElement>('.team-dialog');
  dialog?.querySelector<HTMLButtonElement>('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog?.querySelector<HTMLFormElement>('[data-license-form]')?.addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const token = new FormData(form).get('license')?.toString().trim() || '';
    const output = form.querySelector<HTMLElement>('[data-license-status]')!;
    if (!token) { output.textContent = 'Paste a license token first.'; return; }
    localStorage.setItem(`sb_license:${PRODUCT}`, token); output.textContent = 'Verifying…'; await verifyLicense(token, output);
  });
}

function openTeam(opener: HTMLElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.team-dialog')!;
  dialog.showModal(); dialog.querySelector<HTMLButtonElement>('[data-dialog-close]')?.focus();
  dialog.addEventListener('close', () => opener.focus(), { once: true });
}

function bindLanding(): void {
  const input = app.querySelector<HTMLInputElement>('[data-folder-input]');
  input?.setAttribute('webkitdirectory', '');
  const choose = () => openFolder(input);
  app.querySelectorAll<HTMLElement>('[data-open], [data-drop]').forEach(el => el.addEventListener('click', choose));
  app.querySelector<HTMLElement>('[data-drop]')?.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); } });
  input?.addEventListener('change', () => readFileList(input.files));
  app.querySelector<HTMLButtonElement>('[data-demo]')?.addEventListener('click', async () => analyze(demoFiles, 'Graphite sample'));
  const jsonInput = app.querySelector<HTMLInputElement>('[data-json-input]');
  app.querySelector<HTMLButtonElement>('[data-import]')?.addEventListener('click', () => jsonInput?.click());
  jsonInput?.addEventListener('change', () => importIndex(jsonInput.files?.[0]));
  const drop = app.querySelector<HTMLElement>('[data-drop]');
  drop?.addEventListener('dragover', event => { event.preventDefault(); drop.classList.add('dragging'); });
  drop?.addEventListener('dragleave', () => drop.classList.remove('dragging'));
  drop?.addEventListener('drop', async event => { event.preventDefault(); drop.classList.remove('dragging'); await readDroppedItems(event.dataTransfer); });
}

function bindWorkspace(): void {
  app.querySelectorAll<HTMLElement>('[data-symbol]').forEach(button => button.addEventListener('click', () => selectSymbol(button.dataset.symbol!)));
  app.querySelectorAll<HTMLElement>('.graph-node').forEach(node => node.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectSymbol(node.dataset.symbol!); }
    if (event.key.startsWith('Arrow')) { event.preventDefault(); const nodes = [...app.querySelectorAll<HTMLElement>('.graph-node')]; nodes[(nodes.indexOf(node) + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + nodes.length) % nodes.length]?.focus(); }
  }));
  const searchInput = app.querySelector<HTMLInputElement>('[data-search]');
  searchInput?.addEventListener('input', () => { search = searchInput.value; renderWorkspace(); app.querySelector<HTMLInputElement>('[data-search]')?.focus(); });
  app.querySelector<HTMLSelectElement>('[data-depth]')?.addEventListener('change', event => { depth = Number((event.target as HTMLSelectElement).value); renderWorkspace(); });
  app.querySelector<HTMLButtonElement>('[data-export]')?.addEventListener('click', exportIndex);
  app.querySelector<HTMLButtonElement>('[data-review]')?.addEventListener('click', event => teamUnlocked() ? exportReviewPacket() : openTeam(event.currentTarget as HTMLElement));
  app.querySelectorAll<HTMLButtonElement>('[data-pane]').forEach(button => button.addEventListener('click', () => { activePane = button.dataset.pane as typeof activePane; renderWorkspace(); }));
}

function selectSymbol(id: string): void { selectedId = id; if (innerWidth < 760) activePane = 'graph'; renderWorkspace(); }

async function openFolder(fallback?: HTMLInputElement | null): Promise<void> {
  if ('showDirectoryPicker' in window) {
    try {
      const handle = await (window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
      const files: FileInput[] = []; const exceeded = await walkDirectory(handle, '', files);
      if (exceeded) { renderError('Folder is too large', directoryLimitMessage()); return; }
      await analyze(files, handle.name); return;
    } catch (error) { if ((error as DOMException).name === 'AbortError') return; }
  }
  fallback?.click();
}

async function walkDirectory(handle: FileSystemDirectoryHandle, prefix: string, output: FileInput[]): Promise<boolean> {
  const entries: [string, FileSystemFileHandle | FileSystemDirectoryHandle][] = [];
  for await (const entry of handle.entries()) entries.push(entry);
  entries.sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
  for (const [name, child] of entries) {
    if (ignoredParts.has(name) || name.startsWith('.')) continue;
    const path = prefix ? `${prefix}/${name}` : name;
    if (child.kind === 'directory') { if (await walkDirectory(child, path, output)) return true; }
    else if (supported.some(ext => name.toLowerCase().endsWith(ext))) {
      const file = await child.getFile();
      if (file.size <= 2_000_000) {
        if (exceedsDirectoryFileLimit(output.length + 1)) return true;
        output.push({ path, content: await file.text() });
      }
    }
  }
  return false;
}

async function readFileList(list: FileList | null): Promise<void> {
  if (!list) return;
  const candidates = applyDirectoryFileLimit([...list].filter(file => languageFor(file.name) !== 'unknown' && file.size <= 2_000_000 && !file.webkitRelativePath.split('/').some(part => ignoredParts.has(part))).map(file => ({ file, path: file.webkitRelativePath || file.name })));
  if (candidates.exceeded) { renderError('Folder is too large', directoryLimitMessage()); return; }
  const files: FileInput[] = [];
  for (const candidate of candidates.files) files.push({ path: candidate.path, content: await candidate.file.text() });
  await analyze(files, files[0]?.path.split('/')[0] || 'Local project');
}

async function readDroppedItems(data: DataTransfer | null): Promise<void> {
  if (!data) return;
  const files: FileInput[] = [];
  const entries = [...data.items].map(item => item.webkitGetAsEntry?.()).filter(Boolean) as FileSystemEntry[];
  let exceeded = false;
  const walk = async (entry: FileSystemEntry, prefix = ''): Promise<void> => {
    if (exceeded) return;
    if (ignoredParts.has(entry.name) || entry.name.startsWith('.')) return;
    if (entry.isFile) await new Promise<void>(resolve => (entry as FileSystemFileEntry).file(async file => {
      if (languageFor(file.name) !== 'unknown' && file.size <= 2_000_000) {
        if (exceedsDirectoryFileLimit(files.length + 1)) exceeded = true;
        else files.push({ path: `${prefix}${file.name}`, content: await file.text() });
      }
      resolve();
    }));
    else {
      const reader = (entry as FileSystemDirectoryEntry).createReader(); const children: FileSystemEntry[] = [];
      let batch: FileSystemEntry[];
      do { batch = await new Promise<FileSystemEntry[]>(resolve => reader.readEntries(resolve)); children.push(...batch); } while (batch.length);
      children.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
      for (const child of children) { await walk(child, `${prefix}${entry.name}/`); if (exceeded) return; }
    }
  };
  entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
  for (const entry of entries) { await walk(entry); if (exceeded) break; }
  if (exceeded) { renderError('Folder is too large', directoryLimitMessage()); return; }
  await analyze(files, entries[0]?.name || 'Dropped project');
}

async function analyze(files: FileInput[], project: string): Promise<void> {
  if (busy) return; if (!files.length) { renderError('No supported files found', 'Choose a folder with .ts, .tsx, .js, .jsx, .py, or .go files. Dependency and build folders are skipped.'); return; }
  busy = true; renderLoading(project, 0, files.length);
  try { index = await buildIndex(files, project, (done, total) => { if (done === total || done % 10 === 0) renderLoading(project, done, total); }); selectedId = index.symbols.find(symbol => symbol.kind !== 'module')?.id || index.symbols[0]?.id || ''; renderWorkspace(); }
  catch (error) { renderError('Could not index this folder', error instanceof Error ? error.message : 'Try a smaller folder or import a previously exported index.'); }
  finally { busy = false; }
}

async function importIndex(file?: File): Promise<void> {
  if (!file) return;
  try { const parsed: unknown = JSON.parse(await file.text()); if (!validateIndex(parsed)) throw new Error('This is not a Graphite v1 index.'); index = parsed; selectedId = index.symbols.find(symbol => symbol.kind !== 'module')?.id || ''; renderWorkspace(); }
  catch (error) { renderError('Index could not be opened', error instanceof Error ? error.message : 'Choose a JSON index exported by Graphite.'); }
}

function exportIndex(): void {
  if (!index) return; const blob = new Blob([JSON.stringify(index, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${index.project.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'code'}-graph.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportReviewPacket(): void {
  if (!index || !teamUnlocked()) return;
  const symbol = index.symbols.find(item => item.id === selectedId); if (!symbol) return;
  const { edges } = relationData();
  const rows = edges.map(edge => { const from = index!.symbols.find(item => item.id === edge.from)!; const to = index!.symbols.find(item => item.id === edge.to)!; return `<tr><td>${esc(edge.kind)}</td><td>${esc(from.name)}</td><td>→</td><td>${esc(to.name)}</td><td>${esc(edge.confidence)}</td></tr>`; }).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(symbol.name)} review trail</title><style>body{max-width:900px;margin:48px auto;padding:0 24px;background:#f2eedf;color:#171713;font:16px/1.5 Arial,sans-serif}h1{font-size:48px;text-transform:uppercase;border-bottom:3px solid}code,table{font-family:monospace}table{width:100%;border-collapse:collapse}th,td{padding:10px;border:1px solid;text-align:left}.note{border-left:6px solid #d53a24;padding:12px;background:#fffdf5}</style></head><body><p>GRAPHITE / REVIEW TRAIL</p><h1>${esc(symbol.name)}</h1><p><strong>${esc(symbol.kind)}</strong> · <code>${esc(symbol.file)}:${symbol.line}</code></p><p class="note">Relationship resolution is heuristic. Verify each edge against the source before changing code.</p><h2>Visible relationships</h2><table><thead><tr><th>Kind</th><th>From</th><th></th><th>To</th><th>Confidence</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No visible relationships.</td></tr>'}</tbody></table><p>Generated locally by Graphite on ${new Date().toLocaleString()}.</p></body></html>`;
  const blob = new Blob([html], { type: 'text/html' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${symbol.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-review.html`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function verifyLicense(token: string, output?: HTMLElement): Promise<void> {
  try {
    const response = await fetch(`${BILLING_BASE}/products/${PRODUCT}/verify?license=${encodeURIComponent(token)}`);
    const verdict = await response.json() as { valid: boolean; reason: string; expires_at?: string };
    localStorage.setItem(`sb_license_verdict:${PRODUCT}`, JSON.stringify({ ...verdict, checkedAt: Date.now() }));
    if (output) output.textContent = verdict.valid ? 'License verified. Team is active.' : `License not active (${verdict.reason.replace('_', ' ')}).`;
  } catch { if (output) output.textContent = 'Could not verify while offline. Your free workspace is unaffected.'; }
}

function processLicense(): void {
  const url = new URL(location.href); const incoming = url.searchParams.get('license');
  if (incoming) { localStorage.setItem(`sb_license:${PRODUCT}`, incoming); url.searchParams.delete('license'); history.replaceState({}, '', url); verifyLicense(incoming); return; }
  const token = localStorage.getItem(`sb_license:${PRODUCT}`); const checkedAt = licenseVerdict()?.checkedAt || 0; if (token && Date.now() - checkedAt > 86_400_000) verifyLicense(token);
}

function route(): void { const path = location.pathname; if (path === '/privacy') legalPage('privacy'); else if (path === '/terms') legalPage('terms'); else index ? renderWorkspace() : renderLanding(); }

window.addEventListener('popstate', route);
window.addEventListener('keydown', event => { if (event.key === '/' && index && !(event.target instanceof HTMLInputElement)) { event.preventDefault(); app.querySelector<HTMLInputElement>('[data-search]')?.focus(); } });
window.addEventListener('online', () => index && renderWorkspace());
window.addEventListener('offline', () => index && renderWorkspace());
processLicense(); route();
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => {
  let hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) { hadController = true; return; }
    updateNotice = true; route();
  });
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          updateNotice = true; route();
          worker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
  }).catch(() => undefined);
});

declare global {
  interface FileSystemDirectoryHandle { entries(): AsyncIterableIterator<[string, FileSystemFileHandle | FileSystemDirectoryHandle]> }
}
