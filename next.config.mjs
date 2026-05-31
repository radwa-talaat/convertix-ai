const imageHosts = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_SUPABASE_URL,
]
  .map((value) => {
    if (!value) return null;

    try {
      return new URL(value).hostname;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

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

export default nextConfig;
