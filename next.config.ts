import { NextConfig } from "next";
// import { fileMeta } from "./lib/const";

const nextConfig: NextConfig = {
  //   images: { remotePatterns: [new URL(`${process.env.S3_ENDPOINT}/**`)] },
  //   experimental: {
  //     serverActions: {
  //       bodySizeLimit: `${Math.max(...Object.values(fileMeta).map(({ size }) => size.mb))}mb`,
  //     },
  //   },
};

export default nextConfig;
