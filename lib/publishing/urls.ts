import { env } from "@/lib/env";
import {
  createAppUrl,
  getAppHost,
  getAppProtocol,
  isLocalAppUrl,
  normalizeBaseUrl,
} from "@/lib/urls";

export function getAppHostname(): string {
  return getAppHost(env.appUrl);
}

export function createProjectPublicUrl(projectSlug: string, pageSlug?: string) {
  const hostname = getAppHostname();
  const protocol = getAppProtocol(env.appUrl);
  const path = pageSlug && pageSlug !== "home" ? `/${pageSlug}` : "";

  if (isLocalAppUrl(env.appUrl)) {
    return createPathPublicUrl(projectSlug);
  }

  return `${protocol}://${projectSlug}.${hostname}${path}`;
}

export function createPathPublicUrl(slug: string) {
  return createAppUrl(`/p/${slug}`, env.appUrl);
}

export function createCustomDomainUrl(hostname: string, pageSlug?: string) {
  const path = pageSlug && pageSlug !== "home" ? `/${pageSlug}` : "";

  return `https://${hostname}${path}`;
}

export function getAppOrigin(): string {
  return normalizeBaseUrl(env.appUrl);
}
