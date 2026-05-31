"use client";

import * as React from "react";

import { saveEditorDraft } from "@/services/editor";
import { useEditorStore } from "@/store/editor";

export function useEditorAutosave() {
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const setSaveStatus = useEditorStore((state) => state.setSaveStatus);
  const template = useEditorStore((state) => state.template);
  const themeTokens = useEditorStore((state) => state.themeTokens);

  React.useEffect(() => {
    if (!template || saveStatus !== "dirty") {
      return;
    }

    const timeout = window.setTimeout(() => {
      try {
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
      } catch {
        setSaveStatus("error");
      }
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [
    saveStatus,
    sectionStyles,
    selectedSectionId,
    setSaveStatus,
    template,
    themeTokens,
  ]);
}
