/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['static.cdninstagram.com'],
  },
};

module.exports = nextConfig;
