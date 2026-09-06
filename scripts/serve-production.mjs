import { createReadStream } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const root = resolve(new URL('../dist/', import.meta.url).pathname);
const host = process.env.GRAPHITE_TEST_HOST || '127.0.0.1';
const port = Number(process.env.GRAPHITE_TEST_PORT || 4173);
const deploymentOnly = new Set(['/staticwebapp.config.json']);
const spaRoutes = new Set(['/', '/demo', '/privacy', '/terms']);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function filePath(pathname) {
  const candidate = resolve(root, `.${pathname}`);
  return candidate === root || candidate.startsWith(`${root}${sep}`) ? candidate : null;
}

async function sendFile(response, path, status = 200) {
  response.writeHead(status, {
    'Cache-Control': path.endsWith(`${sep}sw.js`) ? 'no-cache, no-store, must-revalidate' : 'no-cache',
    'Content-Type': contentTypes[extname(path)] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(path).pipe(response);
}

const notFound = await readFile(resolve(root, '404.html'));
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', `http://${host}`).pathname);
    if (deploymentOnly.has(pathname)) {
      response.writeHead(404, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
      response.end(notFound);
      return;
    }

    if (spaRoutes.has(pathname)) {
      await sendFile(response, resolve(root, 'index.html'));
      return;
    }

    const candidate = filePath(pathname);
    if (candidate && await exists(candidate)) {
      await sendFile(response, candidate);
      return;
    }

    response.writeHead(404, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
    response.end(notFound);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
  }
});

server.listen(port, host, () => {
  process.stdout.write(`Production-like server listening on http://${host}:${port}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
