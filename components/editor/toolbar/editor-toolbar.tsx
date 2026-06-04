"use client";

import {
  Code2,
  Eye,
  FileJson,
  Images,
  Laptop,
  Loader2,
  Redo2,
  Rocket,
  Save,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { publishPageAction } from "@/app/dashboard/publishing/actions";
import { updateLandingPageDraftAction } from "@/app/dashboard/projects/actions";
import { SegmentedControl } from "@/components/editor/controls/segmented-control";
import { Button } from "@/components/ui/button";
import { createLocalizedPathname, type AppLocale } from "@/lib/i18n/config";
import {
  downloadEditorHtml,
  downloadEditorJson,
  downloadEditorLayerPngs,
  saveEditorDraft,
} from "@/services/editor";
import { useEditorStore } from "@/store/editor";
import type { Json } from "@/types/database";

type EditorToolbarProps = {
  pageId?: string;
};

export function EditorToolbar({ pageId }: EditorToolbarProps) {
  const t = useTranslations("editor");
  const canRedo = useEditorStore((state) => state.canRedo);
  const canUndo = useEditorStore((state) => state.canUndo);
  const deviceMode = useEditorStore((state) => state.deviceMode);
  const redo = useEditorStore((state) => state.redo);
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const setDeviceMode = useEditorStore((state) => state.setDeviceMode);
  const setSaveStatus = useEditorStore((state) => state.setSaveStatus);
  const template = useEditorStore((state) => state.template);
  const themeTokens = useEditorStore((state) => state.themeTokens);
  const undo = useEditorStore((state) => state.undo);
  const locale = useLocale() as AppLocale;
  const [exportStatus, setExportStatus] = React.useState<
    "idle" | "html" | "json" | "png"
  >("idle");
  const [publishStatus, setPublishStatus] = React.useState<
    "idle" | "publishing" | "published" | "error"
  >("idle");
  const deviceItems = React.useMemo(
    () =>
      [
        { icon: Laptop, label: t("desktop"), value: "desktop" },
        { icon: Tablet, label: t("tablet"), value: "tablet" },
        { icon: Smartphone, label: t("mobile"), value: "mobile" },
      ] as const,
    [t],
  );

  const snapshot = template
    ? {
        sectionStyles,
        template,
        themeTokens,
      }
    : null;

  async function handleSave() {
    if (!template) {
      return;
    }

    setSaveStatus("saving");
    saveEditorDraft(
      {
        sectionStyles,
        template,
        themeTokens,
      },
      selectedSectionId,
    );

    const persistedTemplate = {
      ...template,
      editorState: {
        sectionStyles,
        themeTokens,
      },
    };

    if (pageId) {
      try {
        await updateLandingPageDraftAction(
          pageId,
          persistedTemplate as unknown as Json,
          persistedTemplate.seo as unknown as Json,
        );
      } catch {
        setSaveStatus("error");
        return;
      }
    }

    setSaveStatus("saved");
  }

  async function handlePublish() {
    if (!template || !pageId) {
      setPublishStatus("error");
      return;
    }

    setPublishStatus("publishing");
    setSaveStatus("saving");

    const persistedTemplate = {
      ...template,
      editorState: {
        sectionStyles,
        themeTokens,
      },
    };

    try {
      await updateLandingPageDraftAction(
        pageId,
        persistedTemplate as unknown as Json,
        persistedTemplate.seo as unknown as Json,
      );
      await publishPageAction({
        pageId,
        projectSlug: persistedTemplate.slug,
        template: persistedTemplate,
      });
      setSaveStatus("saved");
      setPublishStatus("published");
    } catch {
      setSaveStatus("error");
      setPublishStatus("error");
    }
  }

  function handleJsonExport() {
    if (!snapshot) {
      return;
    }

    setExportStatus("json");
    downloadEditorJson(snapshot);
    setExportStatus("idle");
  }

  function handleHtmlExport() {
    if (!snapshot) {
      return;
    }

    setExportStatus("html");

    try {
      downloadEditorHtml(snapshot);
    } finally {
      setExportStatus("idle");
    }
  }

  async function handlePngExport() {
    setExportStatus("png");

    try {
      await downloadEditorLayerPngs();
    } finally {
      setExportStatus("idle");
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Button
          disabled={!canUndo}
          onClick={undo}
          size="icon"
          title={t("undo")}
          type="button"
          variant="ghost"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          disabled={!canRedo}
          onClick={redo}
          size="icon"
          title={t("redo")}
          type="button"
          variant="ghost"
        >
          <Redo2 className="size-4" />
        </Button>
        <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
          {saveStatus === "saving" ? t("savingDraft") : null}
          {saveStatus === "saved" ? t("draftSaved") : null}
          {saveStatus === "dirty" ? t("unsavedChanges") : null}
          {saveStatus === "error" ? t("draftSaveFailed") : null}
          {saveStatus === "idle" ? t("ready") : null}
        </span>
      </div>

      <SegmentedControl
        items={[...deviceItems]}
        onChange={setDeviceMode}
        value={deviceMode}
      />

      <div className="flex items-center gap-2">
        <Button
          disabled={!snapshot || exportStatus !== "idle"}
          onClick={handleJsonExport}
          size="sm"
          title={t("downloadJson")}
          type="button"
          variant="outline"
        >
          <FileJson className="size-4" />
          <span className="hidden xl:inline">JSON</span>
        </Button>
        <Button
          disabled={!snapshot || exportStatus !== "idle"}
          onClick={handleHtmlExport}
          size="sm"
          title={t("downloadHtml")}
          type="button"
          variant="outline"
        >
          <Code2 className="size-4" />
          <span className="hidden xl:inline">HTML</span>
        </Button>
        <Button
          disabled={exportStatus !== "idle"}
          onClick={() => void handlePngExport()}
          size="sm"
          title={t("downloadPng")}
          type="button"
          variant="outline"
        >
          {exportStatus === "png" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Images className="size-4" />
          )}
          <span className="hidden xl:inline">PNG</span>
        </Button>
        <Button
          onClick={handleSave}
          size="sm"
          title={t("saveDraft")}
          type="button"
          variant="outline"
        >
          {saveStatus === "saving" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span className="hidden sm:inline">{t("save")}</span>
        </Button>
        <Button asChild size="sm" title={t("preview")} variant="ghost">
          <Link
            href={createLocalizedPathname(
              pageId
                ? `/dashboard/preview?page=${pageId}`
                : `/preview/${template?.slug ?? "launch-os"}`,
              locale,
            )}
            rel="noreferrer"
            target="_blank"
          >
            <Eye className="size-4" />
            <span className="hidden sm:inline">{t("preview")}</span>
          </Link>
        </Button>
        <Button
          disabled={!pageId || !template || publishStatus === "publishing"}
          onClick={() => void handlePublish()}
          size="sm"
          title={pageId ? t("publishPage") : t("saveBeforePublishing")}
          type="button"
        >
          {publishStatus === "publishing" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Rocket className="size-4" />
          )}
          <span className="hidden sm:inline">
            {publishStatus === "publishing" ? t("publishing") : t("publish")}
          </span>
        </Button>
      </div>
    </header>
  );
}
