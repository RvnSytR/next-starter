"use server";

import { FileType, mediaMeta } from "@/lib/const";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.S3_BUCKET_NAME!;
const endpoint = process.env.S3_ENDPOINT!;
const region = { singapore: "ap-southeast-1", jakarta: "ap-southeast-3" };

const s3 = new S3Client({
  endpoint,
  region: region.jakarta,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadFiles({
  files,
  contentType,
  ...props
}: Omit<PutObjectCommandInput, "Key" | "Bucket" | "Body" | "ContentType"> & {
  files: File[] | { key: string; file: File }[];
  contentType: FileType;
}): Promise<{ key: string; res: PutObjectCommandOutput }[]> {
  return Promise.all(
    files.map(async (item) => {
      let key: string;
      let file: File;

      if ("key" in item && "file" in item) {
        key = item.key;
        file = item.file;
      } else {
        key = item.name;
        file = item;
      }

      const command = new PutObjectCommand({
        Key: key,
        Bucket: bucket,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: mediaMeta[contentType].mimeType.join(", "),
        ...props,
      });

      return { key, res: await s3.send(command) };
    }),
  );
}

export async function listFiles() {
  return await s3.send(new ListObjectsV2Command({ Bucket: bucket }));
}

export async function getFileSignedUrl(key: string) {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
}

export async function getFilePublicUrl(key: string) {
  return `${endpoint}/${bucket}/${key}`;
}

export async function getFileKeyFromPublicUrl(key: string) {
  return key.replace(`${endpoint}/${bucket}/`, "");
}

export async function deleteFile(key: string[]) {
  return Promise.all(
    key.map((item) =>
      s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: item })),
    ),
  );
}
