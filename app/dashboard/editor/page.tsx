import { EditorShell } from "@/components/editor";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { getRequestLocale, getServerTranslator } from "@/lib/i18n/server";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import {
  getSampleLandingPageTemplate,
  parseLandingPageTemplate,
} from "@/services/rendering";
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
  const locale = getRequestLocale();
  const t = await getServerTranslator("editor");
  const loadedPage = await loadRequestedEditorPage(searchParams);
  const template = loadedPage?.template ?? getSampleLandingPageTemplate();

  return (
    <div className="space-y-6">
      <PageHeader
        description={t("description")}
        eyebrow={t("title")}
        title={t("title")}
      />
      {!loadedPage ? (
        <Alert className="border-border bg-secondary/40 text-sm text-muted-foreground">
          {locale === "ar"
            ? "نعرض القالب الافتراضي. افتح مشروعًا أو مسودة مولدة لتعديل صفحة محفوظة."
            : "Showing the starter template. Open a project or generated draft to edit your saved landing page."}
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
