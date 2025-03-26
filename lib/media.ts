import { formatToByte } from "./utils";

export type Media = "all" | "image" | "document";
// | "archive"
// | "audio"
// | "video";

export const maxFileSize: Record<Media, { mb: number; byte: number }> = {
  all: { mb: 2, byte: formatToByte(2) },
  image: { mb: 2, byte: formatToByte(2) },
  document: { mb: 2, byte: formatToByte(2) },
  // archive: { mb: 20, byte: formatToByte(20) },
  // audio: { mb: 10, byte: formatToByte(10) },
  // video: { mb: 10, byte: formatToByte(50) },
};

export const media: Record<Media, { type: string[]; extensions: string[] }> = {
  all: { type: ["*"], extensions: [] },

  image: {
    type: [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
      "image/webp",
    ],
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
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
  },

  // archive: {
  //   type: [
  //     "application/zip",
  //     "application/x-zip-compressed",
  //     "application/x-rar-compressed",
  //     "application/x-7z-compressed",
  //   ],
  //   extensions: [".zip", ".rar", ".7z"],
  // },

  // audio: {
  //   type: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/x-flac"],
  //   extensions: [".mp3", ".wav", ".ogg", ".flac"],
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
  // },
};
