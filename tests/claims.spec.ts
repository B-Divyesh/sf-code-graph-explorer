import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function openDemo(page: Page): Promise<void> {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1, name: 'boot' })).toBeVisible();
}

async function chooseFiles(page: Page, files: Array<{ name: string; mimeType: string; buffer: Buffer }>): Promise<void> {
  await page.goto('/');
  await page.locator('[data-folder-input]').evaluate(input => input.removeAttribute('webkitdirectory'));
  await page.locator('[data-folder-input]').setInputFiles(files);
}

test('@claim:open-codebase opens a codebase into a usable graph', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('.graph-node')).toHaveCount(4);
  await expect(page.locator('.source-code')).toContainText('createServer');
  await page.locator('.symbol-row').filter({ hasText: 'main.ts' }).first().click();
  await expect(page.locator('.relationship-list')).toContainText('imports');
  await expect(page.locator('.relationship-list')).toContainText('server.ts');
});

test('@claim:navigate-code follows a function to its graph and source', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /healthCheck/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'healthCheck' })).toBeVisible();
  await expect(page.locator('.source-code')).toContainText('ok: true');
});

test('@claim:source-stays-local keeps a marked real source file out of requests and storage', async ({ page }) => {
  const marker = 'PRIVATE_SOURCE_TOKEN_83fd';
  await page.goto('/');
  await page.evaluate(async () => {
    localStorage.setItem('real:sentinel', 'keep');
    sessionStorage.setItem('real:session', 'keep');
    await new Promise<void>((resolve, reject) => { const request = indexedDB.open('real-db', 1); request.onupgradeneeded = () => request.result.createObjectStore('sentinel'); request.onsuccess = () => { request.result.close(); resolve(); }; request.onerror = () => reject(request.error); });
    const root = await navigator.storage.getDirectory();
    const file = await root.getFileHandle('real-sentinel.txt', { create: true });
    const writer = await file.createWritable(); await writer.write('keep'); await writer.close();
    const cache = await caches.open('real:cache'); await cache.put('/real-sentinel', new Response('keep'));
  });
  const requests: Array<{ url: string; method: string; body: string }> = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() || '' }));
  await page.locator('[data-folder-input]').evaluate(input => input.removeAttribute('webkitdirectory'));
  await page.locator('[data-folder-input]').setInputFiles({ name: 'private-marker.ts', mimeType: 'text/plain', buffer: Buffer.from(`export function privateMarker() { return '${marker}' }`) });
  await expect(page.getByRole('heading', { level: 1, name: 'privateMarker' })).toBeVisible();
  expect(requests.every(request => request.method === 'GET')).toBe(true);
  expect(JSON.stringify(requests)).not.toContain(marker);
  expect(JSON.stringify(requests)).not.toContain('private-marker.ts');
  const storage = await page.evaluate(async searched => {
    const root = await navigator.storage.getDirectory();
    const opfs: string[] = [];
    for await (const [name] of root.entries()) opfs.push(name);
    const cacheBodies: string[] = [];
    for (const name of await caches.keys()) for (const response of await (await caches.open(name)).matchAll()) cacheBodies.push(await response.text());
    return { local: JSON.stringify(localStorage), session: JSON.stringify(sessionStorage), databases: await indexedDB.databases(), opfs, cacheHasMarker: cacheBodies.some(body => body.includes(searched)) };
  }, marker);
  expect(storage.local).toBe('{"real:sentinel":"keep"}');
  expect(storage.session).toBe('{"real:session":"keep"}');
  expect(storage.databases.map(database => database.name)).toEqual(['real-db']);
  expect(storage.opfs).toEqual(['real-sentinel.txt']);
  expect(storage.cacheHasMarker).toBe(false);
});

test('@claim:supported-languages indexes TypeScript, TSX, JavaScript, JSX, Python, and Go', async ({ page }) => {
  await chooseFiles(page, [
    { name: 'app.ts', mimeType: 'text/plain', buffer: Buffer.from('export function typed() { return 1 }') },
    { name: 'view.tsx', mimeType: 'text/plain', buffer: Buffer.from('export function TypedView() { return <div /> }') },
    { name: 'app.js', mimeType: 'text/plain', buffer: Buffer.from('export function scripted() { return 2 }') },
    { name: 'view.jsx', mimeType: 'text/plain', buffer: Buffer.from('export function ScriptView() { return <div /> }') },
    { name: 'app.py', mimeType: 'text/plain', buffer: Buffer.from('def pythonic():\n    return 3') },
    { name: 'app.go', mimeType: 'text/plain', buffer: Buffer.from('package main\nfunc Gopher() int { return 4 }') },
  ]);
  await expect(page.locator('.project-bar')).toContainText('6 files');
  for (const name of ['typed', 'TypedView', 'scripted', 'ScriptView', 'pythonic', 'Gopher']) await expect(page.locator('.symbol-list')).toContainText(name);
});

