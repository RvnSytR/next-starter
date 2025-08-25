import { FieldType } from "./meta";
import { formatDate, formatDateDistanceToNow } from "./utils";

export const actions = {
  created: "dibuat",
  removed: "dihapus",
  updated: "diperbarui",
  uploaded: "diunggah",

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
  loading: "Mohon tunggu sebentar...",
  error: "Terjadi kesalahan. Silakan coba lagi nanti.",
  notAuthorized: "Anda tidak memiliki izin untuk melakukan tindakan ini.",

  noChanges: (thing: string) => `Tidak ada perubahan pada ${thing} Anda.`,
  success: (
    thing: string,
    action: "created" | "updated" | "removed" | "uploaded",
  ) => `${thing} berhasil ${actions[action]}.`.trim(),

  thingAgo: (thing: string, time: Date) =>
    `${thing} ${formatDateDistanceToNow(time)} yang lalu.`,
  createdAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} yang lalu.`,

  // -- Validation
  invalid: (field: string) => `Masukkan ${field} yang valid.`,
  invalidType: (field: string, fieldType: FieldType) =>
    `${field} harus berupa ${fieldType} yang valid.`,

  required: (field: string) => `${field} wajib diisi.`,
  requiredInvalidType: (field: string, fieldType: FieldType) =>
    `${field} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  tooShort: (field: string, min: number, thing: string = "karakter") =>
    `${field} harus terdiri dari minimal ${min} ${thing}.`.trim(),
  tooLong: (field: string, max: number, thing: string = "karakter") =>
    `${field} tidak boleh melebihi ${max} ${thing}.`.trim(),
  outOfRange: (
    field: string,
    min: number,
    max: number,
    thing: string = "karakter",
  ) => `${field} harus antara ${min} hingga ${max} ${thing}.`.trim(),
};
