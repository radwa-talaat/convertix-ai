import {
  CreditCard,
  Eye,
  LineChart,
  LayoutDashboard,
  PanelsTopLeft,
  PenTool,
  RadioTower,
  ShieldCheck,
} from "lucide-react";

import { getDeploymentAppUrl } from "@/lib/urls";
import type { NavigationItem, NavigationSection } from "@/types/navigation";

export const siteConfig = {
  name: "Convertix",
  description:
    "AI landing pages that convert, built for generating, editing, and publishing high-converting campaigns.",
  url: getDeploymentAppUrl(),
  links: {
    dashboard: "/dashboard",
    github: "https://github.com",
  },
} as const;

export const marketingNavItems: NavigationItem[] = [
  { title: "Product", href: "#product" },
  { title: "Workflow", href: "#workflow" },
  { title: "Pricing", href: "/pricing" },
];

export const dashboardNavSections: NavigationSection[] = [
  {
    title: "Workspace",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Projects",
        href: "/dashboard/projects",
        icon: PanelsTopLeft,
      },
      {
        title: "Preview",
        href: "/dashboard/preview",
        icon: Eye,
      },
      {
        title: "Editor",
        href: "/dashboard/editor",
        icon: PenTool,
      },
      {
        title: "Publishing",
        href: "/dashboard/publishing",
        icon: RadioTower,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: LineChart,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Admin",
        href: "/dashboard/admin",
        icon: ShieldCheck,
        adminOnly: true,
      },
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
      },
    ],
  },
];
