import type { ReactNode } from "react";

import { BrandMark } from "@/components/layout/brand-mark";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AuthShell({ children, description, title }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandMark />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-luxury-md">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
