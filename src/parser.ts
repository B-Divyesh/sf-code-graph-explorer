import type { CodeIndex, CodeSymbol, FileInput, GraphEdge, Language, PendingCall, PendingImport, SourceFile, SymbolKind } from './types';
import { extractStructure, type StructuralResult } from './treeSitter';

const extensions: Record<string, Language> = {
  ts: 'typescript', tsx: 'typescript', mts: 'typescript', cts: 'typescript',
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  py: 'python', go: 'go',
};
const ignoredCalls = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'new', 'typeof', 'function', 'def', 'func', 'class', 'print', 'len', 'range', 'make', 'append']);

export function languageFor(path: string): Language {
  return extensions[path.split('.').pop()?.toLowerCase() || ''] || 'unknown';
}

function cleanName(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\.\//, '');
}

function symbolId(file: string, name: string, line: number): string {
  return `${file}::${name}::${line}`;
}

function findBlockEnd(lines: string[], start: number, language: Language): number {
  if (language === 'python') {
    const indent = lines[start].match(/^\s*/)?.[0].length || 0;
    for (let i = start + 1; i < lines.length; i++) {
      if (lines[i].trim() && (lines[i].match(/^\s*/)?.[0].length || 0) <= indent) return i;
    }
    return lines.length;
  }
  let braces = 0;
  let started = false;
  for (let i = start; i < lines.length; i++) {
    for (const char of lines[i]) {
      if (char === '{') { braces++; started = true; }
      if (char === '}') braces--;
    }
    if (started && braces <= 0) return i + 1;
  }
  return Math.min(lines.length, start + 1);
}

