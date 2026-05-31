import type { ConversionFunnelStep } from "@/types/analytics";

export function ConversionFunnel({ steps }: { steps: ConversionFunnelStep[] }) {
  const max = Math.max(...steps.map((step) => step.value), 1);

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="font-semibold">Conversion funnel</h3>
      <div className="mt-6 space-y-3">
        {steps.map((step) => (
          <div key={step.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>{step.label}</span>
              <span className="text-muted-foreground">{step.value}</span>
            </div>
            <div
              className="h-9 rounded-md bg-primary/10"
              style={{ width: `${Math.max(12, (step.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
