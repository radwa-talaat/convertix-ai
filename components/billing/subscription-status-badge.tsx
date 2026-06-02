import { Badge } from "@/components/ui/badge";
import type { SubscriptionState } from "@/types/billing";

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionState;
}) {
  const variant =
    status === "active" || status === "trialing" || status === "free"
      ? "success"
      : status === "past_due"
        ? "outline"
        : "muted";

  const label = status === "free" ? "starter" : status.replace("_", " ");

  return <Badge variant={variant}>{label}</Badge>;
}
