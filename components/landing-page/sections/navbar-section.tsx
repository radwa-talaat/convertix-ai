import type {
  LandingPageSectionProps,
  NavbarSectionData,
} from "@/types/rendering";

export function NavbarSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<NavbarSectionData>) {
  const renderText = editor?.renderText;
  const textScale = (theme.typography.textScale ?? 100) / 100;

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      dir={direction}
      id={sectionId}
      style={{
        backgroundColor: `${theme.colors.background}dd`,
        borderColor: theme.colors.border,
        color: theme.colors.foreground,
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a
          className="min-w-0 flex-1 truncate text-sm font-semibold tracking-normal md:flex-none"
          href="#"
          style={{
            fontFamily: theme.typography.heading,
            fontSize: `calc(0.875rem * ${textScale})`,
          }}
        >
          {renderText?.({ path: "brandName", value: data.brandName }) ??
            data.brandName}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {data.links.map((link, index) => (
            <a
              className="text-sm opacity-70 transition-opacity hover:opacity-100"
              href={link.href}
              key={link.href}
              style={{ fontSize: `calc(0.875rem * ${textScale})` }}
            >
              {renderText?.({
                path: `links.${index}.label`,
                value: link.label,
              }) ?? link.label}
            </a>
          ))}
        </nav>
        <a
          className="inline-flex h-9 max-w-[44vw] shrink-0 items-center justify-center truncate rounded-md px-3 text-sm font-medium shadow-sm sm:px-4"
          href="#cta"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryForeground,
            fontSize: `calc(0.875rem * ${textScale})`,
          }}
        >
          {renderText?.({ path: "cta", value: data.cta }) ?? data.cta}
        </a>
      </div>
    </header>
  );
}
