import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET_EVENT_THUMBNAIL = "event.thumbnail.images";
export const PUBLIC_BASE_URL = process.env.MINIO_SERVER_URL!;

export const s3 = new S3Client({
  endpoint: process.env.MINIO_SERVER_URL,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});
