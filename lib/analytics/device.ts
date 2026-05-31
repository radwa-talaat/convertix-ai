import type { TrackingDeviceType } from "@/types/analytics";

export function detectDeviceType(userAgent: string): TrackingDeviceType {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet/.test(ua)) {
    return "tablet";
  }

  if (/mobile|iphone|android/.test(ua)) {
    return "mobile";
  }

  return "desktop";
}
