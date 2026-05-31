"use client";

import { Search } from "lucide-react";

import {
  projectStatusOptions,
  type ProjectStatusFilter,
} from "@/config/dashboard";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

type ProjectsToolbarProps = {
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ProjectStatusFilter) => void;
  query: string;
  status: ProjectStatusFilter;
};

export function ProjectsToolbar({
  onQueryChange,
  onStatusChange,
  query,
  status,
}: ProjectsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-luxury-sm md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search projects"
          value={query}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {projectStatusOptions.map((option) => (
          <button
            className={cn(
              "h-9 shrink-0 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              status === option && "bg-primary text-primary-foreground",
            )}
            key={option}
            onClick={() => onStatusChange(option)}
            type="button"
          >
            {option[0].toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
