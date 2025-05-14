import { NextConfig } from "next";
import { media } from "./lib/media";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${Math.max(...Object.values(media).map(({ size }) => size.mb))}mb`,
    },
  },
};

export default nextConfig;
