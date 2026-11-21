import { Aperture } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
        <Aperture className="size-3.5" strokeWidth={2.5} />
      </span>
      Lens
    </Link>
  );
}
