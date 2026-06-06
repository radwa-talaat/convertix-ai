"use client";

import { create } from "zustand";

import {
  addCtaFieldToSection,
  addTemplateSection,
  createDefaultSectionStyle,
  defaultEditorThemeTokens,
  deleteCtaFieldFromSection,
  deleteTemplateSection,
  duplicateTemplateSection,
  moveTemplateSection,
  reorderTemplateSections,
  toggleSectionVisibility,
  updateSectionTextValue,
} from "@/services/editor";
import type {
  EditorDeviceMode,
  EditorLeftPanelTab,
  EditorPropertiesTab,
  EditorSaveStatus,
  EditorSectionStyle,
  EditorSnapshot,
  EditorThemeTokens,
} from "@/types/editor";
import type {
  LandingPageSectionType,
  LandingPageTemplate,
} from "@/types/rendering";

type EditorState = {
  canRedo: boolean;
  canUndo: boolean;
  deviceMode: EditorDeviceMode;
  future: EditorSnapshot[];
  leftPanelTab: EditorLeftPanelTab;
  past: EditorSnapshot[];
  propertiesTab: EditorPropertiesTab;
  saveStatus: EditorSaveStatus;
  sectionStyles: Record<string, EditorSectionStyle>;
  selectedSectionId?: string;
  template?: LandingPageTemplate;
  themeTokens: EditorThemeTokens;
  initialize: (template: LandingPageTemplate, draft?: EditorSnapshot) => void;
  restoreSnapshot: (
    snapshot: EditorSnapshot,
    selectedSectionId?: string,
  ) => void;
  selectSection: (sectionId?: string) => void;
  setDeviceMode: (deviceMode: EditorDeviceMode) => void;
  setLeftPanelTab: (tab: EditorLeftPanelTab) => void;
  setPropertiesTab: (tab: EditorPropertiesTab) => void;
  setSaveStatus: (status: EditorSaveStatus) => void;
  markSaved: () => void;
  addSection: (type: LandingPageSectionType) => void;
  addCtaField: (sectionId: string) => void;
  deleteCtaField: (sectionId: string, fieldId: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  updateSectionText: (sectionId: string, path: string, value: string) => void;
  duplicateSection: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  updateSectionStyle: (
    sectionId: string,
    update: Partial<EditorSectionStyle>,
  ) => void;
  updateThemeTokens: (update: Partial<EditorThemeTokens>) => void;
  undo: () => void;
  redo: () => void;
};

type EditorSet = (
  partial:
    | Partial<EditorState>
    | ((state: EditorState) => Partial<EditorState>),
) => void;

type EditorGet = () => EditorState;

export const useEditorStore = create<EditorState>((set, get) => ({
  canRedo: false,
  canUndo: false,
  deviceMode: "desktop",
  future: [],
  leftPanelTab: "sections",
  past: [],
  propertiesTab: "typography",
  saveStatus: "idle",
  sectionStyles: {},
  themeTokens: defaultEditorThemeTokens,
  initialize: (template, draft) => {
    const snapshot = draft ?? {
      sectionStyles: createInitialSectionStyles(template),
      template,
      themeTokens: defaultEditorThemeTokens,
    };

    set({
      canRedo: false,
      canUndo: false,
      future: [],
      past: [],
      saveStatus: "saved",
      sectionStyles: snapshot.sectionStyles,
      selectedSectionId: snapshot.template.sections[0]?.id,
      template: snapshot.template,
      themeTokens: snapshot.themeTokens,
    });
  },
  restoreSnapshot: (snapshot, selectedSectionId) => {
    set({
      canRedo: false,
      canUndo: false,
      future: [],
      past: [],
      saveStatus: "saved",
      sectionStyles: snapshot.sectionStyles,
      selectedSectionId: selectedSectionId ?? snapshot.template.sections[0]?.id,
      template: snapshot.template,
      themeTokens: snapshot.themeTokens,
    });
  },
  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),
  setDeviceMode: (deviceMode) => set({ deviceMode }),
  setLeftPanelTab: (leftPanelTab) => set({ leftPanelTab }),
  setPropertiesTab: (propertiesTab) => set({ propertiesTab }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  markSaved: () => set({ saveStatus: "saved" }),
  addSection: (type) => {
    const before = get().template;

    applyTemplateMutation(set, get, (template) =>
      addTemplateSection(template, type),
    );

    const after = get().template;
    const added = after?.sections.find(
      (section) => !before?.sections.some((item) => item.id === section.id),
    );

    if (added) {
      set((state) => ({
        sectionStyles: {
          ...state.sectionStyles,
          [added.id]: createDefaultSectionStyle(),
        },
        selectedSectionId: added.id,
      }));
    }
  },
  reorderSections: (activeId, overId) => {
    applyTemplateMutation(set, get, (template) =>
      reorderTemplateSections(template, activeId, overId),
    );
  },
  addCtaField: (sectionId) => {
    applyTemplateMutation(set, get, (template) =>
      addCtaFieldToSection(template, sectionId),
    );
  },
  deleteCtaField: (sectionId, fieldId) => {
    applyTemplateMutation(set, get, (template) =>
      deleteCtaFieldFromSection(template, sectionId, fieldId),
    );
  },
  updateSectionText: (sectionId, path, value) => {
    applyTemplateMutation(set, get, (template) =>
      updateSectionTextValue(template, sectionId, path, value),
    );
  },
  duplicateSection: (sectionId) => {
    const before = get().template;

    applyTemplateMutation(set, get, (template) =>
      duplicateTemplateSection(template, sectionId),
    );

    const after = get().template;
    const sourceIndex =
      before?.sections.findIndex((section) => section.id === sectionId) ?? -1;
    const duplicate = after?.sections[sourceIndex + 1];

    if (duplicate) {
      set((state) => ({
        sectionStyles: {
          ...state.sectionStyles,
          [duplicate.id]:
            state.sectionStyles[sectionId] ?? createDefaultSectionStyle(),
        },
        selectedSectionId: duplicate.id,
      }));
    }
  },
  deleteSection: (sectionId) => {
    applyTemplateMutation(set, get, (template) =>
      deleteTemplateSection(template, sectionId),
    );

    set((state) => ({
      selectedSectionId:
        state.selectedSectionId === sectionId
          ? state.template?.sections[0]?.id
          : state.selectedSectionId,
    }));
  },
  toggleSectionVisibility: (sectionId) => {
    applyTemplateMutation(set, get, (template) =>
      toggleSectionVisibility(template, sectionId),
    );
  },
  moveSection: (sectionId, direction) => {
    applyTemplateMutation(set, get, (template) =>
      moveTemplateSection(template, sectionId, direction),
    );
  },
  updateSectionStyle: (sectionId, update) => {
    applySnapshotMutation(set, get, (snapshot) => ({
      ...snapshot,
      sectionStyles: {
        ...snapshot.sectionStyles,
        [sectionId]: {
          ...(snapshot.sectionStyles[sectionId] ?? createDefaultSectionStyle()),
          ...update,
        },
      },
    }));
  },
  updateThemeTokens: (update) => {
    applySnapshotMutation(set, get, (snapshot) => ({
      ...snapshot,
      themeTokens: {
        ...snapshot.themeTokens,
        ...update,
      },
    }));
  },
  undo: () => {
    const state = get();
    const previous = state.past.at(-1);

    if (!state.template || !previous) {
      return;
    }

    const current = createSnapshot(state);
    const nextPast = state.past.slice(0, -1);

    set({
      canRedo: true,
      canUndo: nextPast.length > 0,
      future: [current, ...state.future],
      past: nextPast,
      saveStatus: "dirty",
      sectionStyles: previous.sectionStyles,
      template: previous.template,
      themeTokens: previous.themeTokens,
    });
  },
  redo: () => {
    const state = get();
    const next = state.future[0];

    if (!state.template || !next) {
      return;
    }

    const current = createSnapshot(state);
    const nextFuture = state.future.slice(1);

    set({
      canRedo: nextFuture.length > 0,
      canUndo: true,
      future: nextFuture,
      past: [...state.past, current],
      saveStatus: "dirty",
      sectionStyles: next.sectionStyles,
      template: next.template,
      themeTokens: next.themeTokens,
    });
  },
}));

function applyTemplateMutation(
  set: EditorSet,
  get: EditorGet,
  mutate: (template: LandingPageTemplate) => LandingPageTemplate,
) {
  applySnapshotMutation(set, get, (snapshot) => ({
    ...snapshot,
    template: mutate(snapshot.template),
  }));
}

function applySnapshotMutation(
  set: EditorSet,
  get: EditorGet,
  mutate: (snapshot: EditorSnapshot) => EditorSnapshot,
) {
  const state = get();

  if (!state.template) {
    return;
  }

  const current = createSnapshot(state);
  const next = mutate(current);
  const past = [...state.past, current].slice(-40);

  set({
    canRedo: false,
    canUndo: true,
    future: [],
    past,
    saveStatus: "dirty",
    sectionStyles: next.sectionStyles,
    template: next.template,
    themeTokens: next.themeTokens,
  });
}

function createSnapshot(
  state: Pick<EditorState, "sectionStyles" | "template" | "themeTokens">,
): EditorSnapshot {
  if (!state.template) {
    throw new Error("Editor template is not initialized.");
  }

  return {
    sectionStyles: state.sectionStyles,
    template: state.template,
    themeTokens: state.themeTokens,
  };
}

function createInitialSectionStyles(
  template: LandingPageTemplate,
): Record<string, EditorSectionStyle> {
  return Object.fromEntries(
    template.sections.map((section) => [
      section.id,
      createDefaultSectionStyle(),
    ]),
  );
}
