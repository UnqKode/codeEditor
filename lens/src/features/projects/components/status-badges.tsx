import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IndexingStatus } from "../types";

const statusLabel: Record<IndexingStatus, string> = {
  not_indexed: "Not indexed",
  queued: "Queued",
  indexing: "Indexing…",
  ready: "Indexed",
  failed: "Indexing failed",
};

const statusDot: Record<IndexingStatus, string> = {
  not_indexed: "bg-muted-foreground/60",
  queued: "bg-warning",
  indexing: "bg-warning animate-pulse",
  ready: "bg-emerald-400",
  failed: "bg-destructive",
};

export function IndexingStatusBadge({ status }: { status: IndexingStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5 font-normal text-muted-foreground">
      <span aria-hidden className={cn("size-1.5 rounded-full", statusDot[status])} />
      {statusLabel[status]}
    </Badge>
  );
}

/** Marks anything backed by the built-in mock project so it is never mistaken for real analysis. */
export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn("gap-1 border-warning/40 font-normal text-warning", className)}
          tabIndex={0}
        >
          <FlaskConical />
          Demo data
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">
        A hand-written sample project bundled for UI development. It was not imported or analysed.
      </TooltipContent>
    </Tooltip>
  );
}
