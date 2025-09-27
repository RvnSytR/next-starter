import { DataType } from "./meta";
import { capitalize, formatDate, formatDateDistanceToNow } from "./utils";

export const actions = {
  // created: "dibuat",
  // removed: "dihapus",
  // updated: "diperbarui",
  // uploaded: "diunggah",

  action: "Tindakan",
  add: "Tambah",
  back: "Kembali",
  cancel: "Batal",
  clear: "Bersihkan",
  confirm: "Konfirmasi",
  filter: "Filter",
  refresh: "Muat Ulang",
  remove: "Hapus",
  reset: "Atur Ulang",
  save: "Simpan",
  update: "Simpan Perubahan",
  upload: "Unggah",
  view: "Lihat",
};

export const messages = {
  empty: "Tidak ada hasil yang ditemukan.",
  loading: "Mohon tunggu sebentar...",

  error: "Terjadi kesalahan. Silakan coba lagi nanti.",
  notAuthorized: "Anda tidak memiliki izin untuk melakukan tindakan ini.",

  noChanges: (thing: string) =>
    `Tidak ada perubahan pada ${thing.toLowerCase()}.`,

  thingAgo: (thing: string, time: Date) =>
    `${capitalize(thing, "first")} ${formatDateDistanceToNow(time)} yang lalu.`,
  dateAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} yang lalu.`,

  // -- Validation
  invalid: (field: string) => `Masukkan ${field.toLowerCase()} yang valid.`,
  invalidType: (field: string, fieldType: DataType) =>
    `${capitalize(field, "first")} harus berupa ${fieldType} yang valid.`,

  required: (field: string) => `${capitalize(field, "first")} wajib diisi.`,
  requiredInvalidType: (field: string, fieldType: DataType) =>
    `${capitalize(field, "first")} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  stringLength: (field: string, min: number) =>
    `${capitalize(field, "first")} harus terdiri dari ${min} karakter.`,
  stringTooShort: (field: string, min: number) =>
    `${capitalize(field, "first")} harus terdiri dari minimal ${min} karakter.`,
  stringTooLong: (field: string, max: number) =>
    `${capitalize(field, "first")} tidak boleh melebihi ${max} karakter.`,

  numberTooSmall: (field: string, min: number) =>
    `${capitalize(field, "first")} tidak boleh kurang dari ${min}.`,
  numberTooLarge: (field: string, max: number) =>
    `${capitalize(field, "first")} tidak boleh lebih dari ${max}.`,

  outOfRange: (
    field: string,
    min: number,
    max: number,
    thing: string = "karakter",
  ) =>
    `${capitalize(field, "first")} harus antara ${min} hingga ${max} ${thing}.`.trim(),
};
