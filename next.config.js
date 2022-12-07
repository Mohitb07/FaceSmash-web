/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['static.cdninstagram.com', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
