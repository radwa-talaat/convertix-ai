import { sectionRegistry } from "@/lib/rendering/section-registry";
import type { LandingPageSectionType } from "@/types/rendering";

export function resolveSectionComponent(type: LandingPageSectionType) {
  return sectionRegistry[type]?.component ?? null;
}
