/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable trailing slash for cleaner URLs
  trailingSlash: false,
  // Enable experimental features for better Netlify support
  experimental: {
    // Allow Netlify to handle routing
    skipMiddlewareUrlNormalize: true,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
};

module.exports = nextConfig;
