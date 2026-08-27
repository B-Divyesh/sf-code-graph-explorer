import { describe, expect, it } from 'vitest';
import { buildIndex, languageFor, validateIndex } from './parser';

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
});
