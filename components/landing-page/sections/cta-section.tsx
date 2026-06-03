import type {
  CtaSectionData,
  LandingPageSectionProps,
} from "@/types/rendering";

export function CtaSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<CtaSectionData>) {
  const renderText = editor?.renderText;
  const textScale = (theme.typography.textScale ?? 100) / 100;

  return (
    <section
      className="px-4 py-16 sm:px-6 lg:px-8"
      dir={direction}
      id={sectionId}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
      }}
    >
      <div
        className="mx-auto max-w-6xl rounded-lg border p-8 text-center shadow-xl sm:p-12"
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.border,
          borderRadius: theme.radius,
          color: theme.colors.primaryForeground,
        }}
      >
        <h2
          className="text-balance break-words text-[clamp(1.85rem,7vw,2.5rem)] font-semibold leading-tight tracking-normal"
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
          className="mx-auto mt-4 max-w-2xl text-base leading-7 opacity-80"
          style={{ fontSize: `calc(1rem * ${textScale})` }}
        >
          {renderText?.({
            multiline: true,
            path: "description",
            value: data.description,
          }) ?? data.description}
        </p>
        <a
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium"
          href="#"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
          }}
        >
          {renderText?.({ path: "cta", value: data.cta }) ?? data.cta}
        </a>
      </div>
    </section>
  );
}
