/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add metadataBase for production URLs
  async generateMetadata() {
    // Use environment variable in production or fallback for development
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://groqtales.app';
    
    return {
      metadataBase: new URL(baseUrl),
    };
  },
};

module.exports = nextConfig;