test('@claim:no-account runs the demo without authentication', async ({ page, context }) => {
  await openDemo(page);
  expect(await context.cookies()).toEqual([]);
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
});

test('@claim:memory-only leaves source and index out of web storage', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('real:sentinel', 'keep'); sessionStorage.setItem('real:session', 'keep'); });
  await openDemo(page);
  const storage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  expect(storage).toEqual({ local: { 'real:sentinel': 'keep' }, session: { 'real:session': 'keep' } });
});

test('@claim:ignored-folders skips named dependency and build folders', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-folder-input]').evaluate((input: HTMLInputElement) => {
    const transfer = new DataTransfer();
    const ignored = ['.git', 'node_modules', 'vendor', 'dist', 'build', '.next', 'coverage', '__pycache__'];
    const entries = [['codebase/src/keep.ts', 'export function keep() {}'], ...ignored.map((folder, number) => [`codebase/${folder}/drop-${number}.ts`, `export function drop${number}() {}`])];
    for (const [path, source] of entries) {
      const file = new File([source], path.split('/').at(-1)!, { type: 'text/plain' });
      Object.defineProperty(file, 'webkitRelativePath', { value: path });
      transfer.items.add(file);
    }
    input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('.project-bar')).toContainText('1 files');
  await expect(page.locator('.symbol-list')).toContainText('keep');
  await expect(page.locator('.symbol-list')).not.toContainText(/drop\d/);
});

test('@claim:graph-depths shows one and two relationship levels', async ({ page }) => {
  await openDemo(page);
  const first = await page.locator('.graph-node').count();
  await page.getByLabel('Graph depth').selectOption('2');
  const second = await page.locator('.graph-node').count();
  expect(first).toBeGreaterThan(1);
  expect(second).toBeGreaterThan(first);
});

test('@claim:json-roundtrip exports and imports a Graphite index', async ({ page }) => {
  await openDemo(page);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Graphite index' }).click();
  const download = await downloadEvent;
  const path = await download.path();
  expect(path).toBeTruthy();
  const exported = JSON.parse(await readFile(path!, 'utf8')) as { version: number; files: unknown[] };
  expect(exported.version).toBe(1); expect(exported.files).toHaveLength(5);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('[data-json-input]').setInputFiles(path!);
  await expect(page.locator('.project-bar')).toContainText('5 files');
});

test('@claim:free-core keeps the graph and JSON export available without a license', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByRole('button', { name: 'Export Graphite index' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Preview review packet from sample data' })).toBeEnabled();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('button', { name: 'View Team export' }).first()).toBeEnabled();
});

test('@claim:asset-provenance records the original illustration prompt', async () => {
  const design = await readFile('.factory/design.md', 'utf8');
  const prompt = JSON.parse(await readFile('assets/src/code-cartography.json', 'utf8')) as { prompt?: string };
  expect(design).toContain('Azure AI Foundry');
  expect(prompt.prompt).toContain('halftone');
});

test('@claim:tree-sitter-browser loads the shipped parser in the browser', async ({ page }) => {
  const wasm: string[] = [];
  page.on('response', response => { if (response.url().includes('tree-sitter-typescript.wasm')) wasm.push(response.url()); });
  await openDemo(page);
  expect(wasm.length).toBeGreaterThan(0);
  await expect(page.locator('.symbol-list')).toContainText('createServer');
});

test('@claim:heuristic-resolution labels estimated cross-file relationships', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('.heuristic-badge')).toContainText('Estimated');
  await expect(page.locator('.relationship-list')).toContainText('heuristic');
});

test('@claim:five-file-demo enters a seeded demo directly', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.project-bar')).toContainText('5 files');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page).toHaveTitle('Demo — Graphite');
});

test('@claim:input-methods accepts a browser folder-file selection', async ({ page }) => {
  await chooseFiles(page, [{ name: 'chosen.ts', mimeType: 'text/plain', buffer: Buffer.from('export function chosen() { return true }') }]);
  await expect(page.getByRole('heading', { level: 1, name: 'chosen' })).toBeVisible();
  await expect(page.locator('.project-bar')).toContainText('1 files');
});

