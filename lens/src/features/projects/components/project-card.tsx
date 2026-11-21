import { FileCode2, FolderGit2, GitCommitHorizontal } from "lucide-react";
import Link from "next/link";
import type { ProjectSource, ProjectSummary } from "../types";
import { DemoDataBadge, IndexingStatusBadge } from "./status-badges";

function sourceLabel(source: ProjectSource): string {
  switch (source.kind) {
    case "github":
      return `${source.owner}/${source.repo} · ${source.branch}`;
    case "zip":
      return source.fileName;
    case "demo":
      return "Built-in sample";
  }
}

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-4 transition-colors outline-none hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg border bg-muted text-muted-foreground group-hover:text-primary">
            <FolderGit2 className="size-4.5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-medium">{project.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{sourceLabel(project.source)}</p>
          </div>
        </div>
        {project.source.kind === "demo" && <DemoDataBadge />}
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <IndexingStatusBadge status={project.indexingStatus} />
        <span className="flex items-center gap-1">
          <FileCode2 className="size-3.5" />
          {project.fileCount} files · {project.primaryLanguage}
        </span>
        <span className="flex items-center gap-1 font-mono">
          <GitCommitHorizontal className="size-3.5" />
          {project.commit ? project.commit.slice(0, 7) : "no commit"}
        </span>
        <span className="ml-auto">Updated {dateFormat.format(new Date(project.updatedAt))}</span>
      </div>
    </Link>
  );
}
