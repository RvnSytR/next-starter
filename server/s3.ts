"use server";

import { env } from "@/lib/env";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = env.S3_BUCKET_NAME;
const region = { singapore: "ap-southeast-1", jakarta: "ap-southeast-3" };

const s3 = new S3Client({
  region: region.jakarta,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export async function getFilePreSignedUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return await getSignedUrl(s3, command);
}

export async function uploadFile(
  formData: FormData,
  name?: string,
  options?: { contentType?: string },
) {
  const file = formData.get(name ?? "file") as File;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const key = crypto.randomUUID();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: options?.contentType ?? "image/*",
  });

  const res = await s3.send(command);
  return { key: key, res: res };
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  return await s3.send(command);
}
