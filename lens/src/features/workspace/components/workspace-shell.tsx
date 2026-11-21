"use client";

import {
  Boxes,
  ChevronRight,
  Code2,
  GitCommitHorizontal,
  PanelLeft,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AssistantPanel } from "@/features/ai-assistant/components/assistant-panel";
import { ArchitectureView } from "@/features/architecture/components/architecture-view";
import { EditorArea } from "@/features/editor/components/editor-area";
import { FileExplorer } from "@/features/explorer/components/file-explorer";
import { DemoDataBadge, IndexingStatusBadge } from "@/features/projects/components/status-badges";
import type { ProjectDetail } from "@/features/projects/types";
import { cn } from "@/lib/utils";
import { WorkspaceStoreProvider, useWorkspace, type CenterView } from "../store/workspace-store";

export function WorkspaceShell({ project }: { project: ProjectDetail }) {
  return (
    <WorkspaceStoreProvider>
      <div className="flex h-dvh flex-col overflow-hidden">
        <TopBar project={project} />
        <main className="min-h-0 flex-1">
          <WorkspacePanels project={project} />
        </main>
        <StatusBar project={project} />
      </div>
    </WorkspaceStoreProvider>
  );
}

function TopBar({ project }: { project: ProjectDetail }) {
  const explorerOpen = useWorkspace((s) => s.explorerOpen);
  const assistantOpen = useWorkspace((s) => s.assistantOpen);
  const toggleExplorer = useWorkspace((s) => s.toggleExplorer);
  const toggleAssistant = useWorkspace((s) => s.toggleAssistant);

  return (
    <header className="grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b px-3">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <Brand />
        <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
        <Link href="/projects" className="shrink-0 text-muted-foreground hover:text-foreground">
          Projects
        </Link>
        <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{project.name}</span>
        {project.source.kind === "demo" && <DemoDataBadge className="ml-1 hidden md:inline-flex" />}
      </div>

      <ViewSwitcher />

      <div className="flex items-center justify-end gap-1">
        <IconToggle icon={PanelLeft} label="Toggle explorer" pressed={explorerOpen} onClick={toggleExplorer} />
        <IconToggle icon={Sparkles} label="Toggle assistant" pressed={assistantOpen} onClick={toggleAssistant} />
      </div>
    </header>
  );
}

const views: { id: CenterView | "data-flow"; label: string; icon: LucideIcon; disabledReason?: string }[] = [
  { id: "editor", label: "Code", icon: Code2 },
  { id: "architecture", label: "Architecture", icon: Boxes },
  { id: "data-flow", label: "Data flow", icon: Workflow, disabledReason: "Data-flow tracing is planned for Phase 5" },
];

function ViewSwitcher() {
  const centerView = useWorkspace((s) => s.centerView);
  const setCenterView = useWorkspace((s) => s.setCenterView);

  return (
    <nav aria-label="Workspace view" className="flex items-center gap-0.5 rounded-lg border bg-card p-0.5">
      {views.map(({ id, label, icon: Icon, disabledReason }) => {
        const active = id === centerView;
        const button = (
          <button
            type="button"
            aria-pressed={active}
            disabled={Boolean(disabledReason)}
            onClick={() => id !== "data-flow" && setCenterView(id)}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
              active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
        if (!disabledReason) return <span key={id}>{button}</span>;
        // Disabled buttons don't emit pointer events, so the tooltip is attached to a wrapper.
        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {button}
              </span>
            </TooltipTrigger>
            <TooltipContent>{disabledReason}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

function IconToggle(props: { icon: LucideIcon; label: string; pressed: boolean; onClick: () => void }) {
  const { icon: Icon, label, pressed, onClick } = props;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={pressed}
          onClick={onClick}
          className={cn(pressed ? "text-foreground" : "text-muted-foreground")}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function WorkspacePanels({ project }: { project: ProjectDetail }) {
  const explorerOpen = useWorkspace((s) => s.explorerOpen);
  const assistantOpen = useWorkspace((s) => s.assistantOpen);
  const centerView = useWorkspace((s) => s.centerView);

  return (
    <ResizablePanelGroup orientation="horizontal">
      {explorerOpen && (
        <>
          <ResizablePanel id="explorer" defaultSize={260} minSize={180} maxSize="40%">
            <FileExplorer projectName={project.name} filePaths={project.filePaths} />
          </ResizablePanel>
          <ResizableHandle />
        </>
      )}

      <ResizablePanel id="center" minSize="30%">
        {centerView === "editor" ? (
          <EditorArea projectId={project.id} />
        ) : (
          <ArchitectureView indexingStatus={project.indexingStatus} />
        )}
      </ResizablePanel>

      {assistantOpen && (
        <>
          <ResizableHandle />
          <ResizablePanel id="assistant" defaultSize={320} minSize={260} maxSize="45%">
            <AssistantPanel />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}

function StatusBar({ project }: { project: ProjectDetail }) {
  const activePath = useWorkspace((s) => s.tabs.activePath);

  return (
    <footer className="flex h-6 shrink-0 items-center gap-4 border-t bg-sidebar px-3 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1 font-mono">
        <GitCommitHorizontal className="size-3.5" />
        {project.commit ? project.commit.slice(0, 7) : "no commit"}
      </span>
      <IndexingStatusBadge status={project.indexingStatus} />
      <span className="ml-auto truncate">{activePath ?? "No file open"}</span>
      <span>Read-only</span>
    </footer>
  );
}
