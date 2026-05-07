import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
  async rewrites() {
    return [
      {
        source: '/s3-storage/:path*',
        destination: 'http://localhost:9000/jrai-storage/:path*',
      },
    ];
  },
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ['tailwindcss'],
    serverActions: {
      bodySizeLimit: '1mb',
    },
    mdxRs: false,
  },
  compress: true,
};

export default nextConfig;
