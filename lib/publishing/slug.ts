const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "login",
  "preview",
  "register",
  "settings",
  "www",
]);

export function generateSlug(input: string): string {
  const normalized = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  const slug = normalized || "landing-page";

  return RESERVED_SLUGS.has(slug) ? `${slug}-page` : slug;
}

export function isValidSlug(slug: string): boolean {
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length <= 80 &&
    !RESERVED_SLUGS.has(slug)
  );
}

export function ensureValidSlug(input: string): string {
  const slug = generateSlug(input);

  if (!isValidSlug(slug)) {
    throw new Error("Invalid publish slug.");
  }

  return slug;
}
