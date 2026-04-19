import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@remotion/renderer', '@remotion/cli'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
