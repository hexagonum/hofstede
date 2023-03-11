/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  basePath: isProd ? '/hofstede' : undefined,
  assetPrefix: isProd ? '/hofstede/' : undefined,
};

module.exports = nextConfig;
