import { FieldType, FileCategory } from "../const";

export const toastMessage = {
  loading: "Processing your request...",
  error: "Uh-oh! Something went wrong. Please try again later.",

  success: (thing: string, action: "created" | "updated" | "removed") =>
    `${thing} has been ${action}.`.trim(),
  successTo: (
    thing: string,
    action: "created" | "updated" | "removed" | "terminated",
    x: string = "Your",
  ) => `${x} ${thing} has been ${action}.`.trim(),

  noChanges: (thing: string) => `No changes were made to ${thing}.`,
  noChangesTo: (thing: string, x: string = "your") =>
    `No changes were made to ${x} ${thing}.`,

  deleteForbidden: (thing: string, x: string) =>
    `This ${thing} cannot be deleted because it is currently assigned to a ${x}.`,

  user: {
    signIn: (name?: string) =>
      `Signed in successfully${name ? `, welcome ${name}!` : "!"}`,
    signUp: "Your account has been registered! Please sign in to continue.",
    signOut: "Signed out successfully.",
    changeRole: (name: string, role: string) =>
      `${name}'s role has been updated to ${role}.`,
    revokeSession: (name?: string) =>
      `All${name ? " " + name : ""} active sessions has been terminated.`,
  },
};

export const zodMessage = {
  required: (thing: string) => `${thing} is required.`,
  cannotEmpty: (thing: string) => `${thing} can't be empty.`,
  atleastOne: (thing: string) => `At least one ${thing} is required.`,

  toShort: (thing: string, total: number) =>
    `${thing} must be at least ${total} characters long.`,
  toLong: (thing: string, total: number) =>
    `${thing} is too long. Maximum ${total} characters allowed.`,

  invalidType: (thing: string, type: FieldType = "string") =>
    `${thing} must be a valid ${type} value.`,
  invalidFileType: (file: Omit<FileCategory, "all"> | "file" = "file") =>
    `Invalid ${file} type.`,

  email: "Please enter a valid email address.",
  confirmPassword: "Passwords do'nt match.",
  agreement: "You must agree to the Terms of Service and Privacy Policy.",
};