test('@claim:relationship-list-a11y exposes graph relationships as named buttons', async ({ page }) => {
  await openDemo(page);
  const list = page.locator('.relationship-list');
  await expect(list.getByText('Relationships')).toBeVisible();
  const first = list.getByRole('button').first();
  await expect(first).toHaveAccessibleName(/calls|called by|imports/i);
});

test('@claim:demo-reset restores the original function and files', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /healthCheck/ }).first().click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'boot' })).toBeVisible();
  await expect(page.locator('.project-bar')).toContainText('5 files');
});

test('@claim:demo-isolation ignores production storage and discards demo state', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:code-graph-explorer', 'real-secret');
    localStorage.setItem('sb_license_verdict:code-graph-explorer', JSON.stringify({ valid: true }));
  });
  await openDemo(page);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Preview review packet from sample data' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export review packet' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Trace calls/ })).toBeVisible();
  await expect(page.locator('.project-bar')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:code-graph-explorer'))).toBe('real-secret');
});

test('@claim:workspace-tools searches symbols and provides a text relationship list', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Search symbols').fill('health');
  await expect(page.locator('.symbol-row')).toHaveCount(2);
  await expect(page.locator('.relationship-list')).toHaveAttribute('open', '');
  await expect(page.locator('.relationship-list button').first()).toBeVisible();
});

test('@claim:keyboard-navigation supports phone search, graph arrows, and pane-tab arrows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDemo(page);
  await page.keyboard.press('/');
  const searchInput = page.getByLabel('Search symbols');
  await expect(page.getByRole('tab', { name: 'Symbols' })).toHaveAttribute('aria-selected', 'true');
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toBeFocused();
  const symbolsTab = page.getByRole('tab', { name: 'Symbols' });
  await symbolsTab.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Graph' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Graph' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Source' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Symbols' })).toBeFocused();
  await page.getByRole('tab', { name: 'Graph' }).click();
  const nodes = page.locator('.graph-node');
  await nodes.first().focus(); await page.keyboard.press('ArrowRight');
  await expect(nodes.nth(1)).toBeFocused();
});

test('@claim:offline-reload opens the seeded demo offline after the first visit', async ({ page, context }) => {
  await openDemo(page);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: 'boot' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:file-size-limit ignores source files over 2 MB', async ({ page }) => {
  await chooseFiles(page, [{ name: 'large.ts', mimeType: 'text/plain', buffer: Buffer.alloc(2_000_001, 97) }]);
  await expect(page.getByRole('heading', { level: 1, name: 'No supported files found' })).toBeVisible();
});

test('@claim:folder-file-limit rejects 5,001 supported files without a partial index', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-folder-input]').evaluate((input: HTMLInputElement) => {
    const transfer = new DataTransfer();
    for (let i = 0; i < 5001; i++) {
      const file = new File([''], `${i}.js`, { type: 'text/javascript' });
      Object.defineProperty(file, 'webkitRelativePath', { value: `big/${i}.js` }); transfer.items.add(file);
    }
    input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByRole('heading', { level: 1, name: 'Folder is too large' })).toBeVisible();
  await expect(page.locator('.project-bar')).toHaveCount(0);
});

