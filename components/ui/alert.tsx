import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground",
        className,
      )}
      role="status"
      {...props}
    />
  );
}
