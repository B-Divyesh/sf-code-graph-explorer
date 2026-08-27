import type { Language as CodeLanguage, SourceFile, SymbolKind } from './types';
import type Parser from 'web-tree-sitter';

export interface StructuralDefinition {
  name: string;
  kind: SymbolKind;
  line: number;
  endLine: number;
  calls: { name: string; line: number }[];
}

export interface StructuralResult {
  definitions: StructuralDefinition[];
  imports: { specifier: string; line: number }[];
}

const grammarNames: Partial<Record<CodeLanguage, string>> = {
  typescript: 'typescript', javascript: 'javascript', python: 'python', go: 'go',
};
let initialized = false;
let modulePromise: Promise<{ default: typeof Parser }> | null = null;
const languages = new Map<string, Parser.Language>();

async function engine(): Promise<typeof Parser> {
  modulePromise ||= import('web-tree-sitter');
  const module = await modulePromise;
  const ParserClass = module.default;
  if (!initialized) {
    await ParserClass.init({ locateFile: () => '/wasm/web-tree-sitter.wasm' });
    initialized = true;
  }
  return ParserClass;
}

function terminalName(text: string): string | undefined {
  return text.match(/([A-Za-z_$][\w$]*)\s*$/)?.[1];
}

function definitionKind(type: string): SymbolKind | null {
  if (type.includes('class')) return 'class';
  if (type.includes('interface')) return 'interface';
  if (type === 'type_alias_declaration' || type === 'type_spec') return 'type';
  if (type.includes('method')) return 'method';
  if (type.includes('function')) return 'function';
  return null;
}

export async function extractStructure(file: SourceFile): Promise<StructuralResult | null> {
  const grammar = grammarNames[file.language];
  if (!grammar || typeof window === 'undefined') return null;
  try {
    const ParserClass = await engine();
    let language = languages.get(grammar);
    if (!language) { language = await ParserClass.Language.load(`/wasm/tree-sitter-${grammar}.wasm`); languages.set(grammar, language); }
    const parser = new ParserClass(); parser.setLanguage(language);
    const tree = parser.parse(file.content);
    if (!tree) { parser.delete(); return null; }
    const definitions: StructuralDefinition[] = [];
    const imports: StructuralResult['imports'] = [];
    const definitionNodes = new Map<number, StructuralDefinition>();
    const walkDefinitions = (node: Parser.SyntaxNode): void => {
      let kind = definitionKind(node.type);
      let nameNode = node.childForFieldName('name');
      if (node.type === 'variable_declarator') {
        const value = node.childForFieldName('value');
        if (value && (value.type === 'arrow_function' || value.type === 'function_expression')) kind = 'function'; else kind = null;
      }
      if (node.type === 'type_declaration') kind = null;
      if (kind && nameNode) {
        const definition = { name: nameNode.text, kind, line: node.startPosition.row + 1, endLine: node.endPosition.row + 1, calls: [] };
        if (!definitions.some(item => item.name === definition.name && item.line === definition.line)) { definitions.push(definition); definitionNodes.set(node.id, definition); }
      }
      if (node.type === 'type_spec') {
        nameNode = node.childForFieldName('name');
        if (nameNode) { const definition = { name: nameNode.text, kind: 'type' as const, line: node.startPosition.row + 1, endLine: node.endPosition.row + 1, calls: [] }; definitions.push(definition); definitionNodes.set(node.id, definition); }
      }
      if (node.type.includes('import')) {
        const text = node.text;
        const match = file.language === 'python' ? text.match(/(?:from|import)\s+([\w.]+)/) : text.match(/["']([^"']+)["']/);
        if (match) imports.push({ specifier: match[1], line: node.startPosition.row + 1 });
      }
      for (const child of node.namedChildren) walkDefinitions(child);
    };
    walkDefinitions(tree.rootNode);
    const walkCalls = (node: Parser.SyntaxNode, owner?: StructuralDefinition): void => {
      const ownDefinition = definitionNodes.get(node.id) || owner;
      if (node.type === 'call_expression' && ownDefinition) {
        const functionNode = node.childForFieldName('function'); const name = functionNode ? terminalName(functionNode.text) : undefined;
        if (name) ownDefinition.calls.push({ name, line: node.startPosition.row + 1 });
      }
      for (const child of node.namedChildren) walkCalls(child, ownDefinition);
    };
    walkCalls(tree.rootNode);
    tree.delete(); parser.delete();
    return { definitions, imports };
  } catch (error) {
    console.warn('Tree-sitter unavailable; using the heuristic parser for this file.', error);
    return null;
  }
}
