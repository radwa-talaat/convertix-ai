import type { TrafficSourceMetric } from "@/types/analytics";

export function BarChart({ data }: { data: TrafficSourceMetric[] }) {
  const max = Math.max(...data.map((item) => item.visitors), 1);

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Traffic sources</h3>
        <span className="text-xs text-muted-foreground">Bar chart</span>
      </div>
      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div key={item.source}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="capitalize">{item.source}</span>
              <span className="text-muted-foreground">{item.visitors}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(item.visitors / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
