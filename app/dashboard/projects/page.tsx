import { ProjectsView } from "@/components/dashboard/projects-view";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { DashboardProject } from "@/types/project";

type ProjectWithPageCount = {
  created_at: string;
  id: string;
  name: string;
  pages?: Array<{ count: number }>;
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
    pages: project.pages?.[0]?.count ?? 0,
    slug: project.slug,
    status: project.status,
    updatedAt: formatUpdatedAt(project.updated_at),
    visitors: "0",
  };
}

async function ensureUserProfile() {
  const user = await requireUser();
  const admin = createAdminClient();

  await admin.from("users").upsert({
    avatar_url:
      typeof user.user_metadata.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    email: user.email ?? "",
    full_name:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : null,
    id: user.id,
  });

  return user;
}

export default async function ProjectsPage() {
  const user = await ensureUserProfile();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, slug, status, created_at, updated_at, pages(count)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <ProjectsView initialProjects={(data ?? []).map(mapProject)} />;
}
