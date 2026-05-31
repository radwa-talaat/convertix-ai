import { env } from "@/lib/env";

export function getAppHostname(): string {
  try {
    return new URL(env.appUrl).hostname;
  } catch {
    return "localhost:3000";
  }
}

export function createProjectPublicUrl(projectSlug: string, pageSlug?: string) {
  const hostname = getAppHostname();
  const protocol = hostname.includes("localhost") ? "http" : "https";
  const path = pageSlug && pageSlug !== "home" ? `/${pageSlug}` : "";

  return `${protocol}://${projectSlug}.${hostname}${path}`;
}

export function createPathPublicUrl(slug: string) {
  return `${env.appUrl.replace(/\/$/, "")}/p/${slug}`;
}

export function createCustomDomainUrl(hostname: string, pageSlug?: string) {
  const path = pageSlug && pageSlug !== "home" ? `/${pageSlug}` : "";

  return `https://${hostname}${path}`;
}
