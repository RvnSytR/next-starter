import { DateRange } from "react-day-picker";
import { FileType } from "../const";
import { aOrAn, formatDate } from "../utils";

export const commonText = {
  selected: "selected",
  verified: "verified",
};

export const datePickerText = {
  single: {
    trigger: "Select Date",
    value: (date: Date) => formatDate(date, "PPPP"),
  },
  multiple: {
    trigger: "Select Dates",
    value: (dates: Date[]) => {
      const maxDisplay = 2;
      const formattedDates = dates.map((date) => formatDate(date, "PPP"));
      if (dates.length <= maxDisplay) return formattedDates.join(", ");
      return `${formattedDates.slice(0, maxDisplay).join(", ")} +${dates.length - maxDisplay} more`;
    },
  },
  range: {
    trigger: "Select Date Range",
    value: (dateRange: DateRange) => {
      const { from, to } = dateRange;
      if (from && to)
        return `${formatDate(from, "PPP")} - ${formatDate(to, "PPP")}`;
      if (from) return formatDate(from, "PPP");
      return "Select Date Range";
    },
  },
};

export const buttonText = {
  signIn: "Sign In",
  signOn: (social: string) => `Continue with ${social}`,
  signOut: "Sign Out",
  signUp: "Create Account",

  fileInput: {
    placeholder: (fileType: FileType, multiple: boolean = false) =>
      `Drag & drop ${multiple ? `${fileType}s` : `${aOrAn(fileType)} ${fileType}`} here or click to upload`,
    size: (mb: number) => `Up to ${mb} MB`,
  },

  upload: (file: string = "", multiple: boolean = false) =>
    `Upload ${multiple ? `${file}s` : file}`,

  action: "Action",
  back: "Back",
  cancel: "Cancel",
  clear: "Clear",
  confirm: "Confirm",
  filter: "Filter",
  refresh: "Refresh",
  remove: "Remove",
  reset: "Reset",
  save: "Save Changes",
  view: "View",
};

export const tableText = {
  default: {
    placeholder: "Search something...",
    noResult: "No Result",
  },

  column: {
    num: "No",
    createdAt: "Created At",
  },

  rowsPerPage: "Rows per page",
  rowSelection: (selected: number, totalRows: number) =>
    `${selected} of ${totalRows} row(s) ${commonText.selected}.`,
  pagenation: (pageNumber: number, totalPage: number) =>
    `Page ${pageNumber} of ${totalPage}`,
};
