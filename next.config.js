/** @type {import('next').NextConfig} */
/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  swcMinify: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  images: {
    domains: [
      '',
      'static.cdninstagram.com',
      'lh3.googleusercontent.com',
      'scontent-del1-2.cdninstagram.com',
      'projects.websetters.in',
      'firebasestorage.googleapis.com',
      'encrypted-tbn0.gstatic.com',
    ],
  },
});

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     ,
//   },
// };

// module.exports = nextConfig;
