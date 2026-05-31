"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

type SegmentedControlProps<TValue extends string> = {
  items: Array<{
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    value: TValue;
  }>;
  onChange: (value: TValue) => void;
  value: TValue;
};

export function SegmentedControl<TValue extends string>({
  items,
  onChange,
  value,
}: SegmentedControlProps<TValue>) {
  return (
    <div className="inline-flex rounded-md border border-border bg-secondary/50 p-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.value === value;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center gap-2 rounded px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              isActive && "bg-background text-foreground shadow-luxury-sm",
            )}
            key={item.value}
            onClick={() => onChange(item.value)}
            title={item.label}
            type="button"
          >
            {Icon ? <Icon className="size-4" /> : null}
            <span className="hidden xl:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
