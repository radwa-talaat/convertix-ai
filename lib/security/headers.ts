import { NextResponse } from "next/server";

const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accept.paymob.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://accept.paymob.com",
    "frame-src https://accept.paymob.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accept.paymob.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "on",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
} as const;

export function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function getSecurityHeaders() {
  return securityHeaders;
}
