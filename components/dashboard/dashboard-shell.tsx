import {
  ArrowUpRight,
  FileText,
  MousePointerClick,
  PanelsTopLeft,
  RadioTower,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createLocalizedPathname } from "@/lib/i18n/config";
import { getRequestLocale, getServerTranslator } from "@/lib/i18n/server";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getProjectCreationEntitlement } from "@/services/subscriptions";

type RecentProject = {
  id: string;
  name: string;
  status: string;
  updated_at: string;
};

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: value > 0 && value < 1 ? 1 : 0,
    style: "percent",
  }).format(value / 100);
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export async function DashboardShell() {
  const locale = getRequestLocale();
  const t = await getServerTranslator("dashboard");
  const user = await requireUser();
  const supabase = createClient();
  const projectsHref = createLocalizedPathname("/dashboard/projects", locale);

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, status, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (projectsError) {
    console.error("Dashboard project summary failed", projectsError);
  }

  const workspaceProjects = (projects ?? []) as RecentProject[];
  const projectIds = workspaceProjects.map((project) => project.id);

  const { data: pages, error: pagesError } = projectIds.length
    ? await supabase
        .from("pages")
        .select("id, status, project_id")
        .eq("user_id", user.id)
        .in("project_id", projectIds)
    : { data: [], error: null };

  if (pagesError) {
    console.error("Dashboard page summary failed", pagesError);
  }

  const pageRows = pages ?? [];
  const publishedPageCount = pageRows.filter(
    (page) => page.status === "published",
  ).length;

  const {
    data: pageViews,
    count: totalViews,
    error: pageViewsError,
  } = projectIds.length
    ? await supabase
        .from("page_views")
        .select("visitor_id", { count: "exact" })
        .in("project_id", projectIds)
    : { count: 0, data: [], error: null };

  if (pageViewsError) {
    console.error("Dashboard page views summary failed", pageViewsError);
  }

  const { count: conversionCount, error: conversionsError } = projectIds.length
    ? await supabase
        .from("conversions")
        .select("id", { count: "exact", head: true })
        .in("project_id", projectIds)
    : { count: 0, error: null };

  if (conversionsError) {
    console.error("Dashboard conversion summary failed", conversionsError);
  }

  const { count: leadCount, error: leadsError } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (leadsError) {
    console.error("Dashboard lead summary failed", leadsError);
  }

  const entitlement = await getProjectCreationEntitlement(supabase, user.id);
  const viewCount = totalViews ?? 0;
  const conversions = conversionCount ?? 0;
  const conversionRate = viewCount > 0 ? (conversions / viewCount) * 100 : 0;
  const uniqueVisitors = new Set(
    (pageViews ?? []).map((view) => view.visitor_id),
  ).size;

  const metrics = [
    {
      detail: t("overviewPage.metrics.projectsDetail"),
      icon: PanelsTopLeft,
      label: t("overviewPage.metrics.projects"),
      value: formatNumber(workspaceProjects.length, locale),
    },
    {
      detail: t("overviewPage.metrics.pagesDetail").replace(
        "{published}",
        formatNumber(publishedPageCount, locale),
      ),
      icon: FileText,
      label: t("overviewPage.metrics.pages"),
      value: formatNumber(pageRows.length, locale),
    },
    {
      detail: t("overviewPage.metrics.viewsDetail").replace(
        "{visitors}",
        formatNumber(uniqueVisitors, locale),
      ),
      icon: UsersRound,
      label: t("overviewPage.metrics.views"),
      value: formatNumber(viewCount, locale),
    },
    {
      detail: t("overviewPage.metrics.conversionsDetail").replace(
        "{leads}",
        formatNumber(leadCount ?? 0, locale),
      ),
      icon: MousePointerClick,
      label: t("overviewPage.metrics.conversions"),
      value: formatPercent(conversionRate, locale),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        actions={
          <Button asChild>
            <Link href={projectsHref}>
              {t("overviewPage.manageProjects")}
              <ArrowUpRight />
            </Link>
          </Button>
        }
        description={t("overviewPage.description")}
        eyebrow={t("overviewPage.eyebrow")}
        title={t("overviewPage.title")}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("overviewPage.recentProjects")}</CardTitle>
            <CardDescription>
              {t("overviewPage.recentProjectsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workspaceProjects.length > 0 ? (
              <div className="grid gap-3">
                {workspaceProjects.slice(0, 4).map((project) => (
                  <Link
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 px-4 py-3 transition-colors hover:bg-secondary"
                    href={createLocalizedPathname(
                      `/dashboard/projects/${project.id}`,
                      locale,
                    )}
                    key={project.id}
                  >
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(project.updated_at, locale)}
                      </p>
                    </div>
                    <span className="rounded bg-background px-2 py-1 text-xs text-muted-foreground">
                      {t(`overviewPage.status.${project.status}`)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-border p-6 text-center">
                <p className="font-medium">{t("overviewPage.emptyTitle")}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("overviewPage.emptyDescription")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("overviewPage.accountCapacity")}</CardTitle>
            <CardDescription>
              {t("overviewPage.accountCapacityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {t("overviewPage.remainingCredits")}
              </span>
              <span className="font-semibold">
                {entitlement.isUnlimited
                  ? t("overviewPage.unlimited")
                  : formatNumber(entitlement.remainingCredits, locale)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {t("overviewPage.publishedPages")}
              </span>
              <span className="font-semibold">
                {formatNumber(publishedPageCount, locale)}
              </span>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link
                href={createLocalizedPathname("/dashboard/publishing", locale)}
              >
                {t("overviewPage.openPublishing")}
                <RadioTower />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
