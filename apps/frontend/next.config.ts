import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
      },
    ],
    dangerouslyAllowSVG: false,
  },
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ["tailwindcss"],
    serverActions: {
      bodySizeLimit: "1mb",
    },
    mdxRs: false,
  },
  compress: true,
};

export default nextConfig;
