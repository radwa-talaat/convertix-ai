import type { EditorDraft, EditorSnapshot } from "@/types/editor";

const DRAFT_KEY = "ai-landing-page-builder:editor-draft";

export function loadEditorDraft(): EditorDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const payload = window.localStorage.getItem(DRAFT_KEY);

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as EditorDraft;
  } catch {
    window.localStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

export function saveEditorDraft(
  snapshot: EditorSnapshot,
  selectedSectionId?: string,
): EditorDraft {
  const draft: EditorDraft = {
    ...snapshot,
    savedAt: new Date().toISOString(),
    selectedSectionId,
  };

  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

  return draft;
}

export function clearEditorDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_KEY);
}
