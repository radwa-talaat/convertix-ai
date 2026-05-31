import {
  Eyebrow,
  SectionShell,
} from "@/components/landing-page/sections/section-shell";
import type {
  FaqSectionData,
  LandingPageSectionProps,
} from "@/types/rendering";

export function FaqSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<FaqSectionData>) {
  const renderText = editor?.renderText;

  return (
    <SectionShell direction={direction} id={sectionId} theme={theme}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
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
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <details
              className="group rounded-lg border p-4"
              key={item.question}
              open={data.items[0]?.question === item.question}
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius,
              }}
            >
              <summary className="cursor-pointer list-none text-sm font-semibold">
                {renderText?.({
                  path: `items.${index}.question`,
                  value: item.question,
                }) ?? item.question}
              </summary>
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: theme.colors.muted }}
              >
                {renderText?.({
                  multiline: true,
                  path: `items.${index}.answer`,
                  value: item.answer,
                }) ?? item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
