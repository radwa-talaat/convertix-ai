import type {
  FooterSectionData,
  LandingPageSectionProps,
} from "@/types/rendering";

export function FooterSection({
  data,
  direction,
  editor,
  sectionId,
  theme,
}: LandingPageSectionProps<FooterSectionData>) {
  const renderText = editor?.renderText;

  return (
    <footer
      className="border-t"
      dir={direction}
      id={sectionId}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.foreground,
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold">
            {renderText?.({ path: "brandName", value: data.brandName }) ??
              data.brandName}
          </p>
          <p
            className="mt-2 max-w-md text-sm leading-6"
            style={{ color: theme.colors.muted }}
          >
            {renderText?.({
              multiline: true,
              path: "description",
              value: data.description,
            }) ?? data.description}
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {data.links.map((link, index) => (
            <a
              className="text-sm opacity-70 hover:opacity-100"
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
      </div>
    </footer>
  );
}
