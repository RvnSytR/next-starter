import { NextConfig } from "next";
// import { mediaMeta } from "./lib/const";

const nextConfig: NextConfig = {
  //   images: { remotePatterns: [new URL(`${process.env.S3_ENDPOINT}/**`)] },
  //   experimental: {
  //     serverActions: {
  //       bodySizeLimit: `${Math.max(...Object.values(mediaMeta).map(({ size }) => size.mb))}mb`,
  //     },
  //   },
};

export default nextConfig;
