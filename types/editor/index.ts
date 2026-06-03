import type {
  LandingPageSection,
  LandingPageTemplate,
} from "@/types/rendering";

export type EditorDeviceMode = "desktop" | "tablet" | "mobile";

export type EditorLeftPanelTab =
  | "sections"
  | "components"
  | "templates"
  | "layers";

export type EditorPropertiesTab =
  | "typography"
  | "colors"
  | "spacing"
  | "alignment"
  | "visibility"
  | "backgrounds";

export type EditorSaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export type EditorTextField = {
  label: string;
  path: string;
  value: string;
  multiline?: boolean;
};

export type EditorCustomText = {
  id: string;
  color?: string;
  fontFamily?: string;
  fontSize: number;
  text: string;
  x: number;
  y: number;
};

export type EditorSectionStyle = {
  align: "start" | "center" | "end";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  customTexts?: EditorCustomText[];
  foregroundImageX?: number;
  foregroundImageY?: number;
  foregroundImageUrl?: string;
  foregroundImageWidth?: number;
  hiddenOn: EditorDeviceMode[];
  padding: "compact" | "comfortable" | "spacious";
  textScale?: number;
};

export type EditorColorPalette = {
  id: string;
  name: string;
  background: string;
  foreground: string;
  muted: string;
  surface: string;
  border: string;
  primary: string;
  primaryForeground: string;
  accent: string;
};

export type EditorTypographyScale = {
  id: string;
  name: string;
  heading: string;
  body: string;
};

export type EditorCustomFont = {
  dataUrl: string;
  family: string;
  id: string;
  name: string;
};

export type EditorSpacingScale = {
  id: EditorSectionStyle["padding"];
  name: string;
  value: string;
};

export type EditorThemeTokens = {
  colorPalette: EditorColorPalette;
  customFonts?: EditorCustomFont[];
  typography: EditorTypographyScale;
  radius: string;
};

export type EditorSnapshot = {
  sectionStyles: Record<string, EditorSectionStyle>;
  template: LandingPageTemplate;
  themeTokens: EditorThemeTokens;
};

export type EditorDraft = EditorSnapshot & {
  savedAt: string;
  selectedSectionId?: LandingPageSection["id"];
};
