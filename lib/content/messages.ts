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
    email: "Masukkan alamat email yang valid.",
    color: "Masukkan kode warna yang valid.",
    URL: "Masukkan URL yang valid.",

    date: "Masukkan tanggal yang valid.",
    dateMultiple: "Beberapa tanggal yang dimasukkan tidak valid.",
    dateRange: {
      field: "Pilih rentang tanggal yang valid.",
      from: "Pilih tanggal mulai yang valid.",
      to: "Pilih tanggal akhir yang valid.",
    },

    ageRange: (min: number, max: number) =>
      `Usia harus antara ${min} hingga ${max} tahun.`,

    selection: (field: string) => `Pilihan untuk ${field} tidak valid.`,
  },

  file: {
    type: (fileType: FileType = "file") =>
      `Tipe ${fileMeta[fileType].displayName} tidak valid.`,
    tooLarge: (fileType: FileType = "file", maxSizeMB: string | number) =>
      `Ukuran ${fileMeta[fileType].displayName} tidak boleh melebihi ${maxSizeMB} MB.`,
    tooShort: (
      fileType: FileType = "file",
      options?: { multiple?: boolean; min?: number },
    ) => {
      const multiple = options?.multiple ?? false;
      const min = options?.min ?? 1;
      return `Silakan unggah minimal ${multiple ? `${min} atau lebih` : min} ${fileMeta[fileType].displayName}.`;
    },
    tooLong: (fileType: FileType = "file", max: number) =>
      `Jumlah maksimum ${fileMeta[fileType].displayName} yang dapat diunggah adalah ${max}.`,
  },

  tooShort: (field: string, min: number, thing: string = "karakter") =>
    `${field} harus terdiri dari minimal ${min} ${thing}.`,
  tooLong: (field: string, max: number, thing: string = "karakter") =>
    `${field} tidak boleh melebihi ${max} ${thing}.`,
  outOfRange: (
    field: string,
    min: number,
    max: number,
    thing: string = "karakter",
  ) => `${field} harus antara ${min} hingga ${max} ${thing}.`,

  invalidField: (field: string, fieldType: FieldType) =>
    `${field} harus berupa ${fieldType} yang valid.`,
  requiredAndInvalidField: (field: string, fieldType: FieldType) =>
    `${field} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  noChanges: (thing: string) => `Tidak ada perubahan pada ${thing} Anda.`,
  mustSelectOne: (field: string) => `Pilih salah satu ${field}.`,

  duplicate: (thing: string) => `${thing} ini sudah tersedia.`,
  conflict: (thing: string) =>
    `Terjadi konflik dengan ${thing} yang sudah ada.`,
  deleteForbidden: (thing: string, x: string) =>
    `${thing} ini tidak dapat dihapus karena sedang digunakan oleh ${x}.`,
};