function parseFile(file: SourceFile, structure: StructuralResult | null): { symbols: CodeSymbol[]; calls: PendingCall[]; imports: PendingImport[] } {
  const symbols: CodeSymbol[] = [];
  const calls: PendingCall[] = [];
  const imports: PendingImport[] = [];
  const lines = file.content.split('\n');
  const moduleId = symbolId(file.path, file.path.split('/').pop() || file.path, 1);
  symbols.push({ id: moduleId, name: file.path.split('/').pop() || file.path, kind: 'module', file: file.path, line: 1, endLine: lines.length, signature: file.path, exported: true });

  lines.forEach((text, index) => {
    const line = index + 1;
    let match: RegExpMatchArray | null = null;
    let kind: SymbolKind = 'function';
    let exported = false;
    if (file.language === 'typescript' || file.language === 'javascript') {
      match = text.match(/^\s*(export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*(\([^)]*\))/);
      if (!match) match = text.match(/^\s*(export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/);
      if (!match) { match = text.match(/^\s*(export\s+)?(?:default\s+)?class\s+([A-Za-z_$][\w$]*)/); kind = 'class'; }
      if (!match) { match = text.match(/^\s*(export\s+)?interface\s+([A-Za-z_$][\w$]*)/); kind = 'interface'; }
      if (!match) { match = text.match(/^\s*(export\s+)?type\s+([A-Za-z_$][\w$]*)/); kind = 'type'; }
      exported = Boolean(match?.[1]);
      const imp = text.match(/^\s*import\s+(.*?)\s+from\s+['"]([^'"]+)['"]|^\s*import\s+['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/);
      if (imp) imports.push({ from: moduleId, specifier: imp[2] || imp[3] || imp[4], names: (imp[1] || '').replace(/[{}*]/g, '').split(/[,\s]+/).filter(Boolean), line });
    } else if (file.language === 'python') {
      match = text.match(/^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)\s*(\([^)]*\))/);
      if (!match) { match = text.match(/^\s*class\s+([A-Za-z_]\w*)/); kind = 'class'; }
      const imp = text.match(/^\s*(?:from\s+([\w.]+)\s+import\s+(.+)|import\s+([\w.]+))/);
      if (imp) imports.push({ from: moduleId, specifier: imp[1] || imp[3], names: (imp[2] || '').split(',').map(v => v.trim()), line });
    } else if (file.language === 'go') {
      match = text.match(/^\s*func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)\s*(\([^)]*\))/);
      const type = text.match(/^\s*type\s+([A-Za-z_]\w*)\s+(?:struct|interface)\b/);
      if (!match && type) { match = type; kind = text.includes('interface') ? 'interface' : 'type'; }
      const imp = text.match(/^\s*(?:[\w.]+\s+)?["`]([^"`]+)["`]/);
      if (imp && (text.includes('import') || lines.slice(Math.max(0, index - 8), index).some(l => /^\s*import\s*\($/.test(l)))) imports.push({ from: moduleId, specifier: imp[1], names: [], line });
    }
    if (match) {
      const name = (file.language === 'typescript' || file.language === 'javascript') ? match[2] : match[1];
      if (name && !symbols.some(symbol => symbol.name === name && symbol.line === line)) {
        symbols.push({ id: symbolId(file.path, name, line), name, kind, file: file.path, line, endLine: findBlockEnd(lines, index, file.language), signature: text.trim().replace(/\s*[{:]\s*$/, ''), exported });
      }
    }
  });

  if (structure?.definitions.length) {
    symbols.splice(1);
    for (const definition of structure.definitions) {
      const text = lines[definition.line - 1]?.trim() || definition.name;
      const exported = /\bexport\b/.test(text) || (file.language === 'go' && /^[A-Z]/.test(definition.name));
      const id = symbolId(file.path, definition.name, definition.line);
      symbols.push({ id, name: definition.name, kind: definition.kind, file: file.path, line: definition.line, endLine: definition.endLine, signature: text.replace(/\s*[{:]\s*$/, ''), exported });
      for (const call of definition.calls) if (call.name !== definition.name && !ignoredCalls.has(call.name)) calls.push({ from: id, name: call.name, line: call.line });
    }
    for (const item of structure.imports) if (!imports.some(existing => existing.specifier === item.specifier && existing.line === item.line)) imports.push({ from: moduleId, specifier: item.specifier, names: [], line: item.line });
    return { symbols, calls, imports };
  }

  const callable = symbols.filter(symbol => ['function', 'method'].includes(symbol.kind));
  for (const owner of callable) {
    for (let i = owner.line - 1; i < owner.endLine; i++) {
      const stripped = lines[i].replace(/(?:\/\/|#).*$/, '').replace(/(['"`]).*?\1/g, '');
      for (const call of stripped.matchAll(/\b([A-Za-z_$][\w$]*)\s*\(/g)) {
        if (call[1] !== owner.name && !ignoredCalls.has(call[1])) calls.push({ from: owner.id, name: call[1], line: i + 1 });
      }
    }
  }
  return { symbols, calls, imports };
}

function resolveImport(fromPath: string, specifier: string, modules: CodeSymbol[]): CodeSymbol | undefined {
  const normalized = specifier.replace(/^\.\//, '').replace(/\.(?:[cm]?[jt]sx?|py|go)$/, '').replace(/\./g, '/');
  const baseDir = fromPath.includes('/') ? fromPath.slice(0, fromPath.lastIndexOf('/')) : '';
  const target = normalized.startsWith('../') || specifier.startsWith('.')
    ? `${baseDir}/${normalized}`.split('/').reduce<string[]>((acc, part) => part === '..' ? (acc.pop(), acc) : part === '.' || !part ? acc : [...acc, part], []).join('/')
    : normalized;
  return modules.find(module => {
    const bare = module.file.replace(/\.(?:[cm]?[jt]sx?|py|go)$/, '').replace(/\/index$/, '');
    return bare === target || bare.endsWith(`/${target}`) || bare.endsWith(`/${normalized}`);
  });
}

export async function buildIndex(inputs: FileInput[], project = 'Local project', onProgress?: (done: number, total: number) => void): Promise<CodeIndex> {
  const started = performance.now();
  const files: SourceFile[] = inputs.map(input => ({ path: cleanName(input.path), content: input.content, language: languageFor(input.path), lines: input.content.split('\n').length })).filter(file => file.language !== 'unknown');
  const symbols: CodeSymbol[] = [];
  const calls: PendingCall[] = [];
  const imports: PendingImport[] = [];
  for (let i = 0; i < files.length; i++) {
    const parsed = parseFile(files[i], await extractStructure(files[i]));
    symbols.push(...parsed.symbols); calls.push(...parsed.calls); imports.push(...parsed.imports);
    onProgress?.(i + 1, files.length);
    if (i % 20 === 19) await new Promise<void>(resolve => setTimeout(resolve, 0));
  }
  const byName = new Map<string, CodeSymbol[]>();
  for (const symbol of symbols.filter(item => item.kind !== 'module')) byName.set(symbol.name, [...(byName.get(symbol.name) || []), symbol]);
  const modules = symbols.filter(item => item.kind === 'module');
  const edges: GraphEdge[] = [];
  for (const call of calls) {
    const owner = symbols.find(item => item.id === call.from);
    const options = byName.get(call.name) || [];
    const localTarget = options.find(item => item.file === owner?.file);
    const ownerModule = modules.find(module => module.file === owner?.file);
    const namedImport = imports.find(item => item.from === ownerModule?.id && item.names.includes(call.name));
    const importedModule = namedImport ? resolveImport(owner?.file || '', namedImport.specifier, modules) : undefined;
    const importedTarget = importedModule ? options.find(item => item.file === importedModule.file) : undefined;
    const target = localTarget || importedTarget || (options.length === 1 ? options[0] : undefined);
    if (target) edges.push({ id: `call:${call.from}:${target.id}:${call.line}`, from: call.from, to: target.id, kind: 'call', line: call.line, confidence: target.file === owner?.file ? 'exact' : 'heuristic' });
  }
  for (const item of imports) {
    const target = resolveImport(symbols.find(symbol => symbol.id === item.from)?.file || '', item.specifier, modules);
    if (target) edges.push({ id: `import:${item.from}:${target.id}:${item.line}`, from: item.from, to: target.id, kind: 'import', line: item.line, confidence: 'heuristic' });
  }
  const unique = [...new Map(edges.map(edge => [`${edge.from}:${edge.to}:${edge.kind}`, edge])).values()];
  return {
    version: 1, project, createdAt: new Date().toISOString(), files, symbols, edges: unique,
    warnings: ['Cross-file calls use name and import heuristics. Dynamic dispatch and generated code may be incomplete.'],
    stats: { files: files.length, symbols: symbols.length, edges: unique.length, lines: files.reduce((sum, file) => sum + file.lines, 0), elapsedMs: Math.round(performance.now() - started) },
  };
}

export function validateIndex(value: unknown): value is CodeIndex {
  const candidate = value as Partial<CodeIndex>;
  return Boolean(candidate && candidate.version === 1 && typeof candidate.project === 'string' && Array.isArray(candidate.files) && Array.isArray(candidate.symbols) && Array.isArray(candidate.edges));
}
