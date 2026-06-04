import Link from "next/link";
import { Edit3 } from "lucide-react";

import { LivePreview } from "@/components/dashboard/live-preview";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createLocalizedPathname } from "@/lib/i18n/config";
import { getRequestLocale, getServerTranslator } from "@/lib/i18n/server";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import {
  getSampleLandingPageTemplate,
  parseLandingPageTemplate,
} from "@/services/rendering";

type DashboardPreviewPageProps = {
  searchParams?: {
    page?: string;
    project?: string;
  };
};

export default async function DashboardPreviewPage({
  searchParams,
}: DashboardPreviewPageProps) {
  const locale = getRequestLocale();
  const t = await getServerTranslator("dashboard");
  const loadedPage = await loadRequestedPreviewPage(searchParams);
  const template = loadedPage?.template ?? getSampleLandingPageTemplate();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <PageHeader
        actions={
          loadedPage ? (
            <Button asChild>
              <Link
                href={createLocalizedPathname(
                  `/dashboard/editor?page=${loadedPage.id}`,
                  locale,
                )}
              >
                <Edit3 />
                {t("previewPage.editPage")}
              </Link>
            </Button>
          ) : undefined
        }
        description={t("previewPage.description")}
        eyebrow={t("previewPage.eyebrow")}
        title={loadedPage?.title ?? t("previewPage.title")}
      />
      {!loadedPage ? (
        <Alert className="border-border bg-secondary/40 text-sm text-muted-foreground">
          {t("previewPage.starterPreviewNotice")}
        </Alert>
      ) : null}
      <LivePreview template={template} />
    </div>
  );
}

async function loadRequestedPreviewPage(
  searchParams?: DashboardPreviewPageProps["searchParams"],
) {
  const pageId = searchParams?.page;
  const projectId = searchParams?.project;

  if (!pageId && !projectId) {
    return null;
  }

  const user = await requireUser();
  const supabase = createClient();
  let query = supabase
    .from("pages")
    .select("id, title, content")
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
    title: data.title,
  };
}
