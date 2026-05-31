"use client";

import {
  Eye,
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

import { SegmentedControl } from "@/components/editor/controls/segmented-control";
import { Button } from "@/components/ui/button";
import { saveEditorDraft } from "@/services/editor";
import { useEditorStore } from "@/store/editor";

const deviceItems = [
  { icon: Laptop, label: "Desktop", value: "desktop" },
  { icon: Tablet, label: "Tablet", value: "tablet" },
  { icon: Smartphone, label: "Mobile", value: "mobile" },
] as const;

export function EditorToolbar() {
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

  function handleSave() {
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
    setSaveStatus("saved");
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
