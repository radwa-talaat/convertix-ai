import type { DeviceMetric } from "@/types/analytics";

export function PieChart({ data }: { data: DeviceMetric[] }) {
  const total = data.reduce((sum, item) => sum + item.visitors, 0) || 1;
  let accumulated = 0;
  const palette = ["#111827", "#6b7280", "#d1d5db"];

  const gradient = data
    .map((item, index) => {
      const start = (accumulated / total) * 100;
      accumulated += item.visitors;
      const end = (accumulated / total) * 100;
      return `${palette[index % palette.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="font-semibold">Device analytics</h3>
      <div className="mt-6 flex items-center gap-6">
        <div
          className="size-32 rounded-full border border-border"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="space-y-3 text-sm">
          {data.map((item, index) => (
            <div className="flex items-center gap-2" key={item.device}>
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: palette[index % palette.length] }}
              />
              <span className="capitalize">{item.device}</span>
              <span className="text-muted-foreground">{item.visitors}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
