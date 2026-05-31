import { buildLandingPageTemplate } from "@/services/rendering/ai-content-adapter";
import { sampleAiContent } from "@/services/rendering/sample-page";
import type { LandingPageTemplate } from "@/types/rendering";

export function getSampleLandingPageTemplate(): LandingPageTemplate {
  return buildLandingPageTemplate({
    brandName: "LaunchOS",
    content: sampleAiContent,
    slug: "launch-os",
    themeId: "linear",
  });
}

export function getLandingPageTemplateBySlug(slug: string) {
  const sample = getSampleLandingPageTemplate();

  if (slug === sample.slug) {
    return sample;
  }

  return null;
}
