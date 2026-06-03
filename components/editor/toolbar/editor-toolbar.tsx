"use client";

import {
  Code2,
  FileJson,
  Eye,
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
import * as React from "react";

import { updateLandingPageDraftAction } from "@/app/dashboard/projects/actions";
import { SegmentedControl } from "@/components/editor/controls/segmented-control";
import { Button } from "@/components/ui/button";
import {
  downloadEditorHtml,
  downloadEditorJson,
  downloadEditorLayerPngs,
  saveEditorDraft,
} from "@/services/editor";
import { useEditorStore } from "@/store/editor";
import type { Json } from "@/types/database";

const deviceItems = [
  { icon: Laptop, label: "Desktop", value: "desktop" },
  { icon: Tablet, label: "Tablet", value: "tablet" },
  { icon: Smartphone, label: "Mobile", value: "mobile" },
] as const;

type EditorToolbarProps = {
  pageId?: string;
};

export function EditorToolbar({ pageId }: EditorToolbarProps) {
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
  const [exportStatus, setExportStatus] = React.useState<
    "idle" | "html" | "json" | "png"
  >("idle");

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
          title="Undo"
          type="button"
          variant="ghost"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          disabled={!canRedo}
          onClick={redo}
          size="icon"
          title="Redo"
          type="button"
          variant="ghost"
        >
          <Redo2 className="size-4" />
        </Button>
        <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
          {saveStatus === "saving" ? "Saving draft..." : null}
          {saveStatus === "saved" ? "Draft saved" : null}
          {saveStatus === "dirty" ? "Unsaved changes" : null}
          {saveStatus === "error" ? "Draft save failed" : null}
          {saveStatus === "idle" ? "Ready" : null}
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
          title="Download JSON"
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
          title="Download HTML"
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
          title="Download each layer as high-quality PNG"
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
          title="Save draft"
          type="button"
          variant="outline"
        >
          {saveStatus === "saving" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button asChild size="sm" title="Preview" variant="ghost">
          <Link href="/preview/launch-os" rel="noreferrer" target="_blank">
            <Eye className="size-4" />
            <span className="hidden sm:inline">Preview</span>
          </Link>
        </Button>
        <Button
          disabled
          size="sm"
          title="Publishing is a later phase"
          type="button"
        >
          <Rocket className="size-4" />
          <span className="hidden sm:inline">Publish</span>
        </Button>
      </div>
    </header>
  );
}
