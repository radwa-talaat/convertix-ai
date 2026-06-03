import { Quote } from "lucide-react";

import {
  Eyebrow,
  SectionShell,
} from "@/components/landing-page/sections/section-shell";
import type {
  LandingPageSectionProps,
  TestimonialsSectionData,
} from "@/types/rendering";

export function TestimonialsSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<TestimonialsSectionData>) {
  const renderText = editor?.renderText;
  const textScale = (theme.typography.textScale ?? 100) / 100;

  return (
    <SectionShell direction={direction} id={sectionId} theme={theme}>
      <div className="max-w-2xl">
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
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {data.items.map((item, index) => (
          <article
            className="rounded-lg border p-5"
            key={`${item.author}-${item.role}`}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius,
            }}
          >
            <Quote className="size-5 opacity-70" />
            <p
              className="mt-5 text-base leading-7"
              style={{ fontSize: `calc(1rem * ${textScale})` }}
            >
              &ldquo;
              {renderText?.({
                multiline: true,
                path: `items.${index}.quote`,
                value: item.quote,
              }) ?? item.quote}
              &rdquo;
            </p>
            <div className="mt-6">
              <p
                className="font-semibold"
                style={{ fontSize: `calc(1rem * ${textScale})` }}
              >
                {renderText?.({
                  path: `items.${index}.author`,
                  value: item.author,
                }) ?? item.author}
              </p>
              <p
                className="mt-1 text-sm"
                style={{
                  color: theme.colors.muted,
                  fontSize: `calc(0.875rem * ${textScale})`,
                }}
              >
                {renderText?.({
                  path: `items.${index}.role`,
                  value: item.role,
                }) ?? item.role}
              </p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
