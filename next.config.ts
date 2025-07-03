import { NextConfig } from "next";
import { mediaMeta } from "./lib/const";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${Math.max(...Object.values(mediaMeta).map(({ size }) => size.mb))}mb`,
    },
  },
};

export default nextConfig;
