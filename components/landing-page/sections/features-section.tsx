import { Sparkles } from "lucide-react";

import {
  Eyebrow,
  SectionShell,
} from "@/components/landing-page/sections/section-shell";
import type {
  FeaturesSectionData,
  LandingPageSectionProps,
} from "@/types/rendering";

export function FeaturesSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<FeaturesSectionData>) {
  const renderText = editor?.renderText;

  return (
    <SectionShell direction={direction} id={sectionId} theme={theme}>
      <div className="max-w-2xl">
        <Eyebrow>
          {renderText?.({ path: "eyebrow", value: data.eyebrow }) ??
            data.eyebrow}
        </Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
          {renderText?.({
            multiline: true,
            path: "title",
            value: data.title,
          }) ?? data.title}
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {data.items.map((item, index) => (
          <article
            className="rounded-lg border p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1"
            key={item.title}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius,
            }}
          >
            <span
              className="flex size-10 items-center justify-center rounded-md"
              style={{ backgroundColor: theme.colors.background }}
            >
              <Sparkles className="size-4" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">
              {renderText?.({
                path: `items.${index}.title`,
                value: item.title,
              }) ?? item.title}
            </h3>
            <p
              className="mt-3 text-sm leading-6"
              style={{ color: theme.colors.muted }}
            >
              {renderText?.({
                multiline: true,
                path: `items.${index}.description`,
                value: item.description,
              }) ?? item.description}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
