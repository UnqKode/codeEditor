"use client";

import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/features/workspace/store/workspace-store";

/** Reserved space for the RAG-backed assistant (Phase 6). No model is wired up. */
export function AssistantPanel() {
  const toggleAssistant = useWorkspace((s) => s.toggleAssistant);

  return (
    <aside aria-label="AI assistant" className="flex h-full flex-col bg-sidebar">
      <div className="flex h-9 shrink-0 items-center justify-between pr-1 pl-3">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Assistant</span>
        <Button variant="ghost" size="icon-xs" onClick={toggleAssistant} aria-label="Close assistant">
          <X />
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <Sparkles className="size-6 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm font-medium">Codebase assistant</p>
        <p className="text-xs text-muted-foreground">
          Ask how features work and get answers grounded in this repository, with file and line citations.
          Available after indexing and retrieval are built.
        </p>
      </div>

      <div className="border-t p-2">
        <textarea
          disabled
          rows={2}
          placeholder="Ask about this repository…"
          aria-label="Ask the assistant (not available yet)"
          className="w-full resize-none rounded-md border bg-input/20 px-2.5 py-2 text-xs placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </aside>
  );
}
