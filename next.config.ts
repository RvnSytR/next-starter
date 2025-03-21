import type { NextConfig } from "next";
import { maxFileSize } from "./lib/media";

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName)
  throw new Error("Environment variable S3_BUCKET_NAME is not set");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        pathname: "/*",
        hostname: `${bucketName}.s3.nevaobjects.id`,
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
