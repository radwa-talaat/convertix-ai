"use client";

import { AlignCenter, AlignLeft, AlignRight, Eye, EyeOff } from "lucide-react";

import { SegmentedControl } from "@/components/editor/controls/segmented-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  createDefaultSectionStyle,
  editorColorPalettes,
  editorSpacingScale,
  editorTypographyScales,
  getEditableTextFields,
} from "@/services/editor";
import { useEditorStore } from "@/store/editor";
import type {
  EditorDeviceMode,
  EditorPropertiesTab,
  EditorSectionStyle,
} from "@/types/editor";

const propertyTabs: EditorPropertiesTab[] = [
  "typography",
  "colors",
  "spacing",
  "alignment",
  "visibility",
  "backgrounds",
];

const hiddenDeviceOptions: Array<{ label: string; value: EditorDeviceMode }> = [
  { label: "Desktop", value: "desktop" },
  { label: "Tablet", value: "tablet" },
  { label: "Mobile", value: "mobile" },
];

export function EditorPropertiesPanel() {
  const propertiesTab = useEditorStore((state) => state.propertiesTab);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const setPropertiesTab = useEditorStore((state) => state.setPropertiesTab);
  const template = useEditorStore((state) => state.template);
  const themeTokens = useEditorStore((state) => state.themeTokens);
  const toggleSectionVisibility = useEditorStore(
    (state) => state.toggleSectionVisibility,
  );
  const updateSectionStyle = useEditorStore(
    (state) => state.updateSectionStyle,
  );
  const updateSectionText = useEditorStore((state) => state.updateSectionText);
  const updateThemeTokens = useEditorStore((state) => state.updateThemeTokens);

  const section = template?.sections.find(
    (item) => item.id === selectedSectionId,
  );
  const selectedStyle = selectedSectionId
    ? (sectionStyles[selectedSectionId] ?? createDefaultSectionStyle())
    : createDefaultSectionStyle();
  const fields = getEditableTextFields(section);

  function patchStyle(update: Partial<EditorSectionStyle>) {
    if (!selectedSectionId) {
      return;
    }

    updateSectionStyle(selectedSectionId, update);
  }

  function toggleHiddenDevice(device: EditorDeviceMode) {
    const hiddenOn = selectedStyle.hiddenOn.includes(device)
      ? selectedStyle.hiddenOn.filter((item) => item !== device)
      : [...selectedStyle.hiddenOn, device];

    patchStyle({ hiddenOn });
  }

  return (
    <aside className="hidden w-80 shrink-0 border-l border-border bg-secondary/20 2xl:block">
      <div className="border-b border-border p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Properties
        </p>
        <h2 className="mt-2 text-sm font-semibold capitalize">
          {section?.type ?? "No section selected"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {propertyTabs.map((tab) => (
          <button
            className={`rounded px-2 py-1 text-xs capitalize transition-colors ${
              propertiesTab === tab
                ? "bg-background text-foreground shadow-luxury-sm"
                : "text-muted-foreground hover:bg-background"
            }`}
            key={tab}
            onClick={() => setPropertiesTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Section content</p>
            {section ? (
              <Button
                onClick={() => toggleSectionVisibility(section.id)}
                size="icon"
                title="Toggle section visibility"
                type="button"
                variant="ghost"
              >
                {section.visible ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </Button>
            ) : null}
          </div>
          {fields.slice(0, 5).map((field) => (
            <div className="space-y-2" key={field.path}>
              <Label>{field.label}</Label>
              {field.multiline ? (
                <textarea
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                  onChange={(event) =>
                    selectedSectionId
                      ? updateSectionText(
                          selectedSectionId,
                          field.path,
                          event.target.value,
                        )
                      : undefined
                  }
                  value={field.value}
                />
              ) : (
                <Input
                  onChange={(event) =>
                    selectedSectionId
                      ? updateSectionText(
                          selectedSectionId,
                          field.path,
                          event.target.value,
                        )
                      : undefined
                  }
                  value={field.value}
                />
              )}
            </div>
          ))}
        </div>

        <Separator />

        {propertiesTab === "colors" ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Color palette</p>
            <div className="grid gap-2">
              {editorColorPalettes.map((palette) => (
                <button
                  className={`flex items-center justify-between rounded-md border p-2 text-left transition-colors ${
                    themeTokens.colorPalette.id === palette.id
                      ? "border-foreground"
                      : "border-border hover:bg-background"
                  }`}
                  key={palette.id}
                  onClick={() => updateThemeTokens({ colorPalette: palette })}
                  type="button"
                >
                  <span className="text-sm font-medium">{palette.name}</span>
                  <span className="flex gap-1">
                    {[palette.background, palette.primary, palette.accent].map(
                      (color) => (
                        <span
                          className="size-5 rounded-full border border-border"
                          key={color}
                          style={{ backgroundColor: color }}
                        />
                      ),
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {propertiesTab === "typography" ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Typography scale</p>
            <div className="grid gap-2">
              {editorTypographyScales.map((typography) => (
                <button
                  className={`rounded-md border p-3 text-left transition-colors ${
                    themeTokens.typography.id === typography.id
                      ? "border-foreground"
                      : "border-border hover:bg-background"
                  }`}
                  key={typography.id}
                  onClick={() => updateThemeTokens({ typography })}
                  type="button"
                >
                  <span className="block text-sm font-medium">
                    {typography.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {typography.heading}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {propertiesTab === "spacing" ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Section spacing</p>
            <div className="grid grid-cols-3 gap-2">
              {editorSpacingScale.map((spacing) => (
                <button
                  className={`rounded-md border p-2 text-xs transition-colors ${
                    selectedStyle.padding === spacing.id
                      ? "border-foreground"
                      : "border-border hover:bg-background"
                  }`}
                  key={spacing.id}
                  onClick={() => patchStyle({ padding: spacing.id })}
                  type="button"
                >
                  {spacing.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {propertiesTab === "alignment" ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Alignment</p>
            <SegmentedControl
              items={[
                { icon: AlignLeft, label: "Start", value: "start" },
                { icon: AlignCenter, label: "Center", value: "center" },
                { icon: AlignRight, label: "End", value: "end" },
              ]}
              onChange={(align) => patchStyle({ align })}
              value={selectedStyle.align}
            />
          </div>
        ) : null}

        {propertiesTab === "visibility" ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Hide on device</p>
            <div className="grid gap-2">
              {hiddenDeviceOptions.map((device) => (
                <label
                  className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-sm"
                  key={device.value}
                >
                  {device.label}
                  <input
                    checked={selectedStyle.hiddenOn.includes(device.value)}
                    onChange={() => toggleHiddenDevice(device.value)}
                    type="checkbox"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {propertiesTab === "backgrounds" ? (
          <div className="space-y-3">
            <Label>Section background</Label>
            <Input
              onChange={(event) =>
                patchStyle({ backgroundColor: event.target.value })
              }
              type="color"
              value={
                selectedStyle.backgroundColor ??
                themeTokens.colorPalette.background
              }
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
