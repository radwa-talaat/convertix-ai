import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UsageRecord } from "@/types/billing";

export function UsageStatistics({ usage }: { usage: UsageRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usage.map((item) => {
          const percent =
            item.limit === 0
              ? 100
              : Math.min(100, Math.round((item.used / item.limit) * 100));

          return (
            <div key={item.metric}>
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">
                  {item.metric.replace("_", " ")}
                </span>
                <span className="text-muted-foreground">
                  {item.used} / {item.limit}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
