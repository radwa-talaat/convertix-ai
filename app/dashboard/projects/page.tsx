import { ProjectsView } from "@/components/dashboard/projects-view";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { DashboardProject } from "@/types/project";

type ProjectWithPageCount = {
  created_at: string;
  id: string;
  name: string;
  slug: string;
  status: DashboardProject["status"];
  updated_at: string;
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function mapProject(project: ProjectWithPageCount): DashboardProject {
  return {
    conversionRate: "0%",
    id: project.id,
    name: project.name,
    pages: 0,
    slug: project.slug,
    status: project.status,
    updatedAt: formatUpdatedAt(project.updated_at),
    visitors: "0",
  };
}

export default async function ProjectsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, slug, status, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <ProjectsView initialProjects={(data ?? []).map(mapProject)} />;
}
