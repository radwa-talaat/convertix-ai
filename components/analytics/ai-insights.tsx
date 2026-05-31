import { Badge } from "@/components/ui/badge";
import type { AiAnalyticsInsight } from "@/types/analytics";

export function AiInsights({
  score,
  insights,
}: {
  insights: AiAnalyticsInsight[];
  score: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">AI insights summary</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            AI conversion score: {score}/100
          </p>
        </div>
        <Badge variant={score >= 70 ? "success" : "outline"}>{score}</Badge>
      </div>
      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <article
            className="rounded-md border border-border bg-secondary/30 p-3"
            key={insight.title}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{insight.title}</p>
              <Badge variant="outline">{insight.priority}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {insight.recommendation}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
