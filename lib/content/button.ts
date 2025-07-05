import { FileType } from "../const";

export const buttonText = {
  signOn: (social: string) => `Continue with ${social}`,
  signIn: "Sign In",
  signUp: "Create Account",
  signOut: "Sign Out",

  datePicker: {
    single: "Select Date",
    multiple: "Select Dates",
    range: "Select Date Range",
  },

  fileInput: {
    placeholder: (fileType: FileType) =>
      `Drag & drop a ${fileType} here or click to upload`,
    size: (mb: number) => `Up to ${mb} MB`,
  },

  save: "Save Changes",
  refresh: "Refresh",
  remove: "Remove",
  upload: (file: string = "", multiple: boolean = false) =>
    `Upload ${multiple ? `${file}'s` : file}`,

  confirm: "Confirm",
  reset: "Reset",
  clear: "Clear",
  cancel: "Cancel",
  back: "Back",
};
