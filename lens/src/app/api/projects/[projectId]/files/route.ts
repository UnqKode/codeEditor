import type { NextRequest } from "next/server";
import { getFileContent } from "@/features/projects/server/project-store";

/** GET /api/projects/:projectId/files?path=src/index.ts → FileContent */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/projects/[projectId]/files">) {
  const { projectId } = await ctx.params;
  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return Response.json({ error: "Missing required query parameter: path" }, { status: 400 });
  }

  const file = await getFileContent(projectId, path);
  if (!file) {
    return Response.json({ error: "File not found" }, { status: 404 });
  }
  return Response.json(file);
}
