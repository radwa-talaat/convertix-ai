import type {
  HeroSectionData,
  LandingPageSectionProps,
} from "@/types/rendering";

export function HeroRenderSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<HeroSectionData>) {
  const renderText = editor?.renderText;

  return (
    <section
      className="overflow-hidden"
      dir={direction}
      id={sectionId}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-balance text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">
            {renderText?.({
              multiline: true,
              path: "headline",
              value: data.headline,
            }) ?? data.headline}
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-8"
            style={{ color: theme.colors.muted }}
          >
            {renderText?.({
              multiline: true,
              path: "subheadline",
              value: data.subheadline,
            }) ?? data.subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium shadow-sm"
              href="#cta"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              {renderText?.({ path: "cta", value: data.cta }) ?? data.cta}
            </a>
            {data.secondaryCta ? (
              <a
                className="inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-medium"
                href="#features"
                style={{ borderColor: theme.colors.border }}
              >
                {renderText?.({
                  path: "secondaryCta",
                  value: data.secondaryCta,
                }) ?? data.secondaryCta}
              </a>
            ) : null}
          </div>
        </div>
        <div
          className="relative min-h-80 overflow-hidden rounded-lg border p-4 shadow-2xl"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius,
          }}
        >
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={data.imageAlt ?? data.headline}
              className="absolute inset-0 size-full object-cover"
              src={data.imageUrl}
            />
          ) : (
            <>
              <div
                className="absolute inset-4 rounded-md"
                style={{ backgroundColor: theme.colors.background }}
              />
              <div className="relative grid h-full gap-3">
                <div
                  className="h-24 rounded-md"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="h-20 rounded-md border"
                  style={{ borderColor: theme.colors.border }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="h-28 rounded-md"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div
                    className="h-28 rounded-md border"
                    style={{ borderColor: theme.colors.border }}
                  />
                </div>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
