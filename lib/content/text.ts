import { DateRange } from "react-day-picker";
import { fileMeta, FileType } from "../const";
import { formatDate } from "../utils";

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

export const datePickerText = {
  single: {
    trigger: "Pilih Tanggal",
    value: (date: Date) => formatDate(date, "PPPP"),
  },
  multiple: {
    trigger: "Pilih Tanggal",
    value: (dates: Date[]) => {
      const maxDisplay = 2;
      const formattedDates = dates.map((date) => formatDate(date, "PPP"));
      if (dates.length <= maxDisplay) return formattedDates.join(", ");
      return `${formattedDates.slice(0, maxDisplay).join(", ")} +${dates.length - maxDisplay} lainnya`;
    },
  },
  range: {
    trigger: "Pilih Rentang Tanggal",
    value: (dateRange: DateRange) => {
      const { from, to } = dateRange;
      if (from && to)
        return `${formatDate(from, "PPP")} - ${formatDate(to, "PPP")}`;
      if (from) return formatDate(from, "PPP");
      return "Pilih Rentang Tanggal";
    },
  },
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
