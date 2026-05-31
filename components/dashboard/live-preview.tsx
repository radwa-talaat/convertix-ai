"use client";

import * as React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

import { LayoutRenderer } from "@/components/landing-page/layout-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LandingPageTemplate, PreviewDevice } from "@/types/rendering";

const deviceConfig: Record<
  PreviewDevice,
  { icon: React.ElementType; label: string; width: string }
> = {
  desktop: {
    icon: Monitor,
    label: "Desktop",
    width: "w-full",
  },
  tablet: {
    icon: Tablet,
    label: "Tablet",
    width: "max-w-[820px]",
  },
  mobile: {
    icon: Smartphone,
    label: "Mobile",
    width: "max-w-[390px]",
  },
};

export function LivePreview({ template }: { template: LandingPageTemplate }) {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-luxury-sm">
        <div>
          <p className="text-sm font-medium">Live Preview</p>
          <p className="text-xs text-muted-foreground">
            Responsive rendering from structured JSON sections.
          </p>
        </div>
        <div className="flex gap-2">
          {(Object.keys(deviceConfig) as PreviewDevice[]).map((key) => {
            const Icon = deviceConfig[key].icon;

            return (
              <Button
                aria-pressed={device === key}
                key={key}
                onClick={() => setDevice(key)}
                size="sm"
                type="button"
                variant={device === key ? "default" : "outline"}
              >
                <Icon />
                {deviceConfig[key].label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 shadow-luxury-md">
        <div
          className={cn(
            "mx-auto overflow-hidden rounded-lg border border-border bg-background shadow-luxury-md transition-all duration-300",
            deviceConfig[device].width,
          )}
        >
          <div className="max-h-[78vh] overflow-y-auto">
            <LayoutRenderer template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}
