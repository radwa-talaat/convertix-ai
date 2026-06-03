"use client";

import { FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ProjectGridLoading } from "@/components/dashboard/loading-state";
import { ProjectsToolbar } from "@/components/dashboard/projects-toolbar";
import { Alert } from "@/components/ui/alert";
import { useProjects } from "@/hooks/use-projects";
import type { DashboardProject } from "@/types/project";

type ProjectsViewProps = {
  databaseError?: string;
  initialProjects: DashboardProject[];
};

export function ProjectsView({
  databaseError,
  initialProjects,
}: ProjectsViewProps) {
  const t = useTranslations("dashboard.projects");
  const {
    createProject,
    deleteProject,
    filteredProjects,
    isLoading,
    isMutating,
    query,
    setQuery,
    setStatus,
    status,
    updateProjectName,
  } = useProjects(initialProjects);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        actions={
          <CreateProjectDialog disabled={isMutating} onCreate={createProject} />
        }
        description={t("description")}
        eyebrow={t("management")}
        title={t("title")}
      />
      <ProjectsToolbar
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        query={query}
        status={status}
      />
      {databaseError ? (
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          Projects could not be loaded from Supabase yet: {databaseError}
        </Alert>
      ) : null}
      {isLoading ? (
        <ProjectGridLoading />
      ) : filteredProjects.length > 0 ? (
        <motion.div
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.045 } },
          }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ProjectCard
                disabled={isMutating}
                onDelete={deleteProject}
                onRename={updateProjectName}
                project={project}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          action={
            <CreateProjectDialog
              disabled={isMutating}
              onCreate={createProject}
            />
          }
          description={t("emptyDescription")}
          icon={FolderKanban}
          title={t("emptyTitle")}
        />
      )}
    </div>
  );
}
