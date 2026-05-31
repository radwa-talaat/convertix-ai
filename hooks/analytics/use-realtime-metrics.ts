"use client";

import * as React from "react";

export function useRealtimeMetrics(initialVisitors: number) {
  const [visitors, setVisitors] = React.useState(initialVisitors);
  const [updatedAt, setUpdatedAt] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setVisitors((current) =>
        Math.max(0, current + (Math.random() > 0.5 ? 1 : -1)),
      );
      setUpdatedAt(new Date());
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return { updatedAt, visitors };
}
