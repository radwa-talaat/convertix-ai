import type { Json } from "@/types/database";
import type { LandingPageTemplate } from "@/types/rendering";

export function parseLandingPageTemplate(
  value: Json,
): LandingPageTemplate | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Partial<LandingPageTemplate>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.slug !== "string" ||
    !Array.isArray(candidate.sections)
  ) {
    return null;
  }

  return candidate as LandingPageTemplate;
}
