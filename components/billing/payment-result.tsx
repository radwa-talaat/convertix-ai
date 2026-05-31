import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PaymentResult({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/billing">Back to billing</Link>
        </Button>
      </div>
    </main>
  );
}
