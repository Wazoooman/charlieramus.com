import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray package-lock.json in the
  // user's home dir made Next infer the wrong root (multiple-lockfiles warning);
  // this keeps module resolution + filesystem watching scoped to the app.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Cloudflare Pages edge runtime cannot run sharp, so the /_next/image
    // optimization endpoint fails. Images are already WebP, so serving them
    // directly is equivalent and faster (straight from Cloudflare CDN cache).
    unoptimized: true,
  },
};

export default nextConfig;
