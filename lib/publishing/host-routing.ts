import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isValidHostname } from "@/lib/publishing/domains";
import { isValidSlug } from "@/lib/publishing/slug";
import { getAppHostname } from "@/lib/publishing/urls";

export function resolvePublishedHostRewrite(request: NextRequest) {
  const requestHost = request.headers.get("host")?.toLowerCase();
  const host = requestHost?.split(":")[0];
  const appHostWithPort = getAppHostname().toLowerCase();
  const appHost = appHostWithPort.split(":")[0];
  const pathname = request.nextUrl.pathname;

  if (
    !host ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api")
  ) {
    return null;
  }

  if (
    requestHost?.endsWith(`.${appHostWithPort}`) ||
    host.endsWith(`.${appHost}`)
  ) {
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
