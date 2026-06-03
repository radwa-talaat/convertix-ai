import createNextIntlPlugin from "next-intl/plugin";

const imageHosts = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
]
  .map((value) => {
    if (!value) return null;

    try {
      const normalized = /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;

      return new URL(normalized).hostname;
    } catch {
      return null;
    }
  })
  .filter((value, index, values) => value && values.indexOf(value) === index);

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: imageHosts.map((hostname) => ({
      hostname,
      protocol: "https",
    })),
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