test('@claim:no-third-party-runtime keeps the free workflow same-origin', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', request => origins.add(new URL(request.url()).origin));
  await openDemo(page);
  await page.getByRole('button', { name: /createServer/ }).first().click();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:build-contract emits the Azure static site files', async () => {
  for (const file of ['dist/index.html', 'dist/sw.js', 'dist/staticwebapp.config.json', 'dist/sitemap.xml', 'dist/robots.txt']) await expect(readFile(file, 'utf8')).resolves.toBeTruthy();
  const swa = JSON.parse(await readFile('dist/staticwebapp.config.json', 'utf8')) as { navigationFallback: { rewrite: string }; globalHeaders: Record<string, string>; routes: Array<{ route: string; headers: Record<string, string> }> };
  expect(swa.navigationFallback.rewrite).toBe('/index.html');
  expect(swa.globalHeaders).toMatchObject({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' });
  expect(swa.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  expect(swa.routes).toContainEqual({ route: '/wasm/*', headers: { 'cache-control': 'public, max-age=604800, must-revalidate' } });
  expect(await readFile('dist/sitemap.xml', 'utf8')).toContain('/demo');
  expect(await readFile('dist/robots.txt', 'utf8')).toContain('Sitemap:');
});

test('@claim:mit-license matches the repository license', async () => {
  const license = await readFile('LICENSE', 'utf8');
  expect(license).toContain('MIT License');
  expect(license).toContain('Permission is hereby granted, free of charge');
});

test('@claim:test-contract npm test includes the unit and Playwright suites', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as { scripts: Record<string, string> };
  expect(packageJson.scripts.test).toBe('npm run test:unit && npm run test:browser');
  expect(packageJson.scripts['test:unit']).toContain('vitest run');
  expect(packageJson.scripts['test:browser']).toContain('playwright test');
  await expect(readFile('tests/claims.spec.ts', 'utf8')).resolves.toContain(['@', 'claim:offline-reload'].join(''));
  await expect(readFile('tests/accessibility.spec.ts', 'utf8')).resolves.toContain('AxeBuilder');
});

test('@claim:team-purchase exposes the registered $24 one-time checkout', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'View Team export' }).first().click();
  const checkout = page.getByRole('link', { name: /Buy Team at checkout/ });
  await expect(checkout).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/code-graph-explorer/checkout');
  await expect(page.getByRole('dialog').getByText('$24', { exact: true })).toBeVisible();
  const response = await request.get('https://api.sociobot.in/api/v1/products/code-graph-explorer/checkout');
  expect(response.ok()).toBe(true);
  expect(response.url()).toContain('checkout.dodopayments.com/session/');
  const body = await response.text();
  expect(body).toContain('Graphite Team review packet');
  expect(body).toContain('$24.00');
});

test('@claim:review-packet-export verifies a license and exports the focused local review packet', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/code-graph-explorer/verify**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await openDemo(page);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.goto('/?license=fixture-license');
  await expect(page).toHaveURL('/');
  await expect(page.getByText('License verified. Team export is active.')).toBeVisible();
  await page.getByRole('button', { name: 'Close Team export dialog' }).click();
  await chooseFiles(page, [
    { name: 'review.ts', mimeType: 'text/plain', buffer: Buffer.from('export function helper() { return true }\nexport function inspectMe() { return helper() }') },
  ]);
  await page.getByRole('button', { name: /inspectMe/ }).first().click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review packet' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('inspectme-review.html');
  const html = await readFile((await download.path())!, 'utf8');
  expect(html).toContain('GRAPHITE / REVIEW PACKET');
  expect(html).toContain('review.ts:2');
  expect(html).toContain('inspectMe');
  expect(html).toContain('helper');
  expect(html).toContain('exact');
});

test('@claim:route-contract deep links, titles, focus, and not-found state work', async ({ page }) => {
  for (const [path, title] of [['/privacy', 'Privacy — Graphite'], ['/terms', 'Terms — Graphite'], ['/demo', 'Demo — Graphite']]) {
    await page.goto(path); await expect(page).toHaveTitle(title); await expect(page.locator('main h1')).toHaveCount(1);
  }
  await page.goto('/definitely-missing');
  await expect(page).toHaveTitle('Page not found — Graphite');
  await expect(page.getByRole('heading', { level: 1, name: 'This page is not in the graph' })).toBeVisible();
  await page.getByRole('link', { name: 'Return home' }).click();
  await expect(page.locator('main h1')).toBeFocused();
});

test('@claim:mobile-panes shows the selected pane at 390 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await openDemo(page);
  for (const [tab, pane] of [['Symbols', '.symbol-pane'], ['Graph', '.graph-pane'], ['Source', '.source-pane'], ['Graph', '.graph-pane']] as const) {
    await page.getByRole('tab', { name: tab }).click();
    const box = await page.locator(pane).boundingBox();
    expect(box).not.toBeNull(); expect(box!.x).toBeLessThanOrEqual(1); expect(box!.x + box!.width).toBeGreaterThan(389);
    await expect(page.locator(pane)).toBeVisible();
  }
});

test('@claim:mobile-targets keeps every visible phone workspace target at least 44 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await openDemo(page);
  const undersized = await page.locator('a, button, select, summary, [role="button"], [role="tab"]').evaluateAll(elements => elements.flatMap(element => {
    const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
    const inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
    if (!inViewport || style.visibility === 'hidden' || style.display === 'none') return [];
    return rect.width + .01 < 44 || rect.height + .01 < 44 ? [{ name: element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName, width: rect.width, height: rect.height }] : [];
  }));
  expect(undersized).toEqual([]);
});
