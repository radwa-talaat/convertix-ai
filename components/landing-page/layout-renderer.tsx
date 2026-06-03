import * as React from "react";

import { getLandingPageTheme } from "@/components/landing-page/themes";
import { resolveSectionComponent } from "@/lib/rendering/component-resolver";
import { getRenderableSections } from "@/lib/rendering/section-ordering";
import { buildLandingPageStructuredData } from "@/lib/rendering/seo";
import { createThemeFromEditorTokens } from "@/services/editor";
import type {
  LandingPageRenderContext,
  LandingPageTemplate,
  LandingPageTheme,
} from "@/types/rendering";

type LayoutRendererProps = {
  renderContext?: LandingPageRenderContext;
  template: LandingPageTemplate;
  themeOverride?: LandingPageTheme;
};

export const LayoutRenderer = React.memo(function LayoutRenderer({
  renderContext,
  template,
  themeOverride,
}: LayoutRendererProps) {
  const theme =
    themeOverride ??
    (template.editorState?.themeTokens
      ? createThemeFromEditorTokens(template.editorState.themeTokens)
      : getLandingPageTheme(template.themeId));
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

        const style = template.editorState?.sectionStyles?.[section.id];
        const sectionTheme = style?.backgroundColor
          ? {
              ...theme,
              colors: {
                ...theme.colors,
                background: style.backgroundColor,
              },
            }
          : theme;

        return (
          <div
            className="relative overflow-hidden"
            key={section.id}
            style={{
              backgroundColor: style?.backgroundColor,
              backgroundImage: style?.backgroundImageUrl
                ? `linear-gradient(rgb(255 255 255 / 0.32), rgb(255 255 255 / 0.32)), url("${style.backgroundImageUrl}")`
                : undefined,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              textAlign: style?.align,
            }}
          >
            <Component
              data={section.data}
              direction={template.direction}
              renderContext={renderContext}
              sectionId={section.type}
              theme={sectionTheme}
            />
            {style?.foregroundImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${section.type} media`}
                className="pointer-events-none absolute bottom-8 end-8 z-10 max-h-56 w-40 rounded-lg border border-black/10 bg-white object-contain p-2 shadow-2xl sm:w-52"
                src={style.foregroundImageUrl}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
});
