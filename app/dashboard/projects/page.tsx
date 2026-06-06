import { ProjectsView } from "@/components/dashboard/projects-view";
import type { AppLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getProjectCreationEntitlement } from "@/services/subscriptions";
import type { DashboardProject } from "@/types/project";

type ProjectWithPageCount = {
  created_at: string;
  id: string;
  name: string;
  pages?: number;
  slug: string;
  status: DashboardProject["status"];
  updated_at: string;
};

function formatUpdatedAt(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function mapProject(
  project: ProjectWithPageCount,
  locale: AppLocale,
): DashboardProject {
  return {
    conversionRate: "0%",
    id: project.id,
    name: project.name,
    pages: project.pages ?? 0,
    slug: project.slug,
    status: project.status,
    updatedAt: formatUpdatedAt(project.updated_at, locale),
    visitors: "0",
  };
}

export default async function ProjectsPage() {
  const locale = getRequestLocale();
  const user = await requireUser();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, slug, status, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Projects load failed", error);
    return (
      <ProjectsView
        databaseError={error.message}
        entitlement={{
          canCreate: false,
          isUnlimited: false,
          remainingCredits: 0,
        }}
        initialProjects={[]}
      />
    );
  }

  const projects = data ?? [];
  const projectIds = projects.map((project) => project.id);
  const { data: pages, error: pagesError } = projectIds.length
    ? await supabase
        .from("pages")
        .select("project_id")
        .eq("user_id", user.id)
        .in("project_id", projectIds)
    : { data: [], error: null };

  if (pagesError) {
    console.error("Project page counts failed", pagesError);
  }

  const pageCounts = new Map<string, number>();

  for (const page of pages ?? []) {
    pageCounts.set(page.project_id, (pageCounts.get(page.project_id) ?? 0) + 1);
  }

  return (
    <ProjectsView
      entitlement={await getProjectCreationEntitlement(supabase, user.id)}
      initialProjects={projects.map((project) =>
        mapProject(
          {
            ...project,
            pages: pageCounts.get(project.id) ?? 0,
          },
          locale,
        ),
      )}
    />
  );
}
