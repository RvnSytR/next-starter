import { Action, actionMeta, FieldType, fileMeta, FileType } from "../const";
import { formatDate, formatDateDistanceToNow } from "../utils";

export const messages = {
  loading: "Mohon tunggu sebentar...",
  error: "Terjadi kesalahan. Silakan coba lagi nanti.",
  success: (thing: string, action: Action) =>
    `${thing} berhasil ${actionMeta[action].displayName}.`.trim(),

  thingAgo: (thing: string, time: Date) =>
    `${thing} ${formatDateDistanceToNow(time)} yang lalu.`,
  createdAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} yang lalu.`,

  browserOnOS: (browser: string | undefined, os: string | undefined) =>
    `${browser ?? "Browser tidak diketahui"} di ${os ?? "sistem operasi yang tidak diketahui"}`,
  tooManyRequest: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",

  invalid: {
    email: "Alamat email tidak valid.",
    text: "Masukkan teks yang valid.",
    number: "Masukkan angka yang valid.",
    phone: "Masukkan nomor telepon yang valid.",
    color: "Kode warna tidak valid.",
    URL: "URL tidak valid.",
    time: "Masukkan waktu yang valid.",
    date: "Masukkan tanggal yang valid.",
    dateMultiple: "Beberapa tanggal yang dimasukkan tidak valid.",
    dateRange: {
      field: "Pilih rentang tanggal yang valid.",
      from: "Pilih tanggal mulai yang valid.",
      to: "Pilih tanggal akhir yang valid.",
    },

    ageRange: (min: number, max: number) =>
      `Usia harus antara ${min} hingga ${max} tahun.`,

    fileType: (fileType: FileType = "file", withAccepted: boolean = false) =>
      `Tipe ${fileMeta[fileType].displayName} tidak valid.${
        withAccepted
          ? " Format yang didukung: " + fileMeta[fileType].extensions.join(", ")
          : ""
      }`.trim(),

    selection: (field: string) => `Pilihan untuk ${field} tidak valid.`,
  },

  tooShort: (field: string, min: number) =>
    `${field} harus terdiri dari minimal ${min} karakter.`,
  tooLong: (field: string, max: number) =>
    `${field} tidak boleh melebihi ${max} karakter.`,
  outOfRange: (field: string, min: number, max: number) =>
    `${field} harus antara ${min} hingga ${max} karakter.`,

  invalidField: (field: string, fieldType: FieldType) =>
    `${field} harus berupa ${fieldType} yang valid.`,
  requiredAndInvalidField: (field: string, fieldType: FieldType) =>
    `${field} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  fileRequired: (fileType: FileType = "file", multiple: boolean = false) =>
    `Unggah ${multiple ? "satu atau lebih" : ""} ${fileMeta[fileType].displayName}.`,
  fileTooLarge: (fileType: FileType = "file", maxSizeMB: number) =>
    `Ukuran ${fileMeta[fileType].displayName} tidak boleh melebihi ${maxSizeMB} MB.`,

  noChanges: (thing: string) => `Tidak ada perubahan pada ${thing} Anda.`,
  mustSelectOne: (field: string) => `Pilih salah satu ${field}.`,

  duplicate: (thing: string) => `${thing} ini sudah tersedia.`,
  conflict: (thing: string) =>
    `Terjadi konflik dengan ${thing} yang sudah ada.`,
  deleteForbidden: (thing: string, x: string) =>
    `${thing} ini tidak dapat dihapus karena sedang digunakan oleh ${x}.`,
};
