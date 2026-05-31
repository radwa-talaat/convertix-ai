import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { LandingPageDirection, LandingPageTheme } from "@/types/rendering";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  direction: LandingPageDirection;
  id: string;
  theme: LandingPageTheme;
};

export function SectionShell({
  children,
  className,
  direction,
  id,
  theme,
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "duration-500 animate-in fade-in slide-in-from-bottom-3",
        className,
      )}
      dir={direction}
      id={id}
      style={{
        color: theme.colors.foreground,
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.16em] opacity-70">
      {children}
    </p>
  );
}
