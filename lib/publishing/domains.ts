export function normalizeHostname(hostname: string): string {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
}

export function isValidHostname(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);

  return (
    normalized.length <= 253 &&
    /^(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/.test(normalized) &&
    !normalized.includes("..")
  );
}

export function assertValidHostname(hostname: string): string {
  const normalized = normalizeHostname(hostname);

  if (!isValidHostname(normalized)) {
    throw new Error("Invalid custom domain hostname.");
  }

  return normalized;
}

export function getDnsTarget(appHostname: string): string {
  return appHostname.replace(/^https?:\/\//, "");
}
