import { describe, expect, it } from 'vitest';
import { buildIndex, languageFor, validateIndex } from './parser';
import { applyDirectoryFileLimit, exceedsDirectoryFileLimit, MAX_SUPPORTED_FILES } from './intake';

describe('code indexer', () => {
  it('recognizes supported languages', () => {
    expect(languageFor('src/app.tsx')).toBe('typescript');
    expect(languageFor('main.py')).toBe('python');
    expect(languageFor('main.go')).toBe('go');
    expect(languageFor('readme.md')).toBe('unknown');
  });

  it('resolves local and unique cross-file calls', async () => {
    const index = await buildIndex([
      { path: 'src/main.ts', content: "import { greet } from './greet'\nexport function run() { greet() }" },
      { path: 'src/greet.ts', content: 'export function greet() { return format() }\nfunction format() { return true }' },
    ], 'test');
    expect(index.stats.files).toBe(2);
    expect(index.symbols.some(symbol => symbol.name === 'run')).toBe(true);
    expect(index.edges.filter(edge => edge.kind === 'call')).toHaveLength(2);
    expect(index.edges.some(edge => edge.kind === 'import')).toBe(true);
  });

  it('accepts only versioned index objects', () => {
    expect(validateIndex({ version: 1, project: 'x', files: [], symbols: [], edges: [] })).toBe(true);
    expect(validateIndex({ version: 2, project: 'x' })).toBe(false);
  });

  it('accepts exactly 5,000 directory files in deterministic path order', () => {
    const files = Array.from({ length: MAX_SUPPORTED_FILES }, (_, number) => ({ path: `src/${String(MAX_SUPPORTED_FILES - number).padStart(5, '0')}.js` }));
    const result = applyDirectoryFileLimit(files);
    expect(result.exceeded).toBe(false);
    expect(exceedsDirectoryFileLimit(MAX_SUPPORTED_FILES)).toBe(false);
    expect(result.files).toHaveLength(MAX_SUPPORTED_FILES);
    expect(result.files[0].path).toBe('src/00001.js');
  });

  it('rejects 5,001 directory files without truncating the selection', () => {
    const files = Array.from({ length: MAX_SUPPORTED_FILES + 1 }, (_, number) => ({ path: `src/${String(number).padStart(5, '0')}.js` }));
    const result = applyDirectoryFileLimit(files);
    expect(result.exceeded).toBe(true);
    expect(exceedsDirectoryFileLimit(MAX_SUPPORTED_FILES + 1)).toBe(true);
    expect(result.files).toHaveLength(MAX_SUPPORTED_FILES + 1);
  });

  it('@claim:resolution-limits does not invent a target for a dynamic call', async () => {
    const index = await buildIndex([
      { path: 'dynamic.ts', content: "export function dispatch(name: string) { return globalThis[name]() }" },
    ], 'limits');
    expect(index.edges.filter(edge => edge.kind === 'call')).toHaveLength(0);
    expect(index.warnings.join(' ')).toContain('Dynamic dispatch');
  });
});
