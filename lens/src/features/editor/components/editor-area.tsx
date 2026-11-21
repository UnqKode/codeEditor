"use client";

import { AlertTriangle, ChevronRight, FileSearch, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/features/explorer/components/file-icon";
import { useWorkspace } from "@/features/workspace/store/workspace-store";
import { cn } from "@/lib/utils";
import { useFileContent } from "../hooks/use-file-content";
import { CodeViewer } from "./code-viewer";

export function EditorArea({ projectId }: { projectId: string }) {
  const { openPaths, activePath } = useWorkspace((s) => s.tabs);

  if (openPaths.length === 0 || !activePath) return <EmptyEditor />;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <EditorTabs openPaths={openPaths} activePath={activePath} />
      <Breadcrumbs path={activePath} />
      <div className="min-h-0 flex-1">
        <FileContentView projectId={projectId} path={activePath} />
      </div>
    </div>
  );
}

function EditorTabs({ openPaths, activePath }: { openPaths: string[]; activePath: string }) {
  const openFile = useWorkspace((s) => s.openFile);
  const closeFile = useWorkspace((s) => s.closeFile);

  return (
    <div role="tablist" aria-label="Open files" className="flex h-9 shrink-0 overflow-x-auto border-b bg-card/60">
      {openPaths.map((path) => {
        const name = path.split("/").pop() ?? path;
        const isActive = path === activePath;
        return (
          <div
            key={path}
            className={cn(
              "group relative flex shrink-0 items-center border-r text-[13px]",
              isActive ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent/40",
            )}
          >
            {isActive && <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-primary" />}
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              title={path}
              onClick={() => openFile(path)}
              onAuxClick={(e) => e.button === 1 && closeFile(path)}
              className="flex h-full items-center gap-1.5 pr-1 pl-3 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <FileIcon name={name} className="size-3.5" />
              {name}
            </button>
            <button
              type="button"
              aria-label={`Close ${name}`}
              onClick={() => closeFile(path)}
              className={cn(
                "mr-1.5 rounded p-0.5 hover:bg-accent focus-visible:opacity-100",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Breadcrumbs({ path }: { path: string }) {
  const segments = path.split("/");
  return (
    <nav aria-label="File path" className="flex h-6 shrink-0 items-center gap-0.5 px-3 text-xs text-muted-foreground">
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <ChevronRight aria-hidden className="size-3" />}
          <span className={cn(i === segments.length - 1 && "text-foreground/90")}>{segment}</span>
        </span>
      ))}
    </nav>
  );
}

function FileContentView({ projectId, path }: { projectId: string; path: string }) {
  const { data, error, isPending, refetch, isFetching } = useFileContent(projectId, path);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-xs text-muted-foreground" aria-busy>
        <Loader2 className="size-4 animate-spin" />
        Loading {path}…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertTriangle className="size-6 text-destructive" />
        <div>
          <p className="text-sm font-medium">Couldn’t load this file</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
          Retry
        </Button>
      </div>
    );
  }

  return <CodeViewer path={data.path} content={data.content} />;
}

function EmptyEditor() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <FileSearch className="size-10 text-muted-foreground/50" strokeWidth={1.25} />
      <div>
        <p className="text-sm font-medium">No file open</p>
        <p className="text-xs text-muted-foreground">Select a file in the explorer to view its source.</p>
      </div>
    </div>
  );
}
