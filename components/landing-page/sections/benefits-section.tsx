import { CheckCircle2 } from "lucide-react";

import {
  Eyebrow,
  SectionShell,
} from "@/components/landing-page/sections/section-shell";
import type {
  BenefitsSectionData,
  LandingPageSectionProps,
} from "@/types/rendering";

export function BenefitsSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<BenefitsSectionData>) {
  const renderText = editor?.renderText;

  return (
    <SectionShell
      className="border-y"
      direction={direction}
      id={sectionId}
      theme={theme}
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
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
        <div className="grid gap-3">
          {data.items.map((item, index) => (
            <article
              className="flex gap-4 rounded-lg border p-4"
              key={item.title}
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius,
              }}
            >
              <CheckCircle2 className="mt-1 size-5 shrink-0" />
              <div>
                <h3 className="font-semibold">
                  {renderText?.({
                    path: `items.${index}.title`,
                    value: item.title,
                  }) ?? item.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: theme.colors.muted }}
                >
                  {renderText?.({
                    multiline: true,
                    path: `items.${index}.description`,
                    value: item.description,
                  }) ?? item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
