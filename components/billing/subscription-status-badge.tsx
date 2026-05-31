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

  return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
}
