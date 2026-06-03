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
import type { LandingPageSectionType } from "@/types/rendering";

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

const addableSections: Array<{
  description: string;
  label: string;
  type: LandingPageSectionType;
}> = [
  {
    description: "Top navigation with links and CTA",
    label: "Navbar",
    type: "navbar",
  },
  {
    description: "Headline, CTA, and product image",
    label: "Hero",
    type: "hero",
  },
  {
    description: "Feature cards for product value",
    label: "Features",
    type: "features",
  },
  {
    description: "Outcome-focused benefit rows",
    label: "Benefits",
    type: "benefits",
  },
  {
    description: "Offer and purchase CTA",
    label: "Pricing",
    type: "pricing",
  },
  {
    description: "Customer quotes and trust",
    label: "Testimonials",
    type: "testimonials",
  },
  {
    description: "Questions and answers",
    label: "FAQ",
    type: "faq",
  },
  {
    description: "Final conversion section",
    label: "CTA",
    type: "cta",
  },
  {
    description: "Capture customer orders and contact details",
    label: "Lead Form",
    type: "lead-form",
  },
  {
    description: "Brand footer and links",
    label: "Footer",
    type: "footer",
  },
];

export function EditorLeftSidebar() {
  const addSection = useEditorStore((state) => state.addSection);
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
    <aside className="hidden h-full min-h-0 w-72 shrink-0 flex-col border-r border-border bg-secondary/20 xl:flex">
      <div className="grid shrink-0 grid-cols-4 border-b border-border p-2">
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

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-gutter:stable]">
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
        ) : leftPanelTab === "components" ? (
          <div className="space-y-2">
            {addableSections.map((section) => (
              <button
                className="w-full rounded-md border border-border bg-background p-3 text-left transition-colors hover:border-foreground/40 hover:bg-secondary/50"
                key={section.type}
                onClick={() => addSection(section.type)}
                type="button"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Plus className="size-3.5" />
                  {section.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {section.description}
                </span>
              </button>
            ))}
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
