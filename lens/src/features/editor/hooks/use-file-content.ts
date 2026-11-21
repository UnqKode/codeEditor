"use client";

import { useQuery } from "@tanstack/react-query";
import type { FileContent } from "@/features/projects/types";

async function fetchFileContent(projectId: string, path: string, signal: AbortSignal): Promise<FileContent> {
  const url = `/api/projects/${encodeURIComponent(projectId)}/files?path=${encodeURIComponent(path)}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return (await response.json()) as FileContent;
}

export function useFileContent(projectId: string, path: string | null) {
  return useQuery({
    queryKey: ["file-content", projectId, path],
    queryFn: ({ signal }) => fetchFileContent(projectId, path as string, signal),
    enabled: path !== null,
  });
}
