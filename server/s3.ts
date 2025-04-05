"use server";

import { media, Media } from "@/lib/media";
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

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const S3_ENDPOINT = process.env.S3_ENDPOINT!;
const region = { singapore: "ap-southeast-1", jakarta: "ap-southeast-3" };

const s3 = new S3Client({
  region: region.jakarta,
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadFile({
  formData,
  name = ["file"],
  contentType = "all",
  Key = crypto.randomUUID(),
  ...props
}: Omit<PutObjectCommandInput, "Bucket" | "Key" | "Body" | "ContentType"> & {
  formData: FormData;
  name?: string[];
  contentType?: Media;
  Key?: string;
}): Promise<{ key: string; res: PutObjectCommandOutput }[]> {
  return await Promise.all(
    name.map(async (item) => {
      const file = formData.get(item) as File;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      return {
        key: Key,
        res: await s3.send(
          new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Body: fileBuffer,
            ContentType: media[contentType].type.join(", "),
            Key: Key,
            ...props,
          }),
        ),
      };
    }),
  );
}

export async function listFiles() {
  return await s3.send(new ListObjectsV2Command({ Bucket: S3_BUCKET_NAME }));
}

export async function deleteFile(key: string[]) {
  return Promise.all(
    key.map((item) =>
      s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET_NAME, Key: item })),
    ),
  );
}

export async function getFilePreSignedUrl(key: string) {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key }),
  );
}

export async function getFilePublicUrl(key: string) {
  return `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${key}`;
}

export async function getFileKeyFromPublicUrl(key: string) {
  return key.replace(`${S3_ENDPOINT}/${S3_BUCKET_NAME}/`, "");
}
