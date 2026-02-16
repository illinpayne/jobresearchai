import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: false,
  },
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ['tailwindcss'],
    // TODO: Check the size of average resume
    // serverActions: {
    //   bodySizeLimit: "5mb",
    // },
    mdxRs: false,
  },
  compress: true,
};

export default nextConfig;
