import { FileText, Image, LucideIcon, Upload } from "lucide-react";
import { toByte } from "../utils";

export type FieldType =
  | "string"
  | "boolean"
  | "number"
  | "date"
  | "array"
  | "object";

export type FileCategory = "all" | "image" | "document";
//   | "archive"
//   | "audio"
//   | "video";

type MediaProps = Record<
  FileCategory,
  {
    type: string[];
    extensions: string[];
    size: { mb: number; byte: number };
    icon: LucideIcon;
  }
>;

export const mediaMetadata: MediaProps = {
  all: {
    type: ["*"],
    extensions: [],
    size: { mb: 2, byte: toByte(2) },
    icon: Upload,
  },

  image: {
    type: [
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
    type: [
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
  //   type: ["zip", "archive"],
  //   extensions: [".zip", ".rar", ".7z"],
  //   size: { mb: 20, byte: toByte(20) },
  //   icon: FileArchive,
  // },

  // audio: {
  //   type: ["audio/"],
  //   extensions: [".mp3", ".wav", ".ogg", ".flac"],
  //   size: { mb: 10, byte: toByte(10) },
  //   icon: Headphones,
  // },

  // video: {
  //   type: ["video/"],
  //   extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
  //   size: { mb: 50, byte: toByte(50) },
  //   icon: Video,
  // },
};
