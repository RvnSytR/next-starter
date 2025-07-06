import { FileType } from "../const";

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
    placeholder: (fileType: FileType) =>
      `Drag & drop a ${fileType} here or click to upload`,
    size: (mb: number) => `Up to ${mb} MB`,
  },

  upload: (file: string = "", multiple: boolean = false) =>
    `Upload ${multiple ? `${file}'s` : file}`,

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

export const badgeText = {
  verifiedUser: "Verified",
};

export const tableText = {
  default: {
    placeholder: "Search Something",
    noResult: "No Result",
  },

  rowsPerPage: "Rows per page",
  rowSelecion: (selected: number, totalRows: number) =>
    `${selected} of ${totalRows} row(s) selected.`,
  pagenation: (pageNumber: number, totalPage: number) =>
    `Page ${pageNumber} of ${totalPage}`,
};

export const dialog = {
  user: {
    create: {
      trigger: "Create User",
      title: "Create New User",
      desc: "Create a new user by entering their details. Ensure all required fields are completed.",
    },

    changeRole: {
      trigger: "Change Role",
      title: (name: string) => `Change ${name}'s Role`,
      desc: (name: string) =>
        `Changing ${name}'s role will update their permissions and access within the system. Are you sure you want to proceed?`,
    },

    revokeSession: {
      trigger: "Terminate Sessions",
      title: (name: string) => `Terminate All Active Sessions for ${name}`,
      desc: (name: string) =>
        `This will immediately sign out all active sessions for ${name}. Are you sure you want to proceed?`,
    },

    remove: {
      title: (name: string) => `Remove ${name}'s Account`,
      desc: (name: string) =>
        `This will permanently delete ${name}'s account and all associated data. Proceed with caution as this action cannot be undone.`,
    },
  },

  profile: {
    removeAvatar: {
      title: "Remove Profile Avatar",
      desc: "This will remove your current profile avatar. Are you sure you want to proceed?",
    },

    revokeSession: {
      trigger: "Terminate Session",
      title: "Terminate Active Session",
      desc: "This will immediately sign out the selected device. Are you sure you want to proceed?",
    },

    revokeAllOtherSession: {
      trigger: "Terminate Other Sessions",
      title: "Terminate All Other Sessions",
      desc: "This will sign out all active sessions except the current one. Are you sure you want to proceed?",
    },

    deleteAccount: {
      trigger: "Delete Account",
      title: "Delete Your Account",
      desc: "Deleting your account will permanently remove all associated data. This action cannot be undone. Proceed with caution.",
    },
  },
};
