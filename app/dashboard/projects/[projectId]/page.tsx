import { notFound } from "next/navigation";

import { AiGenerationForm } from "@/components/ai";
import { Alert } from "@/components/ui/alert";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type ProjectBuilderPageProps = {
  params: {
    projectId: string;
  };
};

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

  return (
    <div className="space-y-6">
      <Alert className="border-border bg-secondary/40 text-sm text-muted-foreground">
        This project is connected to Supabase. Add your OpenAI API key in
        environment variables to generate live AI content.
      </Alert>
      <AiGenerationForm
        initialInput={{
          businessName: project.name,
          goal: "Create a conversion-ready landing page",
        }}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  );
}
