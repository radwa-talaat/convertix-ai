import type { TimeSeriesPoint } from "@/types/analytics";

export function LineChart({ data }: { data: TimeSeriesPoint[] }) {
  const max = Math.max(...data.map((point) => point.views), 1);
  const points = data
    .map((point, index) => {
      const x = (index / Math.max(1, data.length - 1)) * 100;
      const y = 100 - (point.views / max) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Views over time</h3>
        <span className="text-xs text-muted-foreground">Line chart</span>
      </div>
      <svg className="mt-5 h-56 w-full overflow-visible" viewBox="0 0 100 100">
        <polyline
          fill="none"
          points={points}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {data.map((point, index) => {
          const x = (index / Math.max(1, data.length - 1)) * 100;
          const y = 100 - (point.views / max) * 90;

          return (
            <circle
              className="fill-background stroke-foreground"
              cx={x}
              cy={y}
              key={point.date}
              r="2.5"
            />
          );
        })}
      </svg>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        {data.map((point) => (
          <span key={point.date}>{point.date}</span>
        ))}
      </div>
    </div>
  );
}
