import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isValidHostname } from "@/lib/publishing/domains";
import { isValidSlug } from "@/lib/publishing/slug";
import { getAppHostname } from "@/lib/publishing/urls";

export function resolvePublishedHostRewrite(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const appHost = getAppHostname().split(":")[0].toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (
    !host ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api")
  ) {
    return null;
  }

  if (host.endsWith(`.${appHost}`)) {
    const projectSlug = host.replace(`.${appHost}`, "");

    if (isValidSlug(projectSlug)) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/p/${projectSlug}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  if (host !== appHost && isValidHostname(host)) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/p/launch-os";
    return NextResponse.rewrite(rewriteUrl);
  }

  return null;
}
