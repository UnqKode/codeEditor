export type FileTreeNode =
  | { kind: "file"; name: string; path: string }
  | { kind: "directory"; name: string; path: string; children: FileTreeNode[] };

/** Normalises a repository-relative path: forward slashes, no leading "./" or "/", no trailing "/". */
export function normalizePath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .split("/")
    .filter((segment) => segment !== "" && segment !== ".")
    .join("/");
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function compareNodes(a: FileTreeNode, b: FileTreeNode): number {
  if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
  return collator.compare(a.name, b.name);
}

interface MutableDirectory {
  path: string;
  directories: Map<string, MutableDirectory>;
  files: Set<string>;
}

function toNodes(dir: MutableDirectory): FileTreeNode[] {
  const prefix = dir.path ? `${dir.path}/` : "";
  const nodes: FileTreeNode[] = [];
  for (const [name, child] of dir.directories) {
    nodes.push({ kind: "directory", name, path: child.path, children: toNodes(child) });
  }
  for (const name of dir.files) {
    nodes.push({ kind: "file", name, path: `${prefix}${name}` });
  }
  return nodes.sort(compareNodes);
}

/**
 * Builds a sorted tree (directories first, natural name order) from a flat list of file paths.
 * Intermediate directories are created implicitly; duplicate paths are ignored.
 */
export function buildFileTree(filePaths: readonly string[]): FileTreeNode[] {
  const root: MutableDirectory = { path: "", directories: new Map(), files: new Set() };

  for (const raw of filePaths) {
    const segments = normalizePath(raw).split("/").filter(Boolean);
    if (segments.length === 0) continue;

    let current = root;
    for (const segment of segments.slice(0, -1)) {
      let next = current.directories.get(segment);
      if (!next) {
        next = {
          path: current.path ? `${current.path}/${segment}` : segment,
          directories: new Map(),
          files: new Set(),
        };
        current.directories.set(segment, next);
      }
      current = next;
    }
    const fileName = segments[segments.length - 1];
    // A path that is already known as a directory cannot also be a file.
    if (!current.directories.has(fileName)) current.files.add(fileName);
  }

  return toNodes(root);
}

/**
 * Returns a pruned copy of the tree containing only files whose path matches the query
 * (case-insensitive substring), plus the directories needed to reach them.
 */
export function filterFileTree(nodes: readonly FileTreeNode[], query: string): FileTreeNode[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...nodes];

  const result: FileTreeNode[] = [];
  for (const node of nodes) {
    if (node.kind === "file") {
      if (node.path.toLowerCase().includes(needle)) result.push(node);
    } else {
      const children = filterFileTree(node.children, needle);
      if (children.length > 0) result.push({ ...node, children });
    }
  }
  return result;
}

/** All directory paths in a (possibly filtered) tree — used to auto-expand search results. */
export function collectDirectoryPaths(nodes: readonly FileTreeNode[]): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    if (node.kind === "directory") {
      paths.push(node.path, ...collectDirectoryPaths(node.children));
    }
  }
  return paths;
}

/** Directory paths that contain the given file, outermost first: "a/b/c.ts" → ["a", "a/b"]. */
export function ancestorDirectories(filePath: string): string[] {
  const segments = normalizePath(filePath).split("/");
  return segments.slice(0, -1).map((_, i) => segments.slice(0, i + 1).join("/"));
}
