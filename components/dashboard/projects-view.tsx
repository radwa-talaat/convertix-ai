"use client";

import { FolderKanban } from "lucide-react";
import { motion } from "framer-motion";

import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ProjectGridLoading } from "@/components/dashboard/loading-state";
import { ProjectsToolbar } from "@/components/dashboard/projects-toolbar";
import { useProjects } from "@/hooks/use-projects";
import type { DashboardProject } from "@/types/project";

type ProjectsViewProps = {
  initialProjects: DashboardProject[];
};

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
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
        description="Manage your landing page workspaces, organize campaigns, and keep launch surfaces tidy."
        eyebrow="Project Management"
        title="Projects"
      />
      <ProjectsToolbar
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        query={query}
        status={status}
      />
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
          description="Adjust your search or create a new project to start fresh."
          icon={FolderKanban}
          title="No projects found"
        />
      )}
    </div>
  );
}
