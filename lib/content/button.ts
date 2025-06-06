export const buttonText = {
  signOn: (social: string) => `Continue with ${social}`,
  signIn: {
    text: "Sign In",
    loading: "Signing in...",
  },
  signUp: {
    text: "Create Account",
    loading: "Creating account...",
  },
  signOut: {
    text: "Sign Out",
    loading: "Signing out...",
  },

  datePicker: "Pick a Date",
  fileInput: {
    placeholder: "Drag & drop a file here, or click to upload",
    size: (mb: number) => `Up to ${mb} MB`,
  },

  save: {
    text: "Save Changes",
    loading: "Saving changes...",
  },
  refresh: {
    text: "Refresh",
    loading: "Refreshing...",
  },
  upload: {
    text: (file: string = "") => `Upload ${file}`,
    loading: "Uploading...",
  },
  remove: {
    text: "Remove",
    loading: "Removing...",
  },

  confirm: "Confirm",
  reset: "Reset",
  cancel: "Cancel",
  back: "Back",
};
