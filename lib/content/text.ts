import { DateRange } from "react-day-picker";
import { FileType, mediaMeta } from "../const";
import { formatDate, getFileTypeLabel } from "../utils";

export const buttonText = {
  signIn: "Masuk",
  signOn: (social: string) => `Lanjutkan dengan ${social}`,
  signOut: "Keluar",
  signUp: "Buat Akun",

  upload: (file: string = "", multiple: boolean = false) =>
    `Unggah ${multiple ? `${file}s` : file}`,

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
  placeholder: "Cari sesuatu...",
  noResult: "Tidak ada hasil",

  rowsPerPage: "Baris per halaman",
  rowSelection: (selected: number, totalRows: number) =>
    `${selected} dari ${totalRows} baris ${commonText.selected}.`,
  pagenation: (pageNumber: number, totalPage: number) =>
    `Halaman ${pageNumber} dari ${totalPage}`,

  column: {
    num: "No",
    createdAt: "Dibuat Pada",
  },
};

export const getFileInputMetaAndText = (fileType: FileType) => {
  const meta = mediaMeta[fileType];
  const label = getFileTypeLabel(fileType);
  return {
    meta,
    text: {
      add: `Tambah ${label}`,
      total: (length: number) => `Total ${label} : ${length}`,
      placeholder: (multiple: boolean = false) =>
        `Seret & lepaskan ${multiple ? "satu atau lebih" : ""} ${label} di sini atau klik untuk mengunggah`,
      size: (mb: number) => `Hingga ${mb} MB`,
    },
  };
};
