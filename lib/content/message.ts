import { FieldType, FileCategory } from "../const";

export const toastMessage = {
  default: {
    loading: "Processing your request...",
    error: "Uh-oh! Something went wrong. Please try again later.",
    success: (
      thing: string,
      action: "created" | "updated" | "removed" | "terminated",
      target: string = "Your",
    ) => `${target} ${thing} has been ${action} successfully.`.trim(),
  },

  noChanges: (thing: string, target: string = "your") =>
    `No changes were made to ${target} ${thing}.`,

  user: {
    signIn: (name?: string) =>
      `Signed in successfully${name ? `, Welcome ${name}!` : "!"}`,
    signUp:
      "Your account has been registered successfully! Please sign in to continue.",
    signOut: "Signed out successfully.",
    changeRole: (name: string, role: string) =>
      `${name}'s role has been successfully updated to ${role}!`,
    revokeSession: (name: string) =>
      `All ${name}'s sessions have been terminated successfully.`,
  },
};

export const zodMessage = {
  required: (thing: string) => `${thing} is required.`,

  invalidType: (thing: string, type: FieldType = "string") =>
    `${thing} must be a valid ${type} value.`,

  invalidFileType: (file: Omit<FileCategory, "all"> | "file") =>
    `Invalid ${file} type.`,

  cannotEmpty: (thing: string) => `${thing} cannot be empty.`,

  toShort: (thing: string, total: number) =>
    `${thing} must be at least ${total} characters long.`,

  toLong: (thing: string, total: number) =>
    `${thing} is too long. Maximum ${total} characters allowed.`,

  atleastOne: (thing: string) => `At least one ${thing} is required.`,

  email: "Please enter a valid email address.",
  confirmPassword: "Passwords do not match.",
  agreement: "You must agree to the Terms of Service and Privacy Policy.",
};
