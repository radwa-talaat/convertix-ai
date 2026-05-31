export const cacheDurations = {
  analyticsReport: 30,
  landingPage: 60,
  publicAssets: 31_536_000,
  sitemap: 300,
} as const;

export function createCacheControl(seconds: number) {
  return `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`;
}
