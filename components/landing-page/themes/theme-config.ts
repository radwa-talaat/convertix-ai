import type { LandingPageTheme, LandingPageThemeId } from "@/types/rendering";

export const landingPageThemes: Record<LandingPageThemeId, LandingPageTheme> = {
  linear: {
    id: "linear",
    name: "Linear",
    colors: {
      accent: "hsl(54 58% 72%)",
      background: "hsl(40 20% 98%)",
      border: "hsl(34 14% 84%)",
      foreground: "hsl(24 10% 10%)",
      muted: "hsl(26 8% 42%)",
      primary: "hsl(24 10% 10%)",
      primaryForeground: "hsl(40 20% 98%)",
      surface: "hsl(0 0% 100%)",
    },
    radius: "0.5rem",
    typography: {
      body: "Inter, ui-sans-serif, system-ui",
      heading: "Inter, ui-sans-serif, system-ui",
    },
  },
  framer: {
    id: "framer",
    name: "Framer",
    colors: {
      accent: "hsl(196 85% 62%)",
      background: "hsl(0 0% 99%)",
      border: "hsl(220 13% 88%)",
      foreground: "hsl(222 24% 8%)",
      muted: "hsl(220 8% 45%)",
      primary: "hsl(222 24% 8%)",
      primaryForeground: "hsl(0 0% 99%)",
      surface: "hsl(0 0% 100%)",
    },
    radius: "0.375rem",
    typography: {
      body: "Inter, ui-sans-serif, system-ui",
      heading: "Inter, ui-sans-serif, system-ui",
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    colors: {
      accent: "hsl(160 84% 62%)",
      background: "hsl(225 22% 7%)",
      border: "hsl(225 14% 18%)",
      foreground: "hsl(210 22% 94%)",
      muted: "hsl(218 10% 67%)",
      primary: "hsl(160 84% 62%)",
      primaryForeground: "hsl(225 22% 7%)",
      surface: "hsl(225 18% 10%)",
    },
    radius: "0.625rem",
    typography: {
      body: "Inter, ui-sans-serif, system-ui",
      heading: "Inter, ui-sans-serif, system-ui",
    },
  },
};

export function getLandingPageTheme(themeId: LandingPageThemeId) {
  return landingPageThemes[themeId] ?? landingPageThemes.linear;
}
