import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This project doesn’t exist or you don’t have access to it.
      </p>
      <Button asChild variant="outline">
        <Link href="/projects">Back to projects</Link>
      </Button>
    </main>
  );
}
