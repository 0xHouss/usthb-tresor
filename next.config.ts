import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      // Must exceed the 25 MB upload cap (MAX_FILE_SIZE) plus form overhead.
      bodySizeLimit: '30mb'
    }
  }
};

export default withNextIntl(nextConfig);
