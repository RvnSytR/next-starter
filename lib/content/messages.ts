import { Action, FieldType, FileType, mediaMeta } from "../const";
import {
  formatDate,
  formatDateDistanceToNow,
  getActionLabel,
  getFileTypeLabel,
} from "../utils";

export const messages = {
  loading: "Tunggu sebentar...",
  error: "Uh—oh! Terjadi kesalahan. Silakan coba lagi nanti.",
  success: (thing: string, action: Action) =>
    `${thing} berhasil ${getActionLabel(action)}.`.trim(),

  thingAgo: (thing: string, time: Date) =>
    `${thing} ${formatDateDistanceToNow(time)} yang lalu.`,
  createdAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} yang lalu.`,

  browserOnOS: (browser: string | undefined, os: string | undefined) =>
    `${browser ?? "Sebuah browser"} di ${os ?? "sistem operasi yang tidak diketahui"}`,
  tooManyRequest: "Terlalu banyak permintaan. Silakan coba lagi nanti.",

  invalid: {
    email: "Alamat email tidak valid.",
    text: "Silakan masukkan teks yang valid.",
    number: "Silakan masukkan angka yang valid.",
    color: "Kode warna tidak valid.",
    phone: "Silakan masukkan nomor telepon yang valid.",
    URL: "URL tidak valid.",
    time: "Silakan masukkan waktu yang valid.",
    date: "Silakan masukkan tanggal yang valid.",
    dateMultiple: "Beberapa tanggal yang dimasukkan tidak valid.",
    dateRange: {
      field: "Silakan pilih rentang tanggal yang valid.",
      from: "Silakan pilih tanggal mulai yang valid.",
      to: "Silakan pilih tanggal akhir yang valid.",
    },

    ageRange: (min: number, max: number) =>
      `Usia harus antara ${min} dan ${max}.`,

    fileType: (fileType: FileType = "file", withAccepted: boolean = false) =>
      `Tipe ${getFileTypeLabel(fileType)} tidak valid. ${
        withAccepted
          ? "Tipe yang diterima: " + mediaMeta[fileType].extensions.join(", ")
          : ""
      }`.trim(),

    selection: (field: string) => `Pilihan untuk ${field} tidak valid.`,
  },

  tooShort: (field: string, min: number) =>
    `${field} harus terdiri dari minimal ${min} karakter.`,
  tooLong: (field: string, max: number) =>
    `${field} tidak boleh lebih dari ${max} karakter.`,
  outOfRange: (field: string, min: number, max: number) =>
    `${field} harus antara ${min} dan ${max} karakter.`,

  invalidField: (field: string, fieldType: FieldType) =>
    `${field} harus berupa ${fieldType} yang valid.`,
  requiredAndInvalidField: (field: string, fieldType: FieldType) =>
    `${field} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  fileRequired: (fileType: FileType = "file", multiple: boolean = false) =>
    `Silakan unggah ${multiple ? "satu atau lebih" : ""} ${getFileTypeLabel(fileType)}.`,
  fileTooLarge: (fileType: FileType = "file", maxSizeMB: number) =>
    `Ukuran ${getFileTypeLabel(fileType)} harus kurang dari ${maxSizeMB} MB.`,

  noChanges: (thing: string) => `Tidak ada perubahan pada ${thing} Anda.`,
  mustSelectOne: (field: string) => `Silakan pilih satu ${field}.`,

  duplicate: (thing: string) => `${thing} ini sudah ada.`,
  conflict: (thing: string) =>
    `Terdapat konflik dengan ${thing} yang sudah ada.`,
  deleteForbidden: (thing: string, x: string) =>
    `${thing} ini tidak dapat dihapus karena saat ini digunakan oleh ${x}.`,
};
