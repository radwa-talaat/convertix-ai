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
        {data.fields?.length ? (
          <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-start sm:grid-cols-2">
            {data.fields.map((field, index) => (
              <div
                className="rounded-md border p-4"
                key={field.id}
                style={{
                  backgroundColor: `${theme.colors.primaryForeground}14`,
                  borderColor: `${theme.colors.primaryForeground}33`,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70"
                  style={{ fontSize: `calc(0.75rem * ${textScale})` }}
                >
                  {renderText?.({
                    path: `fields.${index}.label`,
                    value: field.label,
                  }) ?? field.label}
                </p>
                <p
                  className="mt-2 text-sm leading-6 opacity-90"
                  style={{ fontSize: `calc(0.875rem * ${textScale})` }}
                >
                  {renderText?.({
                    multiline: true,
                    path: `fields.${index}.value`,
                    value: field.value,
                  }) ?? field.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
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
