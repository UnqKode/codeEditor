import type { Metadata } from "next";
import { FolderSearch } from "lucide-react";
import { Suspense } from "react";
import { Brand } from "@/components/brand";
import { ImportRepositoryDialog } from "@/features/projects/components/import-repository-dialog";
import { ProjectCard } from "@/features/projects/components/project-card";
import { listProjects } from "@/features/projects/server/project-store";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <ImportRepositoryDialog />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Import a repository to explore its files, architecture and relationships. Every relationship Lens
            shows will be traceable to source-code evidence.
          </p>
        </section>

        <Suspense fallback={<ProjectGridSkeleton />}>
          <ProjectGrid />
        </Suspense>
      </main>
    </div>
  );
}

async function ProjectGrid() {
  const projects = await listProjects();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
        <FolderSearch className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground">Import a GitHub repository to get started.</p>
        </div>
        <ImportRepositoryDialog />
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id} className="contents">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy aria-label="Loading projects">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}
