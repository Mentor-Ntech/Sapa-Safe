/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable trailing slash for cleaner URLs
  trailingSlash: false,
  // Enable static export for Netlify
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Allow Netlify to handle routing
  skipMiddlewareUrlNormalize: true,
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
};

module.exports = nextConfig;
