/**
 * Decorative illustration of the Lens workspace for the landing page.
 * It's intentionally abstract (bars, not real code or real analysis) and hidden from assistive tech.
 */

const nodes = [
  { id: "route", x: 70, y: 60, label: "routes/checkout" },
  { id: "schema", x: 60, y: 170, label: "checkout-schema" },
  { id: "service", x: 220, y: 110, label: "order-service" },
  { id: "pricing", x: 330, y: 40, label: "pricing" },
  { id: "db", x: 360, y: 180, label: "db/client" },
] as const;

type NodeId = (typeof nodes)[number]["id"];

const edges: { from: NodeId; to: NodeId; dashed?: boolean }[] = [
  { from: "route", to: "schema" },
  { from: "route", to: "service" },
  { from: "service", to: "pricing" },
  { from: "service", to: "db" },
  { from: "pricing", to: "db", dashed: true },
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<NodeId, (typeof nodes)[number]>;

const codeLines = [72, 48, 86, 60, 34, 78, 52, 66, 40, 70, 56];

export function ProductPreview() {
  return (
    <div aria-hidden className="relative">
      {/* soft glow behind the window */}
      <div className="absolute -inset-x-10 -top-10 -bottom-6 -z-10 rounded-[3rem] bg-primary/10 blur-3xl" />

      <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/40">
        {/* window chrome */}
        <div className="flex h-8 items-center gap-1.5 border-b px-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <div className="mx-auto flex gap-1 rounded-md border bg-background/60 p-0.5 text-[10px] text-muted-foreground">
            <span className="rounded px-2 py-0.5">Code</span>
            <span className="rounded bg-accent px-2 py-0.5 text-foreground">Architecture</span>
            <span className="rounded px-2 py-0.5">Data flow</span>
          </div>
        </div>

        <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[8.5rem_1fr_9rem]">
          {/* explorer */}
          <div className="flex flex-col gap-2 border-r bg-sidebar p-3">
            {[60, 80, 70, 50, 75, 55, 65].map((w, i) => (
              <div key={i} className="flex items-center gap-1.5" style={{ paddingLeft: i % 3 === 0 ? 0 : 10 }}>
                <span className="size-2 rounded-sm bg-primary/50" />
                <span className="h-1.5 rounded-full bg-muted-foreground/25" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>

          {/* graph */}
          <div className="relative bg-background">
            <svg viewBox="0 0 430 230" className="h-full w-full">
              <defs>
                <marker id="lens-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" className="fill-primary/70" />
                </marker>
              </defs>
              {edges.map(({ from, to, dashed }) => {
                const a = byId[from];
                const b = byId[to];
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeWidth={1.5}
                    strokeDasharray={dashed ? "4 4" : undefined}
                    markerEnd="url(#lens-arrow)"
                    className={dashed ? "stroke-warning/60" : "stroke-primary/50"}
                  />
                );
              })}
              {nodes.map((n) => (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                  <circle r={n.id === "service" ? 14 : 10} className="fill-card stroke-primary" strokeWidth={1.5} />
                  <circle r={n.id === "service" ? 5 : 3.5} className="fill-primary" />
                  <text y={n.id === "service" ? 30 : 25} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* inspector */}
          <div className="hidden flex-col gap-2 border-l bg-sidebar p-3 sm:flex">
            <span className="h-2 w-2/3 rounded-full bg-foreground/40" />
            <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground/25" />
            <div className="mt-2 flex flex-col gap-1.5">
              {codeLines.slice(0, 6).map((w, i) => (
                <span key={i} className="h-1.5 rounded-full bg-muted-foreground/20" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-auto flex gap-1">
              <span className="rounded-full border border-emerald-400/40 px-1.5 text-[9px] text-emerald-400">verified</span>
              <span className="rounded-full border border-warning/40 px-1.5 text-[9px] text-warning">inferred</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
