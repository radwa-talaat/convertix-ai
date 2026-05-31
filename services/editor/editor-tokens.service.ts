import type {
  EditorColorPalette,
  EditorSpacingScale,
  EditorThemeTokens,
  EditorTypographyScale,
} from "@/types/editor";
import type { LandingPageTheme } from "@/types/rendering";

export const editorColorPalettes: EditorColorPalette[] = [
  {
    accent: "#d7fb72",
    background: "#f7f7f2",
    border: "#deded4",
    foreground: "#10100e",
    id: "atelier",
    muted: "#68685f",
    name: "Atelier",
    primary: "#111111",
    primaryForeground: "#ffffff",
    surface: "#ffffff",
  },
  {
    accent: "#9ddcff",
    background: "#08090b",
    border: "#262a32",
    foreground: "#f8fafc",
    id: "obsidian",
    muted: "#a7adba",
    name: "Obsidian",
    primary: "#f8fafc",
    primaryForeground: "#08090b",
    surface: "#111318",
  },
  {
    accent: "#f7c59f",
    background: "#fbfaf8",
    border: "#e6e1d8",
    foreground: "#171512",
    id: "editorial",
    muted: "#6d675d",
    name: "Editorial",
    primary: "#3f5f50",
    primaryForeground: "#ffffff",
    surface: "#ffffff",
  },
];

export const editorTypographyScales: EditorTypographyScale[] = [
  {
    body: "Inter, ui-sans-serif, system-ui, sans-serif",
    heading: "Inter, ui-sans-serif, system-ui, sans-serif",
    id: "modern",
    name: "Modern SaaS",
  },
  {
    body: "Geist, ui-sans-serif, system-ui, sans-serif",
    heading: "Geist, ui-sans-serif, system-ui, sans-serif",
    id: "quiet",
    name: "Quiet System",
  },
  {
    body: "Georgia, Cambria, serif",
    heading: "Georgia, Cambria, serif",
    id: "editorial",
    name: "Editorial",
  },
];

export const editorSpacingScale: EditorSpacingScale[] = [
  { id: "compact", name: "Compact", value: "48px" },
  { id: "comfortable", name: "Comfortable", value: "72px" },
  { id: "spacious", name: "Spacious", value: "104px" },
];

export const defaultEditorThemeTokens: EditorThemeTokens = {
  colorPalette: editorColorPalettes[0],
  radius: "12px",
  typography: editorTypographyScales[0],
};

export function createThemeFromEditorTokens(
  tokens: EditorThemeTokens,
): LandingPageTheme {
  return {
    colors: {
      accent: tokens.colorPalette.accent,
      background: tokens.colorPalette.background,
      border: tokens.colorPalette.border,
      foreground: tokens.colorPalette.foreground,
      muted: tokens.colorPalette.muted,
      primary: tokens.colorPalette.primary,
      primaryForeground: tokens.colorPalette.primaryForeground,
      surface: tokens.colorPalette.surface,
    },
    id: "linear",
    name: tokens.colorPalette.name,
    radius: tokens.radius,
    typography: {
      body: tokens.typography.body,
      heading: tokens.typography.heading,
    },
  };
}
