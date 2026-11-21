"use client";

import { ChevronRight, Folder, FolderOpen, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/features/workspace/store/workspace-store";
import { cn } from "@/lib/utils";
import { buildFileTree, collectDirectoryPaths, filterFileTree, type FileTreeNode } from "../lib/file-tree";
import { FileIcon } from "./file-icon";

interface FileExplorerProps {
  projectName: string;
  filePaths: string[];
}

export function FileExplorer({ projectName, filePaths }: FileExplorerProps) {
  const [query, setQuery] = useState("");
  const tree = useMemo(() => buildFileTree(filePaths), [filePaths]);
  const visibleTree = useMemo(() => filterFileTree(tree, query), [tree, query]);

  const storedExpanded = useWorkspace((s) => s.expandedDirs);
  // While filtering, every directory on the path to a match is shown expanded.
  const expanded = useMemo<ReadonlySet<string>>(
    () => (query.trim() ? new Set(collectDirectoryPaths(visibleTree)) : new Set(Object.keys(storedExpanded))),
    [query, visibleTree, storedExpanded],
  );

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-9 shrink-0 items-center px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        Explorer
      </div>

      <div className="px-2 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Filter files"
            aria-label="Filter files"
            className="h-7 pr-7 pl-7 text-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="truncate px-3 pb-1 text-xs font-medium text-foreground/90">{projectName}</div>

      <ScrollArea className="min-h-0 flex-1">
        {filePaths.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">This repository has no files.</p>
        ) : visibleTree.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">No files match “{query}”.</p>
        ) : (
          <ul role="tree" aria-label="Repository files" className="pb-4">
            {visibleTree.map((node) => (
              <TreeItem key={node.path} node={node} depth={0} expanded={expanded} />
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}

interface TreeItemProps {
  node: FileTreeNode;
  depth: number;
  expanded: ReadonlySet<string>;
}

function TreeItem({ node, depth, expanded }: TreeItemProps) {
  const activePath = useWorkspace((s) => s.tabs.activePath);
  const openFile = useWorkspace((s) => s.openFile);
  const toggleDirectory = useWorkspace((s) => s.toggleDirectory);

  const indent = { paddingLeft: `${depth * 12 + 8}px` };
  const rowClass =
    "flex h-6 w-full items-center gap-1.5 pr-2 text-left text-[13px] outline-none hover:bg-sidebar-accent focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring";

  if (node.kind === "file") {
    const isActive = node.path === activePath;
    return (
      <li role="treeitem" aria-selected={isActive}>
        <button
          type="button"
          onClick={() => openFile(node.path)}
          title={node.path}
          className={cn(rowClass, isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}
          style={indent}
        >
          <span className="w-3.5 shrink-0" />
          <FileIcon name={node.name} />
          <span className="truncate">{node.name}</span>
        </button>
      </li>
    );
  }

  const isOpen = expanded.has(node.path);
  const FolderIcon = isOpen ? FolderOpen : Folder;
  return (
    <li role="treeitem" aria-expanded={isOpen} aria-selected={false}>
      <button type="button" onClick={() => toggleDirectory(node.path)} className={rowClass} style={indent}>
        <ChevronRight
          aria-hidden
          className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")}
        />
        <FolderIcon aria-hidden className="size-4 shrink-0 text-primary/80" />
        <span className="truncate">{node.name}</span>
      </button>
      {isOpen && (
        <ul role="group">
          {node.children.map((child) => (
            <TreeItem key={child.path} node={child} depth={depth + 1} expanded={expanded} />
          ))}
        </ul>
      )}
    </li>
  );
}
