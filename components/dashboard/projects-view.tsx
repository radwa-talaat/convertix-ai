"use client";

import Link from "next/link";
import { CreditCard, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ProjectGridLoading } from "@/components/dashboard/loading-state";
import { ProjectsToolbar } from "@/components/dashboard/projects-toolbar";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLocalizedPathname } from "@/hooks/i18n/use-localized-pathname";
import { useProjects } from "@/hooks/use-projects";
import type { AppLocale } from "@/lib/i18n/config";
import type { ProjectCreationEntitlement } from "@/services/subscriptions";
import type { DashboardProject } from "@/types/project";

type ProjectsViewProps = {
  databaseError?: string;
  entitlement: ProjectCreationEntitlement;
  initialProjects: DashboardProject[];
};

export function ProjectsView({
  databaseError,
  entitlement,
  initialProjects,
}: ProjectsViewProps) {
  const locale = useLocale() as AppLocale;
  const localizedPath = useLocalizedPathname();
  const t = useTranslations("dashboard.projects");
  const purchaseMessage =
    locale === "ar"
      ? "يجب شراء رصيد صفحة هبوط قبل إنشاء مشروع جديد."
      : "Buy a landing-page credit before creating a new project.";
  const balanceMessage = entitlement.isUnlimited
    ? locale === "ar"
      ? "خطتك تسمح بإنشاء مشاريع غير محدودة."
      : "Your plan includes unlimited projects."
    : locale === "ar"
      ? `رصيد صفحات الهبوط المتاح: ${entitlement.remainingCredits}`
      : `Available landing-page credits: ${entitlement.remainingCredits}`;
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
          <CreateProjectDialog
            disabled={isMutating || !entitlement.canCreate}
            onCreate={createProject}
          />
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
      <Alert
        className={
          entitlement.canCreate
            ? "flex flex-wrap items-center justify-between gap-3"
            : "flex flex-wrap items-center justify-between gap-3 border-destructive/30 bg-destructive/10 text-destructive"
        }
      >
        <span>{entitlement.canCreate ? balanceMessage : purchaseMessage}</span>
        {!entitlement.canCreate ? (
          <Button asChild size="sm">
            <Link href={localizedPath("/pricing")}>
              <CreditCard />
              {locale === "ar" ? "شراء صفحة هبوط" : "Buy landing page"}
            </Link>
          </Button>
        ) : null}
      </Alert>
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
              disabled={isMutating || !entitlement.canCreate}
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
