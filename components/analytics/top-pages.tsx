import type { TopPageMetric } from "@/types/analytics";

export function TopPages({ pages }: { pages: TopPageMetric[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="font-semibold">Top pages</h3>
      <div className="mt-4 divide-y divide-border">
        {pages.map((page) => (
          <div
            className="flex items-center justify-between gap-4 py-3 text-sm"
            key={page.slug}
          >
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-xs text-muted-foreground">/{page.slug}</p>
            </div>
            <div className="text-right">
              <p>{page.views} views</p>
              <p className="text-xs text-muted-foreground">
                {page.conversionRate}% conversion
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
