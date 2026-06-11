import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Pages edge runtime cannot run sharp, so the /_next/image
    // optimization endpoint fails. Images are already WebP, so serving them
    // directly is equivalent and faster (straight from Cloudflare CDN cache).
    unoptimized: true,
  },
};

export default nextConfig;
