"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  createProjectAction,
  deleteProjectAction,
  updateProjectNameAction,
} from "@/app/dashboard/projects/actions";
import type { ProjectStatusFilter } from "@/config/dashboard";
import { useToast } from "@/hooks/use-toast";
import type { DashboardProject } from "@/types/project";

export function useProjects(initialProjects: DashboardProject[]) {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = React.useState(initialProjects);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<ProjectStatusFilter>("all");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMutating, startMutation] = React.useTransition();

  React.useEffect(() => {
    setProjects(initialProjects);
    setIsLoading(false);
  }, [initialProjects]);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery = project.name
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      const matchesStatus = status === "all" || project.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  const refreshProjects = React.useCallback(() => {
    setIsLoading(true);
    router.refresh();
  }, [router]);

  const createProject = React.useCallback(
    (name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      startMutation(async () => {
        try {
          await createProjectAction(trimmedName);
          toast({
            description: `${trimmedName} is ready for setup.`,
            title: "Project created",
          });
          refreshProjects();
        } catch (error) {
          toast({
            description:
              error instanceof Error
                ? error.message
                : "Could not create project.",
            title: "Project creation failed",
            variant: "destructive",
          });
        }
      });
    },
    [refreshProjects, toast],
  );

  const updateProjectName = React.useCallback(
    (projectId: string, name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      startMutation(async () => {
        try {
          await updateProjectNameAction(projectId, trimmedName);
          toast({ title: "Project updated" });
          refreshProjects();
        } catch (error) {
          toast({
            description:
              error instanceof Error
                ? error.message
                : "Could not update project.",
            title: "Project update failed",
            variant: "destructive",
          });
        }
      });
    },
    [refreshProjects, toast],
  );

  const deleteProject = React.useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);

      startMutation(async () => {
        try {
          await deleteProjectAction(projectId);
          toast({
            description: project ? `${project.name} was removed.` : undefined,
            title: "Project deleted",
            variant: "destructive",
          });
          refreshProjects();
        } catch (error) {
          toast({
            description:
              error instanceof Error
                ? error.message
                : "Could not delete project.",
            title: "Project deletion failed",
            variant: "destructive",
          });
        }
      });
    },
    [projects, refreshProjects, toast],
  );

  return {
    createProject,
    deleteProject,
    filteredProjects,
    isLoading,
    isMutating,
    projects,
    query,
    setQuery,
    setStatus,
    status,
    updateProjectName,
  };
}
