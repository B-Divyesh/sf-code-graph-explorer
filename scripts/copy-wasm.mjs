import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/wasm');
await mkdir(output, { recursive: true });
await copyFile(resolve(root, 'node_modules/web-tree-sitter/tree-sitter.wasm'), resolve(output, 'web-tree-sitter.wasm'));
for (const language of ['typescript', 'javascript', 'python', 'go']) {
  await copyFile(resolve(root, `node_modules/tree-sitter-wasms/out/tree-sitter-${language}.wasm`), resolve(output, `tree-sitter-${language}.wasm`));
}
