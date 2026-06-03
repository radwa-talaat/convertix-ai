import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import {
  createLocalizedPathname,
  defaultLocale,
  getLocaleFromPathname,
  stripLocaleFromPathname,
  type AppLocale,
} from "@/lib/i18n/config";
import type { Database } from "@/types/database";

const protectedRoutePrefixes = ["/dashboard"];
const authRoutePrefixes = ["/login", "/register", "/forgot-password"];

type UpdateSessionOptions = {
  locale?: AppLocale;
  pathname?: string;
};

export async function updateSession(
  request: NextRequest,
  initialResponse?: NextResponse,
  options?: UpdateSessionOptions,
) {
  const response = initialResponse ?? NextResponse.next({ request });

  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    return response;
  }

  const supabase = createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  const isAuthenticated = Boolean(data?.claims.sub);
  const pathname =
    options?.pathname ?? stripLocaleFromPathname(request.nextUrl.pathname);
  const locale =
    options?.locale ??
    getLocaleFromPathname(request.nextUrl.pathname) ??
    defaultLocale;
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthRoute = authRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = createLocalizedPathname("/login", locale);
    redirectUrl.searchParams.set(
      "next",
      createLocalizedPathname(pathname, locale),
    );

    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = createLocalizedPathname("/dashboard", locale);
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
