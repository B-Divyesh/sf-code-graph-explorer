export type Language = 'typescript' | 'javascript' | 'python' | 'go' | 'unknown';
export type SymbolKind = 'module' | 'function' | 'method' | 'class' | 'interface' | 'type';
export type EdgeKind = 'call' | 'import';

export interface SourceFile {
  path: string;
  language: Language;
  content: string;
  lines: number;
}

export interface CodeSymbol {
  id: string;
  name: string;
  kind: SymbolKind;
  file: string;
  line: number;
  endLine: number;
  signature: string;
  exported: boolean;
}

export interface PendingCall {
  from: string;
  name: string;
  line: number;
}

export interface PendingImport {
  from: string;
  specifier: string;
  names: string[];
  line: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  line: number;
  confidence: 'exact' | 'heuristic';
}

export interface CodeIndex {
  version: 1;
  project: string;
  createdAt: string;
  files: SourceFile[];
  symbols: CodeSymbol[];
  edges: GraphEdge[];
  warnings: string[];
  stats: { files: number; symbols: number; edges: number; lines: number; elapsedMs: number };
}

export interface FileInput { path: string; content: string }
