import { notFound } from "next/navigation";
import Link from "next/link";
import { Edit3, Eye, FileText, Sparkles } from "lucide-react";

import { AiGenerationForm } from "@/components/ai";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

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

const statusVariant = {
  archived: "muted",
  draft: "secondary",
  published: "success",
} as const;

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ProjectBuilderPage({
  params,
}: ProjectBuilderPageProps) {
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

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("id, title, slug, status, updated_at")
    .eq("project_id", project.id)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (pagesError) {
    console.error("Project pages load failed", pagesError);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        actions={
          <Button asChild>
            <a href="#ai-builder">
              <Sparkles />
              Generate new
            </a>
          </Button>
        }
        description="Choose an existing landing page to edit or generate a new draft for this project."
        eyebrow="Project Workspace"
        title={project.name}
      />

      <section className="space-y-4" id="landing-pages">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-normal">
              Landing pages
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {pages?.length ?? 0} saved page
              {(pages?.length ?? 0) === 1 ? "" : "s"} in this project.
            </p>
          </div>
        </div>

        {pages && pages.length > 0 ? (
          <div className="grid gap-3">
            {pages.map((page) => (
              <LandingPageRow key={page.id} page={page} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="mt-4 font-medium">No landing pages yet</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Generate your first landing page below, then save it as a draft
                to make it appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <Alert className="border-border bg-secondary/40 text-sm text-muted-foreground">
        This project is connected to Supabase. Add your OpenAI API key in
        environment variables to generate live AI content.
      </Alert>
      <section id="ai-builder">
        <AiGenerationForm
          initialInput={{
            businessName: project.name,
            goal: "Create a conversion-ready landing page",
          }}
          projectId={project.id}
          projectName={project.name}
        />
      </section>
    </div>
  );
}

function LandingPageRow({ page }: { page: ProjectLandingPage }) {
  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="truncate text-base">{page.title}</CardTitle>
            <Badge variant={statusVariant[page.status]}>{page.status}</Badge>
          </div>
          <p className="mt-2 truncate text-sm text-muted-foreground">
            /{page.slug} · Updated {formatUpdatedAt(page.updated_at)}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="sm">
            <Link href={`/dashboard/editor?page=${page.id}`}>
              <Edit3 />
              Edit
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/preview?page=${page.id}`}>
              <Eye />
              Preview
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
