import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  createLocalizedPathname,
  detectLocale,
  getLocaleFromPathname,
  localeCookieName,
  stripLocaleFromPathname,
} from "@/lib/i18n/config";
import { resolvePublishedHostRewrite } from "@/lib/publishing";
import { applySecurityHeaders } from "@/lib/security/edge";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const publishedHostRewrite = resolvePublishedHostRewrite(request);

  if (publishedHostRewrite) {
    return applySecurityHeaders(publishedHostRewrite);
  }

  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    const detectedLocale = detectLocale(
      request.headers.get("accept-language"),
      request.cookies.get(localeCookieName)?.value,
    );
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = createLocalizedPathname(pathname, detectedLocale);

    return applySecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  const internalPathname = stripLocaleFromPathname(pathname);
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = internalPathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-app-locale", locale);
  requestHeaders.set("x-next-intl-locale", locale);

  const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  });
  rewriteResponse.cookies.set(localeCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  const response = await updateSession(request, rewriteResponse, {
    locale,
    pathname: internalPathname,
  });

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
