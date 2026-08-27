/** The largest local project Graphite will retain in browser memory. */
export const MAX_SUPPORTED_FILES = 5_000;

export interface DirectoryCandidate {
  path: string;
}

export interface DirectoryLimitResult<T extends DirectoryCandidate> {
  files: T[];
  exceeded: boolean;
}

export function exceedsDirectoryFileLimit(fileCount: number): boolean {
  return fileCount > MAX_SUPPORTED_FILES;
}

/** Keep directory selection deterministic and all-or-nothing. */
export function applyDirectoryFileLimit<T extends DirectoryCandidate>(files: T[]): DirectoryLimitResult<T> {
  const ordered = [...files].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  return { files: ordered, exceeded: exceedsDirectoryFileLimit(ordered.length) };
}

export function directoryLimitMessage(): string {
  return `This folder contains more than ${MAX_SUPPORTED_FILES.toLocaleString('en-US')} supported files. Graphite did not index it, so browser memory stays protected. Remove or exclude files and try again.`;
}
