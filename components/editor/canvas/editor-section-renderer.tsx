"use client";

import { InlineEditableText } from "@/components/editor/canvas/inline-editable-text";
import { resolveSectionComponent } from "@/lib/rendering/component-resolver";
import {
  createDefaultSectionStyle,
  createThemeFromEditorTokens,
} from "@/services/editor";
import { useEditorStore } from "@/store/editor";
import type { LandingPageSection } from "@/types/rendering";

type EditorSectionRendererProps = {
  section: LandingPageSection;
};

export function EditorSectionRenderer({ section }: EditorSectionRendererProps) {
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const template = useEditorStore((state) => state.template);
  const themeTokens = useEditorStore((state) => state.themeTokens);
  const updateSectionText = useEditorStore((state) => state.updateSectionText);
  const Component = resolveSectionComponent(section.type);

  if (!template || !Component) {
    return null;
  }

  const style = sectionStyles[section.id] ?? createDefaultSectionStyle();
  const theme = createThemeFromEditorTokens(themeTokens);
  const sectionTheme =
    style.backgroundColor || style.backgroundImageUrl || style.textScale
      ? {
          ...theme,
          colors: {
            ...theme.colors,
            background: style.backgroundImageUrl
              ? "transparent"
              : (style.backgroundColor ?? theme.colors.background),
          },
          typography: {
            ...theme.typography,
            textScale: style.textScale ?? 100,
          },
        }
      : theme;

  return (
    <Component
      data={section.data}
      direction={template.direction}
      editor={{
        renderText: (options) => (
          <InlineEditableText
            {...options}
            onCommit={(path, value) =>
              updateSectionText(section.id, path, value)
            }
          />
        ),
      }}
      sectionId={section.type}
      theme={sectionTheme}
    />
  );
}
