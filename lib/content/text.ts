import { FileType } from "../const";
import { aOrAn } from "../utils";

export const baseText = {
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

  rowsPerPage: "Rows per page",
  rowSelection: (selected: number, totalRows: number) =>
    `${selected} of ${totalRows} row(s) ${baseText.selected}.`,
  pagenation: (pageNumber: number, totalPage: number) =>
    `Page ${pageNumber} of ${totalPage}`,
};

export const dialogText = {
  user: {
    create: {
      trigger: "Create User",
      title: "Create New User",
      desc: "Create a new user by entering their details. Ensure all required fields are completed.",
    },

    detail: {
      title: (name: string) => `${name}'s Details`,
      desc: (name: string) => `View detailed information for ${name}.`,
    },

    revokeSessions: {
      trigger: "Revoke Sessions",
      title: (name: string) => `Revoke All Active Sessions for ${name}`,
      desc: (name: string) =>
        `This will immediately sign out all active sessions for ${name}. Are you sure you want to proceed?`,
    },

    revokeMultipleSessions: {
      trigger: "Revoke Sessions",
      title: (length: number) => `Revoke Sessions for ${length} Users`,
      desc: (length: number) =>
        `This will immediately sign out all active sessions for ${length} selected users. Are you sure you want to proceed?`,
    },

    remove: {
      title: (name: string) => `Remove ${name}'s Account`,
      desc: (name: string) =>
        `This will permanently delete ${name}'s account and all associated data. Proceed with caution as this action cannot be undone.`,
    },

    removeMultiple: {
      title: (length: number) => `Remove ${length} Accounts`,
      desc: (length: number) =>
        `This will permanently delete ${length} selected user accounts and all associated data. Proceed with caution as this action cannot be undone.`,
    },
  },

  profile: {
    removeAvatar: {
      title: "Remove Profile Avatar",
      desc: "This will remove your current profile avatar. Are you sure you want to proceed?",
    },

    revokeSession: {
      trigger: "Revoke Session",
      title: "Revoke Active Session",
      desc: "This will immediately sign out the selected device. Are you sure you want to proceed?",
    },

    revokeAllOtherSession: {
      trigger: "Revoke Other Sessions",
      title: "Revoke All Other Sessions",
      desc: "This will sign out all active sessions except the current one. Are you sure you want to proceed?",
    },

    deleteAccount: {
      trigger: "Delete Account",
      title: "Delete Your Account",
      desc: "Deleting your account will permanently remove all associated data. Proceed with caution as this action cannot be undone.",
    },
  },
};
