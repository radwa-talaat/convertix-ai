import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell
      user={{
        avatarUrl:
          typeof user.user_metadata.avatar_url === "string"
            ? user.user_metadata.avatar_url
            : null,
        email: user.email ?? "account@example.com",
        name:
          typeof user.user_metadata.full_name === "string"
            ? user.user_metadata.full_name
            : null,
      }}
    >
      {children}
    </AppShell>
  );
}
