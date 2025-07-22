import {
  FileArchive,
  FileText,
  Headphones,
  Image,
  LucideIcon,
  Upload,
  Video,
} from "lucide-react";
import { toByte } from "../utils";
import { FileType } from "./other";

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
    mimeType: ["application/octet-stream"],
    extensions: [],
    size: { mb: 2, byte: toByte(2) },
    icon: Upload,
  },

  image: {
    mimeType: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
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

  archive: {
    mimeType: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
    ],
    extensions: [".zip", ".rar", ".7z", ".tar"],
    size: { mb: 20, byte: toByte(20) },
    icon: FileArchive,
  },

  audio: {
    mimeType: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
    extensions: [".mp3", ".wav", ".ogg", ".flac"],
    size: { mb: 10, byte: toByte(10) },
    icon: Headphones,
  },

  video: {
    mimeType: [
      "video/mp4",
      "video/x-msvideo",
      "video/x-matroska",
      "video/ogg",
      "video/webm",
    ],
    extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
    size: { mb: 50, byte: toByte(50) },
    icon: Video,
  },
};
