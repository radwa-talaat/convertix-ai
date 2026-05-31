"use client";

import * as React from "react";
import { Editor as CraftEditor } from "@craftjs/core";

import { EditorCanvas } from "@/components/editor/canvas/editor-canvas";
import { EditorLeftSidebar } from "@/components/editor/panels/left-sidebar";
import { EditorPropertiesPanel } from "@/components/editor/panels/properties-panel";
import { EditorToolbar } from "@/components/editor/toolbar/editor-toolbar";
import { useEditorAutosave, useEditorShortcuts } from "@/hooks/editor";
import { loadEditorDraft } from "@/services/editor";
import { useEditorStore } from "@/store/editor";
import type { LandingPageTemplate } from "@/types/rendering";

type EditorShellProps = {
  template: LandingPageTemplate;
};

export function EditorShell({ template }: EditorShellProps) {
  const initialize = useEditorStore((state) => state.initialize);
  const restoreSnapshot = useEditorStore((state) => state.restoreSnapshot);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const draft = loadEditorDraft();

    if (draft) {
      restoreSnapshot(
        {
          sectionStyles: draft.sectionStyles,
          template: draft.template,
          themeTokens: draft.themeTokens,
        },
        draft.selectedSectionId,
      );
    } else {
      initialize(template);
    }

    setReady(true);
  }, [initialize, restoreSnapshot, template]);

  useEditorAutosave();
  useEditorShortcuts();

  return (
    <CraftEditor enabled={false} resolver={{}}>
      <div className="flex h-[calc(100vh-4rem)] min-h-[720px] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        <EditorToolbar />
        {ready ? (
          <div className="flex min-h-0 flex-1">
            <EditorLeftSidebar />
            <EditorCanvas />
            <EditorPropertiesPanel />
          </div>
        ) : (
          <div className="grid flex-1 place-items-center bg-secondary/30">
            <div className="h-48 w-96 animate-pulse rounded-lg bg-background" />
          </div>
        )}
      </div>
    </CraftEditor>
  );
}
