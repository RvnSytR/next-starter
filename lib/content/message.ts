import { FieldType, FileType, mediaMeta } from "../const";
import { aOrAn, capitalize } from "../utils";

type Action = "created" | "updated" | "removed";

const defaultMessage = {
  loading: "Processing your request...",
  error: "Uh-oh! Something went wrong. Please try again later.",
  success: (thing: string, action: Action) =>
    `${thing} has been ${action}.`.trim(),

  tooShort: (field: string, min: number) =>
    `${field} must be at least ${min} characters long.`,
  tooLong: (field: string, max: number) =>
    `${field} must be at most ${max} characters long.`,
  outOfRange: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max} characters.`,

  invalidEmail: "Please enter a valid email address.",
  invalidURL: "Please enter a valid URL.",
  invalidPhone: "Please enter a valid phone number.",
  invalidField: (field: string, fieldType: FieldType) =>
    `${field} must be a valid ${fieldType}.`,
  requiredAndInvalidField: (field: string, fieldType: FieldType) =>
    `${field} is required and must be a valid ${fieldType}.`,

  fileRequired: (file: FileType = "file", multiple: boolean = false) =>
    `Please upload ${multiple ? "one or more" : aOrAn(file)} ${file}.`,
  fileTooLarge: (file: FileType = "file", maxSizeMB: number) =>
    `${capitalize(file)} size must not exceed ${maxSizeMB} MB.`,
  invalidFileType: (file: FileType = "file", withAccepted: boolean = false) =>
    `Invalid ${file} type. ${withAccepted ? "Accepted types: " + mediaMeta[file].extensions.join(", ") : ""}`.trim(),

  noChanges: (thing: string) => `No changes were made to ${thing}.`,
  mustSelectOne: (field: string) => `Please select one ${field}.`,
  invalidSelection: (field: string) => `Invalid selection for ${field}.`,

  duplicate: (thing: string) => `This ${thing} already exists.`,
  conflict: (thing: string) => `Conflict detected with existing ${thing}.`,
  deleteForbidden: (thing: string, x: string) =>
    `This ${thing} cannot be deleted because it is currently assigned to ${x}.`,
};

export const message = {
  ...defaultMessage,

  user: {
    success: (thing: string, action: Action) =>
      `Your ${defaultMessage.success(thing, action)}`,
    noChanges: (thing: string) => `Your ${defaultMessage.noChanges(thing)}`,

    signIn: (name?: string) =>
      `Signed in successfully${name ? `, welcome ${name}!` : "!"}`,
    signUp: "Your account has been registered! Please sign in to continue.",
    signOut: "Signed out successfully.",

    confirmPassword: "Passwords do'nt match.",
    agreement:
      "Please accept the Terms of Service and Privacy Policy to proceed.",

    notAuthorized: "You do not have permission to perform this action.",
    changeRole: (name: string, role: string) =>
      `${name}'s role has been updated to ${role}.`,

    revokeThisSession: "This sessions has been terminated.",
    revokeOtherSessions: "Your other active sessions has been terminated.",
    revokeUserSession: (name?: string) =>
      `All ${name} active sessions has been terminated.`,
  },
};
