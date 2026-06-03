import * as React from "react";

import { getLandingPageTheme } from "@/components/landing-page/themes";
import { resolveSectionComponent } from "@/lib/rendering/component-resolver";
import { getRenderableSections } from "@/lib/rendering/section-ordering";
import { buildLandingPageStructuredData } from "@/lib/rendering/seo";
import {
  buildEditorFontFaceCss,
  createThemeFromEditorTokens,
} from "@/services/editor";
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
  const fontFaceCss = buildEditorFontFaceCss(template.editorState?.themeTokens);

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
      {fontFaceCss ? (
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss }} />
      ) : null}
      {sections.map((section) => {
        const Component = resolveSectionComponent(section.type);

        if (!Component) {
          return null;
        }

        const style = template.editorState?.sectionStyles?.[section.id];
        const sectionTheme =
          style?.backgroundColor ||
          style?.backgroundImageUrl ||
          style?.textScale
            ? {
                ...theme,
                colors: {
                  ...theme.colors,
                  background: style?.backgroundImageUrl
                    ? "transparent"
                    : (style?.backgroundColor ?? theme.colors.background),
                },
                typography: {
                  ...theme.typography,
                  textScale: style?.textScale ?? 100,
                },
              }
            : theme;

        return (
          <div
            className="relative overflow-hidden"
            key={section.id}
            style={{
              backgroundColor: style?.backgroundColor,
              textAlign: style?.align,
            }}
          >
            {style?.backgroundImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 size-full object-cover"
                src={style.backgroundImageUrl}
              />
            ) : null}
            <div className="relative z-10">
              <Component
                data={section.data}
                direction={template.direction}
                renderContext={renderContext}
                sectionId={section.type}
                theme={sectionTheme}
              />
            </div>
            {style?.foregroundImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${section.type} media`}
                className="pointer-events-none absolute z-20 max-w-[70%] rounded-lg border border-black/10 bg-white object-contain p-2 shadow-2xl"
                src={style.foregroundImageUrl}
                style={{
                  left: `${style.foregroundImageX ?? 82}%`,
                  top: `${style.foregroundImageY ?? 72}%`,
                  transform: "translate(-50%, -50%)",
                  width: `min(${style.foregroundImageWidth ?? 220}px, 70%)`,
                }}
              />
            ) : null}
            {(style?.customTexts ?? []).map((text) => (
              <div
                className="pointer-events-none absolute z-30 max-w-[70%] whitespace-pre-wrap break-words rounded-sm px-1 font-semibold leading-tight"
                key={text.id}
                style={{
                  color: text.color ?? theme.colors.foreground,
                  fontFamily: text.fontFamily ?? theme.typography.heading,
                  fontSize: `min(${text.fontSize}px, 12vw)`,
                  left: `${text.x}%`,
                  textAlign: style?.align,
                  top: `${text.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {text.text}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
});
