import { File, FileCode2, FileJson, FileText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const icons: { test: RegExp; icon: LucideIcon; className: string }[] = [
  { test: /\.(ts|tsx|mts|cts)$/i, icon: FileCode2, className: "text-sky-400" },
  { test: /\.(js|jsx|mjs|cjs)$/i, icon: FileCode2, className: "text-yellow-300" },
  { test: /\.json$/i, icon: FileJson, className: "text-amber-300" },
  { test: /\.(md|txt)$/i, icon: FileText, className: "text-muted-foreground" },
];

export function FileIcon({ name, className }: { name: string; className?: string }) {
  const match = icons.find((entry) => entry.test.test(name));
  const Icon = match?.icon ?? File;
  return <Icon aria-hidden className={cn("size-4 shrink-0", match?.className ?? "text-muted-foreground", className)} />;
}
