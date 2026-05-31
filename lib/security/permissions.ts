import type { SubscriptionState } from "@/types/billing";

export function canAccessProtectedRoute({
  isAuthenticated,
  pathname,
}: {
  isAuthenticated: boolean;
  pathname: string;
}) {
  if (!pathname.startsWith("/dashboard")) {
    return true;
  }

  return isAuthenticated;
}

export function isSubscriptionUsable(status: SubscriptionState) {
  return status === "active" || status === "trialing" || status === "free";
}
