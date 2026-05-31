export type DashboardProjectStatus = "active" | "draft" | "archived";

export type DashboardProject = {
  id: string;
  name: string;
  slug: string;
  status: DashboardProjectStatus;
  pages: number;
  visitors: string;
  conversionRate: string;
  updatedAt: string;
};
