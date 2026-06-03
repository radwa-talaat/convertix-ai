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
  const textScale = (theme.typography.textScale ?? 100) / 100;
  const variant = data.layoutVariant ?? "split";
  const isCentered = variant === "centered" || variant === "stacked";
  const isEditorial = variant === "editorial";
  const isShowcase = variant === "product-showcase";

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
      <div
        className={[
          "mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:gap-10 lg:px-8",
          isCentered
            ? "text-center lg:grid-cols-1"
            : isEditorial
              ? "lg:grid-cols-[0.72fr_1fr]"
              : isShowcase
                ? "lg:grid-cols-[0.9fr_0.9fr]"
                : "lg:grid-cols-[1fr_0.8fr]",
        ].join(" ")}
      >
        <div
          className={[
            "duration-700 animate-in fade-in slide-in-from-bottom-4",
            isCentered ? "mx-auto max-w-4xl" : "",
            isEditorial ? "lg:order-2" : "",
          ].join(" ")}
        >
          {data.badge ? (
            <span
              className="mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            >
              {renderText?.({ path: "badge", value: data.badge }) ?? data.badge}
            </span>
          ) : null}
          <h1 className="text-balance break-words text-[clamp(2.35rem,10vw,4.5rem)] font-semibold leading-[1.05] tracking-normal">
            <span
              style={{
                fontFamily: theme.typography.heading,
                fontSize: `calc(clamp(2.35rem, 10vw, 4.5rem) * ${textScale})`,
              }}
            >
              {renderText?.({
                multiline: true,
                path: "headline",
                value: data.headline,
              }) ?? data.headline}
            </span>
          </h1>
          <p
            className="mt-5 max-w-2xl text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8"
            style={{
              color: theme.colors.muted,
              fontSize: `calc(1rem * ${textScale})`,
            }}
          >
            {renderText?.({
              multiline: true,
              path: "subheadline",
              value: data.subheadline,
            }) ?? data.subheadline}
          </p>
          <div
            className={[
              "mt-8 flex flex-col gap-3 sm:flex-row",
              isCentered ? "justify-center" : "",
            ].join(" ")}
          >
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
          className={[
            "relative min-h-64 overflow-hidden rounded-lg border p-4 shadow-2xl sm:min-h-80",
            isCentered ? "mx-auto w-full max-w-3xl" : "",
            isEditorial ? "lg:order-1" : "",
            isShowcase ? "min-h-[28rem]" : "",
          ].join(" ")}
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
                style={{
                  backgroundColor: theme.colors.background,
                  backgroundImage: `radial-gradient(circle at 20% 20%, ${theme.colors.accent}55, transparent 28%), linear-gradient(135deg, transparent, ${theme.colors.primary}18)`,
                }}
              />
              <div
                className={[
                  "relative grid h-full gap-3",
                  isShowcase ? "grid-rows-[1.1fr_0.7fr_1fr]" : "",
                ].join(" ")}
              >
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
