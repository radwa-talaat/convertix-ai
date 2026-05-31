"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
                aria-label="Project actions"
                disabled={disabled}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil />
                Edit name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant={statusVariant[project.status]}>
              {project.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Updated {project.updatedAt}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-md bg-secondary/40 p-3">
            <ProjectMetric label="Pages" value={String(project.pages)} />
            <ProjectMetric label="Visitors" value={project.visitors} />
            <ProjectMetric label="CVR" value={project.conversionRate} />
          </div>
        </CardContent>
      </Card>

      <Dialog onOpenChange={setIsEditing} open={isEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit project name</DialogTitle>
            <DialogDescription>
              Rename the project label used across your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`project-name-${project.id}`}>Project name</Label>
            <Input
              disabled={disabled}
              id={`project-name-${project.id}`}
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={disabled} onClick={submitRename}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setIsDeleting} open={isDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This permanently removes the project and its pages from your
              workspace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleting(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={disabled}
              onClick={() => {
                onDelete(project.id);
                setIsDeleting(false);
              }}
              variant="destructive"
            >
              Delete project
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
