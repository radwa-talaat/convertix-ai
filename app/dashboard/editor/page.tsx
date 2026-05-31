import { EditorShell } from "@/components/editor";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getSampleLandingPageTemplate } from "@/services/rendering";
import type { Json } from "@/types/database";
import type { LandingPageTemplate } from "@/types/rendering";

type EditorPageProps = {
  searchParams?: {
    page?: string;
    project?: string;
  };
};

type LoadedEditorPage = {
  id: string;
  template: LandingPageTemplate;
};

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const loadedPage = await loadRequestedEditorPage(searchParams);
  const template = loadedPage?.template ?? getSampleLandingPageTemplate();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Edit generated landing pages with drag and drop sections, live text editing, style controls, responsive previews, and draft saving."
        eyebrow="Editor"
        title="Landing Page Editor"
      />
      {!loadedPage ? (
        <Alert className="border-border bg-secondary/40 text-sm text-muted-foreground">
          Showing the starter template. Open a project or generated draft to
          edit your saved landing page.
        </Alert>
      ) : null}
      <EditorShell pageId={loadedPage?.id} template={template} />
    </div>
  );
}

async function loadRequestedEditorPage(
  searchParams?: EditorPageProps["searchParams"],
): Promise<LoadedEditorPage | null> {
  const pageId = searchParams?.page;
  const projectId = searchParams?.project;

  if (!pageId && !projectId) {
    return null;
  }

  const user = await requireUser();
  const supabase = createClient();
  let query = supabase
    .from("pages")
    .select("id, content")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (pageId) {
    query = query.eq("id", pageId);
  } else if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  const template = parseLandingPageTemplate(data.content);

  if (!template) {
    return null;
  }

  return {
    id: data.id,
    template,
  };
}

function parseLandingPageTemplate(value: Json): LandingPageTemplate | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Partial<LandingPageTemplate>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.slug !== "string" ||
    !Array.isArray(candidate.sections)
  ) {
    return null;
  }

  return candidate as LandingPageTemplate;
}
