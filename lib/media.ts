import { toByte } from "./utils";

export type Media = "all" | "image" | "document";
// | "archive"
// | "audio"
// | "video";

export const media: Record<
  Media,
  { type: string[]; extensions: string[]; size: { mb: number; byte: number } }
> = {
  all: {
    type: ["*"],
    extensions: [],
    size: { mb: 2, byte: toByte(2) },
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
  },

  document: {
    type: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
    size: { mb: 2, byte: toByte(2) },
  },

  // archive: {
  //   type: [
  //     "application/zip",
  //     "application/x-zip-compressed",
  //     "application/x-rar-compressed",
  //     "application/x-7z-compressed",
  //   ],
  //   extensions: [".zip", ".rar", ".7z"],
  //   size: { mb: 20, byte: toByte(20) },
  // },

  // audio: {
  //   type: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/x-flac"],
  //   extensions: [".mp3", ".wav", ".ogg", ".flac"],
  //   size: { mb: 10, byte: toByte(10) },
  // },

  // video: {
  //   type: [
  //     "video/mp4",
  //     "video/x-msvideo",
  //     "video/x-matroska",
  //     "video/ogg",
  //     "video/webm",
  //   ],
  //   extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
  //   size: { mb: 50, byte: toByte(50) },
  // },
};
