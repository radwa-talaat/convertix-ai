import type { NextRequest } from "next/server";

import { resolvePublishedHostRewrite } from "@/lib/publishing";
import { applySecurityHeaders } from "@/lib/security/edge";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const publishedHostRewrite = resolvePublishedHostRewrite(request);

  if (publishedHostRewrite) {
    return applySecurityHeaders(publishedHostRewrite);
  }

  const response = await updateSession(request);

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
