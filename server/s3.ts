"use server";

import { FileCategory, mediaMetadata } from "@/lib/const";
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
  names,
  nameAskey = false,
  contentType = "all",
  ...props
}: Omit<PutObjectCommandInput, "Key" | "Bucket" | "Body" | "ContentType"> & {
  formData: FormData;
  names: string[];
  nameAskey?: boolean;
  contentType?: FileCategory;
}): Promise<{ key: string; res: PutObjectCommandOutput }[]> {
  return await Promise.all(
    names.map(async (name) => {
      const file = formData.get(name) as File;
      const key = nameAskey ? name : file.name;
      return {
        key: key,
        res: await s3.send(
          new PutObjectCommand({
            Key: key,
            Bucket: S3_BUCKET_NAME,
            Body: Buffer.from(await file.arrayBuffer()),
            ContentType: mediaMetadata[contentType].type.join(", "),
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
