import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to enable API routes for video rendering
  serverExternalPackages: ['@remotion/renderer', '@remotion/cli'],
};

export default nextConfig;
