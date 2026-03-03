import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: false,
  },
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ["tailwindcss"],
    serverActions: {
      bodySizeLimit: "3mb",
    },
    mdxRs: false,
  },
  compress: true,
};

export default nextConfig;
