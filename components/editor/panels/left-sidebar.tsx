"use client";

import type * as React from "react";

import {
  Blocks,
  Copy,
  Eye,
  EyeOff,
  Layers3,
  LayoutTemplate,
  Plus,
  Rows3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor";
import type { EditorLeftPanelTab } from "@/types/editor";

const tabs: Array<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: EditorLeftPanelTab;
}> = [
  { icon: Rows3, label: "Sections", value: "sections" },
  { icon: Blocks, label: "Components", value: "components" },
  { icon: LayoutTemplate, label: "Templates", value: "templates" },
  { icon: Layers3, label: "Layers", value: "layers" },
];

export function EditorLeftSidebar() {
  const duplicateSection = useEditorStore((state) => state.duplicateSection);
  const leftPanelTab = useEditorStore((state) => state.leftPanelTab);
  const selectSection = useEditorStore((state) => state.selectSection);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const setLeftPanelTab = useEditorStore((state) => state.setLeftPanelTab);
  const template = useEditorStore((state) => state.template);
  const toggleSectionVisibility = useEditorStore(
    (state) => state.toggleSectionVisibility,
  );

  const sections = template?.sections ?? [];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-secondary/20 xl:block">
      <div className="grid grid-cols-4 border-b border-border p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              className={cn(
                "flex h-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                leftPanelTab === tab.value &&
                  "bg-background text-foreground shadow-luxury-sm",
              )}
              key={tab.value}
              onClick={() => setLeftPanelTab(tab.value)}
              title={tab.label}
              type="button"
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {tabs.find((tab) => tab.value === leftPanelTab)?.label}
          </p>
          <h2 className="mt-2 text-sm font-semibold">Page structure</h2>
        </div>

        {leftPanelTab === "sections" || leftPanelTab === "layers" ? (
          <div className="space-y-2">
            {sections.map((section) => {
              const isSelected = selectedSectionId === section.id;

              return (
                <div
                  className={cn(
                    "group rounded-md border border-border bg-background p-2 transition-colors",
                    isSelected && "border-foreground",
                  )}
                  key={section.id}
                >
                  <button
                    className="flex w-full items-center justify-between gap-3 text-start"
                    onClick={() => selectSection(section.id)}
                    type="button"
                  >
                    <span>
                      <span className="block text-sm font-medium capitalize">
                        {section.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        #{section.order + 1}
                      </span>
                    </span>
                    {section.visible ? (
                      <Eye className="size-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="size-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      onClick={() => duplicateSection(section.id)}
                      size="icon"
                      title="Duplicate section"
                      type="button"
                      variant="ghost"
                    >
                      <Copy className="size-3.5" />
                    </Button>
                    <Button
                      onClick={() => toggleSectionVisibility(section.id)}
                      size="icon"
                      title="Toggle visibility"
                      type="button"
                      variant="ghost"
                    >
                      {section.visible ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-background p-4">
            <Plus className="size-4 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">
              Library prepared for the next component phase.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              This editor can already reorder, edit, style, duplicate, and hide
              generated sections without starting publishing logic.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
