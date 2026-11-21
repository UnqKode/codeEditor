import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProject } from "@/features/projects/server/project-store";
import { WorkspaceShell } from "@/features/workspace/components/workspace-shell";

export default function ProjectPage({ params }: PageProps<"/projects/[projectId]">) {
  return (
    // `params` is request data, so it's read inside a Suspense boundary (required by Cache Components).
    <Suspense fallback={<WorkspaceSkeleton />}>
      <ProjectWorkspace params={params} />
    </Suspense>
  );
}

async function ProjectWorkspace({ params }: Pick<PageProps<"/projects/[projectId]">, "params">) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();
  return <WorkspaceShell project={project} />;
}

function WorkspaceSkeleton() {
  return (
    <div className="flex h-dvh flex-col" aria-busy aria-label="Loading workspace">
      <div className="h-11 border-b" />
      <div className="flex flex-1">
        <div className="w-64 animate-pulse border-r bg-sidebar" />
        <div className="flex-1" />
      </div>
      <div className="h-6 border-t bg-sidebar" />
    </div>
  );
}
