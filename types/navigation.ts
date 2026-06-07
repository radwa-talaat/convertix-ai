import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  adminOnly?: boolean;
  title: string;
  href: string;
  icon?: LucideIcon;
  isActive?: boolean;
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};
