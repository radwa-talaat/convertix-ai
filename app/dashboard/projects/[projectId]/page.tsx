import { notFound } from "next/navigation";
import Link from "next/link";
import { Edit3, Eye, FileText, Inbox, Phone, Sparkles } from "lucide-react";

import { AiGenerationForm } from "@/components/ai";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createLocalizedPathname, type AppLocale } from "@/lib/i18n/config";
import { getRequestLocale, getServerTranslator } from "@/lib/i18n/server";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { hasPaidProjectAccess } from "@/services/subscriptions";

type ProjectBuilderPageProps = {
  params: {
    projectId: string;
  };
};

type ProjectLandingPage = {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  title: string;
  updated_at: string;
};

type PageLead = {
  id: string;
  customer_email: string | null;
  customer_name: string;
  customer_phone: string | null;
  message: string | null;
  product_name: string | null;
  status: "new" | "contacted" | "converted" | "archived";
  created_at: string;
};

const statusVariant = {
  archived: "muted",
  draft: "secondary",
  published: "success",
} as const;

function formatUpdatedAt(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ProjectBuilderPage({
  params,
}: ProjectBuilderPageProps) {
  const locale = getRequestLocale();
  const commonT = await getServerTranslator("common");
  const user = await requireUser();
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name, slug")
    .eq("id", params.projectId)
    .eq("user_id", user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const canGenerate = await hasPaidProjectAccess(supabase, user.id, project.id);

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("id, title, slug, status, updated_at")
    .eq("project_id", project.id)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (pagesError) {
    console.error("Project pages load failed", pagesError);
  }

  const pageIds = (pages ?? []).map((page) => page.id);
  const { data: leads, error: leadsError } = pageIds.length
    ? await supabase
        .from("leads")
        .select(
          "id, page_id, customer_name, customer_email, customer_phone, product_name, message, status, created_at",
        )
        .eq("user_id", user.id)
        .in("page_id", pageIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (leadsError) {
    console.error("Project leads load failed", leadsError);
  }

  const leadsByPage = new Map<string, PageLead[]>();

  for (const lead of leads ?? []) {
    const current = leadsByPage.get(lead.page_id) ?? [];
    current.push(lead);
    leadsByPage.set(lead.page_id, current);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-8 overflow-hidden">
      <PageHeader
        actions={
          <Button asChild>
            {canGenerate ? (
              <a href="#ai-builder">
                <Sparkles />
                {commonT("generate")}
              </a>
            ) : (
              <Link href={createLocalizedPathname("/pricing", locale)}>
                <Sparkles />
                {locale === "ar" ? "شراء صفحة هبوط" : "Buy landing page"}
              </Link>
            )}
          </Button>
        }
        description={
          locale === "ar"
            ? "اختر صفحة هبوط موجودة لتعديلها أو أنشئ مسودة جديدة لهذا المشروع."
            : "Choose an existing landing page to edit or generate a new draft for this project."
        }
        eyebrow={locale === "ar" ? "مساحة المشروع" : "Project Workspace"}
        title={project.name}
      />

      <section className="min-w-0 space-y-4" id="landing-pages">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-normal">
              {locale === "ar" ? "صفحات الهبوط" : "Landing pages"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === "ar"
                ? `${pages?.length ?? 0} صفحة محفوظة في هذا المشروع.`
                : `${pages?.length ?? 0} saved page${
                    (pages?.length ?? 0) === 1 ? "" : "s"
                  } in this project.`}
            </p>
          </div>
        </div>

        {pages && pages.length > 0 ? (
          <div className="grid min-w-0 gap-3">
            {pages.map((page) => (
              <LandingPageRow
                key={page.id}
                leads={leadsByPage.get(page.id) ?? []}
                locale={locale}
                page={page}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="mt-4 font-medium">
                {locale === "ar"
                  ? "لا توجد صفحات هبوط بعد"
                  : "No landing pages yet"}
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {locale === "ar"
                  ? "أنشئ أول صفحة هبوط بالأسفل ثم احفظها كمسودة لتظهر هنا."
                  : "Generate your first landing page below, then save it as a draft to make it appear here."}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section id="ai-builder">
        {canGenerate ? (
          <AiGenerationForm
            initialInput={{
              businessName: project.name,
              goal:
                locale === "ar"
                  ? "إنشاء صفحة هبوط جاهزة للتحويل"
                  : "Create a conversion-ready landing page",
            }}
            projectId={project.id}
            projectName={project.name}
          />
        ) : (
          <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
            {locale === "ar"
              ? "يجب شراء صفحة هبوط قبل إنشاء المحتوى أو الصور داخل هذا المشروع."
              : "Buy a landing page before generating content or images in this project."}
          </Alert>
        )}
      </section>
    </div>
  );
}

function LandingPageRow({
  leads,
  locale,
  page,
}: {
  leads: PageLead[];
  locale: AppLocale;
  page: ProjectLandingPage;
}) {
  const isArabic = locale === "ar";
  const latestLeads = leads.slice(0, 3);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="min-w-0 gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <CardTitle className="min-w-0 max-w-full whitespace-normal break-words text-base">
              {page.title}
            </CardTitle>
            <Badge variant={statusVariant[page.status]}>{page.status}</Badge>
          </div>
          <p className="mt-2 break-words text-sm text-muted-foreground">
            /{page.slug} - {isArabic ? "آخر تحديث" : "Updated"}{" "}
            {formatUpdatedAt(page.updated_at, locale)}
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
          <Button asChild className="w-full" size="sm">
            <Link
              href={createLocalizedPathname(
                `/dashboard/editor?page=${page.id}`,
                locale,
              )}
            >
              <Edit3 />
              {isArabic ? "تعديل" : "Edit"}
            </Link>
          </Button>
          <Button asChild className="w-full" size="sm" variant="outline">
            <Link
              href={createLocalizedPathname(
                `/dashboard/preview?page=${page.id}`,
                locale,
              )}
            >
              <Eye />
              {isArabic ? "معاينة" : "Preview"}
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 border-t border-border p-4 pt-4 sm:p-6">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Inbox className="size-4 text-muted-foreground" />
            {isArabic ? "طلبات العملاء لهذه الصفحة" : "Leads for this page"}
          </div>
          <Badge variant={leads.length ? "success" : "secondary"}>
            {leads.length} {isArabic ? "طلب" : "lead"}
          </Badge>
        </div>

        {latestLeads.length ? (
          <div className="mt-4 grid min-w-0 gap-2">
            {latestLeads.map((lead) => (
              <div
                className="min-w-0 rounded-md border border-border bg-secondary/30 p-3"
                key={lead.id}
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium">
                      {lead.customer_name}
                    </p>
                    <p className="mt-1 flex min-w-0 flex-wrap items-center gap-2 break-all text-xs text-muted-foreground">
                      {lead.customer_phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3" />
                          {lead.customer_phone}
                        </span>
                      ) : null}
                      {lead.customer_email ? (
                        <span>{lead.customer_email}</span>
                      ) : null}
                    </p>
                  </div>
                  <Badge variant="secondary">{lead.status}</Badge>
                </div>
                {lead.message ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {lead.message}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {isArabic
              ? "لسه مفيش بيانات عملاء داخلة من الصفحة دي."
              : "No customer details have been captured from this page yet."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
