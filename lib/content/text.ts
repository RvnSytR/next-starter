import { FileType } from "../const";
import { aOrAn } from "../utils";

export const commonText = {
  more: "more",
  selected: "selected",
  verified: "verified",
};

export const buttonText = {
  signIn: "Sign In",
  signOn: (social: string) => `Continue with ${social}`,
  signOut: "Sign Out",
  signUp: "Create Account",

  datePicker: {
    multiple: "Select Dates",
    range: "Select Date Range",
    single: "Select Date",
  },

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
