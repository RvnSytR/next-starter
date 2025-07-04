import { FileText, Image, LucideIcon, Upload } from "lucide-react";
import { toByte } from "../utils";

export type FieldType =
  | "string"
  | "boolean"
  | "number"
  | "date"
  | "array"
  | "object";

export type FileType = "file" | "image" | "document";
//   | "archive"
//   | "audio"
//   | "video";

type MediaProps = Record<
  FileType,
  {
    mimeType: string[];
    extensions: string[];
    size: { mb: number; byte: number };
    icon: LucideIcon;
  }
>;

export const mediaMeta: MediaProps = {
  file: {
    mimeType: ["*"],
    extensions: [],
    size: { mb: 2, byte: toByte(2) },
    icon: Upload,
  },

  image: {
    mimeType: [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
      "image/webp",
    ],
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    size: { mb: 2, byte: toByte(2) },
    icon: Image,
  },

  document: {
    mimeType: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
    size: { mb: 2, byte: toByte(2) },
    icon: FileText,
  },

  // archive: {
  //   mimeType: ["zip", "archive"],
  //   extensions: [".zip", ".rar", ".7z"],
  //   size: { mb: 20, byte: toByte(20) },
  //   icon: FileArchive,
  // },

  // audio: {
  //   mimeType: ["audio/"],
  //   extensions: [".mp3", ".wav", ".ogg", ".flac"],
  //   size: { mb: 10, byte: toByte(10) },
  //   icon: Headphones,
  // },

  // video: {
  //   mimeType: ["video/"],
  //   extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
  //   size: { mb: 50, byte: toByte(50) },
  //   icon: Video,
  // },
};
