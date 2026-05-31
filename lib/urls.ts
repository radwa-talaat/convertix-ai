const LOCAL_APP_URL = "http://localhost:3000";

type DeploymentEnv = {
  NEXT_PUBLIC_APP_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
  [key: string]: string | undefined;
};

function ensureProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function firstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim());
}

export function normalizeBaseUrl(value: string | null | undefined): string {
  if (!value) {
    return LOCAL_APP_URL;
  }

  try {
    return new URL(ensureProtocol(value.trim())).origin;
  } catch {
    return LOCAL_APP_URL;
  }
}

export function getDeploymentAppUrl(env: DeploymentEnv = process.env): string {
  return normalizeBaseUrl(
    firstNonEmpty(
      env.NEXT_PUBLIC_APP_URL,
      env.VERCEL_PROJECT_PRODUCTION_URL,
      env.VERCEL_BRANCH_URL,
      env.VERCEL_URL,
    ),
  );
}

export function createAppUrl(path = "/", baseUrl = getDeploymentAppUrl()) {
  return new URL(path, `${normalizeBaseUrl(baseUrl)}/`).toString();
}

export function getAppHost(baseUrl = getDeploymentAppUrl()) {
  return new URL(normalizeBaseUrl(baseUrl)).host;
}

export function getAppHostname(baseUrl = getDeploymentAppUrl()) {
  return new URL(normalizeBaseUrl(baseUrl)).hostname;
}

export function getAppProtocol(baseUrl = getDeploymentAppUrl()) {
  return new URL(normalizeBaseUrl(baseUrl)).protocol.replace(":", "");
}

export function isLocalAppUrl(baseUrl = getDeploymentAppUrl()) {
  const hostname = getAppHostname(baseUrl);
  return hostname === "localhost" || hostname === "127.0.0.1";
}
