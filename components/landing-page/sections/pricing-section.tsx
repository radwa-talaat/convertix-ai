import { ArrowRight } from "lucide-react";

import {
  Eyebrow,
  SectionShell,
} from "@/components/landing-page/sections/section-shell";
import type {
  LandingPageSectionProps,
  PricingSectionData,
} from "@/types/rendering";

export function PricingSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<PricingSectionData>) {
  const renderText = editor?.renderText;
  const textScale = (theme.typography.textScale ?? 100) / 100;

  return (
    <SectionShell direction={direction} id={sectionId} theme={theme}>
      <div
        className="mx-auto max-w-3xl rounded-lg border p-6 text-center shadow-xl sm:p-10"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius,
        }}
      >
        <Eyebrow>
          {renderText?.({ path: "eyebrow", value: data.eyebrow }) ??
            data.eyebrow}
        </Eyebrow>
        <h2
          className="mt-4 text-balance break-words text-[clamp(1.85rem,7vw,2.5rem)] font-semibold leading-tight tracking-normal"
          style={{
            fontFamily: theme.typography.heading,
            fontSize: `calc(clamp(1.85rem, 7vw, 2.5rem) * ${textScale})`,
          }}
        >
          {renderText?.({
            multiline: true,
            path: "title",
            value: data.title,
          }) ?? data.title}
        </h2>
        <p
          className="mt-4 text-base leading-7"
          style={{
            color: theme.colors.muted,
            fontSize: `calc(1rem * ${textScale})`,
          }}
        >
          {renderText?.({ multiline: true, path: "copy", value: data.copy }) ??
            data.copy}
        </p>
        <a
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium"
          href="#cta"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryForeground,
          }}
        >
          {renderText?.({ path: "cta", value: data.cta }) ?? data.cta}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </a>
      </div>
    </SectionShell>
  );
}
