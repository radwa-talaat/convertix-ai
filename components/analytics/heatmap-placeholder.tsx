export function HeatmapPlaceholder() {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="font-semibold">Heatmap</h3>
      <div className="mt-5 grid h-56 grid-cols-8 gap-2">
        {Array.from({ length: 48 }).map((_, index) => (
          <div
            className="rounded"
            key={index}
            style={{
              backgroundColor: `hsl(var(--primary) / ${0.08 + ((index * 13) % 60) / 100})`,
            }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Placeholder ready for click-density collection without slowing public
        pages.
      </p>
    </div>
  );
}
