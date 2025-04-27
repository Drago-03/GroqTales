/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  // Removed experimental.staticPageGenerationTimeout as it is not recognized in this version of Next.js
  // For handling timeouts in static page generation, consider using ISR or SSR for problematic pages
  // experimental: {
  //   staticPageGenerationTimeout: 180, // Set to 180 seconds (3 minutes)
  // },
  // Add metadataBase for production URLs
  async generateMetadata() {
    return {
      metadataBase: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    };
  },
};

module.exports = nextConfig;
