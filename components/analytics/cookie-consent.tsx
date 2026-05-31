"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(getAnalyticsConsent() === "unknown");
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-border bg-background p-4 shadow-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          We use anonymous analytics to understand page performance and improve
          conversion insights. No personal data is required.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            onClick={() => {
              setAnalyticsConsent("declined");
              setVisible(false);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Decline
          </Button>
          <Button
            onClick={() => {
              setAnalyticsConsent("accepted");
              setVisible(false);
            }}
            size="sm"
            type="button"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
