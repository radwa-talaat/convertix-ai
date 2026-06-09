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
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
  EditorCustomFont,
  EditorDeviceMode,
  EditorPropertiesTab,
  EditorSectionStyle,
} from "@/types/editor";
import type { CtaSectionData } from "@/types/rendering";

const propertyTabs: EditorPropertiesTab[] = [
  "typography",
  "colors",
  "spacing",
  "alignment",
  "visibility",
  "backgrounds",
];

export function EditorPropertiesPanel() {
  const t = useTranslations("editor");
  const propertiesTab = useEditorStore((state) => state.propertiesTab);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const setPropertiesTab = useEditorStore((state) => state.setPropertiesTab);
  const template = useEditorStore((state) => state.template);
  const themeTokens = useEditorStore((state) => state.themeTokens);
  const addCtaField = useEditorStore((state) => state.addCtaField);
  const deleteCtaField = useEditorStore((state) => state.deleteCtaField);
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
          {t("properties")}
        </p>
        <h2 className="mt-2 text-sm font-semibold capitalize">
          {section?.type ?? t("noSectionSelected")}
        </h2>
      </div>

      <div className="shrink-0 border-b border-border p-2">
        <div className="grid grid-cols-3 gap-1">
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
              {t(tab)}
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
            <p className="text-sm font-semibold">{t("sectionContent")}</p>
            {section ? (
              <Button
                onClick={() => toggleSectionVisibility(section.id)}
                size="icon"
                title={t("toggleSectionVisibility")}
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

          {section?.type === "cta" ? (
            <CtaFieldControls
              fields={(section.data as CtaSectionData).fields ?? []}
              onAdd={() => addCtaField(section.id)}
              onDelete={(fieldId) => deleteCtaField(section.id, fieldId)}
            />
          ) : null}

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
              {t("selectEditableSection")}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function CtaFieldControls({
  fields,
  onAdd,
  onDelete,
}: {
  fields: NonNullable<CtaSectionData["fields"]>;
  onAdd: () => void;
  onDelete: (fieldId: string) => void;
}) {
  const t = useTranslations("editor");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const labels = {
    ctaField: safeTranslate(t, "ctaField", isArabic ? "خانة CTA" : "CTA field"),
    ctaFields: safeTranslate(
      t,
      "ctaFields",
      isArabic ? "خانات الدعوة للإجراء" : "CTA fields",
    ),
    ctaFieldsDescription: safeTranslate(
      t,
      "ctaFieldsDescription",
      isArabic
        ? "أضف أو احذف تفاصيل العرض التي تظهر فوق زر الإجراء النهائي."
        : "Add or remove the small offer/details shown above the final CTA button.",
    ),
    deleteCtaField: safeTranslate(
      t,
      "deleteCtaField",
      isArabic ? "حذف خانة CTA" : "Delete CTA field",
    ),
    emptyCtaFields: safeTranslate(
      t,
      "emptyCtaFields",
      isArabic
        ? "أضف خانات للسعر أو التوصيل أو الهدية أو الضمان أو الخطوة التالية."
        : "Add fields for price, delivery, bonus, guarantee, or the next step.",
    ),
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{labels.ctaFields}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {labels.ctaFieldsDescription}
          </p>
        </div>
        <Button onClick={onAdd} size="sm" type="button" variant="outline">
          <Plus className="size-4" />
          {t("add")}
        </Button>
      </div>

      {fields.length ? (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/20 p-2"
              key={field.id}
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">
                  {field.label || `${labels.ctaField} ${index + 1}`}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {field.value}
                </p>
              </div>
              <Button
                onClick={() => onDelete(field.id)}
                size="icon"
                title={labels.deleteCtaField}
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-border p-3 text-xs leading-5 text-muted-foreground">
          {labels.emptyCtaFields}
        </p>
      )}
    </div>
  );
}

function safeTranslate(
  t: ReturnType<typeof useTranslations>,
  key: string,
  fallback: string,
) {
  try {
    return t(key);
  } catch {
    return fallback;
  }
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
  const t = useTranslations("editor");
  const hiddenDeviceOptions: Array<{
    label: string;
    value: EditorDeviceMode;
  }> = [
    { label: t("desktop"), value: "desktop" },
    { label: t("tablet"), value: "tablet" },
    { label: t("mobile"), value: "mobile" },
  ];

  if (propertiesTab === "colors") {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{t("colorPalette")}</p>
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
          <p className="text-sm font-semibold">{t("themeColors")}</p>
          <ColorField
            label={t("background")}
            onChange={(value) => onUpdatePaletteColor("background", value)}
            value={themeTokens.colorPalette.background}
          />
          <ColorField
            label={t("surface")}
            onChange={(value) => onUpdatePaletteColor("surface", value)}
            value={themeTokens.colorPalette.surface}
          />
          <ColorField
            label={t("text")}
            onChange={(value) => onUpdatePaletteColor("foreground", value)}
            value={themeTokens.colorPalette.foreground}
          />
          <ColorField
            label={t("primary")}
            onChange={(value) => onUpdatePaletteColor("primary", value)}
            value={themeTokens.colorPalette.primary}
          />
          <ColorField
            label={t("accent")}
            onChange={(value) => onUpdatePaletteColor("accent", value)}
            value={themeTokens.colorPalette.accent}
          />
          <ColorField
            label={t("border")}
            onChange={(value) => onUpdatePaletteColor("border", value)}
            value={themeTokens.colorPalette.border}
          />
        </div>
      </div>
    );
  }

  if (propertiesTab === "typography") {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-semibold">{t("typographyScale")}</p>
          <div className="grid gap-2">
            {[
              ...editorTypographyScales,
              ...(themeTokens.customFonts ?? []).map((font) =>
                customFontToTypography(font),
              ),
            ].map((typography) => (
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
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {typography.heading}
                </span>
              </button>
            ))}
          </div>
        </div>

        <FontUploadField
          onUpload={(font) =>
            onUpdateThemeTokens({
              customFonts: [...(themeTokens.customFonts ?? []), font],
              typography: customFontToTypography(font),
            })
          }
        />

        <div className="space-y-3 rounded-md border border-border bg-background p-3">
          <p className="text-sm font-semibold">{t("sectionTextSize")}</p>
          <RangeField
            label={t("textScale")}
            max={240}
            min={70}
            onChange={(value) => onPatchStyle({ textScale: value })}
            step={5}
            suffix="%"
            value={selectedStyle.textScale ?? 100}
          />
        </div>

        <CustomTextControls
          onPatchStyle={onPatchStyle}
          selectedStyle={selectedStyle}
          themeTokens={themeTokens}
        />
      </div>
    );
  }

  if (propertiesTab === "spacing") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold">{t("sectionSpacing")}</p>
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
        <div className="rounded-md border border-border bg-background p-3">
          <RangeField
            label={t("sectionMinHeight")}
            max={1100}
            min={0}
            onChange={(value) => onPatchStyle({ sectionMinHeight: value })}
            step={20}
            suffix="px"
            value={selectedStyle.sectionMinHeight ?? 0}
          />
        </div>
      </div>
    );
  }

  if (propertiesTab === "alignment") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold">{t("alignment")}</p>
        <SegmentedControl
          items={[
            { icon: AlignLeft, label: t("start"), value: "start" },
            { icon: AlignCenter, label: t("center"), value: "center" },
            { icon: AlignRight, label: t("end"), value: "end" },
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
        <p className="text-sm font-semibold">{t("hideOnDevice")}</p>
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
        <p className="text-sm font-semibold">{t("layerMedia")}</p>
      </div>
      <ColorField
        label={t("backgroundColor")}
        onChange={(value) => onPatchStyle({ backgroundColor: value })}
        value={
          selectedStyle.backgroundColor ?? themeTokens.colorPalette.background
        }
      />
      <ImageUrlField
        label={t("backgroundImage")}
        onChange={(value) => onPatchStyle({ backgroundImageUrl: value })}
        value={selectedStyle.backgroundImageUrl ?? ""}
      />
      {selectedStyle.backgroundImageUrl ? (
        <div className="rounded-md border border-border bg-background p-3">
          <RangeField
            label={t("backgroundOpacity")}
            max={100}
            min={5}
            onChange={(value) => onPatchStyle({ backgroundImageOpacity: value })}
            step={5}
            suffix="%"
            value={selectedStyle.backgroundImageOpacity ?? 100}
          />
        </div>
      ) : null}
      <ImageUrlField
        label={t("imageInsideLayer")}
        onChange={(value) => onPatchStyle({ foregroundImageUrl: value })}
        value={selectedStyle.foregroundImageUrl ?? ""}
      />
      {selectedStyle.foregroundImageUrl ? (
        <div className="space-y-3 rounded-md border border-border bg-background p-3">
          <p className="text-sm font-semibold">{t("productImagePosition")}</p>
          <RangeField
            label={t("width")}
            max={900}
            min={80}
            onChange={(value) => onPatchStyle({ foregroundImageWidth: value })}
            step={10}
            suffix="px"
            value={selectedStyle.foregroundImageWidth ?? 220}
          />
          <RangeField
            label={t("height")}
            max={900}
            min={0}
            onChange={(value) => onPatchStyle({ foregroundImageHeight: value })}
            step={10}
            suffix="px"
            value={selectedStyle.foregroundImageHeight ?? 0}
          />
          <RangeField
            label={t("horizontal")}
            max={100}
            min={0}
            onChange={(value) => onPatchStyle({ foregroundImageX: value })}
            step={1}
            suffix="%"
            value={selectedStyle.foregroundImageX ?? 82}
          />
          <RangeField
            label={t("vertical")}
            max={100}
            min={0}
            onChange={(value) => onPatchStyle({ foregroundImageY: value })}
            step={1}
            suffix="%"
            value={selectedStyle.foregroundImageY ?? 72}
          />
          <RangeField
            label={t("opacity")}
            max={100}
            min={5}
            onChange={(value) => onPatchStyle({ foregroundImageOpacity: value })}
            step={5}
            suffix="%"
            value={selectedStyle.foregroundImageOpacity ?? 100}
          />
          <RangeField
            label={t("cornerRadius")}
            max={80}
            min={0}
            onChange={(value) => onPatchStyle({ foregroundImageRadius: value })}
            step={1}
            suffix="px"
            value={selectedStyle.foregroundImageRadius ?? 12}
          />
        </div>
      ) : null}
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
  const t = useTranslations("editor");

  return (
    <div className="space-y-2 rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm">{label}</Label>
        {value ? (
          <Button
            onClick={() => onChange("")}
            size="icon"
            title={`${t("remove")} ${label}`}
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
          {t("upload")}
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
          placeholder={t("pasteImageUrl")}
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

function FontUploadField({
  onUpload,
}: {
  onUpload: (font: EditorCustomFont) => void;
}) {
  const t = useTranslations("editor");

  return (
    <div className="space-y-3 rounded-md border border-border bg-background p-3">
      <p className="text-sm font-semibold">{t("uploadFont")}</p>
      <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-secondary/40 px-3 text-xs font-medium transition-colors hover:bg-secondary">
        <Plus className="size-4" />
        {t("uploadFontTypes")}
        <input
          accept=".ttf,.otf,.woff,.woff2,font/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";

            if (file) {
              void readFileAsDataUrl(file).then((dataUrl) => {
                const name = cleanFontName(file.name);
                onUpload({
                  dataUrl,
                  family: `Custom ${name} ${Date.now()}`,
                  id: `custom-font-${Date.now()}`,
                  name,
                });
              });
            }
          }}
          type="file"
        />
      </label>
      <p className="text-xs leading-5 text-muted-foreground">
        {t("uploadedFontsNote")}
      </p>
    </div>
  );
}

function CustomTextControls({
  onPatchStyle,
  selectedStyle,
  themeTokens,
}: {
  onPatchStyle: (update: Partial<EditorSectionStyle>) => void;
  selectedStyle: EditorSectionStyle;
  themeTokens: ReturnType<typeof useEditorStore.getState>["themeTokens"];
}) {
  const t = useTranslations("editor");
  const customTexts = selectedStyle.customTexts ?? [];

  function updateText(
    id: string,
    update: Partial<(typeof customTexts)[number]>,
  ) {
    onPatchStyle({
      customTexts: customTexts.map((text) =>
        text.id === id ? { ...text, ...update } : text,
      ),
    });
  }

  return (
    <div className="space-y-3 rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{t("extraTextBlocks")}</p>
        <Button
          onClick={() =>
            onPatchStyle({
              customTexts: [
                ...customTexts,
                {
                  color: themeTokens.colorPalette.foreground,
                  fontSize: 34,
                  id: `text-${Date.now()}`,
                  text: t("newText"),
                  x: 50,
                  y: 50,
                },
              ],
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus className="size-4" />
          {t("add")}
        </Button>
      </div>

      {customTexts.length ? (
        <div className="space-y-3">
          {customTexts.map((text, index) => (
            <div
              className="space-y-3 rounded-md border border-border bg-secondary/20 p-3"
              key={text.id}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("textBlock")} {index + 1}
                </p>
                <Button
                  onClick={() =>
                    onPatchStyle({
                      customTexts: customTexts.filter(
                        (item) => item.id !== text.id,
                      ),
                    })
                  }
                  size="icon"
                  title={t("deleteTextBlock")}
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <textarea
                className="min-h-20 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                onChange={(event) =>
                  updateText(text.id, { text: event.target.value })
                }
                value={text.text}
              />
              <ColorField
                label={t("textColor")}
                onChange={(value) => updateText(text.id, { color: value })}
                value={text.color ?? themeTokens.colorPalette.foreground}
              />
              <RangeField
                label={t("size")}
                max={160}
                min={12}
                onChange={(value) => updateText(text.id, { fontSize: value })}
                step={1}
                suffix="px"
                value={text.fontSize}
              />
              <RangeField
                label={t("horizontal")}
                max={100}
                min={0}
                onChange={(value) => updateText(text.id, { x: value })}
                step={1}
                suffix="%"
                value={text.x}
              />
              <RangeField
                label={t("vertical")}
                max={100}
                min={0}
                onChange={(value) => updateText(text.id, { y: value })}
                step={1}
                suffix="%"
                value={text.y}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-border p-3 text-xs leading-5 text-muted-foreground">
          {t("emptyCustomText")}
        </p>
      )}
    </div>
  );
}

function RangeField({
  label,
  max,
  min,
  onChange,
  step,
  suffix,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix: string;
  value: number;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="h-2 w-full cursor-pointer accent-foreground"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

function customFontToTypography(font: EditorCustomFont) {
  const family = `"${font.family}", ui-sans-serif, system-ui, sans-serif`;

  return {
    body: family,
    heading: family,
    id: font.id,
    name: font.name,
  };
}

function cleanFontName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s_-]/g, "")
    .trim()
    .slice(0, 48);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File upload failed."));
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  });
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
