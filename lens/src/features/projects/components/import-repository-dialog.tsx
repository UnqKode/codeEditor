"use client";

import { FileArchive, GitBranch, Info, Plus } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseGitHubRepoUrl, type GitHubRepoRef } from "../lib/github-url";

type SubmitState = { kind: "idle" } | { kind: "invalid" } | { kind: "accepted"; repo: GitHubRepoRef };

/**
 * Entry point for importing repositories. URL validation is real; the import itself is not
 * implemented yet (Phase 2), and the dialog says so instead of pretending to import.
 */
export function ImportRepositoryDialog() {
  const inputId = useId();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const repo = parseGitHubRepoUrl(url);
    setState(repo ? { kind: "accepted", repo } : { kind: "invalid" });
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setUrl("");
          setState({ kind: "idle" });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Import repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import a repository</DialogTitle>
          <DialogDescription>
            Lens analyses TypeScript and JavaScript repositories first. Code is parsed, never executed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor={inputId}>GitHub repository URL</Label>
            <div className="relative">
              <GitBranch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={inputId}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (state.kind !== "idle") setState({ kind: "idle" });
                }}
                placeholder="https://github.com/owner/repo"
                className="pl-8 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={state.kind === "invalid"}
                aria-describedby={`${inputId}-status`}
              />
            </div>
            <div id={`${inputId}-status`} aria-live="polite" className="min-h-5 text-xs">
              {state.kind === "invalid" && (
                <p className="text-destructive">Enter a GitHub URL like github.com/owner/repo.</p>
              )}
              {state.kind === "accepted" && (
                <p className="flex items-start gap-1.5 text-muted-foreground">
                  <Info className="mt-px size-3.5 shrink-0 text-primary" />
                  <span>
                    Recognised <span className="font-mono text-foreground">{state.repo.owner}/{state.repo.repo}</span>.
                    Importing is not available yet. It arrives with repository ingestion (Phase 2).
                  </span>
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="items-center sm:justify-between">
            <Button type="button" variant="ghost" size="sm" disabled title="ZIP upload is planned for Phase 2">
              <FileArchive />
              Upload ZIP (soon)
            </Button>
            <Button type="submit" disabled={!url.trim()}>
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
