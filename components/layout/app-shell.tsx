import type { ReactNode } from "react";

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { MobileDashboardNav } from "@/components/layout/mobile-dashboard-nav";
import { Sidebar } from "@/components/layout/sidebar";
import type { DashboardUser } from "@/components/layout/user-profile-dropdown";

type AppShellProps = {
  children: ReactNode;
  isAdmin?: boolean;
  user: DashboardUser;
};

export function AppShell({ children, isAdmin = false, user }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar isAdmin={isAdmin} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <DashboardTopbar user={user} />
          <MobileDashboardNav isAdmin={isAdmin} />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
