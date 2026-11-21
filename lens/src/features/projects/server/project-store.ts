/**
 * Server-side access to projects. This is the seam where real persistence (PostgreSQL) and
 * repository snapshots (object storage) will plug in during Phase 2. Today it only serves the
 * built-in demo project, which is mock data.
 */
import { normalizePath } from "@/features/explorer/lib/file-tree";
import { demoProject, demoProjectFiles } from "../mock/demo-project";
import type { FileContent, ProjectDetail, ProjectSummary } from "../types";

const projects: readonly ProjectDetail[] = [demoProject];

function toSummary(project: ProjectDetail): ProjectSummary {
  const summary: ProjectSummary & { filePaths?: string[] } = { ...project };
  delete summary.filePaths; // the dashboard only needs counts, not the full listing
  return summary;
}

export async function listProjects(): Promise<ProjectSummary[]> {
  return projects.map(toSummary);
}

export async function getProject(projectId: string): Promise<ProjectDetail | null> {
  return projects.find((p) => p.id === projectId) ?? null;
}

export async function getFileContent(projectId: string, path: string): Promise<FileContent | null> {
  if (projectId !== demoProject.id) return null;
  const normalized = normalizePath(path);
  // Own-property lookup only, so paths like "__proto__" or "constructor" can never resolve.
  if (!Object.hasOwn(demoProjectFiles, normalized)) return null;
  return { path: normalized, content: demoProjectFiles[normalized] };
}
