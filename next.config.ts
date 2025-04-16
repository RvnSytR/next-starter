import { NextConfig } from "next";
import { maxFileSize } from "./lib/media";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${Math.max(...Object.values(maxFileSize).map(({ mb }) => mb))}mb`,
    },
  },
};

export default nextConfig;
