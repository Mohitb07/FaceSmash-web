/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['','static.cdninstagram.com', 'lh3.googleusercontent.com', 'scontent-del1-2.cdninstagram.com', 'projects.websetters.in', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
