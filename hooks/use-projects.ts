"use client";

import * as React from "react";

import { demoProjects, type ProjectStatusFilter } from "@/config/dashboard";
import { useToast } from "@/hooks/use-toast";
import type { DashboardProject } from "@/types/project";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function useProjects() {
  const { toast } = useToast();
  const [projects, setProjects] =
    React.useState<DashboardProject[]>(demoProjects);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<ProjectStatusFilter>("all");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery = project.name
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      const matchesStatus = status === "all" || project.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  const createProject = React.useCallback(
    (name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      const project: DashboardProject = {
        conversionRate: "0%",
        id: crypto.randomUUID(),
        name: trimmedName,
        pages: 0,
        slug: slugify(trimmedName),
        status: "draft",
        updatedAt: "Just now",
        visitors: "0",
      };

      setProjects((current) => [project, ...current]);
      toast({
        description: `${trimmedName} is ready for setup.`,
        title: "Project created",
      });
    },
    [toast],
  );

  const updateProjectName = React.useCallback(
    (projectId: string, name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      setProjects((current) =>
        current.map((project) =>
          project.id === projectId
            ? {
                ...project,
                name: trimmedName,
                slug: slugify(trimmedName),
                updatedAt: "Just now",
              }
            : project,
        ),
      );
      toast({ title: "Project updated" });
    },
    [toast],
  );

  const deleteProject = React.useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);
      setProjects((current) => current.filter((item) => item.id !== projectId));
      toast({
        description: project ? `${project.name} was removed.` : undefined,
        title: "Project deleted",
        variant: "destructive",
      });
    },
    [projects, toast],
  );

  return {
    createProject,
    deleteProject,
    filteredProjects,
    isLoading,
    projects,
    query,
    setQuery,
    setStatus,
    status,
    updateProjectName,
  };
}
