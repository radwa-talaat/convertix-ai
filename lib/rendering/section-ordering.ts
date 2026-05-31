import type { LandingPageSection } from "@/types/rendering";

export function getRenderableSections(sections: LandingPageSection[]) {
  return sections
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);
}
