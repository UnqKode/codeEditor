import {
  ArrowRight,
  Boxes,
  FolderTree,
  GitBranch,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ProductPreview } from "@/features/landing/components/product-preview";
import { cn } from "@/lib/utils";

type Availability = "available" | "soon";

const features: { icon: LucideIcon; title: string; body: string; status: Availability }[] = [
  {
    icon: FolderTree,
    title: "Browse any repository",
    body: "A fast file explorer and code viewer with tabs, so you can read a codebase without cloning it.",
    status: "available",
  },
  {
    icon: Boxes,
    title: "Architecture in 3D",
    body: "Files, modules, classes and functions as a graph you can rotate, filter and expand one subsystem at a time.",
    status: "soon",
  },
  {
    icon: Workflow,
    title: "Trace data flow",
    body: "Follow a request from the API endpoint through validation and services down to the database.",
    status: "soon",
  },
  {
    icon: Sparkles,
    title: "Ask your codebase",
    body: "An assistant that answers from your actual source, with file and line citations for every claim.",
    status: "soon",
  },
];

const steps = [
  { icon: GitBranch, title: "Import", body: "Paste a GitHub URL or upload a ZIP. Code is parsed, never executed." },
  { icon: ScanSearch, title: "Index", body: "Lens extracts symbols, imports and calls, pinned to a specific commit." },
  { icon: Boxes, title: "Explore", body: "Navigate the graph, jump to source, and see how the pieces connect." },
];

const confidence = [
  { label: "Verified", tone: "text-emerald-400 border-emerald-400/40", body: "Established directly by source analysis." },
  { label: "Inferred", tone: "text-warning border-warning/40", body: "Suggested by evidence, never shown as fact." },
  { label: "Observed", tone: "text-primary border-primary/40", body: "Captured from real runtime execution." },
  { label: "Unknown", tone: "text-muted-foreground border-border", body: "Not enough information, and we say so." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-transparent bg-background/80 backdrop-blur supports-[backdrop-filter]:border-border">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="flex items-center gap-1 text-sm">
            <a href="#features" className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground sm:block">
              Features
            </a>
            <a href="#how-it-works" className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground sm:block">
              How it works
            </a>
            <Button asChild size="sm" className="ml-2">
              <Link href="/projects">Try Lens for free</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_60%)]"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-28">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Early preview · TypeScript &amp; JavaScript first
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                See how your codebase <span className="text-primary">actually works.</span>
              </h1>
              <p className="max-w-xl text-lg text-pretty text-muted-foreground">
                Lens turns a repository into an interactive map of its architecture, so you can trace how requests
                travel, what depends on what, and what might break, all backed by real source-code evidence.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-11 px-5 text-base">
                  <Link href="/projects">
                    Try Lens for free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-11 px-4 text-base text-muted-foreground">
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16 border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading
              eyebrow="Features"
              title="Understand unfamiliar code in minutes, not weeks"
              body="Start by reading the code. Soon, explore its structure, follow its data and question it."
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, body, status }) => (
                <li key={title} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg border bg-muted text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <AvailabilityTag status={status} />
                  </div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-16 border-t bg-card/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="How it works" title="From repository to understanding in three steps" />
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full border font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </span>
                    <Icon className="size-4 text-primary" />
                    <h3 className="font-medium">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Evidence */}
        <section className="border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <ShieldCheck className="size-7 text-primary" strokeWidth={1.5} />
              <h2 className="text-3xl font-semibold tracking-tight text-balance">Evidence, not guesses</h2>
              <p className="text-muted-foreground">
                A beautiful graph of wrong relationships is useless. Every connection in Lens is labelled with how we
                know it, so you can tell what the code proves from what it only suggests.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {confidence.map(({ label, tone, body }) => (
                <li key={label} className="rounded-xl border bg-card p-4">
                  <span className={cn("inline-block rounded-full border px-2 py-0.5 text-xs font-medium", tone)}>
                    {label}
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Stop guessing how the code fits together.
            </h2>
            <p className="max-w-lg text-muted-foreground">Open a sample project now and explore the workspace.</p>
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <Link href="/projects">
                Try Lens for free
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6">
          <Brand />
          <span>Early preview</span>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <span className="text-xs font-semibold tracking-wider text-primary uppercase">{eyebrow}</span>
      <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
      {body && <p className="text-muted-foreground">{body}</p>}
    </div>
  );
}

function AvailabilityTag({ status }: { status: Availability }) {
  return status === "available" ? (
    <span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[11px] text-emerald-400">Available</span>
  ) : (
    <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">Coming soon</span>
  );
}
