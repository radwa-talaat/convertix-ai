"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ExternalLink,
  Files,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalizedPathname } from "@/hooks/i18n";
import type { DashboardProject } from "@/types/project";

const statusVariant = {
  active: "success",
  archived: "muted",
  draft: "secondary",
} as const;

type ProjectCardProps = {
  disabled?: boolean;
  onDelete: (projectId: string) => void;
  onRename: (projectId: string, name: string) => void;
  project: DashboardProject;
};

export function ProjectCard({
  disabled,
  onDelete,
  onRename,
  project,
}: ProjectCardProps) {
  const commonT = useTranslations("common");
  const t = useTranslations("dashboard.projects");
  const localizedPath = useLocalizedPathname();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [name, setName] = React.useState(project.name);

  function submitRename() {
    onRename(project.id, name);
    setIsEditing(false);
  }

  return (
    <>
      <Card className="group transition-colors hover:border-foreground/20">
        <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{project.name}</CardTitle>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              /{project.slug}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={t("projectActions")}
                disabled={disabled}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={localizedPath(`/dashboard/projects/${project.id}`)}>
                  <ExternalLink />
                  {t("builder")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={localizedPath(`/dashboard/projects/${project.id}`)}>
                  <Sparkles />
                  {t("generateWithAi")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil />
                {t("editName")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link
            aria-label={`${t("builder")}: ${project.name}`}
            className="block rounded-md outline-none ring-ring transition hover:bg-secondary/30 focus-visible:ring-2"
            href={localizedPath(`/dashboard/projects/${project.id}`)}
          >
            <div className="flex items-center justify-between px-1 pt-1">
              <Badge variant={statusVariant[project.status]}>
                {project.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t("updated")} {project.updatedAt}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-md bg-secondary/40 p-3">
              <ProjectMetric label={t("pages")} value={String(project.pages)} />
              <ProjectMetric label={t("visitors")} value={project.visitors} />
              <ProjectMetric label={t("cvr")} value={project.conversionRate} />
            </div>
          </Link>
          <div className="flex gap-2">
            <Button asChild className="flex-1" size="sm">
              <Link href={localizedPath(`/dashboard/projects/${project.id}`)}>
                <Sparkles />
                {t("generate")}
              </Link>
            </Button>
            <Button asChild className="flex-1" size="sm" variant="outline">
              <Link
                href={localizedPath(
                  `/dashboard/projects/${project.id}#landing-pages`,
                )}
              >
                <Files />
                {t("pages")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog onOpenChange={setIsEditing} open={isEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editName")}</DialogTitle>
            <DialogDescription>{t("renameDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`project-name-${project.id}`}>
              {t("projectName")}
            </Label>
            <Input
              disabled={disabled}
              id={`project-name-${project.id}`}
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              {commonT("cancel")}
            </Button>
            <Button disabled={disabled} onClick={submitRename}>
              {t("saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setIsDeleting} open={isDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete")}</DialogTitle>
            <DialogDescription>{t("deleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleting(false)} variant="outline">
              {commonT("cancel")}
            </Button>
            <Button
              disabled={disabled}
              onClick={() => {
                onDelete(project.id);
                setIsDeleting(false);
              }}
              variant="destructive"
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProjectMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
