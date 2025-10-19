import {
  FileArchive,
  FileText,
  Headphones,
  Image,
  LucideIcon,
  Upload,
  Video,
} from "lucide-react";
import { toBytes } from "../utils";

export type FileType =
  | "file"
  | "image"
  | "document"
  | "archive"
  | "audio"
  | "video";

type FileMetaProps = Record<
  FileType,
  {
    displayName: string;
    mimeTypes: string[];
    extensions: string[];
    size: { mb: number; bytes: number };
    icon: LucideIcon;
  }
>;

const meta: Omit<FileMetaProps, "file"> = {
  image: {
    displayName: "gambar",
    mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    size: { mb: 2, bytes: toBytes(2) },
    icon: Image,
  },

  document: {
    displayName: "dokumen",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
    size: { mb: 2, bytes: toBytes(2) },
    icon: FileText,
  },

  archive: {
    displayName: "arsip",
    mimeTypes: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
    ],
    extensions: [".zip", ".rar", ".7z", ".tar"],
    size: { mb: 20, bytes: toBytes(20) },
    icon: FileArchive,
  },

  audio: {
    displayName: "audio",
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
    extensions: [".mp3", ".wav", ".ogg", ".flac"],
    size: { mb: 10, bytes: toBytes(10) },
    icon: Headphones,
  },

  video: {
    displayName: "video",
    mimeTypes: [
      "video/mp4",
      "video/x-msvideo",
      "video/x-matroska",
      "video/ogg",
      "video/webm",
    ],
    extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
    size: { mb: 50, bytes: toBytes(50) },
    icon: Video,
  },
};

const maxFileSize = Math.max(...Object.values(meta).map(({ size }) => size.mb));
export const fileMeta: FileMetaProps = {
  file: {
    displayName: "berkas",
    mimeTypes: Object.values(meta).flatMap((item) => item.mimeTypes),
    extensions: Object.values(meta).flatMap((item) => item.extensions),
    size: { mb: maxFileSize, bytes: toBytes(maxFileSize) },
    icon: Upload,
  },

  ...meta,
};
