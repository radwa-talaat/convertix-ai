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
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a className="text-sm font-semibold tracking-normal" href="#">
          {renderText?.({ path: "brandName", value: data.brandName }) ??
            data.brandName}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {data.links.map((link, index) => (
            <a
              className="text-sm opacity-70 transition-opacity hover:opacity-100"
              href={link.href}
              key={link.href}
            >
              {renderText?.({
                path: `links.${index}.label`,
                value: link.label,
              }) ?? link.label}
            </a>
          ))}
        </nav>
        <a
          className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow-sm"
          href="#cta"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryForeground,
          }}
        >
          {renderText?.({ path: "cta", value: data.cta }) ?? data.cta}
        </a>
      </div>
    </header>
  );
}
