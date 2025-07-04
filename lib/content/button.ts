export const buttonText = {
  signOn: (social: string) => `Continue with ${social}`,
  signIn: "Sign In",
  signUp: "Create Account",
  signOut: "Sign Out",

  datePicker: "Pick a Date",
  fileInput: {
    placeholder: "Drag & drop a file here, or click to upload",
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
