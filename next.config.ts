import type { NextConfig } from "next";
import { maxFileSize } from "./lib/media";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        pathname: "/*",
        hostname: `${process.env.S3_BUCKET_NAME}.s3.nevaobjects.id`,
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: `${Math.max(...Object.values(maxFileSize).map(({ mb }) => mb))}mb`,
    },
  },
};

export default nextConfig;
