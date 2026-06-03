"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Brush,
  Eye,
  EyeOff,
  ImagePlus,
  Palette,
  X,
} from "lucide-react";

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
  EditorColorPalette,
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

  function updatePaletteColor(key: keyof EditorColorPalette, value: string) {
    updateThemeTokens({
      colorPalette: {
        ...themeTokens.colorPalette,
        [key]: value,
      },
    });
  }

  return (
    <aside className="hidden h-full min-h-0 w-80 shrink-0 flex-col border-l border-border bg-secondary/20 xl:flex">
      <div className="shrink-0 border-b border-border p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Properties
        </p>
        <h2 className="mt-2 text-sm font-semibold capitalize">
          {section?.type ?? "No section selected"}
        </h2>
      </div>

      <div className="shrink-0 overflow-x-auto border-b border-border p-2">
        <div className="flex min-w-max flex-wrap gap-1">
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
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 pr-3 [scrollbar-gutter:stable]">
        <ActivePropertiesTab
          onPatchStyle={patchStyle}
          onToggleHiddenDevice={toggleHiddenDevice}
          onUpdatePaletteColor={updatePaletteColor}
          onUpdateThemeTokens={updateThemeTokens}
          propertiesTab={propertiesTab}
          selectedStyle={selectedStyle}
          themeTokens={themeTokens}
        />

        <Separator />

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

          {fields.length ? (
            fields.map((field) => (
              <div className="space-y-2" key={field.path}>
                <Label>{field.label}</Label>
                {field.path.toLowerCase().includes("imageurl") ? (
                  <ImageUrlField
                    label={field.label}
                    onChange={(value) =>
                      selectedSectionId
                        ? updateSectionText(
                            selectedSectionId,
                            field.path,
                            value,
                          )
                        : undefined
                    }
                    value={field.value}
                  />
                ) : field.multiline ? (
                  <textarea
                    className="min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
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
            ))
          ) : (
            <div className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
              Select a section with editable text to update its content.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function ActivePropertiesTab({
  onPatchStyle,
  onToggleHiddenDevice,
  onUpdatePaletteColor,
  onUpdateThemeTokens,
  propertiesTab,
  selectedStyle,
  themeTokens,
}: {
  onPatchStyle: (update: Partial<EditorSectionStyle>) => void;
  onToggleHiddenDevice: (device: EditorDeviceMode) => void;
  onUpdatePaletteColor: (key: keyof EditorColorPalette, value: string) => void;
  onUpdateThemeTokens: ReturnType<
    typeof useEditorStore.getState
  >["updateThemeTokens"];
  propertiesTab: EditorPropertiesTab;
  selectedStyle: EditorSectionStyle;
  themeTokens: ReturnType<typeof useEditorStore.getState>["themeTokens"];
}) {
  if (propertiesTab === "colors") {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Color palette</p>
          </div>
          <div className="grid gap-2">
            {editorColorPalettes.map((palette) => (
              <button
                className={`flex items-center justify-between rounded-md border p-2 text-left transition-colors ${
                  themeTokens.colorPalette.id === palette.id
                    ? "border-foreground"
                    : "border-border hover:bg-background"
                }`}
                key={palette.id}
                onClick={() => onUpdateThemeTokens({ colorPalette: palette })}
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

        <div className="grid gap-3">
          <p className="text-sm font-semibold">Theme colors</p>
          <ColorField
            label="Background"
            onChange={(value) => onUpdatePaletteColor("background", value)}
            value={themeTokens.colorPalette.background}
          />
          <ColorField
            label="Surface"
            onChange={(value) => onUpdatePaletteColor("surface", value)}
            value={themeTokens.colorPalette.surface}
          />
          <ColorField
            label="Text"
            onChange={(value) => onUpdatePaletteColor("foreground", value)}
            value={themeTokens.colorPalette.foreground}
          />
          <ColorField
            label="Primary"
            onChange={(value) => onUpdatePaletteColor("primary", value)}
            value={themeTokens.colorPalette.primary}
          />
          <ColorField
            label="Accent"
            onChange={(value) => onUpdatePaletteColor("accent", value)}
            value={themeTokens.colorPalette.accent}
          />
          <ColorField
            label="Border"
            onChange={(value) => onUpdatePaletteColor("border", value)}
            value={themeTokens.colorPalette.border}
          />
        </div>
      </div>
    );
  }

  if (propertiesTab === "typography") {
    return (
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
              onClick={() => onUpdateThemeTokens({ typography })}
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
    );
  }

  if (propertiesTab === "spacing") {
    return (
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
              onClick={() => onPatchStyle({ padding: spacing.id })}
              type="button"
            >
              {spacing.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (propertiesTab === "alignment") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold">Alignment</p>
        <SegmentedControl
          items={[
            { icon: AlignLeft, label: "Start", value: "start" },
            { icon: AlignCenter, label: "Center", value: "center" },
            { icon: AlignRight, label: "End", value: "end" },
          ]}
          onChange={(align) => onPatchStyle({ align })}
          value={selectedStyle.align}
        />
      </div>
    );
  }

  if (propertiesTab === "visibility") {
    return (
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
                onChange={() => onToggleHiddenDevice(device.value)}
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brush className="size-4 text-muted-foreground" />
        <p className="text-sm font-semibold">Layer media</p>
      </div>
      <ColorField
        label="Background color"
        onChange={(value) => onPatchStyle({ backgroundColor: value })}
        value={
          selectedStyle.backgroundColor ?? themeTokens.colorPalette.background
        }
      />
      <ImageUrlField
        label="Background image"
        onChange={(value) => onPatchStyle({ backgroundImageUrl: value })}
        value={selectedStyle.backgroundImageUrl ?? ""}
      />
      <ImageUrlField
        label="Image inside layer"
        onChange={(value) => onPatchStyle({ foregroundImageUrl: value })}
        value={selectedStyle.foregroundImageUrl ?? ""}
      />
    </div>
  );
}

function ColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3 text-sm">
      <span className="min-w-0 truncate text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
        <Input
          aria-label={label}
          className="h-8 w-10 cursor-pointer p-1"
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={value}
        />
      </span>
    </label>
  );
}

function ImageUrlField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="space-y-2 rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm">{label}</Label>
        {value ? (
          <Button
            onClick={() => onChange("")}
            size="icon"
            title={`Remove ${label}`}
            type="button"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      <div className="flex gap-2">
        <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-secondary/40 px-3 text-xs font-medium transition-colors hover:bg-secondary">
          <ImagePlus className="size-4" />
          Upload
          <input
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";

              if (file) {
                void readImageFile(file).then(onChange);
              }
            }}
            type="file"
          />
        </label>
        <Input
          className="h-9"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste image URL"
          value={value.startsWith("data:image/") ? "" : value}
        />
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={label}
          className="h-28 w-full rounded-md border border-border object-cover"
          src={value}
        />
      ) : null}
    </div>
  );
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload an image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Image upload failed."));
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  });
}
