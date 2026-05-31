import Link from "next/link";
import { Bell, Home } from "lucide-react";

import {
  type DashboardUser,
  UserProfileDropdown,
} from "@/components/layout/user-profile-dropdown";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardTopbar({ user }: { user: DashboardUser }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/">
              <Home />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label="Notifications" size="icon" variant="ghost">
            <Bell />
          </Button>
          <ThemeToggle />
          <UserProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
