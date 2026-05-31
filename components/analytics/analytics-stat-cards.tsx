import { Activity, MousePointerClick, Timer, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PageMetricSummary } from "@/types/analytics";

export function AnalyticsStatCards({
  metrics,
}: {
  metrics: PageMetricSummary;
}) {
  const items = [
    { icon: Activity, label: "Views", value: metrics.views.toLocaleString() },
    {
      icon: Users,
      label: "Unique visitors",
      value: metrics.uniqueVisitors.toLocaleString(),
    },
    {
      icon: MousePointerClick,
      label: "CTA clicks",
      value: metrics.ctaClicks.toLocaleString(),
    },
    {
      icon: Timer,
      label: "Avg time",
      value: `${metrics.averageTimeOnPage}s`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {item.label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
