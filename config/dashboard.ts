import type { DashboardProject } from "@/types/project";

export const projectStatusOptions = [
  "all",
  "active",
  "draft",
  "archived",
] as const;

export type ProjectStatusFilter = (typeof projectStatusOptions)[number];

export const demoProjects: DashboardProject[] = [
  {
    id: "project-aurora",
    name: "Aurora Launch",
    slug: "aurora-launch",
    status: "active",
    pages: 8,
    visitors: "18.2k",
    conversionRate: "9.4%",
    updatedAt: "Today",
  },
  {
    id: "project-nova",
    name: "Nova Waitlist",
    slug: "nova-waitlist",
    status: "draft",
    pages: 3,
    visitors: "4.8k",
    conversionRate: "6.1%",
    updatedAt: "Yesterday",
  },
  {
    id: "project-lumen",
    name: "Lumen Enterprise",
    slug: "lumen-enterprise",
    status: "active",
    pages: 12,
    visitors: "31.7k",
    conversionRate: "11.8%",
    updatedAt: "May 24",
  },
  {
    id: "project-archive",
    name: "Founders Campaign",
    slug: "founders-campaign",
    status: "archived",
    pages: 5,
    visitors: "7.3k",
    conversionRate: "4.9%",
    updatedAt: "May 12",
  },
];
