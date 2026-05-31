"use client";

import { Radio } from "lucide-react";

import { useRealtimeMetrics } from "@/hooks/analytics";

export function RealtimeMetrics({ visitors }: { visitors: number }) {
  const realtime = useRealtimeMetrics(visitors);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm">
      <span className="relative flex size-3">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
      </span>
      <Radio className="size-4 text-muted-foreground" />
      <span className="font-medium">{realtime.visitors} live visitors</span>
      <span className="text-muted-foreground">
        Updated {realtime.updatedAt.toLocaleTimeString()}
      </span>
    </div>
  );
}
