import { Boxes } from "lucide-react";
import { IndexingStatusBadge } from "@/features/projects/components/status-badges";
import type { IndexingStatus } from "@/features/projects/types";

/**
 * Placeholder for the architecture graph (Phase 4). It deliberately renders no graph: until the
 * analysis engine produces a code graph for this snapshot, there is nothing truthful to draw.
 */
export function ArchitectureView({ indexingStatus }: { indexingStatus: IndexingStatus }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl border bg-card">
        <Boxes className="size-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex max-w-md flex-col items-center gap-2">
        <h2 className="font-medium">Architecture graph</h2>
        <p className="text-sm text-muted-foreground">
          Once this repository is indexed, files, modules, classes and functions will appear here as an explorable
          graph, with every import and call linked back to its source location.
        </p>
        <IndexingStatusBadge status={indexingStatus} />
      </div>
    </div>
  );
}
