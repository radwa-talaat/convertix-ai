import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  action?: React.ReactNode;
  className?: string;
  description: string;
  icon: LucideIcon;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-8 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-md border border-border bg-background shadow-luxury-sm">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-5 text-lg font-semibold tracking-normal">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
