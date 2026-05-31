"use client";

import * as React from "react";

import { saveEditorDraft } from "@/services/editor";
import { useEditorStore } from "@/store/editor";

export function useEditorShortcuts() {
  const redo = useEditorStore((state) => state.redo);
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const setSaveStatus = useEditorStore((state) => state.setSaveStatus);
  const template = useEditorStore((state) => state.template);
  const themeTokens = useEditorStore((state) => state.themeTokens);
  const undo = useEditorStore((state) => state.undo);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mod = event.ctrlKey || event.metaKey;

      if (!mod) {
        return;
      }

      if (event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (event.key.toLowerCase() === "s" && template) {
        event.preventDefault();
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
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    redo,
    sectionStyles,
    selectedSectionId,
    setSaveStatus,
    template,
    themeTokens,
    undo,
  ]);
}
