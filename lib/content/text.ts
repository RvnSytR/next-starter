import { fileMeta, FileType } from "../const";

export const buttonText = {
  signIn: "Masuk",
  signOn: (social: string) => `Lanjutkan dengan ${social}`,
  signOut: "Keluar",
  signUp: "Buat Akun",

  upload: (thing: string = "") => `Unggah ${thing}`,

  action: "Tindakan",
  back: "Kembali",
  cancel: "Batal",
  clear: "Bersihkan",
  confirm: "Konfirmasi",
  filter: "Filter",
  refresh: "Muat Ulang",
  remove: "Hapus",
  reset: "Atur Ulang",
  save: "Simpan Perubahan",
  view: "Lihat",
};

export const commonText = {
  selected: "dipilih",
  verified: "terverifikasi",
};

export const tableText = {
  placeholder: "Cari...",
  noResult: "Tidak ada hasil yang ditemukan",

  rowsPerPage: "Baris per halaman",
  rowSelection: (selected: number, totalRows: number) =>
    `${selected} dari ${totalRows} baris ${commonText.selected}.`,
  pagination: (pageNumber: number, totalPage: number) =>
    `Halaman ${pageNumber} dari ${totalPage}`,

  column: {
    num: "No",
    createdAt: "Tanggal Dibuat",
  },
};

export const getFileInputMetaAndText = (fileType: FileType) => {
  const meta = fileMeta[fileType];
  return {
    meta,
    text: {
      add: `Tambah ${meta.displayName}`,
      total: (length: number) => `Total ${meta.displayName}: ${length}`,
      placeholder: `Seret dan lepaskan ${meta.displayName} di sini, atau klik untuk mengunggah`,
      size: (mb: number) => `Maksimal ${mb} MB`,
    },
  };
};
