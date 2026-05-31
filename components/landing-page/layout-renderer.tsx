import * as React from "react";

import { getLandingPageTheme } from "@/components/landing-page/themes";
import { resolveSectionComponent } from "@/lib/rendering/component-resolver";
import { getRenderableSections } from "@/lib/rendering/section-ordering";
import { buildLandingPageStructuredData } from "@/lib/rendering/seo";
import type { LandingPageTemplate, LandingPageTheme } from "@/types/rendering";

type LayoutRendererProps = {
  template: LandingPageTemplate;
  themeOverride?: LandingPageTheme;
};

export const LayoutRenderer = React.memo(function LayoutRenderer({
  template,
  themeOverride,
}: LayoutRendererProps) {
  const theme = themeOverride ?? getLandingPageTheme(template.themeId);
  const sections = getRenderableSections(template.sections);
  const structuredData = buildLandingPageStructuredData(template);

  return (
    <div
      dir={template.direction}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        fontFamily: theme.typography.body,
      }}
    >
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      {sections.map((section) => {
        const Component = resolveSectionComponent(section.type);

        if (!Component) {
          return null;
        }

        return (
          <Component
            data={section.data}
            direction={template.direction}
            key={section.id}
            sectionId={section.type}
            theme={theme}
          />
        );
      })}
    </div>
  );
});
