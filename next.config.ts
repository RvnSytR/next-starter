import { NextConfig } from "next";
import { mediaMetadata } from "./lib/const";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${Math.max(...Object.values(mediaMetadata).map(({ size }) => size.mb))}mb`,
    },
  },
};

export default nextConfig;
